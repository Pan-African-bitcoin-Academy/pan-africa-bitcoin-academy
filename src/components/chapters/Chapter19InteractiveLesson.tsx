"use client";

import React, { useState } from "react";
import {
  TrendingDown,
  Layers,
  ShieldAlert,
  ShieldCheck,
  Calculator,
  ArrowRight,
  AlertTriangle,
  Coins,
  Eye,
  EyeOff,
  GitMerge,
  PieChart,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sliders,
  DollarSign,
  Activity,
  Compass,
} from "lucide-react";

interface Props {
  module: "mempool_fee_timing_analyzer" | "privacy_cluster_heuristics" | "strategic_spend_planner";
  isTi?: boolean;
}

export function Chapter19InteractiveLesson({ module, isTi = false }: Props) {
  // ==========================================
  // MODULE 1: MEMPOOL FEE TIMING & SAVINGS ANALYZER
  // ==========================================
  if (module === "mempool_fee_timing_analyzer") {
    return <MempoolFeeTimingSection isTi={isTi} />;
  }

  // ==========================================
  // MODULE 2: PRIVACY CLUSTER HEURISTICS (CIOH)
  // ==========================================
  if (module === "privacy_cluster_heuristics") {
    return <PrivacyClusterSection isTi={isTi} />;
  }

  // ==========================================
  // MODULE 3: STRATEGIC SPEND PLANNER & UTXO BUCKETS
  // ==========================================
  if (module === "strategic_spend_planner") {
    return <StrategicSpendPlannerSection isTi={isTi} />;
  }

  return null;
}

