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
import { useLanguage } from '@/contexts/LanguageContext';
import { getDcaCopy } from '@/lib/translations/dca';

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
  const { language } = useLanguage();
  const t = getDcaCopy(language);
  const hs = t.health_score;

  const [windowDays, setWindowDays] = useState<30 | 90 | 180>(90);

  const health = calculateDcaHealthScore(plan, purchases, windowDays, language as 'en' | 'ti');

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
            <h3 className="text-base font-bold text-zinc-900">{hs.title}</h3>
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
              {hs.days_selector.replace('{days}', String(days))}
            </button>
          ))}
        </div>
      </div>

      {/* Main Score Hero Section */}
      <div className="grid gap-6 md:grid-cols-[200px_1fr] items-center">
        {/* Circular Gauge / Badge */}
        <div className="flex flex-col items-center justify-center text-center p-4 rounded-2xl border border-zinc-100 bg-zinc-50/60">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            {hs.overall_health}
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
            {language === 'ti' ? health.classificationTigrinya : health.classification}
          </span>
        </div>

        {/* Breakdown Progress Bars */}
        <div className="space-y-3.5">
          {/* 1. Schedule Consistency */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-zinc-700">{hs.schedule_consistency}</span>
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
              {hs.schedule_detail
                .replace('{onTime}', String(health.details.onTimeContributions))
                .replace('{due}', String(health.details.dueContributions))}
            </span>
          </div>

          {/* 2. Contribution Consistency */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-zinc-700">{hs.contribution_consistency}</span>
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
              {hs.contribution_detail
                .replace('{recorded}', health.details.recordedAmount.toLocaleString())
                .replace('{planned}', health.details.plannedAmount.toLocaleString())}
            </span>
          </div>

          {/* 3. Goal Progress */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-zinc-700">{hs.goal_progress}</span>
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
              {hs.goal_detail.replace('{btc}', (health.details.currentSats / 100_000_000).toFixed(4))}
            </span>
          </div>

          {/* 4. Tracking Activity */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-zinc-700">{hs.tracking_activity}</span>
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
              {hs.tracking_detail.replace('{periods}', String(health.details.activeTrackingPeriods))}
            </span>
          </div>
        </div>
      </div>

      {/* Actionable Insights */}
      <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-4 space-y-2.5">
        <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider block">
          {hs.insights_heading}
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
        <div className="flex flex-wrap items-center justify-end gap-3 pt-2 text-xs text-zinc-600 border-t border-zinc-100">
          <button
            type="button"
            onClick={onOpenAlerts}
            className="font-semibold text-[#f97602] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Clock className="h-4 w-4" />
            {hs.reminders_btn} <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
