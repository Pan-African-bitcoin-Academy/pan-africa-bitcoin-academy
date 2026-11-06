"use client";

import { useState, useEffect } from "react";
import {
  Key,
  Lock,
  Unlock,
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Zap,
  Globe2,
  Server,
  Layers,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  FileCode,
  DollarSign,
} from "lucide-react";

type Localized = { en: string; ti: string };
const t = (v: Localized, isTi: boolean) => (isTi ? v.ti : v.en);

const panelClass =
  "rounded-2xl border border-zinc-800 bg-zinc-950/90 p-4 shadow-xl sm:p-6 my-6";

/* =========================================================================
   Module 1: Mailbox & Keypair Simulator (Section 6.1)
   ========================================================================= */

export function MailboxKeypairSimulator({ isTi }: { isTi: boolean }) {
  const [balance, setBalance] = useState(50000); // sats
  const [isDepositing, setIsDepositing] = useState(false);
  const [keyState, setKeyState] = useState<"locked" | "valid" | "invalid">("locked");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"address" | "private" | "lightning">("address");

  const handleDeposit = () => {
    setIsDepositing(true);
    setTimeout(() => {
      setBalance((b) => b + 10000);
      setIsDepositing(false);
    }, 600);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <section className={panelClass} aria-label="Mailbox and Keypair Simulator">
      {/* Header */}
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-400">
          {t(
            {
              en: "6.1 Practical Example: The Mailbox & Keypair Simulator",
              ti: "6.1 ተግባራዊ ኣብነት: ሳጹን ፖስታን መፍትሓትን (Mailbox Analogy)",
            },
            isTi
          )}
        </p>
        <h4 className="mt-1 text-lg font-bold text-zinc-100 sm:text-xl">
          {t(
            {
              en: "Public Key (Deposit Slot) vs Private Key (Unlock Key)",
              ti: "ህዝባዊ መፍትሕ (መቐበሊ) ኣንጻር ናይ ብሕቲ መፍትሕ (መኽፈቲ)",
            },
            isTi
          )}
        </h4>
        <p className="mt-1 text-xs text-zinc-400">
          {t(
            {
              en: "Think of your Bitcoin wallet as a physical mailbox. Anyone can drop coins into the slot using your public address, but only your private key can unlock the door to spend them.",
              ti: "ናይ ቢትኮይን ቦርሳኻ ከም ሳጹን ፖስታ ሕሰቦ። ዝኾነ ሰብ ብህዝባዊ ኣድራሻኻ ኣቢሉ ናብቲ ሳጹን ሳንቲም ክደርቢ ይኽእል፡ ነቲ ማዕጾ ከፊቱ ዘውጽእ ግን ናትካ ናይ ብሕቲ መፍትሕ ጥራይ እዩ።",
            },
            isTi
          )}
        </p>
      </div>

      {/* Interactive Mailbox Grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Left Side: The Public Mailbox (Anyone Can Deposit) */}
        <div className="flex flex-col justify-between rounded-xl border border-cyan-500/30 bg-zinc-900/60 p-4 sm:p-5">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Send className="h-4 w-4" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-zinc-100 sm:text-base">
                    {t({ en: "Mail Slot: Public Address", ti: "ናይ ምቕባል መስኮት: ህዝባዊ ኣድራሻ" }, isTi)}
                  </h5>
                  <p className="text-[11px] text-zinc-400">
                    {t({ en: "Visible to the entire world", ti: "ንመላእ ዓለም ክፉት ዝኾነ" }, isTi)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">
                  {t({ en: "Vault Balance", ti: "ሚዛን ሳጹን" }, isTi)}
                </span>
                <span className="text-sm font-mono font-bold text-emerald-400">
                  {balance.toLocaleString()} sats
                </span>
              </div>
            </div>

            {/* Visual SVG Mailbox Illustration */}
            <div className="my-5 flex flex-col items-center justify-center">
              <svg viewBox="0 0 240 180" className="h-40 w-56 select-none">
                {/* Mailbox Body */}
                <rect
                  x="40"
                  y="30"
                  width="160"
                  height="130"
                  rx="14"
                  fill="#18181b"
                  stroke="#06b6d4"
                  strokeWidth="2"
                  className="shadow-2xl"
                />

                {/* Top Mail Deposit Slot */}
                <rect
                  x="65"
                  y="50"
                  width="110"
                  height="16"
                  rx="8"
                  fill="#09090b"
                  stroke="#0891b2"
                  strokeWidth="1.5"
                />
                <text
                  x="120"
                  y="62"
                  textAnchor="middle"
                  className="fill-cyan-300 text-[9px] font-mono font-bold uppercase tracking-wider"
                >
                  DEPOSIT SLOT
                </text>

                {/* Animated Falling Coin */}
                {isDepositing && (
                  <g className="animate-bounce">
                    <circle cx="120" cy="40" r="10" fill="#f59e0b" stroke="#fef08a" strokeWidth="1.5" />
                    <text x="120" y="44" textAnchor="middle" className="fill-amber-950 text-[10px] font-bold">
                      ₿
                    </text>
                  </g>
                )}

                {/* Public Address display on mailbox door */}
                <rect x="55" y="80" width="130" height="32" rx="6" fill="#09090b" stroke="#27272a" />
                <text x="120" y="94" textAnchor="middle" className="fill-zinc-400 text-[8px] font-mono">
                  Alice's Public Address
                </text>
                <text x="120" y="106" textAnchor="middle" className="fill-cyan-300 text-[9px] font-mono font-semibold">
                  bc1qar0s...wf5mdq
                </text>

                {/* Bottom glass UTXO preview */}
                <rect x="55" y="122" width="130" height="24" rx="4" fill="#042f2e" stroke="#10b981" strokeWidth="1" />
                <text x="120" y="138" textAnchor="middle" className="fill-emerald-300 text-[10px] font-mono font-bold">
                  ● UTXOs: {balance.toLocaleString()} sats
                </text>
              </svg>
            </div>

            {/* Public Address Pill */}
            <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 p-2 text-xs font-mono">
              <span className="truncate text-cyan-200">
                1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
              </span>
              <button
                type="button"
                onClick={() => handleCopy("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", "addr")}
                className="ml-2 flex items-center gap-1 rounded bg-zinc-800 px-2 py-1 text-[11px] text-zinc-300 hover:text-white"
              >
                {copiedKey === "addr" ? (
                  <Check className="h-3 w-3 text-emerald-400" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                <span>{copiedKey === "addr" ? t({ en: "Copied", ti: "ተቐዲሑ" }, isTi) : t({ en: "Copy", ti: "ቅዳሕ" }, isTi)}</span>
              </button>
            </div>
          </div>

          {/* Deposit Trigger */}
          <div className="mt-4 border-t border-zinc-800 pt-3">
            <button
              type="button"
              disabled={isDepositing}
              onClick={handleDeposit}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-500/60 bg-cyan-500/20 py-2.5 text-xs font-semibold text-cyan-200 transition-all hover:bg-cyan-500/30 active:scale-[0.99] disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              <span>
                {isDepositing
                  ? t({ en: "Dropping 10,000 sats into slot...", ti: "10,000 ሳት ናብ ሳጹን ይኣቱ ኣሎ..." }, isTi)
                  : t({ en: "Deposit 10,000 sats (Anyone can do this)", ti: "10,000 ሳት ደርቢ (ማንም ሰብ ክገብሮ ይኽእል)" }, isTi)}
              </span>
            </button>
            <p className="mt-1.5 text-center text-[11px] text-zinc-400">
              {t(
                {
                  en: "Dropping coins requires zero permission — your public key is safe to share with everyone.",
                  ti: "ገንዘብ ምቕባል ፍቓድ ኣየድልዮን — ህዝባዊ ኣድራሻኻ ንማንም ሰብ ንምክፋል ውሑስ እዩ።",
                },
                isTi
              )}
            </p>
          </div>
        </div>

        {/* Right Side: The Private Key (Only Owner Can Unlock) */}
        <div className="flex flex-col justify-between rounded-xl border border-amber-500/30 bg-zinc-900/60 p-4 sm:p-5">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Key className="h-4 w-4" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-zinc-100 sm:text-base">
                    {t({ en: "Mailbox Door: Private Key", ti: "ማዕጾ ሳጹን: ናይ ብሕቲ መፍትሕ" }, isTi)}
                  </h5>
                  <p className="text-[11px] text-zinc-400">
                    {t({ en: "Must remain 100% secret", ti: "100% ምስጢር ኮይኑ ክዕቀብ ዘለዎ" }, isTi)}
                  </p>
                </div>
              </div>
              <span
                className={"inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold border " + (
                  keyState === "valid"
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                    : keyState === "invalid"
                    ? "bg-rose-500/20 border-rose-500/40 text-rose-300"
                    : "bg-zinc-800 border-zinc-700 text-zinc-400"
                )}
              >
                {keyState === "valid" ? (
                  <>
                    <Unlock className="h-3 w-3" />
                    {t({ en: "UNLOCKED", ti: "ተኸፊቱ" }, isTi)}
                  </>
                ) : keyState === "invalid" ? (
                  <>
                    <AlertCircle className="h-3 w-3" />
                    {t({ en: "ACCESS DENIED", ti: "ተኸልኪሉ" }, isTi)}
                  </>
                ) : (
                  <>
                    <Lock className="h-3 w-3" />
                    {t({ en: "LOCKED", ti: "ዕጹው" }, isTi)}
                  </>
                )}
              </span>
            </div>

            {/* Keyhole / Door Simulation View */}
            <div className="my-5 flex flex-col items-center justify-center">
              <div className={"flex h-40 w-56 flex-col items-center justify-center rounded-xl border p-4 transition-all duration-300 " + (
                keyState === "valid"
                  ? "border-emerald-500/50 bg-emerald-950/20 shadow-[0_0_25px_rgba(16,185,129,0.15)]"
                  : keyState === "invalid"
                  ? "border-rose-500/50 bg-rose-950/20 shadow-[0_0_25px_rgba(244,63,94,0.15)]"
                  : "border-zinc-800 bg-zinc-950"
              )}>
                {keyState === "valid" ? (
                  <div className="flex flex-col items-center text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mb-2">
                      <Unlock className="h-6 w-6" />
                    </div>
                    <p className="text-xs font-bold text-emerald-300">
                      {t({ en: "Valid Signature Verified!", ti: "ቅኑዕ ፌርማ ተረጋጊጹ!" }, isTi)}
                    </p>
                    <p className="mt-1 text-[11px] font-mono text-zinc-400">
                      Sig: 30450221008d...
                    </p>
                    <span className="mt-2 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      {t({ en: "Authorized to spend satoshis", ti: "ገንዘብ ንምስዳድ ስልጣን ተዋሂቡ" }, isTi)}
                    </span>
                  </div>
                ) : keyState === "invalid" ? (
                  <div className="flex flex-col items-center text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/20 text-rose-400 mb-2">
                      <AlertCircle className="h-6 w-6" />
                    </div>
                    <p className="text-xs font-bold text-rose-300">
                      {t({ en: "Invalid Private Key", ti: "ጌጋ ናይ ብሕቲ መፍትሕ" }, isTi)}
                    </p>
                    <p className="mt-1 text-[11px] text-zinc-400">
                      {t({ en: "Math protects your funds: coins cannot move", ti: "ሒሳብ ገንዘብካ ይሕሉ: ሳንቲም ክንቀሳቐስ ኣይክእልን" }, isTi)}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 border border-zinc-700 text-amber-400 mb-2">
                      <Lock className="h-6 w-6" />
                    </div>
                    <p className="text-xs font-semibold text-zinc-300">
                      {t({ en: "Mailbox Door Locked", ti: "ማዕጾ ሳጹን ተዓጽዩ ኣሎ" }, isTi)}
                    </p>
                    <p className="mt-1 text-[11px] text-zinc-500">
                      {t({ en: "Insert Alice's private key to sign and spend", ti: "ንምፍራምን ንምስዳድን ናይ ብሕቲ መፍትሕ ኣእቱ" }, isTi)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Private Key Secret Pill */}
            <div className="flex items-center justify-between rounded-lg border border-amber-500/30 bg-zinc-950 p-2 text-xs font-mono">
              <span className="truncate text-amber-300 font-semibold">
                L5EZftvrYaSudiozVRzTq...
              </span>
              <span className="ml-2 rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                {t({ en: "PRIVATE", ti: "ምስጢር" }, isTi)}
              </span>
            </div>
          </div>

          {/* Key Simulation Buttons */}
          <div className="mt-4 flex flex-col gap-2 border-t border-zinc-800 pt-3">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setKeyState("valid")}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-emerald-500/60 bg-emerald-500/20 py-2 text-xs font-semibold text-emerald-200 transition-all hover:bg-emerald-500/30"
              >
                <Key className="h-3.5 w-3.5" />
                <span>{t({ en: "Use Alice's Key", ti: "መፍትሕ ኣሊስ ኣእቱ" }, isTi)}</span>
              </button>
              <button
                type="button"
                onClick={() => setKeyState("invalid")}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-rose-500/50 bg-rose-500/10 py-2 text-xs font-semibold text-rose-300 transition-all hover:bg-rose-500/20"
              >
                <AlertCircle className="h-3.5 w-3.5" />
                <span>{t({ en: "Try Wrong Key", ti: "ጌጋ መፍትሕ ፈትን" }, isTi)}</span>
              </button>
            </div>
            {keyState !== "locked" && (
              <button
                type="button"
                onClick={() => setKeyState("locked")}
                className="flex items-center justify-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200 py-1"
              >
                <RotateCcw className="h-3 w-3" />
                <span>{t({ en: "Lock Door Again", ti: "ማዕጾ ዳግማይ ዕጾ" }, isTi)}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Key Formats Inspector Tabs */}
      <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
        <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
          {t({ en: "Inspect Common Bitcoin Key Formats", ti: "ዝውቱራት ናይ ቢትኮይን ቁልፊ ቅርጽታት መርምር" }, isTi)}
        </h5>

        <div className="flex flex-wrap gap-2 mb-3">
          <button
            type="button"
            onClick={() => setActiveTab("address")}
            className={"rounded-lg px-3 py-1.5 text-xs font-semibold transition-all " + (
              activeTab === "address"
                ? "bg-cyan-500/20 text-cyan-200 border border-cyan-500/50"
                : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
            )}
          >
            {t({ en: "1. Public Address (On-Chain)", ti: "1. ህዝባዊ ኣድራሻ (ብሎክቸይን)" }, isTi)}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("private")}
            className={"rounded-lg px-3 py-1.5 text-xs font-semibold transition-all " + (
              activeTab === "private"
                ? "bg-amber-500/20 text-amber-200 border border-amber-500/50"
                : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
            )}
          >
            {t({ en: "2. Private Key (WIF)", ti: "2. ናይ ብሕቲ መፍትሕ (WIF)" }, isTi)}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("lightning")}
            className={"rounded-lg px-3 py-1.5 text-xs font-semibold transition-all " + (
              activeTab === "lightning"
                ? "bg-purple-500/20 text-purple-200 border border-purple-500/50"
                : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
            )}
          >
            {t({ en: "3. Lightning Invoice", ti: "3. ላይትኒንግ ፋክቱር" }, isTi)}
          </button>
        </div>

        {activeTab === "address" && (
          <div className="space-y-2 rounded-lg border border-cyan-500/20 bg-zinc-950 p-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-cyan-300">
                {t({ en: "Base58 / Native SegWit Address:", ti: "ናይ ቢትኮይን ህዝባዊ ኣድራሻ:" }, isTi)}
              </span>
              <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-[10px] text-cyan-200">
                {t({ en: "Public", ti: "ህዝባዊ" }, isTi)}
              </span>
            </div>
            <p className="font-mono text-zinc-300 break-all select-all bg-zinc-900 p-2 rounded border border-zinc-800">
              1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
            </p>
            <p className="text-[11px] text-zinc-400">
              {t(
                {
                  en: "This is what you give to clients, employers, or friends to receive payments. Anyone can send to it; no one can steal from it.",
                  ti: "ክፍሊት ክሰዱልካ ንዓማዊልካ ወይ ኣዕሩኽትኻ እትህቦም እዚ እዩ። ዝኾነ ሰብ ናብኡ ክሰድድ ይኽእል፤ ካብኡ ዝሰርቕ ግን የለን።",
                },
                isTi
              )}
            </p>
          </div>
        )}

        {activeTab === "private" && (
          <div className="space-y-2 rounded-lg border border-amber-500/20 bg-zinc-950 p-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-amber-300">
                {t({ en: "Wallet Import Format (WIF) Private Key:", ti: "ናይ ብሕቲ መፍትሕ (WIF):" }, isTi)}
              </span>
              <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300">
                {t({ en: "NEVER SHARE", ti: "ፈጺምካ ኣይትካፈል" }, isTi)}
              </span>
            </div>
            <p className="font-mono text-amber-200/90 break-all select-all bg-zinc-900 p-2 rounded border border-zinc-800">
              L5EZftvrYaSudiozVRzTqLcHLNDoVn7H5HSfM9BAN6tMJX8oTWz6
            </p>
            <p className="text-[11px] text-zinc-400">
              {t(
                {
                  en: "Whoever holds this private key can unilaterally drain the wallet. Keep offline, never screenshot, and protect your 24 words.",
                  ti: "ነዚ መፍትሕ ዝሓዘ ሰብ ብሓደ ወገን ነቲ ቦርሳ ክጽንቅቖ ይኽእል። ካብ መስመር ወጻኢ ሓልዎ፡ ስክሪን ሾት ኣይትውሰድ፡ ን24 ቃላትካ ድማ ሓሉ።",
                },
                isTi
              )}
            </p>
          </div>
        )}

        {activeTab === "lightning" && (
          <div className="space-y-2 rounded-lg border border-purple-500/20 bg-zinc-950 p-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-purple-300">
                {t({ en: "BOLT11 Lightning Payment Request:", ti: "ናይ ላይትኒንግ መርበብ ፋክቱር:" }, isTi)}
              </span>
              <span className="rounded bg-purple-500/20 px-2 py-0.5 text-[10px] text-purple-200">
                {t({ en: "Instant & Single-Use", ti: "ቅጽበታዊ ንሓንሳብ ጥራይ" }, isTi)}
              </span>
            </div>
            <p className="font-mono text-zinc-300 break-all select-all bg-zinc-900 p-2 rounded border border-zinc-800 text-[11px] max-h-20 overflow-y-auto">
              lnbc20u1p5cpmx0dqqpp5d5mzfqk3kjv46ujecwtkr0337gm7nlw43n69rlyd0uvlg8tx0sxqsp56wh3phhm0vkpxxtyhxt6u3fm0pfec5nvqy8qz4vp9y5lp0jz033s9qrsgqcqpjnp4q0plte0wjhr4t478uwp02wvl2gra39jamke83jfh8506kjd0dg0gyxqyz5vqrzjqt07ejxdllcugwyqydh5j3m3wgxlqew3ywmfgljfv0u99ssumtxuzqqqqqqqqqqqqgqqqqqqqqqqqqqqrcftdaunftydx463n9chlj6j3dd3hp570hz725nd773hmna2cq9q655djym8ph86wyvdqeta37p5lycaksk9xsfgs3rlnezwx7m8tfsqqq9a2mfy
            </p>
            <p className="text-[11px] text-zinc-400">
              {t(
                {
                  en: "Lightning invoices allow instant, sub-penny fees for everyday retail payments like coffee or airtime, settled in seconds.",
                  ti: "ላይትኒንግ ፋክቱራት ንመዓልታዊ ንኣሽቱ ክፍሊታት ከም ሻሂ ወይ ናይ ተሌፎን ካርድ ኣብ ውሽጢ ካልኢታት ብትሑት ክፍሊት ንኽትከፍል የኽእል።",
                },
                isTi
              )}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/* =========================================================================
   Module 2: 4-Step P2P Transaction Lifecycle (Section 6.2)
   ========================================================================= */

export function P2PTransactionPipeline({ isTi }: { isTi: boolean }) {
  const [activeStep, setActiveStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((s) => (s < 4 ? s + 1 : 1));
    }, 3500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const steps = [
    {
      num: 1,
      title: { en: "1. Create & Sign", ti: "1. ምፍጣርን ምፍራምን" },
      subtitle: { en: "Alice authorizes the spend", ti: "ኣሊስ ነቲ ወጻኢ ተፍቅዶ" },
      color: "border-cyan-500 bg-cyan-500/10 text-cyan-300",
    },
    {
      num: 2,
      title: { en: "2. Broadcast", ti: "2. ፈነወ ናብ መርበብ" },
      subtitle: { en: "Ripples into global mempool", ti: "ናብ መርበብ ቢትኮይን ይፍኖ" },
      color: "border-purple-500 bg-purple-500/10 text-purple-300",
    },
    {
      num: 3,
      title: { en: "3. Verify Signature", ti: "3. ምርግጋጽ ኖድስ" },
      subtitle: { en: "15,000+ nodes validate rules", ti: "ኣሽሓት ኖድስ የረጋግጻኦ" },
      color: "border-amber-500 bg-amber-500/10 text-amber-300",
    },
    {
      num: 4,
      title: { en: "4. Confirm in Block", ti: "4. ምጽዳቕ ብሎክ" },
      subtitle: { en: "Mined and irreversible", ti: "ብዕደና ይጸድቕ ቀዋሚ ይኸውን" },
      color: "border-emerald-500 bg-emerald-500/10 text-emerald-300",
    },
  ];

  return (
    <section className={panelClass} aria-label="4-Step P2P Transaction Lifecycle">
      {/* Header */}
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-400">
          {t(
            {
              en: "6.2 Practical Example: Transaction Lifecycle",
              ti: "6.2 ተግባራዊ ኣብነት: ዋሕዚ ትራንዛክሽን (Transaction Lifecycle)",
            },
            isTi
          )}
        </p>
        <h4 className="mt-1 text-lg font-bold text-zinc-100 sm:text-xl">
          {t(
            {
              en: "How 0.01 BTC Moves from Alice to Bob Across the Globe",
              ti: "0.01 ቢትኮይን ካብ ኣሊስ ናብ ቦብ ብኸመይ ይሰጋገር",
            },
            isTi
          )}
        </h4>
        <p className="mt-1 text-xs text-zinc-400">
          {t(
            {
              en: "Walk through the four critical phases every Bitcoin transaction passes through — with no banks or middlemen involved.",
              ti: "ነፍሲ ወከፍ ናይ ቢትኮይን ትራንዛክሽን ዝሓልፎም ኣርባዕተ ወሰንቲ መድረኻት ብተግባር ተዓዘብ።",
            },
            isTi
          )}
        </p>
      </div>

      {/* Step Progress Track */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 mb-6">
        {steps.map((s) => (
          <button
            key={s.num}
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setActiveStep(s.num);
            }}
            className={"rounded-xl border p-3 text-left transition-all " + (
              activeStep === s.num
                ? s.color + " shadow-md"
                : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono">STEP {s.num}</span>
              {activeStep > s.num ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              ) : activeStep === s.num ? (
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              ) : null}
            </div>
            <p className="mt-1 text-xs font-bold text-zinc-200">
              {t(s.title, isTi)}
            </p>
            <p className="text-[10px] text-zinc-400 truncate">
              {t(s.subtitle, isTi)}
            </p>
          </button>
        ))}
      </div>

      {/* Active Step Interactive Sandbox */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-6">
        {/* Step 1 Content */}
        {activeStep === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-300">
                <Key className="h-4 w-4" />
              </div>
              <div>
                <h5 className="font-bold text-sm text-zinc-100 sm:text-base">
                  {t({ en: "Phase 1: Transaction Creation & Cryptographic Signing", ti: "መድረኽ 1: ምፍጣር ትራንዛክሽንን ዲጂታላዊ ምፍራምን" }, isTi)}
                </h5>
                <p className="text-xs text-zinc-400">
                  {t({ en: "Alice's phone signs the message locally using ECDSA/Schnorr math", ti: "ስልኪ ኣሊስ ብናይ ብሕቲ መፍትሓ ነቲ ትራንዛክሽን ብሒሳብ ትፈርሞ" }, isTi)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 font-mono text-xs">
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                <span className="text-zinc-500 block text-[10px]">SENDER</span>
                <span className="text-cyan-300 font-bold">Alice (Wallet)</span>
                <span className="text-zinc-400 block mt-1">Balance: 0.05 BTC</span>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                <span className="text-zinc-500 block text-[10px]">RECIPIENT</span>
                <span className="text-amber-300 font-bold">Bob (bc1qbob...)</span>
                <span className="text-zinc-400 block mt-1">Amount: 0.01 BTC</span>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                <span className="text-zinc-500 block text-[10px]">MINER FEE</span>
                <span className="text-emerald-300 font-bold">0.00005 BTC</span>
                <span className="text-zinc-400 block mt-1">~5,000 sats</span>
              </div>
            </div>

            <div className="rounded-lg border border-cyan-500/30 bg-zinc-950 p-3 text-xs font-mono">
              <span className="text-cyan-400 font-semibold block text-[10px] mb-1">
                CRYPTOGRAPHIC DIGITAL SIGNATURE GENERATED:
              </span>
              <p className="text-zinc-300 break-all select-all text-[11px] bg-zinc-900/80 p-2 rounded">
                3045022100e4b85d0d19a4a71ef070c7e2f5b66d4f9b8782...5e8101
              </p>
              <p className="mt-2 text-[11px] text-zinc-400 font-sans">
                {t(
                  {
                    en: "This digital signature mathematically proves Alice owns the coins without ever revealing her private key to the public.",
                    ti: "እዚ ፌርማ ኣሊስ ናይቲ ገንዘብ ዋና ምዃና የረጋግጽ፡ እንተኾነ ግን ናይ ብሕቲ መፍትሓ ንማንም ሰብ ኣይገልጽን እዩ።",
                  },
                  isTi
                )}
              </p>
            </div>
          </div>
        )}

        {/* Step 2 Content */}
        {activeStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-300">
                <Globe2 className="h-4 w-4" />
              </div>
              <div>
                <h5 className="font-bold text-sm text-zinc-100 sm:text-base">
                  {t({ en: "Phase 2: Network Broadcast & Mempool Entry", ti: "መድረኽ 2: ፈነወ ናብ መርበብን ናብ ሜምፑል (Mempool) ምእታውን" }, isTi)}
                </h5>
                <p className="text-xs text-zinc-400">
                  {t({ en: "The signed packet announces to thousands of global peer nodes", ti: "እቲ ዝተፈረመ መልእኽቲ ናብ መላእ ዓለም ብቕጽበት ይፍኖ" }, isTi)}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-purple-500/30 bg-zinc-950 p-4">
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="rounded bg-cyan-500/20 px-2 py-1 text-cyan-300">Alice's Phone</span>
                  <span className="text-purple-400 animate-pulse">══════►</span>
                  <span className="rounded bg-purple-500/20 px-2 py-1 text-purple-300">Global Peer Nodes</span>
                  <span className="text-purple-400 animate-pulse">══════►</span>
                  <span className="rounded bg-amber-500/20 px-2 py-1 text-amber-300">Mempool Waiting Room</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full pt-2 text-xs">
                  <div className="rounded border border-zinc-800 bg-zinc-900 p-2.5">
                    <span className="text-[10px] text-zinc-500 block">BROADCAST SPEED</span>
                    <span className="text-purple-300 font-bold">&lt; 3 seconds</span>
                  </div>
                  <div className="rounded border border-zinc-800 bg-zinc-900 p-2.5">
                    <span className="text-[10px] text-zinc-500 block">NODES REACHED</span>
                    <span className="text-cyan-300 font-bold">15,000+ Worldwide</span>
                  </div>
                  <div className="rounded border border-zinc-800 bg-zinc-900 p-2.5">
                    <span className="text-[10px] text-zinc-500 block">MEMPOOL STATUS</span>
                    <span className="text-amber-300 font-bold">Unconfirmed / Pending</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              {t(
                {
                  en: "Think of the Mempool as the waiting room. The transaction is valid and known worldwide, waiting for miners to bundle it into the next block.",
                  ti: "ሜምፑል (Mempool) ከም ናይ ምጽባይ ክፍሊ እዩ። እቲ ትራንዛክሽን ቅኑዕ ምዃኑ ክፍለጥ ከሎ፡ ዕደናውያን ኣብ ቀጻሊ ብሎክ ክሳብ ዝዕሽግዎ ይጽበ።",
                },
                isTi
              )}
            </p>
          </div>
        )}

        {/* Step 3 Content */}
        {activeStep === 3 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300">
                <Server className="h-4 w-4" />
              </div>
              <div>
                <h5 className="font-bold text-sm text-zinc-100 sm:text-base">
                  {t({ en: "Phase 3: Independent Node Verification", ti: "መድረኽ 3: ናይ ኖድስ ነጻ ምርግጋጽ" }, isTi)}
                </h5>
                <p className="text-xs text-zinc-400">
                  {t({ en: "Every single node enforces consensus rules before forwarding", ti: "ነፍሲ ወከፍ ኖድ ቅድሚ ምቕባል ነቲ ናይ ቢትኮይን ሕግታት የረጋግጽ" }, isTi)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="rounded-xl border border-emerald-500/30 bg-zinc-950 p-3">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Signature Check</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  {t(
                    {
                      en: "Signature matches Alice's public key mathematically.",
                      ti: "እቲ ፌርማ ምስ ናይ ኣሊስ ህዝባዊ መፍትሕ ብሒሳብ ይገጥም።",
                    },
                    isTi
                  )}
                </p>
              </div>

              <div className="rounded-xl border border-emerald-500/30 bg-zinc-950 p-3">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>UTXO Balance Check</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  {t(
                    {
                      en: "Alice actually has the 0.01 BTC available in unspent outputs.",
                      ti: "ኣሊስ ብሓቂ እቲ 0.01 ቢትኮይን ከምዘለዋ ተረጋጊጹ።",
                    },
                    isTi
                  )}
                </p>
              </div>

              <div className="rounded-xl border border-emerald-500/30 bg-zinc-950 p-3">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>No Double-Spend</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  {t(
                    {
                      en: "These exact satoshis have not been spent anywhere else.",
                      ti: "እዞም ሳቶሺታት ኣብ ካልእ ቦታ ፈጺሞም ኣይወዓሉን።",
                    },
                    isTi
                  )}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-3 text-xs text-amber-200">
              <span className="font-semibold text-amber-300">
                {t({ en: "Don't Trust, Verify:", ti: "ኣይትእመን፡ ኣረጋግጽ:" }, isTi)}
              </span>{" "}
              {t(
                {
                  en: "Nodes don't trust Alice's app. They independently execute the cryptographic math to verify her signature without ever needing her private key.",
                  ti: "ኖድስ ንኣሊስ ብዓይኒ ዕሙት ኣይኣምንዋን። ነቲ ናይ ብሕቲ መፍትሓ ከየድለዮም፡ ነቲ ፌርማ ብናጻ ይምርምርዎን የረጋግጽዎን።",
                },
                isTi
              )}
            </div>
          </div>
        )}

        {/* Step 4 Content */}
        {activeStep === 4 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <h5 className="font-bold text-sm text-zinc-100 sm:text-base">
                  {t({ en: "Phase 4: Block Mining & Immutable Finality", ti: "መድረኽ 4: ብዕደና ምጽዳቕን ቀዋሚ ምዃንን" }, isTi)}
                </h5>
                <p className="text-xs text-zinc-400">
                  {t({ en: "Bundled into Block #840,123 and sealed permanently onto the blockchain", ti: "ኣብ ብሎክ #840,123 ተዓሺጉ ንሓዋሩ ኣብቲ ብሎክቸይን ተመዝጊቡ" }, isTi)}
                </p>
              </div>
            </div>

            {/* Block Card */}
            <div className="rounded-xl border border-emerald-500/40 bg-zinc-950 p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-zinc-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
                    ON-CHAIN BLOCK #840,123
                  </span>
                  <p className="text-xs font-mono text-zinc-300">
                    Hash: 00000000000000000001a7b...c9e2
                  </p>
                </div>
                <span className="rounded-full bg-emerald-500/20 border border-emerald-400/50 px-3 py-1 text-xs font-bold text-emerald-300 shadow">
                  1 {t({ en: "Confirmation (~10 min)", ti: "ምርግጋጽ (~10 ደቒቕ)" }, isTi)}
                </span>
              </div>

              {/* Updated Balances */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="rounded-lg bg-zinc-900/80 p-3 border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">ALICE'S NEW BALANCE</span>
                  <p className="text-zinc-200 font-bold text-sm">0.03995 BTC</p>
                  <span className="text-[10px] text-zinc-400">(-0.01 BTC sent, -fee)</span>
                </div>
                <div className="rounded-lg bg-emerald-950/30 p-3 border border-emerald-500/30">
                  <span className="text-emerald-400 block text-[10px] font-bold">BOB'S NEW BALANCE</span>
                  <p className="text-emerald-200 font-bold text-sm">+0.01000 BTC</p>
                  <span className="text-[10px] text-emerald-400/80">Available to spend</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-3 text-xs text-emerald-200">
              <span className="font-semibold text-emerald-300">
                {t({ en: "Mathematically Irreversible:", ti: "ንድሕሪት ዘይምለስ ሒሳባዊ ርግጸኝነት:" }, isTi)}
              </span>{" "}
              {t(
                {
                  en: "Once sealed into the blockchain, this transaction can never be reversed, charged back, or double-spent. Bob now has sovereign ownership of these coins.",
                  ti: "ሓንሳብ ኣብቲ ብሎክቸይን ምስ ተዓሸገ፡ እዚ ትራንዛክሽን ንድሕሪት ክምለስ ወይ ክስረዝ ፈጺሙ ኣይክእልን። ቦብ ናይቲ ገንዘብ ናጻ ዋና ኮይኑ።",
                },
                isTi
              )}
            </div>
          </div>
        )}

        {/* Step Navigation Controls */}
        <div className="mt-5 flex items-center justify-between border-t border-zinc-800 pt-3">
          <button
            type="button"
            disabled={activeStep === 1}
            onClick={() => {
              setIsPlaying(false);
              setActiveStep((s) => Math.max(1, s - 1));
            }}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300 hover:border-zinc-500 disabled:opacity-40"
          >
            ← {t({ en: "Previous Phase", ti: "ናይ ቅድሚ ሕጂ መድረኽ" }, isTi)}
          </button>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={"rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all " + (
              isPlaying
                ? "border-amber-500/50 bg-amber-500/20 text-amber-200"
                : "border-cyan-500/50 bg-cyan-500/20 text-cyan-200 hover:bg-cyan-500/30"
            )}
          >
            {isPlaying
              ? t({ en: "⏸ Pause Auto-Play", ti: "⏸ ኣዕርፍ" }, isTi)
              : t({ en: "▶ Auto-Play All 4 Phases", ti: "▶ ንኹሎም 4 መድረኻት ኣርኢ" }, isTi)}
          </button>

          <button
            type="button"
            disabled={activeStep === 4}
            onClick={() => {
              setIsPlaying(false);
              setActiveStep((s) => Math.min(4, s + 1));
            }}
            className="rounded-lg border border-cyan-500/60 bg-cyan-500/20 px-3 py-1.5 text-xs font-semibold text-cyan-200 hover:bg-cyan-500/30 disabled:opacity-40"
          >
            {t({ en: "Next Phase", ti: "ቀጻሊ መድረኽ" }, isTi)} →
          </button>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   Main Chapter 6 Interactive Lesson Export
   ========================================================================= */

export type Chapter6Module = "mailbox_keys" | "p2p_pipeline";

export function Chapter6InteractiveLesson({
  module,
  isTi,
}: {
  module: Chapter6Module;
  isTi: boolean;
}) {
  switch (module) {
    case "mailbox_keys":
      return <MailboxKeypairSimulator isTi={isTi} />;
    case "p2p_pipeline":
      return <P2PTransactionPipeline isTi={isTi} />;
    default:
      return null;
  }
}