// -------------------------------------------------------------
// MODULE 1: Mempool Fee Timing & Savings Calculator
// -------------------------------------------------------------
function MempoolFeeTimingSection({ isTi }: { isTi: boolean }) {
  const [utxoCount, setUtxoCount] = useState<number>(10);
  const [btcPriceUsd, setBtcPriceUsd] = useState<number>(95000);

  // Constants for SegWit P2WPKH input/output sizes
  // 1 input = ~68 vB, 1 output = ~31 vB, overhead = ~10.5 vB
  const consolidatedInputs = utxoCount;
  const consolidationVBytes = Math.round(consolidatedInputs * 68 + 31 + 10.5);

  // Low fee rate vs High fee rate
  const lowFeeRate = 8; // sat/vB (consolidation weekend window)
  const highFeeRate = 95; // sat/vB (bull market rush)

  // Cost to consolidate now during low tide
  const consolidationCostSats = consolidationVBytes * lowFeeRate;
  const consolidationCostUsd = ((consolidationCostSats / 100000000) * btcPriceUsd).toFixed(2);

  // Future spend of 1 consolidated UTXO during high fee period:
  // 1 input (68 vB) + 2 outputs (62 vB) + overhead (10.5 vB) = ~141 vB
  const futureSingleInputVBytes = 141;
  const futureConsolidatedSpendCostSats = futureSingleInputVBytes * highFeeRate;

  // If NOT consolidated, spending N inputs during high fee period:
  // N inputs (N * 68 vB) + 2 outputs (62 vB) + overhead (10.5 vB)
  const futureUnconsolidatedVBytes = Math.round(utxoCount * 68 + 62 + 10.5);
  const futureUnconsolidatedSpendCostSats = futureUnconsolidatedVBytes * highFeeRate;

  // Net Savings = (Future spend without consolidation) - (Cost to consolidate now + Future spend with 1 input)
  const netSavingsSats = futureUnconsolidatedSpendCostSats - (consolidationCostSats + futureConsolidatedSpendCostSats);
  const netSavingsUsd = ((netSavingsSats / 100000000) * btcPriceUsd).toFixed(2);
  const savingsPercent = Math.round((netSavingsSats / futureUnconsolidatedSpendCostSats) * 100);

  return (
    <div className="my-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-5 sm:p-7 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <TrendingDown className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-100 sm:text-lg">
              {isTi ? "19.0 መዓስ ምድልዳል ከም ዘድሊ (Mempool Fee Timing & Savings Calculator)" : "19.0 When to Consolidate: Fee Timing & Net Savings"}
            </h3>
            <p className="text-xs text-zinc-400">
              {isTi ? "ብሕሱም ክፍሊት ንዘለዉ UTXOታት ብምድልዳል ኣብ እዋን ውዕዉዕ ዕዳጋ ዝድሕን ወጻኢታት" : "Calculate lifetime fee savings by consolidating fragmented UTXOs during low-fee windows"}
            </p>
          </div>
        </div>
        <span className="rounded-full border border-emerald-500/30 bg-emerald-950/40 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
          {isTi ? "ናይ ክፍሊት ሚዛን" : "Fee Optimization"}
        </span>
      </div>

      {/* Congestion Tides Matrix */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wide">
              {isTi ? "ህዱእ መስኮት (Low Tide Window)" : "Low Tide Window"}
            </span>
            <span className="font-mono text-xs text-emerald-400 bg-emerald-900/50 px-2 py-0.5 rounded">
              5–12 sat/vB
            </span>
          </div>
          <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
            {isTi
              ? "ቀዳመ-ሰንበትን ለይትን ሜምፑል ክጽሪ ከሎ። ንምድልዳል (Consolidation) ዝበለጸ ወርቃዊ ግዜ እዩ!"
              : "Calm weekend nights when the mempool empties. Optimal window to batch and consolidate fragmented dust."}
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            {isTi ? "ምድልዳል ብጽቡቕ ይፍቀድ" : "Consolidate Now"}
          </div>
        </div>

        <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">
              {isTi ? "ልሙድ መዓልቲ (Standard Day)" : "Standard Traffic"}
            </span>
            <span className="font-mono text-xs text-amber-400 bg-amber-900/50 px-2 py-0.5 rounded">
              25–50 sat/vB
            </span>
          </div>
          <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
            {isTi
              ? "ልሙድ ናይ ስራሕ መዓልቲ ንግዲ። ንመዓልታዊ ኣድላዪ ክፍሊታት ጥራይ ተጠቐመሉ፡ ምድልዳል ግን ተጸበ።"
              : "Typical weekday economic volume. Execute urgent or daily merchant transactions only; hold off on bulk consolidation."}
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-amber-400">
            <Activity className="w-4 h-4" />
            {isTi ? "ንኣድለይቲ ጥራይ" : "Regular Spends Only"}
          </div>
        </div>

        <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-300 uppercase tracking-wide">
              {isTi ? "ውዕዉዕ ጽቕጥቅጥ (Fee Spike Rush)" : "Fee Spike Rush"}
            </span>
            <span className="font-mono text-xs text-rose-400 bg-rose-900/50 px-2 py-0.5 rounded">
              80–200+ sat/vB
            </span>
          </div>
          <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
            {isTi
              ? "ዕዳጋ ክውስኽ ከሎ ወይ ብሎካት ክጸቡ ከለዉ። ብዙሓት UTXOታት ምጥቃም ዓቢ ናይ ሳቶሺ ክሳራ የምጽእ!"
              : "Bull run surges or high volatility. Spending un-consolidated inputs will burn massive sats in miner fees."}
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-rose-400">
            <XCircle className="w-4 h-4" />
            {isTi ? "ፈጺምካ ኣይተዳልድል!" : "Never Consolidate Here!"}
          </div>
        </div>
      </div>

      {/* Interactive Savings Simulator */}
      <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
          <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-orange-400" />
            {isTi ? "ናይ ሳቶሺ ቁጠባ ስሌት (Fee Savings Simulation)" : "Fee Savings Simulation"}
          </h4>
          <span className="text-xs text-zinc-400 font-mono">
            Low: {lowFeeRate} sat/vB | Rush: {highFeeRate} sat/vB
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">
              {isTi ? `ዝድለደሉ ዘለዉ ንኣሽቱ UTXOታት፦ ${utxoCount} Inputs` : `Number of Fragmented UTXOs: ${utxoCount} Inputs`}
            </label>
            <input
              type="range"
              min={3}
              max={30}
              step={1}
              value={utxoCount}
              onChange={(e) => setUtxoCount(Number(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
              <span>3 UTXOs</span>
              <span>15 UTXOs</span>
              <span>30 UTXOs</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">
              {isTi ? `ናይ ቢትኮይን ዋጋ (USD): $${btcPriceUsd.toLocaleString()}` : `Assumed Bitcoin Price: $${btcPriceUsd.toLocaleString()}`}
            </label>
            <input
              type="range"
              min={40000}
              max={150000}
              step={5000}
              value={btcPriceUsd}
              onChange={(e) => setBtcPriceUsd(Number(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
              <span>$40k</span>
              <span>$95k</span>
              <span>$150k</span>
            </div>
          </div>
        </div>

        {/* Calculation Result Dashboard */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-lg bg-zinc-950 p-3 border border-zinc-800">
            <span className="text-[11px] text-zinc-500 block">
              {isTi ? "ሕጂ ንምድልዳል ዝወጽእ (8 sat/vB):" : "Cost to Consolidate Now (8 sat/vB):"}
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-bold font-mono text-zinc-200">
                {consolidationCostSats.toLocaleString()} sats
              </span>
              <span className="text-[11px] text-zinc-400 font-mono">(${consolidationCostUsd})</span>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">
              {consolidationVBytes} vB (combines {utxoCount} $\rightarrow$ 1)
            </span>
          </div>

          <div className="rounded-lg bg-zinc-950 p-3 border border-rose-900/30">
            <span className="text-[11px] text-rose-400 block">
              {isTi ? "ብዘይ ምድልዳል ኣብ እዋን ጽቕጥቅጥ (95 sat/vB):" : "Cost if Spent During Rush (95 sat/vB):"}
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-bold font-mono text-rose-300">
                {futureUnconsolidatedSpendCostSats.toLocaleString()} sats
              </span>
              <span className="text-[11px] text-zinc-400 font-mono">
                (${((futureUnconsolidatedSpendCostSats / 100000000) * btcPriceUsd).toFixed(2)})
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">
              Requires carrying {futureUnconsolidatedVBytes} vB in mempool
            </span>
          </div>

          <div className="rounded-lg bg-emerald-950/30 p-3 border border-emerald-500/40">
            <span className="text-[11px] text-emerald-300 font-semibold block">
              {isTi ? "ዝተረኽበ ጽሩይ ቁጠባ (Net Savings):" : "Net Lifetime Savings:"}
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-bold font-mono text-emerald-400">
                +{netSavingsSats.toLocaleString()} sats
              </span>
              <span className="text-[11px] text-emerald-300 font-mono">(${netSavingsUsd})</span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-400 block mt-0.5">
              {savingsPercent}% {isTi ? "ናይ ክፍሊት ቅናሽ ተረኺቡ" : "fee reduction achieved"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MODULE 2: Privacy Cluster Heuristics (CIOH)
// -------------------------------------------------------------
function PrivacyClusterSection({ isTi }: { isTi: boolean }) {
  const [isMerged, setIsMerged] = useState<boolean>(false);

  const inputs = [
    {
      label: isTi ? "እታው A: ናይ መንነት መረጋገጺ (KYC Exchange)" : "Input A: KYC Exchange Withdrawal",
      tag: "KYC ID: Alice Smith",
      amount: "0.15 BTC",
      source: "Kraken / Coinbase",
      color: "border-blue-500/40 bg-blue-950/20 text-blue-300",
    },
    {
      label: isTi ? "እታው B: ናይ ናጻ ሰራሕተኛ ደሞዝ (P2P Salary)" : "Input B: P2P Freelance Client",
      tag: "Client: Web Design Gig",
      amount: "0.08 BTC",
      source: "Direct P2P Payment",
      color: "border-purple-500/40 bg-purple-950/20 text-purple-300",
    },
    {
      label: isTi ? "እታው C: ናይ ላይትኒንግ ቻነል ምዕጻው (LN Channel Close)" : "Input C: Closed Lightning Channel",
      tag: "Off-chain Privacy routing",
      amount: "0.05 BTC",
      source: "LN Node Settlement",
      color: "border-amber-500/40 bg-amber-950/20 text-amber-300",
    },
  ];

  return (
    <div className="my-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-5 sm:p-7 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-100 sm:text-lg">
              {isTi ? "19.1 ሓደጋታት ብሕትውና ካብ ምድልዳል (Common-Input Ownership Heuristic)" : "19.1 Privacy Risks of Consolidation: Cluster Collapse"}
            </h3>
            <p className="text-xs text-zinc-400">
              {isTi ? "ብዙሓት UTXOታት ብሓደ ምስ ተዳልድሉ ሰብ-መዚ ሰንሰለት ብኸመይ ንመንነትካ ከም ዘራኽብዎ ተመልከት" : "How chain analysis surveillance clusters multiple UTXOs to de-anonymize your identity"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsMerged(!isMerged)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
            isMerged
              ? "border-rose-500 bg-rose-950/50 text-rose-300 shadow-md ring-1 ring-rose-500/40"
              : "border-orange-500 bg-orange-600 text-white hover:bg-orange-500"
          }`}
        >
          <GitMerge className="w-3.5 h-3.5" />
          {isMerged
            ? isTi
              ? "ምድልዳል ፍታሕ (Reset to Separate Buckets)"
              : "Separate Coins (Coin Control)"
            : isTi
            ? "ኣብ ሓደ ኣዳልድል (Simulate Consolidation)"
            : "Simulate Naive Consolidation"}
        </button>
      </div>

      {/* Visual Cluster Diagram */}
      <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            {isTi ? "ናይ ሳንቲማት ምንጪ ቅድሚ ምድልዳል፦" : "Separate UTXO Historical Sources:"}
          </span>
          <span className={`text-xs font-mono px-2 py-0.5 rounded ${
            isMerged ? "bg-rose-950 text-rose-400 border border-rose-800" : "bg-emerald-950 text-emerald-300 border border-emerald-800"
          }`}>
            {isMerged
              ? isTi
                ? "መንነት ተቓሊዑ (Cluster Collapsed)"
                : "Common-Input Clustered!"
              : isTi
              ? "ብሕትውና ተሓልዩ (Isolated Sources)"
              : "Isolated & Unlinked"}
          </span>
        </div>

        {/* 3 Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {inputs.map((inp, idx) => (
            <div
              key={idx}
              className={`rounded-xl border p-3 transition-all ${inp.color} ${
                isMerged ? "opacity-80 scale-[0.98]" : "scale-100 shadow-md"
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold">{inp.source}</span>
                <span className="font-mono font-bold">{inp.amount}</span>
              </div>
              <p className="text-[11px] opacity-90">{inp.label}</p>
              <div className="mt-2 text-[10px] font-mono px-2 py-1 rounded bg-black/40 border border-white/10">
                {inp.tag}
              </div>
            </div>
          ))}
        </div>

        {/* Central Merging Conduit Arrow */}
        <div className="my-4 flex flex-col items-center justify-center">
          <div className={`h-8 w-0.5 transition-all ${isMerged ? "bg-rose-500" : "bg-zinc-700"}`} />
          <div className={`px-3 py-1 rounded-full text-[11px] font-mono border transition-all ${
            isMerged
              ? "bg-rose-950/80 text-rose-300 border-rose-500 shadow-lg"
              : "bg-zinc-900 text-zinc-500 border-zinc-800"
          }`}>
            {isMerged ? "tx_consolidate: 3 Inputs in 1 Tx" : "Kept Isolated via Coin Control"}
          </div>
          <div className={`h-8 w-0.5 transition-all ${isMerged ? "bg-rose-500" : "bg-zinc-700"}`} />
        </div>

        {/* Output Clustered Box */}
        <div className={`rounded-xl border p-4 transition-all ${
          isMerged
            ? "border-rose-500/80 bg-rose-950/30 text-rose-200 ring-1 ring-rose-500/40 shadow-xl"
            : "border-zinc-800 bg-zinc-950 text-zinc-500"
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
            <div className="flex items-center gap-2">
              {isMerged ? (
                <Eye className="w-4 h-4 text-rose-400" />
              ) : (
                <EyeOff className="w-4 h-4 text-zinc-500" />
              )}
              <h5 className="text-sm font-bold">
                {isMerged
                  ? isTi
                    ? "ዝተደለደለ ውጽኢት፡ 0.28 BTC (ናይ ሓባር ክላስተር ተፈጢሩ!)"
                    : "Consolidated Output: 0.28 BTC (Surveillance Cluster Created)"
                  : isTi
                  ? "ናጻ ውጽኢታት (ዝኾነ ናይ ሓባር ርክብ የለን)"
                  : "Independent UTXOs (No Common Ownership Link)"}
              </h5>
            </div>
            {isMerged && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-900/60 text-rose-200">
                Surveillance Heuristic: CIOH Applied
              </span>
            )}
          </div>

          <div className="mt-3 text-xs leading-relaxed">
            {isMerged ? (
              <div className="space-y-2 text-rose-200/90">
                <p>
                  {isTi
                    ? "⚠️ ውጽኢት ምድልዳል፦ ኩሎም እቶም 3 እታዎታት ናይ ሓደ ወገን (Alice Smith) ምዃኖም ሰብ-መዚ ሰንሰለት (Chain Analysis) ብኡንብኡ የረጋግጹ!"
                    : "⚠️ Privacy Collapse: Blockchain analytics now definitively links Alice Smith's KYC passport identity to her freelance client AND her private Lightning node."}
                </p>
                <ul className="list-disc pl-4 space-y-1 text-zinc-300 text-[11px]">
                  <li>
                    {isTi
                      ? "እቲ ናይ ደሞዝ ከፋሊ ንAlice ኣብ Kraken ዘለዋ 0.15 BTC ከም ዘለዋ ይርኢ።"
                      : "The freelance employer can now see Alice's full savings balance from Kraken."}
                  </li>
                  <li>
                    {isTi
                      ? "እቲ ኤክስቸንጅ ንAlice ናይ ገዛእ ርእሳ ላይትኒንግ ቻነል ከም ዘለዋ ይፈልጥ።"
                      : "The exchange links Alice's real-world identity to her Lightning node gossip ID."}
                  </li>
                </ul>
              </div>
            ) : (
              <p className="text-zinc-400">
                {isTi
                  ? "✅ ጽቡቕ ናይ ሳንቲም ቁጽጽር (Coin Control)፦ ነፍሲ ወከፍ ሳንቲም ኣብ ናይ ገዛእ ርእሱ ካቴጎሪ (Bucket) ይተርፍ። ዋላ ሓደ ሰብ ነዞም ሰለስተ ምንጭታት ናይ ሓደ ወናኒ ምዃኖም ከረጋግጽ ኣይክእልን።"
                  : "✅ Sound Coin Control Discipline: Each UTXO remains compartmentalized in its own logical bucket. No blockchain observer can prove they belong to the same entity."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MODULE 3: Strategic Spend Planner & UTXO Buckets
// -------------------------------------------------------------
function StrategicSpendPlannerSection({ isTi }: { isTi: boolean }) {
  const [selectedSpendPlan, setSelectedSpendPlan] = useState<"naive" | "optimal">("optimal");

  return (
    <div className="my-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-5 sm:p-7 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-100 sm:text-lg">
              {isTi ? "19.2 መጻኢ ወጻኢታት ምውጣን (Sovereign UTXO Bucket Architecture)" : "19.2 Planning Future Spends: Strategic UTXO Bucketing"}
            </h3>
            <p className="text-xs text-zinc-400">
              {isTi ? "ሚዛን ዋጋን ብሕትውናን ንምሕላው ሳንቲምካ ብመደብን ብደረጃታትን ምምቃል" : "Tiering your Bitcoin treasury into Cold, Mid-Tier, and Hot operational buckets"}
            </p>
          </div>
        </div>
      </div>

      {/* 3-Tier Portfolio Architecture Display */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-300 uppercase">
              {isTi ? "ደረጃ 1: ናይ ቮልት መዝገብ (Cold Vault)" : "Tier 1: Cold Vault"}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-900/40 text-blue-300">
              0.4 BTC each
            </span>
          </div>
          <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
            {isTi
              ? "ንነዊሕ ዓመታት ዘይትንከፍ ዓበይቲ ሳንቲማት። ፈጺሞም ምስ ንኣሽቱ መዓልታዊ ክፍሊታት ኣይሕወሱን።"
              : "Generational store of value. Never spent directly on small merchant goods; touched only for major quarterly consolidations."}
          </p>
          <div className="mt-3 text-[11px] font-mono text-zinc-400 bg-zinc-950/60 p-2 rounded border border-zinc-800">
            {isTi ? "ዕላማ፦ ዝለዓለ ብሕትውናን ውሑድ ወጻኢታትን" : "Goal: Max Privacy & Zero Malleability"}
          </div>
        </div>

        <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-300 uppercase">
              {isTi ? "ደረጃ 2: ናይ ወቕቲ ባጀት (Mid-Tier Treasury)" : "Tier 2: Mid-Tier Treasury"}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-900/40 text-purple-300">
              0.05 BTC each
            </span>
          </div>
          <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
            {isTi
              ? "ንወርሓዊ ወይ ናይ ሰለስተ ወርሒ ዓበይቲ ዕዳጋታት (ንኣብነት፡ ናይ ላይትኒንግ ቻነል ምኽፋት) ዝውዕል።"
              : "Funding channels, periodic vendor invoices, or replenishing mobile hot wallets in predictable chunks."}
          </p>
          <div className="mt-3 text-[11px] font-mono text-zinc-400 bg-zinc-950/60 p-2 rounded border border-zinc-800">
            {isTi ? "ዕላማ፦ ንቻነላትን ዓበይቲ ክፍሊታትን" : "Goal: Channel Funding & Periodic Liquidity"}
          </div>
        </div>

        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-300 uppercase">
              {isTi ? "ደረጃ 3: መዓልታዊ ክፍሊት (Operational Dust)" : "Tier 3: Hot Operational"}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-300">
              0.005–0.01 BTC
            </span>
          </div>
          <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
            {isTi
              ? "ቀለልቲ ናይ On-chain ክፍሊታት ወይ ናይ ቴስትነት ልምምድ። ተረፍ ሳንቲም (Change) ኣዝዩ ውሑድ ይኸውን።"
              : "Small on-chain spending, tip jars, and point-of-sale transactions where change fragmentation is minimal."}
          </p>
          <div className="mt-3 text-[11px] font-mono text-zinc-400 bg-zinc-950/60 p-2 rounded border border-zinc-800">
            {isTi ? "ዕላማ፦ ቅልጡፍን ርካሽን መዓልታዊ ምንቅስቓስ" : "Goal: Minimal Change Fragmentation"}
          </div>
        </div>
      </div>

      {/* Decision Scenario: Spend 0.008 BTC */}
      <div className="mt-6 border-t border-zinc-800/80 pt-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              {isTi ? "ናይ ክፍሊት ፈተነ፦ ንነጋዳይ 0.008 BTC ምኽፋል" : "Spending Scenario: Paying a 0.008 BTC Merchant Invoice"}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedSpendPlan("naive")}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition ${
                selectedSpendPlan === "naive"
                  ? "border-rose-500 bg-rose-950/40 text-rose-300 ring-1 ring-rose-500/40"
                  : "border-zinc-800 bg-zinc-900 text-zinc-400"
              }`}
            >
              {isTi ? "ዘይተሓስበሉ ኣገባብ (Naive Spend)" : "Naive Spend (From Cold Vault)"}
            </button>
            <button
              onClick={() => setSelectedSpendPlan("optimal")}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition ${
                selectedSpendPlan === "optimal"
                  ? "border-emerald-500 bg-emerald-950/40 text-emerald-300 ring-1 ring-emerald-500/40"
                  : "border-zinc-800 bg-zinc-900 text-zinc-400"
              }`}
            >
              {isTi ? "ብቑዕ ኣገባብ (Tier-Matched Spend)" : "Optimal Tier-Matched Spend"}
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          {selectedSpendPlan === "naive" ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                <AlertTriangle className="w-4 h-4" />
                {isTi ? "ሓደገኛ ውሳነ፦ ካብቲ ናይ 0.4 BTC ቮልት 0.008 BTC ምኽፋል!" : "Mistake: Breaking a 0.4 BTC Cold Vault UTXO to pay 0.008 BTC"}
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {isTi
                  ? "እቲ ዋሌት ነቲ ናይ 0.4 BTC UTXO ይሰብሮ። ነቲ ነጋዳይ 0.008 BTC ምስ ከፈለ፡ 0.3919 BTC ናይ ተመላሲ ሳንቲም (Change UTXO) ይፍጠር። እቲ ነጋዳይ ወይ ናይ ብሎክቼይን ተዓዛቢ እቲ ዓቢ ቮልት ናትካ ምዃኑ ይፈልጥ!"
                  : "The wallet cracks open your 0.4 BTC cold vault. It sends 0.008 BTC to the merchant and creates a massive 0.3919 BTC change output. The merchant now sees that your wallet holds hundreds of thousands of dollars!"}
              </p>
              <div className="rounded bg-rose-950/30 p-2.5 text-[11px] text-rose-200 border border-rose-900/30">
                {isTi ? "ውጽኢት፦ ናይ ቮልት ብሕትውና ተበላሽዩ + ዘየድሊ ዓቢ ተረፍ ሳንቲም ተፈጢሩ።" : "Result: Vault anonymity destroyed + huge change output exposed to merchant analysis."}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                {isTi ? "ብሉጽ ውሳነ፦ ካብቲ ናይ 0.01 BTC መዓልታዊ ባጀት ምኽፋል!" : "Correct: Spending the matching 0.01 BTC Operational UTXO"}
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {isTi
                  ? "ነቲ ዝቐረበ ናይ 0.01 BTC UTXO ጥራይ ተጠቒምካ ትኸፍል። 0.008 BTC ናብ ነጋዳይ ይኸይድ፡ ንእሽቶ 0.0019 BTC ጥራይ ተመላሲ ይኸውን። እቲ ናይ 0.4 BTC ቮልት ፈጺሙ ኣብ ብሎክቼይን ኣይርአን!"
                  : "You pick the exact-sized 0.01 BTC operational UTXO. 0.008 BTC goes to the merchant, leaving a tiny clean 0.0019 BTC change. Your 0.4 BTC Cold Vault is never exposed or linked to the transaction."}
              </p>
              <div className="rounded bg-emerald-950/30 p-2.5 text-[11px] text-emerald-200 border border-emerald-900/30">
                {isTi ? "ውጽኢት፦ ምሉእ ብሕትውና ቮልት ተሓልዩ + ዝተሓተ ናይ ማይነር ክፍሊት!" : "Result: Cold Vault remains completely unlinked + optimal miner fee!"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
