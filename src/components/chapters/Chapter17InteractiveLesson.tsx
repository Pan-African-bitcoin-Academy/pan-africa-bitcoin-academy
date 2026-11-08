"use client";

import { useState } from "react";
import {
  Key,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  Users,
  Building2,
  HeartHandshake,
  CheckCircle2,
  XCircle,
  ArrowRight,
  FileText,
  Layers,
  MapPin,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Send,
  HelpCircle,
  FileCheck,
  Flame,
  Check,
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
   Module 1: Single-Sig vs Multi-Sig Threat Matrix (Section 17.0)
   Theme: "Why Multi-Sig: Eliminating Single Points of Failure"
   ========================================================================= */

function SingleSigVsMultiSigMatrix({ isTi }: ModuleProps) {
  const [selectedScenario, setSelectedScenario] = useState<"theft" | "disaster" | "inheritance">("theft");

  const scenarios = {
    theft: {
      titleEn: "Physical Theft / Extortion",
      titleTi: "ስርቂ / ምፍርራህ",
      singleSigOutcomeEn: "CRITICAL LOSS: The thief steals your single hardware wallet and backup seed. 100% of your Bitcoin is wiped out in seconds.",
      singleSigOutcomeTi: "ዓቢ ኪሳራ፦ እቲ ሰራቒ ነታ እንኮ ሃርድዌር ቦርሳኻ ወይ ዘርኢ ሰሪቑ። ኩሉ ቢትኮይንካ ብቕጽበት ይውሰድ።",
      multiSigOutcomeEn: "SECURE: The thief only gets 1 of 3 keys. Because 2 signatures are strictly required to move funds, the thief has $0. You safely sweep your funds using Key 2 + Key 3.",
      multiSigOutcomeTi: "ውሑስ፦ እቲ ሰራቒ 1 ካብ 3 መፍትሕ ጥራይ እዩ ረኺቡ። ገንዘብ ንምንቅስቓስ ብውሕዱ 2 ፌርማታት ስለዘድሊ፡ ሰራቒ 0 ዶላር ይረክብ። ንስኻ ብመፍትሕ 2ን 3ን ተጠቒምካ ገንዘብካ ብሰላም ተድሕኖ።",
    },
    disaster: {
      titleEn: "Fire / Natural Disaster",
      titleTi: "ሓዊ / ተፈጥሮኣዊ ሓደጋ",
      singleSigOutcomeEn: "PERMANENT LOSS: House fire destroys your hardware signer and paper seed backup. The private key is burned; your coins are lost forever to the void.",
      singleSigOutcomeTi: "ዘይሕከም ኪሳራ፦ ሓደጋ ባርዕ ነታ ቦርሳን ወረቐት ባክኣፕን ኣቃጺልዎ። መፍትሕ ስለዝጠፍአ ሳንቲምካ ንዘለኣለም ይጠፍእ።",
      multiSigOutcomeEn: "RESILIENT: Key 1 was in the house fire, but Key 2 is in a bank deposit box and Key 3 is with an institutional partner. Zero funds lost.",
      multiSigOutcomeTi: "ጽኑዕ፦ መፍትሕ 1 ኣብቲ ባርዕ ዓንዩ ክኸውን ይኽእል፤ መፍትሕ 2 ግን ኣብ ባንኪ፡ መፍትሕ 3 ድማ ምስ መሻርኽቲ ስለዘሎ ሓንቲ ሳንቲም እኳ ኣይጠፍአን።",
    },
    inheritance: {
      titleEn: "Unexpected Incapacitation / Inheritance",
      titleTi: "ሃንደበታዊ ሞት / ውርሻ",
      singleSigOutcomeEn: "LOCKED FOREVER: If you die without sharing your 24 words, your family can never access the funds. If you do share your seed while alive, your security is compromised.",
      singleSigOutcomeTi: "ንዘለኣለም ዝተዓጸወ፦ ነቶም 24 ቃላት ከየካፈልካዮም እንተሞትካ፡ ስድራኻ ፈጺሞም ክረኽብዎ ኣይኽእሉን። ብህይወትካ ከለኻ እንተኣካፊልካዮም ድማ ድሕነትካ ኣብ ሓደጋ ይወድቕ።",
      multiSigOutcomeEn: "SMOOTH TRANSITION: Legal playbook gives your heirs access to Key 1 + Key 3 through an estate attorney, without any single person having theft capability during your life.",
      multiSigOutcomeTi: "ውሑስ ምስግጋር፦ ሕጋዊ መምርሒ ንስድራኻ ብጠበቓ ኣቢሎም መፍትሕ 1ን 3ን ንኽረኽቡ የኽእሎም፤ ብህይወትካ ከለኻ ግን ዝኾነ ሰብ ንበይኑ ክሰርቆ ኣይክእልን።",
    },
  };

  const current = scenarios[selectedScenario];

  return (
    <div className={panelClass}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
            <Key className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-400">
                {t({ en: "Section 17.0 Representation", ti: "ክፍሊ 17.0 ምርኢት" }, isTi)}
              </span>
              <span className="text-xs text-zinc-400">
                {t({ en: "Eliminating Single Points of Failure", ti: "ንጽል ድኻም ምውጋድ" }, isTi)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100">
              {t(
                {
                  en: "Single-Signature vs. Multi-Signature: Eliminating Catastrophic Failure",
                  ti: "ንጽል ፊርማ ኣንጻር ብዙሕ ፊርማ፦ ዓበይቲ ሓደጋታትን ውድቀትን ምውጋድ",
                },
                isTi
              )}
            </h3>
          </div>
        </div>

        {/* Use Case Scenarios */}
        <div className="flex flex-wrap gap-1 rounded-lg border border-zinc-800 bg-zinc-900/60 p-1">
          <button
            onClick={() => setSelectedScenario("theft")}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition cursor-pointer ${
              selectedScenario === "theft"
                ? "bg-purple-500 text-white shadow-sm font-bold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {t({ en: "1. Theft / Extortion", ti: "1. ስርቂ / ምፍርራህ" }, isTi)}
          </button>
          <button
            onClick={() => setSelectedScenario("disaster")}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition cursor-pointer ${
              selectedScenario === "disaster"
                ? "bg-purple-500 text-white shadow-sm font-bold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {t({ en: "2. Fire / Disaster", ti: "2. ሓዊ / ሓደጋ" }, isTi)}
          </button>
          <button
            onClick={() => setSelectedScenario("inheritance")}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition cursor-pointer ${
              selectedScenario === "inheritance"
                ? "bg-purple-500 text-white shadow-sm font-bold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {t({ en: "3. Inheritance", ti: "3. ውርሻ" }, isTi)}
          </button>
        </div>
      </div>

      <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
        {t(
          {
            en: "In a single-signature wallet, you have a single point of failure: 1 lost backup or 1 stolen seed destroys your fortune. Multi-signature distributes power across multiple keys in different locations so that losing a single key never results in loss of funds.",
            ti: "ኣብ ንጽል ፊርማ ዘለዎ ቦርሳ፡ ሓደ ንጽል ናይ ውድቀት ነጥቢ ኣለካ፦ 1 ዝጠፍአ ዘርኢ ወይ 1 ስርቂ ንኹሉ ሃብትኻ ከጥፍኦ ይኽእል። ብዙሕ-ፊርማ (ማልቲ-ሲግ) ግን ሓይሊ ኣብ ዝተፈላለዩ ቦታታት ኣብ ዘለዉ መፍትሕታት ብምክፍፋል፡ ሓደ መፍትሕ ብምጥፍኡ ፈጺሙ ኪሳራ ከየስዕብ ይከላኸል።",
          },
          isTi
        )}
      </p>

      {/* Side by side comparison */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Single-Sig Card */}
        <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-4 sm:p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                <Lock className="h-4 w-4" />
                Single-Signature (1-of-1)
              </span>
              <span className="text-[10px] font-mono text-red-300 bg-red-500/20 px-2 py-0.5 rounded">
                Single Point of Failure
              </span>
            </div>

            <div className="mt-3 flex items-center justify-center p-4 bg-black/40 rounded-lg border border-red-500/20">
              <div className="text-center space-y-1">
                <Key className="h-8 w-8 text-red-400 mx-auto" />
                <span className="font-mono text-xs text-zinc-300 block font-bold">1 Seed Phrase = Total Control</span>
                <span className="text-[10px] text-zinc-500">Zero Redundancy</span>
              </div>
            </div>

            <div className="mt-3 text-xs text-red-300 leading-relaxed font-mono bg-red-950/40 p-3 rounded-lg border border-red-500/30">
              {isTi ? current.singleSigOutcomeTi : current.singleSigOutcomeEn}
            </div>
          </div>

          <div className="pt-2 text-[11px] text-zinc-400 border-t border-red-500/20">
            {t({ en: "Risk: Vulnerable to rogue apps, house fires, physical extortion.", ti: "ሓደጋ፦ ብሓዊ፡ ብስርቂ ወይ ብምፍርራህ ምሉእ ኪሳራ የጋጥም።" }, isTi)}
          </div>
        </div>

        {/* Multi-Sig Card */}
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-4 sm:p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                Collaborative Multi-Sig (2-of-3)
              </span>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded">
                Fault Tolerant &amp; Distributed
              </span>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 p-3 bg-black/40 rounded-lg border border-emerald-500/20 text-center text-xs font-mono">
              <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                <Key className="h-5 w-5 text-emerald-400 mx-auto mb-1" />
                <span className="block text-[10px] text-zinc-300 font-bold">Key 1</span>
                <span className="text-[9px] text-zinc-500">Home Safe</span>
              </div>
              <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                <Key className="h-5 w-5 text-emerald-400 mx-auto mb-1" />
                <span className="block text-[10px] text-zinc-300 font-bold">Key 2</span>
                <span className="text-[9px] text-zinc-500">Safety Deposit</span>
              </div>
              <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                <Key className="h-5 w-5 text-purple-400 mx-auto mb-1" />
                <span className="block text-[10px] text-zinc-300 font-bold">Key 3</span>
                <span className="text-[9px] text-zinc-500">Partner / Backup</span>
              </div>
            </div>

            <div className="mt-3 text-xs text-emerald-300 leading-relaxed font-mono bg-emerald-950/40 p-3 rounded-lg border border-emerald-500/30">
              {isTi ? current.multiSigOutcomeTi : current.multiSigOutcomeEn}
            </div>
          </div>

          <div className="pt-2 text-[11px] text-zinc-400 border-t border-emerald-500/20">
            {t({ en: "Benefit: Survives theft of 1 key or destruction of 1 location.", ti: "ረብሓ፦ ሓደ መፍትሕ እንተተሰርቀ ወይ እንተዓነወ ገንዘብካ ድሑን እዩ።" }, isTi)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   Module 2: M-of-N Quorum Simulator & PSBT Pipeline (Section 17.1)
   Theme: "M-of-N Designs: Coordinator vs Coordinator-Less PSBT Round"
   ========================================================================= */

function MofNQuorumSimulator({ isTi }: ModuleProps) {
  const [quorumType, setQuorumType] = useState<"2-of-3" | "3-of-5">("2-of-3");
  const [coordinatorType, setCoordinatorType] = useState<"coordinator" | "coordinator_less">("coordinator");

  // Signer keys states
  const [keySigned, setKeySigned] = useState<{ [key: string]: boolean }>({
    key1: false,
    key2: false,
    key3: false,
    key4: false,
    key5: false,
  });

  const [broadcasted, setBroadcasted] = useState<boolean>(false);

  const totalKeys = quorumType === "2-of-3" ? 3 : 5;
  const requiredSignatures = quorumType === "2-of-3" ? 2 : 3;

  const currentSignatureCount = Object.entries(keySigned)
    .filter(([k, v]) => {
      const idx = parseInt(k.replace("key", ""));
      return idx <= totalKeys && v;
    }).length;

  const quorumReached = currentSignatureCount >= requiredSignatures;

  const toggleSign = (keyName: string) => {
    if (broadcasted) return;
    setKeySigned((prev) => ({
      ...prev,
      [keyName]: !prev[keyName],
    }));
  };

  const handleBroadcast = () => {
    if (!quorumReached) return;
    setBroadcasted(true);
  };

  const handleReset = () => {
    setKeySigned({
      key1: false,
      key2: false,
      key3: false,
      key4: false,
      key5: false,
    });
    setBroadcasted(false);
  };

  return (
    <div className={panelClass}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
                {t({ en: "Section 17.1 Interactive", ti: "ክፍሊ 17.1 መስተጋብራዊ" }, isTi)}
              </span>
              <span className="text-xs text-zinc-400">
                {t({ en: "M-of-N Quorum Signing", ti: "M-ካብ-N ናይ ፌርማ ውሳነ" }, isTi)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100">
              {t(
                {
                  en: "Multi-Sig Signing Sandbox: M-of-N Quorum & PSBT Assembly",
                  ti: "ናይ ማልቲ-ሲግ ምፍራም ፈተነ፦ M-ካብ-N ውሳነን PSBT ኣሰራርሓን",
                },
                isTi
              )}
            </h3>
          </div>
        </div>

        {/* Quorum Selector */}
        <div className="flex rounded-lg border border-zinc-800 bg-zinc-900/60 p-1">
          <button
            onClick={() => {
              setQuorumType("2-of-3");
              handleReset();
            }}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition cursor-pointer ${
              quorumType === "2-of-3"
                ? "bg-amber-500 text-black shadow-sm font-bold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            2-of-3 (Standard)
          </button>
          <button
            onClick={() => {
              setQuorumType("3-of-5");
              handleReset();
            }}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition cursor-pointer ${
              quorumType === "3-of-5"
                ? "bg-amber-500 text-black shadow-sm font-bold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            3-of-5 (Institutional)
          </button>
        </div>
      </div>

      <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
        {t(
          {
            en: "Multi-sig transactions are coordinated using Partially Signed Bitcoin Transactions (PSBTs). The unsigned transaction is created once, passed to the signers to collect cryptographically independent signatures, and then combined and broadcast.",
            ti: "ናይ ብዙሕ-ፊርማ ትራንዛክሽናት ብ PSBT (ብኸፊል ዝተፈርመ ናይ ቢትኮይን ትራንዛክሽን) ኣቢሎም ይውደቡ። እቲ ትራንዛክሽን ሓንሳብ ይስራሕ፡ ናብቶም ፈረምቲ ተላኢኹ ናጻ ፊርማታት ይእከብ፡ ብድሕሪኡ ተጠርኒፉ ናብቲ መርበብ ይፍኖ።",
          },
          isTi
        )}
      </p>

      {/* Quorum Visualizer Box */}
      <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 sm:p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              {t({ en: "PSBT Signature Status:", ti: "ናይ PSBT ፊርማ ኩነታት፦" }, isTi)}
            </span>
            <span className="font-mono text-sm font-bold text-amber-400">
              {currentSignatureCount} / {requiredSignatures} Signatures Collected
            </span>
          </div>

          <span className={`rounded-full px-2.5 py-0.5 text-xs font-mono font-bold ${
            quorumReached
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
              : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
          }`}>
            {quorumReached ? t({ en: "QUORUM REACHED ✓", ti: "ብቑዕ ኮይኑ ✓" }, isTi) : t({ en: "PENDING SIGNATURES…", ti: "ፊርማ ይጽበ ኣሎ…" }, isTi)}
          </span>
        </div>

        {/* Signers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {Array.from({ length: totalKeys }).map((_, i) => {
            const keyId = `key${i + 1}`;
            const isSigned = keySigned[keyId];
            const keyLabels = [
              { name: "Key 1 (Coldcard)", loc: "Home Safe" },
              { name: "Key 2 (Ledger)", loc: "Bank Vault" },
              { name: "Key 3 (Trezor)", loc: "Parent's House" },
              { name: "Key 4 (SeedSigner)", loc: "Office Desk" },
              { name: "Key 5 (BitBox02)", loc: "Attorney Vault" },
            ];
            const label = keyLabels[i];

            return (
              <div
                key={keyId}
                className={`rounded-xl border p-3.5 flex flex-col justify-between transition-all ${
                  isSigned
                    ? "border-emerald-500 bg-emerald-950/30 text-emerald-200"
                    : "border-zinc-800 bg-zinc-900/50 text-zinc-400"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span>{label.name}</span>
                    {isSigned ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <span className="text-[10px] text-zinc-500 font-mono">Unsigned</span>
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-500 block mb-2">{label.loc}</span>
                </div>

                <button
                  disabled={broadcasted}
                  onClick={() => toggleSign(keyId)}
                  className={`rounded-lg py-1.5 px-2 text-xs font-bold transition cursor-pointer ${
                    isSigned
                      ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30"
                      : "border border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white"
                  }`}
                >
                  {isSigned ? t({ en: "Remove Sig", ti: "ፊርማ ኣውጽእ" }, isTi) : t({ en: "Sign PSBT ✍️", ti: "PSBT ፍረም ✍️" }, isTi)}
                </button>
              </div>
            );
          })}
        </div>

        {/* Broadcast Action Area */}
        <div className="pt-3 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-zinc-400 font-mono">
            {broadcasted ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <Check className="h-4 w-4" />
                Transaction combined and broadcasted on-chain! TxID: 9f8a...32bc
              </span>
            ) : quorumReached ? (
              <span className="text-amber-300 font-bold">
                Valid threshold met! Ready to combine and broadcast to Bitcoin mempool.
              </span>
            ) : (
              <span>Need {requiredSignatures - currentSignatureCount} more signature(s) to authorize payment.</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={!quorumReached || broadcasted}
              onClick={handleBroadcast}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer flex items-center gap-2 shadow-lg ${
                quorumReached && !broadcasted
                  ? "bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20"
                  : "border border-zinc-800 bg-zinc-900 text-zinc-600 cursor-not-allowed"
              }`}
            >
              <Send className="h-4 w-4" />
              {t({ en: "Combine & Broadcast", ti: "ጠርኒፍካ ፈኑ" }, isTi)}
            </button>

            <button
              onClick={handleReset}
              className="rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white px-3 py-2 text-xs transition cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Coordinator Comparison Switcher */}
      <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
            {t({ en: "PSBT Exchange Architecture:", ti: "ናይ PSBT ልውውጥ ኣሰራርሓ፦" }, isTi)}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setCoordinatorType("coordinator")}
              className={`rounded px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                coordinatorType === "coordinator"
                  ? "bg-purple-500 text-white font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Coordinator-Based (e.g. Unchained / Casa)
            </button>
            <button
              onClick={() => setCoordinatorType("coordinator_less")}
              className={`rounded px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                coordinatorType === "coordinator_less"
                  ? "bg-purple-500 text-white font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Coordinator-less (Air-Gapped / Sparrow)
            </button>
          </div>
        </div>

        <div className="text-xs font-mono text-zinc-300 leading-relaxed bg-black/40 p-3 rounded-lg border border-zinc-800">
          {coordinatorType === "coordinator" ? (
            <div>
              <strong className="text-purple-300">Coordinator-Based Flow:</strong> A web service holds your wallet descriptor and serves as a signing hub. It emails PSBT files to signers and holds 1 emergency backup key. Convenient for families, but requires trusting the coordinator with your public keys (addresses and balances).
            </div>
          ) : (
            <div>
              <strong className="text-amber-300">Coordinator-less Flow:</strong> You manually export PSBT files via micro-SD card or animated QR codes between air-gapped signing devices. Maximum privacy; zero third parties ever learn your wallet exists or know your Bitcoin balance.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   Module 3: Operational Playbooks & Geographic Backup (Section 17.2)
   Theme: "Operational Playbooks: Geographic Distribution, Descriptors & Drills"
   ========================================================================= */

function OperationalPlaybookWorkbench({ isTi }: ModuleProps) {
  const [activeTab, setActiveTab] = useState<"locations" | "descriptor" | "drill">("locations");

  return (
    <div className={panelClass}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-400">
                {t({ en: "Section 17.2 Representation", ti: "ክፍሊ 17.2 ምርኢት" }, isTi)}
              </span>
              <span className="text-xs text-zinc-400">
                {t({ en: "Security Playbooks & Drills", ti: "ስርሒታዊ መምርሕን ልምምድን" }, isTi)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100">
              {t(
                {
                  en: "Operational Playbooks: Geographic Distribution, Descriptors & Drills",
                  ti: "ስርሒታዊ መጽሓፍ ጸወታ፦ ጂኦግራፊያዊ ምክፍፋል፣ ደስክሪፕተርን ልምምድን",
                },
                isTi
              )}
            </h3>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex rounded-lg border border-zinc-800 bg-zinc-900/60 p-1">
          <button
            onClick={() => setActiveTab("locations")}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition cursor-pointer ${
              activeTab === "locations"
                ? "bg-cyan-500 text-black shadow-sm font-bold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {t({ en: "1. Geographic Map", ti: "1. ጂኦግራፊያዊ ካርታ" }, isTi)}
          </button>
          <button
            onClick={() => setActiveTab("descriptor")}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition cursor-pointer ${
              activeTab === "descriptor"
                ? "bg-cyan-500 text-black shadow-sm font-bold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {t({ en: "2. The Output Descriptor", ti: "2. ኣውትፑት ደስክሪፕተር" }, isTi)}
          </button>
          <button
            onClick={() => setActiveTab("drill")}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition cursor-pointer ${
              activeTab === "drill"
                ? "bg-cyan-500 text-black shadow-sm font-bold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {t({ en: "3. Annual Spend Drill", ti: "3. ዓመታዊ ናይ ፈተነ ልምምድ" }, isTi)}
          </button>
        </div>
      </div>

      <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
        {t(
          {
            en: "A multi-sig setup is only as good as its operational execution. Storing all keys in the same building defeats the purpose. Crucially, without the wallet's Output Descriptor, knowing your 24-word seed phrases is not enough to recover your coins.",
            ti: "ናይ ብዙሕ-ፊርማ ኣወዳድባ ብተግባራዊ ኣፈጻጽማኡ ጥራይ እዩ ዝምዘን። ኩሎም መፍትሕታት ኣብ ሓደ ገዛ ምዕቃብ ነቲ ዕላማ የጥፍኦ። ብተወሳኺ፡ ብዘይቲ ናይቲ ቦርሳ Output Descriptor፡ ዘርእታትካ ምፍላጥ ጥራይ ንሳንቲምካ ንምምላስ እኹል ኣይኮነን።",
          },
          isTi
        )}
      </p>

      {/* Dynamic Tab Content */}
      <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 sm:p-6 space-y-4">
        {activeTab === "locations" && (
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block">
              {t({ en: "Geographic Key Separation (3 Independent Locations):", ti: "ጂኦግራፊያዊ ናይ መፍትሕ ምክፍፋል (3 ዝተፈላለዩ ቦታታት)፦" }, isTi)}
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-2">
                <div className="flex items-center gap-2 text-white font-bold text-xs">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                  <span>Location A (Primary Residence)</span>
                </div>
                <ul className="text-xs text-zinc-400 space-y-1 font-mono">
                  <li>• Hardware Signer 1 (Coldcard)</li>
                  <li>• Stamped Seed Plate in Fire Safe</li>
                  <li>• Printed Output Descriptor File</li>
                </ul>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-2">
                <div className="flex items-center gap-2 text-white font-bold text-xs">
                  <MapPin className="h-4 w-4 text-sky-400" />
                  <span>Location B (Bank Safety Deposit / Office)</span>
                </div>
                <ul className="text-xs text-zinc-400 space-y-1 font-mono">
                  <li>• Hardware Signer 2 (Ledger / Trezor)</li>
                  <li>• Steel Seed Plate in Deposit Box</li>
                  <li>• Printed Output Descriptor File</li>
                </ul>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-2">
                <div className="flex items-center gap-2 text-white font-bold text-xs">
                  <MapPin className="h-4 w-4 text-purple-400" />
                  <span>Location C (Trusted Attorney / Partner)</span>
                </div>
                <ul className="text-xs text-zinc-400 space-y-1 font-mono">
                  <li>• Key 3 / Collaborative Custody Partner</li>
                  <li>• Letter of Instruction for Heirs</li>
                  <li>• Sealed tamper-evident backup envelope</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === "descriptor" && (
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="font-bold text-amber-400">
                CRITICAL LESSON: Why Multi-Sig Requires the Output Descriptor
              </span>
              <span className="text-[10px] text-zinc-500">BSMS / Sparrow / Coldcard</span>
            </div>

            <p className="text-zinc-300 text-xs leading-relaxed">
              In single-sig, your 24 words derive your addresses deterministically. In multi-sig, your wallet address depends on combining <strong className="text-white">all N public keys (xpubs) + derivation paths + quorum order</strong>. If you lose this descriptor, scanning the blockchain with just your seed words will show a zero balance!
            </p>

            <div className="bg-black/60 p-3 rounded-lg border border-zinc-800 text-cyan-300 text-[11px] break-all space-y-1">
              <div>wsh(sortedmulti(2,</div>
              <div className="text-zinc-400 pl-4">[73c5da0a/48&apos;/0&apos;/0&apos;/2&apos;]xpub6E.../0/*,</div>
              <div className="text-zinc-400 pl-4">[f42e91b1/48&apos;/0&apos;/0&apos;/2&apos;]xpub6D.../0/*,</div>
              <div className="text-zinc-400 pl-4">[a8b7c2d9/48&apos;/0&apos;/0&apos;/2&apos;]xpub6B.../0/*</div>
              <div>))#f9c2a81b</div>
            </div>

            <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-3 text-amber-200 text-xs flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
              <span>Always print out the text / QR code of your wallet descriptor and store a copy with EVERY seed backup!</span>
            </div>
          </div>
        )}

        {activeTab === "drill" && (
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
              {t({ en: "The Annual Operational Readiness Checklist:", ti: "ዓመታዊ ናይ ስርሒት ድሉውነት ዝርዝር፦" }, isTi)}
            </span>

            <div className="space-y-2 text-xs font-mono">
              <div className="rounded-lg bg-zinc-900/80 p-3 border border-zinc-800 flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-bold block">1. Annual Test Spend Drill</span>
                  <span className="text-zinc-400">Perform a $20 test spend requiring signatures from Location A and Location B to confirm firmware and cables function properly.</span>
                </div>
              </div>

              <div className="rounded-lg bg-zinc-900/80 p-3 border border-zinc-800 flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-bold block">2. Tamper-Evident Bag Inspection</span>
                  <span className="text-zinc-400">Visit Location B and Location C once a year to verify tamper-evident security bags are unbroken.</span>
                </div>
              </div>

              <div className="rounded-lg bg-zinc-900/80 p-3 border border-zinc-800 flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-bold block">3. Key Compromise Protocol</span>
                  <span className="text-zinc-400">If Key 1 is ever suspected of theft, immediately use Key 2 and Key 3 to sweep 100% of the treasury into a newly generated multi-sig wallet.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   Master Export
   ========================================================================= */

interface Chapter17LessonProps {
  module:
    | "single_sig_vs_multi_sig"
    | "mofn_quorum_simulator"
    | "operational_playbook_workbench";
  isTi?: boolean;
}

export function Chapter17InteractiveLesson({
  module,
  isTi = false,
}: Chapter17LessonProps) {
  switch (module) {
    case "single_sig_vs_multi_sig":
      return <SingleSigVsMultiSigMatrix isTi={isTi} />;
    case "mofn_quorum_simulator":
      return <MofNQuorumSimulator isTi={isTi} />;
    case "operational_playbook_workbench":
      return <OperationalPlaybookWorkbench isTi={isTi} />;
    default:
      return null;
  }
}
