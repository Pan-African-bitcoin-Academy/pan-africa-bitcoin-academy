'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from '@/hooks/useSession';
import { AuthModal } from '@/components/AuthModal';
import { ForgotPasswordModal } from '@/components/ForgotPasswordModal';

interface DownloadPdfButtonProps {
  /** Full URL of the PDF to download */
  pdfUrl: string;
  /** Filename for the downloaded file */
  fileName?: string;
  /** Optional className override */
  className?: string;
  /** Optional custom button label */
  buttonText?: string;
  /** Optional downloading text */
  downloadingText?: string;
}

export function DownloadPdfButton({
  pdfUrl,
  fileName = 'document.pdf',
  className,
  buttonText,
  downloadingText,
}: DownloadPdfButtonProps) {
  const { isAuthenticated, loading } = useSession('student');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [pendingDownload, setPendingDownload] = useState(false);

  const triggerDownload = useCallback(async () => {
    try {
      setDownloading(true);
      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF download error:', err);
      // Fallback: open in new tab if blob download fails
      window.open(pdfUrl, '_blank');
    } finally {
      setDownloading(false);
    }
  }, [pdfUrl, fileName]);

  // After sign-in, if there was a pending download, trigger it
  useEffect(() => {
    if (pendingDownload && isAuthenticated && !loading) {
      setPendingDownload(false);
      triggerDownload();
    }
  }, [pendingDownload, isAuthenticated, loading, triggerDownload]);

  const handleClick = () => {
    if (loading) return;

    if (isAuthenticated) {
      triggerDownload();
    } else {
      // Mark that user wants to download after signing in
      setPendingDownload(true);
      setShowAuthModal(true);
    }
  };

  const defaultClassName =
    'inline-flex items-center gap-2 rounded-lg border border-orange-500/40 bg-orange-500/10 px-4 py-2.5 text-sm font-semibold text-orange-300 transition hover:bg-orange-500/20 hover:text-orange-200 disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading || downloading}
        className={className ?? defaultClassName}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {downloading ? (downloadingText ?? 'Downloading…') : (buttonText ?? 'Download PDF')}
      </button>

      {/* Auth modal for sign-in */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          // If user closed without signing in, cancel pending download
          if (!isAuthenticated) {
            setPendingDownload(false);
          }
        }}
        mode="signin"
        redirectAfterLogin={null}
        onForgotPassword={(email) => {
          setForgotPasswordEmail(email);
          setShowAuthModal(false);
          setShowForgotPassword(true);
        }}
      />

      {/* Forgot password modal */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        initialEmail={forgotPasswordEmail}
      />
    </>
  );
}
