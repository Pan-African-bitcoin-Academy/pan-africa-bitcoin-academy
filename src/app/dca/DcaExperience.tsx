'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import {
  Activity,
  Archive,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Calculator,
  CalendarDays,
  Check,
  CircleAlert,
  Clock3,
  Coins,
  Download,
  Key,
  LogOut,
  Gauge,
  Lightbulb,
  LockKeyhole,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
  Wallet,
} from 'lucide-react';
import { CryptoAuthModal } from '@/components/dca/CryptoAuthModal';
import { LinkCryptoKeyModal } from '@/components/dca/LinkCryptoKeyModal';
import ConnectWalletModal from '@/components/dca/ConnectWalletModal';
import WalletDashboard, {
  type ManualPortfolioRecord,
  type WalletRecord,
  type WalletSnapshotRecord,
  type WalletTxRecord,
} from '@/components/dca/WalletDashboard';
import { ForgotPasswordModal } from '@/components/ForgotPasswordModal';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/styles';
import {
  getNextPurchaseDate,
  getScheduledDates,
  simulateDca,
  type DcaFrequency,
  type DcaSimulation,
  type PricePoint,
  type ScheduledPurchase,
} from './dca-calculations';

type Section = 'overview' | 'learn' | 'planner' | 'simulator' | 'dashboard' | 'market';
type PlanStatus = 'active' | 'paused' | 'archived';

interface DcaPlan {
  id: string;
  name: string;
  contributionAmount: number;
  frequency: DcaFrequency;
  startDate: string;
  endDate: string;
  initialContribution: number;
  feePercent: number;
  notes: string;
  status: PlanStatus;
  createdAt: string;
}

interface DcaPurchase {
  id: string;
  planId: string | null;
  purchaseDate: string;
  amountUsd: number;
  btcPrice: number;
  btcReceived: number;
  feesUsd: number;
  transactionId: string;
  notes: string;
  depositedToWalletId: string | null;
  isInWallet: boolean;
  walletTransferDate: string | null;
}

interface MarketData {
  currentPrice: number;
  change24h: number | null;
  high24h: number | null;
  low24h: number | null;
  lastUpdated: string;
  prices: PricePoint[];
  candles: MarketCandle[];
  candleError: string | null;
  source: string;
}

interface MarketCandle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

const STORAGE_KEY = 'pba-dca-v1';
const SIMULATION_START_DATE = '2020-01-01';
const sectionLinks: { id: Section; label: string; icon: typeof Activity }[] = [
  { id: 'overview', label: 'Overview', icon: Gauge },
  { id: 'learn', label: 'Learn DCA', icon: BookOpen },
  { id: 'planner', label: 'DCA planner', icon: CalendarDays },
  { id: 'simulator', label: 'Historical simulator', icon: Activity },
  { id: 'dashboard', label: 'My dashboard', icon: Wallet },
  { id: 'market', label: 'Bitcoin market', icon: Coins },
];

const lessons = [
  {
    title: 'What is dollar-cost averaging?',
    body: 'DCA means investing a fixed amount on a regular schedule. It changes timing, not market risk.',
  },
  {
    title: 'How Bitcoin DCA works',
    body: 'Set an amount and schedule. Each payment buys more bitcoin at lower prices and less at higher prices.',
  },
  {
    title: 'Why people use DCA',
    body: 'A schedule reduces timing decisions, but you keep buying during downturns.',
  },
  {
    title: 'DCA versus a lump sum',
    body: 'DCA spreads purchases over time; a lump sum invests at once. Results depend on timing and market conditions.',
  },
  {
    title: 'Understanding Bitcoin volatility',
    body: 'Bitcoin prices can rise or fall sharply, and portfolios can lose substantial value.',
  },
  {
    title: 'Risks and limitations',
    body: 'DCA does not guarantee returns. Fees, taxes, and custody errors affect results; don’t invest essential funds.',
  },
  {
    title: 'Budgeting recurring purchases',
    body: 'Consider essential costs, savings, debts, and local rules before setting a recurring amount.',
  },
  {
    title: 'Bitcoin accumulation and self-custody',
    body: 'Self-custody gives you control of bitcoin and responsibility for key backups.',
  },
  {
    title: 'Transaction fees',
    body: 'Fees reduce the bitcoin received or increase its cost basis. Frequent small purchases can make fixed fees significant.',
  },
  {
    title: 'Reviewing a plan',
    body: 'Review plans against your budget, not recent prices. Historical results don’t predict future performance.',
  },
];

function todayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

function dateOffset(days: number) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function formatCurrency(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits,
  }).format(Number.isFinite(value) ? value : 0);
}

function formatBtc(value: number) {
  return `${Number.isFinite(value) ? value.toFixed(8) : '0.00000000'} BTC`;
}

function formatDate(value: string) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' }).format(
    new Date(`${value.slice(0, 10)}T00:00:00.000Z`),
  );
}

function isPricePoint(value: unknown): value is PricePoint {
  if (!value || typeof value !== 'object') return false;
  const point = value as Record<string, unknown>;
  return (
    typeof point.timestamp === 'number' &&
    Number.isFinite(point.timestamp) &&
    typeof point.price === 'number' &&
    Number.isFinite(point.price) &&
    point.price > 0
  );
}

function CandleChart({ data, currentPrice }: { data: MarketCandle[]; currentPrice: number | null }) {
  const width = 1000;
  const height = 340;
  const left = 78;
  const right = 112;
  const top = 16;
  const bottom = 32;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const validCurrentPrice = currentPrice !== null && Number.isFinite(currentPrice) && currentPrice > 0
    ? currentPrice
    : null;
  const low = Math.min(...data.map((c) => c.low), validCurrentPrice ?? Infinity);
  const high = Math.max(...data.map((c) => c.high), validCurrentPrice ?? -Infinity);
  const range = high - low || high * 0.02 || 1;
  const minPrice = low - range * 0.06;
  const maxPrice = high + range * 0.06;
  const yForPrice = (price: number) =>
    top + ((maxPrice - price) / (maxPrice - minPrice)) * plotHeight;
  const candleStep = plotWidth / data.length;
  const candleWidth = Math.max(2, Math.min(10, candleStep * 0.64));
  const tickCount = Math.min(5, data.length);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const activeIndex = hoveredIndex === null ? null : Math.min(hoveredIndex, data.length - 1);
  const selectedIndex = activeIndex ?? data.length - 1;
  const selectedCandle = data[selectedIndex];
  const isBullish = selectedCandle.close >= selectedCandle.open;
  const selectedDate = new Intl.DateTimeFormat('en', {
    month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  }).format(selectedCandle.timestamp);
  const axisCurrency = new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1,
  });

  // Last candle anchor for the TradingView-style price line
  const lastCandle = data[data.length - 1];
  const lastCandleX = left + (data.length - 0.5) * candleStep;
  const priceY = validCurrentPrice !== null ? yForPrice(validCurrentPrice) : null;

  // Hover crosshair
  const hoverX = activeIndex !== null ? left + (activeIndex + 0.5) * candleStep : null;
  const hoverCloseY = activeIndex !== null ? yForPrice(data[activeIndex].close) : null;

  return (
    <div>
      {/* OHLC info bar */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-xl bg-zinc-50 px-3 py-2 text-xs">
        <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-5">
          {[
            { label: 'Date',  value: selectedDate,                          className: 'text-zinc-800' },
            { label: 'Open',  value: formatCurrency(selectedCandle.open,  0), className: 'text-zinc-800' },
            { label: 'High',  value: formatCurrency(selectedCandle.high,  0), className: 'text-emerald-700' },
            { label: 'Low',   value: formatCurrency(selectedCandle.low,   0), className: 'text-rose-700' },
            { label: 'Close', value: formatCurrency(selectedCandle.close, 0), className: isBullish ? 'text-emerald-700' : 'text-rose-700' },
          ].map((item, index) => (
            <div
              key={item.label}
              className={`min-w-0 rounded-lg border border-zinc-100 bg-white px-2.5 py-2 ${index === 0 ? 'col-span-2 sm:col-span-1' : ''}`}
            >
              <span className="block text-[10px] font-medium uppercase tracking-wide text-zinc-400">{item.label}</span>
              <span className={`mt-0.5 block truncate font-mono text-xs font-semibold tabular-nums sm:text-sm ${item.className}`}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="block h-auto w-full min-w-[720px]"
          role="img"
          aria-label="Bitcoin USD historical candlestick chart. The orange horizontal line marks the current Bitcoin price anchored to the last candle. Hover or use arrow keys to inspect candle prices."
          tabIndex={0}
          onPointerMove={(event) => {
            const bounds = event.currentTarget.getBoundingClientRect();
            if (!bounds.width) return;
            const x = ((event.clientX - bounds.left) / bounds.width) * width;
            if (x < left || x >= width - right) { setHoveredIndex(null); return; }
            setHoveredIndex(Math.min(data.length - 1, Math.floor((x - left) / candleStep)));
          }}
          onKeyDown={(event) => {
            if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
            event.preventDefault();
            const direction = event.key === 'ArrowLeft' ? -1 : 1;
            setHoveredIndex((current) =>
              Math.max(0, Math.min(data.length - 1, (current ?? data.length - 1) + direction)),
            );
          }}
          onPointerLeave={() => setHoveredIndex(null)}
        >
          {/* Horizontal grid lines + left Y-axis labels */}
          {Array.from({ length: 6 }, (_, i) => {
            const price = maxPrice - ((maxPrice - minPrice) * i) / 5;
            const y = top + (plotHeight * i) / 5;
            return (
              <g key={i}>
                <line x1={left} x2={width - right} y1={y} y2={y} stroke="#f0f0f0" strokeWidth="1" />
                <text x={left - 8} y={y + 4} textAnchor="end" fill="#a1a1aa" fontSize="11">
                  {axisCurrency.format(price)}
                </text>
              </g>
            );
          })}

          {/* Hover column highlight */}
          {activeIndex !== null && (
            <rect
              x={left + activeIndex * candleStep}
              y={top}
              width={candleStep}
              height={plotHeight}
              fill="#f4f4f5"
              opacity="0.65"
            />
          )}

          {/* Candles */}
          {data.map((candle, index) => {
            const x = left + (index + 0.5) * candleStep;
            const openY = yForPrice(candle.open);
            const closeY = yForPrice(candle.close);
            const color = candle.close >= candle.open ? '#16a34a' : '#e11d48';
            const bodyTop = Math.min(openY, closeY);
            const bodyHeight = Math.max(2, Math.abs(openY - closeY));
            const date = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(candle.timestamp);
            return (
              <g key={candle.timestamp}>
                <title>{`${date} · Open ${formatCurrency(candle.open)} · High ${formatCurrency(candle.high)} · Low ${formatCurrency(candle.low)} · Close ${formatCurrency(candle.close)}`}</title>
                {/* Wick */}
                <line x1={x} x2={x} y1={yForPrice(candle.high)} y2={yForPrice(candle.low)} stroke={color} strokeWidth="1.5" />
                {/* Body */}
                <rect x={x - candleWidth / 2} y={bodyTop} width={candleWidth} height={bodyHeight} fill={color} rx="1" />
              </g>
            );
          })}

          {/* ── TradingView-style current price line ── */}
          {validCurrentPrice !== null && priceY !== null && (
            <g>
              {/* Dashed line only from last candle to right label — not across all candles */}
              <line
                x1={lastCandleX}
                x2={width - right + 1}
                y1={priceY}
                y2={priceY}
                stroke="#f97602"
                strokeDasharray="5 3"
                strokeWidth="1.5"
              />
              {/* Outer pulse ring */}
              <circle cx={lastCandleX} cy={priceY} r="8" fill="#f97602" opacity="0.15">
                <animate attributeName="r"       values="5;10;5"       dur="2.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.18;0;0.18"  dur="2.2s" repeatCount="indefinite" />
              </circle>
              {/* Inner solid dot */}
              <circle cx={lastCandleX} cy={priceY} r="4" fill="#f97602">
                <animate attributeName="opacity" values="1;0.4;1" dur="2.2s" repeatCount="indefinite" />
              </circle>
              {/* Price pill label on the right axis */}
              <rect x={width - right + 4} y={priceY - 11} width={right - 8} height="22" rx="5" fill="#f97602" />
              <text x={width - right / 2 + 2} y={priceY + 4} textAnchor="middle" fill="white" fontSize="11" fontWeight="700">
                {`BTC ${axisCurrency.format(validCurrentPrice)}`}
              </text>
              {/* Small tick on the right border where line meets the label */}
              <line x1={width - right} x2={width - right + 4} y1={priceY} y2={priceY} stroke="#f97602" strokeWidth="1.5" />
            </g>
          )}

          {/* ── Hover crosshair: vertical + horizontal ── */}
          {activeIndex !== null && hoverX !== null && hoverCloseY !== null && (
            <g>
              {/* Vertical hair */}
              <line x1={hoverX} x2={hoverX} y1={top} y2={top + plotHeight} stroke="#94a3b8" strokeDasharray="4 3" strokeWidth="1" />
              {/* Horizontal hair */}
              <line x1={left} x2={width - right} y1={hoverCloseY} y2={hoverCloseY} stroke="#94a3b8" strokeDasharray="4 3" strokeWidth="1" />
              {/* Close price label on left Y-axis */}
              <rect x={0} y={hoverCloseY - 11} width={left - 4} height="22" rx="4" fill="#3f3f46" />
              <text x={(left - 4) / 2} y={hoverCloseY + 4} textAnchor="middle" fill="white" fontSize="11" fontWeight="600">
                {axisCurrency.format(data[activeIndex].close)}
              </text>
              {/* Dot at crosshair intersection */}
              <circle cx={hoverX} cy={hoverCloseY} r="3.5" fill="white" stroke="#94a3b8" strokeWidth="1.5" />
            </g>
          )}

          {/* X-axis date ticks */}
          {Array.from({ length: tickCount }, (_, index) => {
            const dataIndex = tickCount === 1 ? 0 : Math.round((index * (data.length - 1)) / (tickCount - 1));
            const candle = data[dataIndex];
            const x = left + (dataIndex + 0.5) * candleStep;
            const label = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(candle.timestamp);
            return (
              <text key={candle.timestamp} x={x} y={height - 8} textAnchor="middle" fill="#a1a1aa" fontSize="11">
                {label}
              </text>
            );
          })}

          {/* Last candle date tick (always visible) */}
          {lastCandle && (() => {
            const x = lastCandleX;
            const label = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(lastCandle.timestamp);
            return (
              <text key="last-tick" x={x} y={height - 8} textAnchor="middle" fill="#f97602" fontSize="11" fontWeight="600">
                {label}
              </text>
            );
          })()}
        </svg>
      </div>
    </div>
  );
}

function readPlan(value: Record<string, unknown>): DcaPlan {
  return {
    id: String(value.id),
    name: String(value.name ?? ''),
    contributionAmount: Number(value.contributionAmount ?? value.contribution_amount),
    frequency: String(value.frequency) as DcaFrequency,
    startDate: String(value.startDate ?? value.start_date),
    endDate: String(value.endDate ?? value.end_date),
    initialContribution: Number(value.initialContribution ?? value.initial_contribution ?? 0),
    feePercent: Number(value.feePercent ?? value.fee_percent ?? 0),
    notes: String(value.notes ?? ''),
    status: String(value.status ?? 'active') as PlanStatus,
    createdAt: String(value.createdAt ?? value.created_at ?? new Date().toISOString()),
  };
}

function readPurchase(value: Record<string, unknown>): DcaPurchase {
  return {
    id: String(value.id),
    planId: typeof (value.planId ?? value.plan_id) === 'string'
      ? String(value.planId ?? value.plan_id)
      : null,
    purchaseDate: String(value.purchaseDate ?? value.purchase_date),
    amountUsd: Number(value.amountUsd ?? value.amount_usd),
    btcPrice: Number(value.btcPrice ?? value.btc_price),
    btcReceived: Number(value.btcReceived ?? value.btc_received),
    feesUsd: Number(value.feesUsd ?? value.fees_usd ?? 0),
    transactionId: String(value.transactionId ?? value.transaction_id ?? ''),
    notes: String(value.notes ?? ''),
    depositedToWalletId: typeof (value.depositedToWalletId ?? value.deposited_to_wallet_id) === 'string'
      ? String(value.depositedToWalletId ?? value.deposited_to_wallet_id)
      : null,
    isInWallet: value.isInWallet === true || value.is_in_wallet === true,
    walletTransferDate: typeof (value.walletTransferDate ?? value.wallet_transfer_date) === 'string'
      ? String(value.walletTransferDate ?? value.wallet_transfer_date)
      : null,
  };
}

async function requestJson(url: string, init?: RequestInit): Promise<Record<string, unknown>> {
  const response = await fetch(url, {
    ...init,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  const body: unknown = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      body && typeof body === 'object' && 'error' in body && typeof body.error === 'string'
        ? body.error
        : 'The request could not be completed.';
    throw new Error(message);
  }
  return body as Record<string, unknown>;
}

function PrimaryButton({
  children,
  onClick,
  type = 'button',
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#f97602] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#e06800] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}

function Panel({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`min-w-0 rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6 shadow-xs ${className}`}>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
  hint,
  action,
}: {
  label: string;
  children: ReactNode;
  hint?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="grid min-w-0 gap-2 text-sm font-medium text-zinc-700">
      <div className="flex items-center justify-between gap-2">
        <span className="truncate">{label}</span>
        {action}
      </div>
      {children}
      {hint && <div className="text-xs font-normal text-zinc-500">{hint}</div>}
    </div>
  );
}

const inputClass =
  'min-h-11 w-full min-w-0 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 outline-none transition focus:border-[#f97602] focus:ring-2 focus:ring-orange-500/20 shadow-xs placeholder:text-zinc-400';


function formatChartDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(`${dateStr.slice(0, 10)}T00:00:00.000Z`);
    return new Intl.DateTimeFormat('en', { month: 'short', year: '2-digit', timeZone: 'UTC' }).format(d);
  } catch {
    return dateStr;
  }
}

function formatYAxisCurrency(val: number): string {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `${Math.round(val / 1000)}k`;
  return `${Math.round(val)}`;
}

interface SimulationTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ScheduledPurchase }>;
  valuationMode: 'historical' | 'endPrice';
}

function SimulationTooltip({ active, payload, valuationMode }: SimulationTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0]?.payload;
  if (!item) return null;

  const value = valuationMode === 'historical' ? (item.historicalValue ?? item.portfolioValue) : item.portfolioValue;
  const invested = item.cumulativeContribution;
  const diff = value - invested;
  const pct = invested > 0 ? (diff / invested) * 100 : 0;
  const isGain = diff >= 0;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-3.5 shadow-xl min-w-[240px] text-zinc-900 pointer-events-none">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-2 mb-2 text-xs">
        <span className="font-semibold text-zinc-800">{formatDate(item.date)}</span>
        <span className="font-mono text-zinc-500 font-medium">{formatCurrency(item.price, 0)}/BTC</span>
      </div>
      <div className="space-y-1.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-zinc-500">
            <span className="h-2 w-2 rounded-full bg-zinc-400" />
            Total Invested:
          </span>
          <span className="font-semibold text-zinc-800">{formatCurrency(invested)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-zinc-500">
            <span className="h-2 w-2 rounded-full bg-[#f97602]" />
            Portfolio Value:
          </span>
          <span className="font-bold text-zinc-950 text-sm">{formatCurrency(value)}</span>
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-zinc-100">
          <span className="text-zinc-500">Unrealized P&L:</span>
          <span className={`font-semibold ${isGain ? 'text-emerald-600' : 'text-red-600'}`}>
            {isGain ? '+' : ''}{formatCurrency(diff)} ({isGain ? '+' : ''}{pct.toFixed(1)}%)
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-0.5">
          <span>Accumulated BTC:</span>
          <span className="font-mono text-zinc-600 font-medium">{item.cumulativeBtc.toFixed(8)} BTC</span>
        </div>
      </div>
    </div>
  );
}


