'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  Wallet,
  RefreshCw,
  Trash2,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { PricePoint } from '@/app/dca/dca-calculations';

export interface WalletRecord {
  id: string;
  label: string;
  wallet_type: 'address' | 'xpub' | 'descriptor';
  format: string;
  display_identifier: string;
  balance_sats: number;
  unconfirmed_balance_sats: number;
  sync_status: 'idle' | 'syncing' | 'synced' | 'error';
  sync_error: string | null;
  last_synced_at: string | null;
  created_at: string;
}

export interface WalletTxRecord {
  id: string;
  wallet_id: string;
  txid: string;
  tx_type: 'incoming' | 'outgoing';
  amount_sats: number;
  fee_sats: number | null;
  confirmed: boolean;
  confirmations: number;
  block_height: number | null;
  block_time: string | null;
}

export interface WalletSnapshotRecord {
  wallet_id: string;
  balance_sats: number;
  recorded_at: string;
}

export interface ManualPortfolioRecord {
  purchaseDate: string;
  btcReceived: number;
  isInWallet: boolean;
  walletTransferDate: string | null;
}

interface WalletDashboardProps {
  wallets: WalletRecord[];
  transactions: WalletTxRecord[];
  snapshots: WalletSnapshotRecord[];
  manualRecords: ManualPortfolioRecord[];
  priceHistory: PricePoint[];
  error?: string;
  currentPriceBtc: number | null;
  dcaPortfolioBtc: number; // from manual DCA entries
  separateManualBtc: number;
  linkedManualBtc: number;
  onWalletRemoved: (walletId: string) => void;
  onWalletsRefreshed: (
    updatedWallets: WalletRecord[],
    transactions: WalletTxRecord[],
    snapshots: WalletSnapshotRecord[],
  ) => void;
  onConnectWallet: () => void;
}

const SATS_PER_BTC = 100_000_000;

function formatSats(sats: number): string {
  return sats.toLocaleString('en-US');
}

function formatBtc(sats: number): string {
  const btc = sats / SATS_PER_BTC;
  if (btc >= 0.001) return btc.toFixed(6);
  if (btc >= 0.0001) return btc.toFixed(7);
  return btc.toFixed(8);
}

function formatCurrencyUsd(amount: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

function formatRelativeTime(isoDate: string): string {
  try {
    const diff = Date.now() - new Date(isoDate).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  } catch {
    return 'unknown';
  }
}

function formatTxDate(isoDate: string | null): string {
  if (!isoDate) return 'Unconfirmed';
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(isoDate));
  } catch {
    return 'Unknown date';
  }
}

function truncateTxid(txid: string): string {
  if (txid.length <= 16) return txid;
  return `${txid.slice(0, 8)}…${txid.slice(-8)}`;
}

function WalletFormatBadge({ format }: { format: string }) {
  const labels: Record<string, string> = {
    p2pkh: 'Legacy',
    p2sh: 'P2SH',
    p2wpkh: 'SegWit',
    p2wsh: 'P2WSH',
    p2tr: 'Taproot',
    bip44: 'BIP44',
    bip49: 'BIP49',
    bip84: 'BIP84',
    bip86: 'BIP86 Taproot',
    descriptor: 'Descriptor',
    unknown: 'Address',
  };
  return (
    <span className="inline-flex items-center rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] font-semibold text-zinc-600">
      {labels[format] ?? format}
    </span>
  );
}

function SyncStatusBadge({ status, error }: { status: WalletRecord['sync_status']; error: string | null }) {
  if (status === 'syncing') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
        <Loader2 className="h-3 w-3 animate-spin" /> Syncing
      </span>
    );
  }
  if (status === 'error') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-700" title={error ?? undefined}>
        <AlertCircle className="h-3 w-3" /> Sync Error
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
      <CheckCircle2 className="h-3 w-3" /> Synced
    </span>
  );
}

