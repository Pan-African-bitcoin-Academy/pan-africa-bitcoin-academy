'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface ChapterCompletionTrackerProps {
  chapterNumber: number;
  chapterSlug: string;
}

export function ChapterCompletionTracker({ chapterNumber, chapterSlug }: ChapterCompletionTrackerProps) {
  const { isAuthenticated, profile } = useAuth();

  useEffect(() => {
    // Don't track if not authenticated
    if (!isAuthenticated || !profile) return;

    // Wait 4 minutes before marking as completed (user has had time to read)
    const timer = setTimeout(async () => {
      try {
        const response = await fetch('/api/chapters/mark-completed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: profile.email,
            chapterNumber,
            chapterSlug,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            console.log(`[ChapterCompletionTracker] Chapter ${chapterNumber} marked as completed`);
          }
        } else {
          console.error(`[ChapterCompletionTracker] Failed to mark chapter ${chapterNumber} as completed:`, await response.json());
        }
      } catch (error) {
        console.error('[ChapterCompletionTracker] Error tracking chapter completion:', error);
      }
    }, 240000); // 4 minutes (240000ms)

    // Cleanup: Clear timer if component unmounts or dependencies change
    return () => {
      clearTimeout(timer);
    };
  }, [isAuthenticated, profile, chapterNumber, chapterSlug]);

  return null; // This component doesn't render anything
}




