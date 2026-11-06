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

interface LinkCryptoKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (accountId: string) => void;
}

export function LinkCryptoKeyModal({ isOpen, onClose, onSuccess }: LinkCryptoKeyModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl text-zinc-900 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-[#f97602]">
              <Key className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Link Private Account Key</h3>
              <p className="text-xs text-zinc-500">Enable email-free cryptographic login for this account</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-zinc-400 hover:text-zinc-600 cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="rounded-lg bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="space-y-3 text-xs">
          <div>
            <span className="font-semibold text-zinc-600">Your New Account ID:</span>
            <div className="mt-1 flex items-center justify-between bg-zinc-50 border border-zinc-200 rounded-lg p-2 font-mono text-[11px]">
              <span className="truncate">{bundle?.identity.accountId}</span>
              <button
                type="button"
                onClick={() => {
                  if (!bundle) return;
                  navigator.clipboard.writeText(bundle.identity.accountId);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="text-[#f97602] hover:underline shrink-0 ml-2 cursor-pointer"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 space-y-2.5">
            <span className="font-semibold text-zinc-800 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-[#f97602]" />
              Set Backup Passphrase
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="relative">
                <input
                  type={showPassphrase ? 'text' : 'password'}
                  placeholder="Passphrase (min 8)"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs text-zinc-900 pr-7"
                />
                <button
                  type="button"
                  onClick={() => setShowPassphrase(!showPassphrase)}
                  className="absolute right-2 top-2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                >
                  {showPassphrase ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </button>
              </div>
              <input
                type={showPassphrase ? 'text' : 'password'}
                placeholder="Confirm passphrase"
                value={passphraseConfirm}
                onChange={(e) => setPassphraseConfirm(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs text-zinc-900"
              />
            </div>
            <button
              type="button"
              onClick={handleDownload}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#f97602] bg-white py-2 text-xs font-semibold text-[#f97602] hover:bg-orange-50 transition cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              {hasDownloaded ? 'Re-Download Backup File (.json)' : 'Download Encrypted Backup (.json)'}
            </button>
          </div>

          <label className="flex items-start gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={confirmSaved}
              onChange={(e) => setConfirmSaved(e.target.checked)}
              className="mt-0.5 h-3.5 w-3.5 rounded text-[#f97602] focus:ring-[#f97602]"
            />
            <span className="text-[11px] text-zinc-600 leading-normal">
              I have saved my encrypted backup file and understand PBA cannot recover it if lost.
            </span>
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-100 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleLink}
            disabled={!hasDownloaded || !confirmSaved || isLinking}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#f97602] px-4 py-2 text-xs font-bold text-white hover:bg-[#d46200] disabled:opacity-50 transition cursor-pointer"
          >
            {isLinking ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
            Link Private Key
          </button>
        </div>
      </div>
    </div>
  );
}
