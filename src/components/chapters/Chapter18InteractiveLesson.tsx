"use client";

import React, { useState, useEffect } from "react";
import {
  Code2,
  Clock,
  Layers,
  ShieldCheck,
  Cpu,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Key,
  Lock,
  Unlock,
  Coins,
  Send,
  Workflow,
  Sparkles,
  FileCode,
  Info,
  FastForward,
  Hourglass,
  Calendar,
  Blocks,
  XCircle,
} from "lucide-react";

interface Props {
  module: "script_types_evolution" | "timelock_policies_matrix" | "wallet_abstraction_pipeline" | "transaction_lifecycle_flow";
  isTi?: boolean;
}

export function Chapter18InteractiveLesson({ module, isTi = false }: Props) {
  // ==========================================
  // MODULE 1: SCRIPT TYPES EVOLUTION
  // ==========================================
  if (module === "script_types_evolution") {
    return <ScriptTypesEvolutionSection isTi={isTi} />;
  }

  // ==========================================
  // MODULE 2: TIMELOCKS & LIVE INTERACTIVE SIMULATOR (CLTV / CSV)
  // ==========================================
  if (module === "timelock_policies_matrix") {
    return <TimelockPoliciesSection isTi={isTi} />;
  }

  // ==========================================
  // MODULE 3: WALLET ABSTRACTION PIPELINE
  // ==========================================
  if (module === "wallet_abstraction_pipeline") {
    return <WalletAbstractionPipelineSection isTi={isTi} />;
  }

  // ==========================================
  // MODULE 4: TRANSACTION LIFECYCLE FLOW
  // ==========================================
  if (module === "transaction_lifecycle_flow") {
    return <TransactionLifecycleSection isTi={isTi} />;
  }

  return null;
}

