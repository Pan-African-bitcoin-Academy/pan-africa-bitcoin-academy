'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import {
  Key,
  ShieldCheck,
  Lock,
  Download,
  Upload,
  Check,
  Copy,
  AlertCircle,
  Eye,
  EyeOff,
  X,
  ArrowRight,
  RefreshCw,
  Mail,
  Shield,
  FileCheck2,
} from 'lucide-react';
import {
  generateAccountKeypair,
  restoreFromKeyBackup,
  createKeyBackup,
  exportRawPrivateKey,
  importRawPrivateKey,
  deriveAccountIdFromPrivateKey,
  signChallenge,
  type GeneratedAccountBundle,
  type AccountKeyBackup,
} from '@/lib/cryptoAuth';

interface CryptoAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onForgotPassword?: (email: string) => void;
}

type AuthTab = 'crypto_create' | 'crypto_login' | 'email_login';

export function CryptoAuthModal({
  isOpen,
  onClose,
  onSuccess,
  onForgotPassword,
}: CryptoAuthModalProps) {
  const [activeTab, setActiveTab] = useState<AuthTab>('crypto_create');

  // Create flow state
  const [generatedBundle, setGeneratedBundle] = useState<GeneratedAccountBundle | null>(null);
  
  const [hasDownloadedBackup, setHasDownloadedBackup] = useState(false);
  const [confirmSavedBackup, setConfirmSavedBackup] = useState(false);
  const [confirmNoCustody, setConfirmNoCustody] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [rawKeyString, setRawKeyString] = useState<string>('');
  const [copiedRawKey, setCopiedRawKey] = useState(false);
  const [showRawKey, setShowRawKey] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Login flow state
  const [loginMethod, setLoginMethod] = useState<'file' | 'raw'>('file');
  const [uploadedBackup, setUploadedBackup] = useState<AccountKeyBackup | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  
  const [rawPrivateKeyInput, setRawPrivateKeyInput] = useState('');
  const [loginAccountIdInput, setLoginAccountIdInput] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Traditional email login state
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showEmailPassword, setShowEmailPassword] = useState(false);
  const [isEmailLoggingIn, setIsEmailLoggingIn] = useState(false);

  // Error/Success messages
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Auto-generate keypair on open if in create tab
      if (!generatedBundle) {
        handleGenerateKeypair();
      }
    } else {
      document.body.style.overflow = '';
      setErrorMessage(null);
      setSuccessMessage(null);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleGenerateKeypair() {
    try {
      setIsGenerating(true);
      setErrorMessage(null);
      const bundle = await generateAccountKeypair();
      setGeneratedBundle(bundle);
      const raw = await exportRawPrivateKey(bundle.privateKey);
      setRawKeyString(raw);
      setHasDownloadedBackup(false);
      setConfirmSavedBackup(false);
      setConfirmNoCustody(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate keypair';
      setErrorMessage(msg);
    } finally {
      setIsGenerating(false);
    }
  }

  function handleCopyAccountId() {
    if (!generatedBundle) return;
    navigator.clipboard.writeText(generatedBundle.identity.accountId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  }

  async function handleDownloadBackup() {
    if (!generatedBundle) return;

    try {
      setErrorMessage(null);
      const backup = await createKeyBackup(
        generatedBundle.privateKey,
        generatedBundle.identity.accountId,
      );

      const blob = new Blob([JSON.stringify(backup, null, 2)], {
        type: 'application/json;charset=utf-8',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pba-account-${generatedBundle.identity.accountId.slice(0, 16)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setHasDownloadedBackup(true);
      setSuccessMessage('Account key backup downloaded safely. Keep this file in a secure location.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create backup file';
      setErrorMessage(msg);
    }
  }

  async function handleCompleteAccountCreation() {
    if (!generatedBundle) return;
    if (!hasDownloadedBackup) {
      setErrorMessage('Please download your encrypted private key backup file before continuing.');
      return;
    }
    if (!confirmSavedBackup || !confirmNoCustody) {
      setErrorMessage('Please acknowledge both security confirmations to proceed.');
      return;
    }

    try {
      setIsRegistering(true);
      setErrorMessage(null);

      const res = await fetch('/api/crypto/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: generatedBundle.identity.accountId,
          publicKeySpki: generatedBundle.identity.publicKeySpki,
          algorithm: generatedBundle.identity.algorithm,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to register account.');
      }

      setSuccessMessage('Account established successfully! Accessing your DCA dashboard…');
      setTimeout(() => {
        onSuccess?.();
        onClose();
        window.location.reload();
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      setErrorMessage(msg);
    } finally {
      setIsRegistering(false);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if ((parsed.format !== 'pba-dca-encrypted-key' && parsed.format !== 'pba-key-backup') || !parsed.accountId) {
          throw new Error('Unrecognized backup format. Please select a valid PBA account JSON file.');
        }
        setUploadedBackup(parsed);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to parse JSON file';
        setErrorMessage(msg);
        setUploadedBackup(null);
      }
    };
    reader.readAsText(file);
  }

  async function handleCryptoLogin(e: FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      setIsAuthenticating(true);
      let privateKey: CryptoKey;
      let accountId: string;

      if (loginMethod === 'file') {
        if (!uploadedBackup) {
          throw new Error('Please select your PBA account key JSON file.');
        }
        const restored = await restoreFromKeyBackup(uploadedBackup);
        privateKey = restored.privateKey;
        accountId = restored.accountId;
      } else {
        if (!rawPrivateKeyInput.trim()) {
          throw new Error('Please enter your private account key string.');
        }
        privateKey = await importRawPrivateKey(rawPrivateKeyInput.trim());
        const derived = await deriveAccountIdFromPrivateKey(privateKey);
        accountId = derived.accountId;
      }

      // Step 1: Request dynamic challenge from server
      const chalRes = await fetch(`/api/crypto/challenge?accountId=${encodeURIComponent(accountId)}`);
      const chalData = await chalRes.json();
      if (!chalRes.ok) {
        throw new Error(chalData.error || 'Failed to request authentication challenge.');
      }

      // Step 2: Sign challenge locally in browser
      const signature = await signChallenge(privateKey, chalData.challenge);

      // Step 3: Send public account ID and signature for verification
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
        throw new Error(verifyData.error || 'Authentication signature verification failed.');
      }

      setSuccessMessage('Authentication successful! Restoring your DCA workspace…');
      setTimeout(() => {
        onSuccess?.();
        onClose();
        window.location.reload();
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      setErrorMessage(msg);
    } finally {
      setIsAuthenticating(false);
    }
  }

  async function handleEmailLogin(e: FormEvent) {
    e.preventDefault();
    if (!emailInput || !passwordInput) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    try {
      setIsEmailLoggingIn(true);
      setErrorMessage(null);

      const res = await fetch('/api/profile/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput.trim(),
          password: passwordInput,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Email sign in failed.');
      }

      setSuccessMessage('Signed in successfully! Restoring your DCA workspace…');
      setTimeout(() => {
        onSuccess?.();
        onClose();
        window.location.reload();
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign in failed';
      setErrorMessage(msg);
    } finally {
      setIsEmailLoggingIn(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-xl rounded-2xl border border-zinc-200 bg-white shadow-2xl text-zinc-900 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 p-5 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-[#f97602] border border-orange-200/60">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900">PBA DCA Account Access</h2>
              <p className="text-xs text-zinc-500">Cryptographic identity · No KYC · No email required</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 border-b border-zinc-100 bg-zinc-50/70 p-1.5 text-xs font-medium text-zinc-600">
          <button
            type="button"
            onClick={() => {
              setActiveTab('crypto_create');
              setErrorMessage(null);
            }}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 transition cursor-pointer ${
              activeTab === 'crypto_create'
                ? 'bg-white font-semibold text-[#f97602] shadow-xs border border-zinc-200/80'
                : 'hover:text-zinc-900'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            Create Account
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('crypto_login');
              setErrorMessage(null);
            }}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 transition cursor-pointer ${
              activeTab === 'crypto_login'
                ? 'bg-white font-semibold text-[#f97602] shadow-xs border border-zinc-200/80'
                : 'hover:text-zinc-900'
            }`}
          >
            <Key className="h-4 w-4" />
            Access With Key
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('email_login');
              setErrorMessage(null);
            }}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 transition cursor-pointer ${
              activeTab === 'email_login'
                ? 'bg-white font-semibold text-[#f97602] shadow-xs border border-zinc-200/80'
                : 'hover:text-zinc-900'
            }`}
          >
            <Mail className="h-4 w-4" />
            Email Login
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-5 space-y-4">
          {/* Status Banners */}
          {errorMessage && (
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <p className="leading-relaxed">{errorMessage}</p>
            </div>
          )}
          {successMessage && (
            <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
              <Check className="h-4 w-4 mt-0.5 shrink-0 text-emerald-600" />
              <p className="leading-relaxed font-medium">{successMessage}</p>
            </div>
          )}

          {/* TAB 1: CREATE ACCOUNT */}
          {activeTab === 'crypto_create' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">Your Public Account ID</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handleGenerateKeypair}
                      disabled={isGenerating}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-zinc-500 hover:bg-zinc-200/70 transition cursor-pointer"
                      title="Generate a new keypair"
                    >
                      <RefreshCw className={`h-3 w-3 ${isGenerating ? 'animate-spin' : ''}`} />
                      Regenerate
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyAccountId}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-[#f97602] hover:bg-orange-50 transition cursor-pointer"
                    >
                      {copiedId ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copiedId ? 'Copied' : 'Copy ID'}
                    </button>
                  </div>
                </div>
                <p className="font-mono text-xs break-all text-zinc-900 bg-white p-2.5 rounded-lg border border-zinc-200 select-all">
                  {generatedBundle?.identity.accountId ?? 'Generating keypair…'}
                </p>

              </div>
                {/* Optional: Raw Private Key String (Advanced) */}
                <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setShowRawKey(!showRawKey)}
                      className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wide flex items-center gap-1.5 hover:text-zinc-900 cursor-pointer"
                    >
                      <Key className="h-3 w-3 text-[#f97602]" />
                      {showRawKey ? 'Hide Raw Private Key String' : 'View Raw Private Key String (Advanced)'}
                    </button>
                    {showRawKey && (
                      <button
                        type="button"
                        onClick={() => {
                          if (rawKeyString) {
                            navigator.clipboard.writeText(rawKeyString);
                            setCopiedRawKey(true);
                            setTimeout(() => setCopiedRawKey(false), 2000);
                          }
                        }}
                        className="inline-flex items-center gap-1 text-[11px] text-[#f97602] hover:underline cursor-pointer"
                      >
                        {copiedRawKey ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        {copiedRawKey ? 'Copied' : 'Copy Key'}
                      </button>
                    )}
                  </div>
                  {showRawKey && (
                    <>
                      <p className="text-[11px] text-zinc-500">
                        This is your raw unencrypted base64url private key string. You can paste this directly into the &quot;Paste Raw Key&quot; sign-in tab.
                      </p>
                      <p className="font-mono text-[11px] text-zinc-800 break-all select-all bg-white p-2.5 rounded-lg border border-zinc-200 max-h-24 overflow-y-auto">
                        {rawKeyString || 'Generating...'}
                      </p>
                    </>
                  )}
                </div>


              {/* Step 2: Passphrase & Backup Download */}
              <div className="space-y-3 rounded-xl border border-orange-200/80 bg-orange-50/40 p-4">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-[#f97602]" />
                  <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">
                    Step 1: Download Private Key File
                  </h3>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Download your private key file or copy your raw key. You will need this key whenever you sign in from another browser.
                </p>



                <button
                  type="button"
                  onClick={handleDownloadBackup}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-[#f97602] py-2.5 text-xs font-semibold text-[#f97602] shadow-xs hover:bg-orange-50 transition cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  {hasDownloadedBackup ? 'Re-Download Key File (.json)' : 'Download Private Key File (.json)'}
                </button>
                {hasDownloadedBackup && (
                  <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    Backup file saved successfully.
                  </p>
                )}
              </div>

              {/* Step 3: Required Confirmations */}
              <div className="space-y-2.5 rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 text-xs text-zinc-700">
                <h4 className="font-semibold text-zinc-900 text-xs uppercase tracking-wider">
                  Step 2: Confirmations
                </h4>
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmSavedBackup}
                    onChange={(e) => setConfirmSavedBackup(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-[#f97602] focus:ring-[#f97602]"
                  />
                  <span className="leading-normal">
                    I have downloaded and safely stored my private key backup file in a secure place.
                  </span>
                </label>
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmNoCustody}
                    onChange={(e) => setConfirmNoCustody(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-[#f97602] focus:ring-[#f97602]"
                  />
                  <span className="leading-normal">
                    I understand this is an authentication key, not a Bitcoin wallet, and that PBA cannot recover my account if I lose this file.
                  </span>
                </label>
              </div>

              <button
                type="button"
                onClick={handleCompleteAccountCreation}
                disabled={!hasDownloadedBackup || !confirmSavedBackup || !confirmNoCustody || isRegistering}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#f97602] py-3 text-xs font-bold text-white shadow-sm hover:bg-[#d46200] disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
              >
                {isRegistering ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Establishing Account…
                  </>
                ) : (
                  <>
                    Complete & Access DCA Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 2: ACCESS WITH EXISTING KEY */}
          {activeTab === 'crypto_login' && (
            <form onSubmit={handleCryptoLogin} className="space-y-4">
              <div className="flex rounded-lg border border-zinc-200 p-1 bg-zinc-100 text-xs">
                <button
                  type="button"
                  onClick={() => setLoginMethod('file')}
                  className={`flex-1 rounded-md py-1.5 font-medium transition cursor-pointer ${
                    loginMethod === 'file' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  Upload Backup (.json)
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('raw')}
                  className={`flex-1 rounded-md py-1.5 font-medium transition cursor-pointer ${
                    loginMethod === 'raw' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  Paste Private Key String
                </button>
              </div>

              {loginMethod === 'file' ? (
                <div className="space-y-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-zinc-300 rounded-xl p-5 text-center hover:border-[#f97602] hover:bg-orange-50/20 transition group cursor-pointer"
                  >
                    <Upload className="h-6 w-6 mx-auto text-zinc-400 group-hover:text-[#f97602] transition" />
                    <p className="mt-2 text-xs font-semibold text-zinc-800">
                      {uploadedFileName ? uploadedFileName : 'Select your pba-account-*.json backup file'}
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Click to browse your device</p>
                  </button>

                  {uploadedBackup && (
                    <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-800 flex items-center justify-between">
                      <span className="font-mono text-[11px] truncate max-w-[280px]">
                        Account: {uploadedBackup.accountId}
                      </span>
                      <FileCheck2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-zinc-700">
                        Raw Private Key (Base64url PKCS#8)
                      </label>
                      <span className="text-[10px] text-zinc-400">Auto-derives Account ID</span>
                    </div>
                    <textarea
                      rows={4}
                      placeholder="Paste your private key string..."
                      value={rawPrivateKeyInput}
                      onChange={(e) => setRawPrivateKeyInput(e.target.value)}
                      className="w-full font-mono rounded-xl border border-zinc-300 bg-white p-3 text-xs text-zinc-900 focus:border-[#f97602] focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#f97602] py-3 text-xs font-bold text-white shadow-sm hover:bg-[#d46200] disabled:opacity-50 transition cursor-pointer"
              >
                {isAuthenticating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Verifying Challenge Signature…
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    Authenticate & Access Records
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 3: EMAIL & PASSWORD LOGIN */}
          {activeTab === 'email_login' && (
            <form onSubmit={handleEmailLogin} className="space-y-3.5">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600">
                Sign in with your standard Pan-African Bitcoin Academy student account email and password.
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="student@example.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-xs text-zinc-900 focus:border-[#f97602] focus:outline-hidden"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-zinc-700">Password</label>
                  {onForgotPassword && (
                    <button
                      type="button"
                      onClick={() => onForgotPassword(emailInput)}
                      className="text-xs text-[#f97602] hover:underline cursor-pointer"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showEmailPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-xs text-zinc-900 pr-9 focus:border-[#f97602] focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEmailPassword(!showEmailPassword)}
                    className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                  >
                    {showEmailPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={isEmailLoggingIn}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3 text-xs font-bold text-white shadow-sm hover:bg-zinc-800 disabled:opacity-50 transition cursor-pointer"
              >
                {isEmailLoggingIn ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    Sign In with Email
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer Disclaimers */}
        <div className="border-t border-zinc-100 bg-zinc-50 p-4 text-[11px] leading-relaxed text-zinc-500 space-y-1">
          <p className="flex items-center gap-1.5 font-medium text-zinc-700">
            <Shield className="h-3.5 w-3.5 text-[#f97602]" />
            Educational & Personal Record-Keeping Tool
          </p>
          <p>
            The PBA DCA platform does not custody Bitcoin, execute purchases, or connect to Bitcoin wallets. Private account keys are client-side credentials solely used to authenticate your access to your saved simulation and DCA plans.
          </p>
        </div>
      </div>
    </div>
  );
}
