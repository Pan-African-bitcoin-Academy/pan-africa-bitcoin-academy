'use client';

import { useState, useEffect } from 'react';
import {
  Key,
  ShieldCheck,
  Lock,
  Download,
  Check,
  Copy,
  AlertCircle,
  Eye,
  EyeOff,
  X,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import {
  generateAccountKeypair,
  createEncryptedBackup,
  type GeneratedAccountBundle,
} from '@/lib/cryptoAuth';

interface GenerateKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (accountId: string) => void;
}

export function GenerateKeyModal({ isOpen, onClose, onSuccess }: GenerateKeyModalProps) {
  const [bundle, setBundle] = useState<GeneratedAccountBundle | null>(null);
  const [passphrase, setPassphrase] = useState('');
  const [passphraseConfirm, setPassphraseConfirm] = useState('');
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [confirmSaved, setConfirmSaved] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !bundle) {
      handleGenerate();
    }
    if (!isOpen) {
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleGenerate() {
    try {
      const newBundle = await generateAccountKeypair();
      setBundle(newBundle);
      setHasDownloaded(false);
      setConfirmSaved(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate key';
      setError(msg);
    }
  }

  async function handleDownload() {
    if (!bundle) return;
    if (!passphrase || passphrase.length < 8) {
      setError('Passphrase must be at least 8 characters long.');
      return;
    }
    if (passphrase !== passphraseConfirm) {
      setError('Passphrases do not match.');
      return;
    }

    try {
      setError(null);
      const backup = await createEncryptedBackup(bundle.privateKey, bundle.identity.accountId, passphrase);
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pba-account-${bundle.identity.accountId.slice(0, 16)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setHasDownloaded(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create backup';
      setError(msg);
    }
  }

  async function handleLink() {
    if (!bundle || !hasDownloaded || !confirmSaved) return;

    try {
      setIsLinking(true);
      setError(null);

      const res = await fetch('/api/crypto/migrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: bundle.identity.accountId,
          publicKeySpki: bundle.identity.publicKeySpki,
          algorithm: bundle.identity.algorithm,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to link key.');
      }

      // Mark backup as confirmed
      await fetch('/api/crypto/confirm-backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: bundle.identity.accountId }),
      }).catch(() => null);

      onSuccess?.(bundle.identity.accountId);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Linking failed';
      setError(msg);
    } finally {
      setIsLinking(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl text-zinc-100 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-[#f97602]">
              <Key className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Generate Private Account Key</h3>
              <p className="text-xs text-zinc-400">Enable cryptographic login alongside your existing credentials</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-zinc-400 hover:text-zinc-200 cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-xl bg-red-950/40 border border-red-800 p-3 text-xs text-red-200">
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Account Identity */}
        <div className="space-y-1.5 rounded-xl border border-zinc-800 bg-zinc-950 p-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide">
              Public Account ID
            </span>
            <button
              type="button"
              onClick={() => {
                if (bundle) {
                  navigator.clipboard.writeText(bundle.identity.accountId);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }
              }}
              className="inline-flex items-center gap-1 text-[11px] text-[#f97602] hover:underline cursor-pointer"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="font-mono text-xs text-zinc-300 break-all select-all">
            {bundle?.identity.accountId ?? 'Generating keypair...'}
          </p>
        </div>

        {/* Step 1: Encrypt & Download */}
        <div className="space-y-3 rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-[#f97602]" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wide">
              Step 1: Set Passphrase & Download Backup
            </h4>
          </div>
          <p className="text-xs text-zinc-400">
            Set an encryption passphrase (minimum 8 characters) to protect your key file.
          </p>

          <div className="space-y-2">
            <div className="relative">
              <input
                type={showPassphrase ? 'text' : 'password'}
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                placeholder="Encryption passphrase"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-[#f97602] focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => setShowPassphrase(!showPassphrase)}
                className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                {showPassphrase ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>

            <input
              type={showPassphrase ? 'text' : 'password'}
              value={passphraseConfirm}
              onChange={(e) => setPassphraseConfirm(e.target.value)}
              placeholder="Confirm passphrase"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-[#f97602] focus:outline-hidden"
            />

            <button
              type="button"
              onClick={handleDownload}
              className={`w-full inline-flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium transition cursor-pointer ${
                hasDownloaded
                  ? 'bg-emerald-950/60 border border-emerald-600 text-emerald-300'
                  : 'bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white'
              }`}
            >
              {hasDownloaded ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  Backup Downloaded (Click to re-download)
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5 text-[#f97602]" />
                  Encrypt & Download Key Backup (.json)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Step 2: Confirm & Link */}
        <div className="space-y-3">
          <label className="flex items-start gap-2 cursor-pointer select-none text-xs text-zinc-300">
            <input
              type="checkbox"
              checked={confirmSaved}
              onChange={(e) => setConfirmSaved(e.target.checked)}
              disabled={!hasDownloaded}
              className="mt-0.5 rounded border-zinc-700 text-[#f97602] focus:ring-[#f97602] disabled:opacity-40"
            />
            <span>
              I have downloaded and safely stored my encrypted key backup. I understand PBA cannot recover lost private keys.
            </span>
          </label>

          <button
            type="button"
            disabled={!hasDownloaded || !confirmSaved || isLinking}
            onClick={handleLink}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#f97602] py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#e06800] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
          >
            {isLinking ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                Linking Key to Account...
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                Link Key to My Student Account
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>

        <p className="text-[11px] text-zinc-500 text-center">
          This is an authentication key for your student records. It does not hold or control Bitcoin.
        </p>
      </div>
    </div>
  );
}
