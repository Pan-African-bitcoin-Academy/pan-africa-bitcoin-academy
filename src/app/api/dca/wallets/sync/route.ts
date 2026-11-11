import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { attachSessionRefresh, requireStudent } from '@/lib/session';
import { parseAndValidateWalletInput } from '@/lib/bitcoin/watchWallet';
import { syncDetectedWallet } from '@/lib/bitcoin/blockchainClient';
import { decryptWalletWatchData } from '@/lib/bitcoin/walletEncryption';
import { recordWalletBalanceSnapshot } from '@/lib/bitcoin/walletSnapshots';

const DERIVATION_SCHEMES = ['bip44', 'bip49', 'bip84', 'bip86'] as const;

function isDerivationScheme(value: string) {
  return DERIVATION_SCHEMES.includes(value as (typeof DERIVATION_SCHEMES)[number]);
}

function publicWallet(wallet: Record<string, unknown>) {
  return {
    id: wallet.id,
    label: wallet.label,
    wallet_type: wallet.wallet_type,
    format: wallet.format,
    balance_sats: wallet.balance_sats,
    unconfirmed_balance_sats: wallet.unconfirmed_balance_sats,
    sync_status: wallet.sync_status,
    sync_error: wallet.sync_error,
    last_synced_at: wallet.last_synced_at,
    created_at: wallet.created_at,
    display_identifier: wallet.wallet_type === 'address'
      ? String(wallet.display_identifier ?? '')
      : `${wallet.wallet_type === 'xpub' ? 'Extended public key' : 'Output descriptor'} (hidden)`,
  };
}

function responseWithSession(
  body: object,
  status: number,
  session: NonNullable<ReturnType<typeof requireStudent>>,
) {
  const response = NextResponse.json(body, { status });
  attachSessionRefresh(response, {
    userId: session.userId,
    email: session.email,
    userType: 'student',
    issuedAt: session.issuedAt,
    lastActive: Date.now(),
  });
  return response;
}

export async function POST(request: NextRequest) {
  const session = requireStudent(request);
  if (!session) {
    return NextResponse.json({ error: 'Sign in to sync wallets.' }, { status: 401 });
  }

  try {
    const body = (await request.json().catch(() => ({}))) as { walletId?: string };
    const walletId = body.walletId;

    let query = supabaseAdmin
      .from('dca_wallets')
      .select('*')
      .eq('user_id', session.userId);

    if (walletId) {
      query = query.eq('id', walletId);
    }

    const { data: wallets, error: walletsError } = await query;
    if (walletsError || !wallets || wallets.length === 0) {
      return responseWithSession({ error: 'No wallets found to synchronize.' }, 404, session);
    }

    for (const wallet of wallets) {
      try {
        // Derive/determine addresses to check
        const watchData = decryptWalletWatchData(wallet.watch_data_encrypted);
        const parsed = parseAndValidateWalletInput(
          watchData,
          isDerivationScheme(wallet.format) ? wallet.format : undefined,
        );
        const syncResult = await syncDetectedWallet(parsed);

        const { error: updateErr } = await supabaseAdmin
          .from('dca_wallets')
          .update({
            balance_sats: syncResult.balanceSats,
            unconfirmed_balance_sats: syncResult.unconfirmedBalanceSats,
            sync_status: 'synced',
            sync_error: null,
            last_synced_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', wallet.id)
          .eq('user_id', session.userId);
        if (updateErr) throw new Error('Unable to save the updated wallet balance.');

        // Upsert transactions
        if (syncResult.transactions.length > 0) {
          const txRows = syncResult.transactions.map((tx) => ({
            wallet_id: wallet.id,
            user_id: session.userId,
            txid: tx.txid,
            tx_type: tx.txType,
            amount_sats: tx.amountSats,
            fee_sats: tx.feeSats,
            confirmed: tx.confirmed,
            confirmations: tx.confirmations,
            block_height: tx.blockHeight,
            block_time: tx.blockTime,
          }));

          const { error: txError } = await supabaseAdmin
            .from('dca_wallet_transactions')
            .upsert(txRows, { onConflict: 'wallet_id,txid' });
          if (txError) throw new Error('Unable to save wallet transaction history.');
        }

        await recordWalletBalanceSnapshot({
          walletId: wallet.id,
          userId: session.userId,
          balanceSats: syncResult.balanceSats,
        });
      } catch (error) {
        console.error(`Error syncing wallet ${wallet.id}:`, error);
        const { error: statusError } = await supabaseAdmin
          .from('dca_wallets')
          .update({
            sync_status: 'error',
            sync_error: 'Synchronization did not complete successfully. Balance or history may be partially updated; use Refresh to retry.',
            updated_at: new Date().toISOString(),
          })
          .eq('id', wallet.id)
          .eq('user_id', session.userId);
        if (statusError) console.error(`Could not record synchronization failure for wallet ${wallet.id}.`);
      }
    }

    const [
      { data: refreshedWallets, error: refreshError },
      { data: transactions, error: txError },
      { data: snapshots, error: snapshotsError },
    ] = await Promise.all([
      supabaseAdmin
        .from('dca_wallets')
        .select('id, label, wallet_type, format, watch_data_encrypted, balance_sats, unconfirmed_balance_sats, sync_status, sync_error, last_synced_at, created_at')
        .eq('user_id', session.userId)
        .in('id', wallets.map((wallet) => wallet.id)),
      supabaseAdmin
        .from('dca_wallet_transactions')
        .select('id, wallet_id, txid, tx_type, amount_sats, fee_sats, confirmed, confirmations, block_height, block_time')
        .eq('user_id', session.userId)
        .order('block_time', { ascending: false })
        .limit(100),
      supabaseAdmin
        .from('dca_wallet_balance_snapshots')
        .select('wallet_id, balance_sats, recorded_at')
        .eq('user_id', session.userId)
        .gte('recorded_at', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString())
        .order('recorded_at', { ascending: false })
        .limit(2000),
    ]);

    if (refreshError || txError || snapshotsError) {
      console.error('Failed to load synchronized wallet records:', refreshError ?? txError ?? snapshotsError);
      return responseWithSession({ error: 'Wallets synchronized, but updated records could not be loaded.' }, 500, session);
    }

    const safeWallets = (refreshedWallets ?? []).map((wallet) => {
      let displayIdentifier = '';
      if (wallet.wallet_type === 'address') {
        try {
          displayIdentifier = decryptWalletWatchData(wallet.watch_data_encrypted);
        } catch (error) {
          console.error('Unable to decrypt a stored Bitcoin address:', error);
          throw new Error('Unable to load a connected wallet address.');
        }
      }
      return publicWallet({ ...wallet, display_identifier: displayIdentifier });
    });

    return responseWithSession({
      success: true,
      updatedWallets: safeWallets,
      transactions: transactions ?? [],
      snapshots: snapshots ?? [],
      syncedCount: safeWallets.filter((wallet) => wallet.sync_status === 'synced').length,
      message: `Synchronized ${safeWallets.filter((wallet) => wallet.sync_status === 'synced').length} of ${safeWallets.length} wallet(s).`,
    }, 200, session);
  } catch (err) {
    console.error('POST /api/dca/wallets/sync error:', err);
    return responseWithSession({ error: 'Internal synchronization error.' }, 500, session);
  }
}
