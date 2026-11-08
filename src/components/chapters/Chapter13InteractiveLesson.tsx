"use client";

import { useState } from "react";
import {
  Pickaxe,
  Cpu,
  Zap,
  CheckCircle2,
  XCircle,
  Coins,
  TrendingDown,
  Clock,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Flame,
  Layers,
  Sparkles,
  RotateCcw,
  Scale,
  Calendar,
  Lock,
  ArrowUpRight,
  HelpCircle,
  Check,
} from "lucide-react";

/* ─────────── Shared helpers ─────────── */

type Localized = { en: string; ti: string };
const t = (v: Localized, isTi: boolean) => (isTi ? v.ti : v.en);

const panelClass =
  "rounded-2xl border border-zinc-800 bg-zinc-950/90 p-4 shadow-xl sm:p-6 my-6";

/* =========================================================================
   Module 1: PoW Asymmetry Representation (Section 13.0)
   Theme: "Proof of Work Asymmetry: Costly to Create, Trivial to Verify"
   ========================================================================= */

interface ModuleProps {
  isTi: boolean;
}

function PowAsymmetryRepresentation({ isTi }: ModuleProps) {
  const [tampered, setTampered] = useState<boolean>(false);

  return (
    <div className={panelClass}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
                {t({ en: "Section 13.0 Representation", ti: "ክፍሊ 13.0 ምርኢት" }, isTi)}
              </span>
              <span className="text-xs text-zinc-400">
                {t({ en: "Cryptographic Asymmetry", ti: "ክሪፕቶግራፊካዊ ዘይምምጥጣን" }, isTi)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100">
              {t(
                {
                  en: "Proof of Work Asymmetry: Enormous Cost to Mint, Milliseconds to Verify",
                  ti: "ዘይምምጥጣን መርትዖ ስራሕ፦ ንምዕዳን ኣዝዩ ክቡር፣ ንምርግጋጽ ግን ናይ ሚሊሰከንድ ስራሕ",
                },
                isTi
              )}
            </h3>
          </div>
        </div>
        <button
          onClick={() => setTampered(!tampered)}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
            tampered
              ? "border-red-500/50 bg-red-950/30 text-red-300 hover:bg-red-900/40"
              : "border-zinc-700 bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 hover:text-white"
          }`}
        >
          {tampered ? (
            <>
              <RotateCcw className="h-3.5 w-3.5" />
              {t({ en: "Restore Honest Block", ti: "ቅኑዕ ብሎክ ምለስ" }, isTi)}
            </>
          ) : (
            <>
              <ShieldAlert className="h-3.5 w-3.5 text-red-400" />
              {t({ en: "Simulate Dishonest Block", ti: "ናይ ምግርጫው ብሎክ ፈትን" }, isTi)}
            </>
          )}
        </button>
      </div>

      <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
        {t(
          {
            en: "Proof of Work functions like a one-way mathematical lock. Finding a valid nonce requires trillions of high-energy calculations, but once published, any computer on Earth can verify it instantly using a single SHA-256 operation.",
            ti: "መርትዖ ስራሕ (PoW) ከም ሓደ-ኣንፈት ዘለዎ ናይ ሒሳብ መዕጸዊ ኮይኑ ይሰርሕ። ቅኑዕ nonce ንምርካብ ትሪልዮናት ብርቱዕ ሓይሊ ዝሓትት ሒሳባዊ ፈተነታት የድሊ፤ ሓንሳብ ምስ ተረኽበ ግን ኣብ ዓለም ዘላ ዝኾነት ኮምፒተር ብሓንቲ ናይ SHA-256 ስራሕ ብቕጽበት ከተረጋግጾ ትኽእል።",
          },
          isTi
        )}
      </p>

      {/* Main Visual Representation Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Left Side: Heavy Miner Work */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-950/10 p-4 sm:p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                <Pickaxe className="h-4 w-4" />
                {t({ en: "The Miner's Burden (Work)", ti: "ናይ ዓዳኒ ጻዕሪ (ስራሕ)" }, isTi)}
              </span>
              <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-mono text-amber-300">
                ~10 Minutes of Global Energy
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-lg bg-zinc-900/80 p-3 border border-zinc-800">
                <div className="text-[11px] text-zinc-400 uppercase font-semibold">
                  {t({ en: "Target Difficulty", ti: "ዕላማ ጸገም (Target)" }, isTi)}
                </div>
                <div className="font-mono text-xs text-amber-300 break-all mt-0.5">
                  00000000000000000004ab00000...
                </div>
                <div className="text-[10px] text-zinc-500 mt-1">
                  {t(
                    {
                      en: "Hash must start with 19 leading zeroes.",
                      ti: "እቲ ሃሽ ብ 19 ዜሮታት ክጅምር ኣለዎ።",
                    },
                    isTi
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-[11px] text-zinc-400 font-medium flex justify-between">
                  <span>{t({ en: "Hash Attempts (Trial & Error):", ti: "ፈተነታት ሃሽ፦" }, isTi)}</span>
                  <span className="font-mono text-amber-400">~600 Exahashes / sec</span>
                </div>
                <div className="font-mono text-[10px] bg-black/60 rounded p-2.5 space-y-1 text-zinc-400 border border-zinc-800/80">
                  <div className="text-zinc-500 line-through">nonce: 00000001 → 9f8a...c3 (Miss!)</div>
                  <div className="text-zinc-500 line-through">nonce: 00000002 → 1b4e...7d (Miss!)</div>
                  <div className="text-zinc-500">... [Trillions of electricity-powered guesses] ...</div>
                  <div className="text-emerald-400 font-bold bg-emerald-950/40 px-1 py-0.5 rounded">
                    nonce: 3,948,201,842 → 00000000000000000003f9a... (HIT!)
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-amber-500/20 text-xs text-amber-200/90 flex items-center justify-between">
            <span>{t({ en: "Electricity & Hardware Cost:", ti: "ወጻኢ ሓይሊ ኤሌክትሪክን ሃርድዌርን፦" }, isTi)}</span>
            <span className="font-bold font-mono text-amber-300">~$15,000 – $25,000+ per block</span>
          </div>
        </div>

        {/* Right Side: Instant Node Verification */}
        <div className={`rounded-xl border p-4 sm:p-5 flex flex-col justify-between space-y-4 transition-all ${
          tampered
            ? "border-red-500/50 bg-red-950/20"
            : "border-sky-500/30 bg-sky-950/10"
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <span className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${
                tampered ? "text-red-400" : "text-sky-400"
              }`}>
                <Cpu className="h-4 w-4" />
                {t({ en: "Every Node's Audit (Verification)", ti: "ናይ ነፍሲ ወከፍ ኖድ ምርመራ (ምርግጋጽ)" }, isTi)}
              </span>
              <span className={`rounded px-2 py-0.5 text-[10px] font-mono ${
                tampered ? "bg-red-500/20 text-red-300" : "bg-sky-500/20 text-sky-300"
              }`}>
                &lt; 0.1 Milliseconds
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-lg bg-zinc-900/80 p-3 border border-zinc-800">
                <div className="text-[11px] text-zinc-400 uppercase font-semibold">
                  {t({ en: "Node Verification Formula", ti: "ቀመር መርመራ ኖድ" }, isTi)}
                </div>
                <div className="font-mono text-xs text-sky-300 break-all mt-0.5">
                  SHA256(SHA256(BlockHeader + Nonce))
                </div>
                <div className="text-[10px] text-zinc-500 mt-1">
                  {t(
                    {
                      en: "Calculated only ONCE by every node, smartphone, and miner on Earth.",
                      ti: "ኣብ ምድሪ ብዘለዉ ኩሎም ኖድስ፣ ስልካትን ዓደንትን ሓንቲ ግዜ ጥራይ ዝሕሰብ።",
                    },
                    isTi
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-[11px] text-zinc-400 font-medium">
                  {t({ en: "Audit Outcome:", ti: "ውጽኢት መርመራ፦" }, isTi)}
                </div>
                {tampered ? (
                  <div className="rounded-lg border border-red-500/50 bg-red-950/40 p-3 space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-red-400 text-xs">
                      <XCircle className="h-4 w-4" />
                      {t({ en: "DISHONEST BLOCK REJECTED (Zero Difficulty Met)", ti: "ናይ ምግርጫው ብሎክ ብቕጽበት ተነጺጉ" }, isTi)}
                    </div>
                    <p className="text-[11px] text-zinc-300 font-mono">
                      {t(
                        {
                          en: "Hash: 8b4e9... (Does not start with 0000). The node dropped the fake block in 0.0001 seconds. Attacker wasted 100% of their electricity with 0 reward!",
                          ti: "ሃሽ፦ 8b4e9... (ብ 0000 ኣይጀመረን)። እቲ ኖድ ነቲ ናይ ምግርጫው ብሎክ ብ 0.0001 ሰከንድ ደርብይዎ። እቲ ኣጥቃዒ 100% ሓይሉ ብኸንቱ ኣጥፊኡ!",
                        },
                        isTi
                      )}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/40 p-3 space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-emerald-400 text-xs">
                      <CheckCircle2 className="h-4 w-4" />
                      {t({ en: "VALID BLOCK ACCEPTED", ti: "ቅኑዕ ብሎክ ብቕጽበት ጸዲቑ" }, isTi)}
                    </div>
                    <p className="text-[11px] text-zinc-300 font-mono">
                      {t(
                        {
                          en: "Hash starts with 19 zeros and matches header rule. Added to tip of chain seamlessly across the entire planet.",
                          ti: "እቲ ሃሽ ብ 19 ዜሮታት ይጅምርን ምስ ሕጊ ርእሲ ብሎክ ይሰማማዕን። ኣብ መላእ ዓለም ብዘይ ጸገም ተቐባልነት ረኺቡ።",
                        },
                        isTi
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-sky-500/20 text-xs text-sky-200/90 flex items-center justify-between">
            <span>{t({ en: "Node Verification Cost:", ti: "ወጻኢ መርመራ ኖድ፦" }, isTi)}</span>
            <span className="font-bold font-mono text-emerald-400">$0.00000001 (Zero Energy)</span>
          </div>
        </div>
      </div>

      {/* Summary Banner */}
      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5 text-xs text-zinc-300 flex items-start gap-3">
        <Sparkles className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-white">
            {t({ en: "The Asymmetry Defense: ", ti: "ናይ ዘይምምጥጣን መከላኸሊ ሓይሊ፦ " }, isTi)}
          </strong>
          {t(
            {
              en: "An attacker would have to burn millions of dollars in electricity to build an alternative chain, while ordinary citizens running $50 Raspberry Pi nodes can detect and reject invalid blocks for free. PoW makes cheating mathematically and economically suicidal.",
              ti: "ሓደ ኣጥቃዒ ካልእ ናይ ሓሶት ሰንሰለት ንምስራሕ ሚልዮናት ዶላር ሓይሊ ከባኽን ኣለዎ፤ ተራ ዜጋታት ግን ብ 50 ዶላር ብእትሽመት ንእሽቶ ኖድ ነቲ ናይ ምግርጫው ብሎክ ብነጻን ብቕጽበትን ክነጽግዎ ይኽእሉ። መርትዖ ስራሕ ንምግርጫው ብቑጠባን ብሒሳብን ርእሰ-ቕትለት ይገብሮ።",
            },
            isTi
          )}
        </p>
      </div>
    </div>
  );
}

/* =========================================================================
   Module 2: Coinbase Reward Anatomy (Section 13.1)
   Theme: "Miners & Block Rewards: Subsidy (New Coins) + Transaction Fees"
   ========================================================================= */

function CoinbaseRewardAnatomy({ isTi }: ModuleProps) {
  const [feeRate, setFeeRate] = useState<number>(35); // sats/vB slider

  // Block Subsidy post-April 2024
  const blockSubsidyBtc = 3.125;
  // Estimated fee pool based on 2,500 transactions at feeRate
  // average tx size ~ 200 vB * 2,500 txs = 500,000 vB = 0.5 MB * feeRate
  const txCount = 2750;
  const estimatedFeeSats = Math.round(feeRate * 180 * txCount);
  const estimatedFeeBtc = Number((estimatedFeeSats / 100000000).toFixed(4));
  const totalRewardBtc = Number((blockSubsidyBtc + estimatedFeeBtc).toFixed(4));

  const feePercentage = Math.round((estimatedFeeBtc / totalRewardBtc) * 100);

  return (
    <div className={panelClass}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <Coins className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                {t({ en: "Section 13.1 Representation", ti: "ክፍሊ 13.1 ምርኢት" }, isTi)}
              </span>
              <span className="text-xs text-zinc-400">
                {t({ en: "Coinbase Mechanics", ti: "ኣሰራርሓ ኮይንበይስ" }, isTi)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100">
              {t(
                {
                  en: "Anatomy of a Coinbase Transaction: How Miners Are Compensated",
                  ti: "ኣሰራርሓ ትራንዛክሽን ኮይንበይስ፦ ዓዳንቲ ብኸመይ ይኽፈሉ",
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
            en: "The very first transaction in every Bitcoin block is called the 'Coinbase Transaction'. It has no inputs and is the only mechanism through which brand-new bitcoins enter the universe. It bundles the protocol subsidy together with all user transaction fees.",
            ti: "ኣብ ነፍሲ ወከፍ ናይ ቢትኮይን ብሎክ ዘላ ቀዳመይቲ ትራንዛክሽን 'ኮይንበይስ ትራንዛክሽን' (Coinbase Transaction) ትበሃል። ንሳ መእተዊ (input) የብላን፤ ሓደስቲ ቢትኮይናት ናብ ዓለም ዝፍጠሩሉ እንኮ መገዲ ድማ ንሳ እያ። ንሳ ነቲ ናይ ፕሮቶኮል ድጎማን ናይ ኩሎም ተጠቀምቲ ናይ ትራንዛክሽን ክፍሊትን ጠርኒፋ ናብ ዓዳኒ ተመሓላልፍ።",
          },
          isTi
        )}
      </p>

      {/* Interactive Fee Pressure Slider */}
      <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              {t({ en: "Mempool Fee Environment (Congestion):", ti: "ኩነታት ክፍሊት Mempool (ጽቕጥቅጥ)፦" }, isTi)}
            </span>
            <p className="text-xs text-zinc-500">
              {t({ en: "Adjust to observe how transaction fees affect total miner payout", ti: "ክፍሊት ትራንዛክሽን ኣብ ጠቕላላ ክፍሊት ዓዳኒ ዝህልዎ ጽልዋ ንምርኣይ ለውጦ" }, isTi)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-emerald-400">{feeRate} sat/vB</span>
            <span className="text-xs text-zinc-400">
              ({feeRate < 20 ? t({ en: "Quiet", ti: "ህዱእ" }, isTi) : feeRate < 60 ? t({ en: "Moderate", ti: "ማእከላይ" }, isTi) : t({ en: "High Demand", ti: "ልዑል ጠለብ" }, isTi)})
            </span>
          </div>
        </div>
        <input
          type="range"
          min={5}
          max={120}
          value={feeRate}
          onChange={(e) => setFeeRate(Number(e.target.value))}
          className="mt-3 w-full accent-emerald-500 cursor-pointer"
        />
      </div>

      {/* Visual Coinbase Flow Diagram */}
      <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Source 1: Block Subsidy */}
          <div className="rounded-xl border border-sky-500/30 bg-sky-950/20 p-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                1. {t({ en: "Block Subsidy (Protocol Inflation)", ti: "ናይ ብሎክ ድጎማ (ሓድሽ ዝተፈጥረ)" }, isTi)}
              </span>
              <span className="rounded bg-sky-500/20 px-2 py-0.5 text-[10px] font-bold text-sky-300">
                Halving Era 5 (2024–2028)
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-2xl font-black text-white">{blockSubsidyBtc}</span>
              <span className="text-xs font-bold text-sky-300">BTC</span>
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">
              {t(
                {
                  en: "Pre-programmed creation minted out of thin air by consensus rule.",
                  ti: "ብመሰረት ሕጊ ስምምዕ ካብ ባዶ ተሰሪሑ ናብ ዓለም ዝተረኽበ ሳንቲም።",
                },
                isTi
              )}
            </div>
            <div className="mt-3 text-[10px] font-mono text-zinc-500 bg-black/40 p-2 rounded border border-zinc-800">
              vin[0]: coinbase &quot;The Times 03/Jan/2009 Chancellor...&quot;
            </div>
          </div>

          {/* Source 2: Transaction Fees */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                2. {t({ en: "User Transaction Fees", ti: "ክፍሊት ትራንዛክሽን ተጠቀምቲ" }, isTi)}
              </span>
              <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-mono text-amber-300">
                {txCount} transactions
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-2xl font-black text-white">+{estimatedFeeBtc}</span>
              <span className="text-xs font-bold text-amber-300">BTC</span>
              <span className="text-xs text-zinc-400 font-mono">
                ({estimatedFeeSats.toLocaleString()} sats)
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">
              {t(
                {
                  en: "Sum of (Inputs - Outputs) voluntarily paid by users competing for block space.",
                  ti: "ተጠቀምቲ ትራንዛክሽኖም ኣብቲ ብሎክ ክኣትወሎም ዝኸፈልዎ ክፍሊት (Inputs - Outputs)።",
                },
                isTi
              )}
            </div>
            <div className="mt-3 text-[10px] font-mono text-zinc-500 bg-black/40 p-2 rounded border border-zinc-800">
              fee = sum(inputs) - sum(outputs)
            </div>
          </div>
        </div>

        {/* Merge Arrow */}
        <div className="flex flex-col items-center -my-2">
          <div className="h-6 w-0.5 bg-zinc-700" />
          <div className="rounded-full bg-zinc-800 p-1.5 border border-zinc-700 text-emerald-400">
            <ArrowRight className="h-4 w-4 rotate-90" />
          </div>
        </div>

        {/* Coinbase Output Box */}
        <div className="rounded-xl border-2 border-emerald-500/50 bg-emerald-950/20 p-4 sm:p-5 shadow-lg shadow-emerald-950/30">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              {t({ en: "Coinbase Transaction Output (Total Miner Payout)", ti: "ውጽኢት ትራንዛክሽን ኮይንበይስ (ጠቕላላ ክፍሊት ዓዳኒ)" }, isTi)}
            </span>
            <div className="flex items-center gap-2">
              <span className="rounded bg-sky-500/20 px-2 py-0.5 text-[10px] font-semibold text-sky-300">
                {100 - feePercentage}% Subsidy
              </span>
              <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                {feePercentage}% Fees
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-baseline justify-between gap-4">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl sm:text-4xl font-black text-white">
                {totalRewardBtc}
              </span>
              <span className="text-base font-bold text-emerald-400">BTC</span>
              <span className="text-xs text-zinc-400">
                (~${(totalRewardBtc * 65000).toLocaleString()})
              </span>
            </div>
            <div className="font-mono text-[11px] text-zinc-400 bg-black/60 px-3 py-1.5 rounded-lg border border-zinc-800">
              vout[0]: bc1qminer_address_92f7...
            </div>
          </div>

          {/* Visual Percentage Bar */}
          <div className="mt-4">
            <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden flex">
              <div
                className="bg-sky-500 transition-all duration-300"
                style={{ width: `${100 - feePercentage}%` }}
                title="Subsidy"
              />
              <div
                className="bg-amber-500 transition-all duration-300"
                style={{ width: `${feePercentage}%` }}
                title="Transaction Fees"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   Module 3: Halving Schedule & Fixed Supply Curve (Section 13.2)
   Theme: "Halving Schedule and Fixed Supply (Declining Inflation to 21 Million)"
   ========================================================================= */

interface HalvingEra {
  era: number;
  years: string;
  blocks: string;
  subsidy: string;
  inflation: string;
  totalMined: string;
  percentMined: number;
}

const HALVING_ERAS: HalvingEra[] = [
  { era: 1, years: "2009–2012", blocks: "0 – 209,999", subsidy: "50 BTC", inflation: "High (Launch)", totalMined: "10,500,000", percentMined: 50 },
  { era: 2, years: "2012–2016", blocks: "210,000 – 419,999", subsidy: "25 BTC", inflation: "8.4%", totalMined: "15,750,000", percentMined: 75 },
  { era: 3, years: "2016–2020", blocks: "420,000 – 629,999", subsidy: "12.5 BTC", inflation: "3.7%", totalMined: "18,375,000", percentMined: 87.5 },
  { era: 4, years: "2020–2024", blocks: "630,000 – 839,999", subsidy: "6.25 BTC", inflation: "1.8%", totalMined: "19,687,500", percentMined: 93.75 },
  { era: 5, years: "2024–2028 (Now)", blocks: "840,000 – 1,049,999", subsidy: "3.125 BTC", inflation: "0.85%", totalMined: "20,343,750", percentMined: 96.875 },
  { era: 6, years: "2028–2032", blocks: "1,050,000 – 1,259,999", subsidy: "1.5625 BTC", inflation: "0.4%", totalMined: "20,671,875", percentMined: 98.4 },
  { era: 7, years: "2032–2036", blocks: "1,260,000 – 1,469,999", subsidy: "0.78125 BTC", inflation: "0.2%", totalMined: "20,835,937", percentMined: 99.2 },
  { era: 34, years: "~2140", blocks: "6,930,000+", subsidy: "0 BTC", inflation: "0.00%", totalMined: "21,000,000", percentMined: 100 },
];

function HalvingScheduleRepresentation({ isTi }: ModuleProps) {
  const [selectedEraIdx, setSelectedEraIdx] = useState<number>(4); // Default to current era 5 (2024-2028)
  const currentEra = HALVING_ERAS[selectedEraIdx];

  return (
    <div className={panelClass}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
            <TrendingDown className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-400">
                {t({ en: "Section 13.2 Representation", ti: "ክፍሊ 13.2 ምርኢት" }, isTi)}
              </span>
              <span className="text-xs text-zinc-400">
                {t({ en: "Fixed Supply & Monetary Policy", ti: "ቀዋሚ ቀረብን ገንዘባዊ ፖሊሲን" }, isTi)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100">
              {t(
                {
                  en: "The Halving Curve: Mathematical Scarcity Written in Stone",
                  ti: "ናይ ፍርቂ ምጉዳል መደብ፦ ኣብ እምኒ ዝተወቕረ ሒሳባዊ ውሑድነት",
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
            en: "Every 210,000 blocks (roughly every 4 years), the block subsidy is cut exactly in half. Unlike central banks that inflate fiat currencies arbitrarily, Bitcoin's issuance rate is mathematically predictable and asymptotically halts at exactly 21,000,000 BTC.",
            ti: "ኣብ ነፍሲ ወከፍ 210,000 ብሎክ (ኣስታት ኣብ ነፍሲ ወከፍ 4 ዓመት)፡ እቲ ናይ ብሎክ ድጎማ ብትኽክል ብፍርቂ ይቑረጽ። ከም ማእከላይ ባንክታት ብድላዮም ገንዘብ ዘሕትሙ ዘይኮነስ፡ ናይ ቢትኮይን ምፍራይ ብሒሳብ ክትፈልጦ ዝከኣል ኮይኑ፡ ኣብ ልክዕ 21,000,000 BTC ደው ይብል።",
          },
          isTi
        )}
      </p>

      {/* Supply Progress Bar to 21M */}
      <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-300 font-semibold">
            {t({ en: "Total Bitcoin Supply Progress:", ti: "ጠቕላላ ናይ ቢትኮይን ቀረብ ምዕባለ፦" }, isTi)}
          </span>
          <span className="font-mono text-purple-400 font-bold">
            {currentEra.percentMined}% Mined ({currentEra.totalMined} / 21,000,000 BTC)
          </span>
        </div>
        <div className="h-3 w-full rounded-full bg-zinc-800 overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-purple-500 to-emerald-400 transition-all duration-500 rounded-full"
            style={{ width: `${currentEra.percentMined}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
          <span>0 BTC (2009)</span>
          <span>10.5M (2012)</span>
          <span>15.75M (2016)</span>
          <span>18.37M (2020)</span>
          <span className="text-purple-400 font-bold">19.7M+ (Today)</span>
          <span>21.0M Cap (~2140)</span>
        </div>
      </div>

      {/* Halving Era Selector Strip */}
      <div className="mt-6">
        <div className="text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
          {t({ en: "Select a Halving Epoch to Inspect:", ti: "ዝርዝር ንምርኣይ ናይ ፍርቂ ምጉዳል እዋን ምረጽ፦" }, isTi)}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {HALVING_ERAS.map((era, i) => (
            <button
              key={era.era}
              onClick={() => setSelectedEraIdx(i)}
              className={`rounded-lg p-2.5 text-center border transition-all cursor-pointer ${
                selectedEraIdx === i
                  ? "border-purple-500 bg-purple-950/40 text-white shadow-md shadow-purple-500/20"
                  : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
              }`}
            >
              <div className="text-[10px] uppercase font-bold text-zinc-500">
                Era {era.era}
              </div>
              <div className="text-xs font-mono font-bold mt-0.5 text-zinc-200">
                {era.subsidy}
              </div>
              <div className="text-[9px] text-purple-300 mt-1">
                {era.years.split(" ")[0]}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Era Spotlight Card */}
      <div className="mt-4 rounded-xl border border-purple-500/30 bg-purple-950/20 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-500/20 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-purple-400" />
            <span className="font-bold text-white text-sm">
              {t({ en: "Epoch Details:", ti: "ዝርዝር እዋን፦" }, isTi)} {currentEra.years} (Era {currentEra.era})
            </span>
            {selectedEraIdx === 4 && (
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                {t({ en: "Current Era", ti: "ናይ ሕጂ እዋን" }, isTi)}
              </span>
            )}
          </div>
          <div className="font-mono text-xs text-zinc-400">
            {t({ en: "Block Range:", ti: "ወሰን ብሎክ፦" }, isTi)} {currentEra.blocks}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="rounded-lg bg-black/40 p-2.5 border border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase block font-semibold">
              {t({ en: "Block Subsidy", ti: "ናይ ብሎክ ድጎማ" }, isTi)}
            </span>
            <span className="font-mono text-base font-bold text-purple-300 mt-0.5 block">
              {currentEra.subsidy}
            </span>
          </div>

          <div className="rounded-lg bg-black/40 p-2.5 border border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase block font-semibold">
              {t({ en: "Annual Inflation", ti: "ዓመታዊ ዝቕባበ" }, isTi)}
            </span>
            <span className="font-mono text-base font-bold text-amber-300 mt-0.5 block">
              {currentEra.inflation}
            </span>
          </div>

          <div className="rounded-lg bg-black/40 p-2.5 border border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase block font-semibold">
              {t({ en: "Cumulative Coins", ti: "ጠቕላላ ዝተዓደነ" }, isTi)}
            </span>
            <span className="font-mono text-base font-bold text-emerald-400 mt-0.5 block">
              {currentEra.totalMined}
            </span>
          </div>

          <div className="rounded-lg bg-black/40 p-2.5 border border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase block font-semibold">
              {t({ en: "Total Supply Issued", ti: "ሚእታዊት ቀረብ" }, isTi)}
            </span>
            <span className="font-mono text-base font-bold text-sky-300 mt-0.5 block">
              {currentEra.percentMined}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   Module 4: End of Subsidy & Fee Market 2140 (Section 13.3)
   Theme: "The 2140 Timeline: Subsidy Ends, Fee Market Secures the Network"
   ========================================================================= */

function SubsidyTimeline2140Representation({ isTi }: ModuleProps) {
  return (
    <div className={panelClass}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-400">
                {t({ en: "Section 13.3 Representation", ti: "ክፍሊ 13.3 ምርኢት" }, isTi)}
              </span>
              <span className="text-xs text-zinc-400">
                {t({ en: "The 2140 Endgame", ti: "ናይ 2140 መወዳእታ" }, isTi)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100">
              {t(
                {
                  en: "The Great Transition: From Mining Subsidy to Pure Fee Economy",
                  ti: "እቲ ዓቢ ምስግጋር፦ ካብ ናይ ብሎክ ድጎማ ናብ ምሉእ ዕዳጋ ክፍሊት",
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
            en: "By the year 2140, the block subsidy will fall to exactly zero satoshis. Bitcoin was architected from day one so that miner compensation smoothly transfers from minted coins to user transaction fees. Network security will be funded 100% by competitive block space demand.",
            ti: "ኣብ ከባቢ ዓመት 2140፡ እቲ ናይ ብሎክ ድጎማ ናብ ልክዕ ዜሮ ሳቶሺ ክወርድ እዩ። ቢትኮይን ካብ ቀዳመይቲ መዓልቱ ዝተነድፈ፡ ናይ ዓዳንቲ ኣታዊ ካብ ሓድሽ ዝሕተም ሳንቲም ቀስ ብቐስ ናብ ናይ ተጠቀምቲ ክፍሊት ትራንዛክሽን ብሰላም ንኽሰጋገር እዩ። ድሕነት እቲ መርበብ 100% ብጠለብ ቦታ ብሎክ ክፍወን እዩ።",
          },
          isTi
        )}
      </p>

      {/* Visual Transition Timeline Breakdown */}
      <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 sm:p-6 space-y-5">
        <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          {t({ en: "Evolution of Miner Revenue (Subsidy vs Fees):", ti: "ምዕባለ ኣታዊ ዓዳንቲ (ድጎማ ምስ ክፍሊት)፦" }, isTi)}
        </div>

        {/* 4 Milestones */}
        <div className="space-y-4">
          {/* Milestone 1: 2009 */}
          <div>
            <div className="flex justify-between text-xs text-zinc-300 mb-1">
              <span className="font-bold">2009 (Genesis Era)</span>
              <span className="font-mono text-zinc-400">99.9% Subsidy | 0.1% Fees</span>
            </div>
            <div className="h-3 w-full rounded-full bg-zinc-800 overflow-hidden flex">
              <div className="bg-sky-500 w-[99.9%]" />
              <div className="bg-amber-500 w-[0.1%]" />
            </div>
          </div>

          {/* Milestone 2: 2024 (Today) */}
          <div>
            <div className="flex justify-between text-xs text-zinc-300 mb-1">
              <span className="font-bold text-white">2024 (Today — Post 4th Halving)</span>
              <span className="font-mono text-zinc-300">~85% Subsidy | ~15% Fees</span>
            </div>
            <div className="h-3 w-full rounded-full bg-zinc-800 overflow-hidden flex ring-1 ring-emerald-500/50">
              <div className="bg-sky-500 w-[85%]" />
              <div className="bg-amber-500 w-[15%]" />
            </div>
          </div>

          {/* Milestone 3: 2040 */}
          <div>
            <div className="flex justify-between text-xs text-zinc-300 mb-1">
              <span className="font-bold">2040 (Subsidy Dips Below 0.2 BTC)</span>
              <span className="font-mono text-zinc-400">~40% Subsidy | ~60% Fees</span>
            </div>
            <div className="h-3 w-full rounded-full bg-zinc-800 overflow-hidden flex">
              <div className="bg-sky-500 w-[40%]" />
              <div className="bg-amber-500 w-[60%]" />
            </div>
          </div>

          {/* Milestone 4: 2140 */}
          <div>
            <div className="flex justify-between text-xs text-zinc-300 mb-1">
              <span className="font-bold text-cyan-300">2140 (Subsidy Completely Zero)</span>
              <span className="font-mono text-amber-400 font-bold">0% Subsidy | 100% Fees</span>
            </div>
            <div className="h-3 w-full rounded-full bg-zinc-800 overflow-hidden flex">
              <div className="bg-amber-500 w-full" />
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 pt-3 border-t border-zinc-800 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-sky-500" />
            <span className="text-zinc-400">{t({ en: "Minted Block Subsidy", ti: "ሓድሽ ዝተፈጥረ ድጎማ" }, isTi)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-amber-500" />
            <span className="text-zinc-400">{t({ en: "User Transaction Fees", ti: "ናይ ተጠቀምቲ ክፍሊት ትራንዛክሽን" }, isTi)}</span>
          </div>
        </div>
      </div>

      {/* Dual Pillar Explanation */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Layers className="h-4 w-4" />
            {t({ en: "Layer 1: Settlement Anchor", ti: "ብርኪ 1፦ መሰረታዊ መፍተሒ" }, isTi)}
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            {t(
              {
                en: "Base-layer block space is physically limited to ~4 million weight units (1-2 MB). Because high-value entities, banks, and layer-2 channels compete for irreversible final settlement, transaction fees naturally support the multi-billion-dollar security budget.",
                ti: "ናይ መሰረት-ብርኪ ቦታ ብሎክ ብተፈጥሮኡ ን 1-2 MB ዝተወሰነ እዩ። ዓበይቲ ትካላት፡ ባንክታትን ናይ ብርኪ-2 ቻነላትን ዘይቅየር ናይ መወዳእታ መፍተሒ ንምርካብ ስለዝወዳደሩ፡ ክፍሊት ትራንዛክሽን ብተፈጥሮኡ ነቲ ናይ ቢልዮናት ዶላር ድሕነት ይድግፎ።",
              },
              isTi
            )}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Zap className="h-4 w-4" />
            {t({ en: "Layer 2: Daily Velocity (Lightning)", ti: "ብርኪ 2፦ ዕለታዊ ቅልጣፈ (ላይትኒንግ)" }, isTi)}
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            {t(
              {
                en: "Lightning routes millions of cheap, instant sub-satoshi payments without congesting the blockchain. It periodically opens and settles net balances on Layer 1, happily paying premium on-chain miner fees while users enjoy near-free daily transactions.",
                ti: "ላይትኒንግ ንብሎክቸይን ከየጨነቐ ሚልዮናት ቅልጡፋትን ርትዓውያንን ክፍሊታት የካይድ። እቲ መርበብ ሓደ ሓደ ግዜ መዛዘሚ ሚዛናት ናብ ብርኪ 1 ብምስዳድ፡ ንዓዳንቲ እኹል ክፍሊት ይኸፍል፤ ተጠቀምቲ ድማ ብነጻ ዝቐረበ ዕለታዊ ክፍሊት ይጥቀሙ።",
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
   Master Export
   ========================================================================= */

interface Chapter13LessonProps {
  module:
    | "pow_asymmetry"
    | "coinbase_reward_anatomy"
    | "halving_schedule_curve"
    | "subsidy_timeline_2140";
  isTi?: boolean;
}

export function Chapter13InteractiveLesson({
  module,
  isTi = false,
}: Chapter13LessonProps) {
  switch (module) {
    case "pow_asymmetry":
      return <PowAsymmetryRepresentation isTi={isTi} />;
    case "coinbase_reward_anatomy":
      return <CoinbaseRewardAnatomy isTi={isTi} />;
    case "halving_schedule_curve":
      return <HalvingScheduleRepresentation isTi={isTi} />;
    case "subsidy_timeline_2140":
      return <SubsidyTimeline2140Representation isTi={isTi} />;
    default:
      return null;
  }
}
