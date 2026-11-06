'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
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

  // Cohort categorization: Open vs Completed
  const { openCohorts, completedCohorts } = useMemo(() => {
    const open: CohortItem[] = [];
    const completed: CohortItem[] = [];

    cohorts.forEach((c) => {
      const statusLower = (c.status || '').toLowerCase();
      const isFinished =
        statusLower === 'completed' ||
        statusLower === 'ended' ||
        c.available === 0;

      if (isFinished) {
        completed.push(c);
      } else {
        open.push(c);
      }
    });

    return { openCohorts: open, completedCohorts: completed };
  }, [cohorts]);

  // Filter state: 'open' | 'all' | 'completed'
  const [filter, setFilter] = useState<'open' | 'all' | 'completed'>('open');

  // View mode: 'grid' | 'carousel' (default 'grid' for easy vertical scrolling on mobile & desktop)
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('grid');

  // Active index for carousel pagination dots on mobile
  const [activeIndex, setActiveIndex] = useState(0);

  // Update default filter when cohorts load
  useEffect(() => {
    if (cohorts.length > 0) {
      if (openCohorts.length > 0) {
        setFilter('open');
      } else {
        setFilter('all');
      }
    }
  }, [cohorts.length, openCohorts.length]);

  // Filtered cohorts list
  const displayedCohorts = useMemo(() => {
    if (filter === 'open') {
      return openCohorts.length > 0 ? openCohorts : cohorts;
    }
    if (filter === 'completed') {
      return completedCohorts;
    }
    return cohorts;
  }, [filter, openCohorts, completedCohorts, cohorts]);

  // Carousel scrolling support
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);

    // Calculate approximate active card index for mobile dots
    const cardEl = scrollRef.current.querySelector('[data-cohort-card]') as HTMLElement | null;
    if (cardEl && cardEl.offsetWidth > 0) {
      const cardWidth = cardEl.offsetWidth + 16; // width + gap
      const newIndex = Math.round(scrollLeft / cardWidth);
      setActiveIndex(Math.max(0, Math.min(displayedCohorts.length - 1, newIndex)));
    }
  }, [displayedCohorts.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || viewMode !== 'carousel') return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [viewMode, displayedCohorts, checkScroll]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = Math.max(280, scrollRef.current.clientWidth * 0.78);
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const scrollToCardIndex = (index: number) => {
    if (!scrollRef.current) return;
    const cardEl = scrollRef.current.querySelector(`[data-card-index="${index}"]`) as HTMLElement | null;
    if (cardEl) {
      cardEl.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  };

  // Auto-scroll to selected cohort or first open cohort when in carousel mode
  useEffect(() => {
    if (viewMode !== 'carousel' || !scrollRef.current) return;
    const timer = setTimeout(() => {
      if (!scrollRef.current) return;
      const targetId = selectedCohort || openCohorts[0]?.id;
      if (targetId) {
        const cardEl = scrollRef.current.querySelector(`[data-cohort-id="${targetId}"]`);
        if (cardEl) {
          (cardEl as HTMLElement).scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center',
          });
        }
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [viewMode, selectedCohort, openCohorts]);

  // Find currently selected cohort details for mobile confirmation banner
  const selectedCohortItem = useMemo(() => {
    return cohorts.find((c) => c.id === selectedCohort);
  }, [cohorts, selectedCohort]);

  // Localized texts with fallbacks
  const tCohorts = t.form.cohorts;
  const labelOpenFilter = tCohorts.filter_open || (isTi ? 'ክፉታት ጥራይ' : 'Open for Enrollment');
  const labelAllFilter = tCohorts.filter_all || (isTi ? 'ኩሎም' : 'All Cohorts');
  const labelCompletedFilter = tCohorts.filter_completed || (isTi ? 'ዝተዛዘሙ' : 'Completed');
  const labelViewGrid = tCohorts.view_grid || (isTi ? 'ሰሌዳ' : 'Grid');
  const labelViewCarousel = tCohorts.view_carousel || (isTi ? 'ዝዝወር' : 'Carousel');

  return (
    <div className="space-y-4 border-b border-zinc-800 pb-6">
      {/* Header and Controls Toolbar */}
      <div className="space-y-3">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-zinc-50 tracking-tight">
              {tCohorts.heading}
            </h3>
            <p className="mt-0.5 text-xs sm:text-sm text-zinc-400">
              {tCohorts.subheading}
            </p>
          </div>

          {/* View Toggle & Carousel Navigation Controls */}
          {!loading && !error && cohorts.length > 0 && (
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              {/* Carousel Arrow Buttons (desktop & tablet) */}
              {viewMode === 'carousel' && (
                <div className="hidden sm:flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-950 p-1 shadow-sm">
                  <button
                    type="button"
                    onClick={() => handleScroll('left')}
                    disabled={!canScrollLeft}
                    aria-label={tCohorts.scroll_prev || (isTi ? 'ናብ ዝሓለፈ' : 'Previous')}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg text-zinc-300 transition active:scale-95",
                      canScrollLeft
                        ? "hover:bg-zinc-800 hover:text-cyan-300"
                        : "cursor-not-allowed opacity-30 text-zinc-600"
                    )}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleScroll('right')}
                    disabled={!canScrollRight}
                    aria-label={tCohorts.scroll_next || (isTi ? 'ናብ ዝቕጽል' : 'Next')}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg text-zinc-300 transition active:scale-95",
                      canScrollRight
                        ? "hover:bg-zinc-800 hover:text-cyan-300"
                        : "cursor-not-allowed opacity-30 text-zinc-600"
                    )}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Grid vs Carousel View Toggle */}
              <div className="flex items-center rounded-xl border border-zinc-800 bg-zinc-950 p-1 shadow-sm">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition active:scale-95 touch-manipulation",
                    viewMode === 'grid'
                      ? "bg-zinc-800 text-cyan-300 shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  )}
                  title={labelViewGrid}
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span className="hidden xs:inline">{labelViewGrid}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('carousel')}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition active:scale-95 touch-manipulation",
                    viewMode === 'carousel'
                      ? "bg-zinc-800 text-cyan-300 shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  )}
                  title={labelViewCarousel}
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  <span className="hidden xs:inline">{labelViewCarousel}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Filter Tabs - Mobile touch-scrollable strip */}
        {!loading && !error && cohorts.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1 -mx-2 px-2 sm:mx-0 sm:px-0 sm:flex-wrap">
            {/* Open Filter */}
            <button
              type="button"
              onClick={() => setFilter('open')}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium transition border touch-manipulation active:scale-95",
                filter === 'open'
                  ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                  : "border-zinc-800 bg-zinc-950/70 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
              )}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{labelOpenFilter}</span>
              <span className={cn(
                "rounded-full px-1.5 py-0.2 text-[10px] font-semibold",
                filter === 'open' ? "bg-emerald-500/30 text-emerald-200" : "bg-zinc-800 text-zinc-400"
              )}>
                {openCohorts.length}
              </span>
            </button>

            {/* All Filter */}
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium transition border touch-manipulation active:scale-95",
                filter === 'all'
                  ? "border-cyan-400/60 bg-cyan-500/15 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                  : "border-zinc-800 bg-zinc-950/70 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
              )}
            >
              <span>{labelAllFilter}</span>
              <span className={cn(
                "rounded-full px-1.5 py-0.2 text-[10px] font-semibold",
                filter === 'all' ? "bg-cyan-500/30 text-cyan-200" : "bg-zinc-800 text-zinc-400"
              )}>
                {cohorts.length}
              </span>
            </button>

            {/* Completed Filter */}
            {completedCohorts.length > 0 && (
              <button
                type="button"
                onClick={() => setFilter('completed')}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium transition border touch-manipulation active:scale-95",
                  filter === 'completed'
                    ? "border-zinc-600 bg-zinc-800 text-zinc-300"
                    : "border-zinc-800 bg-zinc-950/70 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                )}
              >
                <span>{labelCompletedFilter}</span>
                <span className={cn(
                  "rounded-full px-1.5 py-0.2 text-[10px] font-semibold",
                  filter === 'completed' ? "bg-zinc-700 text-zinc-200" : "bg-zinc-900 text-zinc-500"
                )}>
                  {completedCohorts.length}
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Selected Cohort Confirmation Banner (Sticky clarity on mobile) */}
      {selectedCohortItem && (
        <div className="flex items-center justify-between rounded-xl border border-amber-400/50 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent px-3.5 py-2.5 text-xs sm:text-sm text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400 text-black font-bold text-[11px]">
              ✓
            </span>
            <div className="truncate">
              <span className="font-semibold text-amber-300">
                {isTi ? 'ዝተመርጸ ጉጅለ:' : 'Selected Cohort:'}
              </span>{' '}
              <span className="text-zinc-100 font-bold">{selectedCohortItem.name}</span>
              <span className="hidden xs:inline text-zinc-400 ml-1.5">
                ({selectedCohortItem.startDate})
              </span>
            </div>
          </div>
          <span className="shrink-0 text-[11px] font-semibold text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded-full ml-2">
            {selectedCohortItem.available} {tCohorts.seats_available_suffix || (isTi ? 'ክፉት' : 'open')}
          </span>
        </div>
      )}

      {/* Main Cohorts Content Area */}
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
          {filter !== 'all' && (
            <button
              type="button"
              onClick={() => setFilter('all')}
              className="mt-3 inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 hover:underline"
            >
              <span>{isTi ? 'ኩሎም ዝሓለፉ ጉጅለታት ርአ' : 'View all previous cohorts'}</span>
              <span>→</span>
            </button>
          )}
        </div>
      ) : (
        <div className="relative">
          {/* Gradient fade edge for carousel */}
          {viewMode === 'carousel' && (
            <div
              className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-zinc-950/90 to-transparent z-10"
              aria-hidden
            />
          )}

          {/* Container: either Grid or Horizontal Carousel */}
          <div
            ref={scrollRef}
            className={cn(
              viewMode === 'grid'
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5 py-1"
                : "overflow-x-auto overflow-y-hidden scroll-smooth scrollbar-hide py-1 -mx-3 px-3 sm:-mx-4 sm:px-4 snap-x snap-mandatory"
            )}
            style={
              viewMode === 'carousel'
                ? { WebkitOverflowScrolling: 'touch' }
                : undefined
            }
          >
            <div
              className={cn(
                viewMode === 'carousel'
                  ? "flex gap-3.5 sm:gap-5 w-max min-w-full pb-2"
                  : "contents"
              )}
            >
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
                    data-cohort-card="true"
                    data-card-index={index}
                    className={cn(
                      "cohort-card-entrance rounded-2xl overflow-hidden transition-all duration-300",
                      viewMode === 'carousel' &&
                        "flex-shrink-0 w-[82vw] max-w-[340px] sm:w-[320px] lg:w-[340px] snap-center sm:snap-start",
                      isCardSelected &&
                        "ring-2 ring-amber-400/90 ring-offset-2 ring-offset-zinc-950 shadow-[0_0_36px_rgba(245,158,11,0.35),0_0_72px_rgba(234,179,8,0.12)]",
                      !isCompleted &&
                        !isCardSelected &&
                        "hover:border-cyan-400/60 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] cursor-pointer active:scale-[0.99]"
                    )}
                    style={
                      viewMode === 'carousel'
                        ? { animationDelay: `${index * 60}ms` }
                        : { animationDelay: `${index * 60}ms` }
                    }
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

          {/* Mobile Carousel Indicators & Quick Arrows (Shown only in carousel view on mobile) */}
          {viewMode === 'carousel' && displayedCohorts.length > 1 && (
            <div className="flex sm:hidden items-center justify-between pt-2 px-1">
              {/* Prev Mobile Arrow */}
              <button
                type="button"
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-300 transition active:scale-95 touch-manipulation",
                  canScrollLeft ? "text-cyan-300" : "opacity-30 cursor-not-allowed"
                )}
                aria-label="Previous"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Interactive Pagination Dots */}
              <div className="flex items-center gap-1.5">
                {displayedCohorts.map((c, i) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => scrollToCardIndex(i)}
                    className={cn(
                      "h-2 rounded-full transition-all duration-300 touch-manipulation",
                      i === activeIndex
                        ? "w-6 bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                        : "w-2 bg-zinc-700 hover:bg-zinc-500"
                    )}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              {/* Next Mobile Arrow */}
              <button
                type="button"
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-300 transition active:scale-95 touch-manipulation",
                  canScrollRight ? "text-cyan-300" : "opacity-30 cursor-not-allowed"
                )}
                aria-label="Next"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
