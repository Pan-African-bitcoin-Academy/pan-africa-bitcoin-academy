'use client';

import { useState, useEffect, useTransition, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

interface NextChapterButtonProps {
  nextChapterSlug: string;
  nextChapterNumber: number;
  currentChapterNumber: number;
  currentChapterSlug: string;
  variant?: 'top' | 'bottom';
}

export function NextChapterButton({ 
  nextChapterSlug, 
  nextChapterNumber,
  currentChapterNumber,
  currentChapterSlug,
  variant = 'bottom'
}: NextChapterButtonProps) {
  const router = useRouter();
  const { isAuthenticated, profile } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [isChapterCompleted, setIsChapterCompleted] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Check if chapter is already completed - use requestIdleCallback to avoid blocking
  useEffect(() => {
    if (!isAuthenticated || !profile) return;

    // Use requestIdleCallback to defer non-critical API call
    const checkCompletion = async () => {
      try {
        const response = await fetch('/api/chapters/unlock-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: profile.email }),
        });

        if (response.ok) {
          const data = await response.json();
          const chapterStatus = data.chapters?.[currentChapterNumber];
          if (chapterStatus?.isCompleted) {
            setIsChapterCompleted(true);
          }
        }
      } catch (error) {
        console.error('Error checking chapter completion:', error);
      }
    };

    // Defer the API call to avoid blocking initial render
    if ('requestIdleCallback' in window) {
      requestIdleCallback(checkCompletion, { timeout: 2000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(checkCompletion, 0);
    }
  }, [isAuthenticated, profile, currentChapterNumber]);

  const handleNextClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    if (!isAuthenticated || !profile) {
      // Not authenticated - just navigate (will be caught by access check)
      router.push(`/chapters/${nextChapterSlug}`);
      return;
    }

    // If chapter is already completed (after 4 min), navigate directly
    if (isChapterCompleted) {
      router.push(`/chapters/${nextChapterSlug}`);
      return;
    }

    // Chapter not completed yet - show confirmation dialog
    setShowConfirmDialog(true);
  };

  const handleConfirm = () => {
    if (!profile) return;
    
    setShowConfirmDialog(false);
    setIsMarkingComplete(true);

    // Use startTransition for navigation and defer API call
    startTransition(() => {
      // Mark current chapter as completed before navigating
      fetch('/api/chapters/mark-completed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: profile.email,
          chapterNumber: currentChapterNumber,
          chapterSlug: currentChapterSlug,
        }),
      })
        .then((response) => {
          if (response.ok) {
            setIsChapterCompleted(true);
          }
          // Navigate regardless of API response (access check will handle it)
          router.push(`/chapters/${nextChapterSlug}`);
        })
        .catch((error) => {
          console.error('Error marking chapter as completed:', error);
          // On error, still navigate (access check will handle it)
          router.push(`/chapters/${nextChapterSlug}`);
        })
        .finally(() => {
          setIsMarkingComplete(false);
        });
    });
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
    // Stay on current chapter
  };

  const baseClasses = variant === 'top' 
    ? 'inline-flex items-center justify-center rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-400/70 hover:bg-cyan-500/20'
    : 'inline-flex items-center justify-center rounded-lg border border-orange-400/50 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-100 transition hover:bg-orange-500/20';

  const text = variant === 'top' 
    ? `Chapter ${nextChapterNumber} →`
    : `Next: Chapter ${nextChapterNumber} →`;

  return (
    <>
      <Link
        href={`/chapters/${nextChapterSlug}`}
        onClick={handleNextClick}
        className={`${baseClasses} ${
          isMarkingComplete || isPending ? 'opacity-70 cursor-wait' : ''
        }`}
      >
        {isMarkingComplete ? (
          <>
            <span className={`mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid ${
              variant === 'top' ? 'border-cyan-200 border-r-transparent' : 'border-orange-100 border-r-transparent'
            }`}></span>
            Loading...
          </>
        ) : (
          text
        )}
      </Link>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-xl border border-orange-400/50 bg-zinc-900 p-6 shadow-2xl">
            <h3 className="mb-4 text-xl font-semibold text-orange-200">
              Are you sure you're done reading?
            </h3>
            <p className="mb-6 text-sm text-zinc-300">
              You haven't spent enough time on this chapter yet. We recommend reading all the content carefully before moving to the next chapter. Are you sure you want to proceed?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-700"
              >
                Stay on Chapter
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 rounded-lg border border-orange-400/50 bg-orange-500/20 px-4 py-2 text-sm font-semibold text-orange-200 transition hover:bg-orange-500/30"
              >
                Yes, Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
