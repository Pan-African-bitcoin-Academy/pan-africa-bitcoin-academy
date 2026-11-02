'use client';

import {
  useCallback,
  useEffect,
  useMemo,
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
  CalendarDays,
  Check,
  CircleAlert,
  Clock3,
  Coins,
  Download,
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
import { AuthModal } from '@/components/AuthModal';
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
import {
  getNextPurchaseDate,
  getScheduledDates,
  simulateDca,
  type DcaFrequency,
  type DcaSimulation,
  type PricePoint,
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
  purchaseDate: string;
  amountUsd: number;
  btcPrice: number;
  btcReceived: number;
  feesUsd: number;
  transactionId: string;
  notes: string;
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
    body: 'Dollar-cost averaging (DCA) means investing a fixed amount on a regular schedule, regardless of the asset’s price. This changes the timing and size of each purchase; it does not remove market risk or guarantee a profit.',
  },
  {
    title: 'How Bitcoin DCA works',
    body: 'A person chooses an amount and schedule, then independently makes purchases on those dates. When the price is lower, the same amount buys more bitcoin; when it is higher, it buys less. This tool only models the schedule and does not make purchases.',
  },
  {
    title: 'Why people use DCA',
    body: 'A regular schedule can make a plan easier to follow and reduce the pressure to choose one perfect entry point. It also means continuing to buy through falling markets, so it is important to understand the potential losses first.',
  },
  {
    title: 'DCA versus a lump sum',
    body: 'DCA spreads purchases over time, while a lump-sum approach invests an available amount at once. Their historical results vary by period and asset-price path. Neither approach is universally best, and past results do not predict future returns.',
  },
  {
    title: 'Understanding Bitcoin volatility',
    body: 'Bitcoin prices can move sharply in either direction. A portfolio can lose substantial value, including over long periods. A chart or historical simulation cannot show every possible future market condition.',
  },
  {
    title: 'Risks and limitations',
    body: 'DCA does not prevent loss, remove volatility, or ensure a positive return. Fees, spreads, taxes, missed purchases, market data gaps, and custody mistakes can all affect real outcomes. Never use money needed for essential expenses.',
  },
  {
    title: 'Budgeting recurring purchases',
    body: 'Before setting any schedule, consider your essential costs, emergency savings, debts, and local rules. A hypothetical plan should fit a budget you can sustain; there is no need to make real purchases to use this learning tool.',
  },
  {
    title: 'Bitcoin accumulation and self-custody',
    body: 'Self-custody means controlling the keys needed to spend bitcoin yourself. It also means taking responsibility for backups and security. PBA does not hold bitcoin, request wallet credentials, or connect to a wallet.',
  },
  {
    title: 'Transaction fees',
    body: 'Fees reduce the amount that reaches a bitcoin balance or add to the cost basis, depending on how they are charged. Small, frequent purchases can make fixed fees especially significant. This planner models fees as a percentage of each contribution.',
  },
  {
    title: 'Reviewing a plan',
    body: 'Review a plan against your budget and circumstances rather than recent price movements. Historical data is incomplete, and a strategy that performed well in one period may perform poorly in another.',
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

function CandleChart({ data }: { data: MarketCandle[] }) {
  const width = 1000;
  const height = 320;
  const left = 78;
  const right = 16;
  const top = 14;
  const bottom = 30;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const low = Math.min(...data.map((candle) => candle.low));
  const high = Math.max(...data.map((candle) => candle.high));
  const range = high - low || high * 0.02 || 1;
  const minPrice = low - range * 0.05;
  const maxPrice = high + range * 0.05;
  const yForPrice = (price: number) =>
    top + ((maxPrice - price) / (maxPrice - minPrice)) * plotHeight;
  const candleStep = plotWidth / data.length;
  const candleWidth = Math.max(2, Math.min(10, candleStep * 0.64));
  const tickCount = Math.min(5, data.length);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-full w-full"
      role="img"
      aria-label="Bitcoin USD historical candlestick chart"
    >
      {Array.from({ length: 5 }, (_, index) => {
        const price = maxPrice - ((maxPrice - minPrice) * index) / 4;
        const y = top + (plotHeight * index) / 4;
        return (
          <g key={index}>
            <line x1={left} x2={width - right} y1={y} y2={y} stroke="#334155" strokeDasharray="3 3" />
            <text x={left - 8} y={y + 4} textAnchor="end" fill="#94a3b8" fontSize="12">
              {formatCurrency(price, 0)}
            </text>
          </g>
        );
      })}
      {data.map((candle, index) => {
        const x = left + (index + 0.5) * candleStep;
        const openY = yForPrice(candle.open);
        const closeY = yForPrice(candle.close);
        const color = candle.close >= candle.open ? '#22c55e' : '#ef4444';
        const date = new Intl.DateTimeFormat('en', {
          month: 'short',
          day: 'numeric',
          timeZone: 'UTC',
        }).format(candle.timestamp);
        const bodyTop = Math.min(openY, closeY);
        const bodyHeight = Math.max(2, Math.abs(openY - closeY));

        return (
          <g key={candle.timestamp}>
            <title>
              {`${date} · Open ${formatCurrency(candle.open)} · High ${formatCurrency(candle.high)} · Low ${formatCurrency(candle.low)} · Close ${formatCurrency(candle.close)}`}
            </title>
            <line
              x1={x}
              x2={x}
              y1={yForPrice(candle.high)}
              y2={yForPrice(candle.low)}
              stroke={color}
              strokeWidth="1.5"
            />
            <rect
              x={x - candleWidth / 2}
              y={bodyTop}
              width={candleWidth}
              height={bodyHeight}
              fill={color}
              rx="1"
            />
          </g>
        );
      })}
      {Array.from({ length: tickCount }, (_, index) => {
        const dataIndex = tickCount === 1
          ? 0
          : Math.round((index * (data.length - 1)) / (tickCount - 1));
        const candle = data[dataIndex];
        const x = left + (dataIndex + 0.5) * candleStep;
        const label = new Intl.DateTimeFormat('en', {
          month: 'short',
          day: 'numeric',
          timeZone: 'UTC',
        }).format(candle.timestamp);
        return (
          <text
            key={candle.timestamp}
            x={x}
            y={height - 6}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="12"
          >
            {label}
          </text>
        );
      })}
    </svg>
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
    purchaseDate: String(value.purchaseDate ?? value.purchase_date),
    amountUsd: Number(value.amountUsd ?? value.amount_usd),
    btcPrice: Number(value.btcPrice ?? value.btc_price),
    btcReceived: Number(value.btcReceived ?? value.btc_received),
    feesUsd: Number(value.feesUsd ?? value.fees_usd ?? 0),
    transactionId: String(value.transactionId ?? value.transaction_id ?? ''),
    notes: String(value.notes ?? ''),
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
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#f97602] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
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
    <section className={`min-w-0 rounded-2xl border border-white/10 bg-slate-950/75 p-4 shadow-xl sm:p-6 ${className}`}>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="grid min-w-0 gap-2 text-sm font-medium text-slate-200">
      {label}
      {children}
      {hint && <span className="text-xs font-normal text-slate-400">{hint}</span>}
    </label>
  );
}

const inputClass =
  'min-h-11 w-full min-w-0 rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-base text-white outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20';

export default function DcaExperience() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [section, setSection] = useState<Section>('overview');
  const [plans, setPlans] = useState<DcaPlan[]>([]);
  const [purchases, setPurchases] = useState<DcaPurchase[]>([]);
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
  const [marketDays, setMarketDays] = useState('180');

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
        const [planResponse, purchaseResponse] = await Promise.all([
          requestJson('/api/dca/plans'),
          requestJson('/api/dca/purchases'),
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

  const purchaseStats = useMemo(() => {
    const totalSpent = purchases.reduce((sum, item) => sum + item.amountUsd, 0);
    const totalFees = purchases.reduce((sum, item) => sum + item.feesUsd, 0);
    const totalBtc = purchases.reduce((sum, item) => sum + item.btcReceived, 0);
    const value = totalBtc * (market?.currentPrice ?? 0);
    return {
      totalSpent,
      totalFees,
      totalBtc,
      value,
      profitLoss: value - totalSpent - totalFees,
      averagePrice: totalBtc > 0 ? (totalSpent + totalFees) / totalBtc : 0,
    };
  }, [purchases, market?.currentPrice]);

  const monthlyData = useMemo(() => {
    const buckets = new Map<string, { month: string; contributions: number; btc: number }>();
    for (const purchase of [...purchases].sort((a, b) => a.purchaseDate.localeCompare(b.purchaseDate))) {
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
  }, [purchases]);

  const purchaseHistory = useMemo(() => {
    let totalSpent = 0;
    let totalBtc = 0;
    return [...purchases]
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
  }, [purchases, market?.currentPrice]);

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
        purchaseDate,
        amountUsd,
        btcPrice,
        btcReceived,
        feesUsd,
        transactionId: purchaseTxid.trim(),
        notes: purchaseNotes.trim(),
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
      ['Date', 'Amount USD', 'BTC price USD', 'BTC received', 'Fees USD', 'Transaction ID', 'Notes'],
      ...purchases.map((item) => [
        item.purchaseDate,
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
    <main className="min-h-screen w-full bg-slate-950/60">
      <div className="mx-auto w-full max-w-[1600px] px-3 pb-16 pt-6 sm:px-5 lg:px-8 lg:pt-10">
      <header className="mb-6 flex flex-col gap-5 lg:mb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-orange-200">
            <Coins className="h-4 w-4" aria-hidden="true" />
            PBA learning tool
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Bitcoin DCA, made <span className="text-[#f97602]">clear.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            Learn the approach, explore historical data, and organize a hypothetical plan or purchases you enter yourself.
          </p>
        </div>
        <div className="flex items-start gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/5 p-3 text-xs leading-5 text-cyan-100 sm:max-w-sm">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" aria-hidden="true" />
          <p>No trading, payments, wallet connection, or bitcoin custody. Your records are not verified by PBA.</p>
        </div>
      </header>

      <nav aria-label="DCA sections" className="-mx-3 mb-6 overflow-x-auto px-3 sm:mx-0 sm:px-0">
        <div className="flex min-w-max gap-2 rounded-2xl border border-white/10 bg-slate-950/70 p-2">
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
              className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition ${
                section === id
                  ? 'bg-orange-500 text-white'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
              {(id === 'planner' || id === 'dashboard') && !isAuthenticated && (
                <LockKeyhole className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
      </nav>

      {errorMessage && (
        <div role="alert" className="mb-4 flex items-start gap-2 rounded-xl border border-red-400/30 bg-red-950/50 p-3 text-sm text-red-100">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {errorMessage}
        </div>
      )}
      {notice && (
        <div role="status" className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-950/40 p-3 text-sm text-emerald-100">
          <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
          {notice}
        </div>
      )}
      {!authLoading && !isAuthenticated && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-orange-400/20 bg-orange-400/5 px-3 py-2 text-sm text-slate-300">
          <p>Sign in is required to use the DCA planner and My dashboard.</p>
          <button
            type="button"
            onClick={() => setSignInModalOpen(true)}
            className="font-semibold text-orange-300 underline decoration-orange-300/50 underline-offset-4 hover:text-orange-200"
          >
            Sign in
          </button>
        </div>
      )}

      {section === 'overview' && (
        <div className="space-y-5">
          {marketError && <MarketError message={marketError} onRetry={() => void loadMarket(marketDays)} />}
          <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
            <Panel className="relative overflow-hidden">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />
              <div className="relative">
                <p className="text-sm font-semibold text-orange-200">A steady schedule. A clearer picture.</p>
                <h2 className="mt-3 max-w-2xl text-2xl font-bold leading-tight text-white sm:text-3xl">
                  Understand the trade-offs before you make a plan.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  DCA is a way of scheduling purchases—not a way to avoid risk or predict bitcoin’s price. Start with the short lessons, then test a hypothetical schedule with historical data.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <PrimaryButton onClick={() => setSectionAndScroll('learn')}>
                    Learn the basics <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </PrimaryButton>
                  <button
                    type="button"
                    onClick={() => setSectionAndScroll('simulator')}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
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
              text="Get familiar with schedules, fees, volatility, and the limitations of historical results."
              action="Read the lessons"
              onClick={() => setSectionAndScroll('learn')}
            />
            <InfoCard
              number="02"
              title="Plan"
              text="Calculate scheduled contributions and compare their assumptions with your budget."
              action="Build a hypothetical plan"
              onClick={() => setSectionAndScroll('planner')}
            />
            <InfoCard
              number="03"
              title="Track"
              text="Keep a private manual journal of purchases you made independently of PBA."
              action="Open your dashboard"
              onClick={() => setSectionAndScroll('dashboard')}
            />
          </div>

          <Panel className="flex flex-col gap-4 border-orange-400/20 bg-orange-950/20 sm:flex-row sm:items-start">
            <Lightbulb className="h-5 w-5 shrink-0 text-orange-300" aria-hidden="true" />
            <div>
              <h2 className="font-semibold text-white">What DCA does—and does not do</h2>
              <p className="mt-1 text-sm leading-6 text-slate-300">
                Regular purchases can spread entry points over time. They cannot guarantee gains, prevent losses, or make bitcoin suitable for every person. This is educational information, not financial advice.
              </p>
            </div>
          </Panel>
        </div>
      )}

      {section === 'learn' && (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
          <Panel>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-300">Learn DCA</p>
            <h2 className="mt-2 text-2xl font-bold text-white">A beginner’s guide to recurring purchases</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              Open each lesson at your own pace. The examples describe hypothetical activity; they are not recommendations to buy bitcoin.
            </p>
            <div className="mt-5 divide-y divide-white/10">
              {lessons.map((lesson, index) => (
                <details key={lesson.title} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center gap-3 text-left font-semibold text-white marker:hidden">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-400/10 text-sm text-orange-200">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1">{lesson.title}</span>
                    <span className="text-slate-400 transition group-open:rotate-45" aria-hidden="true">+</span>
                  </summary>
                  <p className="ml-11 mt-3 max-w-3xl text-sm leading-6 text-slate-300">{lesson.body}</p>
                </details>
              ))}
            </div>
          </Panel>
          <div className="space-y-4">
            <Panel>
              <BookOpen className="h-5 w-5 text-orange-300" aria-hidden="true" />
              <h3 className="mt-3 font-semibold text-white">Quick knowledge check</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Does a regular bitcoin purchase schedule guarantee that you will make a profit?
              </p>
              <details className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
                <summary className="cursor-pointer text-sm font-semibold text-orange-200">Show answer</summary>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  No. DCA changes purchase timing, but it does not remove price risk or guarantee a positive return.
                </p>
              </details>
            </Panel>
            <Panel className="border-red-300/20">
              <CircleAlert className="h-5 w-5 text-red-300" aria-hidden="true" />
              <h3 className="mt-3 font-semibold text-white">Risk reminder</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Bitcoin is volatile. Consider your circumstances and local regulations, and do not risk money needed for essentials.
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
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-300">Hypothetical plan</p>
              <h2 className="mt-2 text-2xl font-bold text-white">{editingPlanId ? 'Edit your plan' : 'Build a DCA plan'}</h2>
              <p className="mt-2 text-sm text-slate-400">This tool schedules ideas only. It never makes a purchase.</p>
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
              <Field label="Estimated fee (%)" hint="Modeled as a percentage deducted from each contribution.">
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
                  <button type="button" className="min-h-11 rounded-xl border border-white/15 px-4 text-sm text-white hover:bg-white/10" onClick={() => { setEditingPlanId(null); setPlanName(''); }}>
                    Cancel editing
                  </button>
                )}
              </div>
            </form>
          </Panel>

          <div className="space-y-5">
            <Panel>
              <h3 className="font-semibold text-white">Plan estimate</h3>
              <p className="mt-1 text-xs leading-5 text-slate-400">Contribution totals are schedule arithmetic. BTC uses today’s price only as an illustration—not a forecast.</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Metric label="Scheduled purchases" value={String(planSchedule.length + (planInitialAmount > 0 ? 1 : 0))} />
                <Metric label="Planned contributions" value={formatCurrency(plannedContributions)} />
                <Metric label="Estimated fees" value={formatCurrency(plannedFees)} />
                <Metric label="Illustrative BTC" value={estimatedBtc === null ? 'Market unavailable' : formatBtc(estimatedBtc)} />
              </div>
              {market && <p className="mt-3 text-xs text-slate-500">Illustration uses {formatCurrency(market.currentPrice)} per BTC, fetched {new Date(market.lastUpdated).toLocaleString()}.</p>}
            </Panel>

            <Panel>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-white">Your plans</h3>
                  <p className="mt-1 text-xs text-slate-400">{plans.length} saved plan{plans.length === 1 ? '' : 's'}</p>
                </div>
                <CalendarDays className="h-5 w-5 text-orange-300" aria-hidden="true" />
              </div>
              {plans.length === 0 ? (
                <p className="rounded-xl border border-dashed border-white/15 p-4 text-sm text-slate-400">Your saved plans will appear here.</p>
              ) : (
                <div className="space-y-3">
                  {plans.map((plan) => (
                    <article key={plan.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h4 className="break-words font-semibold text-white">{plan.name}</h4>
                          <p className="mt-1 text-sm text-slate-300">
                            {formatCurrency(plan.contributionAmount)} · {plan.frequency} · {formatDate(plan.startDate)} – {formatDate(plan.endDate)}
                          </p>
                          <p className="mt-1 text-xs capitalize text-slate-400">
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
                      {plan.notes && <p className="mt-2 whitespace-pre-wrap text-sm text-slate-400">{plan.notes}</p>}
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
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-300">Historical what-if</p>
                <h2 className="mt-2 text-2xl font-bold text-white">Test a schedule against historical prices</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
                  Hypothetically buy at each scheduled date using the nearest available historical price. Price gaps over three days are skipped and shown in the results.
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  Historical market-price data from January 2020 onward{historicalPriceSource ? ` · Source: ${historicalPriceSource}` : ''}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => void loadHistoricalPrices()}
                disabled={historicalPriceLoading}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/15 px-3 text-sm text-slate-200 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
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
              <Field label="Start date" hint={historicalPrices[0] ? `Available from ${formatDate(new Date(historicalPrices[0].timestamp).toISOString().slice(0, 10))}` : 'Select a date from January 1, 2020 onward.'}>
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
                <Panel><p className="text-sm text-slate-300">No scheduled purchases could be matched to the available price history. Choose dates from January 2020 onward.</p></Panel>
              ) : (
                <>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <MetricPanel label="Contributions" value={formatCurrency(simulation.totalContributions)} />
                    <MetricPanel label="Hypothetical BTC" value={formatBtc(simulation.totalBtc)} />
                    <MetricPanel label="Average acquisition price" value={formatCurrency(simulation.averagePrice)} />
                    <MetricPanel label="Value at period end" value={formatCurrency(simulation.portfolioValue)} detail={`${simulation.profitLoss >= 0 ? '+' : ''}${formatCurrency(simulation.profitLoss)} hypothetical difference`} />
                  </div>
                  <Panel>
                    <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-white">Contributions and hypothetical value</h3>
                        <p className="mt-1 text-xs text-slate-400">Value is calculated using the period-end price. Past performance does not predict future results.</p>
                      </div>
                      <p className="text-xs text-slate-400">Fees: {formatCurrency(simulation.totalFees)} · End price: {formatCurrency(simulation.endPrice)}</p>
                    </div>
                    <div className="h-72 w-full min-w-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={simulation.purchases}>
                          <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                          <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} minTickGap={30} />
                          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(value: number) => `$${Math.round(value)}`} width={52} />
                          <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12, color: '#fff' }} formatter={(value) => formatCurrency(Number(value))} />
                          <Legend />
                          <Area type="monotone" dataKey="cumulativeContribution" name="Contributions" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.12} />
                          <Area type="monotone" dataKey="portfolioValue" name="Hypothetical value" stroke="#f97602" fill="#f97602" fillOpacity={0.15} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    {simulation.skippedPurchases > 0 && (
                      <p className="mt-3 flex items-start gap-2 text-sm text-amber-200">
                        <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                        {simulation.skippedPurchases} scheduled purchase{simulation.skippedPurchases === 1 ? ' was' : 's were'} skipped because no nearby historical price was available.
                      </p>
                    )}
                  </Panel>
                  <Panel>
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-white">Historical purchase schedule</h3>
                      <p className="text-xs text-slate-400">{simulation.purchases.length} matched purchases</p>
                    </div>
                    <div className="max-h-80 overflow-auto">
                      <table className="w-full min-w-[560px] text-left text-sm">
                        <thead className="sticky top-0 bg-slate-900 text-xs uppercase text-slate-400">
                          <tr><th className="p-3">Date</th><th className="p-3">Price</th><th className="p-3">Contribution</th><th className="p-3">BTC</th><th className="p-3">Fees</th></tr>
                        </thead>
                        <tbody>
                          {simulation.purchases.map((item, index) => (
                            <tr key={`${item.date}-${index}`} className="border-t border-white/10 text-slate-200">
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
            <Panel><p className="text-sm text-slate-300">Enter a positive contribution and a valid date range to view a simulation.</p></Panel>
          )}
          <p className="text-xs leading-5 text-slate-500">
            Historical market-price samples from {historicalPriceSource || 'Blockchain.com'}. Simulation ignores exchange spreads, taxes, withdrawals, and individual execution differences. This is hypothetical analysis, not a recommendation.
          </p>
        </div>
      )}

      {section === 'dashboard' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-300">Manual records only</p>
              <h2 className="mt-2 text-2xl font-bold text-white">Your purchase journal</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
                Enter purchases you made independently. PBA does not verify, control, or hold any bitcoin represented here.
              </p>
            </div>
            <button type="button" onClick={exportPurchases} disabled={!purchases.length} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 px-4 text-sm font-semibold text-white hover:bg-white/10 disabled:opacity-40">
              <Download className="h-4 w-4" aria-hidden="true" /> Export CSV
            </button>
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
            <Panel>
              <h3 className="mb-4 font-semibold text-white">{editingPurchaseId ? 'Edit purchase record' : 'Record a purchase'}</h3>
              <form onSubmit={handleSavePurchase} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <Field label="Purchase date">
                  <input className={inputClass} type="date" value={purchaseDate} onChange={(event) => setPurchaseDate(event.target.value)} required />
                </Field>
                <Field label="Amount spent (USD)">
                  <input className={inputClass} type="number" min="0.01" step="0.01" value={purchaseAmount} onChange={(event) => setPurchaseAmount(event.target.value)} required />
                </Field>
                <Field label="Bitcoin price at purchase (USD)">
                  <input className={inputClass} type="number" min="0.01" step="0.01" value={purchasePrice} onChange={(event) => setPurchasePrice(event.target.value)} required />
                </Field>
                <Field label="BTC received" hint="Enter the amount shown in your independent purchase record.">
                  <input className={inputClass} type="number" min="0.00000001" step="0.00000001" value={purchaseBtc} onChange={(event) => setPurchaseBtc(event.target.value)} required />
                </Field>
                <Field label="Transaction fees (USD)">
                  <input className={inputClass} type="number" min="0" step="0.01" value={purchaseFees} onChange={(event) => setPurchaseFees(event.target.value)} />
                </Field>
                <Field label="Optional transaction ID">
                  <input className={inputClass} maxLength={200} value={purchaseTxid} onChange={(event) => setPurchaseTxid(event.target.value)} />
                </Field>
                <Field label="Notes">
                  <textarea className={`${inputClass} min-h-20 resize-y`} maxLength={2000} value={purchaseNotes} onChange={(event) => setPurchaseNotes(event.target.value)} />
                </Field>
                <div className="flex flex-wrap gap-2 sm:col-span-2 xl:col-span-1">
                  <PrimaryButton type="submit" disabled={saving}>
                    {saving ? 'Saving…' : editingPurchaseId ? 'Update record' : 'Save purchase'}
                  </PrimaryButton>
                  {editingPurchaseId && <button type="button" onClick={resetPurchaseForm} className="min-h-11 rounded-xl border border-white/15 px-4 text-sm text-white hover:bg-white/10">Cancel</button>}
                </div>
              </form>
            </Panel>

            <div className="space-y-5">
              {purchaseHistory.length > 0 && (
                <>
                  <Panel>
                    <h3 className="mb-1 font-semibold text-white">Portfolio value vs. recorded spending</h3>
                    <p className="mb-4 text-xs text-slate-400">Portfolio value uses the current BTC price for every entry date.</p>
                    <div className="h-56 w-full min-w-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={purchaseHistory}>
                          <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                          <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} minTickGap={30} />
                          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(value: number) => `$${Math.round(value)}`} width={48} />
                          <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12, color: '#fff' }} formatter={(value) => formatCurrency(Number(value))} />
                          <Legend />
                          <Area type="monotone" dataKey="contributions" name="Spending and fees" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.1} />
                          <Area type="monotone" dataKey="value" name="Current-price value" stroke="#f97602" fill="#f97602" fillOpacity={0.14} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </Panel>
                  <Panel>
                    <h3 className="mb-1 font-semibold text-white">Bitcoin accumulation and average cost</h3>
                    <p className="mb-4 text-xs text-slate-400">Average cost includes recorded fees. Values reflect manual entries only.</p>
                    <div className="h-56 w-full min-w-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={purchaseHistory}>
                          <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                          <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} minTickGap={30} />
                          <YAxis yAxisId="btc" tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(value: number) => value.toFixed(4)} width={55} />
                          <YAxis yAxisId="price" orientation="right" tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(value: number) => `$${Math.round(value)}`} width={60} />
                          <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12, color: '#fff' }} />
                          <Legend />
                          <Line yAxisId="btc" type="monotone" dataKey="btc" name="Accumulated BTC" stroke="#22d3ee" dot={false} />
                          <Line yAxisId="price" type="monotone" dataKey="averagePrice" name="Average acquisition price" stroke="#f97602" dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </Panel>
                </>
              )}
              {plans.length > 0 && (
                <Panel>
                  <h3 className="mb-3 font-semibold text-white">Plan progress</h3>
                  <div className="space-y-3">
                    {plans.filter((plan) => plan.status !== 'archived').map((plan) => {
                      const allDates = getScheduledDates(plan.startDate, plan.endDate, plan.frequency);
                      const completed = allDates.filter((date) => date <= todayInputValue()).length;
                      const progress = allDates.length ? Math.min(100, completed / allDates.length * 100) : 0;
                      return (
                        <div key={plan.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                          <div className="flex items-center justify-between gap-3">
                            <span className="min-w-0 break-words text-sm font-semibold text-white">{plan.name}</span>
                            <span className="shrink-0 text-xs capitalize text-slate-400">{plan.status}</span>
                          </div>
                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                            <div className="h-full rounded-full bg-orange-400" style={{ width: `${progress}%` }} />
                          </div>
                          <p className="mt-2 text-xs text-slate-400">
                            {completed} of {allDates.length} scheduled dates · next {getNextPurchaseDate(plan.startDate, plan.frequency) ?? 'none'}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </Panel>
              )}
              {monthlyData.length > 0 && (
                <Panel>
                  <h3 className="mb-4 font-semibold text-white">Monthly manual contributions</h3>
                  <div className="h-56 w-full min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                        <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(value: number) => `$${Math.round(value)}`} width={48} />
                        <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12, color: '#fff' }} formatter={(value) => formatCurrency(Number(value))} />
                        <Bar dataKey="contributions" name="Spending and fees" fill="#f97602" radius={[5, 5, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Panel>
              )}
              <Panel>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div><h3 className="font-semibold text-white">Purchase records</h3><p className="mt-1 text-xs text-slate-400">{purchases.length} manual entries</p></div>
                  <LockKeyhole className="h-4 w-4 text-cyan-300" aria-hidden="true" />
                </div>
                {purchases.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-white/15 p-4 text-sm text-slate-400">No manual purchase records yet.</p>
                ) : (
                  <div className="space-y-3">
                    {purchases.map((purchase) => (
                      <article key={purchase.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h4 className="font-semibold text-white">{formatDate(purchase.purchaseDate)}</h4>
                            <p className="mt-1 text-sm text-slate-300">{formatCurrency(purchase.amountUsd)} · {purchase.btcReceived.toFixed(8)} BTC</p>
                            <p className="mt-1 text-xs text-slate-400">Price {formatCurrency(purchase.btcPrice)} · Fees {formatCurrency(purchase.feesUsd)}</p>
                            {purchase.transactionId && <p className="mt-1 break-all text-xs text-slate-500">ID: {purchase.transactionId}</p>}
                          </div>
                          <div className="flex gap-1">
                            <IconButton label="Edit purchase" onClick={() => beginPurchaseEdit(purchase)}><Pencil /></IconButton>
                            <IconButton label="Delete purchase" onClick={() => void deletePurchase(purchase)}><Trash2 /></IconButton>
                          </div>
                        </div>
                        {purchase.notes && <p className="mt-2 whitespace-pre-wrap text-sm text-slate-400">{purchase.notes}</p>}
                      </article>
                    ))}
                  </div>
                )}
              </Panel>
            </div>
          </div>
        </div>
      )}

      {section === 'market' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-300">Bitcoin market</p>
              <h2 className="mt-2 text-2xl font-bold text-white">BTC / USD overview</h2>
              <p className="mt-2 text-sm text-slate-400">Market data is provided for context and may be delayed or temporarily unavailable.</p>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              Range
              <select className={`${inputClass} w-auto`} value={marketDays} onChange={(event) => setMarketDays(event.target.value)}>
                <option value="7">7 days</option><option value="30">30 days</option><option value="90">90 days</option><option value="180">180 days</option><option value="365">1 year</option>
              </select>
            </label>
          </div>
          {marketError && <MarketError message={marketError} onRetry={() => void loadMarket(marketDays)} />}
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricPanel label="Current BTC price" value={market ? formatCurrency(market.currentPrice) : marketLoading ? 'Loading…' : 'Unavailable'} />
            <MetricPanel label="24-hour change" value={market?.change24h == null ? '—' : `${market.change24h >= 0 ? '+' : ''}${market.change24h.toFixed(2)}%`} detail="Percentage change" />
            <MetricPanel label="24-hour high" value={market?.high24h == null ? '—' : formatCurrency(market.high24h)} />
            <MetricPanel label="24-hour low" value={market?.low24h == null ? '—' : formatCurrency(market.low24h)} />
          </div>
          <Panel>
            <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-white">Bitcoin historical price</h3>
                <p className="mt-1 text-xs text-slate-400">USD · OHLC candlesticks</p>
                <p className="mt-1 text-xs text-slate-500">4-hour candles up to 30 days; 4-day candles for longer ranges.</p>
              </div>
              {market && <p className="text-xs text-slate-400">Updated {new Date(market.lastUpdated).toLocaleString()}</p>}
            </div>
            {marketLoading ? <LoadingPanel text="Loading market prices…" /> : marketCandles.length ? (
              <div className="h-80 w-full min-w-0">
                <CandleChart data={marketCandles} />
              </div>
            ) : <p className="py-12 text-center text-sm text-slate-400">{market?.candleError ?? 'No market chart data is available right now.'}</p>}
            {market && <p className="mt-3 text-xs text-slate-500">Source: {market.source}. Data is not guaranteed to be real time.</p>}
          </Panel>
        </div>
      )}

      <footer className="mt-8 rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-xs leading-5 text-slate-400 sm:p-5">
        Bitcoin is volatile and you could lose some or all of the value of any purchase. Dollar-cost averaging does not eliminate risk or guarantee returns. PBA provides educational and analytical tools only—not financial advice, trading, custody, payments, or verification of manually entered records. Historical outcomes are hypothetical and do not predict future performance.
      </footer>
      <AuthModal
        isOpen={signInModalOpen}
        onClose={() => setSignInModalOpen(false)}
        mode="signin"
        redirectAfterLogin={null}
        onForgotPassword={(email) => {
          setForgotPasswordEmail(email);
          setSignInModalOpen(false);
          setForgotPasswordOpen(true);
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
    <div className="min-w-0 rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 break-words text-base font-bold text-white">{value}</p>
    </div>
  );
}

function MetricPanel({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <Panel className="p-4">
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <p className="mt-2 break-words text-xl font-bold text-white">{value}</p>
      {detail && <p className="mt-1 text-xs text-slate-400">{detail}</p>}
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
    <Panel className="flex min-h-[230px] flex-col">
      <div className="flex items-center justify-between gap-3">
        <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Bitcoin market</p><p className="mt-1 text-xs text-slate-500">BTC / USD</p></div>
        <Activity className="h-5 w-5 text-orange-300" aria-hidden="true" />
      </div>
      {loading ? (
        <p className="mt-6 animate-pulse text-2xl font-bold text-slate-400">Loading price…</p>
      ) : market ? (
        <>
          <p className="mt-5 text-3xl font-bold tracking-tight text-white">{formatCurrency(market.currentPrice)}</p>
          <p className={`mt-2 flex items-center gap-1 text-sm font-semibold ${(market.change24h ?? 0) >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
            {(market.change24h ?? 0) >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
            {market.change24h == null ? '24-hour change unavailable' : `${market.change24h >= 0 ? '+' : ''}${market.change24h.toFixed(2)}% over 24 hours`}
          </p>
          <p className="mt-auto pt-4 text-xs text-slate-500">Updated {new Date(market.lastUpdated).toLocaleTimeString()}</p>
        </>
      ) : (
        <div className="mt-5">
          <p className="text-sm text-amber-200">{error || 'Market data unavailable.'}</p>
          <button type="button" onClick={onRetry} className="mt-3 min-h-10 rounded-lg border border-white/15 px-3 text-sm text-white hover:bg-white/10">Retry</button>
        </div>
      )}
      <button type="button" onClick={onOpen} className="mt-4 inline-flex min-h-10 items-center gap-2 self-start text-sm font-semibold text-orange-200 hover:text-orange-100">
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
    <Panel>
      <p className="text-xs font-bold tracking-[0.16em] text-orange-300">{number}</p>
      <h3 className="mt-2 text-lg font-bold text-white">{title}</h3>
      <p className="mt-2 min-h-12 text-sm leading-6 text-slate-300">{text}</p>
      <button type="button" onClick={onClick} className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-orange-200 hover:text-orange-100">
        {action} <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </Panel>
  );
}

function IconButton({
  children,
  label,
  onClick,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-300 transition hover:border-orange-300/40 hover:bg-orange-300/10 hover:text-white">
      <span className="[&>svg]:h-4 [&>svg]:w-4">{children}</span>
    </button>
  );
}

function LoadingPanel({ text }: { text: string }) {
  return (
    <div className="flex min-h-24 items-center justify-center gap-2 text-sm text-slate-400">
      <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" /> {text}
    </div>
  );
}

function MarketError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300/25 bg-amber-950/30 p-3 text-sm text-amber-100">
      <span className="flex min-w-0 items-start gap-2"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{message}</span>
      <button type="button" onClick={onRetry} className="inline-flex min-h-9 shrink-0 items-center gap-2 rounded-lg border border-amber-200/20 px-3 font-semibold hover:bg-white/5">
        <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" /> Retry
      </button>
    </div>
  );
}