// -------------------------------------------------------------
// MODULE 1: Script Types Evolution (Clean Comparison Matrix)
// -------------------------------------------------------------
function ScriptTypesEvolutionSection({ isTi }: { isTi: boolean }) {
  const [selectedType, setSelectedType] = useState<"p2pkh" | "p2sh" | "p2wpkh" | "p2tr">("p2wpkh");

  const scriptTypes = {
    p2pkh: {
      name: "P2PKH",
      full: isTi ? "ንሃሽ ህዝባዊ ቁልፊ ዝኽፈል (Pay-to-Public-Key-Hash)" : "Pay-to-Public-Key-Hash",
      era: "Legacy (2009)",
      prefix: "1...",
      vbytes: "148 vB (avg 1-in-2-out)",
      witnessDiscount: "None (0%)",
      privacy: isTi ? "ትሑት (ህዝባዊ ቁልፊ ኣብ ወጻኢ ይጋላጽ)" : "Low (Pubkey exposed at spend)",
      scriptPubKey: "OP_DUP OP_HASH160 <PubKeyHash> OP_EQUALVERIFY OP_CHECKSIG",
      unlocking: "<Sig> <PubKey>",
      summary: isTi
        ? "እቲ ቀዳማይ መበቆላዊ ስክሪፕት ቢትኮይን እዩ። ህዝባዊ ቁልፍን ፊርማን ኣብ ውሽጢ ScriptSig ብሓባር ይለኣኹ፡ እዚ ድማ ናይ ትራንዛክሽን ዓቐንን ክፍሊትን የዕብዮ።"
        : "The original Satoshi-era format. Signatures and public keys sit in the ScriptSig payload, occupying full non-discounted block space.",
    },
    p2sh: {
      name: "P2SH",
      full: isTi ? "ንሃሽ ስክሪፕት ዝኽፈል (Pay-to-Script-Hash - BIP16)" : "Pay-to-Script-Hash (BIP16)",
      era: "BIP16 (2012)",
      prefix: "3...",
      vbytes: "297 vB (2-of-3 multi-sig)",
      witnessDiscount: "None (0%)",
      privacy: isTi ? "ማእከላይ (ቅድሚ ወጻኢ ይሕባእ፡ ኣብ ወጻኢ ይግሃድ)" : "Medium (Hidden until spent, then script revealed)",
      scriptPubKey: "OP_HASH160 <RedeemScriptHash> OP_EQUAL",
      unlocking: "<Sig1> <Sig2> ... <RedeemScript>",
      summary: isTi
        ? "ዝተሓላለኹ ቅድመ-ኩነታት (ከም ማልቲ-ሲግ) ብድሕሪ 20-ባይት ሃሽ ይሕባኡ። እቲ ከፋሊ ዝተሓላለኸ ስክሪፕት ዘይኮነስ ቀሊል ናይ ሃሽ ኣድራሻ ጥራይ ይርኢ።"
        : "Encapsulates arbitrary complex conditions (like multi-sig) behind a compact 20-byte hash. Sender only needs an address starting with '3'.",
    },
    p2wpkh: {
      name: "P2WPKH",
      full: isTi ? "ንሃሽ ምስክር ህዝባዊ ቁልፊ ዝኽፈል (Native SegWit - BIP141)" : "Native SegWit (BIP141)",
      era: "SegWit (2017)",
      prefix: "bc1q...",
      vbytes: "68 vB (38%–45% fee savings)",
      witnessDiscount: "Yes (75% discount on witness data)",
      privacy: isTi ? "ዝሓሸ (ናይ ትራንዛክሽን ምግርጫው ይፈትሕ)" : "Good (Eliminates tx malleability, cheaper)",
      scriptPubKey: "OP_0 <20-byte PubKeyHash>",
      unlocking: "Witness Stack: [<Sig>, <PubKey>]",
      summary: isTi
        ? "ዳታ ምስክር (ፊርማታትን ቁልፍታትን) ካብ መበቆላዊ ትራንዛክሽን ተፈልዩ ናብ ምስክር ንጣብ ይቕየር። 75% ናይ ክፍሊት ቅናሽ ይህብ።"
        : "Witness data is segregated out of the serialized tx tree into a dedicated discount structure, solving malleability and cutting fees by ~40%.",
    },
    p2tr: {
      name: "P2TR",
      full: isTi ? "ታፕሩት (Taproot - BIP341/342)" : "Taproot (BIP341/342)",
      era: "Taproot (2021)",
      prefix: "bc1p...",
      vbytes: "57.5 vB (Schnorr key-path)",
      witnessDiscount: "Yes (Max efficiency & aggregation)",
      privacy: isTi ? "ብሉጽ (ንጽል ፌርማን ማልቲ-ሲግን ፈጺሞም ኣይፈላለዩን)" : "Maximum (Single-sig & multi-sig look indistinguishable)",
      scriptPubKey: "OP_1 <32-byte x-only PubKey>",
      unlocking: "Key-path: [<SchnorrSig>] OR Script-path: [<WitnessScript>, <ControlBlock>]",
      summary: isTi
        ? "ናይ ሽኖር (Schnorr) ፊርማታትን MAST ዛላታትን ይጥቀም። ማልቲ-ሲግ ኣብ መርበብ ከም ንጽል ተራ ፊርማ ኮይኑ ይረአ፤ ዘይተጠቕምካሎም ናይ ስክሪፕት ጨናፍር ድማ ምስጢር ኮይኖም ይተርፉ።"
        : "Leverages Schnorr signatures and MAST (Merkelized Alternative Script Trees). Cooperative multi-sig looks identical to a standard single-sig.",
    },
  };

  return (
    <div className="my-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-5 sm:p-7 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <FileCode className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-100 sm:text-lg">
              {isTi ? "18.0 ዓይነታት ስክሪፕት ቢትኮይን (P2PKH, P2WPKH, P2SH, P2TR)" : "18.0 Bitcoin Script Standards & Locking Types"}
            </h3>
            <p className="text-xs text-zinc-400">
              {isTi ? "ካብ Legacy ክሳብ Taproot ዘሎ ናይ ክፍሊትን ብሕትውናን ዕቤት" : "Evolution from Legacy to Taproot: virtual size, fee discounts, and privacy trade-offs"}
            </p>
          </div>
        </div>
        <span className="rounded-full border border-orange-500/30 bg-orange-950/40 px-2.5 py-0.5 text-xs font-medium text-orange-300">
          {isTi ? "ናይ ስክሪፕት ደረጃታት" : "Script Standards"}
        </span>
      </div>

      {/* Evolution Tabs */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            {isTi ? "ደረጃታት ስታንዳርድ ስክሪፕት ምረጽ፦" : "Select Script Evolution Standard:"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(["p2pkh", "p2sh", "p2wpkh", "p2tr"] as const).map((key) => {
            const item = scriptTypes[key];
            const isSelected = selectedType === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedType(key)}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "border-orange-500/80 bg-orange-950/30 shadow-lg shadow-orange-950/40 ring-1 ring-orange-500/40"
                    : "border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/60 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-sm font-bold ${isSelected ? "text-orange-300" : "text-zinc-200"}`}>
                    {item.name}
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                    {item.prefix}
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 mt-1">{item.era}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Type Specs */}
        <div className="mt-4 rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
            <div>
              <span className="text-xs font-mono text-orange-400">{scriptTypes[selectedType].prefix}</span>
              <h4 className="text-sm font-bold text-zinc-100 sm:text-base">
                {scriptTypes[selectedType].name}: {scriptTypes[selectedType].full}
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-xs text-emerald-400">
                {scriptTypes[selectedType].vbytes}
              </span>
            </div>
          </div>

          <p className="mt-3 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            {scriptTypes[selectedType].summary}
          </p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg bg-zinc-950/80 p-3 border border-zinc-800">
              <span className="font-semibold text-zinc-400 block mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-orange-400" />
                {isTi ? "ናይ ምዕጻው ስክሪፕት (ScriptPubKey):" : "Locking Script (ScriptPubKey):"}
              </span>
              <code className="font-mono text-[11px] text-orange-300 break-all block bg-zinc-900 p-2 rounded border border-zinc-800/80">
                {scriptTypes[selectedType].scriptPubKey}
              </code>
            </div>

            <div className="rounded-lg bg-zinc-950/80 p-3 border border-zinc-800">
              <span className="font-semibold text-zinc-400 block mb-1 flex items-center gap-1.5">
                <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                {isTi ? "ናይ ምኽፋት ምስክር (Witness / ScriptSig):" : "Unlocking Witness / ScriptSig:"}
              </span>
              <code className="font-mono text-[11px] text-emerald-300 break-all block bg-zinc-900 p-2 rounded border border-zinc-800/80">
                {scriptTypes[selectedType].unlocking}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MODULE 2: Interactive Timelock Simulator (CLTV & CSV Sandbox)
// -------------------------------------------------------------
function TimelockPoliciesSection({ isTi }: { isTi: boolean }) {
  // Lock mode: "cltv_height" | "cltv_time" | "csv_relative"
  const [lockMode, setLockMode] = useState<"cltv_height" | "cltv_time" | "csv_relative">("cltv_height");
  
  // Transaction State
  const [spendAttemptError, setSpendAttemptError] = useState<string | null>(null);
  const [spendSuccess, setSpendSuccess] = useState<boolean>(false);

  // CLTV Height State: Current block height vs Target unlock height
  const baseHeight = 890000;
  const [currentHeight, setCurrentHeight] = useState<number>(baseHeight);
  const targetUnlockHeight = baseHeight + 5; // Unlocks at 890,005

  // CLTV Time State: Real-time countdown in seconds
  const [secondsRemaining, setSecondsRemaining] = useState<number>(60);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  // CSV Relative State: Blocks since confirmation
  const requiredCsvBlocks = 4;
  const [csvConfirmations, setCsvConfirmations] = useState<number>(0);

  // Countdown timer effect for CLTV Time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, secondsRemaining]);

  // Reset simulator
  const handleReset = () => {
    setCurrentHeight(baseHeight);
    setSecondsRemaining(60);
    setTimerRunning(false);
    setCsvConfirmations(0);
    setSpendAttemptError(null);
    setSpendSuccess(false);
  };

  // Determine if unlocked based on mode
  const isUnlocked =
    lockMode === "cltv_height"
      ? currentHeight >= targetUnlockHeight
      : lockMode === "cltv_time"
      ? secondsRemaining === 0
      : csvConfirmations >= requiredCsvBlocks;

  // Handle attempt to spend
  const handleAttemptSpend = () => {
    setSpendAttemptError(null);
    if (!isUnlocked) {
      if (lockMode === "cltv_height") {
        setSpendAttemptError(
          isTi
            ? `🚫 ናይ ቢትኮይን ስምምዕ ሕጊ ጌጋ (Consensus Error): OP_CHECKLOCKTIMEVERIFY ፈሺሉ! ሕጂ ዘሎ ናይ ብሎክ ቁመት ${currentHeight.toLocaleString()} ካብቲ ዝድለ ቁመት ${targetUnlockHeight.toLocaleString()} ኣንኢሱ ይርከብ። እቲ ሳንቲም ብሒሳብ ተዓጽዩ ኣሎ!`
            : `🚫 Consensus Rejection: OP_CHECKLOCKTIMEVERIFY failed! Current block height (${currentHeight.toLocaleString()}) is below target locktime (${targetUnlockHeight.toLocaleString()}). Full nodes reject this spend as invalid!`
        );
      } else if (lockMode === "cltv_time") {
        setSpendAttemptError(
          isTi
            ? `🚫 ናይ ቢትኮይን ስምምዕ ሕጊ ጌጋ: OP_CHECKLOCKTIMEVERIFY ፈሺሉ! እቲ ናይ ግዜ ቆጸራ ገና ${secondsRemaining} ካልኢታት ይተርፎ ኣሎ። ቅድሚ እቲ ሰዓት ምብጻሑ ዋላ ሓደ ሰብ ነዚ ገንዘብ ከውጽኦ ኣይክእልን!`
            : `🚫 Consensus Rejection: OP_CHECKLOCKTIMEVERIFY timestamp check failed! Target Unix time not yet reached (${secondsRemaining}s remaining). Coins are strictly frozen by consensus code!`
        );
      } else {
        setSpendAttemptError(
          isTi
            ? `🚫 ናይ ቢትኮይን ስምምዕ ሕጊ ጌጋ: OP_CHECKSEQUENCEVERIFY ፈሺሉ! ካብ ምምስራቱ ዝሓለፈ ብሎካት ${csvConfirmations}/${requiredCsvBlocks} ጥራይ እዩ። ገና ${requiredCsvBlocks - csvConfirmations} ተወሳኺ ብሎካት ምጽባይ የድሊ!`
            : `🚫 Consensus Rejection: OP_CHECKSEQUENCEVERIFY relative age check failed! UTXO has only ${csvConfirmations}/${requiredCsvBlocks} confirmations. Must wait ${requiredCsvBlocks - csvConfirmations} more blocks!`
        );
      }
      setSpendSuccess(false);
    } else {
      setSpendAttemptError(null);
      setSpendSuccess(true);
    }
  };

  return (
    <div className="my-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-5 sm:p-7 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-100 sm:text-lg">
              {isTi ? "18.1 ናይ ግዜ ምዕጻው ፈተነ (CLTV vs CSV Interactive Timelock Sandbox)" : "18.1 Timelock Simulator: Send & Countdown (CLTV vs CSV)"}
            </h3>
            <p className="text-xs text-zinc-400">
              {isTi ? "ቢትኮይን ብናይ ብሎክ ቁመት ወይ ግዜ ዓጽኻ ብቐጥታ ምስቲ ቆጸራ ፈትን" : "Lock bitcoin with absolute block height, calendar date, or relative confirmations with live countdown"}
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {isTi ? "ዳግማይ ጀምር" : "Reset Simulator"}
        </button>
      </div>

      {/* Mode Selector */}
      <div className="mt-5">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-2">
          {isTi ? "ዓይነት ናይ ግዜ ምዕጻው ምረጽ፦" : "Choose Timelock Mechanism to Simulate:"}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            onClick={() => {
              setLockMode("cltv_height");
              handleReset();
            }}
            className={`p-3 rounded-xl border text-left transition-all ${
              lockMode === "cltv_height"
                ? "border-orange-500 bg-orange-950/40 text-orange-200 ring-1 ring-orange-500/40 shadow-md"
                : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold">CLTV: Block Height</span>
              <Blocks className="w-4 h-4 text-orange-400" />
            </div>
            <p className="text-[11px] opacity-80">
              {isTi ? "ፍጹም ናይ ብሎክ ቁመት (Lock until Block #)" : "Absolute lock until specific block height"}
            </p>
          </button>

          <button
            onClick={() => {
              setLockMode("cltv_time");
              handleReset();
            }}
            className={`p-3 rounded-xl border text-left transition-all ${
              lockMode === "cltv_time"
                ? "border-blue-500 bg-blue-950/40 text-blue-200 ring-1 ring-blue-500/40 shadow-md"
                : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold">CLTV: Countdown Timer</span>
              <Calendar className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-[11px] opacity-80">
              {isTi ? "ፍጹም ናይ ግዜ ቆጸራ (Lock until Date/Time)" : "Absolute lock until Unix timestamp / date"}
            </p>
          </button>

          <button
            onClick={() => {
              setLockMode("csv_relative");
              handleReset();
            }}
            className={`p-3 rounded-xl border text-left transition-all ${
              lockMode === "csv_relative"
                ? "border-amber-500 bg-amber-950/40 text-amber-200 ring-1 ring-amber-500/40 shadow-md"
                : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold">CSV: Relative Blocks</span>
              <Hourglass className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-[11px] opacity-80">
              {isTi ? "ተዛማዲ ካብ ዝተረጋገጸሉ (Relative delay since spendable)" : "Relative delay after UTXO confirmation"}
            </p>
          </button>
        </div>
      </div>

      {/* Vault Status Cockpit */}
      <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
              isUnlocked
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-rose-500/10 border-rose-500/30 text-rose-400"
            }`}>
              {isUnlocked ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-zinc-100">
                  UTXO: 0.05000000 BTC
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  isUnlocked ? "bg-emerald-950 text-emerald-300 border border-emerald-800" : "bg-rose-950 text-rose-300 border border-rose-800"
                }`}>
                  {isUnlocked
                    ? isTi ? "ተኸፊቱ (SPENDABLE)" : "UNLOCKED (SPENDABLE)"
                    : isTi ? "ተዓጽዩ (FROZEN BY SCRIPT)" : "LOCKED (FROZEN BY SCRIPT)"}
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                Script: {lockMode.startsWith("cltv") ? "OP_CHECKLOCKTIMEVERIFY (CLTV)" : "OP_CHECKSEQUENCEVERIFY (CSV)"}
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Countdown / Progress Display */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left: Progression & Live Action */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 flex flex-col justify-between">
            {lockMode === "cltv_height" && (
              <div>
                <span className="text-xs font-semibold text-zinc-400 block mb-2">
                  {isTi ? "ናይ ብሎክ ቁመት ምዕጻው (CLTV Block Height):" : "Block Height Lock Status:"}
                </span>
                <div className="flex items-baseline justify-between font-mono my-2">
                  <div className="text-xs text-zinc-400">
                    {isTi ? "ሕጂ ዘሎ ብሎክ፦" : "Current Height:"}
                    <div className="text-base font-bold text-zinc-100">{currentHeight.toLocaleString()}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-600" />
                  <div className="text-xs text-orange-400 text-right">
                    {isTi ? "ዝኽፈተሉ ብሎክ፦" : "Unlock Target:"}
                    <div className="text-base font-bold text-orange-300">{targetUnlockHeight.toLocaleString()}</div>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-xs text-zinc-400 mb-1">
                    <span>{isTi ? "ዝተረፈ ብሎካት፦" : "Remaining Blocks:"}</span>
                    <span className="font-mono font-bold text-orange-300">
                      {Math.max(0, targetUnlockHeight - currentHeight)} blocks (~{Math.max(0, (targetUnlockHeight - currentHeight) * 10)} min)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-orange-500 transition-all duration-300"
                      style={{
                        width: `${Math.min(100, Math.max(0, ((currentHeight - baseHeight) / 5) * 100))}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setCurrentHeight((prev) => prev + 1)}
                    disabled={isUnlocked}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-orange-600 text-white hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <Blocks className="w-3.5 h-3.5" />
                    {isTi ? "+1 ብሎክ ኣፍሪ (Mine 1 Block)" : "Mine 1 Block (+1)"}
                  </button>
                  <button
                    onClick={() => setCurrentHeight(targetUnlockHeight)}
                    disabled={isUnlocked}
                    className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold bg-zinc-800 text-zinc-200 hover:bg-zinc-700 disabled:opacity-40 transition"
                  >
                    <FastForward className="w-3.5 h-3.5" />
                    {isTi ? "ናብ መወዳእታ ዝለል" : "Fast-Forward"}
                  </button>
                </div>
              </div>
            )}

            {lockMode === "cltv_time" && (
              <div>
                <span className="text-xs font-semibold text-zinc-400 block mb-2">
                  {isTi ? "ናይ ሰዓት ቆጸራ (Real-Time Unix Timestamp Countdown):" : "Timestamp Countdown Timer:"}
                </span>

                <div className="my-3 text-center py-3 bg-zinc-900 rounded-lg border border-zinc-800">
                  <div className="font-mono text-3xl font-black text-blue-400 tracking-wider">
                    00:{secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining}
                  </div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1 block">
                    {secondsRemaining === 0 ? "Target Timestamp Reached!" : "Seconds Remaining until Unlock"}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setTimerRunning(!timerRunning)}
                    disabled={secondsRemaining === 0}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-40 transition"
                  >
                    <Play className="w-3.5 h-3.5" />
                    {timerRunning ? (isTi ? "ኣዕርፍ" : "Pause Timer") : (isTi ? "ቆጸራ ጀምር" : "Start Countdown")}
                  </button>
                  <button
                    onClick={() => setSecondsRemaining((prev) => Math.max(0, prev - 15))}
                    disabled={secondsRemaining === 0}
                    className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold bg-zinc-800 text-zinc-200 hover:bg-zinc-700 disabled:opacity-40 transition"
                  >
                    <FastForward className="w-3.5 h-3.5" />
                    -15s
                  </button>
                  <button
                    onClick={() => setSecondsRemaining(0)}
                    disabled={secondsRemaining === 0}
                    className="flex items-center justify-center gap-1 px-2.5 py-2 rounded-lg text-xs font-semibold bg-zinc-800 text-zinc-200 hover:bg-zinc-700 disabled:opacity-40 transition"
                    title="Unlock Now"
                  >
                    0s
                  </button>
                </div>
              </div>
            )}

            {lockMode === "csv_relative" && (
              <div>
                <span className="text-xs font-semibold text-zinc-400 block mb-2">
                  {isTi ? "ተዛማዲ ናይ ብሎክ ቆጸራ (Relative Confirmations):" : "Relative Confirmations (CSV):"}
                </span>

                <div className="my-2 p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-zinc-400">{isTi ? "ካብ ምፍጣሩ ዝሓለፈ ምርጋጻት፦" : "Confirmations Elapsed:"}</span>
                    <span className="font-mono text-amber-400 font-bold">
                      {csvConfirmations} / {requiredCsvBlocks} blocks
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5">
                    {[1, 2, 3, 4].map((blockNum) => {
                      const confirmed = csvConfirmations >= blockNum;
                      return (
                        <div
                          key={blockNum}
                          className={`p-2 rounded text-center text-xs font-mono font-bold border transition ${
                            confirmed
                              ? "bg-amber-950/80 border-amber-500 text-amber-300"
                              : "bg-zinc-950 border-zinc-800 text-zinc-600"
                          }`}
                        >
                          Block {blockNum}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => setCsvConfirmations((prev) => Math.min(requiredCsvBlocks, prev + 1))}
                    disabled={isUnlocked}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-amber-600 text-white hover:bg-amber-500 disabled:opacity-40 transition"
                  >
                    <Blocks className="w-3.5 h-3.5" />
                    {isTi ? "ተወሳኺ 1 ምርጋጽ ኣፍሪ (+1 Confirm)" : "+1 Confirmation"}
                  </button>
                  <button
                    onClick={() => setCsvConfirmations(requiredCsvBlocks)}
                    disabled={isUnlocked}
                    className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold bg-zinc-800 text-zinc-200 hover:bg-zinc-700 disabled:opacity-40 transition"
                  >
                    <FastForward className="w-3.5 h-3.5" />
                    {isTi ? "ምሉእ ብሎካት" : "Complete (4/4)"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Spend Execution & Consensus Enforcement */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-zinc-400 block mb-2">
                {isTi ? "ናይ ወጻኢ ፈተነ (Spend Attempt on Network):" : "Transaction Spending Execution:"}
              </span>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {isTi
                  ? "ቅድሚ እቲ ናይ ግዜ ወይ ቁመት ቆጸራ ምዝዛሙ ነዚ ሳንቲም ንምውጻእ ፈትን። ቢትኮይን ኖዳት ብኸመይ ንሕጊ ስምምዕ ከም ዘኽብርዎ ተመልከት።"
                  : "Try broadcasting a spending transaction while the lock is active. Observe how full nodes enforce consensus rules without trusting anyone."}
              </p>

              {spendAttemptError && (
                <div className="mt-3 p-3 rounded-lg border border-rose-500/50 bg-rose-950/40 text-rose-200 text-xs leading-relaxed flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{spendAttemptError}</span>
                </div>
              )}

              {spendSuccess && (
                <div className="mt-3 p-3 rounded-lg border border-emerald-500/50 bg-emerald-950/40 text-emerald-200 text-xs leading-relaxed flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    {isTi
                      ? "🎉 ብዓወት ተፈሪሙን ተኸፊቱን! እቲ ናይ ግዜ ምዕጻው ተዛዚሙ እዩ። ኖዳት ነቲ ትራንዛክሽን ብምጽዳቕ ናብ ሜምፑል ኣእትዮምዎ!"
                      : "🎉 Success! Timelock conditions fully satisfied! Full nodes accepted your unlocking script and admitted the 0.05 BTC spend to the mempool!"}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800">
              <button
                onClick={handleAttemptSpend}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                  isUnlocked
                    ? "bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-950/50"
                    : "bg-rose-700/80 text-white hover:bg-rose-600"
                }`}
              >
                {isUnlocked ? (
                  <>
                    <Unlock className="w-4 h-4" />
                    {isTi ? "ሳንቲምካ ወስድ (Claim 0.05 BTC Now)" : "Claim & Spend 0.05 BTC Now"}
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    {isTi ? "ቅድሚ ግዜኡ ንምውጻእ ፈትን (Attempt Early Spend)" : "Attempt Spend Now (Will Test Consensus)"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MODULE 3: How Wallets Abstract Scripts (7-Step Pipeline)
// -------------------------------------------------------------
function WalletAbstractionPipelineSection({ isTi }: { isTi: boolean }) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: "01",
      title: isTi ? "ኣድራሻ ዲኮድ ምግባር (Address Decoding)" : "Address Decoding & ScriptPubKey",
      userSees: isTi ? "ተጠቃሚ ን bc1q... ዝብል ኣድራሻ ይለጥፍ" : "User pastes address: 'bc1q9w...'",
      underTheHood: isTi
        ? "እቲ ዋሌት ነቲ Bech32m checksum ይምርምሮ። ካብቲ ኣድራሻ 20-ባይት witness program ኣውጺኡ ናይ OP_0 <PubKeyHash> ScriptPubKey ይፈጥር።"
        : "Wallet parses Bech32 checksum, decodes the 20-byte witness program, and constructs the destination 'OP_0 <PubKeyHash>' ScriptPubKey.",
      icon: Lock,
    },
    {
      num: "02",
      title: isTi ? "ምምራጽ ሳንቲማት (Coin Selection)" : "Coin Selection (Branch & Bound)",
      userSees: isTi ? "ተጠቃሚ 0.05 BTC ክሰድድ ይጽሕፍ" : "User specifies: 'Send 0.05 BTC'",
      underTheHood: isTi
        ? "ዋሌት ኣብ ውሽጢ UTXO ዳታቤዝ ብምእታው ንክፍሊትን መጠንን ዝምጥኑ UTXOታት ይሓሪ። ዘየድሊ ተረፍ (Change dust) ከይፍጠር ይከላኸል።"
        : "Wallet algorithms (Branch and Bound / Knapsack) iterate over confirmed UTXOs to find an exact or cost-effective match without creating tiny dust change.",
      icon: Coins,
    },
    {
      num: "03",
      title: isTi ? "ናይ ክፍሊት ገምጋምን ምቕራጽን (Fee Estimation)" : "Fee & Virtual Size Calculation",
      userSees: isTi ? "ተጠቃሚ 'ቅልጡፍ (Fast)' ዝብል ይመርጽ" : "User selects: 'Priority / Fast'",
      underTheHood: isTi
        ? "ካብ ሜምፑል (Mempool) sat/vB ይወስድ። ናይቲ ትራንዛክሽን ምሉእ vB ብምሕሳብ ትክክለኛ ናይ ሳቶሺ ክፍሊት የሰላስል።"
        : "Fetches live mempool sat/vB rate. Computes virtual size (vB) accounting for witness discount (weight units / 4) and determines exact satoshi fee.",
      icon: Cpu,
    },
    {
      num: "04",
      title: isTi ? "PSBT ምህናጽ (Constructing Unsigned PSBT)" : "Unsigned PSBT Construction (BIP174)",
      userSees: isTi ? "'ቀጻሊ' ዝብል መልጎም ይጥውቕ" : "User clicks: 'Review Transaction'",
      underTheHood: isTi
        ? "ዘይተፈርመ BIP174 Partially Signed Bitcoin Transaction ይዳሎ። እታዎታት፡ ውጽኢታትን ናይ ተመላሲ ኣድራሻን ይውደቡ።"
        : "Packages inputs, target output, and change output into a BIP174 Partially Signed Bitcoin Transaction ready for offline verification.",
      icon: FileCode,
    },
    {
      num: "05",
      title: isTi ? "ምስጢራዊ ምፍራም (Hardware Signing)" : "Hardware Device Signing Isolation",
      userSees: isTi ? "ኣብ ስክሪን ሃርድዌር መርሚሩ የጽድቕ" : "User reviews details on Coldcard/Keystone screen",
      underTheHood: isTi
        ? "እቲ ብሕታዊ ቁልፊ ካብቲ ውሑስ ቺፕ ከይወጸ፡ ነቲ ናይ ትራንዛክሽን hashPreimage ብ ECDSA ወይ Schnorr ፈሪሙ ናይ ፊርማ ባይት የውጽእ።"
        : "Private key never touches internet-connected memory. The secure element signs the transaction sighash preimage and returns only raw signature bytes.",
      icon: Key,
    },
    {
      num: "06",
      title: isTi ? "ምስክር ምውህሃድን ምዕሻግን (Witness Injection)" : "Witness Finalization & Raw Hex Assembly",
      userSees: isTi ? "ናይ ምጽዳቕ ምልክት ይርኢ" : "App shows: 'Ready to Broadcast'",
      underTheHood: isTi
        ? "እቲ ዋሌት ነቲ ፊርማ ናብቲ ናይ ምስክር ንጣብ (Witness stack) የእትዎ። ምሉእ ናይ ትራንዛክሽን Hex ስትሪንግ ይዳሎ።"
        : "Coordinator injects signature bytes into the witness stack for each input, serializes all fields into a raw consensus-valid hexadecimal string.",
      icon: Workflow,
    },
    {
      num: "07",
      title: isTi ? "ናብ መርበብ ምፍናው (P2P Network Broadcast)" : "P2P Gossip & Mempool Ingestion",
      userSees: isTi ? "ትራንዛክሽን ተላኢኻ!" : "App displays: 'Broadcasted! Tracking confirmations...'",
      underTheHood: isTi
        ? "እቲ ዋሌት ነቲ Raw Hex ብናይ ቢትኮይን ኖድ P2P inv/tx መልእኽቲ ገይሩ ናብ ኩለን መርበባት ቢትኮይን ይዝርግሖ።"
        : "The signed hex is sent over TCP port 8333 to connected Bitcoin Core peers via peer-to-peer gossip protocol. Nodes validate and admit it to mempool.",
      icon: Send,
    },
  ];

  return (
    <div className="my-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-5 sm:p-7 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-100 sm:text-lg">
              {isTi ? "18.2 ዋሌት ንስክሪፕት ብኸመይ የቃልሎ (The Wallet Abstraction Pipeline)" : "18.2 How Wallets Abstract Script: Under-the-Hood Engine"}
            </h3>
            <p className="text-xs text-zinc-400">
              {isTi ? "ተጠቃሚ ካብ ዝርእዮ ቀሊል ስክሪን ጀሚሩ ክሳብ እቲ ውሽጣዊ ናይ ስክሪፕት ስራሕ" : "Comparing the simple user interface with the multi-stage cryptographic assembly engine"}
            </p>
          </div>
        </div>
      </div>

      {/* Stepper Selector */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5">
        {steps.map((st, idx) => {
          const isCurrent = idx === activeStep;
          const IconComp = st.icon;
          return (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isCurrent
                  ? "border-orange-500 bg-orange-950/40 text-orange-300 shadow-md ring-1 ring-orange-500/30"
                  : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-mono text-[10px] font-bold">{st.num}</span>
                <IconComp className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-semibold line-clamp-1">
                {st.title.split("(")[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Step Detail Card */}
      <div className="mt-5 rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-mono text-xs font-bold">
            Step {steps[activeStep].num}
          </span>
          <h4 className="text-sm sm:text-base font-bold text-zinc-100">
            {steps[activeStep].title}
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              {isTi ? "እቲ ተጠቃሚ ዝርእዮ (User Experience Interface):" : "What the User Experiences:"}
            </span>
            <p className="text-xs sm:text-sm text-zinc-200 font-medium">
              "{steps[activeStep].userSees}"
            </p>
          </div>

          <div className="rounded-lg border border-orange-500/30 bg-orange-950/20 p-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-orange-400 block mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-orange-400" />
              {isTi ? "ኣብ ውሽጢ ስክሪፕት ዝፍጸም (Script Engine Reality):" : "Under-the-Hood Script Execution:"}
            </span>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {steps[activeStep].underTheHood}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MODULE 4: Transaction Lifecycle Flow
// -------------------------------------------------------------
function TransactionLifecycleSection({ isTi }: { isTi: boolean }) {
  const [selectedPhase, setSelectedPhase] = useState<number>(0);

  const phases = [
    {
      phase: isTi ? "1. ምፍጣር (Create)" : "1. Create & Input Selection",
      desc: isTi
        ? "ወናኒ ንሓደ ወይ ብዙሓት ዘይወዓሉ UTXOታት (Inputs) ይሓሪ። ነቲ ዝስደድ መጠንን ዝምለስ ተረፍን (Outputs) ይውስን።"
        : "Spender selects one or more unspent transaction outputs (UTXOs). Allocates satoshis between recipient destination and change address.",
      scriptRole: isTi
        ? "ነፍሲ ወከፍ Input ናይቲ ዝሓለፈ ትራንዛክሽን TXIDን vout ኢንዴክስን የጠቓልል።"
        : "Each input references an existing outpoint (TxID + index) holding an active locking script.",
    },
    {
      phase: isTi ? "2. ምዕጻው (Lock)" : "2. Defining Output Locks",
      desc: isTi
        ? "ነፍሲ ወከፍ ውጽኢት ሓድሽ ናይ ምዕጻው ስክሪፕት (ScriptPubKey) ይዕጠቕ።"
        : "Every created output is assigned a cryptographic challenge (ScriptPubKey) that dictates how it can be unlocked in the future.",
      scriptRole: isTi
        ? "ንኣብነት፡ ንP2WPKH OP_0 <20-ባይት ሃሽ>፡ ወይ ንማልቲ-ሲግ 2-ካብ-3 P2WSH/P2TR የቐምጥ።"
        : "Defines consensus conditions: e.g. OP_0 <20-byte-hash> (P2WPKH) or Taproot MAST leaf condition.",
    },
    {
      phase: isTi ? "3. ምፍራምን ምኽፋትን (Sign / Unlock)" : "3. Signing & Satisfying Witness",
      desc: isTi
        ? "እቲ ወናኒ ብናይ ብሕቲ ቁልፉ ተጠቒሙ ነቲ ናይ ምዕጻው ስክሪፕት ዘዕግብ ናይ ምኽፋት ስክሪፕት (ScriptWitness) የዳልው።"
        : "Owner signs the transaction sighash digest with their private key, creating cryptographic proof that satisfies the output lock.",
      scriptRole: isTi
        ? "ፊርማታትን ምስክራትን ናብቲ ትራንዛክሽን ይውሰኹ።"
        : "Pushes valid signatures and public keys matching the lock's cryptographic hash.",
    },
    {
      phase: isTi ? "4. ምርግጋጽ ኖዳት (Validate)" : "4. Node Stack Validation",
      desc: isTi
        ? "ነፍሲ ወከፍ ናጻ ቢትኮይን ኖድ (Full Node) ነቲ ናይ ምኽፋትን ምዕጻውን ስክሪፕት ኣብ ናይ ስታክ ማሽን የካይዶ።"
        : "Every independent full node executes Unlocking Script + Locking Script sequentially on its Forth-like stack engine.",
      scriptRole: isTi
        ? "እቲ ስታክ 1 (ቅኑዕ) ምስ መለሰ ጥራይ እዩ እቲ ትራንዛክሽን ቅቡል ዝኸውን። ጌጋ እንተሃልዩ ብኡንብኡ ይድርበ።"
        : "Node asserts that the script evaluation terminates without errors and with [ 1 / TRUE ] on top. Invalid scripts are rejected instantly.",
    },
    {
      phase: isTi ? "5. ምፍናውን ምጽዳቕን (Broadcast & Mine)" : "5. Mempool Gossip & Inclusion",
      desc: isTi
        ? "ቅኑዕ ትራንዛክሽን ናብ ሜምፑል ይኣቱ፡ ማይነራት ድማ ኣብ ሓድሽ ብሎክ ጠሚሮም Proof-of-Work ይሰርሑሉ።"
        : "Valid transaction is admitted to mempools globally, packaged into a candidate block by miners, and permanently sealed into the blockchain.",
      scriptRole: isTi
        ? "እቶም ዝወዓሉ UTXOታት ይስረዙ፡ እቶም ሓደሽቲ ውጽኢታት ድማ ኣብ UTXO Set (chainstate) ይምዝገቡ።"
        : "Consensus state updates: spent UTXOs are removed from the chainstate set, and new outputs become spendable.",
    },
  ];

  return (
    <div className="my-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-5 sm:p-7 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <Workflow className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-100 sm:text-lg">
              {isTi ? "18.3 ምሉእ ናይ ትራንዛክሽን ዋሕዚ (Transaction Lifecycle Architecture)" : "18.3 Transaction Lifecycle & Script Execution Pipeline"}
            </h3>
            <p className="text-xs text-zinc-400">
              {isTi ? "ምፍጣር → ምዕጻው → ምፍራም → ምርግጋጽ → ምፍናው" : "Create → Lock → Sign → Validate → Broadcast"}
            </p>
          </div>
        </div>
      </div>

      {/* Lifecycle Flow Horizontal Track */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-5 gap-2">
        {phases.map((p, idx) => {
          const isSelected = selectedPhase === idx;
          return (
            <button
              key={idx}
              onClick={() => setSelectedPhase(idx)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? "border-orange-500 bg-orange-950/40 text-orange-200 ring-1 ring-orange-500/40 shadow-lg"
                  : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
              }`}
            >
              <span className="font-mono text-xs font-bold mb-1">0{idx + 1}</span>
              <span className="text-xs font-semibold">{p.phase.split(" ")[1]}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Phase Detail */}
      <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h4 className="text-sm sm:text-base font-bold text-zinc-100 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-orange-400" />
            {phases[selectedPhase].phase}
          </h4>
          <span className="text-xs font-mono text-zinc-400">
            Phase {selectedPhase + 1} of 5
          </span>
        </div>

        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg bg-zinc-950 p-4 border border-zinc-800">
            <span className="text-xs font-semibold text-zinc-400 block mb-1">
              {isTi ? "ሓፈሻዊ መስርሕ፦" : "Network Protocol Action:"}
            </span>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {phases[selectedPhase].desc}
            </p>
          </div>

          <div className="rounded-lg bg-orange-950/20 p-4 border border-orange-500/30">
            <span className="text-xs font-semibold text-orange-400 block mb-1 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-orange-400" />
              {isTi ? "ተራ ናይ ቢትኮይን ስክሪፕት፦" : "Role of Bitcoin Script in this Phase:"}
            </span>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {phases[selectedPhase].scriptRole}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