interface PortfolioValueTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: { date: string; value?: number; contributions?: number } }>;
  currentPrice: number;
}

function PortfolioValueTooltip({ active, payload, currentPrice }: PortfolioValueTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0]?.payload;
  if (!item) return null;

  const value = item.value ?? 0;
  const spent = item.contributions ?? 0;
  const net = value - spent;
  const pct = spent > 0 ? (net / spent) * 100 : 0;
  const isGain = net >= 0;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-3.5 shadow-xl min-w-[240px] text-zinc-900 pointer-events-none">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-2 mb-2.5 text-xs">
        <span className="font-semibold text-zinc-800">{item.date}</span>
        <span className="font-mono text-zinc-500 font-medium">{formatCurrency(currentPrice, 0)} spot</span>
      </div>
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-zinc-500">
            <span className="h-2 w-2 rounded-full bg-[#f97602]" />
            Portfolio Value:
          </span>
          <span className="font-bold text-zinc-900">{formatCurrency(value)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-zinc-500">
            <span className="h-2 w-2 rounded-full bg-zinc-400" />
            Total Spent:
          </span>
          <span className="font-semibold text-zinc-700">{formatCurrency(spent)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-zinc-100 pt-2">
          <span className="text-zinc-500">Unrealized Return:</span>
          <span className={cn(
            "font-bold inline-flex items-center gap-0.5",
            isGain ? "text-emerald-600" : "text-red-600"
          )}>
            {isGain ? '+' : ''}{formatCurrency(net)} ({isGain ? '+' : ''}{pct.toFixed(1)}%)
          </span>
        </div>
      </div>
    </div>
  );
}

interface AccumulationTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: { date: string; btc?: number; averagePrice?: number } }>;
  currentPrice: number;
}

