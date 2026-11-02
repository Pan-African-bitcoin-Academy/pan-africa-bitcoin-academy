'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Bitcoin, CircleAlert, RefreshCw } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getScheduledDates, type DcaFrequency } from '@/app/dca/dca-calculations';

interface DcaPlan {
  id: string;
  name: string;
  contributionAmount: number;
  frequency: DcaFrequency;
  startDate: string;
  endDate: string;
  initialContribution: number;
  status: 'active' | 'paused' | 'archived';
  updatedAt: string;
}

interface DcaPurchase {
  id: string;
  purchaseDate: string;
  amountUsd: number;
  btcReceived: number;
  feesUsd: number;
  updatedAt: string;
}

interface DcaSummary {
  plans: DcaPlan[];
  purchases: DcaPurchase[];
  currentPrice: number;
  priceUpdatedAt: string;
  lastUpdated: string | null;
}

function formatCurrency(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits,
  }).format(value);
}

function formatBtc(value: number) {
  return `${value.toFixed(8)} BTC`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(new Date(value));
}

export function DcaAccumulationWidget() {
  const [summary, setSummary] = useState<DcaSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEnrolled, setIsEnrolled] = useState(false);

  const loadSummary = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/dca/student-summary', { credentials: 'include' });
      const data: unknown = await response.json();
      if (response.status === 403 || response.status === 401) {
        setIsEnrolled(false);
        setSummary(null);
        return;
      }
      if (data && typeof data === 'object' && 'eligible' in data && data.eligible === true) {
        setIsEnrolled(true);
      } else if (!response.ok) {
        setIsEnrolled(false);
        return;
      }
      if (!response.ok || !data || typeof data !== 'object') {
        const message = data && typeof data === 'object' && 'error' in data && typeof data.error === 'string'
          ? data.error
          : 'Unable to load your Bitcoin accumulation summary.';
        throw new Error(message);
      }

      const result = data as DcaSummary;
      if (
        !Array.isArray(result.plans) ||
        !Array.isArray(result.purchases) ||
        !Number.isFinite(result.currentPrice) ||
        typeof result.priceUpdatedAt !== 'string'
      ) {
        throw new Error('The Bitcoin accumulation summary returned incomplete information.');
      }
      setSummary(result);
      setIsEnrolled(true);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load your Bitcoin accumulation summary.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

  const accumulation = useMemo(() => {
    if (!summary) return null;

    const totalContributions = summary.purchases.reduce((total, purchase) => total + purchase.amountUsd, 0);
    const totalFees = summary.purchases.reduce((total, purchase) => total + purchase.feesUsd, 0);
    const totalBtc = summary.purchases.reduce((total, purchase) => total + purchase.btcReceived, 0);
    const costBasis = totalContributions + totalFees;
    const currentValue = totalBtc * summary.currentPrice;
    const activePlans = summary.plans.filter((plan) => plan.status === 'active');
    const scheduledContributions = activePlans.reduce((total, plan) => (
      total +
      plan.contributionAmount * getScheduledDates(plan.startDate, plan.endDate, plan.frequency).length +
      plan.initialContribution
    ), 0);

    const purchasesByDate = new Map<string, number>();
    for (const purchase of summary.purchases) {
      purchasesByDate.set(
        purchase.purchaseDate,
        (purchasesByDate.get(purchase.purchaseDate) ?? 0) + purchase.btcReceived,
      );
    }
    let cumulativeBtc = 0;
    const chartData = Array.from(purchasesByDate.entries())
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([date, dailyBtc]) => {
        cumulativeBtc += dailyBtc;
        return { date, btc: cumulativeBtc };
      });

    return {
      totalContributions,
      totalBtc,
      totalSats: Math.round(totalBtc * 100_000_000),
      averageAcquisitionPrice: totalBtc > 0 ? costBasis / totalBtc : null,
      currentValue,
      difference: currentValue - costBasis,
      activePlans: activePlans.length,
      scheduledContributions,
      chartData,
    };
  }, [summary]);

  if (loading || !isEnrolled) return null;

  if (error || !summary || !accumulation) {
    return (
      <section className="rounded-xl border border-red-400/25 bg-zinc-950/80 p-6" aria-labelledby="dca-summary-title">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <CircleAlert className="mt-1 h-5 w-5 shrink-0 text-red-300" aria-hidden="true" />
            <div>
              <h2 id="dca-summary-title" className="text-xl font-semibold text-zinc-50">My Bitcoin Accumulation</h2>
              <p role="alert" className="mt-2 text-sm text-zinc-300">{error || 'Your accumulation summary is unavailable.'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => void loadSummary()}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-zinc-700 px-3 text-sm text-zinc-200 hover:bg-zinc-900"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" /> Retry
          </button>
        </div>
      </section>
    );
  }

  const hasDcaRecords = summary.plans.length > 0 || summary.purchases.length > 0;
  if (!hasDcaRecords) {
    return (
      <section className="rounded-xl border border-cyan-400/25 bg-black/80 p-6 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
        <div className="flex items-start gap-3">
          <Bitcoin className="mt-1 h-6 w-6 shrink-0 text-orange-300" aria-hidden="true" />
          <div>
            <h2 className="text-xl font-semibold text-zinc-50">Start learning about Bitcoin DCA</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-300">
              Learn how Dollar-Cost Averaging works, create your first plan and explore how Bitcoin accumulation works.
            </p>
            <Link
              href="/dca?section=learn"
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-black transition hover:brightness-110"
            >
              Start learning about Bitcoin DCA <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5 rounded-xl border border-cyan-400/25 bg-black/80 p-5 shadow-[0_0_20px_rgba(34,211,238,0.1)] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-orange-300">Personal DCA summary</p>
          <h2 className="mt-1 text-2xl font-semibold text-zinc-50">My Bitcoin Accumulation</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
            Manually recorded purchases are unverified. Active plans and their scheduled contributions are hypothetical and are not included in accumulated BTC or portfolio value.
          </p>
        </div>
        <Link
          href="/dca?section=dashboard"
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-black transition hover:brightness-110"
        >
          View My DCA Dashboard <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <Metric label="Total USD contributed" value={formatCurrency(accumulation.totalContributions)} />
        <Metric label="Bitcoin accumulated" value={formatBtc(accumulation.totalBtc)} />
        <Metric label="Satoshis accumulated" value={`${accumulation.totalSats.toLocaleString('en-US')} sats`} />
        <Metric label="Current hypothetical portfolio value" value={formatCurrency(accumulation.currentValue)} detail={`BTC price ${formatCurrency(summary.currentPrice)} · updated ${formatDate(summary.priceUpdatedAt)}`} />
        <Metric
          label="Average acquisition price"
          value={accumulation.averageAcquisitionPrice === null ? '—' : formatCurrency(accumulation.averageAcquisitionPrice)}
          detail="Includes recorded fees"
        />
        <Metric
          label="Hypothetical difference"
          value={`${accumulation.difference >= 0 ? '+' : ''}${formatCurrency(accumulation.difference)}`}
          detail={`After recorded fees · ${accumulation.difference >= 0 ? 'above' : 'below'} recorded cost`}
          valueClass={accumulation.difference >= 0 ? 'text-emerald-300' : 'text-red-300'}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(240px,0.7fr)]">
        <div className="min-w-0 rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-zinc-100">Total accumulation progress</h3>
              <p className="mt-1 text-xs text-zinc-400">Cumulative BTC from manually recorded purchases only.</p>
            </div>
            {summary.lastUpdated && (
              <p className="text-xs text-zinc-500">Records updated {formatDate(summary.lastUpdated)}</p>
            )}
          </div>
          {accumulation.chartData.length ? (
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={accumulation.chartData}>
                  <CartesianGrid stroke="#3f3f46" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#a1a1aa', fontSize: 11 }}
                    minTickGap={28}
                    tickFormatter={(date: string) => new Intl.DateTimeFormat('en', { month: 'short', year: '2-digit', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`))}
                  />
                  <YAxis
                    tick={{ fill: '#a1a1aa', fontSize: 11 }}
                    tickFormatter={(value: number) => value.toFixed(4)}
                    width={64}
                  />
                  <Tooltip
                    contentStyle={{ background: '#09090b', border: '1px solid #3f3f46', borderRadius: 10, color: '#fff' }}
                    labelFormatter={(date) => formatDate(String(date))}
                    formatter={(value) => [formatBtc(Number(value)), 'Cumulative BTC']}
                  />
                  <Area type="monotone" dataKey="btc" name="Cumulative BTC" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.15} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="py-12 text-center text-sm text-zinc-400">Your accumulation chart will appear after you record a purchase.</p>
          )}
        </div>

        <div className="rounded-lg border border-orange-400/20 bg-orange-500/[0.04] p-4">
          <h3 className="font-semibold text-zinc-100">Hypothetical plans</h3>
          <p className="mt-1 text-xs text-zinc-400">Kept separate from recorded purchases.</p>
          <div className="mt-4 space-y-3">
            <Metric label="Active DCA plans" value={String(accumulation.activePlans)} />
            <Metric
              label="Total scheduled contributions"
              value={formatCurrency(accumulation.scheduledContributions)}
              detail="Across active plans' full date ranges"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  detail,
  valueClass = 'text-zinc-50',
}: {
  label: string;
  value: string;
  detail?: string;
  valueClass?: string;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
      <p className="text-xs text-zinc-400">{label}</p>
      <p className={`mt-1 break-words text-lg font-semibold ${valueClass}`}>{value}</p>
      {detail && <p className="mt-1 text-xs leading-5 text-zinc-500">{detail}</p>}
    </div>
  );
}
