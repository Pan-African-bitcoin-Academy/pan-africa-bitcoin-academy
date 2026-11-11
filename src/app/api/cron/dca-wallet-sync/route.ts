import { timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { decryptWalletWatchData } from '@/lib/bitcoin/walletEncryption';
import { syncDetectedWallet } from '@/lib/bitcoin/blockchainClient';
import { recordWalletBalanceSnapshot } from '@/lib/bitcoin/walletSnapshots';
import { parseAndValidateWalletInput, type SupportedDerivationScheme } from '@/lib/bitcoin/watchWallet';

const DERIVATION_SCHEMES: SupportedDerivationScheme[] = ['bip44', 'bip49', 'bip84', 'bip86'];
const MAX_WALLETS_PER_RUN = 10;

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  const authorization = request.headers.get('authorization') ?? '';
  if (!secret || !authorization.startsWith('Bearer ')) return false;
  const supplied = Buffer.from(authorization.slice('Bearer '.length));
  const expected = Buffer.from(secret);
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

export async function GET(request: NextRequest) {
  if (!process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Scheduled wallet synchronization is not configured.' }, { status: 503 });
  }
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { data: wallets, error: walletsError } = await supabaseAdmin
    .from('dca_wallets')
    .select('id, user_id, format, watch_data_encrypted')
    .order('updated_at', { ascending: true })
    .limit(MAX_WALLETS_PER_RUN);

  if (walletsError) {
    console.error('Scheduled wallet sync could not load wallet records:', walletsError);
    return NextResponse.json({ error: 'Could not load wallets for synchronization.' }, { status: 500 });
  }

  let synced = 0;
  let failed = 0;
  for (const wallet of wallets ?? []) {
    try {
      const scheme = DERIVATION_SCHEMES.includes(wallet.format as SupportedDerivationScheme)
        ? wallet.format as SupportedDerivationScheme
        : undefined;
      const watchData = decryptWalletWatchData(wallet.watch_data_encrypted);
      const parsed = parseAndValidateWalletInput(watchData, scheme);
      const result = await syncDetectedWallet(parsed);
      const syncedAt = new Date().toISOString();

      const { error: walletError } = await supabaseAdmin
        .from('dca_wallets')
        .update({
          balance_sats: result.balanceSats,
          unconfirmed_balance_sats: result.unconfirmedBalanceSats,
          sync_status: 'synced',
          sync_error: null,
          last_synced_at: syncedAt,
          updated_at: syncedAt,
        })
        .eq('id', wallet.id)
        .eq('user_id', wallet.user_id);
      if (walletError) throw new Error('Wallet balance update failed.');

      if (result.transactions.length) {
        const { error: transactionError } = await supabaseAdmin
          .from('dca_wallet_transactions')
          .upsert(result.transactions.map((transaction) => ({
            wallet_id: wallet.id,
            user_id: wallet.user_id,
            txid: transaction.txid,
            tx_type: transaction.txType,
            amount_sats: transaction.amountSats,
            fee_sats: transaction.feeSats,
            confirmed: transaction.confirmed,
            confirmations: transaction.confirmations,
            block_height: transaction.blockHeight,
            block_time: transaction.blockTime,
          })), { onConflict: 'wallet_id,txid' });
        if (transactionError) throw new Error('Wallet transaction update failed.');
      }

      await recordWalletBalanceSnapshot({
        walletId: wallet.id,
        userId: wallet.user_id,
        balanceSats: result.balanceSats,
      });
      synced += 1;
    } catch (error) {
      console.error(`Scheduled wallet synchronization failed for wallet ${wallet.id}:`, error);
      const { error: updateError } = await supabaseAdmin
        .from('dca_wallets')
        .update({
          sync_status: 'error',
          sync_error: 'Scheduled synchronization failed. Check the last saved balance and retry later.',
          updated_at: new Date().toISOString(),
        })
        .eq('id', wallet.id)
        .eq('user_id', wallet.user_id);
      if (updateError) {
        console.error(`Could not record synchronization failure for wallet ${wallet.id}.`);
      }
      failed += 1;
    }
  }

  return NextResponse.json({
    processed: (wallets ?? []).length,
    synced,
    failed,
  });
}
