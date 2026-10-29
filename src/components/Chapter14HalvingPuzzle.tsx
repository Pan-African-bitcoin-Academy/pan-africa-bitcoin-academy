'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSession } from '@/hooks/useSession';
import { useLanguage } from '@/contexts/LanguageContext';

interface Chapter14HalvingPuzzleProps {
  assignmentId: string;
}

interface AssignmentItem {
  id?: string;
  chapterSlug?: string;
  submission?: { id?: string; status?: string; answer?: string };
}

const TILES = ['50 BTC', '25 BTC', '12.5 BTC', '6.25 BTC', '3.125 BTC'];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function Chapter14HalvingPuzzle({ assignmentId }: Chapter14HalvingPuzzleProps) {
  const { profile, isAuthenticated, loading: authLoading, sessionEmail } = useAuth();
  const studentEmail = profile?.email || sessionEmail || null;
  const { language } = useLanguage();
  const isTi = language === 'ti';
  const { isAuthenticated: isAdminAuth, email: adminEmail, loading: adminLoading } = useSession('admin');

  const [availableTiles, setAvailableTiles] = useState<string[]>([]);
  const [timelineSlots, setTimelineSlots] = useState<(string | null)[]>(Array(5).fill(null));
  const [feedback, setFeedback] = useState<string | null>(null);
  const [universalMessage, setUniversalMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAvailableTiles(shuffleArray(TILES));
  }, []);

  const checkSubmissionStatus = useCallback(async () => {
    try {
      setLoading(true);
      const email = isAdminAuth && adminEmail ? adminEmail : studentEmail;
      if (!email) return;

      const response = await fetch(`/api/assignments?email=${encodeURIComponent(email)}`, {
        credentials: 'include',
      });
      if (!response.ok) return;

      const data = await response.json();
      const related = (data.assignments as AssignmentItem[])?.filter(
        (a) => a.id === assignmentId || a.chapterSlug === 'proof-of-work-and-block-rewards'
      );
      const hasSavedSubmission = related?.some((a) => !!a.submission) ?? false;

      setSubmitted(hasSavedSubmission);
    } catch (err) {
      console.error('Error checking submission status:', err);
    } finally {
      setLoading(false);
    }
  }, [isAdminAuth, adminEmail, studentEmail, assignmentId]);

  useEffect(() => {
    if (authLoading || adminLoading) return;
    if ((isAuthenticated && studentEmail) || (isAdminAuth && adminEmail)) {
      checkSubmissionStatus();
    } else {
      setLoading(false);
    }
  }, [authLoading, adminLoading, isAuthenticated, studentEmail, isAdminAuth, adminEmail, checkSubmissionStatus]);

  const getFeedbackForPlacement = (
    tile: string,
    slotIndex: number,
    currentSlots: (string | null)[]
  ): string | null => {
    if (tile === '25 BTC' && slotIndex === 0) {
      return 'Bitcoin started at its highest reward. Scarcity is enforced over time, not retroactively.';
    }
    if (tile === '12.5 BTC' && currentSlots[0] === '50 BTC' && slotIndex === 1) {
      return 'Bitcoin never reduces gradually. Every reduction is exactly half.';
    }
    if (tile === '3.125 BTC') {
      const sixPointTwoFiveIndex = currentSlots.findIndex((s) => s === '6.25 BTC');
      if (sixPointTwoFiveIndex !== -1 && sixPointTwoFiveIndex > slotIndex) {
        return 'Halvings happen in a fixed order. The future cannot arrive early.';
      }
    }
    return null;
  };

  const handleTileClick = (tileIndex: number) => {
    if (submitted) return;

    const tile = availableTiles[tileIndex];
    if (!tile) return;

    const emptySlotIndex = timelineSlots.findIndex((slot) => slot === null);
    if (emptySlotIndex === -1) {
      setError(isTi ? 'ኩሎም ቦታታት ምሉኣት እዮም። ቀዳሚ ቀጻሊ ኣልዕልዎ ወይ ምላሽካ ቕረብ።' : 'All slots are filled. Remove a tile first or submit your answer.');
      return;
    }

    const newSlots = [...timelineSlots];
    newSlots[emptySlotIndex] = tile;
    const placementFeedback = getFeedbackForPlacement(tile, emptySlotIndex, timelineSlots);

    setFeedback(placementFeedback);
    setUniversalMessage('Bitcoin does not reduce gradually. It halves suddenly.');
    setTimelineSlots(newSlots);
    setAvailableTiles(availableTiles.filter((_, idx) => idx !== tileIndex));
    setError(null);
  };

  const handleSlotClick = (slotIndex: number) => {
    if (submitted) return;

    const tile = timelineSlots[slotIndex];
    if (!tile) return;

    setAvailableTiles(shuffleArray([...availableTiles, tile]));
    const newSlots = [...timelineSlots];
    newSlots[slotIndex] = null;
    setTimelineSlots(newSlots);
    setFeedback(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = isAdminAuth && adminEmail ? adminEmail : studentEmail;
    if ((!isAuthenticated && !isAdminAuth) || !email) {
      setError(isTi ? 'ዕዮኻ ንምቕራብ በጃኻ እቶ።' : 'Please log in to submit your assignment.');
      return;
    }

    if (timelineSlots.some((slot) => slot === null)) {
      setError(isTi ? 'ቅድሚ ምቕራብ ኩሎም ቦታታት ምልኣኦም።' : 'Please fill all slots before submitting.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/assignments/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email,
          assignmentId,
          answer: JSON.stringify({ timeline: timelineSlots }),
        }),
      });

      const data = await response.json();

      if (response.status === 409) {
        setSubmitted(true);
        setUniversalMessage(null);
        setFeedback(null);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit assignment');
      }

      if (!data.success || !data.submission?.id) {
        throw new Error('Submission was not saved. Please try again.');
      }

      setSubmitted(true);
      setUniversalMessage(null);
      setFeedback(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit assignment. Please try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setAvailableTiles(shuffleArray(TILES));
    setTimelineSlots(Array(5).fill(null));
    setFeedback(null);
    setUniversalMessage(null);
    setError(null);
  };

  if (authLoading || loading || adminLoading) {
    return (
      <div className="rounded-lg border border-zinc-800/60 bg-zinc-950 p-5">
        <div className="animate-pulse">
          <div className="h-6 bg-zinc-800 rounded w-3/4 mb-4"></div>
          <div className="h-32 bg-zinc-800 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !isAdminAuth) {
    return (
      <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-5">
        <p className="text-zinc-400">{isTi ? 'ነዚ ዕዮ ንምርኣይን ምዝዛምን በጃኻ እቶ።' : 'Please log in to view and complete this assignment.'}</p>
      </div>
    );
  }

  const allSlotsFilled = timelineSlots.every((slot) => slot !== null);

  return (
    <div className="rounded-lg border border-zinc-800/60 bg-zinc-950 p-4 sm:p-5 shadow-inner space-y-4 sm:space-y-6">
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-zinc-100 mb-2">{isTi ? '🧩 እቲ ፍርቂ ናይ ግዜ መስመር ሕንቅልሕንቅሊተይ' : '🧩 The Halving Timeline Puzzle'}</h3>
        <p className="text-sm text-zinc-400 mb-3 sm:mb-4">
          {isTi ? 'መስተጋብራዊ ልምምድ | ሽልማት፡ TBD (ድሕሪ ገምጋም መምህር)' : 'Interactive exercise | Reward: TBD (after instructor review)'}
        </p>
        {!submitted && (
          <div className="p-3 sm:p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg mb-3 sm:mb-4">
            <p className="text-sm text-orange-200 font-medium mb-2">Core rule (shown to students):</p>
            <p className="text-sm text-orange-100 leading-relaxed">
              {isTi ? 'ናይ ቢትኮይን ብሎክ ሽልማት ቀስ ኢሉ ኣይንኪን እዩ። ሃንደበት ይወድቕ — ከም መደያይቦ እምበር ከም ራምፕ ኣይኮነን።' : "Bitcoin's block reward does not decrease smoothly. It drops suddenly — like stairs, not a ramp."}
            </p>
          </div>
        )}
      </div>

      {submitted ? (
        <div className="p-4 border rounded-lg bg-green-950/40 border-green-500/40">
          <p className="font-semibold text-base sm:text-lg text-green-300">✓ Submitted</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-sm sm:text-base font-semibold text-zinc-200 leading-tight">
              {isTi ? 'መስመር ግዜ (ካብ ጸጋም ናብ የማን ብመስርዕ ግዜ ኣቐምጦም)' : 'Timeline (Place tiles from left to right in chronological order)'}
            </h4>
            <div className="relative">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="text-xs sm:text-sm text-zinc-300 font-medium">{isTi ? '[ ዘፍጥረት ]' : '[ Genesis ]'}</div>
                <div className="flex-1"></div>
                <div className="text-xs sm:text-sm text-zinc-300 font-medium">{isTi ? '[ ሎሚ ]' : '[ Today ]'}</div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 border-2 border-zinc-700 rounded-lg p-2 sm:p-4 bg-zinc-900/50 overflow-x-auto scrollbar-hide">
                {timelineSlots.map((tile, index) => (
                  <div
                    key={index}
                    onClick={() => handleSlotClick(index)}
                    className={`flex-1 min-w-[60px] sm:min-w-0 min-h-[80px] sm:min-h-[90px] border-2 rounded-lg p-2 sm:p-3 touch-target transition-all flex flex-col items-center justify-center active:scale-95 ${
                      tile
                        ? 'border-2 border-transparent bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 active:from-indigo-500/30 active:via-purple-500/30 active:to-pink-500/30 active:border-indigo-400/50'
                        : 'border-dashed border-zinc-600 bg-zinc-800/30 active:border-zinc-500'
                    }`}
                  >
                    {tile ? (
                      <>
                        <div className="text-sm sm:text-lg font-mono font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-1">
                          {tile}
                        </div>
                        {index === 0 && <div className="text-[10px] sm:text-xs text-purple-300 font-medium">{isTi ? 'ዘፍጥረት' : 'Genesis'}</div>}
                        {index === 4 && <div className="text-[10px] sm:text-xs text-pink-300 font-medium">{isTi ? 'ሎሚ' : 'Today'}</div>}
                      </>
                    ) : (
                      <div className="text-center text-zinc-500 text-[10px] sm:text-xs">{isTi ? 'ባዶ' : 'Empty'}</div>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-400 mt-2 text-center leading-relaxed">
                {isTi ? 'ሓደ ቦታ ንምጽጋዕ ንምልጋብ ቆጽሊ ናብ ካሊእ ቦታ ኣቐምጦ' : 'Tap a slot to remove a tile and place it elsewhere'}
              </p>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-sm sm:text-base font-semibold text-zinc-200">{isTi ? 'ዝርከቡ ቀጻሊታት (ንምቕማጥ ተጫወት)' : 'Available Tiles (Tap to Place)'}</h4>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {availableTiles.map((tile, index) => (
                <button
                  key={`${tile}-${index}`}
                  onClick={() => handleTileClick(index)}
                  className="px-4 py-3 min-h-[44px] bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 border-2 border-purple-400/50 rounded-lg text-sm sm:text-base font-mono font-bold text-white active:from-purple-500 active:via-blue-500 active:to-cyan-400 active:scale-95 transition-all touch-target"
                >
                  {tile}
                </button>
              ))}
            </div>
            {availableTiles.length === 0 && (
              <p className="text-sm text-zinc-400 italic">{isTi ? 'ኩሎም ቀጻሊታት ኣብ መስመር ግዜ ተቐሚጦም።' : 'All tiles have been placed on the timeline.'}</p>
            )}
          </div>

          {feedback && (
            <div className="p-3 sm:p-4 bg-orange-900/20 border border-orange-800/50 rounded-lg">
              <p className="text-sm text-orange-200 leading-relaxed">{feedback}</p>
            </div>
          )}

          {universalMessage && (
            <div className="p-3 sm:p-4 bg-gradient-to-r from-indigo-900/20 via-purple-900/20 to-pink-900/20 border border-indigo-700/50 rounded-lg">
              <p className="text-sm bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 bg-clip-text text-transparent font-medium leading-relaxed">
                {universalMessage}
              </p>
            </div>
          )}

          {error && (
            <div className="p-3 sm:p-4 bg-red-900/20 border border-red-800/50 rounded-lg">
              <p className="text-sm text-red-200 leading-relaxed">{error}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={!allSlotsFilled || submitting}
              className={`flex-1 min-h-[48px] px-6 py-3 rounded-lg text-base font-medium transition-all touch-target ${
                allSlotsFilled && !submitting
                  ? 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white active:from-green-600 active:via-emerald-600 active:to-teal-600 active:scale-95 cursor-pointer'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              {submitting ? (isTi ? 'ኣቕርብ...' : 'Submitting...') : (isTi ? 'ምላሽ ቕረብ' : 'Submit Answer')}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={submitting}
              className="flex-1 sm:flex-initial min-h-[48px] px-6 py-3 rounded-lg text-base font-medium bg-gradient-to-r from-slate-600 via-zinc-600 to-slate-700 text-white active:from-slate-500 active:via-zinc-500 active:to-slate-600 active:scale-95 transition-all touch-target cursor-pointer disabled:cursor-not-allowed"
            >
              {isTi ? 'ካብ መጀምርያ ጀምር' : 'Reset'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
