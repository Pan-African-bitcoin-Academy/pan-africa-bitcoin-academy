'use client';

import { useState } from 'react';
import { Mail, Lock, Check, AlertCircle, Eye, EyeOff, X, RefreshCw } from 'lucide-react';
import { validatePassword } from '@/lib/passwordValidation';

interface LinkEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (email: string) => void;
}

export function LinkEmailModal({ isOpen, onClose, onSuccess }: LinkEmailModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !/\S+@\S+\.\S+/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    const passCheck = validatePassword(password);
    if (!passCheck.isValid) {
      setError(passCheck.errors[0] || 'Password does not meet strength requirements.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/profile/add-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to link email & password.');
      }

      onSuccess?.(email.trim());
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to link credentials';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl text-zinc-100 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-[#f97602]">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Add Email & Password</h3>
              <p className="text-xs text-zinc-400">Enable traditional sign-in alongside your private key</p>
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

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@example.com"
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-[#f97602] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Create Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-[#f97602] focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Confirm Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-[#f97602] focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-[#f97602] py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#e06800] disabled:opacity-50 cursor-pointer transition"
          >
            {loading ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                Linking Credentials...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Link Email & Password
              </>
            )}
          </button>
        </form>

        <p className="text-[11px] text-zinc-500 text-center">
          Adding an email allows you to recover account access if you ever lose your private key backup.
        </p>
      </div>
    </div>
  );
}
