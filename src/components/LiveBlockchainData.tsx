'use client';

import { useState, useEffect, useRef } from 'react';
import {
  ExternalLink,
  Layers,
  Radio,
  Clock,
  Coins,
  Cpu,
  Flame,
  CheckCircle2,
  RefreshCw,
  Info,
} from 'lucide-react';

// Mempool block (unconfirmed) interface
interface MempoolBlock {
  blockSize: number;
  blockVSize?: number;
  virtualSize?: number;
  nTx: number;
  totalFees: number;
  medianFee: number;
  feeRange: number[];
}

// Confirmed block interface from mempool.space /api/v1/blocks
interface ConfirmedBlock {
  height: number;
  id: string;
  timestamp: number;
  tx_count: number;
  size: number;
  weight: number;
  extras?: {
    reward?: number;
    totalFees?: number;
    medianFee?: number;
    feeRange?: number[];
    avgFee?: number;
    virtualSize?: number;
    pool?: {
      id: number;
      name: string;
      slug: string;
    };
  };
  pool?: {
    id: number | string;
    name: string;
    slug: string;
  };
  fees?: number;
}

interface LiveBlockchainDataProps {
  className?: string;
}

// Helper to format time ago
function getTimeAgo(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = Math.max(0, now - timestamp);

  if (diff < 15) return 'Just now';
  if (diff < 60) return `${diff} seconds ago`;

  const minutesAgo = Math.floor(diff / 60);
  if (minutesAgo < 60) return `${minutesAgo} minute${minutesAgo === 1 ? '' : 's'} ago`;

  const hoursAgo = Math.floor(diff / 3600);
  if (hoursAgo < 24) return `${hoursAgo} hour${hoursAgo === 1 ? '' : 's'} ago`;

  const daysAgo = Math.floor(diff / 86400);
  return `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`;
}

// Helper to format fee rate without rounding small numbers to 0
function formatFeeRate(rate: number | undefined | null): string {
  if (rate == null || !Number.isFinite(rate) || rate <= 0) return '0.00';
  if (rate < 0.01) return '<0.01';
  if (rate < 1) return rate.toFixed(2);
  if (rate < 10) return rate.toFixed(1);
  return Math.round(rate).toString();
}

// Helper to format fee span
function formatFeeSpan(feeRange: number[] | undefined | null, medianFallback?: number): string {
  if (!Array.isArray(feeRange) || feeRange.length === 0) {
    if (medianFallback && Number.isFinite(medianFallback)) {
      return `~${formatFeeRate(medianFallback)} sat/vB`;
    }
    return '0.10 – 1.00 sat/vB';
  }
  const min = feeRange[0];
  const max = feeRange[feeRange.length - 1];
  const minStr = formatFeeRate(min);
  const maxStr = formatFeeRate(max);
  if (minStr === maxStr) return `${minStr} sat/vB`;
  return `${minStr} – ${maxStr} sat/vB`;
}

// Helper to format BTC (with appropriate decimal precision)
function formatBTC(sats: number | undefined | null): string {
  if (sats == null || !Number.isFinite(sats) || sats <= 0) return '0.000';
  const btc = sats / 1e8;
  if (btc < 0.001) return btc.toFixed(4);
  return btc.toFixed(3);
}

// Helper to format bytes to MB
function formatMB(bytes: number | undefined | null): string {
  if (!bytes || !Number.isFinite(bytes)) return '—';
  return `${(bytes / 1e6).toFixed(2)} MB`;
}

// Helper to format block weight units
function formatWeight(weight: number | undefined | null): string {
  if (!weight || !Number.isFinite(weight)) return '—';
  return `${(weight / 1e6).toFixed(2)} MWU`;
}

// Calculate block fullness percentage (max standard block weight = 4,000,000 WU)
function getBlockFullness(weightOrBytes: number, isWeight = true): number {
  if (!weightOrBytes || weightOrBytes <= 0) return 98;
  const max = isWeight ? 4_000_000 : 1_600_000;
  return Math.min(100, Math.max(10, Math.round((weightOrBytes / max) * 100)));
}

