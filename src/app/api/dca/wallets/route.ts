import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { attachSessionRefresh, requireStudent } from '@/lib/session';
import { parseAndValidateWalletInput, type SupportedDerivationScheme } from '@/lib/bitcoin/watchWallet';
import { syncDetectedWallet } from '@/lib/bitcoin/blockchainClient';
import { decryptWalletWatchData, encryptWalletWatchData } from '@/lib/bitcoin/walletEncryption';

type WalletRow = Record<string, unknown> & {
  id: string;
  label: string;
  wallet_type: 'address' | 'xpub' | 'descriptor';
  format: string;
  balance_sats: number;
  unconfirmed_balance_sats: number;
  sync_status: 'idle' | 'syncing' | 'synced' | 'error';
  sync_error: string | null;
  last_synced_at: string | null;
  created_at: string;
};

function publicWallet(wallet: WalletRow) {
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
      ? String(wallet._display_identifier ?? '')
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

export async function GET(request: NextRequest) {
  const session = requireStudent(request);
  if (!session) {
    return NextResponse.json({ error: 'Sign in to view your connected watch-only wallets.' }, { status: 401 });
  }

  try {
    // 1. Fetch wallets
    const { data: wallets, error: walletsError } = await supabaseAdmin
      .from('dca_wallets')
      .select('id, label, wallet_type, format, watch_data_encrypted, balance_sats, unconfirmed_balance_sats, sync_status, sync_error, last_synced_at, created_at')
      .eq('user_id', session.userId)
      .order('created_at', { ascending: false });

    if (walletsError) {
      console.error('Error fetching wallets:', walletsError);
      return responseWithSession({ error: 'Failed to load wallets.' }, 500, session);
    }

    // 2. Fetch recent transactions across these wallets
    const [{ data: transactions, error: txsError }, { data: snapshots, error: snapshotsError }] = await Promise.all([
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

    if (txsError || snapshotsError) {
      console.error('Error fetching wallet portfolio history:', txsError ?? snapshotsError);
      return responseWithSession({ error: 'Failed to load wallet transactions.' }, 500, session);
    }

    return responseWithSession({
      wallets: (wallets ?? []).map((wallet) => {
        let displayIdentifier = '';
        if (wallet.wallet_type === 'address') {
          try {
            displayIdentifier = decryptWalletWatchData(String(wallet.watch_data_encrypted));
          } catch (error) {
            console.error('Unable to decrypt a stored Bitcoin address:', error);
            throw new Error('Unable to load a connected wallet address.');
          }
        }
        return publicWallet({ ...wallet, _display_identifier: displayIdentifier } as WalletRow);
      }),
      transactions: transactions ?? [],
      snapshots: snapshots ?? [],
    }, 200, session);
  } catch (err) {
    console.error('Failed to load DCA wallets:', err);
    return responseWithSession({ error: 'Unexpected error loading wallets.' }, 500, session);
  }
}

export async function POST(request: NextRequest) {
  const session = requireStudent(request);
  if (!session) {
    return NextResponse.json({ error: 'Sign in to connect a watch-only Bitcoin wallet.' }, { status: 401 });
  }

  try {
    const body = (await request.json().catch(() => null)) as {
      label?: string;
      watchData?: string;
      scheme?: SupportedDerivationScheme;
    } | null;

    if (!body || typeof body.label !== 'string' || typeof body.watchData !== 'string') {
      return responseWithSession({ error: 'Please provide a wallet label and a valid Bitcoin address or account-level extended public key.' }, 400, session);
    }
    if (body.watchData.length > 2000) {
      return responseWithSession({ error: 'Wallet address or public key is too long.' }, 400, session);
    }

    const trimmedLabel = body.label.trim();
    if (trimmedLabel.length < 1 || trimmedLabel.length > 100) {
      return responseWithSession({ error: 'Wallet label must be between 1 and 100 characters.' }, 400, session);
    }

    // Parse and validate input (rejects private keys / seed phrases)
    let parsedWallet;
    try {
      parsedWallet = parseAndValidateWalletInput(body.watchData, body.scheme);
    } catch (parseErr: unknown) {
      const err = parseErr as Error;
      return responseWithSession({ error: err.message }, 400, session);
    }

    // Encryption configuration is required before accepting any watch-only key material.
    let encryptedWatchData: string;
    try {
      encryptedWatchData = encryptWalletWatchData(parsedWallet.normalizedData);
    } catch (error) {
      console.error('Wallet encryption is unavailable:', error);
      return responseWithSession({ error: 'Watch-only wallet storage is not configured. Contact the site administrator.' }, 503, session);
    }

    // Compare decrypted values; randomized authenticated encryption cannot be queried by equality.
    const { data: existingWallets, error: existingError } = await supabaseAdmin
      .from('dca_wallets')
      .select('id, label, format, wallet_type, watch_data_encrypted')
      .eq('user_id', session.userId)
      .limit(1000);

    if (existingError) {
      console.error('Failed to check for duplicate DCA wallets:', existingError);
      return responseWithSession({ error: 'Unable to verify whether this wallet is already connected.' }, 500, session);
    }

    try {
      const newAddresses = new Set(parsedWallet.addressesToWatch);
      for (const wallet of existingWallets ?? []) {
        const existingData = decryptWalletWatchData(String(wallet.watch_data_encrypted));
        if (existingData === parsedWallet.normalizedData) {
          return responseWithSession({ error: `This wallet address/key is already connected as "${wallet.label}".` }, 409, session);
        }
        const existingParsed = parseAndValidateWalletInput(
          existingData,
          ['bip44', 'bip49', 'bip84', 'bip86'].includes(String(wallet.format))
            ? wallet.format as SupportedDerivationScheme
            : undefined,
        );
        if (existingParsed.addressesToWatch.some((address) => newAddresses.has(address))) {
          return responseWithSession({ error: `This wallet overlaps with "${wallet.label}". Connect each address only once.` }, 409, session);
        }
      }
    } catch (error) {
      console.error('Unable to verify existing encrypted DCA wallet data:', error);
      return responseWithSession({ error: 'Unable to verify existing wallet records. Contact the site administrator.' }, 500, session);
    }

    // Initial sync from blockchain
    let syncResult;
    let syncStatus: 'synced' | 'error' = 'synced';
    let syncError: string | null = null;
    let initialSyncSucceeded = true;
    const now = new Date().toISOString();

    try {
      syncResult = await syncDetectedWallet(parsedWallet);
    } catch {
      console.error(`Initial blockchain sync failed for student ${session.userId}.`);
      initialSyncSucceeded = false;
      syncStatus = 'error';
      syncError = 'Initial blockchain sync failed. Use Refresh to retry; no balance has been verified yet.';
      syncResult = { balanceSats: 0, unconfirmedBalanceSats: 0, transactions: [] };
    }

    // Insert wallet
    const { data: newWallet, error: insertError } = await supabaseAdmin
      .from('dca_wallets')
      .insert({
        user_id: session.userId,
        label: trimmedLabel,
        wallet_type: parsedWallet.type,
        format: parsedWallet.format,
        watch_data_encrypted: encryptedWatchData,
        derivation_path: parsedWallet.derivationPath ?? null,
        balance_sats: syncResult.balanceSats,
        unconfirmed_balance_sats: syncResult.unconfirmedBalanceSats,
        sync_status: syncStatus,
        sync_error: syncError,
        last_synced_at: syncStatus === 'synced' ? now : null,
      })
      .select('*')
      .single();

    if (insertError || !newWallet) {
      console.error('Failed to create wallet:', insertError);
      return responseWithSession({ error: 'Failed to save wallet in database.' }, 500, session);
    }

    // Insert transactions
    if (syncResult.transactions.length > 0) {
      const txRows = syncResult.transactions.map((tx) => ({
        wallet_id: newWallet.id,
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

      const { error: txInsertError } = await supabaseAdmin
        .from('dca_wallet_transactions')
        .upsert(txRows, { onConflict: 'wallet_id,txid' });
      if (txInsertError) {
        console.error('Failed to save initial wallet transactions:', txInsertError);
        syncStatus = 'error';
        syncError = 'Balance synced, but transaction history could not be saved. Use Refresh to retry.';
        const { error: statusError } = await supabaseAdmin
          .from('dca_wallets')
          .update({ sync_status: syncStatus, sync_error: syncError })
          .eq('id', newWallet.id)
          .eq('user_id', session.userId);
        if (statusError) {
          console.error('Failed to record the initial wallet transaction error:', statusError);
          return responseWithSession({
            error: 'Wallet was created, but its transaction sync status could not be saved. Reload DCA and retry synchronization.',
          }, 500, session);
        }
      }
    }

    // Record snapshot
    let snapshotRecord: { wallet_id: string; balance_sats: number; recorded_at: string } | null = null;
    if (initialSyncSucceeded) {
      const { data: snapshot, error: snapshotError } = await supabaseAdmin
        .from('dca_wallet_balance_snapshots')
        .insert({
          wallet_id: newWallet.id,
          user_id: session.userId,
          balance_sats: syncResult.balanceSats,
        })
        .select('wallet_id, balance_sats, recorded_at')
        .single();
      if (snapshotError) {
        console.error('Failed to save initial wallet balance snapshot:', snapshotError);
        syncStatus = 'error';
        syncError = 'Wallet data synced, but the history snapshot could not be saved. Use Refresh to retry.';
        const { error: statusError } = await supabaseAdmin
          .from('dca_wallets')
          .update({ sync_status: syncStatus, sync_error: syncError })
          .eq('id', newWallet.id)
          .eq('user_id', session.userId);
        if (statusError) {
          console.error('Failed to record the wallet snapshot error:', statusError);
          return responseWithSession({
            error: 'Wallet was created, but its synchronization status could not be saved. Reload DCA and retry.',
          }, 500, session);
        }
      } else {
        snapshotRecord = snapshot;
      }
    }

    return responseWithSession({
      wallet: publicWallet({
        ...newWallet,
        sync_status: syncStatus,
        sync_error: syncError,
        _display_identifier: parsedWallet.type === 'address' ? parsedWallet.normalizedData : '',
      } as WalletRow),
      transactions: syncResult.transactions.map((transaction) => ({
        ...transaction,
        id: transaction.txid,
        wallet_id: newWallet.id,
      })),
      snapshots: snapshotRecord ? [snapshotRecord] : [],
      message: syncStatus === 'error'
        ? syncError
        : 'Watch-only wallet connected and synchronized successfully.',
    }, 201, session);
  } catch (err) {
    console.error('POST /api/dca/wallets error:', err);
    return responseWithSession({ error: 'Internal server error connecting wallet.' }, 500, session);
  }
}