function AccumulationTooltip({ active, payload, currentPrice }: AccumulationTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0]?.payload;
  if (!item) return null;

  const btc = item.btc ?? 0;
  const sats = Math.round(btc * 100_000_000);
  const avgPrice = item.averagePrice ?? 0;
  const priceDiff = currentPrice > 0 && avgPrice > 0 ? ((currentPrice - avgPrice) / avgPrice) * 100 : null;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-3.5 shadow-xl min-w-[250px] text-zinc-900 pointer-events-none">
      <div className="border-b border-zinc-100 pb-2 mb-2.5 text-xs font-semibold text-zinc-800">
        {item.date}
      </div>
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-zinc-500">
            <span className="h-2 w-2 rounded-full bg-[#0284c7]" />
            Accumulated BTC:
          </span>
          <span className="font-bold text-sky-800 font-mono">{btc.toFixed(6)} BTC</span>
        </div>
        <div className="flex items-center justify-between pl-3.5 text-[11px] text-zinc-500">
          <span>Sats:</span>
          <span className="font-mono font-medium text-zinc-700">{sats.toLocaleString()} sats</span>
        </div>
        <div className="flex items-center justify-between border-t border-zinc-100 pt-2">
          <span className="flex items-center gap-1.5 text-zinc-500">
            <span className="h-2 w-2 rounded-full bg-[#f97602]" />
            Avg Cost / BTC:
          </span>
          <span className="font-bold text-zinc-900">{formatCurrency(avgPrice, 0)}</span>
        </div>
        {priceDiff !== null && (
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-500">vs Current Spot:</span>
            <span className={cn("font-semibold", priceDiff >= 0 ? "text-emerald-600" : "text-zinc-600")}>
              {priceDiff >= 0 ? '+' : ''}{priceDiff.toFixed(1)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

interface MonthlyContributionsTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: { label: string; btc?: number; contributions: number } }>;
}

function MonthlyContributionsTooltip({ active, payload }: MonthlyContributionsTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0]?.payload;
  if (!item) return null;

  const btc = item.btc ?? 0;
  const sats = Math.round(btc * 100_000_000);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-3.5 shadow-xl min-w-[230px] text-zinc-900 pointer-events-none">
      <div className="border-b border-zinc-100 pb-2 mb-2 text-xs font-semibold text-zinc-800">
        {item.label}
      </div>
      <div className="space-y-1.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-zinc-500">Monthly Spending:</span>
          <span className="font-bold text-[#f97602]">{formatCurrency(item.contributions)}</span>
        </div>
        {btc > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-zinc-500">Acquired BTC:</span>
            <span className="font-semibold text-zinc-800 font-mono">{btc.toFixed(6)} BTC</span>
          </div>
        )}
        {sats > 0 && (
          <div className="flex items-center justify-between text-[11px] text-zinc-500">
            <span>Acquired Sats:</span>
            <span className="font-mono text-zinc-700">{sats.toLocaleString()} sats</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DcaExperience() {
  const { isAuthenticated, loading: authLoading, profile, sessionEmail, logout } = useAuth();
  const [linkKeyModalOpen, setLinkKeyModalOpen] = useState(false);
  const [copiedAccountKey, setCopiedAccountKey] = useState(false);

  const isCryptoUser = Boolean(
    sessionEmail?.startsWith('pba_acc_') ||
    profile?.email?.includes('@crypto.pba') ||
    profile?.studentId?.startsWith('pba_acc_')
  );
  const cryptoAccountId = profile?.studentId || (sessionEmail?.startsWith('pba_acc_') ? sessionEmail.split('@')[0] : null);
  const [section, setSection] = useState<Section>('overview');
  const [plans, setPlans] = useState<DcaPlan[]>([]);
  const [purchases, setPurchases] = useState<DcaPurchase[]>([]);
  // --- Watch-only wallet state (additive — does not replace any DCA state) ---
  const [wallets, setWallets] = useState<WalletRecord[]>([]);
  const [walletTxs, setWalletTxs] = useState<WalletTxRecord[]>([]);
  const [walletSnapshots, setWalletSnapshots] = useState<WalletSnapshotRecord[]>([]);
  const [walletError, setWalletError] = useState('');
  const [connectWalletOpen, setConnectWalletOpen] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  const [market, setMarket] = useState<MarketData | null>(null);
  const [marketError, setMarketError] = useState('');
  const [marketLoading, setMarketLoading] = useState(true);
  const [historicalPrices, setHistoricalPrices] = useState<PricePoint[]>([]);
  const [historicalPriceSource, setHistoricalPriceSource] = useState('');
  const [historicalPriceError, setHistoricalPriceError] = useState('');
  const [historicalPriceLoading, setHistoricalPriceLoading] = useState(false);
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [notice, setNotice] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editingPurchaseId, setEditingPurchaseId] = useState<string | null>(null);
  const [planName, setPlanName] = useState('');
  const [planContribution, setPlanContribution] = useState('20');
  const [planFrequency, setPlanFrequency] = useState<DcaFrequency>('weekly');
  const [planStartDate, setPlanStartDate] = useState(todayInputValue);
  const [planEndDate, setPlanEndDate] = useState(() => dateOffset(365));
  const [planInitial, setPlanInitial] = useState('0');
  const [planFee, setPlanFee] = useState('0');
  const [planNotes, setPlanNotes] = useState('');
  const [simContribution, setSimContribution] = useState('20');
  const [simFrequency, setSimFrequency] = useState<DcaFrequency>('weekly');
  const [simStartDate, setSimStartDate] = useState(SIMULATION_START_DATE);
  const [simEndDate, setSimEndDate] = useState(todayInputValue);
  const [simInitial, setSimInitial] = useState('0');
  const [simFee, setSimFee] = useState('0');
  const [purchaseDate, setPurchaseDate] = useState(todayInputValue);
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [purchaseBtc, setPurchaseBtc] = useState('');
  const [purchaseFees, setPurchaseFees] = useState('0');
  const [purchaseTxid, setPurchaseTxid] = useState('');
  const [purchaseNotes, setPurchaseNotes] = useState('');
  const [purchasePlanId, setPurchasePlanId] = useState('');
  const [portfolioFilterId, setPortfolioFilterId] = useState('all');
  const [purchaseWalletId, setPurchaseWalletId] = useState('');
  const [purchaseWalletTransferDate, setPurchaseWalletTransferDate] = useState(todayInputValue);
  const [isBtcManual, setIsBtcManual] = useState(false);
  const purchaseFormRef = useRef<HTMLDivElement>(null);

  const calculateBtc = (amt: string, prc: string) => {
    const a = parseFloat(amt);
    const p = parseFloat(prc);
    if (Number.isFinite(a) && a > 0 && Number.isFinite(p) && p > 0) {
      const btc = a / p;
      return btc.toFixed(8).replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '');
    }
    return '';
  };

  const calculatedBtcFromInputs = useMemo(() => {
    return calculateBtc(purchaseAmount, purchasePrice);
  }, [purchaseAmount, purchasePrice]);

  const handleAmountChange = (val: string) => {
    setPurchaseAmount(val);
    if (!isBtcManual) {
      const calc = calculateBtc(val, purchasePrice);
      if (calc) setPurchaseBtc(calc);
    }
  };

  const handlePriceChange = (val: string) => {
    setPurchasePrice(val);
    if (!isBtcManual) {
      const calc = calculateBtc(purchaseAmount, val);
      if (calc) setPurchaseBtc(calc);
    }
  };

  const handleBtcChange = (val: string) => {
    setPurchaseBtc(val);
    setIsBtcManual(true);
  };

  const handleApplyCalculatedBtc = () => {
    if (calculatedBtcFromInputs) {
      setPurchaseBtc(calculatedBtcFromInputs);
      setIsBtcManual(false);
    }
  };

  const handleUseCurrentSpotPrice = () => {
    if (market?.currentPrice) {
      const spotStr = market.currentPrice.toFixed(2);
      setPurchasePrice(spotStr);
      if (!isBtcManual) {
        const calc = calculateBtc(purchaseAmount, spotStr);
        if (calc) setPurchaseBtc(calc);
      }
    }
  };
  const [marketDays, setMarketDays] = useState('180');
  const [valuationMode, setValuationMode] = useState<'historical' | 'endPrice'>('historical');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          const data = parsed as { plans?: unknown[]; purchases?: unknown[] };
          setPlans(Array.isArray(data.plans)
            ? data.plans.filter((item): item is Record<string, unknown> => !!item && typeof item === 'object').map(readPlan)
            : []);
          setPurchases(Array.isArray(data.purchases)
            ? data.purchases.filter((item): item is Record<string, unknown> => !!item && typeof item === 'object').map(readPurchase)
            : []);
        }
      }
    } catch (error) {
      console.error('Unable to read locally saved DCA records:', error);
      setErrorMessage('Saved browser records could not be read. You can continue and save new records.');
    } finally {
      setStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!storageReady || authLoading || isAuthenticated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ plans, purchases }));
    } catch (error) {
      console.error('Unable to save DCA records in this browser:', error);
      setErrorMessage('This browser could not save your records. Check available storage and try again.');
    }
  }, [plans, purchases, storageReady, authLoading, isAuthenticated]);

  const loadMarket = useCallback(async (days: string) => {
    setMarketLoading(true);
    setMarketError('');
    try {
      const response = await fetch(`/api/dca/market?days=${days}`);
      const data: unknown = await response.json();
      if (!response.ok || !data || typeof data !== 'object') {
        const message = data && typeof data === 'object' && 'error' in data && typeof data.error === 'string'
          ? data.error
          : 'Unable to load current Bitcoin market data.';
        throw new Error(message);
      }
      const result = data as MarketData;
      if (
        !Number.isFinite(result.currentPrice) ||
        !Array.isArray(result.prices) ||
        !Array.isArray(result.candles)
      ) {
        throw new Error('The market data provider returned incomplete information.');
      }
      setMarket(result);
    } catch (error) {
      setMarketError(error instanceof Error ? error.message : 'Unable to load Bitcoin market data.');
    } finally {
      setMarketLoading(false);
    }
  }, []);

  const loadHistoricalPrices = useCallback(async () => {
    setHistoricalPriceLoading(true);
    setHistoricalPriceError('');
    try {
      const response = await fetch('/api/dca/history');
      const data: unknown = await response.json();
      if (!response.ok || !data || typeof data !== 'object') {
        const message =
          data && typeof data === 'object' && 'error' in data && typeof data.error === 'string'
            ? data.error
            : 'Unable to load historical Bitcoin prices.';
        throw new Error(message);
      }

      const result = data as { prices?: unknown; source?: unknown };
      if (
        !Array.isArray(result.prices) ||
        !result.prices.length ||
        !result.prices.every(isPricePoint) ||
        typeof result.source !== 'string'
      ) {
        throw new Error('The historical price provider returned incomplete information.');
      }
      setHistoricalPrices(result.prices);
      setHistoricalPriceSource(result.source);
    } catch (error) {
      setHistoricalPriceError(
        error instanceof Error ? error.message : 'Unable to load historical Bitcoin prices.',
      );
    } finally {
      setHistoricalPriceLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMarket(marketDays);
  }, [loadMarket, marketDays]);

  useEffect(() => {
    const requestedSection = new URLSearchParams(window.location.search).get('section');
    if (requestedSection === 'learn' || requestedSection === 'dashboard') {
      setSection(requestedSection);
    }
  }, []);

  useEffect(() => {
    if (section === 'simulator' && !historicalPrices.length && !historicalPriceError) {
      void loadHistoricalPrices();
    }
  }, [historicalPriceError, historicalPrices.length, loadHistoricalPrices, section]);

  useEffect(() => {
    if (authLoading || !storageReady) return;
    if (!isAuthenticated) return;

    let active = true;
    const loadAccountRecords = async () => {
      try {
        const [planResponse, purchaseResponse, walletResponse] = await Promise.all([
          requestJson('/api/dca/plans'),
          requestJson('/api/dca/purchases'),
          // Load wallets in parallel — failure does not break DCA records
          fetch('/api/dca/wallets', { credentials: 'include' })
            .then(async (response) => {
              const data = await response.json() as {
                error?: string;
                wallets?: unknown[];
                transactions?: unknown[];
                snapshots?: unknown[];
              };
              return response.ok
                ? data
                : { error: data.error || 'Could not load connected wallets.', wallets: [], transactions: [] };
            })
            .catch(() => ({ error: 'Could not load connected wallets.', wallets: [], transactions: [] })),
        ]);
        if (!active) return;
        const accountPlans = Array.isArray(planResponse.plans)
          ? planResponse.plans.filter((item): item is Record<string, unknown> => !!item && typeof item === 'object').map(readPlan)
          : [];
        const accountPurchases = Array.isArray(purchaseResponse.purchases)
          ? purchaseResponse.purchases.filter((item): item is Record<string, unknown> => !!item && typeof item === 'object').map(readPurchase)
          : [];
        setPlans(accountPlans);
        setPurchases(accountPurchases);
        // Load wallet data (additive — does not affect DCA state)
        const walletData = walletResponse as {
          wallets?: unknown[];
          transactions?: unknown[];
          snapshots?: unknown[];
        };
        setWalletError('error' in walletResponse && typeof walletResponse.error === 'string' ? walletResponse.error : '');
        if (Array.isArray(walletData.wallets)) {
          setWallets(walletData.wallets as WalletRecord[]);
        }
        if (Array.isArray(walletData.transactions)) {
          setWalletTxs(walletData.transactions as WalletTxRecord[]);
        }
        if (Array.isArray(walletData.snapshots)) {
          setWalletSnapshots(walletData.snapshots as WalletSnapshotRecord[]);
        }
        setErrorMessage('');
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ plans: accountPlans, purchases: accountPurchases }));
        } catch (error) {
          console.error('Unable to cache account DCA records in this browser:', error);
        }
      } catch (error) {
        if (active) {
          setErrorMessage(error instanceof Error ? error.message : 'Could not load your saved DCA records.');
        }
      }
    };
    void loadAccountRecords();
    return () => {
      active = false;
    };
  }, [authLoading, isAuthenticated, storageReady]);

  const clearMessages = () => {
    setErrorMessage('');
    setNotice('');
  };

  const planSchedule = useMemo(
    () => getScheduledDates(planStartDate, planEndDate, planFrequency),
    [planStartDate, planEndDate, planFrequency],
  );
  const planAmount = Math.max(0, Number(planContribution) || 0);
  const planInitialAmount = Math.max(0, Number(planInitial) || 0);
  const planFeePercent = Math.min(100, Math.max(0, Number(planFee) || 0));
  const plannedContributions = planAmount * planSchedule.length + planInitialAmount;
  const plannedFees = plannedContributions * planFeePercent / 100;
  const estimatedBtc = market?.currentPrice
    ? (plannedContributions - plannedFees) / market.currentPrice
    : null;

  const simulation: DcaSimulation | null = useMemo(() => {
    const amount = Number(simContribution);
    if (!historicalPrices.length || !Number.isFinite(amount) || amount <= 0 || simStartDate > simEndDate) return null;
    const rangeStart = new Date(`${simStartDate}T00:00:00.000Z`).getTime();
    const rangeEnd = new Date(`${simEndDate}T23:59:59.999Z`).getTime();
    const prices = historicalPrices.filter((point) => point.timestamp >= rangeStart - 3 * 86400000 && point.timestamp <= rangeEnd + 3 * 86400000);
    return simulateDca({
      startDate: simStartDate,
      endDate: simEndDate,
      contribution: amount,
      frequency: simFrequency,
      feePercent: Math.min(100, Math.max(0, Number(simFee) || 0)),
      initialContribution: Math.max(0, Number(simInitial) || 0),
      prices,
    });
  }, [historicalPrices, simContribution, simEndDate, simFee, simFrequency, simInitial, simStartDate]);

  const portfolioPurchases = useMemo(() => {
    if (portfolioFilterId === 'all') return purchases;
    if (portfolioFilterId === 'main') return purchases.filter((purchase) => !purchase.planId);
    return purchases.filter((purchase) => purchase.planId === portfolioFilterId);
  }, [portfolioFilterId, purchases]);

  const portfolioLabel = (planId: string | null) => {
    if (!planId) return 'Main portfolio (Other)';
    return plans.find((plan) => plan.id === planId)?.name ?? 'Main portfolio (Other)';
  };

  const purchaseStats = useMemo(() => {
    const totalSpent = portfolioPurchases.reduce((sum, item) => sum + item.amountUsd, 0);
    const totalFees = portfolioPurchases.reduce((sum, item) => sum + item.feesUsd, 0);
    const totalBtc = portfolioPurchases.reduce((sum, item) => sum + item.btcReceived, 0);
    const value = totalBtc * (market?.currentPrice ?? 0);
    return {
      totalSpent,
      totalFees,
      totalBtc,
      value,
      profitLoss: value - totalSpent - totalFees,
      averagePrice: totalBtc > 0 ? (totalSpent + totalFees) / totalBtc : 0,
    };
  }, [portfolioPurchases, market?.currentPrice]);

  const monthlyData = useMemo(() => {
    const buckets = new Map<string, { month: string; contributions: number; btc: number }>();
    for (const purchase of [...portfolioPurchases].sort((a, b) => a.purchaseDate.localeCompare(b.purchaseDate))) {
      const month = purchase.purchaseDate.slice(0, 7);
      const entry = buckets.get(month) ?? { month, contributions: 0, btc: 0 };
      entry.contributions += purchase.amountUsd + purchase.feesUsd;
      entry.btc += purchase.btcReceived;
      buckets.set(month, entry);
    }
    return [...buckets.values()].map((item) => ({
      ...item,
      label: new Intl.DateTimeFormat('en', { month: 'short', year: '2-digit', timeZone: 'UTC' })
        .format(new Date(`${item.month}-01T00:00:00.000Z`)),
    }));
  }, [portfolioPurchases]);

  const purchaseHistory = useMemo(() => {
    let totalSpent = 0;
    let totalBtc = 0;
    return [...portfolioPurchases]
      .sort((a, b) => a.purchaseDate.localeCompare(b.purchaseDate))
      .map((purchase) => {
        totalSpent += purchase.amountUsd + purchase.feesUsd;
        totalBtc += purchase.btcReceived;
        return {
          date: formatDate(purchase.purchaseDate),
          contributions: totalSpent,
          btc: totalBtc,
          value: totalBtc * (market?.currentPrice ?? 0),
          averagePrice: totalBtc > 0 ? totalSpent / totalBtc : 0,
        };
      });
  }, [portfolioPurchases, market?.currentPrice]);

  const latestPurchase = purchaseHistory.length > 0 ? purchaseHistory[purchaseHistory.length - 1] : null;
  const portfolioNetPnl = latestPurchase ? latestPurchase.value - latestPurchase.contributions : 0;
  const portfolioPnlPercent = latestPurchase && latestPurchase.contributions > 0
    ? (portfolioNetPnl / latestPurchase.contributions) * 100
    : 0;
  const isPortfolioGain = portfolioNetPnl >= 0;
  const portfolioCostEfficiency = latestPurchase && market?.currentPrice && latestPurchase.averagePrice > 0
    ? ((market.currentPrice - latestPurchase.averagePrice) / latestPurchase.averagePrice) * 100
    : null;

  const totalMonthlySpent = useMemo(() => {
    return monthlyData.reduce((acc, m) => acc + m.contributions, 0);
  }, [monthlyData]);
  const avgMonthlyContribution = monthlyData.length > 0 ? totalMonthlySpent / monthlyData.length : 0;
  const peakMonthlyEntry = useMemo(() => {
    if (!monthlyData.length) return null;
    return [...monthlyData].sort((a, b) => b.contributions - a.contributions)[0];
  }, [monthlyData]);
  const totalMonthlyBtc = useMemo(() => {
    return monthlyData.reduce((acc, m) => acc + m.btc, 0);
  }, [monthlyData]);

  const updatePlan = useCallback(async (plan: DcaPlan, method: 'POST' | 'PATCH') => {
    if (!isAuthenticated) return plan;
    const body = {
      ...plan,
      ...(method === 'PATCH' ? { id: plan.id } : {}),
    };
    const data = await requestJson('/api/dca/plans', {
      method,
      body: JSON.stringify(body),
    });
    if (!data.plan || typeof data.plan !== 'object') throw new Error('The saved plan could not be confirmed.');
    return readPlan(data.plan as Record<string, unknown>);
  }, [isAuthenticated]);

  const updatePurchase = useCallback(async (purchase: DcaPurchase, method: 'POST' | 'PATCH') => {
    if (!isAuthenticated) return purchase;
    const data = await requestJson('/api/dca/purchases', {
      method,
      body: JSON.stringify({
        ...purchase,
        ...(method === 'PATCH' ? { id: purchase.id } : {}),
      }),
    });
    if (!data.purchase || typeof data.purchase !== 'object') throw new Error('The saved purchase could not be confirmed.');
    return readPurchase(data.purchase as Record<string, unknown>);
  }, [isAuthenticated]);

  const handleSavePlan = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearMessages();
    const contributionAmount = Number(planContribution);
    const initialContribution = Number(planInitial);
    const feePercent = Number(planFee);
    if (
      !planName.trim() ||
      !Number.isFinite(contributionAmount) ||
      contributionAmount <= 0 ||
      !Number.isFinite(initialContribution) ||
      initialContribution < 0 ||
      !Number.isFinite(feePercent) ||
      feePercent < 0 ||
      feePercent > 100 ||
      planStartDate > planEndDate
    ) {
      setErrorMessage('Check the plan name, contribution, fee, and date range.');
      return;
    }

    setSaving(true);
    try {
      const existing = editingPlanId ? plans.find((plan) => plan.id === editingPlanId) : undefined;
      const draft: DcaPlan = {
        id: existing?.id ?? crypto.randomUUID(),
        name: planName.trim(),
        contributionAmount,
        frequency: planFrequency,
        startDate: planStartDate,
        endDate: planEndDate,
        initialContribution,
        feePercent,
        notes: planNotes.trim(),
        status: existing?.status ?? 'active',
        createdAt: existing?.createdAt ?? new Date().toISOString(),
      };
      const saved = await updatePlan(draft, existing ? 'PATCH' : 'POST');
      setPlans((current) => existing
        ? current.map((plan) => plan.id === saved.id ? saved : plan)
        : [saved, ...current]);
      setPlanName('');
      setPlanContribution('20');
      setPlanFrequency('weekly');
      setPlanStartDate(todayInputValue());
      setPlanEndDate(dateOffset(365));
      setPlanInitial('0');
      setPlanFee('0');
      setPlanNotes('');
      setEditingPlanId(null);
      setNotice(existing ? 'Plan updated.' : 'Plan saved.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to save this plan.');
    } finally {
      setSaving(false);
    }
  };

  const beginPlanEdit = (plan: DcaPlan) => {
    clearMessages();
    setEditingPlanId(plan.id);
    setPlanName(plan.name);
    setPlanContribution(String(plan.contributionAmount));
    setPlanFrequency(plan.frequency);
    setPlanStartDate(plan.startDate);
    setPlanEndDate(plan.endDate);
    setPlanInitial(String(plan.initialContribution));
    setPlanFee(String(plan.feePercent));
    setPlanNotes(plan.notes);
    setSection('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const changePlanStatus = async (plan: DcaPlan, status: PlanStatus) => {
    clearMessages();
    setSaving(true);
    try {
      const updated = await updatePlan({ ...plan, status }, 'PATCH');
      setPlans((current) => current.map((item) => item.id === plan.id ? updated : item));
      setNotice(status === 'archived' ? 'Plan archived.' : `Plan ${status}.`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to update this plan.');
    } finally {
      setSaving(false);
    }
  };

  const deletePlan = async (plan: DcaPlan) => {
    clearMessages();
    if (!window.confirm(`Delete “${plan.name}”? This cannot be undone.`)) return;
    setSaving(true);
    try {
      if (isAuthenticated) {
        await requestJson(`/api/dca/plans?id=${encodeURIComponent(plan.id)}`, { method: 'DELETE' });
      }
      setPlans((current) => current.filter((item) => item.id !== plan.id));
      setPurchases((current) => current.map((purchase) =>
        purchase.planId === plan.id ? { ...purchase, planId: null } : purchase
      ));
      if (portfolioFilterId === plan.id) setPortfolioFilterId('all');
      setNotice('Plan deleted.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to delete this plan.');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePurchase = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearMessages();
    const amountUsd = Number(purchaseAmount);
    const btcPrice = Number(purchasePrice);
    const btcReceived = Number(purchaseBtc);
    const feesUsd = Number(purchaseFees);
    if (
      !purchaseDate ||
      !Number.isFinite(amountUsd) ||
      amountUsd <= 0 ||
      !Number.isFinite(btcPrice) ||
      btcPrice <= 0 ||
      !Number.isFinite(btcReceived) ||
      btcReceived <= 0 ||
      !Number.isFinite(feesUsd) ||
      feesUsd < 0
    ) {
      setErrorMessage('Enter a valid date, amount, purchase price, BTC received, and fee.');
      return;
    }

    setSaving(true);
    try {
      const existing = editingPurchaseId
        ? purchases.find((purchase) => purchase.id === editingPurchaseId)
        : undefined;
      const draft: DcaPurchase = {
        id: existing?.id ?? crypto.randomUUID(),
        planId: purchasePlanId || null,
        purchaseDate,
        amountUsd,
        btcPrice,
        btcReceived,
        feesUsd,
        transactionId: purchaseTxid.trim(),
        notes: purchaseNotes.trim(),
        depositedToWalletId: purchaseWalletId || null,
        isInWallet: Boolean(purchaseWalletId),
        walletTransferDate: purchaseWalletId ? purchaseWalletTransferDate : null,
      };
      const saved = await updatePurchase(draft, existing ? 'PATCH' : 'POST');
      setPurchases((current) => existing
        ? current.map((purchase) => purchase.id === saved.id ? saved : purchase)
        : [saved, ...current]);
      resetPurchaseForm();
      setNotice(existing ? 'Purchase record updated.' : 'Purchase recorded.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to save this purchase.');
    } finally {
      setSaving(false);
    }
  };

  const resetPurchaseForm = () => {
    setEditingPurchaseId(null);
    setPurchaseDate(todayInputValue());
    setPurchaseAmount('');
    setPurchasePrice('');
    setPurchaseBtc('');
    setPurchaseFees('0');
    setPurchaseTxid('');
    setPurchaseNotes('');
    setPurchasePlanId('');
    setPurchaseWalletId('');
    setPurchaseWalletTransferDate(todayInputValue());
    setIsBtcManual(false);
  };

  const beginPurchaseEdit = (purchase: DcaPurchase) => {
    clearMessages();
    setEditingPurchaseId(purchase.id);
    setPurchaseDate(purchase.purchaseDate);
    setPurchaseAmount(String(purchase.amountUsd));
    setPurchasePrice(String(purchase.btcPrice));
    setPurchaseBtc(String(purchase.btcReceived));
    setPurchaseFees(String(purchase.feesUsd));
    setPurchaseTxid(purchase.transactionId);
    setPurchaseNotes(purchase.notes);
    setPurchasePlanId(purchase.planId ?? '');
    setPurchaseWalletId(purchase.isInWallet ? purchase.depositedToWalletId ?? '' : '');
    setPurchaseWalletTransferDate(purchase.walletTransferDate ?? todayInputValue());
    setIsBtcManual(true);
    setTimeout(() => {
      purchaseFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 60);
  };

  const deletePurchase = async (purchase: DcaPurchase) => {
    clearMessages();
    if (!window.confirm('Delete this manual purchase record? This cannot be undone.')) return;
    setSaving(true);
    try {
      if (isAuthenticated) {
        await requestJson(`/api/dca/purchases?id=${encodeURIComponent(purchase.id)}`, { method: 'DELETE' });
      }
      setPurchases((current) => current.filter((item) => item.id !== purchase.id));
      if (editingPurchaseId === purchase.id) resetPurchaseForm();
      setNotice('Purchase record deleted.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to delete this purchase.');
    } finally {
      setSaving(false);
    }
  };

  const exportPurchases = () => {
    const rows = [
      ['Date', 'Portfolio', 'Amount USD', 'BTC price USD', 'BTC received', 'Fees USD', 'Transaction ID', 'Notes'],
      ...purchases.map((item) => [
        item.purchaseDate,
        portfolioLabel(item.planId),
        item.amountUsd,
        item.btcPrice,
        item.btcReceived,
        item.feesUsd,
        item.transactionId,
        item.notes,
      ]),
    ];
    const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'pba-dca-purchases.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const marketCandles = useMemo(() => {
    if (!market) return [];
    const start = Date.now() - Number(marketDays) * 24 * 60 * 60 * 1000;
    return market.candles.filter((candle) => candle.timestamp >= start);
  }, [market, marketDays]);

  // --- Wallet callbacks (additive — DCA records unaffected) ---
  const handleWalletConnected = useCallback((
    wallet: WalletRecord,
    transactions: WalletTxRecord[],
    snapshots: WalletSnapshotRecord[],
  ) => {
    setWalletError('');
    setWallets((prev) => [wallet, ...prev.filter((w) => w.id !== wallet.id)]);
    setWalletTxs((prev) => {
      const existing = prev.filter((tx) => tx.wallet_id !== wallet.id);
      return [...transactions, ...existing];
    });
    setWalletSnapshots((prev) => [
      ...prev.filter((snapshot) => snapshot.wallet_id !== wallet.id),
      ...snapshots,
    ]);
  }, []);

  const handleWalletRemoved = useCallback((walletId: string) => {
    setWallets((prev) => prev.filter((w) => w.id !== walletId));
    setWalletTxs((prev) => prev.filter((tx) => tx.wallet_id !== walletId));
    setWalletSnapshots((prev) => prev.filter((snapshot) => snapshot.wallet_id !== walletId));
    setPurchases((prev) => prev.map((purchase) => purchase.depositedToWalletId === walletId
      ? { ...purchase, depositedToWalletId: null, isInWallet: false, walletTransferDate: null }
      : purchase));
  }, []);

  const handleWalletsRefreshed = useCallback((
    updatedWallets: WalletRecord[],
    transactions: WalletTxRecord[],
    snapshots: WalletSnapshotRecord[],
  ) => {
    setWallets((prev) => {
      const updated = new Map(updatedWallets.map((w) => [w.id, w]));
      return prev.map((w) => updated.get(w.id) ?? w);
    });
    setWalletTxs(transactions);
    setWalletSnapshots(snapshots);
  }, []);

  useEffect(() => {
    if (!isAuthenticated || wallets.length === 0) return;

    let active = true;
    let syncing = false;
    const synchronize = async () => {
      if (syncing || document.visibilityState !== 'visible') return;
      syncing = true;
      try {
        const response = await fetch('/api/dca/wallets/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({}),
        });
        const data = await response.json() as {
          error?: string;
          message?: string;
          syncedCount?: number;
          updatedWallets?: WalletRecord[];
          transactions?: WalletTxRecord[];
          snapshots?: WalletSnapshotRecord[];
        };
        if (!response.ok) throw new Error(data.error || 'Automatic wallet refresh failed.');
        if (!active) return;
        handleWalletsRefreshed(data.updatedWallets ?? [], data.transactions ?? [], data.snapshots ?? []);
        setWalletError(
          typeof data.syncedCount === 'number' && data.syncedCount < wallets.length
            ? data.message || 'Some connected wallets could not be refreshed.'
            : '',
        );
      } catch (error) {
        if (active) {
          setWalletError(error instanceof Error ? error.message : 'Automatic wallet refresh failed.');
        }
      } finally {
        syncing = false;
      }
    };

    const timer = window.setInterval(() => void synchronize(), 5 * 60 * 1000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [handleWalletsRefreshed, isAuthenticated, wallets.length]);

  const setSectionAndScroll = (next: Section) => {
    clearMessages();
    const signInRequired = next === 'planner' || next === 'dashboard';
    if (signInRequired && authLoading) return;
    if (signInRequired && !isAuthenticated) {
      setSignInModalOpen(true);
      return;
    }
    setSection(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated && (section === 'planner' || section === 'dashboard')) {
      setSection('overview');
    }
  }, [authLoading, isAuthenticated, section]);

  return (
    <main className="relative min-h-screen w-full bg-[#FFFFFF] text-zinc-900">
      {/* Subtle Bitcoin illustration watermark adapted to clean white theme */}
      <div
        className="pointer-events-none absolute inset-0 bg-[url('/images/bitcoin-bg.jpg')] bg-cover bg-center bg-fixed opacity-[0.035] mix-blend-multiply"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-3 pb-16 pt-6 sm:px-5 lg:px-8 lg:pt-10">
      <header className="mb-6 flex flex-col gap-5 lg:mb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#f97602]">
            <Coins className="h-4 w-4" aria-hidden="true" />
            PBA learning tool
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
            Keep stacking <span className="text-[#f97602]">sats.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 sm:text-base">
            Learn about DCA, explore past prices, and track your purchases.
          </p>
        </div>
        <div className="flex items-start gap-2 rounded-xl border border-cyan-200 bg-cyan-50/70 p-3 text-xs leading-5 text-cyan-900 sm:max-w-sm">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-700" aria-hidden="true" />
          <p>Manual records are unverified.</p>
        </div>
      </header>

      <nav aria-label="DCA sections" className="-mx-3 mb-6 overflow-x-auto px-3 sm:mx-0 sm:px-0">
        <div className="flex min-w-max gap-1.5 rounded-2xl border border-zinc-200 bg-zinc-100/80 p-1.5 shadow-xs">
          {sectionLinks.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setSectionAndScroll(id)}
              disabled={authLoading && (id === 'planner' || id === 'dashboard')}
              aria-current={section === id ? 'page' : undefined}
              aria-label={
                (id === 'planner' || id === 'dashboard') && !isAuthenticated
                  ? `${label} (sign in required)`
                  : undefined
              }
              className={`inline-flex min-h-10 items-center gap-2 rounded-xl px-3.5 text-sm font-semibold transition active:scale-[0.98] ${
                section === id
                  ? 'bg-[#f97602] text-white shadow-xs'
                  : 'text-zinc-600 hover:bg-white hover:text-zinc-900'
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
              {(id === 'planner' || id === 'dashboard') && !isAuthenticated && (
                <LockKeyhole className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
      </nav>

      {errorMessage && (
        <div role="alert" className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-900">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {errorMessage}
        </div>
      )}
      {notice && (
        <div role="status" className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
          <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
          {notice}
        </div>
      )}
      {!authLoading && !isAuthenticated && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-orange-200 bg-orange-50/70 p-3.5 text-sm text-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f97602] text-white shrink-0">
              <Key className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-zinc-900">Private-key account</p>
              <p className="text-xs text-zinc-600">Access saved plans with your private key.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSignInModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#f97602] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#d46200] transition cursor-pointer"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Access DCA Account
          </button>
        </div>
      )}
      {!authLoading && isAuthenticated && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-50/80 px-3.5 py-2.5 text-xs text-zinc-700">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            {isCryptoUser ? (
              <span className="flex flex-wrap items-center gap-1.5">
                <span className="font-semibold text-zinc-800">Authenticated via Private Key:</span>
                <span className="font-mono bg-white px-2 py-0.5 rounded border border-zinc-200 text-zinc-900">{cryptoAccountId}</span>
                <button
                  type="button"
                  onClick={() => {
                    if (cryptoAccountId) {
                      navigator.clipboard.writeText(cryptoAccountId);
                      setCopiedAccountKey(true);
                      setTimeout(() => setCopiedAccountKey(false), 2000);
                    }
                  }}
                  className="text-[#f97602] hover:underline cursor-pointer"
                >
                  {copiedAccountKey ? 'Copied' : 'Copy ID'}
                </button>
              </span>
            ) : (
              <span className="flex flex-wrap items-center gap-1.5">
                <span>Signed in as <strong className="text-zinc-900">{profile?.email || sessionEmail}</strong></span>
                <button
                  type="button"
                  onClick={() => setLinkKeyModalOpen(true)}
                  className="ml-2 font-medium text-[#f97602] underline decoration-orange-300 hover:text-[#d46200] cursor-pointer"
                >
                  Link private key
                </button>
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => void logout()}
            className="font-medium text-zinc-500 hover:text-zinc-900 transition flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        </div>
      )}

      {section === 'overview' && (
        <div className="space-y-5">
          {marketError && <MarketError message={marketError} onRetry={() => void loadMarket(marketDays)} />}
          <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
            <Panel className="border-zinc-200 bg-white">
              <div className="relative">
                <p className="text-sm font-semibold text-[#f97602]">A steady schedule. A clearer picture.</p>
                <h2 className="mt-2 max-w-2xl text-2xl font-bold leading-tight text-zinc-900 sm:text-3xl">
                  Understand the trade-offs before you make a plan.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
                  Learn how DCA works, then compare a sample schedule with historical prices.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <PrimaryButton onClick={() => setSectionAndScroll('learn')}>
                    Learn the basics <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </PrimaryButton>
                  <button
                    type="button"
                    onClick={() => setSectionAndScroll('simulator')}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-bold text-zinc-800 shadow-xs transition hover:bg-zinc-50 active:scale-[0.98]"
                  >
                    Explore a historical simulation
                  </button>
                </div>
              </div>
            </Panel>
            <MarketSnapshot
              market={market}
              loading={marketLoading}
              error={marketError}
              onRetry={() => void loadMarket(marketDays)}
              onOpen={() => setSectionAndScroll('market')}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <InfoCard
              number="01"
              title="Learn"
              text="Learn about schedules, fees, and volatility."
              action="Read the lessons"
              onClick={() => setSectionAndScroll('learn')}
            />
            <InfoCard
              number="02"
              title="Plan"
              text="Set contribution amounts and dates."
              action="Build a hypothetical plan"
              onClick={() => setSectionAndScroll('planner')}
            />
            <InfoCard
              number="03"
              title="Track"
              text="Record purchases and view your portfolio."
              action="Open your dashboard"
              onClick={() => setSectionAndScroll('dashboard')}
            />
          </div>

          <Panel className="flex flex-col gap-4 border-orange-200 bg-orange-50/60 sm:flex-row sm:items-start">
            <Lightbulb className="h-5 w-5 shrink-0 text-[#f97602]" aria-hidden="true" />
            <div>
              <h2 className="font-semibold text-zinc-900">What DCA does—and does not do</h2>
              <p className="mt-1 text-sm leading-6 text-zinc-600">
                Regular buys don’t guarantee gains or prevent losses.
              </p>
            </div>
          </Panel>
        </div>
      )}

      {section === 'learn' && (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
          <Panel>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f97602]">Learn DCA</p>
            <h2 className="mt-2 text-2xl font-bold text-zinc-900">A beginner’s guide to recurring purchases</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
              Short lessons on DCA, fees, and risk.
            </p>
            <div className="mt-5 divide-y divide-zinc-200">
              {lessons.map((lesson, index) => (
                <details key={lesson.title} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center gap-3 text-left font-semibold text-zinc-900 marker:hidden">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-[#f97602]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1">{lesson.title}</span>
                    <span className="text-zinc-400 font-bold text-lg transition group-open:rotate-45" aria-hidden="true">+</span>
                  </summary>
                  <p className="ml-11 mt-3 max-w-3xl text-sm leading-6 text-zinc-600">{lesson.body}</p>
                </details>
              ))}
            </div>
          </Panel>
          <div className="space-y-4">
            <Panel>
              <BookOpen className="h-5 w-5 text-[#f97602]" aria-hidden="true" />
              <h3 className="mt-3 font-semibold text-zinc-900">Quick knowledge check</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Can DCA guarantee a profit?
              </p>
              <details className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <summary className="cursor-pointer text-sm font-semibold text-[#f97602]">Show answer</summary>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  No. It changes timing, not price risk.
                </p>
              </details>
            </Panel>
            <Panel className="border-red-200 bg-red-50/50">
              <CircleAlert className="h-5 w-5 text-red-600" aria-hidden="true" />
              <h3 className="mt-3 font-semibold text-zinc-900">Risk reminder</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Bitcoin is volatile. Don’t risk money needed for essentials.
              </p>
            </Panel>
            <PrimaryButton onClick={() => setSectionAndScroll('planner')}>
              Try the planner <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </PrimaryButton>
          </div>
        </div>
      )}

      {section === 'planner' && (
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
          <Panel>
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f97602]">Hypothetical plan</p>
              <h2 className="mt-2 text-2xl font-bold text-zinc-900">{editingPlanId ? 'Edit your plan' : 'Build a DCA plan'}</h2>
            </div>
            <form onSubmit={handleSavePlan} className="grid gap-4 sm:grid-cols-2">
              <Field label="Plan name">
                <input className={inputClass} value={planName} onChange={(event) => setPlanName(event.target.value)} maxLength={100} required placeholder="e.g. Learning plan" />
              </Field>
              <Field label="Contribution amount (USD)">
                <input className={inputClass} type="number" min="0.01" step="0.01" value={planContribution} onChange={(event) => setPlanContribution(event.target.value)} required />
              </Field>
              <Field label="Purchase frequency">
                <select className={inputClass} value={planFrequency} onChange={(event) => setPlanFrequency(event.target.value as DcaFrequency)}>
                  <option value="daily">Daily</option><option value="weekly">Weekly</option><option value="biweekly">Biweekly</option><option value="monthly">Monthly</option>
                </select>
              </Field>
              <Field label="Estimated fee (%)" hint="Deducted from each contribution.">
                <input className={inputClass} type="number" min="0" max="100" step="0.01" value={planFee} onChange={(event) => setPlanFee(event.target.value)} />
              </Field>
              <Field label="Start date">
                <input className={inputClass} type="date" value={planStartDate} onChange={(event) => setPlanStartDate(event.target.value)} required />
              </Field>
              <Field label="End date">
                <input className={inputClass} type="date" min={planStartDate} value={planEndDate} onChange={(event) => setPlanEndDate(event.target.value)} required />
              </Field>
              <Field label="Optional initial contribution (USD)">
                <input className={inputClass} type="number" min="0" step="0.01" value={planInitial} onChange={(event) => setPlanInitial(event.target.value)} />
              </Field>
              <Field label="Notes or personal goal">
                <input className={inputClass} maxLength={2000} value={planNotes} onChange={(event) => setPlanNotes(event.target.value)} placeholder="Optional" />
              </Field>
              <div className="flex flex-wrap gap-2 sm:col-span-2">
                <PrimaryButton type="submit" disabled={saving}>
                  {saving ? 'Saving…' : editingPlanId ? <><Check className="h-4 w-4" /> Update plan</> : <><Plus className="h-4 w-4" /> Save plan</>}
                </PrimaryButton>
                {editingPlanId && (
                  <button type="button" className="min-h-11 rounded-xl border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 shadow-xs" onClick={() => { setEditingPlanId(null); setPlanName(''); }}>
                    Cancel editing
                  </button>
                )}
              </div>
            </form>
          </Panel>

          <div className="space-y-5">
            <Panel>
              <h3 className="font-semibold text-zinc-900">Plan estimate</h3>
              <p className="mt-1 text-xs leading-5 text-zinc-500">BTC estimate uses today’s price, not a forecast.</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Metric label="Scheduled purchases" value={String(planSchedule.length + (planInitialAmount > 0 ? 1 : 0))} />
                <Metric label="Planned contributions" value={formatCurrency(plannedContributions)} />
                <Metric label="Estimated fees" value={formatCurrency(plannedFees)} />
                <Metric label="Illustrative BTC" value={estimatedBtc === null ? 'Market unavailable' : formatBtc(estimatedBtc)} />
              </div>
              {market && <p className="mt-3 text-xs text-zinc-400">Illustration uses {formatCurrency(market.currentPrice)} per BTC, fetched {new Date(market.lastUpdated).toLocaleString()}.</p>}
            </Panel>

            <Panel>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-zinc-900">Your plans</h3>
                  <p className="mt-1 text-xs text-zinc-500">{plans.length} saved plan{plans.length === 1 ? '' : 's'}</p>
                </div>
                <CalendarDays className="h-5 w-5 text-[#f97602]" aria-hidden="true" />
              </div>
              {plans.length === 0 ? (
                <p className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 p-4 text-sm text-zinc-500">Your saved plans will appear here.</p>
              ) : (
                <div className="space-y-3">
                  {plans.map((plan) => (
                    <article key={plan.id} className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-3">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h4 className="break-words font-semibold text-zinc-900">{plan.name}</h4>
                          <p className="mt-1 text-sm text-zinc-600">
                            {formatCurrency(plan.contributionAmount)} · {plan.frequency} · {formatDate(plan.startDate)} – {formatDate(plan.endDate)}
                          </p>
                          <p className="mt-1 text-xs capitalize text-zinc-500">
                            {plan.status}{plan.status === 'active' && ` · next date ${getNextPurchaseDate(plan.startDate, plan.frequency) ?? 'not scheduled'}`}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          <IconButton label="Edit plan" onClick={() => beginPlanEdit(plan)}><Pencil /></IconButton>
                          {plan.status === 'active'
                            ? <IconButton label="Pause plan" onClick={() => void changePlanStatus(plan, 'paused')}><Clock3 /></IconButton>
                            : plan.status === 'paused'
                              ? <IconButton label="Resume plan" onClick={() => void changePlanStatus(plan, 'active')}><Play /></IconButton>
                              : <IconButton label="Restore plan" onClick={() => void changePlanStatus(plan, 'active')}><RefreshCw /></IconButton>}
                          {plan.status !== 'archived' && <IconButton label="Archive plan" onClick={() => void changePlanStatus(plan, 'archived')}><Archive /></IconButton>}
                          <IconButton label="Delete plan" onClick={() => void deletePlan(plan)}><Trash2 /></IconButton>
                        </div>
                      </div>
                      {plan.notes && <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-500">{plan.notes}</p>}
                    </article>
                  ))}
                </div>
              )}
            </Panel>
          </div>
        </div>
      )}

      {section === 'simulator' && (
        <div className="space-y-5">
          <Panel>
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f97602]">Historical what-if</p>
                <h2 className="mt-2 text-2xl font-bold text-zinc-900">Test a schedule against historical prices</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
                  Uses the nearest price for each date; skips gaps over three days.
                </p>
                <p className="mt-2 text-xs text-zinc-500">
                  Historical market-price data from January 2020 onward{historicalPriceSource ? ` · Source: ${historicalPriceSource}` : ''}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => void loadHistoricalPrices()}
                disabled={historicalPriceLoading}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-zinc-300 bg-white px-3 text-sm font-semibold text-zinc-700 shadow-xs hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" /> {historicalPriceLoading ? 'Loading history…' : 'Reload history from 2020'}
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Contribution (USD)">
                <input className={inputClass} type="number" min="0.01" step="0.01" value={simContribution} onChange={(event) => setSimContribution(event.target.value)} />
              </Field>
              <Field label="Frequency">
                <select className={inputClass} value={simFrequency} onChange={(event) => setSimFrequency(event.target.value as DcaFrequency)}>
                  <option value="daily">Daily</option><option value="weekly">Weekly</option><option value="biweekly">Biweekly</option><option value="monthly">Monthly</option>
                </select>
              </Field>
              <Field label="Estimated fee (%)">
                <input className={inputClass} type="number" min="0" max="100" step="0.01" value={simFee} onChange={(event) => setSimFee(event.target.value)} />
              </Field>
              <Field label="Start date" hint={historicalPrices[0] ? `From ${formatDate(new Date(historicalPrices[0].timestamp).toISOString().slice(0, 10))}` : 'From Jan 1, 2020.'}>
                <input className={inputClass} type="date" min={SIMULATION_START_DATE} max={todayInputValue()} value={simStartDate} onChange={(event) => setSimStartDate(event.target.value)} />
              </Field>
              <Field label="End date">
                <input className={inputClass} type="date" min={simStartDate} max={todayInputValue()} value={simEndDate} onChange={(event) => setSimEndDate(event.target.value)} />
              </Field>
              <Field label="Optional initial contribution (USD)">
                <input className={inputClass} type="number" min="0" step="0.01" value={simInitial} onChange={(event) => setSimInitial(event.target.value)} />
              </Field>
            </div>
          </Panel>

          {historicalPriceError ? <MarketError message={historicalPriceError} onRetry={() => void loadHistoricalPrices()} /> : null}
          {historicalPriceLoading && <LoadingPanel text="Loading historical Bitcoin prices from 2020…" />}
          {!historicalPriceLoading && !historicalPriceError && simulation && (
            <>
              {simulation.purchases.length === 0 ? (
                <Panel><p className="text-sm text-zinc-600">No prices for these dates. Choose a range with historical data.</p></Panel>
              ) : (
                <>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <MetricPanel label="Contributions" value={formatCurrency(simulation.totalContributions)} />
                    <MetricPanel label="Hypothetical BTC" value={formatBtc(simulation.totalBtc)} />
                    <MetricPanel label="Average acquisition price" value={formatCurrency(simulation.averagePrice)} />
                    <MetricPanel label="Value at period end" value={formatCurrency(simulation.portfolioValue)} detail={`${simulation.profitLoss >= 0 ? '+' : ''}${formatCurrency(simulation.profitLoss)} hypothetical difference`} />
                  </div>
                  <Panel className="border-zinc-200 bg-white shadow-xs">
                    {/* Header with Title and Interactive Valuation Mode Toggle */}
                    <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-100 pb-4">
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-zinc-900">
                          Contributions and hypothetical value
                        </h3>
                        <p className="mt-0.5 text-xs text-zinc-500">
                          {valuationMode === 'historical'
                            ? "Value uses Bitcoin's daily price for each date."
                            : `Value at the period-end price (${formatCurrency(simulation.endPrice)}).`}
                        </p>
                      </div>

                      {/* Valuation Switcher */}
                      <div className="inline-flex rounded-xl border border-zinc-200 bg-zinc-100/80 p-1 self-start sm:self-auto shrink-0 shadow-xs">
                        <button
                          type="button"
                          onClick={() => setValuationMode('historical')}
                          className={cn(
                            "rounded-lg px-3 py-1.5 text-xs font-semibold transition active:scale-95 touch-manipulation",
                            valuationMode === 'historical'
                              ? "bg-[#f97602] text-white shadow-xs"
                              : "text-zinc-600 hover:text-zinc-900 hover:bg-white"
                          )}
                        >
                          Historical Market Value
                        </button>
                        <button
                          type="button"
                          onClick={() => setValuationMode('endPrice')}
                          className={cn(
                            "rounded-lg px-3 py-1.5 text-xs font-semibold transition active:scale-95 touch-manipulation",
                            valuationMode === 'endPrice'
                              ? "bg-[#f97602] text-white shadow-xs"
                              : "text-zinc-600 hover:text-zinc-900 hover:bg-white"
                          )}
                        >
                          Period-End Value ({formatCurrency(simulation.endPrice, 0)})
                        </button>
                      </div>
                    </div>

                    {/* Rich Interactive Legend and Metric Bar */}
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200/80 bg-zinc-50/80 p-3 text-xs">
                      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                        {/* Total Contributions */}
                        <div className="flex items-center gap-2">
                          <span className="flex h-3 w-4 items-center justify-center">
                            <span className="h-0.5 w-4 border-b-2 border-dashed border-zinc-500" />
                          </span>
                          <span className="text-zinc-500 font-medium">Total Invested:</span>
                          <span className="font-bold text-zinc-800">{formatCurrency(simulation.totalContributions)}</span>
                        </div>

                        {/* Portfolio Value */}
                        <div className="flex items-center gap-2">
                          <span className="flex h-3 w-4 items-center justify-center">
                            <span className="h-1 w-4 rounded-full bg-[#f97602]" />
                          </span>
                          <span className="text-zinc-500 font-medium">Portfolio Value:</span>
                          <span className="font-bold text-zinc-900">{formatCurrency(simulation.portfolioValue)}</span>
                        </div>

                        {/* Profit / Loss Badge */}
                        <div className="flex items-center gap-1.5">
                          <span className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                            simulation.profitLoss >= 0
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-red-100 text-red-800 border border-red-200"
                          )}>
                            {simulation.profitLoss >= 0 ? '+' : ''}
                            {simulation.totalContributions > 0 ? ((simulation.profitLoss / simulation.totalContributions) * 100).toFixed(1) : '0.0'}%
                            {' '}({simulation.profitLoss >= 0 ? '+' : ''}{formatCurrency(simulation.profitLoss)})
                          </span>
                        </div>
                      </div>

                      {/* Period Metadata */}
                      <div className="flex items-center gap-3 text-zinc-500 text-[11px]">
                        <span>Fees: <strong className="text-zinc-700">{formatCurrency(simulation.totalFees)}</strong></span>
                        <span>·</span>
                        <span>End Price: <strong className="text-zinc-700">{formatCurrency(simulation.endPrice)}</strong></span>
                      </div>
                    </div>

                    {/* Graphical Chart with Gradient Fills and Clean Ticks */}
                    <div className="h-80 sm:h-96 w-full min-w-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={simulation.purchases} margin={{ top: 12, right: 12, left: 0, bottom: 4 }}>
                          <defs>
                            <linearGradient id="dcaValueGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#f97602" stopOpacity={0.30} />
                              <stop offset="95%" stopColor="#f97602" stopOpacity={0.01} />
                            </linearGradient>
                            <linearGradient id="dcaContribGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#71717a" stopOpacity={0.12} />
                              <stop offset="95%" stopColor="#71717a" stopOpacity={0.01} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
                          <XAxis
                            dataKey="date"
                            tick={{ fill: '#71717a', fontSize: 11 }}
                            minTickGap={40}
                            tickFormatter={formatChartDate}
                            axisLine={{ stroke: '#e4e4e7' }}
                            tickLine={{ stroke: '#e4e4e7' }}
                          />
                          <YAxis
                            tick={{ fill: '#71717a', fontSize: 11 }}
                            tickFormatter={formatYAxisCurrency}
                            width={56}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip content={<SimulationTooltip valuationMode={valuationMode} />} />
                          <Area
                            type="monotone"
                            dataKey="cumulativeContribution"
                            name="Total Invested"
                            stroke="#71717a"
                            strokeWidth={1.75}
                            strokeDasharray="4 4"
                            fill="url(#dcaContribGrad)"
                          />
                          <Area
                            type="monotone"
                            dataKey={valuationMode === 'historical' ? 'historicalValue' : 'portfolioValue'}
                            name="Portfolio Value"
                            stroke="#f97602"
                            strokeWidth={2.5}
                            fill="url(#dcaValueGrad)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {simulation.skippedPurchases > 0 && (
                      <p className="mt-3 flex items-start gap-2 text-sm text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                        <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                        {simulation.skippedPurchases} scheduled purchase{simulation.skippedPurchases === 1 ? ' was' : 's were'} skipped because no nearby historical price was available.
                      </p>
                    )}
                  </Panel>
                  <Panel>
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-zinc-900">Historical purchase schedule</h3>
                      <p className="text-xs text-zinc-500">{simulation.purchases.length} matched purchases</p>
                    </div>
                    <div className="max-h-80 overflow-auto">
                      <table className="w-full min-w-[560px] text-left text-sm">
                        <thead className="sticky top-0 bg-zinc-100 text-xs uppercase text-zinc-600 border-b border-zinc-200">
                          <tr><th className="p-3">Date</th><th className="p-3">Price</th><th className="p-3">Contribution</th><th className="p-3">BTC</th><th className="p-3">Fees</th></tr>
                        </thead>
                        <tbody>
                          {simulation.purchases.map((item, index) => (
                            <tr key={`${item.date}-${index}`} className="border-t border-zinc-200 text-zinc-800 hover:bg-zinc-50">
                              <td className="p-3">{formatDate(item.date)}</td><td className="p-3">{formatCurrency(item.price)}</td><td className="p-3">{formatCurrency(item.contribution)}</td><td className="p-3">{item.btc.toFixed(8)}</td><td className="p-3">{formatCurrency(item.fees)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Panel>
                </>
              )}
            </>
          )}
          {!historicalPriceLoading && !historicalPriceError && !simulation && (
            <Panel><p className="text-sm text-zinc-600">Enter a positive contribution and a valid date range to view a simulation.</p></Panel>
          )}
          <p className="text-xs leading-5 text-zinc-400">
            Historical results are illustrative, not predictive. Source: {historicalPriceSource || 'Blockchain.com'}.
          </p>
        </div>
      )}

      {section === 'dashboard' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="mt-2 text-2xl font-bold text-zinc-900">Your purchase journal</h2>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <label className="flex min-h-11 items-center gap-2 rounded-xl border border-zinc-300 bg-white px-3 text-sm text-zinc-600">
                <span className="font-semibold">Portfolio</span>
                <select
                  className="max-w-48 bg-transparent font-semibold text-zinc-900 outline-none"
                  value={portfolioFilterId}
                  onChange={(event) => setPortfolioFilterId(event.target.value)}
                  aria-label="Filter portfolio records"
                >
                  <option value="all">All portfolios</option>
                  <option value="main">Main portfolio (Other)</option>
                  {plans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name}</option>)}
                </select>
              </label>
              <button
                type="button"
                onClick={() => setConnectWalletOpen(true)}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#f97602] bg-orange-50 px-4 text-sm font-semibold text-[#f97602] shadow-xs hover:bg-orange-100 transition-colors"
              >
                <Wallet className="h-4 w-4" aria-hidden="true" />
                Connect Bitcoin Wallet
              </button>
              <button type="button" onClick={exportPurchases} disabled={!purchases.length} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-700 shadow-xs hover:bg-zinc-50 disabled:opacity-40">
                <Download className="h-4 w-4" aria-hidden="true" /> Export CSV
              </button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <MetricPanel label="Recorded spending" value={formatCurrency(purchaseStats.totalSpent)} detail="Excludes fees" />
            <MetricPanel label="Manual BTC total" value={formatBtc(purchaseStats.totalBtc)} />
            <MetricPanel label="Illustrative current value" value={market ? formatCurrency(purchaseStats.value) : 'Unavailable'} />
            <MetricPanel label="Average cost basis" value={purchaseStats.averagePrice ? formatCurrency(purchaseStats.averagePrice) : '—'} />
            <MetricPanel label="Difference after fees" value={formatCurrency(purchaseStats.profitLoss)} detail={`Recorded fees: ${formatCurrency(purchaseStats.totalFees)}`} />
          </div>
          {!market && <MarketError message={marketError || 'Current market price is unavailable; portfolio value cannot be calculated.'} onRetry={() => void loadMarket('180')} />}

          <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <div ref={purchaseFormRef} className="scroll-mt-6">
              <Panel className={cn("transition-all duration-300", editingPurchaseId && "ring-2 ring-[#f97602] border-[#f97602]/60 shadow-lg shadow-orange-500/10")}>
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {editingPurchaseId ? (
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-100 text-[#f97602]">
                          <Pencil className="h-4 w-4" />
                        </span>
                      ) : (
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
                          <Plus className="h-4 w-4" />
                        </span>
                      )}
                      <div>
                        <h3 className="font-semibold text-zinc-900">
                          {editingPurchaseId ? 'Edit purchase record' : 'Record a purchase'}
                        </h3>
                        {editingPurchaseId && (
                          <p className="text-xs text-[#f97602] font-medium">
                            Updating entry from {formatDate(purchaseDate)}
                          </p>
                        )}
                      </div>
                    </div>
                    {editingPurchaseId && (
                      <button
                        type="button"
                        onClick={resetPurchaseForm}
                        className="text-xs font-semibold text-zinc-500 hover:text-zinc-800 underline cursor-pointer"
                      >
                        Cancel edit
                      </button>
                    )}
                  </div>
                  {editingPurchaseId && (
                    <div className="mt-3 rounded-xl border border-orange-200/90 bg-orange-50/80 p-2.5 text-xs text-orange-950 animate-in fade-in duration-200">
                      <span className="font-medium">
                        Now editing this record. Adjust any field below and click <strong>Update record</strong>.
                      </span>
                    </div>
                  )}
                </div>
                <form onSubmit={handleSavePurchase} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <Field
                  label="Add to portfolio"
                  hint="Assign this purchase to a saved plan or the main portfolio."
                >
                  <select
                    className={inputClass}
                    value={purchasePlanId}
                    onChange={(event) => setPurchasePlanId(event.target.value)}
                  >
                    <option value="">Main portfolio (Other)</option>
                    {plans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name}</option>)}
                  </select>
                </Field>
                <Field label="Purchase date">
                  <input className={inputClass} type="date" value={purchaseDate} onChange={(event) => setPurchaseDate(event.target.value)} required />
                </Field>
                <Field label="Amount spent (USD)">
                  <input className={inputClass} type="number" min="0.01" step="0.01" value={purchaseAmount} onChange={(event) => handleAmountChange(event.target.value)} placeholder="e.g. 100" required />
                </Field>
                <Field
                  label="Bitcoin price at purchase (USD)"
                  action={
                    market?.currentPrice ? (
                      <button
                        type="button"
                        onClick={handleUseCurrentSpotPrice}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#f97602] hover:underline cursor-pointer"
                        title="Use current spot price"
                      >
                        <Coins className="h-3 w-3" />
                        Use spot ({formatCurrency(market.currentPrice, 0)})
                      </button>
                    ) : null
                  }
                >
                  <input className={inputClass} type="number" min="0.01" step="0.01" value={purchasePrice} onChange={(event) => handlePriceChange(event.target.value)} placeholder="e.g. 120000" required />
                </Field>
                <Field
                  label="BTC received"
                  action={
                    calculatedBtcFromInputs ? (
                      <button
                        type="button"
                        onClick={handleApplyCalculatedBtc}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#f97602] hover:underline cursor-pointer"
                        title="Recalculate exact BTC: Amount spent ÷ Price"
                      >
                        <Calculator className="h-3 w-3" />
                        {isBtcManual ? 'Recalculate (Amount ÷ Price)' : 'Auto-calculated'}
                      </button>
                    ) : null
                  }
                  hint={
                    calculatedBtcFromInputs ? (
                      <div className="flex flex-col gap-0.5 text-[11px] text-zinc-500 mt-1">
                        <span className="font-mono text-zinc-700">
                          Formula: ${Number(purchaseAmount || 0).toLocaleString()} ÷ ${Number(purchasePrice || 0).toLocaleString()} = <strong className="text-[#f97602] font-bold">{calculatedBtcFromInputs} BTC</strong>
                        </span>
                        {isBtcManual && purchaseBtc !== calculatedBtcFromInputs && (
                          <span className="text-amber-600 font-medium">Custom BTC amount. Recalculate to use amount ÷ price.</span>
                        )}
                      </div>
                    ) : (
                      'Enter BTC received, or provide amount and price to calculate it.'
                    )
                  }
                >
                  <input className={inputClass} type="number" min="0.00000001" step="0.00000001" value={purchaseBtc} onChange={(event) => handleBtcChange(event.target.value)} placeholder="e.g. 0.00083333" required />
                </Field>
                <Field label="Transaction fees (USD)">
                  <input className={inputClass} type="number" min="0" step="0.01" value={purchaseFees} onChange={(event) => setPurchaseFees(event.target.value)} />
                </Field>
                <Field label="Optional transaction ID">
                  <input className={inputClass} maxLength={200} value={purchaseTxid} onChange={(event) => setPurchaseTxid(event.target.value)} />
                </Field>
                {wallets.length > 0 && (
                  <Field
                    label="Already held in a connected wallet?"
                    hint="Select a wallet only if this BTC is already included in its balance."
                  >
                    <select
                      className={inputClass}
                      value={purchaseWalletId}
                      onChange={(event) => setPurchaseWalletId(event.target.value)}
                    >
                      <option value="">No — keep separate from wallet holdings</option>
                      {wallets.map((wallet) => (
                        <option key={wallet.id} value={wallet.id}>{wallet.label}</option>
                      ))}
                    </select>
                  </Field>
                )}
                {purchaseWalletId && (
                  <Field
                    label="Date included in connected wallet"
                    hint="Date the BTC arrived in this wallet."
                  >
                    <input
                      className={inputClass}
                      type="date"
                      value={purchaseWalletTransferDate}
                      onChange={(event) => setPurchaseWalletTransferDate(event.target.value)}
                      required
                    />
                  </Field>
                )}
                <Field label="Notes">
                  <textarea className={`${inputClass} min-h-20 resize-y`} maxLength={2000} value={purchaseNotes} onChange={(event) => setPurchaseNotes(event.target.value)} />
                </Field>
                <div className="flex flex-wrap gap-2 sm:col-span-2 xl:col-span-1">
                  <PrimaryButton type="submit" disabled={saving}>
                    {saving ? 'Saving…' : editingPurchaseId ? 'Update record' : 'Save purchase'}
                  </PrimaryButton>
                  {editingPurchaseId && <button type="button" onClick={resetPurchaseForm} className="min-h-11 rounded-xl border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 shadow-xs">Cancel</button>}
                </div>
              </form>
            </Panel>
          </div>

            <div className="space-y-5">
              {purchaseHistory.length > 0 && (
                <>
                  {/* Fintech Card: Portfolio value vs. recorded spending */}
                  <Panel className="border-zinc-200/90 bg-white shadow-xs overflow-hidden">
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-zinc-100 pb-5">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="inline-flex h-2 w-2 rounded-full bg-[#f97602]" />
                          <span className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                            Portfolio Performance
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-zinc-900 tracking-tight">
                          Portfolio value vs. recorded spending
                        </h3>
                      </div>

                      {latestPurchase && (
                        <div className="flex flex-wrap items-baseline sm:flex-col sm:items-end gap-2 sm:gap-1 bg-zinc-50/80 sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-zinc-100">
                          <div className="text-xs text-zinc-500 font-medium">Current Portfolio Value</div>
                          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                            {formatCurrency(latestPurchase.value)}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold border",
                                isPortfolioGain
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                              )}
                            >
                              {isPortfolioGain ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                              {isPortfolioGain ? '+' : ''}{formatCurrency(portfolioNetPnl)} ({isPortfolioGain ? '+' : ''}{portfolioPnlPercent.toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* KPI Stat Bar */}
                    <div className="mb-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                      <div className="rounded-xl border border-zinc-100 bg-zinc-50/60 p-3">
                        <span className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wide">Total Spent</span>
                        <span className="text-sm sm:text-base font-bold text-zinc-800">{formatCurrency(latestPurchase?.contributions ?? 0)}</span>
                      </div>
                      <div className="rounded-xl border border-zinc-100 bg-zinc-50/60 p-3">
                        <span className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wide">Accumulated</span>
                        <span className="text-sm sm:text-base font-bold text-zinc-800 font-mono">{(latestPurchase?.btc ?? 0).toFixed(6)} BTC</span>
                      </div>
                      <div className="rounded-xl border border-zinc-100 bg-zinc-50/60 p-3">
                        <span className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wide">Current Price</span>
                        <span className="text-sm sm:text-base font-bold text-[#f97602]">{formatCurrency(market?.currentPrice ?? 0, 0)}</span>
                      </div>
                      <div className="rounded-xl border border-zinc-100 bg-zinc-50/60 p-3">
                        <span className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wide">All-Time ROI</span>
                        <span className={cn("text-sm sm:text-base font-bold", isPortfolioGain ? "text-emerald-600" : "text-red-600")}>
                          {isPortfolioGain ? '+' : ''}{portfolioPnlPercent.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div className="h-72 sm:h-80 w-full min-w-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={purchaseHistory} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                          <defs>
                            <linearGradient id="fintechPortfolioValGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#f97602" stopOpacity={0.28} />
                              <stop offset="95%" stopColor="#f97602" stopOpacity={0.01} />
                            </linearGradient>
                            <linearGradient id="fintechSpentGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#71717a" stopOpacity={0.10} />
                              <stop offset="95%" stopColor="#71717a" stopOpacity={0.01} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid stroke="#f4f4f5" strokeDasharray="3 3" vertical={false} />
                          <XAxis
                            dataKey="date"
                            tick={{ fill: '#71717a', fontSize: 11 }}
                            minTickGap={35}
                            axisLine={{ stroke: '#e4e4e7' }}
                            tickLine={false}
                          />
                          <YAxis
                            tick={{ fill: '#71717a', fontSize: 11 }}
                            tickFormatter={(v: number) => `$${Math.round(v).toLocaleString()}`}
                            axisLine={false}
                            tickLine={false}
                            width={54}
                          />
                          <Tooltip content={<PortfolioValueTooltip currentPrice={market?.currentPrice ?? 0} />} />
                          <Area
                            type="monotone"
                            dataKey="contributions"
                            name="Spending and fees"
                            stroke="#71717a"
                            strokeWidth={1.75}
                            strokeDasharray="4 4"
                            fill="url(#fintechSpentGrad)"
                          />
                          <Area
                            type="monotone"
                            dataKey="value"
                            name="Current-price value"
                            stroke="#f97602"
                            strokeWidth={2.5}
                            fill="url(#fintechPortfolioValGrad)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </Panel>

                  {/* Fintech Card: Bitcoin accumulation and average cost */}
                  <Panel className="border-zinc-200/90 bg-white shadow-xs overflow-hidden">
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-zinc-100 pb-5">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="inline-flex h-2 w-2 rounded-full bg-[#0284c7]" />
                          <span className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                            Cost Basis & Sats Stack
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-zinc-900 tracking-tight">
                          Bitcoin accumulation and average cost
                        </h3>
                      </div>

                      {latestPurchase && (
                        <div className="flex flex-wrap sm:flex-nowrap gap-3">
                          <div className="rounded-xl border border-sky-200 bg-sky-50/60 p-3 sm:text-right min-w-[130px]">
                            <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wide">Total Bitcoin</span>
                            <div className="text-lg sm:text-xl font-extrabold text-sky-900 font-mono">
                              {latestPurchase.btc.toFixed(6)}
                            </div>
                            <span className="text-[11px] text-sky-600 font-medium">
                              {Math.round(latestPurchase.btc * 100_000_000).toLocaleString()} sats
                            </span>
                          </div>

                          <div className="rounded-xl border border-orange-200 bg-orange-50/60 p-3 sm:text-right min-w-[130px]">
                            <span className="text-[10px] font-bold text-[#f97602] uppercase tracking-wide">Average Cost</span>
                            <div className="text-lg sm:text-xl font-extrabold text-zinc-900">
                              {formatCurrency(latestPurchase.averagePrice, 0)}
                            </div>
                            <span className="text-[11px] text-zinc-500">per BTC</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Legend & Stats Ribbon */}
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-100 bg-zinc-50/70 p-3 text-xs">
                      <div className="flex flex-wrap items-center gap-5">
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-[#0284c7]" />
                          <span className="text-zinc-500 font-medium">Accumulated BTC:</span>
                          <span className="font-bold text-zinc-900 font-mono">{latestPurchase?.btc.toFixed(6) ?? '0.000000'} BTC</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-[#f97602]" />
                          <span className="text-zinc-500 font-medium">Avg Acquisition Price:</span>
                          <span className="font-bold text-zinc-900">{formatCurrency(latestPurchase?.averagePrice ?? 0, 0)}</span>
                        </div>
                      </div>

                      {portfolioCostEfficiency !== null && (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-zinc-500">Cost Basis Advantage:</span>
                          <span className={cn(
                            "font-bold rounded-md px-2 py-0.5 text-[11px]",
                            portfolioCostEfficiency >= 0 ? "bg-emerald-100 text-emerald-800" : "bg-zinc-200 text-zinc-700"
                          )}>
                            {portfolioCostEfficiency >= 0 ? '+' : ''}{portfolioCostEfficiency.toFixed(1)}% vs spot
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="h-72 sm:h-80 w-full min-w-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={purchaseHistory} margin={{ top: 10, right: 10, left: -5, bottom: 0 }}>
                          <CartesianGrid stroke="#f4f4f5" strokeDasharray="3 3" vertical={false} />
                          <XAxis
                            dataKey="date"
                            tick={{ fill: '#71717a', fontSize: 11 }}
                            minTickGap={35}
                            axisLine={{ stroke: '#e4e4e7' }}
                            tickLine={false}
                          />
                          <YAxis
                            yAxisId="btc"
                            tick={{ fill: '#0284c7', fontSize: 11 }}
                            tickFormatter={(v: number) => v.toFixed(4)}
                            axisLine={false}
                            tickLine={false}
                            width={54}
                          />
                          <YAxis
                            yAxisId="price"
                            orientation="right"
                            tick={{ fill: '#f97602', fontSize: 11 }}
                            tickFormatter={(v: number) => `$${Math.round(v).toLocaleString()}`}
                            axisLine={false}
                            tickLine={false}
                            width={60}
                          />
                          <Tooltip content={<AccumulationTooltip currentPrice={market?.currentPrice ?? 0} />} />
                          <Line
                            yAxisId="btc"
                            type="monotone"
                            dataKey="btc"
                            name="Accumulated BTC"
                            stroke="#0284c7"
                            strokeWidth={2.75}
                            dot={false}
                            activeDot={{ r: 5, fill: '#0284c7', stroke: '#ffffff', strokeWidth: 2 }}
                          />
                          <Line
                            yAxisId="price"
                            type="monotone"
                            dataKey="averagePrice"
                            name="Average acquisition price"
                            stroke="#f97602"
                            strokeWidth={2.75}
                            dot={false}
                            activeDot={{ r: 5, fill: '#f97602', stroke: '#ffffff', strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </Panel>
                </>
              )}
              {plans.length > 0 && (
                <Panel>
                  <h3 className="mb-3 font-semibold text-zinc-900">Plan progress</h3>
                  <div className="space-y-3">
                    {plans.filter((plan) => plan.status !== 'archived').map((plan) => {
                      const allDates = getScheduledDates(plan.startDate, plan.endDate, plan.frequency);
                      const completed = allDates.filter((date) => date <= todayInputValue()).length;
                      const progress = allDates.length ? Math.min(100, completed / allDates.length * 100) : 0;
                      return (
                        <div key={plan.id} className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-3">
                          <div className="flex items-center justify-between gap-3">
                            <span className="min-w-0 break-words text-sm font-semibold text-zinc-900">{plan.name}</span>
                            <span className="shrink-0 text-xs capitalize text-zinc-500">{plan.status}</span>
                          </div>
                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-200">
                            <div className="h-full rounded-full bg-orange-400" style={{ width: `${progress}%` }} />
                          </div>
                          <p className="mt-2 text-xs text-zinc-500">
                            {completed} of {allDates.length} scheduled dates · next {getNextPurchaseDate(plan.startDate, plan.frequency) ?? 'none'}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </Panel>
              )}
              {monthlyData.length > 0 && (
                <Panel className="border-zinc-200/90 bg-white shadow-xs overflow-hidden">
                  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-zinc-100 pb-5">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="inline-flex h-2 w-2 rounded-full bg-[#f97602]" />
                        <span className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                          Contribution Velocity
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-zinc-900 tracking-tight">
                        Monthly manual contributions
                      </h3>
                    </div>

                    <div className="flex flex-wrap sm:flex-col sm:items-end gap-1 bg-zinc-50/80 sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-zinc-100">
                      <span className="text-xs text-zinc-500 font-medium">Monthly Average</span>
                      <div className="text-xl sm:text-2xl font-extrabold text-zinc-900">
                        {formatCurrency(avgMonthlyContribution)}
                      </div>
                      <span className="text-[11px] text-zinc-500">
                        Across {monthlyData.length} recorded {monthlyData.length === 1 ? 'month' : 'months'}
                      </span>
                    </div>
                  </div>

                  {/* Summary Metric Ribbon */}
                  <div className="mb-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    <div className="rounded-xl border border-zinc-100 bg-zinc-50/60 p-3">
                      <span className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wide">Total Cumulative</span>
                      <span className="text-sm font-bold text-zinc-800">{formatCurrency(totalMonthlySpent)}</span>
                    </div>
                    <div className="rounded-xl border border-zinc-100 bg-zinc-50/60 p-3">
                      <span className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wide">Peak Month</span>
                      <span className="text-sm font-bold text-[#f97602]">{peakMonthlyEntry ? `${peakMonthlyEntry.label} (${formatCurrency(peakMonthlyEntry.contributions, 0)})` : '—'}</span>
                    </div>
                    <div className="rounded-xl border border-zinc-100 bg-zinc-50/60 p-3 col-span-2 sm:col-span-1">
                      <span className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wide">Total Stacked</span>
                      <span className="text-sm font-bold text-sky-800 font-mono">{totalMonthlyBtc.toFixed(6)} BTC</span>
                    </div>
                  </div>

                  <div className="h-72 sm:h-80 w-full min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="fintechBarGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f97602" stopOpacity={1} />
                            <stop offset="100%" stopColor="#ea580c" stopOpacity={0.85} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#f4f4f5" strokeDasharray="3 3" vertical={false} />
                        <Legend verticalAlign="top" height={28} />
                        <XAxis
                          dataKey="label"
                          tick={{ fill: '#71717a', fontSize: 11 }}
                          axisLine={{ stroke: '#e4e4e7' }}
                          tickLine={false}
                        />
                        <YAxis
                          yAxisId="spending"
                          tick={{ fill: '#71717a', fontSize: 11 }}
                          tickFormatter={(v: number) => `$${Math.round(v).toLocaleString()}`}
                          axisLine={false}
                          tickLine={false}
                          width={54}
                        />
                        <YAxis
                          yAxisId="btc"
                          orientation="right"
                          tick={{ fill: '#0284c7', fontSize: 11 }}
                          tickFormatter={(v: number) => v.toFixed(6)}
                          axisLine={false}
                          tickLine={false}
                          width={72}
                        />
                        <Tooltip content={<MonthlyContributionsTooltip />} cursor={{ fill: '#f4f4f5', opacity: 0.6 }} />
                        <Bar
                          yAxisId="spending"
                          dataKey="contributions"
                          name="Spending and fees"
                          fill="url(#fintechBarGrad)"
                          radius={[8, 8, 2, 2]}
                          maxBarSize={56}
                        />
                        <Bar
                          yAxisId="btc"
                          dataKey="btc"
                          name="Bitcoin acquired (BTC)"
                          fill="#0284c7"
                          radius={[8, 8, 2, 2]}
                          maxBarSize={56}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Panel>
              )}
              <Panel>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-zinc-900">Purchase records</h3>
                    <p className="mt-1 text-xs text-zinc-500">{portfolioPurchases.length} manual entries</p>
                  </div>
                  <LockKeyhole className="h-4 w-4 text-cyan-600" aria-hidden="true" />
                </div>
                {portfolioPurchases.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 p-4 text-sm text-zinc-500">
                    {purchases.length === 0 ? 'No manual purchase records yet.' : 'No purchase records in this portfolio yet.'}
                  </p>
                ) : (
                  <div className="max-h-96 space-y-3 overflow-y-auto pr-2">
                    {portfolioPurchases.map((purchase) => {
                      const isCurrentEditing = editingPurchaseId === purchase.id;
                      return (
                        <article
                          key={purchase.id}
                          className={cn(
                            "rounded-xl border p-3 transition-all duration-200",
                            isCurrentEditing
                              ? "border-[#f97602] bg-orange-50/60 ring-2 ring-[#f97602]/40 shadow-xs"
                              : "border-zinc-200 bg-zinc-50/70 hover:bg-zinc-50"
                          )}
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-zinc-900">{formatDate(purchase.purchaseDate)}</h4>
                                {isCurrentEditing && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-[#f97602] px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider animate-pulse">
                                    Editing
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 text-xs font-medium text-[#f97602]">{portfolioLabel(purchase.planId)}</p>
                              <p className="mt-1 text-sm text-zinc-700">{formatCurrency(purchase.amountUsd)} · {purchase.btcReceived.toFixed(8)} BTC</p>
                              <p className="mt-1 text-xs text-zinc-500">Price {formatCurrency(purchase.btcPrice)} · Fees {formatCurrency(purchase.feesUsd)}</p>
                              {purchase.transactionId && <p className="mt-1 break-all text-xs text-zinc-400">ID: {purchase.transactionId}</p>}
                            </div>
                            <div className="flex gap-1">
                              <IconButton
                                label={isCurrentEditing ? "Currently editing this record" : "Edit purchase"}
                                onClick={() => beginPurchaseEdit(purchase)}
                                className={isCurrentEditing ? "bg-orange-100 text-[#f97602] border-orange-300 ring-1 ring-[#f97602]/30" : ""}
                              >
                                <Pencil />
                              </IconButton>
                              <IconButton label="Delete purchase" onClick={() => void deletePurchase(purchase)}><Trash2 /></IconButton>
                            </div>
                          </div>
                          {purchase.notes && <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-500">{purchase.notes}</p>}
                        </article>
                      );
                    })}
                  </div>
                )}
              </Panel>
            </div>
          </div>

          {/* ── Watch-Only Wallet Dashboard (additive; DCA records above remain unchanged) ── */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-[#f97602]" />
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f97602]">Watch-Only Wallets</p>
            </div>
            <WalletDashboard
              wallets={wallets}
              transactions={walletTxs}
              snapshots={walletSnapshots}
              manualRecords={purchases.map((purchase): ManualPortfolioRecord => ({
                purchaseDate: purchase.purchaseDate,
                btcReceived: purchase.btcReceived,
                isInWallet: purchase.isInWallet,
                walletTransferDate: purchase.walletTransferDate,
              }))}
              priceHistory={market?.prices ?? []}
              error={walletError}
              currentPriceBtc={market?.currentPrice ?? null}
              dcaPortfolioBtc={purchaseStats.totalBtc}
              separateManualBtc={purchases.reduce(
                (total, purchase) => total + (purchase.isInWallet ? 0 : purchase.btcReceived),
                0,
              )}
              linkedManualBtc={purchases.reduce(
                (total, purchase) => total + (purchase.isInWallet ? purchase.btcReceived : 0),
                0,
              )}
              onWalletRemoved={handleWalletRemoved}
              onWalletsRefreshed={handleWalletsRefreshed}
              onConnectWallet={() => setConnectWalletOpen(true)}
            />
          </div>
        </div>
      )}

      {section === 'market' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f97602]">Bitcoin market</p>
              <h2 className="mt-2 text-2xl font-bold text-zinc-900">BTC / USD overview</h2>
              <p className="mt-2 text-sm text-zinc-500">Market data is provided for context and may be delayed or temporarily unavailable.</p>
            </div>
            <div
              className="flex flex-wrap items-center gap-1 rounded-xl border border-zinc-200 bg-white p-1"
              role="group"
              aria-label="Historical price range"
            >
              {[
                { value: '7', label: '7D' },
                { value: '30', label: '30D' },
                { value: '90', label: '90D' },
                { value: '180', label: '6M' },
                { value: '365', label: '1Y' },
              ].map((range) => (
                <button
                  key={range.value}
                  type="button"
                  aria-pressed={marketDays === range.value}
                  onClick={() => setMarketDays(range.value)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    marketDays === range.value
                      ? 'bg-[#f97602] text-white shadow-sm'
                      : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
          {marketError && <MarketError message={marketError} onRetry={() => void loadMarket(marketDays)} />}
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricPanel
              label="Current BTC price"
              value={market ? formatCurrency(market.currentPrice) : marketLoading ? 'Loading…' : 'Unavailable'}
              valueClassName={market ? ((market.change24h ?? 0) >= 0 ? 'text-emerald-600' : 'text-rose-600') : 'text-zinc-900'}
            />
            <MetricPanel
              label="24-hour change"
              value={market?.change24h == null ? '—' : `${market.change24h >= 0 ? '+' : ''}${market.change24h.toFixed(2)}%`}
              detail="Percentage change"
              valueClassName={market?.change24h == null ? 'text-zinc-900' : market.change24h >= 0 ? 'text-emerald-600' : 'text-rose-600'}
            />
            <MetricPanel label="24-hour high" value={market?.high24h == null ? '—' : formatCurrency(market.high24h)} valueClassName="text-emerald-600" />
            <MetricPanel label="24-hour low" value={market?.low24h == null ? '—' : formatCurrency(market.low24h)} valueClassName="text-rose-600" />
          </div>
          <Panel>
            <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-zinc-900">Bitcoin historical price</h3>
                <p className="mt-1 text-xs text-zinc-500">USD · OHLC candlesticks</p>
                <p className="mt-1 text-xs text-zinc-400">4-hour candles up to 30 days; 4-day candles for longer ranges.</p>
              </div>
              {market && <p className="text-xs text-zinc-400">Updated {new Date(market.lastUpdated).toLocaleString()}</p>}
            </div>
            {marketLoading ? <LoadingPanel text="Loading market prices…" /> : marketCandles.length ? (
              <div className="w-full min-w-0">
                <CandleChart
                  key={marketDays}
                  data={marketCandles}
                  currentPrice={market?.currentPrice ?? null}
                />
              </div>
            ) : <p className="py-12 text-center text-sm text-zinc-500">{market?.candleError ?? 'No market chart data is available right now.'}</p>}
            {market && <p className="mt-3 text-xs text-zinc-400">Source: {market.source}. Data is not guaranteed to be real time.</p>}
          </Panel>
        </div>
      )}

      <footer className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-xs leading-5 text-zinc-500 sm:p-5 shadow-xs">
        Bitcoin is volatile; DCA does not guarantee returns. PBA provides education, not financial advice or custody.
      </footer>
      <CryptoAuthModal
        isOpen={signInModalOpen}
        onClose={() => setSignInModalOpen(false)}
        onForgotPassword={(email) => {
          setForgotPasswordEmail(email);
          setSignInModalOpen(false);
          setForgotPasswordOpen(true);
        }}
      />
      <LinkCryptoKeyModal
        isOpen={linkKeyModalOpen}
        onClose={() => setLinkKeyModalOpen(false)}
        onSuccess={(accId) => {
          setNotice(`Linked private key ${accId.slice(0, 16)}… successfully.`);
        }}
      />
      <ForgotPasswordModal
        isOpen={forgotPasswordOpen}
        onClose={() => {
          setForgotPasswordOpen(false);
          setForgotPasswordEmail('');
        }}
        initialEmail={forgotPasswordEmail}
      />
      {/* Watch-only Bitcoin wallet connection modal */}
      <ConnectWalletModal
        isOpen={connectWalletOpen}
        onClose={() => setConnectWalletOpen(false)}
        onWalletConnected={handleWalletConnected}
      />
      </div>
    </main>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-zinc-200 bg-zinc-50/70 p-3">
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <p className="mt-1 break-words text-base font-bold text-zinc-900">{value}</p>
    </div>
  );
}

function MetricPanel({
  label,
  value,
  detail,
  valueClassName,
}: {
  label: string;
  value: string;
  detail?: string;
  valueClassName?: string;
}) {
  return (
    <Panel className="p-4 bg-white border-zinc-200 shadow-xs">
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <p className={cn('mt-2 break-words text-xl font-bold', valueClassName ?? 'text-zinc-900')}>{value}</p>
      {detail && <p className="mt-1 text-xs text-zinc-500">{detail}</p>}
    </Panel>
  );
}

function MarketSnapshot({
  market,
  loading,
  error,
  onRetry,
  onOpen,
}: {
  market: MarketData | null;
  loading: boolean;
  error: string;
  onRetry: () => void;
  onOpen: () => void;
}) {
  return (
    <Panel className="flex min-h-[230px] flex-col border-zinc-200 bg-white">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">Bitcoin market</p>
          <p className="mt-0.5 text-xs text-zinc-400">BTC / USD</p>
        </div>
        <Activity className="h-5 w-5 text-[#f97602]" aria-hidden="true" />
      </div>
      {loading ? (
        <p className="mt-6 animate-pulse text-2xl font-bold text-zinc-400">Loading price…</p>
      ) : market ? (
        <>
          <p className={`mt-4 text-3xl font-bold tracking-tight ${(market.change24h ?? 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{formatCurrency(market.currentPrice)}</p>
          <p className="mt-2 flex items-center gap-1 text-sm font-semibold">
            {(market.change24h ?? 0) >= 0 ? <ArrowUpRight className={`h-4 w-4 ${(market.change24h ?? 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`} /> : <ArrowDownRight className={`h-4 w-4 ${(market.change24h ?? 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`} />}
            {market.change24h == null ? (
              <span className="text-zinc-900">24-hour change unavailable</span>
            ) : (
              <>
                <span className={(market.change24h ?? 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                  {market.change24h >= 0 ? '+' : ''}{market.change24h.toFixed(2)}%
                </span>
                <span className="text-zinc-900 font-normal"> over 24 hours</span>
              </>
            )}
          </p>
          <p className="mt-auto pt-4 text-xs text-zinc-400">Updated {new Date(market.lastUpdated).toLocaleTimeString()}</p>
        </>
      ) : (
        <div className="mt-5">
          <p className="text-sm text-amber-800">{error || 'Market data unavailable.'}</p>
          <button type="button" onClick={onRetry} className="mt-3 min-h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 shadow-xs">Retry</button>
        </div>
      )}
      <button type="button" onClick={onOpen} className="mt-4 inline-flex min-h-10 items-center gap-2 self-start text-sm font-semibold text-[#f97602] hover:text-[#d46200]">
        View market details <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </Panel>
  );
}

function InfoCard({
  number,
  title,
  text,
  action,
  onClick,
}: {
  number: string;
  title: string;
  text: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <Panel className="border-zinc-200 bg-white shadow-xs hover:border-orange-300/60 transition-colors">
      <p className="text-xs font-bold tracking-[0.16em] text-[#f97602]">{number}</p>
      <h3 className="mt-2 text-lg font-bold text-zinc-900">{title}</h3>
      <p className="mt-2 min-h-12 text-sm leading-6 text-zinc-600">{text}</p>
      <button type="button" onClick={onClick} className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#f97602] hover:text-[#d46200]">
        {action} <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </Panel>
  );
}

function IconButton({
  children,
  label,
  onClick,
  className = '',
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition hover:border-orange-300 hover:bg-orange-50 hover:text-[#f97602] shadow-2xs ${className}`}>
      <span className="[&>svg]:h-4 [&>svg]:w-4">{children}</span>
    </button>
  );
}

function LoadingPanel({ text }: { text: string }) {
  return (
    <div className="flex min-h-24 items-center justify-center gap-2 text-sm text-zinc-500">
      <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" /> {text}
    </div>
  );
}

function MarketError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
      <span className="flex min-w-0 items-start gap-2"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{message}</span>
      <button type="button" onClick={onRetry} className="inline-flex min-h-9 shrink-0 items-center gap-2 rounded-lg border border-amber-300 bg-white px-3 text-xs font-semibold text-amber-900 hover:bg-amber-100 shadow-2xs">
        <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" /> Retry
      </button>
    </div>
  );
}