export function LiveBlockchainData({ className = '' }: LiveBlockchainDataProps) {
  const [mempoolBlocks, setMempoolBlocks] = useState<MempoolBlock[]>([]);
  const [confirmedBlocks, setConfirmedBlocks] = useState<ConfirmedBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const fetchBlockDataRef = useRef<((isInitial?: boolean) => Promise<void>) | null>(null);

  useEffect(() => {
    let isMounted = true;
    let pollInterval: NodeJS.Timeout;

    const fetchBlockData = async (isInitial = false) => {
      try {
        if (isInitial) {
          setLoading(true);
        }
        setError(null);

        const response = await fetch('/api/blockchain/data?type=all', {
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch blockchain data: ${response.statusText}`);
        }

        const data = await response.json();
        if (!isMounted) return;

        const rawMempool: MempoolBlock[] = Array.isArray(data.mempoolBlocks) ? data.mempoolBlocks : [];
        const rawBlocks: ConfirmedBlock[] = Array.isArray(data.blocks) ? data.blocks : [];

        // Normalize confirmed blocks with pool information from extras
        const normalizedBlocks: ConfirmedBlock[] = rawBlocks.slice(0, 4).map((block) => ({
          ...block,
          pool: block.extras?.pool || block.pool,
        }));

        setMempoolBlocks(rawMempool.slice(0, 4));
        setConfirmedBlocks(normalizedBlocks);
        setLastUpdated(new Date());

        if (isInitial) {
          setLoading(false);
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load blockchain data');
        if (isInitial) {
          setLoading(false);
        }
      }
    };

    fetchBlockDataRef.current = fetchBlockData;
    fetchBlockData(true);

    pollInterval = setInterval(() => {
      fetchBlockData(false);
    }, 15000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, []);

  if (loading) {
    return (
      <div className={`rounded-2xl border border-zinc-800 bg-zinc-950 p-8 text-center ${className}`}>
        <div className="flex items-center justify-center space-x-3">
          <RefreshCw className="h-5 w-5 animate-spin text-cyan-400" />
          <p className="text-sm font-semibold text-zinc-300">Connecting to live mempool.space stream…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rounded-2xl border border-red-500/30 bg-red-950/20 p-6 text-center ${className}`}>
        <p className="text-sm font-bold text-red-300">Live Data Unavailable: {error}</p>
        <p className="text-xs text-zinc-400 mt-1 mb-4">
          Unable to connect to mempool.space API. You can retry or check your network.
        </p>
        <button
          type="button"
          onClick={() => {
            setError(null);
            setLoading(true);
            fetchBlockDataRef.current?.(true);
          }}
          className="rounded-lg bg-red-500/20 px-4 py-1.5 text-xs font-semibold text-red-200 hover:bg-red-500/30 border border-red-500/30 cursor-pointer transition"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const safeMempoolBlocks = Array.isArray(mempoolBlocks) ? mempoolBlocks : [];
  const safeConfirmedBlocks = Array.isArray(confirmedBlocks) ? confirmedBlocks : [];
  const latestBlockHeight = safeConfirmedBlocks[0]?.height;

  // Visual gradients for mempool unconfirmed blocks (progressing in time)
  const mempoolGradients = [
    {
      front: 'linear-gradient(145deg, #10b981 0%, #059669 40%, #d97706 100%)',
      top: 'linear-gradient(90deg, #34d399, #fbbf24)',
      side: 'linear-gradient(180deg, #047857, #78350f)',
      border: 'rgba(52, 211, 153, 0.4)',
      glow: 'rgba(16, 185, 129, 0.25)',
    },
    {
      front: 'linear-gradient(145deg, #059669 0%, #0d9488 40%, #b45309 100%)',
      top: 'linear-gradient(90deg, #10b981, #f59e0b)',
      side: 'linear-gradient(180deg, #065f46, #451a03)',
      border: 'rgba(16, 185, 129, 0.35)',
      glow: 'rgba(5, 150, 105, 0.2)',
    },
    {
      front: 'linear-gradient(145deg, #047857 0%, #0f766e 50%, #854d0e 100%)',
      top: 'linear-gradient(90deg, #059669, #d97706)',
      side: 'linear-gradient(180deg, #064e3b, #3f2c00)',
      border: 'rgba(5, 150, 105, 0.3)',
      glow: 'rgba(4, 120, 87, 0.15)',
    },
    {
      front: 'linear-gradient(145deg, #0f766e 0%, #115e59 50%, #713f12 100%)',
      top: 'linear-gradient(90deg, #0d9488, #b45309)',
      side: 'linear-gradient(180deg, #134e4a, #291804)',
      border: 'rgba(13, 148, 136, 0.3)',
      glow: 'rgba(15, 118, 110, 0.15)',
    },
  ];

  // Visual gradients for confirmed blocks (progressing into the past)
  const confirmedGradients = [
    {
      front: 'linear-gradient(145deg, #4f46e5 0%, #4338ca 40%, #6d28d9 100%)',
      top: 'linear-gradient(90deg, #818cf8, #a78bfa)',
      side: 'linear-gradient(180deg, #3730a3, #4c1d95)',
      border: 'rgba(129, 140, 248, 0.5)',
      glow: 'rgba(99, 102, 241, 0.3)',
    },
    {
      front: 'linear-gradient(145deg, #4338ca 0%, #3730a3 50%, #581c87 100%)',
      top: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
      side: 'linear-gradient(180deg, #312e81, #3b0764)',
      border: 'rgba(99, 102, 241, 0.4)',
      glow: 'rgba(67, 56, 202, 0.2)',
    },
    {
      front: 'linear-gradient(145deg, #3730a3 0%, #312e81 50%, #4c1d95 100%)',
      top: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
      side: 'linear-gradient(180deg, #1e1b4b, #2e1065)',
      border: 'rgba(79, 70, 229, 0.35)',
      glow: 'rgba(55, 48, 163, 0.15)',
    },
    {
      front: 'linear-gradient(145deg, #312e81 0%, #1e1b4b 50%, #3b0764 100%)',
      top: 'linear-gradient(90deg, #4338ca, #6d28d9)',
      side: 'linear-gradient(180deg, #17153a, #1f0538)',
      border: 'rgba(67, 56, 202, 0.3)',
      glow: 'rgba(49, 46, 129, 0.15)',
    },
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Top Banner / Legend Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <h5 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
            <span>Mempool & Blockchain Explorer</span>
            {latestBlockHeight && (
              <span className="text-xs font-mono font-normal text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 rounded px-2 py-0.5">
                Tip: #{latestBlockHeight.toLocaleString()}
              </span>
            )}
          </h5>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="h-2 w-2 rounded-sm bg-emerald-500" />
            <span>Mempool (Unconfirmed)</span>
          </div>
          <div className="flex items-center gap-1.5 text-indigo-400">
            <span className="h-2 w-2 rounded-sm bg-indigo-500" />
            <span>Recently Mined</span>
          </div>
        </div>
      </div>

      {/* Horizontal 3D Blocks Visualizer */}
      <div className="relative flex items-start gap-4 overflow-x-auto pb-6 pt-5 px-3 min-h-[320px] select-none">
        {/* ─── MEMPOOL BLOCKS (Pending Queue on Left) ─── */}
        <div className="flex gap-4 shrink-0">
          {safeMempoolBlocks.map((block, index) => {
            if (!block) return null;
            const etaMinutes = (index + 1) * 10;
            const feeRange = Array.isArray(block.feeRange) ? block.feeRange : [];
            const medianRate = formatFeeRate(block.medianFee);
            const feeSpan = formatFeeSpan(feeRange, block.medianFee);
            const feeBtc = formatBTC(block.totalFees);
            const sizeStr = formatMB(block.blockSize);
            const style = mempoolGradients[index % mempoolGradients.length];
            const fullness = getBlockFullness(block.blockSize, false);

            return (
              <div
                key={`mempool-${index}`}
                className="group relative flex flex-col shrink-0 transition-transform duration-300 hover:-translate-y-1"
                style={{ width: '190px' }}
              >
                {/* Projected Block Height / Label */}
                <div className="h-6 mb-2 flex items-center justify-between px-1 text-xs">
                  <span className="font-mono text-emerald-400 font-bold flex items-center gap-1">
                    <Flame className="h-3 w-3 text-amber-400 animate-pulse" />
                    +{index + 1} Block
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">~{fullness}% full</span>
                </div>

                {/* 3D Isometric Cube Container */}
                <div className="relative">
                  {/* 3D Top Face */}
                  <div
                    className="absolute -top-3 left-2.5 h-3 w-[190px] rounded-t-xs transition-opacity duration-300"
                    style={{
                      background: style.top,
                      transform: 'skewX(-45deg)',
                      boxShadow: `0 -2px 10px ${style.glow}`,
                    }}
                  />

                  {/* 3D Right Side Face */}
                  <div
                    className="absolute -right-3 top-[-6px] h-[210px] w-3 rounded-r-xs transition-opacity duration-300"
                    style={{
                      background: style.side,
                      transform: 'skewY(-45deg)',
                    }}
                  />

                  {/* Main Front Face */}
                  <div
                    className="relative z-10 h-[210px] w-[190px] rounded-xl border p-4 flex flex-col justify-between shadow-xl transition-all duration-300 group-hover:shadow-2xl"
                    style={{
                      background: style.front,
                      borderColor: style.border,
                      boxShadow: `0 8px 24px -4px ${style.glow}`,
                    }}
                  >
                    {/* Top Section: Median Fee & Span */}
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-md bg-black/40 px-2 py-0.5 font-mono text-xs font-bold text-white shadow-xs">
                          ~{medianRate} sat/vB
                        </span>
                        <span className="text-[10px] text-white/80 font-mono">ETA</span>
                      </div>

                      <p className="mt-1.5 text-[11px] font-mono text-emerald-100/90 truncate" title={feeSpan}>
                        {feeSpan}
                      </p>

                      {/* Visual Fee Level Indicator Bar */}
                      <div className="mt-1.5 h-1 w-full rounded-full bg-black/40 overflow-hidden">
                        <div
                          className="h-full bg-white/80 rounded-full"
                          style={{ width: `${Math.min(100, Math.max(15, fullness))}%` }}
                        />
                      </div>

                      {/* Large BTC Fee Total */}
                      <div className="mt-3">
                        <p className="text-[10px] uppercase font-semibold tracking-wider text-emerald-200/80">
                          Total Fees
                        </p>
                        <p className="font-mono text-xl font-black text-white drop-shadow-sm tracking-tight">
                          {feeBtc} <span className="text-xs font-semibold">BTC</span>
                        </p>
                      </div>
                    </div>

                    {/* Bottom Section: Transaction Count & Time */}
                    <div className="pt-2 border-t border-white/15 space-y-0.5 text-xs">
                      <div className="flex items-center justify-between text-white/95 font-medium">
                        <span>{block.nTx.toLocaleString()} txs</span>
                        <span className="text-[10px] text-white/75 font-mono">{sizeStr}</span>
                      </div>
                      <p className="text-[11px] text-white/80 italic font-mono flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        In ~{etaMinutes} minutes
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sub-label under block */}
                <div className="mt-3 text-center">
                  <span className="inline-block rounded-full bg-zinc-900/90 border border-zinc-800 px-2.5 py-0.5 text-[10px] text-zinc-400 font-mono">
                    Pending Mining
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── Dotted Line: Current Tip / Now Boundary ─── */}
        <div className="relative flex flex-col items-center justify-between shrink-0 h-[240px] px-2 self-center">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest animate-bounce">
              ↑
            </span>
            <span className="text-[9px] font-mono text-zinc-500 uppercase">Latest</span>
          </div>

          {/* Glowing vertical boundary */}
          <div className="flex-1 w-0.5 my-2 border-l-2 border-dashed border-cyan-400/50 relative">
            <div className="absolute top-1/2 -left-1.5 h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee] animate-ping" />
            <div className="absolute top-1/2 -left-1.5 h-3 w-3 rounded-full bg-cyan-400" />
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[9px] font-mono text-zinc-500 uppercase">Tip</span>
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest animate-bounce">
              ↓
            </span>
          </div>
        </div>

        {/* ─── CONFIRMED BLOCKS (Mined into the Past on Right) ─── */}
        <div className="flex gap-4 shrink-0">
          {safeConfirmedBlocks.map((block, index) => {
            if (!block) return null;
            const feeRange = Array.isArray(block.extras?.feeRange) ? block.extras.feeRange : [];
            const medianRate = formatFeeRate(block.extras?.medianFee);
            const feeSpan = formatFeeSpan(feeRange, block.extras?.medianFee);
            const feeBtc = formatBTC(block.extras?.totalFees || block.fees);
            const sizeStr = formatMB(block.size);
            const weightStr = formatWeight(block.weight);
            const timeAgo = getTimeAgo(block.timestamp);
            const poolName = block.pool?.name || block.extras?.pool?.name || 'Unknown Miner';
            const style = confirmedGradients[index % confirmedGradients.length];
            const fullness = getBlockFullness(block.weight, true);

            return (
              <div
                key={`confirmed-${block.id || block.height}`}
                className="group relative flex flex-col shrink-0 transition-transform duration-300 hover:-translate-y-1"
                style={{ width: '190px' }}
              >
                {/* Block Height Header */}
                <div className="h-6 mb-2 flex items-center justify-between px-1 text-xs">
                  <a
                    href={`https://mempool.space/block/${block.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-cyan-300 font-extrabold hover:text-cyan-200 hover:underline flex items-center gap-1"
                    title={`Inspect block #${block.height} on mempool.space`}
                  >
                    #{block.height.toLocaleString()}
                    <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                  </a>
                  <span className="text-[10px] text-zinc-400 font-mono">{weightStr}</span>
                </div>

                {/* 3D Isometric Cube Container */}
                <div className="relative">
                  {/* 3D Top Face */}
                  <div
                    className="absolute -top-3 left-2.5 h-3 w-[190px] rounded-t-xs transition-opacity duration-300"
                    style={{
                      background: style.top,
                      transform: 'skewX(-45deg)',
                      boxShadow: `0 -2px 10px ${style.glow}`,
                    }}
                  />

                  {/* 3D Right Side Face */}
                  <div
                    className="absolute -right-3 top-[-6px] h-[210px] w-3 rounded-r-xs transition-opacity duration-300"
                    style={{
                      background: style.side,
                      transform: 'skewY(-45deg)',
                    }}
                  />

                  {/* Main Front Face */}
                  <a
                    href={`https://mempool.space/block/${block.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-10 h-[210px] w-[190px] rounded-xl border p-4 flex flex-col justify-between shadow-xl transition-all duration-300 group-hover:shadow-2xl cursor-pointer block"
                    style={{
                      background: style.front,
                      borderColor: style.border,
                      boxShadow: `0 8px 24px -4px ${style.glow}`,
                    }}
                  >
                    {/* Top Section: Median Fee & Range */}
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-md bg-black/40 px-2 py-0.5 font-mono text-xs font-bold text-white shadow-xs">
                          ~{medianRate} sat/vB
                        </span>
                        <span className="text-[10px] text-indigo-200/80 font-mono">Confirmed</span>
                      </div>

                      <p className="mt-1.5 text-[11px] font-mono text-indigo-100/90 truncate" title={feeSpan}>
                        {feeSpan}
                      </p>

                      {/* Visual Fee Level Indicator Bar */}
                      <div className="mt-1.5 h-1 w-full rounded-full bg-black/40 overflow-hidden">
                        <div
                          className="h-full bg-white/80 rounded-full"
                          style={{ width: `${fullness}%` }}
                        />
                      </div>

                      {/* Large BTC Fee Total */}
                      <div className="mt-3">
                        <p className="text-[10px] uppercase font-semibold tracking-wider text-indigo-200/80">
                          Total Fees
                        </p>
                        <p className="font-mono text-xl font-black text-white drop-shadow-sm tracking-tight">
                          {feeBtc} <span className="text-xs font-semibold">BTC</span>
                        </p>
                      </div>
                    </div>

                    {/* Bottom Section: Transaction Count & Timestamp */}
                    <div className="pt-2 border-t border-white/15 space-y-0.5 text-xs">
                      <div className="flex items-center justify-between text-white/95 font-medium">
                        <span>{block.tx_count.toLocaleString()} txs</span>
                        <span className="text-[10px] text-white/75 font-mono">{sizeStr}</span>
                      </div>
                      <p className="text-[11px] text-white/80 italic font-mono flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-emerald-300" />
                        {timeAgo}
                      </p>
                    </div>
                  </a>
                </div>

                {/* Mining Pool Pill below block */}
                <div className="mt-3 text-center">
                  <a
                    href={`https://mempool.space/block/${block.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full bg-zinc-900 border border-zinc-700/80 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-200 hover:border-cyan-500 hover:text-cyan-300 transition"
                    title={`Mined by ${poolName}`}
                  >
                    <Cpu className="h-3 w-3 text-purple-400" />
                    <span className="truncate max-w-[140px]">{poolName}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info & Auto-refresh status */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 px-1 text-xs text-zinc-500">
        <div className="flex items-center gap-1.5 font-mono">
          <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
          <span>Real-time mempool.space stream</span>
          {lastUpdated && (
            <span className="text-zinc-600">
              · Synced {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>

        <a
          href="https://mempool.space"
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-400 hover:text-cyan-400 transition flex items-center gap-1 text-[11px]"
        >
          Explore live on mempool.space
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
