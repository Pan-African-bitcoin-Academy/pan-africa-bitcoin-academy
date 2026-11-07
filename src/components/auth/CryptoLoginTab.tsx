'use client';

import { useState } from 'react';
import {
  Key,
  Lock,
  Upload,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  FileCheck,
} from 'lucide-react';
import {
  restoreFromEncryptedBackup,
  importRawPrivateKey,
  deriveAccountIdFromPrivateKey,
  signChallenge,
  type EncryptedKeyBackup,
} from '@/lib/cryptoAuth';

interface CryptoLoginTabProps {
  onSuccess: (data: { accountId: string; userId: string; email?: string }) => void;
}

export function CryptoLoginTab({ onSuccess }: CryptoLoginTabProps) {
  const [loginMethod, setLoginMethod] = useState<'file' | 'raw'>('file');
  const [uploadedBackup, setUploadedBackup] = useState<EncryptedKeyBackup | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [passphrase, setPassphrase] = useState('');
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [rawKeyInput, setRawKeyInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (!parsed.accountId || !parsed.ciphertext) {
          throw new Error('Unrecognized backup format. Please select a valid PBA account JSON file.');
        }
        setUploadedBackup(parsed);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to parse JSON file';
        setError(msg);
        setUploadedBackup(null);
      }
    };
    reader.readAsText(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      setLoading(true);
      let privateKey: CryptoKey;
      let accountId: string;

      if (loginMethod === 'file') {
        if (!uploadedBackup) {
          throw new Error('Please upload your encrypted PBA account backup (.json).');
        }
        if (!passphrase) {
          throw new Error('Please enter the decryption passphrase for this backup file.');
        }
        const restored = await restoreFromEncryptedBackup(uploadedBackup, passphrase);
        privateKey = restored.privateKey;
        accountId = restored.accountId;
      } else {
        if (!rawKeyInput.trim()) {
          throw new Error('Please paste your private key string.');
        }
        privateKey = await importRawPrivateKey(rawKeyInput.trim());
        // Auto-derive Account ID directly from private key (like Nostr derives npub from nsec)
        const derived = await deriveAccountIdFromPrivateKey(privateKey);
        accountId = derived.accountId;
      }

      // Step 1: Request dynamic short-lived challenge
      const chalRes = await fetch(`/api/crypto/challenge?accountId=${encodeURIComponent(accountId)}`);
      const chalData = await chalRes.json();
      if (!chalRes.ok) {
        throw new Error(chalData.error || 'Failed to request challenge.');
      }

      // Step 2: Sign challenge locally in browser (private key NEVER sent)
      const signature = await signChallenge(privateKey, chalData.challenge);

      // Step 3: Verify signature with backend
      const verifyRes = await fetch('/api/crypto/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId,
          challenge: chalData.challenge,
          signature,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        throw new Error(verifyData.error || 'Signature verification failed.');
      }

      setSuccess('Authenticated successfully! Redirecting...');
      setTimeout(() => {
        onSuccess({
          accountId: verifyData.accountId || accountId,
          userId: verifyData.userId,
          email: verifyData.email,
        });
      }, 500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Sub-selector: File vs Raw key */}
      <div className="flex rounded-lg bg-zinc-900 p-1 border border-zinc-800 text-xs">
        <button
          type="button"
          onClick={() => {
            setLoginMethod('file');
            setError(null);
          }}
          className={`flex-1 py-1.5 font-medium rounded-md transition cursor-pointer ${
            loginMethod === 'file'
              ? 'bg-[#f97602] text-white shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Encrypted Backup File
        </button>
        <button
          type="button"
          onClick={() => {
            setLoginMethod('raw');
            setError(null);
          }}
          className={`flex-1 py-1.5 font-medium rounded-md transition cursor-pointer ${
            loginMethod === 'raw'
              ? 'bg-[#f97602] text-white shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Paste Raw Key
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl bg-red-950/40 border border-red-800 p-3 text-xs text-red-200">
          <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-950/40 border border-emerald-800 p-3 text-xs text-emerald-200">
          <Check className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {loginMethod === 'file' ? (
          <>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Account Key Backup File (.json)
              </label>
              <label className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-950/60 p-4 text-center hover:border-[#f97602] transition cursor-pointer">
                {uploadedFileName ? (
                  <div className="flex items-center gap-2 text-emerald-400 text-xs">
                    <FileCheck className="h-4 w-4" />
                    <span className="font-mono">{uploadedFileName}</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Upload className="h-5 w-5 mx-auto text-zinc-500" />
                    <p className="text-xs text-zinc-300 font-medium">Click to select backup JSON file</p>
                    <p className="text-[11px] text-zinc-500">pba-account-*.json</p>
                  </div>
                )}
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Backup Decryption Passphrase
              </label>
              <div className="relative">
                <input
                  type={showPassphrase ? 'text' : 'password'}
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Enter your backup passphrase"
                  required
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
            </div>
          </>
        ) : (
          <>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-zinc-300">
                  Private Key String / JWK JSON
                </label>
                <span className="text-[10px] text-zinc-500">Auto-derives Account ID</span>
              </div>
              <textarea
                value={rawKeyInput}
                onChange={(e) => setRawKeyInput(e.target.value)}
                placeholder="Paste your raw private key string here..."
                rows={4}
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs font-mono text-white placeholder-zinc-500 focus:border-[#f97602] focus:outline-hidden"
              />
            </div>
        
            <div className="rounded-lg border border-amber-200/80 bg-amber-50/70 p-2.5 text-[11px] text-amber-800 space-y-1">
              <p className="font-medium">💡 Don't have a raw key string?</p>
              <p className="text-amber-700">
                Switch to the <strong>Encrypted Backup File</strong> tab above and select your <code>.json</code> backup file instead. The raw key string is only needed if you specifically exported it.
              </p>
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#f97602] py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#e06800] disabled:opacity-50 cursor-pointer transition"
        >
          {loading ? (
            <>
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              Signing Challenge & Authenticating...
            </>
          ) : (
            <>
              <Key className="h-3.5 w-3.5" />
              Sign In With Private Key
            </>
          )}
        </button>
      </form>

      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 text-[11px] text-zinc-500 space-y-1">
        <p className="flex items-center gap-1.5 text-zinc-400 font-medium">
          <Lock className="h-3.5 w-3.5 text-[#f97602]" />
          Zero-Knowledge Signing
        </p>
        <p>
          Your private key never leaves your browser. The server issues a one-time challenge that is signed locally on your device.
        </p>
      </div>
    </div>
  );
}
