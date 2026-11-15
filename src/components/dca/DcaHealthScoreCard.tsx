'use client';

import { useState } from 'react';
import {
  Activity,
  Award,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import type { DcaPlan, DcaPurchase } from '@/app/dca/DcaExperience';
import { calculateDcaHealthScore } from '@/lib/dca/dcaHealthScore';

interface DcaHealthScoreCardProps {
  plan: DcaPlan | undefined;
  purchases: DcaPurchase[];
  onOpenAlerts?: () => void;
}

export function DcaHealthScoreCard({
  plan,
  purchases,
  onOpenAlerts,
}: DcaHealthScoreCardProps) {
  const [windowDays, setWindowDays] = useState<30 | 90 | 180>(90);

  const health = calculateDcaHealthScore(plan, purchases, windowDays);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 75) return 'text-teal-600 bg-teal-50 border-teal-200';
    if (score >= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
    if (score >= 40) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 75) return 'bg-teal-500';
    if (score >= 60) return 'bg-amber-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-rose-500';
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs space-y-6">
      {/* Top Header & Window Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-[#f97602] border border-orange-200/60">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-900">DCA Health Score</h3>
            <p className="text-xs text-zinc-500">
              Measures discipline and savings plan adherence, independent of BTC price
            </p>
          </div>
        </div>

        {/* Rolling Time Window Tabs */}
        <div className="flex rounded-lg border border-zinc-200 p-1 bg-zinc-50 text-xs">
          {([30, 90, 180] as const).map((days) => (
            <button
              key={days}
              type="button"
              onClick={() => setWindowDays(days)}
              className={`rounded-md px-3 py-1 font-medium transition cursor-pointer ${
                windowDays === days
                  ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              {days} Days
            </button>
          ))}
        </div>
      </div>

      {/* Main Score Hero Section */}
      <div className="grid gap-6 md:grid-cols-[200px_1fr] items-center">
        {/* Circular Gauge / Badge */}
        <div className="flex flex-col items-center justify-center text-center p-4 rounded-2xl border border-zinc-100 bg-zinc-50/60">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Overall Health
          </span>
          <div className="my-2 flex items-baseline gap-1">
            <span className="text-5xl font-black tracking-tight text-zinc-900">
              {health.overallScore}
            </span>
            <span className="text-sm font-semibold text-zinc-400">/100</span>
          </div>
          <span
            className={`rounded-full px-3 py-0.5 text-xs font-bold border ${getScoreColor(
              health.overallScore
            )}`}
          >
            {health.classification} ({health.classificationTigrinya})
          </span>
        </div>

        {/* Breakdown Progress Bars */}
        <div className="space-y-3.5">
          {/* 1. Schedule Consistency */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-zinc-700">Schedule Consistency (35%)</span>
              <span className="font-mono text-zinc-900 font-bold">
                {health.components.scheduleConsistency}/100
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
                  health.components.scheduleConsistency
                )}`}
                style={{ width: `${health.components.scheduleConsistency}%` }}
              />
            </div>
            <span className="text-[11px] text-zinc-400 block mt-0.5">
              {health.details.onTimeContributions} of {health.details.dueContributions} due
              contributions logged on time
            </span>
          </div>

          {/* 2. Contribution Consistency */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-zinc-700">Contribution Consistency (30%)</span>
              <span className="font-mono text-zinc-900 font-bold">
                {health.components.contributionConsistency}/100
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
                  health.components.contributionConsistency
                )}`}
                style={{ width: `${health.components.contributionConsistency}%` }}
              />
            </div>
            <span className="text-[11px] text-zinc-400 block mt-0.5">
              ${health.details.recordedAmount.toLocaleString()} USD recorded vs $
              {health.details.plannedAmount.toLocaleString()} USD planned
            </span>
          </div>

          {/* 3. Goal Progress */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-zinc-700">Goal Progress (20%)</span>
              <span className="font-mono text-zinc-900 font-bold">
                {health.components.goalProgress}/100
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
                  health.components.goalProgress
                )}`}
                style={{ width: `${health.components.goalProgress}%` }}
              />
            </div>
            <span className="text-[11px] text-zinc-400 block mt-0.5">
              {(health.details.currentSats / 100_000_000).toFixed(4)} BTC accumulated toward target
            </span>
          </div>

          {/* 4. Tracking Activity */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-zinc-700">Tracking Activity (15%)</span>
              <span className="font-mono text-zinc-900 font-bold">
                {health.components.trackingActivity}/100
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
                  health.components.trackingActivity
                )}`}
                style={{ width: `${health.components.trackingActivity}%` }}
              />
            </div>
            <span className="text-[11px] text-zinc-400 block mt-0.5">
              {health.details.activeTrackingPeriods} tracking periods kept up to date
            </span>
          </div>
        </div>
      </div>

      {/* Actionable Insights */}
      <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-4 space-y-2.5">
        <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider block">
          What is affecting your score?
        </span>
        <div className="grid gap-2 sm:grid-cols-3">
          {health.insights.map((insight, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-zinc-200 bg-white p-3 text-xs space-y-1 shadow-2xs"
            >
              <div className="flex items-center gap-1.5 font-semibold text-zinc-800">
                {insight.type === 'positive' && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                )}
                {insight.type === 'warning' && (
                  <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                )}
                {insight.type === 'info' && <Info className="h-4 w-4 text-cyan-600 shrink-0" />}
                <span>{insight.title}</span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed">{insight.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Alerts Callout Footer */}
      {onOpenAlerts && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-zinc-600 border-t border-zinc-100">
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-[#f97602]" />
            Never miss a contribution with automated reminders.
          </span>
          <button
            type="button"
            onClick={onOpenAlerts}
            className="font-semibold text-[#f97602] hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            Configure Smart Reminders <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
