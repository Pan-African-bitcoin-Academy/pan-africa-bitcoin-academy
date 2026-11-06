'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { cn } from '@/lib/styles';
import type { ApplyCopy } from '@/lib/translations/apply';

export interface CohortItem {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  sessions: number;
  level: string;
  seats: number;
  available: number;
  enrolled: number;
}

interface CohortSelectorProps {
  cohorts: CohortItem[];
  loading: boolean;
  error: string | null;
  selectedCohort: string | null;
  onSelectCohort: (cohort: CohortItem) => void;
  t: ApplyCopy;
  isTi: boolean;
}

export function CohortSelector({
  cohorts,
  loading,
  error,
  selectedCohort,
  onSelectCohort,
  t,
  isTi,
}: CohortSelectorProps) {
  // Normalize level strings (fixing typos like 'begginer')
  const normalizeLevel = useCallback((lvl?: string): string => {
    if (!lvl) return 'beginner';
    const clean = lvl.trim().toLowerCase();
    if (clean === 'beginner' || clean === 'begginer') return 'beginner';
    if (clean === 'intermediate') return 'intermediate';
    if (clean === 'advanced') return 'advanced';
    return clean;
  }, []);

  // Format level for display with bilingual clarity
  const formatLevelDisplay = useCallback(
    (lvl?: string): string => {
      const key = normalizeLevel(lvl);
      if (isTi) {
        if (key === 'beginner') return 'ጀማሪ (Beginner)';
        if (key === 'intermediate') return 'ማእከላይ (Intermediate)';
        if (key === 'advanced') return 'ምዕቡል (Advanced)';
        return lvl || 'ጀማሪ';
      }
      if (key === 'beginner') return 'Beginner';
      if (key === 'intermediate') return 'Intermediate';
      if (key === 'advanced') return 'Advanced';
      return lvl || 'Beginner';
    },
    [isTi, normalizeLevel]
  );

  // Filter: show open only vs all
  const [showAll, setShowAll] = useState(false);

  // Smart sort: Open cohorts first, completed cohorts after
  const sortedCohorts = useMemo(() => {
    return [...cohorts].sort((a, b) => {
      const aFinished =
        a.available === 0 ||
        (a.status || '').toLowerCase() === 'completed' ||
        (a.status || '').toLowerCase() === 'ended';
      const bFinished =
        b.available === 0 ||
        (b.status || '').toLowerCase() === 'completed' ||
        (b.status || '').toLowerCase() === 'ended';

      // Open cohorts come first
      if (!aFinished && bFinished) return -1;
      if (aFinished && !bFinished) return 1;

      // Within same status, sort newest first
      const aTime = a.startDate ? new Date(a.startDate).getTime() : 0;
      const bTime = b.startDate ? new Date(b.startDate).getTime() : 0;
      return bTime - aTime;
    });
  }, [cohorts]);

  // Open cohorts list
  const openCohorts = useMemo(() => {
    return sortedCohorts.filter((c) => {
      const statusLower = (c.status || '').toLowerCase();
      return (
        c.available > 0 &&
        statusLower !== 'completed' &&
        statusLower !== 'ended'
      );
    });
  }, [sortedCohorts]);

  // Displayed cohorts: if not showAll and open cohorts exist, show only open ones
  const displayedCohorts = useMemo(() => {
    if (!showAll && openCohorts.length > 0) {
      return openCohorts;
    }
    return sortedCohorts;
  }, [showAll, openCohorts, sortedCohorts]);

  const tCohorts = t.form.cohorts;

  return (
    <div className="space-y-4 border-b border-zinc-800 pb-6">
      {/* Header and Filter Switcher */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-zinc-50 tracking-tight">
            {tCohorts.heading}
          </h3>
          <p className="mt-0.5 text-xs sm:text-sm text-zinc-400">
            {tCohorts.subheading}
          </p>
        </div>

        {/* Minimalist Switcher: Open vs All */}
        {!loading && !error && cohorts.length > 0 && openCohorts.length > 0 && (
          <div className="inline-flex items-center rounded-xl border border-zinc-800 bg-zinc-950 p-1 self-start sm:self-auto shrink-0 shadow-sm">
            <button
              type="button"
              onClick={() => setShowAll(false)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition active:scale-95 touch-manipulation",
                !showAll
                  ? "bg-amber-400 text-black shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              <span className="flex items-center gap-1.5">
                <span className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  !showAll ? "bg-black" : "bg-emerald-400 animate-pulse"
                )} />
                <span>{isTi ? 'ክፉታት' : 'Open'}</span>
                <span>({openCohorts.length})</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition active:scale-95 touch-manipulation",
                showAll
                  ? "bg-amber-400 text-black shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              <span>{isTi ? 'ኩሎም' : 'All'}</span>{' '}
              <span>({cohorts.length})</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Cohorts Horizontal Carousel */}
      {loading ? (
        <div className="flex items-center justify-center py-12 text-cyan-400 text-sm">
          <svg className="animate-spin h-5 w-5 mr-3 text-cyan-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>{tCohorts.loading}</span>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-center text-sm text-red-300">
          {error}
        </div>
      ) : displayedCohorts.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8 text-center text-zinc-400">
          <p className="text-sm">{tCohorts.empty}</p>
        </div>
      ) : (
        <div className="relative">
          {/* Subtle gradient right edge indicating more cards to swipe */}
          {displayedCohorts.length > 1 && (
            <div
              className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-zinc-950/90 to-transparent z-10"
              aria-hidden
            />
          )}

          {/* Horizontal Carousel (Mobile swipe-friendly with snap) */}
          <div
            className="overflow-x-auto overflow-y-hidden scroll-smooth scrollbar-hide py-1 -mx-3 px-3 sm:-mx-4 sm:px-4 snap-x snap-mandatory"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <div className="flex gap-3.5 sm:gap-5 w-max min-w-full pb-2">
              {displayedCohorts.map((cohort, index) => {
                const statusLower = (cohort.status || '').toLowerCase();
                const isCompleted =
                  statusLower === 'completed' ||
                  statusLower === 'ended' ||
                  cohort.available === 0;
                const isActive =
                  !isCompleted && (statusLower === 'active' || statusLower === 'live');
                const isUpcoming = !isCompleted && !isActive;

                const seatsPct = cohort.seats
                  ? Math.round((cohort.available / cohort.seats) * 100)
                  : 0;
                const levelKey = normalizeLevel(cohort.level);
                const levelLabel = formatLevelDisplay(cohort.level);
                const isCardSelected = selectedCohort === cohort.id;

                return (
                  <div
                    key={cohort.id}
                    data-cohort-id={cohort.id}
                    className={cn(
                      "cohort-card-entrance flex-shrink-0 w-[84vw] max-w-[340px] sm:w-[320px] lg:w-[340px] snap-center sm:snap-start rounded-2xl overflow-hidden transition-all duration-300",
                      isCardSelected &&
                        "ring-2 ring-amber-400/90 ring-offset-2 ring-offset-zinc-950 shadow-[0_0_36px_rgba(245,158,11,0.35),0_0_72px_rgba(234,179,8,0.12)]",
                      !isCompleted &&
                        !isCardSelected &&
                        "hover:border-cyan-400/60 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] cursor-pointer active:scale-[0.99]"
                    )}
                    style={{ animationDelay: `${index * 60}ms` }}
                    onClick={() => {
                      if (!isCompleted) {
                        onSelectCohort(cohort);
                      }
                    }}
                  >
                    <div
                      className={cn(
                        "h-full rounded-2xl border bg-zinc-900/90 p-4 sm:p-5 flex flex-col transition-[box-shadow,border-color] duration-300",
                        isCardSelected &&
                          "border-amber-400/80 bg-zinc-900 shadow-[inset_0_0_0_1px_rgba(251,191,36,0.2),0_0_28px_rgba(245,158,11,0.18)]",
                        !isCardSelected && isCompleted && "border-zinc-800 bg-zinc-950/60 opacity-75",
                        !isCardSelected && isActive && "border-emerald-500/50 shadow-[0_0_24px_rgba(16,185,129,0.12)]",
                        !isCardSelected && isUpcoming && "border-cyan-500/40"
                      )}
                    >
                      {/* Card Header: Status & Level Badges */}
                      <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2.5">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 sm:py-1 text-[11px] sm:text-xs font-semibold uppercase tracking-wide",
                            isCompleted && "bg-zinc-800/80 text-zinc-400 border border-zinc-700/50",
                            isActive && "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
                            isUpcoming && "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                          )}
                        >
                          {isActive && (
                            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          )}
                          {isUpcoming && (
                            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-cyan-400" />
                          )}
                          {isCompleted
                            ? tCohorts.status_completed
                            : isActive
                              ? tCohorts.status_active
                              : tCohorts.status_upcoming}
                        </span>

                        <span
                          className={cn(
                            "rounded-full px-2.5 py-0.5 sm:py-1 text-[11px] sm:text-xs font-medium border",
                            levelKey === 'intermediate' && "bg-amber-500/15 text-amber-300 border-amber-500/30",
                            levelKey === 'advanced' && "bg-purple-500/15 text-purple-300 border-purple-500/30",
                            levelKey === 'beginner' && "bg-blue-500/15 text-blue-300 border-blue-500/30"
                          )}
                        >
                          {levelLabel}
                        </span>
                      </div>

                      {/* Cohort Name */}
                      <h4 className="text-base sm:text-lg font-bold text-zinc-50 mb-1 leading-snug">
                        {cohort.name}
                      </h4>

                      {/* Dates */}
                      <p className="text-xs sm:text-sm text-zinc-400 mb-3 flex items-center gap-1.5 flex-wrap">
                        <svg className="h-3.5 w-3.5 text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium text-zinc-300">{cohort.startDate}</span>
                        <span className="text-zinc-500">→</span>
                        <span className="font-medium text-zinc-300">{cohort.endDate}</span>
                      </p>

                      {/* Sessions & Seats Info */}
                      <div className="flex items-center justify-between text-xs sm:text-sm mb-2.5">
                        <span className="text-zinc-400">
                          <span className="font-semibold text-zinc-200">{cohort.sessions}</span> {tCohorts.sessions_suffix}
                        </span>
                        <span
                          className={cn(
                            "font-medium",
                            cohort.available === 0
                              ? "text-zinc-500"
                              : isCardSelected
                                ? "text-amber-400 font-semibold"
                                : "text-cyan-300"
                          )}
                        >
                          <span className="font-semibold">{cohort.available}</span> / {cohort.seats} {tCohorts.seats_suffix}
                        </span>
                      </div>

                      {/* Visual Seat Capacity Bar */}
                      <div className="mb-4 h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            cohort.available === 0 && "bg-zinc-600",
                            cohort.available > 0 && seatsPct <= 20 && "bg-amber-500/80",
                            cohort.available > 0 && seatsPct > 20 && !isCardSelected && "bg-cyan-500/80",
                            cohort.available > 0 && seatsPct > 20 && isCardSelected && "bg-gradient-to-r from-amber-500 to-amber-400"
                          )}
                          style={{ width: `${Math.max(4, 100 - seatsPct)}%` }}
                          aria-hidden
                        />
                      </div>

                      {/* Select / Status Action Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!isCompleted) {
                            onSelectCohort(cohort);
                          }
                        }}
                        disabled={isCompleted}
                        className={cn(
                          "mt-auto w-full min-h-[44px] rounded-xl py-2.5 px-4 text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 touch-manipulation active:scale-[0.98]",
                          isCompleted
                            ? "cursor-not-allowed bg-zinc-800/80 text-zinc-500 border border-zinc-700/40"
                            : isCardSelected
                              ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.45)] hover:from-amber-300 hover:to-amber-400"
                              : "bg-zinc-800 text-zinc-100 border border-zinc-700/60 hover:bg-zinc-750 hover:border-cyan-400/50 hover:text-cyan-300"
                        )}
                      >
                        {isCompleted ? (
                          <>
                            <svg className="h-4 w-4 text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span>{tCohorts.btn_full}</span>
                          </>
                        ) : isCardSelected ? (
                          <>
                            <svg className="h-4 w-4 text-black shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{tCohorts.btn_selected}</span>
                          </>
                        ) : (
                          <>
                            <span>{tCohorts.btn_select}</span>
                            <svg className="h-3.5 w-3.5 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
