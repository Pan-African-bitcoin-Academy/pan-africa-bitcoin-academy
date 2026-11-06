'use client';

import { useState } from 'react';
import {
  Key,
  ShieldCheck,
  Lock,
  Download,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  User,
  Phone,
  Globe,
} from 'lucide-react';
import {
  generateAccountKeypair,
  createEncryptedBackup,
  type GeneratedAccountBundle,
} from '@/lib/cryptoAuth';

interface CryptoRegisterTabProps {
  onSuccess: (data: { accountId: string; userId: string; email?: string }) => void;
}

export function CryptoRegisterTab({ onSuccess }: CryptoRegisterTabProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [passphraseConfirm, setPassphraseConfirm] = useState('');
  const [showPassphrase, setShowPassphrase] = useState(false);

  const [bundle, setBundle] = useState<GeneratedAccountBundle | null>(null);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [confirmSaved, setConfirmSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerateAndDownload() {
    setError(null);

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!phone.trim()) {
      setError('WhatsApp phone number is required for PBA cohort communications.');
      return;
    }
    if (!passphrase || passphrase.length < 8) {
      setError('Encryption passphrase must be at least 8 characters long.');
      return;
    }
    if (passphrase !== passphraseConfirm) {
      setError('Passphrases do not match.');
      return;
    }

    try {
      setLoading(true);
      // Generate keypair in browser
      const newBundle = await generateAccountKeypair();
      setBundle(newBundle);

      // Create encrypted backup
      const backup = await createEncryptedBackup(
        newBundle.privateKey,
        newBundle.identity.accountId,
        passphrase,
      );

      // Trigger download
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pba-student-${newBundle.identity.accountId.slice(0, 16)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setHasDownloaded(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate key backup';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleFinalRegister() {
    if (!bundle || !hasDownloaded || !confirmSaved) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/crypto/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: bundle.identity.accountId,
          publicKeySpki: bundle.identity.publicKeySpki,
          algorithm: bundle.identity.algorithm,
          name: name.trim(),
          phone: phone.trim(),
          country: country.trim() || undefined,
          city: city.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed.');
      }

      // Mark backup as confirmed
      await fetch('/api/crypto/confirm-backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: bundle.identity.accountId }),
      }).catch(() => null);

      onSuccess({
        accountId: data.accountId,
        userId: data.userId,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-start gap-2 rounded-xl bg-red-950/40 border border-red-800 p-3 text-xs text-red-200">
          <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {!bundle ? (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Full Name</label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First and Last Name"
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-[#f97602] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">WhatsApp Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+251 91 123 4567"
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-[#f97602] focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Country (Optional)</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-[#f97602] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">City (Optional)</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-[#f97602] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-3 space-y-2">
            <label className="block text-xs font-semibold text-white">
              Set Key Backup Passphrase
            </label>
            <p className="text-[11px] text-zinc-400">
              Your private key will be generated on your device and encrypted with this passphrase.
            </p>

            <div className="relative">
              <input
                type={showPassphrase ? 'text' : 'password'}
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                placeholder="Passphrase (minimum 8 characters)"
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
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={handleGenerateAndDownload}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#f97602] py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#e06800] disabled:opacity-50 cursor-pointer transition"
          >
            {loading ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                Generating Cryptographic Key...
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5" />
                Generate & Download Key Backup (.json)
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border border-emerald-800/60 bg-emerald-950/20 p-3 space-y-1 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <Check className="h-4 w-4" />
              Key Generated & Encrypted Backup Downloaded
            </div>
            <p className="font-mono text-[11px] text-zinc-300 break-all select-all">
              {bundle.identity.accountId}
            </p>
          </div>

          <label className="flex items-start gap-2 cursor-pointer select-none text-xs text-zinc-300">
            <input
              type="checkbox"
              checked={confirmSaved}
              onChange={(e) => setConfirmSaved(e.target.checked)}
              className="mt-0.5 rounded border-zinc-700 text-[#f97602] focus:ring-[#f97602]"
            />
            <span>
              I have saved my encrypted backup file and remember my passphrase. I understand PBA cannot recover lost keys.
            </span>
          </label>

          <button
            type="button"
            disabled={!confirmSaved || loading}
            onClick={handleFinalRegister}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#f97602] py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#e06800] disabled:opacity-50 cursor-pointer transition"
          >
            {loading ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                Finalizing Account Setup...
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                Complete Account Creation
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
