'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSession } from '@/hooks/useSession';
import {
  clientAwaitingInstructorReview,
  clientAutoGradedCanPractice,
  clientNeedsResubmit,
  clientSubmissionIsApproved,
  phaseHintFromRow,
  type ClientAssignmentPhaseHint,
} from '@/lib/assignmentReview';

interface Chapter18AssignmentProps {
  assignmentId: string;
  isTi: boolean;
}

const ADDRESSES = {
  A: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kygt080',
  B: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
  C: 'bc1p5cyxnuxmeuwuvkwfem96llyxf3s2h0c6h7',
};

const CORRECT_ANSWERS = {
  A: 'P2WPKH',
  B: 'P2SH',
  C: 'Taproot (P2TR)',
};

export function Chapter18Assignment({ assignmentId, isTi }: Chapter18AssignmentProps) {
  const { profile, isAuthenticated, loading: authLoading, sessionEmail } = useAuth();
  const { isAuthenticated: isAdminAuth, email: adminEmail, loading: adminLoading } = useSession('admin');
  const studentEmail = profile?.email || sessionEmail || null;
  const [answerA, setAnswerA] = useState('');
  const [answerB, setAnswerB] = useState('');
  const [answerC, setAnswerC] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<any>(null);
  const [phaseHint, setPhaseHint] = useState<ClientAssignmentPhaseHint | undefined>();
  const [loading, setLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);
  const text = isTi
    ? {
        loginToSubmit: 'ንዕዮኻ ንምልኣኽ በጃኻ እቶ።',
        allAnswersRequired: 'ንኹሎም ሰለስተ ኣድራሻታት መልሲ ሃብ።',
        submitFailed: 'ዕዮ ምልኣኽ ኣይተኻእለን። በጃኻ እንደገና ፈትን።',
        loginToView: 'ነዚ ዕዮ ንምርኣይን ንምፍጻምን በጃኻ እቶ።',
        title: 'ዕዮ፡ ስክሪፕት ምልላይ',
        description: 'ንነፍሲ ወከፍ ኣድራሻ ዓይነት ስክሪፕት ኣለሊ | ሽልማት፡ TBD (ድሕሪ ገምጋም መምህር)',
        approved: '✓ ጸዲቑ',
        revisionNeeded: 'ምምሕያሽ የድሊ',
        awaitingReview: '⏳ ተላኢኹ — ገና ገምጋም ይጽበ',
        approvedMessage: 'ዕዮኻ ጸዲቑ።',
        reviseMessage: 'ነቲ ርእይቶ (እንተሎ) ኣንብብ እሞ እንደገና ልኣኽ።',
        pendingMessage: 'መምህርካ ገና ኣይገምገሞን። ክሳብ ዝጸድቕ ወይ ዝምለስ እንደገና ክትልእኽ ኣይትኽእልን።',
        practiceAgainMessage: 'ኣብ ታሕቲ እንደገና ተለማመድ — እቲ ዝተረኽበ ሳት ሓደ ግዜ ጥራይ እዩ ዝምዝገብ።',
        answers: 'መልስታትካን ቅኑዕ መልስታትን፦',
        yourAnswer: 'መልስኻ፦',
        correct: 'ቅኑዕ፦',
        resubmit: 'ዕዮ እንደገና ልኣኽ',
        practiceAgain: 'እንደገና ተለማመድ',
        copyInstructions: 'ነዞም ኣድራሻታት ቅዳሕ እሞ ነፍሲ ወከፎም ኣብቲ ኣብ ታሕቲ ዘሎ ቅኑዕ ዓይነት ስክሪፕት ዓውዲ ለጥፎ፦',
        address: 'ኣድራሻ',
        copy: 'ቅዳሕ',
        pasteMatchingAddress: 'እቲ ዝሰማማዕ ኣድራሻ ኣብዚ ለጥፎ',
        pasteTaproot: 'ምስ ዓይነት ስክሪፕት Taproot (P2TR) ዝሰማማዕ ኣድራሻ ለጥፍ',
        pasteP2WPKH: 'ምስ ዓይነት ስክሪፕት P2WPKH ዝሰማማዕ ኣድራሻ ለጥፍ',
        pasteP2SH: 'ምስ ዓይነት ስክሪፕት P2SH ዝሰማማዕ ኣድራሻ ለጥፍ',
        correctAddress: 'ቅኑዕ ኣድራሻ፦',
        submitting: 'ይለኣኽ ኣሎ...',
        submit: 'ዕዮ ለኣኽ',
      }
    : {
        loginToSubmit: 'Please log in to submit your assignment.',
        allAnswersRequired: 'Please provide answers for all three addresses.',
        submitFailed: 'Failed to submit assignment. Please try again.',
        loginToView: 'Please log in to view and complete this assignment.',
        title: 'Assignment: Script Recognition',
        description: 'Identify the script type for each address | Reward: TBD (after instructor review)',
        approved: '✓ Approved',
        revisionNeeded: 'Revision needed',
        awaitingReview: '⏳ Submitted — awaiting review',
        approvedMessage: 'Your submission was approved.',
        reviseMessage: 'Read the feedback (if any) and submit again.',
        pendingMessage: 'Your instructor has not graded this yet. You cannot submit again until it is approved or returned.',
        practiceAgainMessage: 'Practice again below — your sats credit stays once earned.',
        answers: 'Your Answers & Correct Answers:',
        yourAnswer: 'Your answer:',
        correct: 'Correct:',
        resubmit: 'Resubmit Assignment',
        practiceAgain: 'Practice again',
        copyInstructions: 'Copy these addresses and paste each one in the correct script type field below:',
        address: 'Address',
        copy: 'Copy',
        pasteMatchingAddress: 'Paste the matching address here',
        pasteTaproot: 'Paste the address that matches Taproot (P2TR) script type',
        pasteP2WPKH: 'Paste the address that matches P2WPKH script type',
        pasteP2SH: 'Paste the address that matches P2SH script type',
        correctAddress: 'Correct address:',
        submitting: 'Submitting...',
        submit: 'Submit Assignment',
      };

  useEffect(() => {
    if (authLoading || adminLoading) return;
    if ((isAuthenticated && studentEmail) || (isAdminAuth && adminEmail)) {
      checkSubmissionStatus();
    } else {
      setLoading(false);
    }
  }, [authLoading, adminLoading, isAuthenticated, studentEmail, isAdminAuth, adminEmail, assignmentId]);

  const checkSubmissionStatus = async () => {
    try {
      setLoading(true);
      const email = isAdminAuth && adminEmail ? adminEmail : studentEmail;
      if (!email) return;
      
      const response = await fetch(`/api/assignments?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        const thisAssignment = data.assignments?.find((a: any) => a.id === assignmentId);
        setPhaseHint(phaseHintFromRow(thisAssignment));
        if (thisAssignment?.submission) {
          setSubmissionStatus(thisAssignment.submission);
          setSubmitted(true);
          setShowAnswers(true);
          if (thisAssignment.submission.answer) {
            try {
              const answerData = JSON.parse(thisAssignment.submission.answer);
              setAnswerA(answerData.answerA || '');
              setAnswerB(answerData.answerB || '');
              setAnswerC(answerData.answerC || '');
            } catch (e) {
              // Legacy format, ignore
            }
          }
        } else {
          setSubmissionStatus(null);
          setSubmitted(false);
          setShowAnswers(false);
        }
      }
    } catch (err) {
      console.error('Error checking submission status:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = isAdminAuth && adminEmail ? adminEmail : studentEmail;
    if ((!isAuthenticated && !isAdminAuth) || !email) {
      setError(text.loginToSubmit);
      return;
    }

    if (!answerA || !answerB || !answerC) {
      setError(text.allAnswersRequired);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const answerData = {
        answerA,
        answerB,
        answerC,
      };

      const response = await fetch('/api/assignments/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          assignmentId,
          answer: JSON.stringify(answerData),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit assignment');
      }

      setPracticeMode(false);
      setSubmitted(true);
      setSubmissionStatus(data.submission);
      setShowAnswers(true); // Show answers after submission
    } catch (err: any) {
      setError(err.message || text.submitFailed);
    } finally {
      setSubmitting(false);
    }
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
        <p className="text-zinc-400">{text.loginToView}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-800/60 bg-zinc-950 p-5 shadow-inner space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-zinc-100 mb-2">{text.title}</h3>
        <p className="text-sm text-zinc-400 mb-4">{text.description}</p>
      </div>

      {submitted && submissionStatus && (
        <div className="space-y-4">
          <div
            className={`p-4 rounded-lg border ${
              clientSubmissionIsApproved(submissionStatus, phaseHint)
                ? 'bg-green-900/20 border-green-800/50'
                : clientNeedsResubmit(submissionStatus, phaseHint)
                  ? 'bg-red-900/20 border-red-800/50'
                  : clientAwaitingInstructorReview(submissionStatus, phaseHint)
                    ? 'bg-amber-900/20 border-amber-800/50'
                    : 'bg-green-900/20 border-green-800/50'
            }`}
          >
            <p
              className={`font-medium mb-2 ${
                clientSubmissionIsApproved(submissionStatus, phaseHint)
                  ? 'text-green-200'
                  : clientNeedsResubmit(submissionStatus, phaseHint)
                    ? 'text-red-200'
                    : 'text-amber-100'
              }`}
            >
              {clientSubmissionIsApproved(submissionStatus, phaseHint)
                ? text.approved
                : clientNeedsResubmit(submissionStatus, phaseHint)
                  ? text.revisionNeeded
                  : text.awaitingReview}
            </p>
            <p className="text-sm text-zinc-300 mb-3">
              {clientSubmissionIsApproved(submissionStatus, phaseHint)
                ? text.approvedMessage
                : clientNeedsResubmit(submissionStatus, phaseHint)
                  ? text.reviseMessage
                  : text.pendingMessage}
            </p>
            {clientAutoGradedCanPractice(submissionStatus, phaseHint) && (
              <p className="text-xs text-zinc-500">{text.practiceAgainMessage}</p>
            )}
            {clientNeedsResubmit(submissionStatus, phaseHint) && submissionStatus.feedback && (
              <p className="text-sm text-zinc-300">{submissionStatus.feedback}</p>
            )}
          </div>

          <div className="space-y-3 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800/50">
            <p className="text-sm font-medium text-zinc-300 mb-2">{text.answers}</p>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-zinc-400 mb-1">{text.address} A ({ADDRESSES.A})</p>
                <p className="text-sm text-zinc-200">{text.yourAnswer} {answerA}</p>
                <p className="text-xs text-green-400 mt-1">{text.correct} {CORRECT_ANSWERS.A}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-400 mb-1">{text.address} B ({ADDRESSES.B})</p>
                <p className="text-sm text-zinc-200">{text.yourAnswer} {answerB}</p>
                <p className="text-xs text-green-400 mt-1">{text.correct} {CORRECT_ANSWERS.B}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-400 mb-1">{text.address} C ({ADDRESSES.C})</p>
                <p className="text-sm text-zinc-200">{text.yourAnswer} {answerC}</p>
                <p className="text-xs text-green-400 mt-1">{text.correct} {CORRECT_ANSWERS.C}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {clientNeedsResubmit(submissionStatus, phaseHint) && (
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setSubmissionStatus(null);
                  setShowAnswers(false);
                  setPracticeMode(false);
                }}
                className="text-sm text-cyan-400 hover:text-cyan-300 underline px-2 py-1 min-h-[32px] touch-target"
              >
                {text.resubmit}
              </button>
            )}
            {clientAutoGradedCanPractice(submissionStatus, phaseHint) && (
              <button
                type="button"
                onClick={() => setPracticeMode(true)}
                className="rounded-lg border border-green-500/40 bg-green-500/10 px-3 py-1.5 text-sm font-medium text-green-200"
              >
                {text.practiceAgain}
              </button>
            )}
          </div>
        </div>
      )}

      {(!submitted || practiceMode || clientNeedsResubmit(submissionStatus, phaseHint)) && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Addresses to copy */}
          <div className="space-y-3 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800/50">
            <p className="text-sm font-medium text-zinc-300 mb-3">{text.copyInstructions}</p>
            
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <span className="text-sm font-semibold text-zinc-400 sm:w-24 flex-shrink-0">{text.address} A:</span>
                <code className="flex-1 w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-sm text-zinc-200 font-mono break-all">
                  {ADDRESSES.A}
                </code>
                <button
                  type="button"
                  onClick={() => copyToClipboard(ADDRESSES.A)}
                  className="px-4 py-2 min-h-[44px] bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-zinc-300 rounded text-sm transition touch-target w-full sm:w-auto"
                >
                  {text.copy}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <span className="text-sm font-semibold text-zinc-400 sm:w-24 flex-shrink-0">{text.address} B:</span>
                <code className="flex-1 w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-sm text-zinc-200 font-mono break-all">
                  {ADDRESSES.B}
                </code>
                <button
                  type="button"
                  onClick={() => copyToClipboard(ADDRESSES.B)}
                  className="px-4 py-2 min-h-[44px] bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-zinc-300 rounded text-sm transition touch-target w-full sm:w-auto"
                >
                  {text.copy}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <span className="text-sm font-semibold text-zinc-400 sm:w-24 flex-shrink-0">{text.address} C:</span>
                <code className="flex-1 w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-sm text-zinc-200 font-mono break-all">
                  {ADDRESSES.C}
                </code>
                <button
                  type="button"
                  onClick={() => copyToClipboard(ADDRESSES.C)}
                  className="px-4 py-2 min-h-[44px] bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-zinc-300 rounded text-sm transition touch-target w-full sm:w-auto"
                >
                  {text.copy}
                </button>
              </div>
            </div>
          </div>

          {/* Input fields - Mixed arrangement so students must match addresses to script types */}
          {/* Field 1: Taproot (P2TR) → Address C | Field 2: P2WPKH → Address A | Field 3: P2SH → Address B */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                1. <span className="text-cyan-400 font-semibold">{CORRECT_ANSWERS.C}</span> → {text.pasteMatchingAddress}
              </label>
              <input
                type="text"
                value={answerC}
                onChange={(e) => setAnswerC(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-zinc-100 placeholder:text-zinc-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition font-mono text-sm"
                placeholder={text.pasteTaproot}
                required
              />
              {showAnswers && (
                <p className="mt-1 text-xs text-green-400">{text.correctAddress} {ADDRESSES.C}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                2. <span className="text-cyan-400 font-semibold">{CORRECT_ANSWERS.A}</span> → {text.pasteMatchingAddress}
              </label>
              <input
                type="text"
                value={answerA}
                onChange={(e) => setAnswerA(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-zinc-100 placeholder:text-zinc-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition font-mono text-sm"
                placeholder={text.pasteP2WPKH}
                required
              />
              {showAnswers && (
                <p className="mt-1 text-xs text-green-400">{text.correctAddress} {ADDRESSES.A}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                3. <span className="text-cyan-400 font-semibold">{CORRECT_ANSWERS.B}</span> → {text.pasteMatchingAddress}
              </label>
              <input
                type="text"
                value={answerB}
                onChange={(e) => setAnswerB(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-zinc-100 placeholder:text-zinc-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition font-mono text-sm"
                placeholder={text.pasteP2SH}
                required
              />
              {showAnswers && (
                <p className="mt-1 text-xs text-green-400">{text.correctAddress} {ADDRESSES.B}</p>
              )}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-900/20 border border-red-800/50 rounded-lg">
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-orange-500 px-6 py-3 min-h-[48px] font-semibold text-black transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed touch-target"
          >
            {submitting ? text.submitting : text.submit}
          </button>
        </form>
      )}
    </div>
  );
}
