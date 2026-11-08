"use client";

import { useState, useMemo } from "react";
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Layers,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Server,
  HardDrive,
  Cpu,
  Wifi,
  WifiOff,
  GitCommit,
  GitBranch,
  Split,
  Eye,
  EyeOff,
  Check,
  XCircle,
  HelpCircle,
  Sparkles,
  ExternalLink,
  Coins,
  Clock,
  Database,
  Lock,
  Unlock,
} from "lucide-react";

/* ─────────── Shared helpers ─────────── */

type Localized = { en: string; ti: string };
const t = (v: Localized, isTi: boolean) => (isTi ? v.ti : v.en);

const panelClass =
  "rounded-2xl border border-zinc-800 bg-zinc-950/90 p-4 shadow-xl sm:p-6 my-6";

/* =========================================================================
   Module 1: Block Explorer Lab (Section 12.0)
   Theme: "Using a Block Explorer: TxIDs, Confirmations, Fees & Mempool"
   ========================================================================= */

interface BlockExplorerProps {
  isTi: boolean;
}

function BlockExplorerLab({ isTi }: BlockExplorerProps) {
  const [queryInput, setQueryInput] = useState<string>("e9a10fc489b1c772");
  const [confirmations, setConfirmations] = useState<number>(3);
  const [feeRate, setFeeRate] = useState<number>(18); // sat/vB

  const isConfirmed = confirmations > 0;

  const mockTx = {
    txid: "e9a10fc489b1c772d8a4f901cb2901ee45a892b0c3d911a789ef230184b901a2",
    blockHeight: isConfirmed ? 885240 + confirmations : null,
    timestamp: isConfirmed ? "14 minutes ago" : "Just now (In Mempool)",
    inputs: [
      { addr: "bc1q9v8k7m0a4xf3298h49sljnd2q04xpeq8v601a", amount: 150000 },
    ],
    outputs: [
      { addr: "bc1q-merchant-cafe-9812dfa", amount: 85000, label: "Merchant Payment" },
      { addr: "bc1q-fresh-change-0012abc", amount: 62480, label: "Your Change" },
    ],
    vSize: 140, // vBytes
    feeSats: 140 * feeRate,
  };

  const handleReset = () => {
    setQueryInput("e9a10fc489b1c772");
    setConfirmations(3);
    setFeeRate(18);
  };

  return (
    <div className={panelClass}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
            <Search className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-400">
                {t({ en: "Section 12.0 Interactive", ti: "ክፍሊ 12.0 መስተጋብራዊ" }, isTi)}
              </span>
              <span className="text-xs text-zinc-400">
                {t({ en: "Mempool & Block Explorer Lab", ti: "ናይ ብሎክ ኤክስፕሎረር ፈተነ" }, isTi)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100">
              {t(
                {
                  en: "Verify for Yourself: Inspecting TxIDs, Confirmations & Fees",
                  ti: "ብባዕልኻ ኣረጋግጽ፦ ናይ ትራንዛክሽን መለለዪ፡ ምርግጋጽን ክፍሊትን ምምርማር",
                },
                isTi
              )}
            </h3>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {t({ en: "Reset Explorer", ti: "ኤክስፕሎረር ምለስ" }, isTi)}
        </button>
      </div>

      <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
        {t(
          {
            en: "Never rely solely on your wallet saying 'Sent'. Paste a transaction ID (TxID) into an explorer to independently verify its block inclusion, confirmation depth, and mempool priority:",
            ti: "ዋሌትካ 'ተሰዲዱ' ስለዝበለካ ጥራይ ፈጺምካ ኣይትተኣማመን። ናይ ትራንዛክሽን መለለዪ (TxID) ናብ ኤክስፕሎረር ብምእታው ብሓቂ ኣብ ብሎክ ምእታዉ፡ ክንደይ ምርግጋጽ ከምዝረኸበን ኣብ ሜምፑል ዘለዎ ኩነታትን ብባዕልኻ ኣረጋግጽ፦",
          },
          isTi
        )}
      </p>

      {/* Explorer Search Bar Mockup */}
      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 sm:p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="Search block height, txid, or address..."
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 pl-9 pr-3 py-2 text-xs font-mono text-zinc-100 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <button
            onClick={() => setQueryInput("e9a10fc489b1c772")}
            className="rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-cyan-400 transition cursor-pointer"
          >
            {t({ en: "Search TxID", ti: "TxID ድለ" }, isTi)}
          </button>
        </div>

        {/* Quick Sample Query Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] text-zinc-500 font-semibold">{t({ en: "Quick Presets:", ti: "ናይ ኣብነት መወከሲታት፦" }, isTi)}</span>
          <button
            onClick={() => {
              setQueryInput("e9a10fc489b1c772");
              setConfirmations(3);
            }}
            className="rounded bg-zinc-800 px-2 py-0.5 text-[11px] text-zinc-300 hover:bg-zinc-700 font-mono cursor-pointer"
          >
            Confirmed Tx (3 confs)
          </button>
          <button
            onClick={() => {
              setQueryInput("00000000000000000002");
              setConfirmations(0);
            }}
            className="rounded bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[11px] text-amber-300 hover:bg-amber-500/30 font-mono cursor-pointer"
          >
            Mempool (0-conf)
          </button>
          <button
            onClick={() => {
              setQueryInput("deepvault885000");
              setConfirmations(6);
            }}
            className="rounded bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[11px] text-emerald-300 hover:bg-emerald-500/30 font-mono cursor-pointer"
          >
            Finalized Tx (6+ confs)
          </button>
        </div>
      </div>

      {/* Live Transaction Card */}
      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-4">
        {/* Tx Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase flex items-center gap-1.5 ${
              confirmations >= 6
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                : confirmations > 0
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                : "bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse"
            }`}>
              {confirmations >= 6 ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {t({ en: `${confirmations} Confirmations (Finalized)`, ti: `${confirmations} ምርግጋጽ (ዘይዕጸፍ)` }, isTi)}
                </>
              ) : confirmations > 0 ? (
                <>
                  <Clock className="h-3.5 w-3.5" />
                  {t({ en: `${confirmations} Confirmation(s)`, ti: `${confirmations} ምርግጋጽ` }, isTi)}
                </>
              ) : (
                <>
                  <AlertTriangle className="h-3.5 w-3.5" />
                  {t({ en: "0-Conf: Unconfirmed in Mempool", ti: "0-Conf፦ ኣብ ሜምፑል ዘሎ" }, isTi)}
                </>
              )}
            </span>
            <span className="font-mono text-xs text-zinc-400">{mockTx.timestamp}</span>
          </div>

          <div className="text-xs font-mono text-zinc-400">
            {mockTx.blockHeight ? (
              <span>Block: <strong className="text-cyan-400">#{mockTx.blockHeight.toLocaleString()}</strong></span>
            ) : (
              <span className="text-amber-400 font-semibold">Estimated Block: Next Block (~10 min)</span>
            )}
          </div>
        </div>

        {/* Inputs vs Outputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          {/* Inputs */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block">
              {t({ en: "Inputs Consumed (1 UTXO):", ti: "ዝጠፍአ ሳንቲም (1 UTXO)፦" }, isTi)}
            </span>
            {mockTx.inputs.map((inp, idx) => (
              <div key={idx} className="flex justify-between items-center text-zinc-300">
                <span className="truncate max-w-[200px] text-zinc-400">{inp.addr}</span>
                <span className="text-amber-400 font-bold">{inp.amount.toLocaleString()} sats</span>
              </div>
            ))}
          </div>

          {/* Outputs */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block">
              {t({ en: "Outputs Created (2 UTXOs):", ti: "ዝተፈጥሩ ሳንቲማት (2 UTXOs)፦" }, isTi)}
            </span>
            {mockTx.outputs.map((out, idx) => (
              <div key={idx} className="flex justify-between items-center text-zinc-300">
                <div>
                  <span className="text-emerald-400 font-semibold block">{out.label}</span>
                  <span className="truncate max-w-[150px] text-[10px] text-zinc-500">{out.addr}</span>
                </div>
                <span className="text-emerald-400 font-bold">{out.amount.toLocaleString()} sats</span>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction Metrics Strip */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-2 border-t border-zinc-800">
          <div className="rounded-lg bg-zinc-900/60 p-2 border border-zinc-800">
            <span className="text-[10px] text-zinc-500 block uppercase">Virtual Size</span>
            <span className="text-zinc-200 font-bold">{mockTx.vSize} vBytes</span>
          </div>
          <div className="rounded-lg bg-zinc-900/60 p-2 border border-zinc-800">
            <span className="text-[10px] text-zinc-500 block uppercase">Fee Rate</span>
            <span className="text-amber-400 font-bold">{feeRate} sat/vB</span>
          </div>
          <div className="rounded-lg bg-zinc-900/60 p-2 border border-zinc-800">
            <span className="text-[10px] text-zinc-500 block uppercase">Miner Fee Paid</span>
            <span className="text-red-400 font-bold">{mockTx.feeSats.toLocaleString()} sats</span>
          </div>
        </div>

        {/* Interactive Confirmation Simulator Slider */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              {t({ en: "Interactive Confirmation Time Machine:", ti: "ናይ ምርግጋጽ ግዜ ፈተነ፦" }, isTi)}
            </span>
            <span className="font-mono text-xs text-zinc-300 font-bold">
              {confirmations === 0 ? "0-conf (Mempool)" : `${confirmations} Block Confirmation(s)`}
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={8}
            value={confirmations}
            onChange={(e) => setConfirmations(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />

          {/* Explanation based on confirmation level */}
          <div className="rounded-lg bg-zinc-950 p-3 border border-zinc-800 text-xs leading-relaxed">
            {confirmations === 0 ? (
              <p className="text-amber-300">
                ⚠️ <strong>0 Confirmations (In Mempool):</strong> {t(
                  {
                    en: "Transaction is floating in mempool. It has NOT been included in a block yet. It can still be replaced via RBF (Replace-By-Fee) or cancelled before miners mine it. Never deliver expensive goods on 0-conf!",
                    ti: "ትራንዛክሽን ኣብ ሜምፑል ይጽበ ኣሎ። ገና ኣብ ብሎክ ኣይኣተወን። ብኻልእ ክፍሊት ክልወጥ (RBF) ይኽእል እዩ። ክቡር ኣቑሑ ኣብ 0-conf ከለኻ ፈጺምካ ኣይትሃብ!",
                  },
                  isTi
                )}
              </p>
            ) : confirmations < 3 ? (
              <p className="text-cyan-300">
                🔒 <strong>1–2 Confirmations:</strong> {t(
                  {
                    en: "Included in a block! Extremely secure for everyday coffee or small retail purchases. An attacker would have to out-mine the entire Bitcoin network to reverse it.",
                    ti: "ኣብ ብሎክ ኣትዩ! ንዕለታዊ ዕድጊት ኣዝዩ ውሑስ እዩ። ሰራቒ ነዚ ንምዕጻፍ ንመላእ ናይ ዓለም ማይነራት ክስዕር ኣለዎ።",
                  },
                  isTi
                )}
              </p>
            ) : (
              <p className="text-emerald-300">
                🛡️ <strong>6+ Confirmations (Deeply Buried):</strong> {t(
                  {
                    en: "Buried beneath millions of exahashes of cumulative Proof of Work. Mathematically irreversible. Suitable for multi-million dollar house or car purchases.",
                    ti: "ብሚልዮናት ኤክሳሃሽ ናይ PoW ሓይሊ ተደሪቡ። ፈጺሙ ክዕጸፍ ዘይክእል ፍጹም ውሑስ እዩ። ንዓበይቲ ናይ ገዛ ወይ መኪና ዕድጊት ዝኸውን ደረጃ።",
                  },
                  isTi
                )}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   Module 2: Merkle Proof Visualizer & Diagram (Section 12.1)
   Theme: "Proving Inclusion: Merkle Trees & Cryptographic Paths"
   (Faithful interactive implementation of the textbook Merkle tree diagram)
   ========================================================================= */

interface MerkleProofProps {
  isTi: boolean;
}

function MerkleProofVisualizer({ isTi }: MerkleProofProps) {
  const [proofStep, setProofStep] = useState<number>(3); // 1: Hash C, 2: Hash CD, 3: Full Root ABCD
  const [tampered, setTampered] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"diagram" | "step_by_step">("diagram");

  // Hash values representing nodes
  const hashA = "7a1b";
  const hashB = "9c2e";
  const hashC = tampered ? "h4ck (Altered!)" : "4d3f";
  const hashD = "2f8a";

  const hashAB = "hash(A + B) → 38a9";
  const hashCD = tampered
    ? "hash(h4ck + D) → BAD9"
    : "hash(C + D) → 71fc";

  const calculatedRoot = tampered ? "CORRUPTED_ROOT_9999" : "GENUINE_ROOT_ABCD";
  const blockHeaderRoot = "GENUINE_ROOT_ABCD";
  const isProofValid = calculatedRoot === blockHeaderRoot;

  const handleReset = () => {
    setTampered(false);
    setProofStep(3);
  };

  return (
    <div className={panelClass}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
            <GitBranch className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-400">
                {t({ en: "Section 12.1 Interactive", ti: "ክፍሊ 12.1 መስተጋብራዊ" }, isTi)}
              </span>
              <span className="text-xs text-zinc-400">
                {t({ en: "Merkle Trees & SPV Proofs", ti: "ናይ ሜርክል ዛፍን ናይ SPV መረጋገጺን" }, isTi)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100">
              {t(
                {
                  en: "Merkle Trees: How Light Wallets Prove Inclusion Without Downloading Blocks",
                  ti: "ናይ ሜርክል ዛፍ፦ ናይ ስልኪ ዋሌታት ብዘይ ምሉእ ብሎክ ምውራድ ብኸመይ ትራንዛክሽን የረጋግጹ",
                },
                isTi
              )}
            </h3>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {t({ en: "Reset Tree", ti: "ዛፍ ምለስ" }, isTi)}
        </button>
      </div>

      <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
        {t(
          {
            en: "A Bitcoin block can hold over 3,000 transactions. How does your mobile wallet verify you actually received Transaction C without downloading all 3,000 transactions (2 MB per block)? Satoshi used a Merkle Tree: transactions are paired and hashed into a pyramid until only ONE 32-byte hash—the Merkle Root—remains in the block header.",
            ti: "ሓደ ናይ ቢትኮይን ብሎክ ልዕሊ 3,000 ትራንዛክሽናት ክሕዝ ይኽእል። ናይ ስልኪ ዋሌትካ ነተን 3,000 ትራንዛክሽናት (2 MB ኣብ ነፍሲ ወከፍ ብሎክ) ከየውረደ ትራንዛክሽን C ብሓቂ ከምዝበጽሓካ ብኸመይ ይፈልጥ? ሳቶሺ ናይ ሜርክል ዛፍ (Merkle Tree) ተጠቒሙ፦ ትራንዛክሽናት ብጽምዲ እናተጠርነፉ ናብ ሓደ 32-ባይት ዝኾነ ሜርክል ሩት (Merkle Root) ይድመሩ።",
          },
          isTi
        )}
      </p>

      {/* View Mode Toggle */}
      <div className="mt-4 flex rounded-xl border border-zinc-800 bg-zinc-900/60 p-1 w-fit">
        <button
          onClick={() => setViewMode("diagram")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
            viewMode === "diagram"
              ? "bg-purple-500 text-white shadow-sm"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          {t({ en: "1. Merkle Tree Diagram", ti: "1. ናይ ሜርክል ዛፍ ስእሊ" }, isTi)}
        </button>
        <button
          onClick={() => setViewMode("step_by_step")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
            viewMode === "step_by_step"
              ? "bg-purple-500 text-white shadow-sm"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <GitCommit className="h-3.5 w-3.5" />
          {t({ en: "2. Step-by-Step SPV Proof Walkthrough", ti: "2. ደረጃ ብደረጃ ናይ SPV መረጋገጺ" }, isTi)}
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          DIAGRAM VIEW: Exact recreation of the user's uploaded image
         ───────────────────────────────────────────────────────────── */}
      <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 sm:p-6 space-y-6">
        {/* LEVEL 3: Top Blue Box -> Merkle Root / Hash ABCD */}
        <div className="flex flex-col items-center">
          <div className={`w-64 rounded-xl border-2 p-3 text-center transition-all shadow-lg ${
            isProofValid
              ? "border-sky-400 bg-sky-950/40 text-sky-200 shadow-sky-500/10"
              : "border-red-500 bg-red-950/40 text-red-300 animate-pulse"
          }`}>
            <div className="text-xs font-bold uppercase tracking-wider text-sky-300">
              {t({ en: "Merkle Root", ti: "ሜርክል ሩት (Merkle Root)" }, isTi)}
            </div>
            <div className="text-base font-bold font-mono mt-0.5 text-white">
              {isProofValid ? "Hash ABCD" : "CORRUPTED_ROOT"}
            </div>
            <span className="text-[10px] text-zinc-400 block mt-1">
              {t({ en: "(Stored in 80-byte Block Header)", ti: "(ኣብ ናይ ብሎክ ርእሲ ዝቕመጥ)" }, isTi)}
            </span>
          </div>

          {/* Connector Arrow Upwards */}
          <div className="flex flex-col items-center my-1 text-zinc-500">
            <span className="text-xs font-bold">▲</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 my-0.5">
              {t({ en: "Non-Leaf Nodes", ti: "ናይ ጨንፈር ኖዳት (Non-Leaf)" }, isTi)}
            </span>
          </div>
        </div>

        {/* Orthogonal branch lines from Top to Middle */}
        <div className="relative max-w-lg mx-auto">
          {/* Branch connecting bar */}
          <div className="hidden sm:block h-3 border-t-2 border-l-2 border-r-2 border-zinc-700 mx-24 -mt-3 mb-1" />

          {/* LEVEL 2: Two Tan / Beige Boxes -> Hash AB and Hash CD */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12">
            {/* Left Non-Leaf Node: Hash AB */}
            <div className="flex flex-col items-center">
              <div className="w-full rounded-xl border-2 border-amber-500/40 bg-amber-950/30 p-3 text-center shadow-md">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Hash AB
                </div>
                <div className="text-xs font-mono text-zinc-300 mt-1">
                  hash(Hash A + Hash B)
                </div>
                <span className="text-[10px] font-mono text-zinc-500 block mt-0.5">
                  {hashAB}
                </span>
                <span className="mt-1.5 inline-block rounded bg-amber-500/20 px-2 py-0.5 text-[9px] font-bold text-amber-300">
                  {t({ en: "Proof Sibling (Sent to Phone)", ti: "ንመወከሲ ዝስደድ መረጋገጺ" }, isTi)}
                </span>
              </div>

              {/* Connector Arrow Upwards */}
              <div className="flex flex-col items-center my-1 text-zinc-500">
                <span className="text-xs font-bold">▲</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 my-0.5">
                  {t({ en: "Leaf Nodes", ti: "ናይ ቆጽሊ ኖዳት (Leaf)" }, isTi)}
                </span>
              </div>
            </div>

            {/* Right Non-Leaf Node: Hash CD */}
            <div className="flex flex-col items-center">
              <div className={`w-full rounded-xl border-2 p-3 text-center shadow-md transition-all ${
                tampered
                  ? "border-red-500 bg-red-950/40 text-red-300"
                  : "border-amber-500/40 bg-amber-950/30 text-amber-200"
              }`}>
                <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Hash CD
                </div>
                <div className="text-xs font-mono text-zinc-300 mt-1">
                  hash(Hash C + Hash D)
                </div>
                <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">
                  {hashCD}
                </span>
                <span className="mt-1.5 inline-block rounded bg-cyan-500/20 px-2 py-0.5 text-[9px] font-bold text-cyan-300">
                  {t({ en: "Calculated by Your Phone", ti: "ብናይ ስልክኻ ዝሕሰብ" }, isTi)}
                </span>
              </div>

              {/* Connector Arrow Upwards */}
              <div className="flex flex-col items-center my-1 text-zinc-500">
                <span className="text-xs font-bold">▲</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 my-0.5">
                  {t({ en: "Leaf Nodes", ti: "ናይ ቆጽሊ ኖዳት (Leaf)" }, isTi)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Orthogonal branch lines from Middle to Bottom */}
        <div className="relative max-w-2xl mx-auto">
          {/* LEVEL 1: Four Grey/Slate Boxes -> Leaf Nodes Hash A, B, C, D */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Hash A */}
            <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-2.5 text-center opacity-60">
              <div className="text-xs font-bold text-zinc-300">Hash A</div>
              <div className="text-[10px] font-mono text-zinc-500 mt-0.5">{hashA}</div>
              <span className="text-[9px] text-zinc-600 italic block mt-1">
                {t({ en: "Not downloaded!", ti: "ኣየውረድካዮን!" }, isTi)}
              </span>
            </div>

            {/* Hash B */}
            <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-2.5 text-center opacity-60">
              <div className="text-xs font-bold text-zinc-300">Hash B</div>
              <div className="text-[10px] font-mono text-zinc-500 mt-0.5">{hashB}</div>
              <span className="text-[9px] text-zinc-600 italic block mt-1">
                {t({ en: "Not downloaded!", ti: "ኣየውረድካዮን!" }, isTi)}
              </span>
            </div>

            {/* Hash C (Your Target Transaction!) */}
            <div className={`rounded-xl border-2 p-2.5 text-center shadow-lg transition-all ${
              tampered
                ? "border-red-500 bg-red-950/40 text-red-200 ring-2 ring-red-500/30"
                : "border-cyan-500 bg-cyan-950/30 text-cyan-200 ring-2 ring-cyan-500/40"
            }`}>
              <div className="text-xs font-bold text-cyan-300">Hash C</div>
              <div className="text-[10px] font-mono font-bold mt-0.5 text-white">{hashC}</div>
              <span className="mt-1 inline-block rounded bg-cyan-500/20 px-1.5 py-0.2 text-[9px] font-bold text-cyan-300">
                {t({ en: "Your Tx (Target)", ti: "ናትካ ክፍሊት" }, isTi)}
              </span>
            </div>

            {/* Hash D (Sibling Partner) */}
            <div className="rounded-xl border-2 border-amber-500/40 bg-amber-950/20 p-2.5 text-center shadow-md">
              <div className="text-xs font-bold text-amber-300">Hash D</div>
              <div className="text-[10px] font-mono text-amber-400 mt-0.5">{hashD}</div>
              <span className="mt-1 inline-block rounded bg-amber-500/20 px-1.5 py-0.2 text-[9px] font-bold text-amber-300">
                {t({ en: "Proof Sibling", ti: "መወከሲ መረጋገጺ" }, isTi)}
              </span>
            </div>
          </div>

          {/* LEVEL 0: Transaction IDs underneath */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-[11px] font-mono text-zinc-400 pt-2 border-t border-zinc-800 mt-2">
            <div>
              <span className="block font-semibold text-zinc-400">Transaction ID A</span>
              <span className="text-[9px] text-zinc-600">Alice → Bob (0.05 BTC)</span>
            </div>
            <div>
              <span className="block font-semibold text-zinc-400">Transaction ID B</span>
              <span className="text-[9px] text-zinc-600">Chala → Dawit (0.12 BTC)</span>
            </div>
            <div>
              <span className="block font-bold text-cyan-400">Transaction ID C</span>
              <span className="text-[9px] text-cyan-300 font-semibold">Your 0.45 BTC Payment!</span>
            </div>
            <div>
              <span className="block font-semibold text-amber-400">Transaction ID D</span>
              <span className="text-[9px] text-zinc-500">Miner Coinbase (3.125 BTC)</span>
            </div>
          </div>
        </div>

        {/* Interactive Tamper Button */}
        <div className="pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-zinc-200 block">
              {t({ en: "Test Tamper Resistance (Fraud Detection):", ti: "ናይ ምግርጫው መከላኸሊ ፈትን፦" }, isTi)}
            </span>
            <p className="text-xs text-zinc-400">
              {t(
                {
                  en: "What if an attacker tries to change even 1 satoshi in Transaction C?",
                  ti: "ሰራቒ ኣብ ትራንዛክሽን C ዋላ 1 ሳትስ ጥራይ ክልውጥ እንተዝፍትን እንታይ መጋጠመ?",
                },
                isTi
              )}
            </p>
          </div>
          <button
            onClick={() => setTampered(!tampered)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer flex items-center gap-2 shadow-lg ${
              tampered
                ? "bg-red-500 text-white"
                : "border border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
            }`}
          >
            {tampered ? (
              <>
                <XCircle className="h-4 w-4" />
                {t({ en: "Tamper Active (Block Broken!)", ti: "ምግርጫው ተኸሲቱ (ብሎክ ፈሺሉ!)" }, isTi)}
              </>
            ) : (
              <>
                <Split className="h-4 w-4 text-cyan-400" />
                {t({ en: "Alter 1 Byte in Tx C", ti: "1 ባይት ቀይር" }, isTi)}
              </>
            )}
          </button>
        </div>

        {/* Result Callout */}
        {tampered ? (
          <div className="rounded-xl border border-red-500/40 bg-red-950/20 p-4 space-y-2">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
              <ShieldAlert className="h-5 w-5" />
              <span>{t({ en: "CRYPTOGRAPHIC FAILURE: Tamper Detected!", ti: "ሓደጋ፦ ምግርጫው ብቕጽበት ተታሒዙ!" }, isTi)}</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-mono">
              {t(
                {
                  en: "Because the attacker modified Transaction C, its hash changed to 'h4ck'. That broke Hash CD ('BAD9'), which broke the calculated Merkle Root ('CORRUPTED_ROOT_9999'). Because the root does not match the Block Header, your phone rejects the fake payment instantly!",
                  ti: "እቲ ሰራቒ ንትራንዛክሽን C ስለዝቐየሮ፡ ናቱ ሃሽ ናብ 'h4ck' ተለዊጡ። እዚ ድማ ንHash CD ኣበላሽይዎ፡ ኣብ መወዳእታ ድማ እቲ ሜርክል ሩት ፈጺሙ ካልእ ኮይኑ። ምስቲ ናይ ብሎክ ርእሲ ስለዘይተሰማምዐ፡ ስልክኻ ነቲ ናይ ሓሶት ክፍሊት ብቕጽበት ትነጽጎ!",
                },
                isTi
              )}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <ShieldCheck className="h-5 w-5" />
              <span>{t({ en: "MATHEMATICAL PROOF VERIFIED: Transaction C is in the Block!", ti: "ሒሳባዊ መረጋገጺ ተዓዊቱ፦ ትራንዛክሽን C ኣብቲ ብሎክ ኣሎ!" }, isTi)}</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-mono">
              {t(
                {
                  en: "Calculated Root ('GENUINE_ROOT_ABCD') exactly matches the Merkle Root inside the 80-byte Block Header. Your phone verified your payment by downloading only 2 small hashes (Hash D and Hash AB), without downloading the rest of the block!",
                  ti: "እቲ ዝተሓስበ ሩት ('GENUINE_ROOT_ABCD') ምስቲ ኣብ ናይ ብሎክ ርእሲ ዘሎ ብትኽክል ተመሳሲሉ። ስልክኻ 2 ንኣሽቱ ሃሽ ጥራይ (Hash Dን Hash ABን) ብምውራድ፡ ንኻልኦት ትራንዛክሽናት ከየውረደት ክፍሊትካ 100% ቅኑዕ ምዃኑ ኣረጋጊጻ!",
                },
                isTi
              )}
            </p>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          WALKTHROUGH VIEW: Step by step explanation of SPV
         ───────────────────────────────────────────────────────────── */}
      {viewMode === "step_by_step" && (
        <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-purple-400">
            {t({ en: "How Your Phone Verifies Tx C in 3 Simple Math Steps:", ti: "ስልክኻ ንትራንዛክሽን C ብ3 ሒሳባዊ ደረጃታት ብኸመይ ተረጋግጽ፦" }, isTi)}
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="rounded-lg bg-zinc-950 p-3 border border-zinc-800 flex items-start gap-3">
              <span className="rounded bg-cyan-500 text-zinc-950 px-2 py-0.5 text-xs font-bold">1</span>
              <div>
                <span className="font-bold text-cyan-300 block">Step 1: Your Phone Has Your Transaction (Tx C)</span>
                <span className="text-zinc-400 text-[11px]">
                  Your wallet hashes your incoming transaction: <strong className="text-white">SHA256(Tx C) → Hash C ({hashC})</strong>.
                </span>
              </div>
            </div>

            <div className="rounded-lg bg-zinc-950 p-3 border border-zinc-800 flex items-start gap-3">
              <span className="rounded bg-amber-500 text-zinc-950 px-2 py-0.5 text-xs font-bold">2</span>
              <div>
                <span className="font-bold text-amber-300 block">Step 2: Network Sends Partner Hash #1 (Hash D)</span>
                <span className="text-zinc-400 text-[11px]">
                  Your phone glues Hash C and Hash D together and hashes them: <strong className="text-white">SHA256(Hash C + Hash D) → Hash CD ({hashCD})</strong>.
                </span>
              </div>
            </div>

            <div className="rounded-lg bg-zinc-950 p-3 border border-zinc-800 flex items-start gap-3">
              <span className="rounded bg-sky-500 text-zinc-950 px-2 py-0.5 text-xs font-bold">3</span>
              <div>
                <span className="font-bold text-sky-300 block">Step 3: Network Sends Partner Hash #2 (Hash AB)</span>
                <span className="text-zinc-400 text-[11px]">
                  Your phone glues Hash AB and Hash CD together and hashes them: <strong className="text-white">SHA256(Hash AB + Hash CD) → Merkle Root ({calculatedRoot})</strong>.
                </span>
              </div>
            </div>

            <div className="rounded-lg bg-zinc-950 p-3 border border-emerald-500/40 text-emerald-300 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Step 4: Compare with 80-byte Block Header</span>
                <span className="text-zinc-300 text-[11px]">
                  The phone checks its 80-byte block header. The calculated root matches the header's Merkle root. Inclusion is mathematically proven without downloading Transaction A, B, or D!
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mathematical Superpower Callout */}
      <div className="mt-4 rounded-xl border border-purple-500/40 bg-purple-950/20 p-4 flex items-start gap-3">
        <Sparkles className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-300 space-y-1">
          <span className="font-bold text-purple-300 text-sm">
            {t({ en: "The Logarithmic Superpower of Merkle Trees:", ti: "ናይ ሜርክል ዛፍ ሒሳባዊ ሓይሊ፦" }, isTi)}
          </span>
          <p className="leading-relaxed">
            {t(
              {
                en: "If a Bitcoin block has 4 transactions, your phone only needs 2 partner hashes. If a block has 4,096 transactions, your phone only needs 12 partner hashes! Even if a block had 1,000,000 transactions, your phone would only need 20 hashes (less than 1 KB of mobile data) to prove your payment is real.",
                ti: "ሓደ ብሎክ 4 ትራንዛክሽናት እንተሃልይዎ፡ ስልክኻ 2 መረጋገጺ ሃሽ ጥራይ የድልያ። 4,096 ትራንዛክሽናት እንተሃልይዎ ድማ 12 ሃሽ ጥራይ የድልያ! 1,000,000 ትራንዛክሽናት እኳ እንተዝህልዎ፡ ስልክኻ ክፍሊትካ ንምርግጋጽ 20 ሃሽ ጥራይ (ትሕቲ 1 KB ዳታ) እዩ ዘድልያ።",
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
   Module 3: Node Validator Sandbox (Section 12.2)
   Theme: "Why Run a Node: Independent Validation vs 3rd Party Surveillance"
   ========================================================================= */

interface NodeValidatorProps {
  isTi: boolean;
}

type NodeRuleAttack = "inflation" | "double_spend" | "bad_signature";

function NodeValidatorSandbox({ isTi }: NodeValidatorProps) {
  const [nodeMode, setNodeMode] = useState<"public_server" | "own_node">("own_node");
  const [testedRule, setTestedRule] = useState<NodeRuleAttack>("inflation");
  const [attackOutcome, setAttackOutcome] = useState<string | null>(null);

  const ruleScenarios = {
    inflation: {
      name: { en: "Miner Tries to Print 50 BTC (Inflation)", ti: "ማይነር 50 BTC ክሓትም ይፍትን (ሕጊ ምጥሓስ)" },
      desc: { en: "A greedy mining pool attempts to award itself 50 BTC instead of the 3.125 BTC halving rule.", ti: "ማይነር ካብቲ ሕጊ ዝፈቕዶ 3.125 BTC ንላዕሊ 50 BTC ክወስድ ይፍትን።" },
    },
    double_spend: {
      name: { en: "Miner Includes Double-Spend Tx", ti: "ሓደ ሳንቲም ብኽልተ ቦታ ምጥቃም" },
      desc: { en: "A miner tries to include a transaction spending a UTXO that was already spent in a prior block.", ti: "ኣቐዲሙ ዝጠፍአ ሳንቲም ዳግማይ ንምጥቃም ዝግበር ፈተነ።" },
    },
    bad_signature: {
      name: { en: "Transaction with Invalid Cryptographic Signature", ti: "ናይ ሓሶት ክሪፕቶግራፊክ ፊርማ" },
      desc: { en: "A transaction contains forged ECDSA/Schnorr signature bytes that do not match the public key.", ti: "ምስቲ ናይ ብሓቂ ህዝባዊ መፍትሕ ዘይሰማማዕ ናይ ሓሶት ፊርማ።" },
    },
  };

  const handleTestRule = (rule: NodeRuleAttack) => {
    setTestedRule(rule);
    if (nodeMode === "own_node") {
      setAttackOutcome("REJECTED_BY_NODE");
    } else {
      setAttackOutcome("EXPLOITED_BY_SERVER");
    }
  };

  return (
    <div className={panelClass}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <Server className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
                {t({ en: "Section 12.2 Interactive", ti: "ክፍሊ 12.2 መስተጋብራዊ" }, isTi)}
              </span>
              <span className="text-xs text-zinc-400">
                {t({ en: "Sovereign Node Enforcement", ti: "ናይ ኖድ ልኡላውነት ፈተነ" }, isTi)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100">
              {t(
                {
                  en: "Why Run a Node: Who Decides the Rules of Bitcoin?",
                  ti: "ስለምንታይ ኖድ ተንቀሳቕስ፦ ናይ ቢትኮይን ሕግታት መን ይውስን?",
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
            en: "Miners propose blocks, but NODES enforce the rules. If a miner breaks even 1 rule (e.g. printing extra bitcoin), every sovereign node on earth instantly rejects the block. Compare querying a 3rd-party explorer vs running your own node:",
            ti: "ማይነራት ብሎክ የዳልዉ፡ ኖዳት (Nodes) ግን ነቲ ሕጊ የኽብሩ። ማይነር ሓንቲ ሕጊ እንተጣሒሱ ኣብ ዓለም ዘሎ ነፍሲ ወከፍ ኖድ ይነጽጎ። ኣብ መንጎ ናይ ካልእ ሰብ ኤክስፕሎረር ምጥቃምን ናትካ ኖድ ምውላዕን ዘሎ ፍልልይ ተዓዘብ፦",
          },
          isTi
        )}
      </p>

      {/* Mode Toggle */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => {
            setNodeMode("own_node");
            setAttackOutcome(null);
          }}
          className={`rounded-xl border p-4 text-left transition cursor-pointer ${
            nodeMode === "own_node"
              ? "border-emerald-500 bg-emerald-950/20 shadow-md ring-1 ring-emerald-500/30"
              : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-sm text-zinc-100 flex items-center gap-2">
              <Server className="h-4 w-4 text-emerald-400" />
              {t({ en: "Running Your Own Node (Sovereign)", ti: "ናትካ ኖድ ምውላዕ (ልኡላዊ)" }, isTi)}
            </span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-xs text-zinc-400">
            {t(
              {
                en: "Zero third-party trust. Your node validates every block from Genesis. No IP address leakage.",
                ti: "ኣብ ካልእ ሰብ ዘይተመርኮሰ። ካብ ጀነሲስ ጀሚሩ ኩሉ ባዕሉ የረጋግጽ። ናይ IP ኣድራሻ ምፍሳስ የለን።",
              },
              isTi
            )}
          </p>
        </button>

        <button
          onClick={() => {
            setNodeMode("public_server");
            setAttackOutcome(null);
          }}
          className={`rounded-xl border p-4 text-left transition cursor-pointer ${
            nodeMode === "public_server"
              ? "border-red-500 bg-red-950/20 shadow-md ring-1 ring-red-500/30"
              : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-sm text-zinc-100 flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-red-400" />
              {t({ en: "Using 3rd-Party Explorer (Centralized)", ti: "ናይ ካልእ ኤክስፕሎረር ምጥቃም" }, isTi)}
            </span>
            <ShieldAlert className="h-4 w-4 text-red-400" />
          </div>
          <p className="text-xs text-zinc-400">
            {t(
              {
                en: "The website server logs your real IP address with all your Bitcoin addresses. If the server lies, you believe it.",
                ti: "እቲ መርበብ ሓበሬታ ናይ ኮምፒተርካ IP ኣድራሻ ምስ ናይ ቢትኮይን ሳንቲማትካ ይቐድሖ።",
              },
              isTi
            )}
          </p>
        </button>
      </div>

      {/* Consensus Rule Enforcer Sandbox */}
      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
          {t({ en: "Test Consensus Attack Against Your Node:", ti: "ናይ ሕጊ ምጥሓስ ፈተነ ኣብ ኖድካ ፈትን፦" }, isTi)}
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {(Object.keys(ruleScenarios) as NodeRuleAttack[]).map((rule) => (
            <button
              key={rule}
              onClick={() => handleTestRule(rule)}
              className={`rounded-lg border p-3 text-left text-xs font-medium transition cursor-pointer ${
                testedRule === rule
                  ? "border-amber-500 bg-amber-500/10 text-amber-300"
                  : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700"
              }`}
            >
              <div className="font-bold">{t(ruleScenarios[rule].name, isTi)}</div>
            </button>
          ))}
        </div>

        <div className="rounded-lg bg-zinc-950 p-3 border border-zinc-800 text-xs text-zinc-300">
          <span className="text-zinc-500 font-semibold block mb-1">
            {t({ en: "Attack Scenario:", ti: "ናይቲ ፈተነ ኩነታት፦" }, isTi)}
          </span>
          {t(ruleScenarios[testedRule].desc, isTi)}
        </div>

        {/* Outcome Display */}
        {attackOutcome && (
          <div className="mt-3">
            {nodeMode === "own_node" ? (
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <ShieldCheck className="h-5 w-5" />
                  <span>{t({ en: "CONSENSUS ENFORCED: Block Instantly Rejected!", ti: "ሕጊ ተኸቢሩ፦ እቲ ብሎክ ብቕጽበት ተነጺጉ!" }, isTi)}</span>
                </div>
                <p className="text-xs text-zinc-300 font-mono leading-relaxed">
                  {t(
                    {
                      en: "Your Bitcoin node independently checked the math, found the violation, and dropped the block into the trash. The miner wasted $200,000 in electricity for creating an invalid block!",
                      ti: "ናይ ቢትኮይን ኖድካ ነቲ ሒሳብ ብባዕሉ መርሚሩ እቲ ጌጋ ስለዝረኸቦ ነቲ ብሎክ ደርብይዎ። እቲ ማይነር ዘጥፍኦ $200,000 ናይ መብራህቲ ኪሳራ ኮይኑ ተሪፉ!",
                    },
                    isTi
                  )}
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-red-500/40 bg-red-950/20 p-4 space-y-2">
                <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                  <ShieldAlert className="h-5 w-5" />
                  <span>{t({ en: "BLIND TRUST FAILURE: You Believe the 3rd Party!", ti: "ናይ ምእማን ሓደጋ፦ ብናይ ሰብ ሓሶት ተታሊልካ!" }, isTi)}</span>
                </div>
                <p className="text-xs text-zinc-300 font-mono leading-relaxed">
                  {t(
                    {
                      en: "Because you have no node of your own, you blindly display whatever the public website tells you. If the website is compromised or running a rogue client, your wallet is completely fooled.",
                      ti: "ናይ ባዕልኻ ኖድ ስለዘይብልካ፡ እቲ ናይ ካልእ ሰብ መርበብ ሓበሬታ ዝነገረካ ጥራይ ኢኻ እትኣምን።",
                    },
                    isTi
                  )}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   Module 4: Node Sync Calculator (Section 12.3)
   Theme: "First-Time Node Sync: Storage, IBD & Bandwidth Planner"
   ========================================================================= */

interface NodeSyncProps {
  isTi: boolean;
}

function NodeSyncCalculator({ isTi }: NodeSyncProps) {
  const [nodeType, setNodeType] = useState<"full" | "pruned" | "light">("pruned");
  const [internetSpeedMbps, setInternetSpeedMbps] = useState<number>(30); // 30 Mbps
  const [storageDevice, setStorageDevice] = useState<"ssd" | "hdd">("ssd");

  // Approximate calculations
  // Blockchain size ~650 GB = 5,200,000 Megabits
  const totalDataGb = nodeType === "full" ? 650 : nodeType === "pruned" ? 12 : 0.2;
  const downloadHours = (650 * 8 * 1024) / (internetSpeedMbps * 3600); // hours to download 650 GB
  const verificationMultiplier = storageDevice === "ssd" ? 1.0 : 3.5;
  const estimatedDays = Math.max(0.5, ((downloadHours * verificationMultiplier) / 24)).toFixed(1);

  return (
    <div className={panelClass}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
            <HardDrive className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-400">
                {t({ en: "Section 12.3 Interactive", ti: "ክፍሊ 12.3 መስተጋብራዊ" }, isTi)}
              </span>
              <span className="text-xs text-zinc-400">
                {t({ en: "Hardware & Bandwidth Planner", ti: "ናይ ሃርድዌርን ኢንተርነትን ትልሚ" }, isTi)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100">
              {t(
                {
                  en: "First-Time Node Sync: Full vs Pruned Node Planner",
                  ti: "ናይ መጀመርያ ኖድ ምውላዕ፦ ሙሉእ ወይ ፕሩንድ (Pruned) ኖድ ትልሚ",
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
            en: "You don't need an expensive enterprise server to run a Bitcoin node. A cheap mini PC or old laptop with a pruned configuration gives you 100% full validation on just 10 GB of storage. Plan your node setup below:",
            ti: "ናይ ቢትኮይን ኖድ ንምውላዕ ክቡር ኮምፒተር ኣየድልየካን። ብሓጺር Pruned ቅጥዒ ኣብ ንእሽቶ 10 GB ቦታ ጥራይ ሙሉእ ናይ ምርግጋጽ ሓይሊ ክትረክብ ትኽእል። ንናትካ ምቹእ ዝኾነ ኣሰራርሓ ምረጽ፦",
          },
          isTi
        )}
      </p>

      {/* Node Type Selector */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            id: "full",
            title: "Full Archival Node",
            size: "650+ GB Storage",
            desc: "Keeps every block since 2009. Can serve historical blocks to other peers.",
            badge: "Maximum Independence",
          },
          {
            id: "pruned",
            title: "Pruned Node (Recommended)",
            size: "10–15 GB Storage",
            desc: "Verifies every block from Genesis, but deletes old block data. 100% full validation!",
            badge: "Best for Most Users",
          },
          {
            id: "light",
            title: "Light / SPV Node",
            size: "< 100 MB Storage",
            desc: "Downloads only headers and Merkle proofs. Relies on external nodes for full validation.",
            badge: "Low Resource",
          },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setNodeType(item.id as any)}
            className={`rounded-xl border p-3.5 text-left transition cursor-pointer relative ${
              nodeType === item.id
                ? "border-cyan-500 bg-cyan-950/20 shadow-md ring-1 ring-cyan-500/30"
                : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
            }`}
          >
            <div className="text-[10px] uppercase font-bold text-cyan-400 mb-1">{item.badge}</div>
            <div className="font-bold text-xs text-zinc-100">{item.title}</div>
            <div className="text-[11px] font-mono text-amber-400 mt-0.5">{item.size}</div>
            <p className="text-[11px] text-zinc-400 mt-1 leading-snug">{item.desc}</p>
          </button>
        ))}
      </div>

      {/* Parameters: Internet Speed & Storage Type */}
      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-4">
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-zinc-400 font-semibold">{t({ en: "Your Internet Connection Speed:", ti: "ናይ ኢንተርነትካ ፍጥነት፦" }, isTi)}</span>
            <span className="font-mono text-cyan-400 font-bold">{internetSpeedMbps} Mbps</span>
          </div>
          <input
            type="range"
            min={5}
            max={200}
            step={5}
            value={internetSpeedMbps}
            onChange={(e) => setInternetSpeedMbps(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-800">
          <span className="text-xs text-zinc-400 font-semibold">{t({ en: "Storage Drive Type:", ti: "ናይ ዝኽሪ (Hard Drive) ዓይነት፦" }, isTi)}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setStorageDevice("ssd")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                storageDevice === "ssd"
                  ? "bg-cyan-500 text-zinc-950"
                  : "bg-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              Solid State Drive (SSD)
            </button>
            <button
              onClick={() => setStorageDevice("hdd")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                storageDevice === "hdd"
                  ? "bg-cyan-500 text-zinc-950"
                  : "bg-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              Spinning Hard Drive (HDD)
            </button>
          </div>
        </div>
      </div>

      {/* Sync Estimate Card */}
      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center font-mono">
        <div className="rounded-lg bg-zinc-900 p-2.5 border border-zinc-800">
          <span className="text-[10px] text-zinc-500 block uppercase">Final Disk Footprint</span>
          <span className="text-zinc-100 font-bold text-sm">{totalDataGb} GB</span>
        </div>
        <div className="rounded-lg bg-zinc-900 p-2.5 border border-zinc-800">
          <span className="text-[10px] text-zinc-500 block uppercase">Initial Block Download</span>
          <span className="text-amber-400 font-bold text-sm">~{estimatedDays} Days</span>
        </div>
        <div className="rounded-lg bg-zinc-900 p-2.5 border border-zinc-800">
          <span className="text-[10px] text-zinc-500 block uppercase">Sovereignty Level</span>
          <span className={`font-bold text-sm ${nodeType === "light" ? "text-amber-400" : "text-emerald-400"}`}>
            {nodeType === "light" ? "Medium (Headers Only)" : "100% Full Verification"}
          </span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   Master Chapter 12 Export Component
   ========================================================================= */

interface Chapter12LessonProps {
  module: "block_explorer_lab" | "merkle_proof_visualizer" | "node_validator_sandbox" | "node_sync_calculator";
  isTi: boolean;
}

export function Chapter12InteractiveLesson({ module, isTi }: Chapter12LessonProps) {
  switch (module) {
    case "block_explorer_lab":
      return <BlockExplorerLab isTi={isTi} />;
    case "merkle_proof_visualizer":
      return <MerkleProofVisualizer isTi={isTi} />;
    case "node_validator_sandbox":
      return <NodeValidatorSandbox isTi={isTi} />;
    case "node_sync_calculator":
      return <NodeSyncCalculator isTi={isTi} />;
    default:
      return null;
  }
}
