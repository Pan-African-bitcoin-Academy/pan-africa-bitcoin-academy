'use client';

import { useState, useEffect } from 'react';
import {
  Shield,
  Key,
  Mail,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  Lock,
  Plus,
  Download,
  Info,
} from 'lucide-react';
import { GenerateKeyModal } from './GenerateKeyModal';
import { LinkEmailModal } from './LinkEmailModal';

interface AuthStatus {
  studentId: string;
  profileId: string;
  email: string | null;
  accountCreatedAt: string;
  methods: {
    emailPassword: boolean;
    cryptoKey: boolean;
  };
  cryptoAccount: {
    accountId: string;
    algorithm: string;
    status: string;
    linkedAt: string;
  } | null;
}

interface AccountSecuritySectionProps {
  userData?: any;
}

export function AccountSecuritySection({ userData }: AccountSecuritySectionProps) {
  const [status, setStatus] = useState<AuthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [showGenerateKeyModal, setShowGenerateKeyModal] = useState(false);
  const [showLinkEmailModal, setShowLinkEmailModal] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  async function fetchStatus() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/crypto/status', { credentials: 'include' });
      if (!res.ok) {
        throw new Error('Failed to load authentication status');
      }
      const data: AuthStatus = await res.json();
      setStatus(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error loading security status';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleCopyAccountId(accountId: string) {
    navigator.clipboard.writeText(accountId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-zinc-400">
        <RefreshCw className="h-5 w-5 animate-spin mr-2 text-[#f97602]" />
        Loading security settings...
      </div>
    );
  }

  const isDualAuth = status?.methods.emailPassword && status?.methods.cryptoKey;

  return (
    <div className="space-y-6">
      {/* Top Banner / Card */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-[#f97602] border border-orange-500/20">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Account Security & Authentication</h2>
              <p className="text-xs text-zinc-400">
                Manage your credentials. You can use traditional email/password, a cryptographic private key, or both.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border ${
                isDualAuth
                  ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                  : 'bg-amber-950/60 border-amber-700 text-amber-300'
              }`}
            >
              {isDualAuth ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Dual-Authentication Active
                </>
              ) : (
                <>
                  <Info className="h-3.5 w-3.5 text-amber-400" />
                  Single Authentication Method
                </>
              )}
            </span>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-950/40 border border-red-800 p-3 text-xs text-red-200">
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Account Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3.5 space-y-1">
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">
              Permanent Student ID
            </span>
            <p className="font-mono text-xs text-zinc-200 break-all select-all">
              {status?.studentId || status?.profileId || '—'}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3.5 space-y-1">
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">
              Account Registered
            </span>
            <p className="text-xs text-zinc-200">
              {status?.accountCreatedAt
                ? new Date(status.accountCreatedAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Connected Authentication Methods */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wide">
          Connected Authentication Methods
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Method 1: Email and Password */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Email & Password</h4>
                    <span className="text-[11px] text-zinc-500">Traditional login credential</span>
                  </div>
                </div>

                {status?.methods.emailPassword ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 rounded-full px-2.5 py-0.5">
                    <Check className="h-3 w-3" />
                    Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center text-[11px] font-medium text-zinc-400 bg-zinc-800/60 border border-zinc-700/60 rounded-full px-2.5 py-0.5">
                    Not Linked
                  </span>
                )}
              </div>

              {status?.methods.emailPassword ? (
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wide">Associated Email</span>
                  <p className="text-xs font-medium text-zinc-200 break-all">{status.email}</p>
                </div>
              ) : (
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Your account is currently key-only. Adding an email and password provides an alternative login method if you ever lose your device.
                </p>
              )}
            </div>

            {!status?.methods.emailPassword && (
              <button
                type="button"
                onClick={() => setShowLinkEmailModal(true)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white py-2.5 cursor-pointer transition"
              >
                <Plus className="h-3.5 w-3.5 text-[#f97602]" />
                Add Email & Password
              </button>
            )}
          </div>

          {/* Method 2: Cryptographic Private Key */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-[#f97602]">
                    <Key className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Private Account Key</h4>
                    <span className="text-[11px] text-zinc-500">ECDSA P-256 cryptographic challenge</span>
                  </div>
                </div>

                {status?.methods.cryptoKey ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 rounded-full px-2.5 py-0.5">
                    <Check className="h-3 w-3" />
                    Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center text-[11px] font-medium text-zinc-400 bg-zinc-800/60 border border-zinc-700/60 rounded-full px-2.5 py-0.5">
                    Not Linked
                  </span>
                )}
              </div>

              {status?.methods.cryptoKey && status.cryptoAccount ? (
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wide">Public Account ID</span>
                    <button
                      type="button"
                      onClick={() => handleCopyAccountId(status.cryptoAccount!.accountId)}
                      className="inline-flex items-center gap-1 text-[11px] text-[#f97602] hover:underline cursor-pointer"
                    >
                      {copiedId ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copiedId ? 'Copied' : 'Copy ID'}
                    </button>
                  </div>
                  <p className="font-mono text-xs text-zinc-200 break-all select-all">
                    {status.cryptoAccount.accountId}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1 border-t border-zinc-800/60">
                    <span>Algorithm: {status.cryptoAccount.algorithm}</span>
                    <span>Status: Active</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Generate an asymmetric keypair locally in your browser. Authenticate with zero password transmission using cryptographic signatures.
                </p>
              )}
            </div>

            {status?.methods.cryptoKey ? (
              <button
                type="button"
                onClick={() => setShowGenerateKeyModal(true)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white py-2.5 cursor-pointer transition"
              >
                <RefreshCw className="h-3.5 w-3.5 text-[#f97602]" />
                Rotate / Re-generate Key
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowGenerateKeyModal(true)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#f97602] hover:bg-[#e06800] text-xs font-semibold text-white py-2.5 cursor-pointer transition shadow-sm"
              >
                <Key className="h-3.5 w-3.5" />
                Generate Private Account Key
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Financial & Architectural Clarification */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 space-y-3">
        <div className="flex items-start gap-3">
          <Info className="h-4 w-4 text-[#f97602] shrink-0 mt-0.5" />
          <div className="space-y-1.5 text-xs text-zinc-400 leading-relaxed">
            <h5 className="font-semibold text-zinc-200">Important Financial Distinction</h5>
            <p>
              Your private account key is strictly an <span className="text-white font-medium">authentication credential</span> for signing challenge messages to verify your identity. It is <span className="text-white font-medium">NOT a Bitcoin wallet key</span> and does not hold, send, receive, or control Bitcoin funds.
            </p>
            <p className="text-zinc-500">
              Pan-African Bitcoin Academy never receives or stores your private key. Always keep your encrypted backup file safe.
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <GenerateKeyModal
        isOpen={showGenerateKeyModal}
        onClose={() => setShowGenerateKeyModal(false)}
        onSuccess={() => {
          fetchStatus();
        }}
      />

      <LinkEmailModal
        isOpen={showLinkEmailModal}
        onClose={() => setShowLinkEmailModal(false)}
        onSuccess={() => {
          fetchStatus();
        }}
      />
    </div>
  );
}
