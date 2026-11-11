import 'server-only';
import { supabaseAdmin } from '@/lib/supabase';

const SNAPSHOT_INTERVAL_MS = 24 * 60 * 60 * 1000;

export async function recordWalletBalanceSnapshot({
  walletId,
  userId,
  balanceSats,
}: {
  walletId: string;
  userId: string;
  balanceSats: number;
}) {
  const { data: latestSnapshot, error: latestError } = await supabaseAdmin
    .from('dca_wallet_balance_snapshots')
    .select('balance_sats, recorded_at')
    .eq('wallet_id', walletId)
    .eq('user_id', userId)
    .order('recorded_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latestError) throw new Error('Unable to check the latest wallet balance snapshot.');

  if (
    latestSnapshot &&
    Number(latestSnapshot.balance_sats) === balanceSats &&
    Date.now() - new Date(latestSnapshot.recorded_at).getTime() < SNAPSHOT_INTERVAL_MS
  ) {
    return null;
  }

  const { data: snapshot, error: snapshotError } = await supabaseAdmin
    .from('dca_wallet_balance_snapshots')
    .insert({
      wallet_id: walletId,
      user_id: userId,
      balance_sats: balanceSats,
    })
    .select('wallet_id, balance_sats, recorded_at')
    .single();

  if (snapshotError || !snapshot) {
    throw new Error('Unable to save the wallet balance snapshot.');
  }
  return snapshot;
}
