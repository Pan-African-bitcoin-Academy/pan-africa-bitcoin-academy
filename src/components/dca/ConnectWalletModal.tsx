'use client';

import { useState, useMemo } from 'react';
import {
  Wallet,
  ShieldCheck,
  AlertTriangle,
  X,
  CheckCircle2,
  Info,
  Loader2,
} from 'lucide-react';
import {
  detectPrivateKeyOrSeed,
  validateBitcoinAddress,
  type SupportedDerivationScheme,
} from '@/lib/bitcoin/watchWallet';
import type {
  WalletRecord,
  WalletSnapshotRecord,
  WalletTxRecord,
} from '@/components/dca/WalletDashboard';

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWalletConnected: (
    wallet: WalletRecord,
    transactions: WalletTxRecord[],
    snapshots: WalletSnapshotRecord[],
  ) => void;
}

type TabMode = 'address' | 'xpub';

export default function ConnectWalletModal({
  isOpen,
  onClose,
  onWalletConnected,
}: ConnectWalletModalProps) {
  const [tab, setTab] = useState<TabMode>('address');
  const [label, setLabel] = useState('');
  const [watchInput, setWatchInput] = useState('');
  const [selectedScheme, setSelectedScheme] = useState<SupportedDerivationScheme | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Real-time sensitivity & format validation
  const validation = useMemo(() => {
    const trimmed = watchInput.trim();
    if (!trimmed) return null;

    // Check sensitive keys
    const sensitive = detectPrivateKeyOrSeed(trimmed);
    if (sensitive.isSensitive) {
      return {
        isSensitive: true,
        message: sensitive.reason || 'Private key or seed phrase detected.',
      };
    }

    // Check single address
    const addr = validateBitcoinAddress(trimmed);
    if (addr.valid) {
      return {
        isSensitive: false,
        detectedType: 'address',
        label: `${addr.type?.toUpperCase()} (${addr.network === 'mainnet' ? 'Bitcoin Mainnet' : 'Testnet'})`,
      };
    }

    // Check xpub / ypub / zpub
    if (/^[xyz]pub[1-9A-HJ-NP-za-km-z]{100,115}$/.test(trimmed)) {
      let schemeLabel = 'Native SegWit (BIP84)';
      if (trimmed.startsWith('ypub')) schemeLabel = 'Nested SegWit (BIP49)';
      if (trimmed.startsWith('xpub')) schemeLabel = 'Legacy (BIP44) / Multi-scheme';
      return {
        isSensitive: false,
        detectedType: 'xpub',
        label: `Extended Public Key: ${schemeLabel}`,
      };
    }

    return {
      isSensitive: false,
      isUnknown: true,
      message: 'Unrecognized format. Check the Bitcoin address or xpub, ypub, or zpub.',
    };
  }, [watchInput]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!label.trim()) {
      setError('Please provide a label for this wallet.');
      return;
    }

    if (!watchInput.trim()) {
      setError('Please enter a Bitcoin address or xpub/ypub/zpub.');
      return;
    }

    if (validation?.isSensitive) {
      setError(validation.message || 'Private keys and seed phrases are strictly forbidden.');
      return;
    }
    if (watchInput.trim().startsWith('xpub') && !selectedScheme) {
      setError('Select the derivation scheme for this xpub. The key prefix does not identify it.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/dca/wallets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          label: label.trim(),
          watchData: watchInput.trim(),
          scheme: tab === 'xpub' && selectedScheme ? selectedScheme : undefined,
        }),
      });

      const data = await res.json() as {
        error?: string;
        wallet?: WalletRecord;
        transactions?: WalletTxRecord[];
        snapshots?: WalletSnapshotRecord[];
      };
      if (!res.ok || !data.wallet) {
        throw new Error(data.error || 'Failed to connect wallet.');
      }

      onWalletConnected(data.wallet, data.transactions ?? [], data.snapshots ?? []);
      onClose();
      // Reset form
      setLabel('');
      setWatchInput('');
    } catch (err: unknown) {
      setError((err as Error).message || 'Network error connecting wallet.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-xl rounded-2xl border border-zinc-200 bg-white shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#f97602]">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900">Connect Watch-Only Bitcoin Wallet</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Security Notice */}
        <div className="bg-amber-50/70 border-b border-amber-100 px-5 py-3">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="h-5 w-5 shrink-0 text-amber-700 mt-0.5" />
            <p className="text-xs leading-relaxed text-amber-900">
              <strong className="font-semibold">Strictly Watch-Only:</strong> Your wallet is connected in watch-only mode.
              Pan-African Bitcoin Academy can view publicly accessible Bitcoin information but cannot access, move, or spend your funds.
              <span className="font-semibold text-amber-950"> Never enter your recovery phrase or private keys.</span>
            </p>
          </div>
          <p className="mt-2 pl-7 text-[11px] leading-relaxed text-amber-900">
            Bitcoin addresses are queried through public Esplora data providers. Your extended public key is encrypted in PBA storage and is not sent to those providers.
          </p>
        </div>

        {/* Content Tabs */}
        <div className="p-5">
          <div className="flex rounded-lg bg-zinc-100 p-1 mb-4 text-xs font-medium">
            <button
              type="button"
              onClick={() => setTab('address')}
              className={`flex-1 rounded-md py-1.5 transition-colors ${
                tab === 'address'
                  ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              1. Single Address
            </button>
            <button
              type="button"
              onClick={() => setTab('xpub')}
              className={`flex-1 rounded-md py-1.5 transition-colors ${
                tab === 'xpub'
                  ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              2. Extended Key (xpub/ypub/zpub)
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Wallet Label
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g., Sparrow Vault, BlueWallet DCA, Trezor Savings"
                className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#f97602] focus:outline-none focus:ring-2 focus:ring-[#f97602]/20"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-zinc-700">
                  {tab === 'address' && 'Bitcoin Public Address'}
                  {tab === 'xpub' && 'Extended Public Key (xpub, ypub, or zpub)'}
                </label>
                <span className="text-[11px] text-zinc-400">
                  {tab === 'address' && 'Legacy (1...), SegWit (3..., bc1q...), or Taproot (bc1p...)'}
                  {tab === 'xpub' && 'Account-level, mainnet public extended keys only'}
                </span>
              </div>
              <textarea
                rows={3}
                value={watchInput}
                onChange={(e) => setWatchInput(e.target.value)}
                placeholder={
                  tab === 'address'
                    ? 'Paste your Bitcoin receiving address (e.g., bc1q...)'
                    : 'Paste your extended public key (zpub... or xpub...)'
                }
                className="w-full font-mono rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-[#f97602] focus:outline-none focus:ring-2 focus:ring-[#f97602]/20"
                required
              />
            </div>

            {/* Derivation scheme options for xpub */}
            {tab === 'xpub' && (
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Derivation Scheme
                </label>
                <select
                  value={selectedScheme}
                  onChange={(e) => setSelectedScheme(e.target.value as SupportedDerivationScheme | '')}
                  className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 text-xs text-zinc-800 bg-white focus:border-[#f97602] focus:outline-none focus:ring-2 focus:ring-[#f97602]/20"
                >
                  <option value="">Select based on your wallet&apos;s export path…</option>
                  <option value="bip44">Legacy (BIP44)</option>
                  <option value="bip49">Nested SegWit (BIP49)</option>
                  <option value="bip84">Native SegWit (BIP84)</option>
                  <option value="bip86">Taproot (BIP86)</option>
                </select>
                <p className="mt-1 text-[11px] text-zinc-500">
                  ypub and zpub keys identify BIP49 and BIP84. For an xpub, choose the account path shown in your wallet.
                </p>
              </div>
            )}

            {/* Validation Feedback Badge */}
            {validation && (
              <div
                className={`rounded-xl p-3 text-xs flex items-start gap-2 ${
                  validation.isSensitive
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : validation.isUnknown
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}
              >
                {validation.isSensitive ? (
                  <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                ) : validation.isUnknown ? (
                  <Info className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                )}
                <div>
                  {validation.isSensitive && (
                    <p className="font-semibold">{validation.message}</p>
                  )}
                  {validation.isUnknown && (
                    <p>{validation.message}</p>
                  )}
                  {!validation.isSensitive && !validation.isUnknown && (
                    <p>
                      <strong>Format detected:</strong> {validation.label}
                    </p>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
                {error}
              </div>
            )}

            {/* Compatible Wallets Helper Box */}
            <div className="rounded-xl bg-zinc-50 border border-zinc-200/80 p-3 text-[11px] text-zinc-600">
              <p className="font-medium text-zinc-800 mb-1">Compatible with standard Bitcoin wallets:</p>
              <div className="flex flex-wrap gap-1.5 text-zinc-600">
                <span className="rounded bg-white px-2 py-0.5 border border-zinc-200 font-medium">BlueWallet</span>
                <span className="rounded bg-white px-2 py-0.5 border border-zinc-200 font-medium">Sparrow Wallet</span>
                <span className="rounded bg-white px-2 py-0.5 border border-zinc-200 font-medium">Electrum</span>
                <span className="rounded bg-white px-2 py-0.5 border border-zinc-200 font-medium">Ledger</span>
                <span className="rounded bg-white px-2 py-0.5 border border-zinc-200 font-medium">Trezor</span>
                <span className="rounded bg-white px-2 py-0.5 border border-zinc-200 font-medium">Coldcard</span>
              </div>
              <p className="mt-1.5 text-zinc-500">
                In your wallet, export a public receiving address or account-level extended public key. Never export private keys or recovery phrases.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || validation?.isSensitive}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#f97602] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#e06900] disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Synchronizing on-chain...
                  </>
                ) : (
                  'Connect Watch-Only Wallet'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
