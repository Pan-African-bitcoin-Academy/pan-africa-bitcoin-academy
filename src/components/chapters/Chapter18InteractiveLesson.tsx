"use client";

import React, { useState } from "react";
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
} from "lucide-react";

interface Props {
  module: "script_types_evolution" | "timelock_policies_matrix" | "wallet_abstraction_pipeline" | "transaction_lifecycle_flow";
  isTi?: boolean;
}

export function Chapter18InteractiveLesson({ module, isTi = false }: Props) {
  // ==========================================
  // MODULE 1: SCRIPT TYPES EVOLUTION & STACK MACHINE
  // ==========================================
  if (module === "script_types_evolution") {
    return <ScriptTypesEvolutionSection isTi={isTi} />;
  }

  // ==========================================
  // MODULE 2: TIMELOCKS & POLICY MATRIX (CLTV / CSV)
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
// MODULE 1: Script Types Evolution & Stack Machine Visualizer
// -------------------------------------------------------------
function ScriptTypesEvolutionSection({ isTi }: { isTi: boolean }) {
  const [selectedType, setSelectedType] = useState<"p2pkh" | "p2sh" | "p2wpkh" | "p2tr">("p2wpkh");
  const [stackStep, setStackStep] = useState(0);

  const scriptTypes = {
    p2pkh: {
      name: "P2PKH",
      full: isTi ? "ንሃሽ ህዝባዊ ቁልፊ ዝኽፈል (Pay-to-Public-Key-Hash)" : "Pay-to-Public-Key-Hash",
      era: "Legacy (2009)",
      prefix: "1...",
      vbytes: "148 vB (avg 1-in-2-out)",
      witnessDiscount: "None (0%)",
      privacy: isTi ? "ትሑት (ህዝባዊ ቁልፊ ይጋላጽ)" : "Low (Pubkey exposed at spend)",
      scriptPubKey: "OP_DUP OP_HASH160 <PubKeyHash> OP_EQUALVERIFY OP_CHECKSIG",
      unlocking: "<Sig> <PubKey>",
      summary: isTi
        ? "እቲ ቀዳማይ መበቆላዊ ስክሪፕት እዩ። ህዝባዊ ቁልፍን ፊርማን ኣብ ውሽጢ ScriptSig ብሓባር ይለኣኹ፡ እዚ ድማ ናይ ትራንዛክሽን ዓቐንን ክፍሊትን የዕብዮ።"
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

  const stackExecutionSteps = [
    {
      title: isTi ? "0. ጽሩይ ስታክ (Initial State)" : "0. Initial Clean Stack",
      opcode: "INIT",
      stack: [],
      explanation: isTi
        ? "እቲ ናይ ቢትኮይን ስክሪፕት ስታክ ማሽን ጥራዩ ይጅምር።"
        : "The Forth-like virtual stack machine starts completely empty.",
      badge: "Stack: Empty",
    },
    {
      title: isTi ? "1. ናይ ምኽፋት ዳታ ምእታው (Push Signature)" : "1. Push Signature from ScriptSig",
      opcode: "<Sig>",
      stack: ["30450221...<Sig>"],
      explanation: isTi
        ? "እቲ ወናኒ ዝፈረሞ ዲጂታል ፊርማ ናብቲ ስታክ ይድርበ።"
        : "The spending transaction provides the cryptographic signature from the unlocking script.",
      badge: "PUSH",
    },
    {
      title: isTi ? "2. ህዝባዊ ቁልፊ ምእታው (Push Public Key)" : "2. Push Public Key",
      opcode: "<PubKey>",
      stack: ["30450221...<Sig>", "02c38f...<PubKey>"],
      explanation: isTi
        ? "እቲ ናይቲ ወናኒ ዝምጥን ህዝባዊ ቁልፊ ናብ ርእሲ እቲ ስታክ ይድርበ።"
        : "The corresponding public key is placed on top of the signature.",
      badge: "PUSH",
    },
    {
      title: isTi ? "3. ቁልፊ ምዕጻፍ (OP_DUP)" : "3. Duplicate Top Item (OP_DUP)",
      opcode: "OP_DUP",
      stack: ["30450221...<Sig>", "02c38f...<PubKey>", "02c38f...<PubKey>"],
      explanation: isTi
        ? "OP_DUP ነቲ ኣብ ርእሲ ዘሎ ህዝባዊ ቁልፊ ብምቕዳሕ ክልተ ግዜ የቐምጦ።"
        : "Duplicates the top item (PubKey). Now there are two identical public keys on top.",
      badge: "OP_DUP",
    },
    {
      title: isTi ? "4. ናይ ሃሽ ስሌት (OP_HASH160)" : "4. Hash Top Key (OP_HASH160)",
      opcode: "OP_HASH160",
      stack: ["30450221...<Sig>", "02c38f...<PubKey>", "ab841e...<ComputedHash>"],
      explanation: isTi
        ? "ነቲ ኣብ ርእሲ ዝነበረ ቁልፊ ብ SHA-256 ድሕሪኡ ብ RIPEMD-160 ሃሽ ይገብሮ።"
        : "Applies SHA-256 followed by RIPEMD-160 to the top public key, deriving the 20-byte hash.",
      badge: "HASH160",
    },
    {
      title: isTi ? "5. ትጽቢት ዝግበረሉ ሃሽ ምእታው" : "5. Push Expected PubKeyHash",
      opcode: "<ExpectedHash>",
      stack: ["30450221...<Sig>", "02c38f...<PubKey>", "ab841e...<ComputedHash>", "ab841e...<ExpectedHash>"],
      explanation: isTi
        ? "እቲ ኣብ መበቆላዊ UTXO ተዓጽዩ ዝነበረ ScriptPubKey ሃሽ ናብ ስታክ ይኣቱ።"
        : "The destination hash locked inside the UTXO's ScriptPubKey is pushed for comparison.",
      badge: "PUSH HASH",
    },
    {
      title: isTi ? "6. ሃሽ ምንጽጻር (OP_EQUALVERIFY)" : "6. Compare Hashes (OP_EQUALVERIFY)",
      opcode: "OP_EQUALVERIFY",
      stack: ["30450221...<Sig>", "02c38f...<PubKey>"],
      explanation: isTi
        ? "ክልቲኦም ሃሻት ማዕረ ምዃኖም የረጋግጽ። ማዕረ እንተኾይኖም ክልቲኦም ይወጹ። ዘይማዕረ እንተኾይኖም እቲ ስክሪፕት ብኡንብኡ ይፈሽል!"
        : "Checks if ComputedHash == ExpectedHash. If true, both are popped. If false, validation aborts immediately!",
      badge: "EQUALVERIFY (PASS)",
    },
    {
      title: isTi ? "7. ፊርማ ምርግጋጽ (OP_CHECKSIG)" : "7. Validate Signature (OP_CHECKSIG)",
      opcode: "OP_CHECKSIG",
      stack: ["1 (TRUE)"],
      explanation: isTi
        ? "እቲ ፊርማ በቲ ህዝባዊ ቁልፍን ብዳታ ትራንዛክሽንን ቅኑዕ ምዃኑ ምስ ተረጋገጸ፡ ኣብ ስታክ 1 (TRUE) ይተርፍ። ትራንዛክሽን ቅቡል ይኸውን!"
        : "Validates ECDSA/Schnorr signature against public key and transaction digest. Result: [ 1 ]. Valid spend!",
      badge: "CHECKSIG -> SUCCESS",
    },
  ];

  return (
    <div className="my-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-5 sm:p-7 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <FileCode className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-100 sm:text-lg">
              {isTi ? "18.0 ዓይነታት ስክሪፕት ቢትኮይንን ናይ ስታክ ማሽን ዋሕዝን" : "18.0 Bitcoin Script Standards & Stack Machine"}
            </h3>
            <p className="text-xs text-zinc-400">
              {isTi ? "ካብ Legacy ክሳብ Taproot ዘሎ ዕቤት ምስ ስጉምቲ ብስጉምቲ ስታክ ፈተሻ" : "Evolution from Legacy to Taproot with step-by-step stack execution"}
            </p>
          </div>
        </div>
        <span className="rounded-full border border-orange-500/30 bg-orange-950/40 px-2.5 py-0.5 text-xs font-medium text-orange-300">
          {isTi ? "ቴክኒካዊ መርመራ" : "Technical Deep Dive"}
        </span>
      </div>

      {/* Part 1: Evolution Comparison Tabs */}
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
        <div className="mt-4 rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4">
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

      {/* Part 2: Interactive Forth Stack Visualizer */}
      <div className="mt-7 border-t border-zinc-800/80 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <Workflow className="w-4 h-4 text-orange-400" />
              {isTi ? "ናይ ቢትኮይን ስታክ ማሽን ኣሰራርሓ (P2PKH Stack Evaluation)" : "Forth Stack Machine Visualizer (P2PKH Evaluation)"}
            </h4>
            <p className="text-xs text-zinc-400">
              {isTi ? "ቢትኮይን ኖዳት ብኸመይ ነቲ ናይ ምዕጻውን ምኽፋትን ስክሪፕት ፈቲሾም ከም ዘጽድቕዎ ተመልከት" : "Watch how full nodes execute script instructions sequentially to validate a spend"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStackStep((prev) => Math.max(0, prev - 1))}
              disabled={stackStep === 0}
              className="px-2.5 py-1 text-xs rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-700 transition"
            >
              {isTi ? "ንድሕሪት" : "Prev Step"}
            </button>
            <button
              onClick={() => setStackStep((prev) => Math.min(stackExecutionSteps.length - 1, prev + 1))}
              disabled={stackStep === stackExecutionSteps.length - 1}
              className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg bg-orange-600 text-white hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <Play className="w-3 h-3 fill-current" />
              {isTi ? "ቀጻሊ ስጉምቲ" : "Next Step"}
            </button>
            <button
              onClick={() => setStackStep(0)}
              title={isTi ? "ዳግማይ ጀምር" : "Reset Stack"}
              className="p-1 text-xs rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Stack State Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Execution log */}
          <div className="lg:col-span-7 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-orange-400">
                {stackExecutionSteps[stackStep].title}
              </span>
              <span className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-[10px] text-zinc-300">
                {stackExecutionSteps[stackStep].badge}
              </span>
            </div>

            <div className="my-2 rounded bg-zinc-950 p-2.5 font-mono text-xs text-zinc-300 border border-zinc-800/80 flex items-center justify-between">
              <span className="text-zinc-500">{isTi ? "ሕጂ ዝፍጸም ዘሎ ትእዛዝ፦" : "Current Opcode:"}</span>
              <span className="text-orange-300 font-bold px-2 py-0.5 bg-orange-950/60 rounded border border-orange-500/30">
                {stackExecutionSteps[stackStep].opcode}
              </span>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed mt-3">
              {stackExecutionSteps[stackStep].explanation}
            </p>

            {/* Stepper Progress Indicator */}
            <div className="mt-4 flex gap-1.5">
              {stackExecutionSteps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setStackStep(idx)}
                  className={`h-1.5 flex-1 rounded-full transition-all ${
                    idx === stackStep
                      ? "bg-orange-500"
                      : idx < stackStep
                      ? "bg-orange-900"
                      : "bg-zinc-800"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right: Visual Stack representation (Bottom to Top) */}
          <div className="lg:col-span-5 rounded-xl border border-zinc-800 bg-zinc-950 p-4 flex flex-col justify-end min-h-[220px]">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 text-center">
              {isTi ? "ናይ ስታክ ባይታ (Stack Memory)" : "Stack Memory (LIFO)"}
            </span>

            <div className="flex flex-col-reverse gap-2 border-b-4 border-orange-500/40 pb-2">
              {stackExecutionSteps[stackStep].stack.length === 0 ? (
                <div className="text-center py-8 text-xs text-zinc-600 italic">
                  {isTi ? "ስታክ ጥራዩ እዩ (Stack is empty)" : "Stack is currently empty"}
                </div>
              ) : (
                stackExecutionSteps[stackStep].stack.map((item, idx) => {
                  const isTop = idx === stackExecutionSteps[stackStep].stack.length - 1;
                  return (
                    <div
                      key={idx}
                      className={`rounded-lg px-3 py-2 font-mono text-xs flex items-center justify-between border transition-all ${
                        isTop
                          ? "border-orange-500/80 bg-orange-950/40 text-orange-200 shadow-md ring-1 ring-orange-500/30"
                          : "border-zinc-800 bg-zinc-900 text-zinc-300"
                      }`}
                    >
                      <span className="truncate mr-2">{item}</span>
                      {isTop && (
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-orange-500 text-zinc-950 font-bold shrink-0">
                          TOP
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-2 text-center text-[10px] text-zinc-500">
              {isTi ? "ትራንዛክሽን ቅቡል ዝኸውን እቲ ናይ መወዳእታ ስታክ [ 1 / TRUE ] ምስ ዝተርፍ ጥራይ እዩ" : "Execution succeeds when the script terminates with non-zero [ 1 / TRUE ] on top"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MODULE 2: Timelocks & Simple Policies (CLTV vs CSV)
// -------------------------------------------------------------
function TimelockPoliciesSection({ isTi }: { isTi: boolean }) {
  const [activeScenario, setActiveScenario] = useState<"vault" | "inheritance" | "lightning">("vault");

  const scenarios = {
    vault: {
      title: isTi ? "1. ናይ ቮልት ድሕነት (Anti-Theft Vault Delay)" : "1. Anti-Theft Vault Delay",
      type: "Relative Timelock (CSV)",
      opcode: "OP_CHECKSEQUENCEVERIFY",
      rule: isTi
        ? "ናይ ዕለታዊ ወጻኢ ብ 2 ቁልፍታት ብኡንብኡ ይፍቀድ፤ ወይ ድማ 1000 ብሎካት (7 መዓልቲ) CSV ምስ ሓለፈ ብመተካእታ ቁልፊ ይድሕን።"
        : "2-of-2 keys can spend immediately. A single cold key can spend ONLY after 1,000 blocks (~7 days) CSV delay.",
      attackDefense: isTi
        ? "ስራቒ ነቲ ሓደ ቁልፊ እንተሰሪቕዎ፡ 1000 ብሎካት ክጽበ ይግደድ። ኣብዚ ናይ ምድንጓይ ግዜ እቲ ናይ ሓቂ ወናኒ ነቲ ገንዘብ ናብ ውሑስ ቦታ የሕልፎ!"
        : "If an attacker compromises the hot key, they are trapped in a 7-day on-chain waiting period. The owner detects the pending spend and sweeps funds to safety using their emergency key!",
      codeSnippet: `OP_IF\n  # Instant multi-sig\n  2 <KeyA> <KeyB> 2 OP_CHECKMULTISIG\nOP_ELSE\n  # Relative delay recovery\n  "1000" OP_CHECKSEQUENCEVERIFY OP_DROP\n  <ColdBackupKey> OP_CHECKSIG\nOP_ENDIF`,
    },
    inheritance: {
      title: isTi ? "2. ናይ ውርሻ ግዜያዊ ካፕሱል (Inheritance Time-Capsule)" : "2. Inheritance Time-Capsule",
      type: "Absolute Timelock (CLTV)",
      opcode: "OP_CHECKLOCKTIMEVERIFY",
      rule: isTi
        ? "እቲ ወናኒ ዝኾነ ግዜ ከውጽእ ይኽእል። እቲ ወራሲ ግን ድሕሪ ዕለት 1 ጥሪ 2030 (CLTV) ጥራይ ገንዘብ ከንቀሳቕስ ይፍቀደሉ።"
        : "Owner spends anytime with Key 1. Designated heir can spend with Key 2 ONLY after Unix timestamp Jan 1, 2030 (CLTV).",
      attackDefense: isTi
        ? "እቲ ወናኒ ብህይወት ከሎ ወራስቲ ገንዘብ ከውጽኡ ኣይኽእሉን። ወናኒ ዓቕሚ እንተስኢኑ ወይ እንተሞተ፡ ድሕሪ እቲ ዕለት እቲ ገንዘብ ብዘይ ሳልሳይ ወገን ይኽፈት።"
        : "Heirs cannot touch funds before the target date. If the owner stays healthy, they refresh the UTXO to a future date. If incapacitated, the lock naturally expires.",
      codeSnippet: `OP_IF\n  <OwnerKey> OP_CHECKSIG\nOP_ELSE\n  "2030-01-01" OP_CHECKLOCKTIMEVERIFY OP_DROP\n  <HeirKey> OP_CHECKSIG\nOP_ENDIF`,
    },
    lightning: {
      title: isTi ? "3. ናይ ላይትኒንግ ቅጽዓት ቻነል (Lightning Revocation)" : "3. Lightning Revocation Window",
      type: "Relative CSV Punishment",
      opcode: "OP_CHECKSEQUENCEVERIFY",
      rule: isTi
        ? "ሓደ ወገን ብሓይሊ ቻነል እንተዓጽዩ፡ ገንዘቡ ንምውሳድ 144 ብሎካት CSV ክጽበ ኣለዎ። ኣብዚ ግዜ እቲ ካልኣይ ወገን ምግርጫው ከይህሉ ቅጽዓት ይወስድ።"
        : "Unilateral channel close enforces a 144-block CSV delay on the broadcaster. During this window, the counterparty can claim a justice punishment if old state was broadcast.",
      attackDefense: isTi
        ? "ዝኾነ ዝሓለፈ ናይ ሓሶት ባላንስ ከጽድቕ ዝፈተነ ሰብ፡ ኣብቲ 144 ብሎካት ናይ መቕጻዕቲ ስክሪፕት ብምጥቃም ምሉእ ገንዘቡ ይምንጠል (ምግርጫው ይቕጻዕ)!"
        : "Anyone attempting to broadcast an old channel balance is trapped in the CSV window, allowing the honest peer/watchtower to claim 100% of the channel funds as a penalty!",
      codeSnippet: `OP_IF\n  # Revocation penalty path (Instant)\n  <RevocationPubKey> OP_CHECKSIG\nOP_ELSE\n  # Force-close delay path\n  "144" OP_CHECKSEQUENCEVERIFY OP_DROP\n  <DelayedPubKey> OP_CHECKSIG\nOP_ENDIF`,
    },
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
              {isTi ? "18.1 ናይ ግዜ ምዕጻውን ፖሊሲታትን (CLTV vs CSV)" : "18.1 Timelocks & Smart Policy Architectures"}
            </h3>
            <p className="text-xs text-zinc-400">
              {isTi ? "ፍጹም (Absolute) vs ተዛማዲ (Relative) ናይ ግዜ ምዕጻው ኣብ ቮልታትን ላይትኒንግን" : "Absolute vs Relative timelock enforcement in vaults and Layer 2 protocols"}
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Overview */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-blue-300">
              {isTi ? "ፍጹም ናይ ግዜ ምዕጻው (Absolute Timelocks)" : "Absolute Timelocks"}
            </h4>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-blue-900/50 text-blue-200">
              CLTV & nLockTime
            </span>
          </div>
          <p className="mt-2 text-xs text-zinc-300 leading-relaxed">
            {isTi
              ? "ኣብ ፍጹም ናይ ዓውደ-ኣዋርሕ ዕለት (Unix Timestamp) ወይ ፍሉይ ናይ ብሎክ ቁጽሪ (Block Height) ዝምርኮስ እዩ። ቅድሚ እቲ ፍሉይ ግዜ ምብጻሑ እቲ ሳንቲም ብፍጹም ክውዕል ኣይክእልን።"
              : "Locked until a specific calendar date (Unix epoch) or precise block height. The UTXO cannot be spent under any circumstances before that exact block or second occurs."}
          </p>
          <div className="mt-3 font-mono text-[11px] text-blue-300/90 bg-blue-950/60 p-2 rounded border border-blue-800/40">
            OP_CHECKLOCKTIMEVERIFY (BIP65)
          </div>
        </div>

        <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-amber-300">
              {isTi ? "ተዛማዲ ናይ ግዜ ምዕጻው (Relative Timelocks)" : "Relative Timelocks"}
            </h4>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-900/50 text-amber-200">
              CSV & nSequence
            </span>
          </div>
          <p className="mt-2 text-xs text-zinc-300 leading-relaxed">
            {isTi
              ? "እቲ ወላዲ UTXO ኣብ ብሎክቼይን ካብ ዝተረጋገጸሉ ግዜ ጀሚሩ ብዝቑጸር ብሎካት ይዕጸው። ንኣብነት፡ 'ካብ ዝተረጋገጸሉ ድሕሪ 144 ብሎካት (24 ሰዓት) ጥራይ ይፈቐድ'።"
              : "Relative to when the parent UTXO was confirmed on-chain. Example: 'Only spendable after 144 blocks (~24 hours) have elapsed since its confirmation transaction'."}
          </p>
          <div className="mt-3 font-mono text-[11px] text-amber-300/90 bg-amber-950/60 p-2 rounded border border-amber-800/40">
            OP_CHECKSEQUENCEVERIFY (BIP112)
          </div>
        </div>
      </div>

      {/* Interactive Policy Scenarios */}
      <div className="mt-6 border-t border-zinc-800/80 pt-5">
        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
          {isTi ? "ናይ ሓቂ ዓለም ናይ ፖሊሲ ኣብነታት መርምር፦" : "Explore Real-World Script Policies:"}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {(["vault", "inheritance", "lightning"] as const).map((key) => {
            const sc = scenarios[key];
            const isSelected = activeScenario === key;
            return (
              <button
                key={key}
                onClick={() => setActiveScenario(key)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  isSelected
                    ? "border-orange-500 bg-orange-950/40 text-orange-200 shadow-md ring-1 ring-orange-500/30"
                    : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {sc.title}
              </button>
            );
          })}
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
            <div>
              <span className="font-mono text-xs text-orange-400 block mb-0.5">
                {scenarios[activeScenario].opcode}
              </span>
              <h5 className="text-sm font-bold text-zinc-100">
                {scenarios[activeScenario].title}
              </h5>
            </div>
            <span className="rounded bg-zinc-800 px-2 py-0.5 text-[11px] text-zinc-300 shrink-0">
              {scenarios[activeScenario].type}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-semibold text-zinc-400 block mb-1">
                {isTi ? "ናይ ፖሊሲ ሕጊ (Spending Condition):" : "Policy Logic Condition:"}
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950 p-2.5 rounded border border-zinc-800">
                {scenarios[activeScenario].rule}
              </p>

              <span className="text-xs font-semibold text-emerald-400 block mt-3 mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                {isTi ? "ናይ ምክልኻል ብቕዓት (Defense Capability):" : "Security Guarantee:"}
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed bg-emerald-950/20 p-2.5 rounded border border-emerald-900/30">
                {scenarios[activeScenario].attackDefense}
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold text-zinc-400 block mb-1 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-orange-400" />
                {isTi ? "ናይ ስክሪፕት ኮድ (Bitcoin Script):" : "Script Implementation Structure:"}
              </span>
              <pre className="font-mono text-[11px] text-orange-300 bg-zinc-950 p-3 rounded-lg border border-zinc-800 overflow-x-auto leading-relaxed">
                {scenarios[activeScenario].codeSnippet}
              </pre>
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
        ? "ነፍሲ ወከፍ tit-for-tat ውጽኢት ሓድሽ ናይ ምዕጻው ስክሪፕት (ScriptPubKey) ይዕጠቕ።"
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
