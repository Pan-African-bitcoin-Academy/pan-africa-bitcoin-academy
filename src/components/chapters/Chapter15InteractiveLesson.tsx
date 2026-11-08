"use client";

import { useState } from "react";
import {
  Zap,
  Layers,
  ArrowRight,
  ArrowLeftRight,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  Key,
  Globe2,
  Coins,
  RefreshCw,
  ShoppingBag,
  Store,
  Users,
  Repeat,
  Sparkles,
  HelpCircle,
  Eye,
  EyeOff,
  ExternalLink,
  Info,
  Clock,
  Send,
  Coffee,
} from "lucide-react";

/* ─────────── Shared helpers ─────────── */

type Localized = { en: string; ti: string };
const t = (v: Localized, isTi: boolean) => (isTi ? v.ti : v.en);

const panelClass =
  "rounded-2xl border border-zinc-800 bg-zinc-950/90 p-4 shadow-xl sm:p-6 my-6";

interface ModuleProps {
  isTi: boolean;
}

/* =========================================================================
   Module 1: Lightning Channel Flow & Liquidity Abacus (Section 15.0)
   Theme: "Lightning Basics: Off-Chain Channels & Liquidity Balance"
   ========================================================================= */

function LightningChannelFlow({ isTi }: ModuleProps) {
  // Channel capacity = 1,000,000 sats
  const channelCapacity = 1000000;
  // Alice's balance (Outbound capacity for Alice, Inbound for Bob)
  const [aliceBalance, setAliceBalance] = useState<number>(750000);
  const bobBalance = channelCapacity - aliceBalance;

  const [paymentHistory, setPaymentHistory] = useState<
    { id: number; from: string; to: string; amount: number; memo: string }[]
  >([
    { id: 1, from: "Alice", to: "Bob", amount: 250000, memo: "Channel Opened on L1" },
  ]);

  const handlePayBob = (sats: number, memo: string) => {
    if (aliceBalance < sats) return;
    setAliceBalance((prev) => prev - sats);
    setPaymentHistory((prev) => [
      { id: Date.now(), from: "Alice", to: "Bob", amount: sats, memo },
      ...prev.slice(0, 4),
    ]);
  };

  const handlePayAlice = (sats: number, memo: string) => {
    if (bobBalance < sats) return;
    setAliceBalance((prev) => prev + sats);
    setPaymentHistory((prev) => [
      { id: Date.now(), from: "Bob", to: "Alice", amount: sats, memo },
      ...prev.slice(0, 4),
    ]);
  };

  const handleReset = () => {
    setAliceBalance(750000);
    setPaymentHistory([
      { id: 1, from: "Alice", to: "Bob", amount: 250000, memo: "Channel Reset" },
    ]);
  };

  const alicePercent = (aliceBalance / channelCapacity) * 100;

  return (
    <div className={panelClass}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <Zap className="h-5 w-5 fill-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
                {t({ en: "Section 15.0 Interactive", ti: "ክፍሊ 15.0 መስተጋብራዊ" }, isTi)}
              </span>
              <span className="text-xs text-zinc-400">
                {t({ en: "Payment Channel Mechanics", ti: "ኣሰራርሓ ቻነል ክፍሊት" }, isTi)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100">
              {t(
                {
                  en: "Lightning Channel Abacus: Instant Off-Chain Payments & Liquidity",
                  ti: "ናይ ላይትኒንግ ቻነል ኣባከስ፦ ቅጽበታዊ ካብ-ሰንሰለት ወጻኢ ክፍሊትን ፈሳሲ ዓቕምን",
                },
                isTi
              )}
            </h3>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-400 hover:text-white transition cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          {t({ en: "Reset Channel", ti: "ቻነል ምለስ" }, isTi)}
        </button>
      </div>

      <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
        {t(
          {
            en: "A Lightning channel is like a 2-person cryptographic abacus locked by a 2-of-2 multisig on the Bitcoin blockchain. Sliding sats back and forth happens instantly off-chain for negligible fees (< 1 sat), without writing to the blockchain until the channel closes.",
            ti: "ናይ ላይትኒንግ ቻነል ኣብ መንጎ 2 ሰባት ከም ዝግበር ክሪፕቶግራፊካዊ ኣባከስ ኮይኑ፡ ኣብ ቢትኮይን ብሎክቸይን ብ 2-of-2 ብዙሕ-ፊርማ ይዕጾ። ኣብ ውሽጢ እቲ ቻነል ሳትስ ምልውዋጥ ካብ ሰንሰለት ወጻኢ ብቕጽበትን ብዘይ ክፍሊትን (< 1 ሳትስ) ይፍጸም፤ እቲ ቻነል ክሳብ ዝዕጾ ድማ ናብ ብሎክቸይን ዝጸሓፍ ነገር የለን።",
          },
          isTi
        )}
      </p>

      {/* Interactive Abacus Visualizer */}
      <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 sm:p-6 space-y-6">
        {/* Total Channel Capacity Bar */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-amber-400 inline-block" />
              <span className="font-bold text-white">Alice (You)</span>
              <span className="text-amber-300 font-bold">{aliceBalance.toLocaleString()} sats</span>
            </div>
            <div className="text-zinc-500 text-[11px]">
              Channel Capacity: {channelCapacity.toLocaleString()} sats (~$650)
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sky-300 font-bold">{bobBalance.toLocaleString()} sats</span>
              <span className="font-bold text-white">Bob (Merchant)</span>
              <span className="h-3 w-3 rounded-full bg-sky-400 inline-block" />
            </div>
          </div>

          {/* Abacus Slider Bar */}
          <div className="h-6 w-full rounded-full bg-zinc-900 border border-zinc-700/80 p-1 relative overflow-hidden flex items-center">
            <div
              className="h-full rounded-l-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-300 relative flex items-center justify-end pr-2"
              style={{ width: `${alicePercent}%` }}
            >
              <span className="text-[10px] font-mono font-bold text-black drop-shadow">
                {alicePercent > 15 ? `${aliceBalance.toLocaleString()} sats` : ""}
              </span>
            </div>
            <div
              className="h-full rounded-r-full bg-gradient-to-r from-sky-400 to-sky-600 transition-all duration-300 relative flex items-center pl-2"
              style={{ width: `${100 - alicePercent}%` }}
            >
              <span className="text-[10px] font-mono font-bold text-black drop-shadow">
                {100 - alicePercent > 15 ? `${bobBalance.toLocaleString()} sats` : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Capacity Breakdown: Outbound vs Inbound */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5 space-y-1">
            <span className="text-amber-400 font-bold block uppercase text-[10px] tracking-wider">
              {t({ en: "Alice's Outbound Capacity (Can Send)", ti: "ናይ ኣሊስ ናይ ምልኣኽ ዓቕሚ (Outbound)" }, isTi)}
            </span>
            <div className="text-lg font-bold text-white">{aliceBalance.toLocaleString()} sats</div>
            <p className="text-[11px] text-zinc-400">
              {t({ en: "Maximum payment Alice can send right now without routing.", ti: "ኣሊስ ሕጂ ብቕጽበት ክትከፍሎ እትኽእል ዝለዓለ መጠን።" }, isTi)}
            </p>
          </div>

          <div className="rounded-xl border border-sky-500/30 bg-sky-950/20 p-3.5 space-y-1">
            <span className="text-sky-400 font-bold block uppercase text-[10px] tracking-wider">
              {t({ en: "Alice's Inbound Capacity (Can Receive)", ti: "ናይ ኣሊስ ናይ ምቕባል ዓቕሚ (Inbound)" }, isTi)}
            </span>
            <div className="text-lg font-bold text-white">{bobBalance.toLocaleString()} sats</div>
            <p className="text-[11px] text-zinc-400">
              {t({ en: "Bob's balance allows Alice to receive incoming payments.", ti: "ናይ ቦብ ሚዛን ንኣሊስ ካብ ካልኦት ንኽትቅበል ዕድል ይህባ።" }, isTi)}
            </p>
          </div>
        </div>

        {/* Instant Payment Actions */}
        <div className="space-y-3 pt-2 border-t border-zinc-800">
          <span className="text-xs font-bold text-zinc-300 block uppercase tracking-wider">
            {t({ en: "Simulate Real Instant Micro-Payments:", ti: "ናይ ሓቂ ቅጽበታዊ ንኣሽቱ ክፍሊታት ፈትን፦" }, isTi)}
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => handlePayBob(5000, "Espresso Coffee")}
              disabled={aliceBalance < 5000}
              className="rounded-xl border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 p-2.5 text-left text-xs transition cursor-pointer disabled:opacity-40"
            >
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Coffee className="h-3.5 w-3.5" />
                <span>-5,000 sats</span>
              </div>
              <span className="text-[11px] text-zinc-400 block mt-0.5">Espresso (~$3.25)</span>
            </button>

            <button
              onClick={() => handlePayBob(25000, "Supermarket Groceries")}
              disabled={aliceBalance < 25000}
              className="rounded-xl border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 p-2.5 text-left text-xs transition cursor-pointer disabled:opacity-40"
            >
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>-25,000 sats</span>
              </div>
              <span className="text-[11px] text-zinc-400 block mt-0.5">Groceries (~$16)</span>
            </button>

            <button
              onClick={() => handlePayAlice(50000, "Freelance Gig Payout")}
              disabled={bobBalance < 50000}
              className="rounded-xl border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 p-2.5 text-left text-xs transition cursor-pointer disabled:opacity-40"
            >
              <div className="flex items-center gap-1.5 text-sky-400 font-bold">
                <Coins className="h-3.5 w-3.5" />
                <span>+50,000 sats</span>
              </div>
              <span className="text-[11px] text-zinc-400 block mt-0.5">Receive Salary (~$32)</span>
            </button>

            <button
              onClick={() => handlePayAlice(10000, "Refund from Merchant")}
              disabled={bobBalance < 10000}
              className="rounded-xl border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 p-2.5 text-left text-xs transition cursor-pointer disabled:opacity-40"
            >
              <div className="flex items-center gap-1.5 text-sky-400 font-bold">
                <ArrowLeftRight className="h-3.5 w-3.5" />
                <span>+10,000 sats</span>
              </div>
              <span className="text-[11px] text-zinc-400 block mt-0.5">Customer Refund</span>
            </button>
          </div>
        </div>

        {/* Recent Off-Chain Payment Trail */}
        <div className="rounded-xl bg-black/50 p-3 border border-zinc-800 space-y-1.5 font-mono text-xs">
          <div className="flex justify-between text-[10px] text-zinc-500 uppercase font-semibold">
            <span>{t({ en: "Off-Chain Payment Log (Zero Mempool Fees):", ti: "መዝገብ ክፍሊት (ካብ ብሎክቸይን ወጻኢ)፦" }, isTi)}</span>
            <span className="text-emerald-400 font-bold">Settlement: Instant (&lt; 0.5s)</span>
          </div>
          {paymentHistory.map((item) => (
            <div key={item.id} className="flex justify-between items-center text-zinc-300 text-[11px]">
              <span>
                {item.from === "Alice" ? "Alice → Bob" : "Bob → Alice"}:{" "}
                <span className="text-zinc-400">{item.memo}</span>
              </span>
              <span className={item.from === "Alice" ? "text-amber-400 font-bold" : "text-sky-400 font-bold"}>
                {item.from === "Alice" ? "-" : "+"}{item.amount.toLocaleString()} sats
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   Module 2: Custodial vs Non-Custodial Matrix (Section 15.1)
   Theme: "Receive & Spend on Lightning: Sovereignty vs Convenience"
   ========================================================================= */

function CustodialVsNonCustodial({ isTi }: ModuleProps) {
  const [selectedWalletType, setSelectedWalletType] = useState<"custodial" | "non_custodial">("non_custodial");

  return (
    <div className={panelClass}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
            <Key className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-400">
                {t({ en: "Section 15.1 Representation", ti: "ክፍሊ 15.1 ምርኢት" }, isTi)}
              </span>
              <span className="text-xs text-zinc-400">
                {t({ en: "Architecture Comparison", ti: "ምንጽጻር ኣሰራርሓ" }, isTi)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100">
              {t(
                {
                  en: "Custodial vs Non-Custodial Lightning: The Trade-Off Matrix",
                  ti: "ካስቶድያል ኣንጻር ዘይካስቶድያል ላይትኒንግ፦ ናይ ምትሕውዋስ መምረጺ",
                },
                isTi
              )}
            </h3>
          </div>
        </div>

        {/* Wallet Type Switch */}
        <div className="flex rounded-lg border border-zinc-800 bg-zinc-900/60 p-1">
          <button
            onClick={() => setSelectedWalletType("custodial")}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition cursor-pointer ${
              selectedWalletType === "custodial"
                ? "bg-amber-500 text-black shadow-sm font-bold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {t({ en: "Custodial (e.g. Wallet of Satoshi)", ti: "ካስቶድያል" }, isTi)}
          </button>
          <button
            onClick={() => setSelectedWalletType("non_custodial")}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition cursor-pointer ${
              selectedWalletType === "non_custodial"
                ? "bg-purple-500 text-white shadow-sm font-bold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {t({ en: "Non-Custodial (e.g. Phoenix, Zeus)", ti: "ዘይካስቶድያል" }, isTi)}
          </button>
        </div>
      </div>

      <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
        {t(
          {
            en: "Using Lightning requires a conscious trade-off between convenience and self-sovereignty. Custodial wallets feel like Web2 banking apps, while self-custodial wallets put you in charge of your own private keys and payment channels.",
            ti: "ላይትኒንግ ምጥቃም ኣብ መንጎ ምችውነትን ምሉእ ልኡላውነትን ንጹር ምርጫ ይሓትት። ካስቶድያል ቦርሳታት ከም ባንኪ መተግበሪታት ቀለልቲ ክኾኑ እንከለዉ፡ ዘይካስቶድያል ግን ናይ ገዛእ ርእስኻ መፍትሕን ቻነላትን ባዕልኻ ክትቆጻጸር የኽእሉኻ።",
          },
          isTi
        )}
      </p>

      {/* Side-by-Side Comparison Cards */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Custodial Card */}
        <div className={`rounded-xl border p-4 sm:p-5 flex flex-col justify-between transition-all ${
          selectedWalletType === "custodial"
            ? "border-amber-500/50 bg-amber-950/20 ring-1 ring-amber-500/40"
            : "border-zinc-800 bg-zinc-950/60 opacity-60"
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                {t({ en: "Custodial Lightning", ti: "ካስቶድያል ላይትኒንግ" }, isTi)}
              </span>
              <span className="text-[10px] font-mono text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded">
                Third-Party Custody
              </span>
            </div>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Zero setup: install and receive sats immediately.</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>No on-chain channel opening fees or liquidity management.</span>
              </div>
              <div className="flex items-center gap-2 text-red-400">
                <XCircle className="h-4 w-4 shrink-0" />
                <span><strong>Not your keys, not your coins:</strong> provider holds funds.</span>
              </div>
              <div className="flex items-center gap-2 text-red-400">
                <XCircle className="h-4 w-4 shrink-0" />
                <span>Vulnerable to account freezes, regulatory bans, or insolvency.</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] text-zinc-400">
            {t({ en: "Best used for: Coffee money, pocket change, learning (< $100).", ti: "ዝምረጽ ን፦ ናይ ቡን ወጻኢታት፣ መመሃሪ፣ ንኣሽቱ ሳትስ (< $100)።" }, isTi)}
          </div>
        </div>

        {/* Non-Custodial Card */}
        <div className={`rounded-xl border p-4 sm:p-5 flex flex-col justify-between transition-all ${
          selectedWalletType === "non_custodial"
            ? "border-purple-500/50 bg-purple-950/20 ring-1 ring-purple-500/40"
            : "border-zinc-800 bg-zinc-950/60 opacity-60"
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                {t({ en: "Self-Custodial Lightning", ti: "ዘይካስቶድያል (ልኡላዊ) ላይትኒንግ" }, isTi)}
              </span>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded">
                100% Sovereign (Your Seed)
              </span>
            </div>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>You hold 12/24 seed words; no one can freeze your funds.</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Full peer-to-peer privacy: payments route via Tor/onion routing.</span>
              </div>
              <div className="flex items-center gap-2 text-amber-400">
                <Info className="h-4 w-4 shrink-0" />
                <span>Requires channel opening on-chain fee (~1,000–3,000 sats).</span>
              </div>
              <div className="flex items-center gap-2 text-amber-400">
                <Info className="h-4 w-4 shrink-0" />
                <span>Must manage channel backups & keep node occasionally online.</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] text-zinc-400">
            {t({ en: "Best used for: True sovereignty, merchant acceptance, long-term sats.", ti: "ዝምረጽ ን፦ ምሉእ ልኡላውነት፣ ንግዲ፣ ናይ ነዊሕ ግዜ ሳትስ።" }, isTi)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   Module 3: Sidechains & 2-Way Peg Federated Trust (Section 15.2)
   Theme: "Sidechains (e.g. Liquid Network) & Federated Peg Mechanics"
   ========================================================================= */

function SidechainFederationPeg({ isTi }: ModuleProps) {
  const [bridgeStep, setBridgeStep] = useState<number>(1); // 1: Peg-in, 2: Sidechain Speed/Privacy, 3: Peg-out
  const [showConfidential, setShowConfidential] = useState<boolean>(true);

  return (
    <div className={panelClass}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-sky-500/10 px-2.5 py-0.5 text-xs font-semibold text-sky-400">
                {t({ en: "Section 15.2 Interactive", ti: "ክፍሊ 15.2 መስተጋብራዊ" }, isTi)}
              </span>
              <span className="text-xs text-zinc-400">
                {t({ en: "Sidechains & 2-Way Peg", ti: "ጎናዊ ሰንሰለታትን 2-ኣንፈት ፔግን" }, isTi)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100">
              {t(
                {
                  en: "Sidechains (Liquid Network): 2-Way Peg Bridge & Federated Trust",
                  ti: "ጎናዊ ሰንሰለታት (ሊኲድ ኔትወርክ)፦ 2-ኣንፈት ፔግን ናይ ፈደረሽን እምነትን",
                },
                isTi
              )}
            </h3>
          </div>
        </div>

        {/* Step Selector */}
        <div className="flex rounded-lg border border-zinc-800 bg-zinc-900/60 p-1">
          {[1, 2, 3].map((step) => (
            <button
              key={step}
              onClick={() => setBridgeStep(step)}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                bridgeStep === step
                  ? "bg-sky-500 text-black shadow-sm font-bold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {step === 1 ? "1. Peg-In (L1 → L2)" : step === 2 ? "2. Confidential L-BTC" : "3. Peg-Out (L2 → L1)"}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
        {t(
          {
            en: "A sidechain is an independent blockchain pegged 1:1 to Bitcoin. The Liquid Network uses a federation of 15+ independent exchanges and infrastructure providers to lock BTC on Layer 1 and issue Liquid Bitcoin (L-BTC) with 1-minute blocks and confidential amounts.",
            ti: "ሳይድቸይን (ጎናዊ ሰንሰለት) ምስ ቢትኮይን 1:1 ዝተኣሳሰረ ናጻ ብሎክቸይን እዩ። ሊኲድ ኔትወርክ ብ 15+ ዝኾኑ ናጻ ትካላት ዝቖመ ፈደረሽን ተጠቒሙ፡ ቢትኮይን ኣብ ብርኪ 1 ብምዕጻው፡ ናይ 1-ደቒቕ ብሎክን ምስጢራዊ ትራንዛክሽንን ዘለዎ ሊኲድ ቢትኮይን (L-BTC) የውጽእ።",
          },
          isTi
        )}
      </p>

      {/* Visual Bridge Pipeline */}
      <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 sm:p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Box 1: Layer 1 Bitcoin */}
          <div className={`rounded-xl border p-4 transition-all ${
            bridgeStep === 1
              ? "border-amber-500 bg-amber-950/20 shadow-md shadow-amber-500/10"
              : "border-zinc-800 bg-zinc-900/40 opacity-70"
          }`}>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
              Step 1: Layer 1 Lock (Peg-In)
            </span>
            <div className="mt-2 text-xs font-mono text-zinc-300 space-y-1.5">
              <div>Send 1.0 BTC to Federation 11-of-15 multisig address.</div>
              <div className="text-[10px] text-zinc-500">Wait 102 Bitcoin confirmations (~17 hours for deep finality).</div>
            </div>
          </div>

          {/* Box 2: The Federation Multi-Sig Bridge */}
          <div className={`rounded-xl border p-4 transition-all ${
            bridgeStep === 2
              ? "border-sky-500 bg-sky-950/20 shadow-md shadow-sky-500/10"
              : "border-zinc-800 bg-zinc-900/40 opacity-70"
          }`}>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 block">
              Step 2: Liquid Sidechain Block
            </span>
            <div className="mt-2 text-xs font-mono text-zinc-300 space-y-1.5">
              <div className="text-white font-bold">1:1 L-BTC Minted on Liquid</div>
              <div className="text-[10px] text-emerald-400">⚡ 1-minute block confirmation</div>
              <div className="text-[10px] text-sky-300">🔒 Confidential Transactions enabled</div>
            </div>
          </div>

          {/* Box 3: Peg-Out (Return to L1) */}
          <div className={`rounded-xl border p-4 transition-all ${
            bridgeStep === 3
              ? "border-purple-500 bg-purple-950/20 shadow-md shadow-purple-500/10"
              : "border-zinc-800 bg-zinc-900/40 opacity-70"
          }`}>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 block">
              Step 3: Peg-Out (L2 → L1)
            </span>
            <div className="mt-2 text-xs font-mono text-zinc-300 space-y-1.5">
              <div>Burn L-BTC on Liquid sidechain.</div>
              <div className="text-[10px] text-zinc-400">Federation releases original 1.0 BTC back to your on-chain Bitcoin address.</div>
            </div>
          </div>
        </div>

        {/* Confidential Transactions Feature Demo */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Lock className="h-3.5 w-3.5 text-sky-400" />
              {t({ en: "Liquid Feature: Confidential Transactions (Pedersen Commitments)", ti: "ናይ ሊኲድ ፍሉይ ባህሪ፦ ምስጢራዊ ትራንዛክሽን" }, isTi)}
            </span>
            <button
              onClick={() => setShowConfidential(!showConfidential)}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs text-zinc-300 hover:text-white cursor-pointer"
            >
              {showConfidential ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              {showConfidential ? t({ en: "Reveal Ledger Values", ti: "ዋጋታት ግለጽ" }, isTi) : t({ en: "Hide Values (Confidential)", ti: "ዋጋታት ሓብእ" }, isTi)}
            </button>
          </div>

          <div className="rounded-lg bg-black/60 p-3 font-mono text-xs border border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <span className="text-[10px] text-zinc-500 block">Sender → Receiver:</span>
              <span className="text-zinc-300">User_A → Exchange_B</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 block">Transferred Amount:</span>
              <span className={showConfidential ? "text-sky-300 font-bold" : "text-amber-400 font-bold"}>
                {showConfidential ? "●●●●●●● (Hidden by Range Proof)" : "5.42000000 L-BTC"}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 block">Asset Type:</span>
              <span className={showConfidential ? "text-sky-300 font-bold" : "text-zinc-300 font-bold"}>
                {showConfidential ? "●●●●●●● (Blinded Asset ID)" : "Bitcoin (0x6f07a...)"}
              </span>
            </div>
          </div>
        </div>

        {/* The Federated Trust Trade-Off Alert */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5 text-xs text-zinc-300 flex items-start gap-2.5">
          <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-amber-300">
              {t({ en: "Federated Trust Trade-off: ", ti: "ናይ ፈደረሽን እምነት ምትሕውዋስ፦ " }, isTi)}
            </strong>
            {t(
              {
                en: "Unlike Bitcoin L1 where mathematical Proof of Work enforces absolute consensus, Liquid relies on an 11-of-15 federation of companies. If 11 functionaries collude or face government coercion, they could freeze the 2-way peg. Use sidechains for trading and privacy, not long-term cold storage.",
                ti: "ካብቲ ብሒሳባዊ መርትዖ ስራሕ ዝሕሎ ቀዳማይ ብርኪ ቢትኮይን ብምፍላይ፡ ሊኲድ ኣብ 11 ካብ 15 ዝኾኑ ናይ ኩባንያታት ፈደረሽን ይምርኮስ። 11 ትካላት ተሰማሚዖም እንተዓጽዮምዎ፡ ነቲ ፔግ ክዓጽውዎ ይኽእሉ እዮም። ስለዚ ሳይድቸይን ንንግድን ንምስጢራውነትን እምበር ንነዊሕ ግዜ መቐመጢ ኣይኮነን።",
              },
              isTi
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   Module 4: Circular Economies Running on Sats (Section 15.3)
   Theme: "Circular Economies: The Zero-Leakage Local Loop"
   ========================================================================= */

function CircularEconomyExplorer({ isTi }: ModuleProps) {
  const [circulationHops, setCirculationHops] = useState<number>(5);
  const initialValue = 100; // $100 starting community capital

  // Traditional banking loses ~3% per hop (interchange fee + card processing fees)
  const traditionalRetained = Number((initialValue * Math.pow(0.97, circulationHops)).toFixed(2));
  const traditionalFeesLost = Number((initialValue - traditionalRetained).toFixed(2));

  // Lightning fee ~0.001% (fractions of a cent per hop)
  const lightningRetained = Number((initialValue * Math.pow(0.9999, circulationHops)).toFixed(2));
  const lightningFeesLost = Number((initialValue - lightningRetained).toFixed(2));

  return (
    <div className={panelClass}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <Repeat className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                {t({ en: "Section 15.3 Representation", ti: "ክፍሊ 15.3 ምርኢት" }, isTi)}
              </span>
              <span className="text-xs text-zinc-400">
                {t({ en: "Local Loop & Zero-Leakage", ti: "ውሽጣዊ ዓንኬልን ዘይባክን ሃብትን" }, isTi)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100">
              {t(
                {
                  en: "Circular Economies: The Self-Sustaining Sats Circuit",
                  ti: "ዓንኬላዊ ቁጠባታት፦ ብሳትስ ዝሰርሕ ርእሱ ዝኸኣለ ናይ ውሽጢ ዓዲ ዕዳጋ",
                },
                isTi
              )}
            </h3>
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
        {t(
          {
            en: "In a circular economy, individuals and merchants earn, spend, and settle entirely in satoshis without converting back into fiat currency. By keeping money circulating locally on Lightning, a community stops leaking transaction fees to external banks and avoids fiat currency depreciation.",
            ti: "ኣብ ዓንኬላዊ ቁጠባ፡ ውልቀሰባትን ነጋዶን ናብ ፊያት ባጤራ ከይቀየሩ ምሉእ ብምሉእ ብሳትስ ይሰርሑን ይሸጡን። ገንዘብ ብላይትኒንግ ኣቢሉ ኣብ ውሽጢ ዓዲ ጥራይ ክዘውር ብምግባር፡ እቲ ማሕበረሰብ ናብ ደገ ባንክታት ዝኸይድ ክፍሊታት የቋርጽ፡ ካብ ዝቕባበ ድማ ይድሕን።",
          },
          isTi
        )}
      </p>

      {/* 4-Stage Circulation Circuit Diagram */}
      <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 sm:p-6 space-y-5">
        <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          <span>{t({ en: "The 4-Stage Closed Loop of Sats:", ti: "እቲ 4-ደረጃታት ዘለዎ ዓጹው ናይ ሳትስ ዓንኬል፦" }, isTi)}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Stage 1 */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
                1
              </span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase font-semibold">Earn</span>
            </div>
            <div className="text-xs font-bold text-white">
              {t({ en: "Worker / Earner", ti: "ሰራሕተኛ / ኣፍራዪ" }, isTi)}
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              {t(
                {
                  en: "Receives satoshis for daily labor, services, or freelance work directly via Lightning.",
                  ti: "ንዝሰርሖ ስራሕ ወይ ኣገልግሎት ክፍሊቱ ብቐጥታ ብሳትስ ብላይትኒንግ ይቕበል።",
                },
                isTi
              )}
            </p>
          </div>

          {/* Stage 2 */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
                2
              </span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase font-semibold">Spend</span>
            </div>
            <div className="text-xs font-bold text-white">
              {t({ en: "Local Grocer / Retailer", ti: "ናይ ከባቢ ድኳን / ነጋዳይ" }, isTi)}
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              {t(
                {
                  en: "Accepts sats instantly for food and goods with zero terminal rentals and 0% card interchange fees.",
                  ti: "ንመግቢን ኣቑሑትን ሳትስ ብቕጽበት ይቕበል፤ ናይ ካርድ ክፍሊት ወይ ናይ ባንኪ ታክስ የለን።",
                },
                isTi
              )}
            </p>
          </div>

          {/* Stage 3 */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
                3
              </span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase font-semibold">Supply</span>
            </div>
            <div className="text-xs font-bold text-white">
              {t({ en: "Local Farmer / Wholesaler", ti: "ናይ ከባቢ ኣከፋፋሊ / ሓረስታይ" }, isTi)}
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              {t(
                {
                  en: "Grocer restocks inventory using the exact same sats. No conversion to fiat, eliminating exchange slippage.",
                  ti: "እቲ ነጋዳይ ብዘይ ምልዋጥ ብእተን ዝተቐበለን ሳትስ ተጠቒሙ ካብ ሓረስታይ ተወሳኺ ኣቑሑት ይዕድግ።",
                },
                isTi
              )}
            </p>
          </div>

          {/* Stage 4 */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
                4
              </span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase font-semibold">Re-invest</span>
            </div>
            <div className="text-xs font-bold text-white">
              {t({ en: "Maintenance & Wages", ti: "ክፍሊት ሰራሕተኛን ጽገናን" }, isTi)}
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              {t(
                {
                  en: "Wholesaler pays transport and equipment technicians in sats, re-entering the pockets of local workers.",
                  ti: "እቲ ኣከፋፋሊ ንመጓዓዝያን ጽገናን ብሳትስ ይኸፍል፡ እቲ ገንዘብ ድማ ተመሊሱ ናብ ሰራሕተኛታት ይኣቱ።",
                },
                isTi
              )}
            </p>
          </div>
        </div>

        {/* Wealth Retention Comparison Slider */}
        <div className="mt-4 pt-4 border-t border-zinc-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-zinc-200 uppercase tracking-wider">
              {t({ en: "Simulate Local Economic Velocity (Circulation Hops):", ti: "ፍጥነት ዝውውር ገንዘብ ኣብ ማሕበረሰብ (ክንደይ ግዜ ተዘዊሩ)፦" }, isTi)}
            </span>
            <span className="font-mono text-sm font-bold text-emerald-400">
              {circulationHops} {circulationHops === 1 ? "Hop" : "Hops"} (Transactions)
            </span>
          </div>

          <input
            type="range"
            min={1}
            max={15}
            value={circulationHops}
            onChange={(e) => setCirculationHops(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Traditional Banking Rail */}
            <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                  Traditional Banking (Fiat)
                </span>
                <span className="text-[10px] font-mono text-red-300 bg-red-500/20 px-2 py-0.5 rounded">
                  ~3% Drained Per Hop
                </span>
              </div>
              <div className="text-2xl font-mono font-bold text-white mt-1">
                $${traditionalRetained} <span className="text-xs text-zinc-400 font-normal">retained from $${initialValue}</span>
              </div>
              <p className="text-[11px] text-red-300 font-mono">
                $${traditionalFeesLost} ({Math.round((traditionalFeesLost / initialValue) * 100)}%) extracted by payment processors and banks!
              </p>
            </div>

            {/* Bitcoin Circular Rail */}
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Bitcoin Circular Economy (Lightning)
                </span>
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded">
                  0% Intermediary Toll
                </span>
              </div>
              <div className="text-2xl font-mono font-bold text-white mt-1">
                $${lightningRetained} <span className="text-xs text-zinc-400 font-normal">retained from $${initialValue}</span>
              </div>
              <p className="text-[11px] text-emerald-300 font-mono">
                100% of wealth stays inside the community, circulating freely without third-party leakage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   Master Export
   ========================================================================= */

interface Chapter15LessonProps {
  module:
    | "lightning_channel_flow"
    | "custodial_vs_non_custodial"
    | "sidechain_federation_peg"
    | "circular_economy_explorer";
  isTi?: boolean;
}

export function Chapter15InteractiveLesson({
  module,
  isTi = false,
}: Chapter15LessonProps) {
  switch (module) {
    case "lightning_channel_flow":
      return <LightningChannelFlow isTi={isTi} />;
    case "custodial_vs_non_custodial":
      return <CustodialVsNonCustodial isTi={isTi} />;
    case "sidechain_federation_peg":
      return <SidechainFederationPeg isTi={isTi} />;
    case "circular_economy_explorer":
      return <CircularEconomyExplorer isTi={isTi} />;
    default:
      return null;
  }
}