function WalletCard({
  wallet,
  transactions,
  currentPrice,
  onRemove,
  onRefresh,
  isRefreshing,
}: {
  wallet: WalletRecord;
  transactions: WalletTxRecord[];
  currentPrice: number | null;
  onRemove: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const walletTxs = transactions.filter((tx) => tx.wallet_id === wallet.id);
  const balanceBtc = wallet.balance_sats / SATS_PER_BTC;
  const balanceUsd = currentPrice != null ? balanceBtc * currentPrice : null;
  const unconfirmedBtc = wallet.unconfirmed_balance_sats / SATS_PER_BTC;

  const handleCopyAddress = async () => {
    try {
      if (!wallet.display_identifier) return;
      await navigator.clipboard.writeText(wallet.display_identifier);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <article className="rounded-2xl border border-zinc-200 bg-white shadow-xs overflow-hidden">
      {/* Card Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 p-4 sm:p-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#f97602]">
              <Wallet className="h-4 w-4" />
            </span>
            <h3 className="font-bold text-zinc-900 truncate">{wallet.label}</h3>
            <WalletFormatBadge format={wallet.format} />
            <SyncStatusBadge status={wallet.sync_status} error={wallet.sync_error} />
          </div>
          <div className="flex items-center gap-2 mt-1 ml-10">
            <code className="text-[11px] text-zinc-500 font-mono truncate max-w-[260px] sm:max-w-xs">
              {wallet.display_identifier}
            </code>
            {wallet.display_identifier && (
              <button
                type="button"
                onClick={handleCopyAddress}
                className="shrink-0 rounded p-0.5 text-zinc-400 hover:text-zinc-700"
                title="Copy Bitcoin address"
                aria-label={`Copy ${wallet.label} Bitcoin address`}
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            )}
          </div>
        </div>

        {/* Balance */}
        <div className="flex flex-col items-end shrink-0">
          <div className="text-2xl font-extrabold text-zinc-900 font-mono tracking-tight">
            {formatBtc(wallet.balance_sats)} BTC
          </div>
          <div className="text-sm text-zinc-500">
            {formatSats(wallet.balance_sats)} sats
          </div>
          {balanceUsd != null && (
            <div className="text-sm font-semibold text-[#f97602]">
              ≈ {formatCurrencyUsd(balanceUsd, 0)}
            </div>
          )}
          {wallet.unconfirmed_balance_sats !== 0 && (
            <div className="mt-0.5 text-[11px] text-amber-600 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {unconfirmedBtc >= 0 ? '+' : ''}{formatBtc(Math.abs(wallet.unconfirmed_balance_sats))} BTC unconfirmed
            </div>
          )}
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 bg-zinc-50/70 px-4 py-2.5 text-xs">
        <div className="flex items-center gap-3 text-zinc-500">
          {wallet.last_synced_at && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Updated {formatRelativeTime(wallet.last_synced_at)}
            </span>
          )}
          <span>{walletTxs.length} transaction{walletTxs.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
          >
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            {expanded ? 'Hide txns' : 'Transactions'}
          </button>
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 disabled:opacity-50"
            title="Refresh balance"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <a
            href={
              wallet.wallet_type === 'address' && wallet.display_identifier
                ? `https://blockstream.info/address/${encodeURIComponent(wallet.display_identifier)}`
                : '#'
            }
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => {
              if (wallet.wallet_type !== 'address' || !wallet.display_identifier) event.preventDefault();
            }}
            className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
            title="View on explorer"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Explorer
          </a>
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
            title="Disconnect wallet"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Disconnect
          </button>
        </div>
      </div>

      {/* Transactions Drawer */}
      {expanded && (
        <div className="border-t border-zinc-100 p-4">
          {walletTxs.length === 0 ? (
            <p className="text-xs text-zinc-400 text-center py-3">No transactions found for this wallet.</p>
          ) : (
            <div className="space-y-2">
              {walletTxs.slice(0, 20).map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-zinc-100 bg-zinc-50/70 px-3 py-2.5"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                        tx.tx_type === 'incoming'
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'bg-red-100 text-red-500'
                      }`}
                    >
                      {tx.tx_type === 'incoming' ? (
                        <ArrowDownLeft className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-zinc-800">
                          {tx.tx_type === 'incoming' ? 'Received' : 'Sent'}
                        </span>
                        {!tx.confirmed && (
                          <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                            Unconfirmed
                          </span>
                        )}
                        {tx.confirmed && (
                          <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                            {tx.confirmations} confirmation{tx.confirmations === 1 ? '' : 's'}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <code className="text-[10px] text-zinc-400 font-mono">{truncateTxid(tx.txid)}</code>
                        <a
                          href={`https://blockstream.info/tx/${tx.txid}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-400 hover:text-zinc-600"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <span className="text-[10px] text-zinc-400">{formatTxDate(tx.block_time)}</span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div
                      className={`text-sm font-bold font-mono ${
                        tx.tx_type === 'incoming' ? 'text-emerald-700' : 'text-red-600'
                      }`}
                    >
                      {tx.tx_type === 'incoming' ? '+' : '-'}{formatBtc(tx.amount_sats)} BTC
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      {formatSats(tx.amount_sats)} sats
                    </div>
                    {currentPrice != null && (
                      <div className="text-[10px] text-zinc-400">
                        {formatCurrencyUsd((tx.amount_sats / SATS_PER_BTC) * currentPrice, 0)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {walletTxs.length > 20 && (
                <p className="text-center text-xs text-zinc-400 pt-1">
                  Showing 20 of {walletTxs.length} transactions.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export default function WalletDashboard({
  wallets,
  transactions,
  snapshots,
  manualRecords,
  priceHistory,
  error,
  currentPriceBtc,
  dcaPortfolioBtc,
  separateManualBtc,
  linkedManualBtc,
  onWalletRemoved,
  onWalletsRefreshed,
  onConnectWallet,
}: WalletDashboardProps) {
  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');

  const totalWalletSats = wallets.reduce((sum, w) => sum + w.balance_sats, 0);
  const totalWalletBtc = totalWalletSats / SATS_PER_BTC;
  const totalWalletUsd = currentPriceBtc != null ? totalWalletBtc * currentPriceBtc : null;

  const combinedBtc = totalWalletBtc + separateManualBtc;
  const portfolioHistory = useMemo(() => {
    const orderedSnapshots = [...snapshots].sort(
      (a, b) => a.recorded_at.localeCompare(b.recorded_at),
    );
    const pricePoints = [...priceHistory].sort((a, b) => a.timestamp - b.timestamp);
    const balances = new Map<string, number>();
    const days = new Map<string, WalletSnapshotRecord[]>();
    for (const snapshot of orderedSnapshots) {
      const day = snapshot.recorded_at.slice(0, 10);
      const daySnapshots = days.get(day) ?? [];
      daySnapshots.push(snapshot);
      days.set(day, daySnapshots);
    }

    return [...days.entries()].map(([date, daySnapshots]) => {
      for (const snapshot of daySnapshots) balances.set(snapshot.wallet_id, snapshot.balance_sats);
      const timestamp = Date.parse(`${date}T23:59:59.999Z`);
      const manualBtc = manualRecords.reduce((total, record) => {
        const transferred = record.isInWallet &&
          record.walletTransferDate !== null &&
          record.walletTransferDate <= date;
        return record.purchaseDate <= date && !transferred ? total + record.btcReceived : total;
      }, 0);
      const price = pricePoints.reduce<PricePoint | null>((closest, point) =>
        !closest || Math.abs(point.timestamp - timestamp) < Math.abs(closest.timestamp - timestamp)
          ? point
          : closest,
      null);
      const combinedBtcAtDate = [...balances.values()].reduce((sum, sats) => sum + sats, 0) / SATS_PER_BTC + manualBtc;
      return {
        date,
        walletBtc: [...balances.values()].reduce((sum, sats) => sum + sats, 0) / SATS_PER_BTC,
        manualBtc,
        combinedBtc: combinedBtcAtDate,
        combinedValue: price && Math.abs(price.timestamp - timestamp) <= 3 * 24 * 60 * 60 * 1000
          ? combinedBtcAtDate * price.price
          : null,
      };
    });
  }, [manualRecords, priceHistory, snapshots]);

  const handleRefresh = useCallback(async (walletId: string) => {
    setActionError('');
    setRefreshingId(walletId);
    try {
      const res = await fetch('/api/dca/wallets/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ walletId }),
      });
      const data = await res.json() as {
        error?: string;
        updatedWallets?: WalletRecord[];
        transactions?: WalletTxRecord[];
        snapshots?: WalletSnapshotRecord[];
      };
      if (!res.ok) {
        throw new Error(data.error || 'Could not refresh this wallet.');
      }
      onWalletsRefreshed(data.updatedWallets ?? [], data.transactions ?? [], data.snapshots ?? []);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Could not refresh this wallet.');
    } finally {
      setRefreshingId(null);
    }
  }, [onWalletsRefreshed]);

  const handleRemove = useCallback(async (wallet: WalletRecord) => {
    if (!window.confirm(`Disconnect "${wallet.label}"? Purchase records will remain.`)) return;
    setActionError('');
    setRemovingId(wallet.id);
    try {
      const res = await fetch(`/api/dca/wallets/${wallet.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) {
        throw new Error(data.error || 'Could not disconnect this wallet.');
      }
      onWalletRemoved(wallet.id);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Could not disconnect this wallet.');
    } finally {
      setRemovingId(null);
    }
  }, [onWalletRemoved]);

  return (
    <div className="space-y-5">
      {error && (
        <p role="alert" className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {error}
        </p>
      )}
      {actionError && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {actionError}
        </p>
      )}
      {/* Summary Row */}
      {wallets.length > 0 && (
        <div className="rounded-2xl border border-zinc-200/90 bg-white p-4 sm:p-5 shadow-xs">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f97602]">Watch-Only Wallets</p>
              <h3 className="mt-1 text-xl font-bold text-zinc-900">Portfolio overview</h3>
            </div>
            <button
              type="button"
              onClick={onConnectWallet}
              className="inline-flex items-center gap-2 rounded-xl bg-[#f97602] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#e06900] transition-colors"
            >
              <Wallet className="h-4 w-4" />
              Add Wallet
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {/* Wallet balance */}
            <div className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-3">
              <span className="block text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Actual on-chain balance</span>
              <div className="mt-1 text-lg font-extrabold text-zinc-900 font-mono tracking-tight">
                {formatBtc(totalWalletSats)} BTC
              </div>
              <div className="text-xs text-zinc-500">{formatSats(totalWalletSats)} sats</div>
              {totalWalletUsd != null && (
                <div className="mt-0.5 text-xs font-semibold text-[#f97602]">≈ {formatCurrencyUsd(totalWalletUsd, 0)}</div>
              )}
            </div>

            {/* DCA portfolio */}
            <div className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-3">
              <span className="block text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Manual DCA BTC recorded</span>
              <div className="mt-1 text-lg font-extrabold text-zinc-900 font-mono tracking-tight">
                {dcaPortfolioBtc.toFixed(6)} BTC
              </div>
              <div className="text-xs text-zinc-500">
                {Math.round(dcaPortfolioBtc * SATS_PER_BTC).toLocaleString()} sats
              </div>
              {currentPriceBtc != null && (
                <div className="mt-0.5 text-xs font-semibold text-zinc-500">
                  ≈ {formatCurrencyUsd(dcaPortfolioBtc * currentPriceBtc, 0)}
                </div>
              )}
            </div>

            {/* Combined note */}
            <div className="rounded-xl border border-orange-100 bg-orange-50/60 p-3">
              <span className="block text-[11px] font-semibold uppercase tracking-wide text-orange-600">Combined (wallet + separate manual)</span>
              <div className="mt-1 text-lg font-extrabold text-zinc-900 font-mono tracking-tight">
                {combinedBtc.toFixed(6)} BTC
              </div>
              {currentPriceBtc != null && (
                <div className="mt-0.5 text-xs font-semibold text-[#f97602]">≈ {formatCurrencyUsd(combinedBtc * currentPriceBtc, 0)}</div>
              )}
              <p className="mt-1.5 text-[10px] text-orange-800 leading-snug">
                Excludes {formatBtc(Math.round(linkedManualBtc * SATS_PER_BTC))} BTC already counted in wallet balances.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {wallets.length === 0 && (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/50 p-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-[#f97602]">
            <Wallet className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-zinc-800">No wallets connected</h3>
          <p className="mt-1.5 text-sm text-zinc-500 max-w-sm mx-auto">
            Track on-chain balances alongside manual purchases.
          </p>
          <button
            type="button"
            onClick={onConnectWallet}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#f97602] px-5 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-[#e06900] transition-colors"
          >
            <Wallet className="h-4 w-4" />
            Connect wallet
          </button>
        </div>
      )}

      {portfolioHistory.length > 0 && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs sm:p-5">
          <div className="mb-4">
            <h3 className="font-semibold text-zinc-900">Portfolio history</h3>
            <p className="mt-1 text-xs leading-5 text-zinc-500">
              Wallets use on-chain snapshots; manual BTC uses purchase and transfer dates.
            </p>
          </div>
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={portfolioHistory} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
                <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#71717a', fontSize: 11 }}
                  minTickGap={35}
                  axisLine={{ stroke: '#e4e4e7' }}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="btc"
                  tick={{ fill: '#71717a', fontSize: 11 }}
                  tickFormatter={(value: number) => value.toFixed(4)}
                  axisLine={false}
                  tickLine={false}
                  width={56}
                />
                <YAxis
                  yAxisId="usd"
                  orientation="right"
                  tick={{ fill: '#f97602', fontSize: 11 }}
                  tickFormatter={(value: number) => `$${Math.round(value).toLocaleString()}`}
                  axisLine={false}
                  tickLine={false}
                  width={64}
                />
                <Tooltip />
                <Legend />
                <Line yAxisId="btc" type="monotone" dataKey="walletBtc" name="Actual wallet BTC" stroke="#0284c7" dot={false} connectNulls />
                <Line yAxisId="btc" type="monotone" dataKey="manualBtc" name="Separate manual DCA BTC" stroke="#71717a" dot={false} connectNulls />
                <Line yAxisId="btc" type="monotone" dataKey="combinedBtc" name="Combined BTC" stroke="#f97602" strokeWidth={2} dot={false} connectNulls />
                <Line yAxisId="usd" type="monotone" dataKey="combinedValue" name="Combined USD value" stroke="#16a34a" dot={false} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Wallet Cards */}
      {wallets.map((wallet) => (
        <WalletCard
          key={wallet.id}
          wallet={wallet}
          transactions={transactions}
          currentPrice={currentPriceBtc}
          onRemove={() => void handleRemove(wallet)}
          onRefresh={() => void handleRefresh(wallet.id)}
          isRefreshing={refreshingId === wallet.id || removingId === wallet.id}
        />
      ))}

      {/* Add Wallet button at bottom if any wallets exist */}
      {wallets.length > 0 && (
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={onConnectWallet}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-xs hover:bg-zinc-50 transition-colors"
          >
            <Wallet className="h-4 w-4 text-[#f97602]" />
            Add another wallet
          </button>
        </div>
      )}
    </div>
  );
}
