import 'server-only';
import { supabaseAdmin } from '@/lib/supabase';
import { decryptWalletWatchData } from '@/lib/bitcoin/walletEncryption';
import { syncDetectedWallet } from '@/lib/bitcoin/blockchainClient';
import { recordWalletBalanceSnapshot } from '@/lib/bitcoin/walletSnapshots';
import { parseAndValidateWalletInput, type SupportedDerivationScheme } from '@/lib/bitcoin/watchWallet';

const DERIVATION_SCHEMES: SupportedDerivationScheme[] = ['bip44', 'bip49', 'bip84', 'bip86'];

interface WalletSyncRecord {
  id: string;
  userId: string;
  format: string;
  encryptedWatchData: string;
}

export async function syncWalletRecord(wallet: WalletSyncRecord) {
  let parsedWallet;
  try {
    const scheme = DERIVATION_SCHEMES.includes(wallet.format as SupportedDerivationScheme)
      ? wallet.format as SupportedDerivationScheme
      : undefined;
    parsedWallet = parseAndValidateWalletInput(
      decryptWalletWatchData(wallet.encryptedWatchData),
      scheme,
    );
  } catch {
    throw new Error('Stored watch-only wallet data could not be decoded or validated.');
  }

  let result;
  try {
    result = await syncDetectedWallet(parsedWallet);
  } catch {
    throw new Error('The blockchain data provider could not complete synchronization.');
  }

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
    .eq('user_id', wallet.userId);
  if (walletError) throw new Error('Wallet balance update failed.');

  if (result.transactions.length) {
    const { error: transactionError } = await supabaseAdmin
      .from('dca_wallet_transactions')
      .upsert(result.transactions.map((transaction) => ({
        wallet_id: wallet.id,
        user_id: wallet.userId,
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

  try {
    await recordWalletBalanceSnapshot({
      walletId: wallet.id,
      userId: wallet.userId,
      balanceSats: result.balanceSats,
    });
  } catch {
    throw new Error('Wallet balance snapshot could not be recorded.');
  }

  return result;
}
