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
   Module 2: Merkle Proof Visualizer (Section 12.1)
   Theme: "Proving Inclusion: Merkle Trees & Light Client Proofs"
   ========================================================================= */

interface MerkleProofProps {
  isTi: boolean;
}

function MerkleProofVisualizer({ isTi }: MerkleProofProps) {
  const [selectedTx, setSelectedTx] = useState<number>(2); // 0, 1, 2, 3 (Tx C is index 2)
  const [tampered, setTampered] = useState<boolean>(false);

  // 4 Transactions in the block
  const txData = [
    { id: 0, label: "Tx A (Alice → Bob)", hash: "a1b2", value: "0.05 BTC" },
    { id: 1, label: "Tx B (Chala → Dawit)", hash: "c3d4", value: "0.12 BTC" },
    { id: 2, label: "Tx C (Your Payment!)", hash: tampered ? "h4ck" : "e5f6", value: "0.45 BTC" },
    { id: 3, label: "Tx D (Mining Pool Reward)", hash: "7890", value: "3.125 BTC" },
  ];

  // Intermediate node hashes
  const hAB = "hash(a1b2 + c3d4) → 38a9";
  const hCD = tampered
    ? "hash(h4ck + 7890) → BAD9 (INVALID!)"
    : "hash(e5f6 + 7890) → 71fc";

  const calculatedRoot = tampered ? "ROOT_CORRUPTED_9999" : "ROOT_GENUINE_48a1";
  const blockHeaderRoot = "ROOT_GENUINE_48a1";
  const isProofValid = calculatedRoot === blockHeaderRoot;

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
                {t({ en: "Cryptographic Merkle Path", ti: "ናይ ሜርክል ዛፍ መረጋገጺ" }, isTi)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100">
              {t(
                {
                  en: "How SPV & Light Wallets Prove Inclusion Without Downloading Blocks",
                  ti: "ናይ ስልኪ ዋሌታት ብዘይ ምሉእ ብሎክ ምውራድ ብኸመይ ትራንዛክሽን የረጋግጹ",
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
            en: "A Bitcoin block contains thousands of transactions. How can a smartphone wallet verify that YOUR payment is inside a block without downloading 600 GB of data? By checking a tiny mathematical proof called a Merkle Path:",
            ti: "ሓደ ናይ ቢትኮይን ብሎክ ኣሽሓት ትራንዛክሽናት ይሕዝ። ናይ ስልኪ ዋሌት 600 GB ዳታ ከየውረደ ናትካ ክፍሊት ኣብቲ ብሎክ ምህላዉ ብኸመይ ይፈልጥ? ሜርክል ፓዝ (Merkle Path) ብዝበሃል ንእሽቶ ሒሳባዊ መረጋገጺ ኣቢሉ፦",
          },
          isTi
        )}
      </p>

      {/* Merkle Tree Interactive Diagram */}
      <div className="mt-4 rounded-xl border border-zinc-800 bg-black p-4 sm:p-6 space-y-6">
        {/* Top: Merkle Root in Block Header */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-1">
            {t({ en: "Block Header (80 Bytes Only)", ti: "ናይ ብሎክ ርእሲ (80 ባይት ጥራይ)" }, isTi)}
          </span>
          <div className={`rounded-xl border px-4 py-2 text-center font-mono text-xs font-bold ${
            isProofValid
              ? "border-emerald-500/50 bg-emerald-950/40 text-emerald-300"
              : "border-red-500/50 bg-red-950/40 text-red-300 animate-pulse"
          }`}>
            <div>Merkle Root: {calculatedRoot}</div>
            <span className="text-[10px] font-normal text-zinc-400">
              {isProofValid ? "✓ Matches Block Header!" : "❌ Mismatch! Block Header Rejects!"}
            </span>
          </div>
        </div>

        {/* Tree Connectors Level 1 */}
        <div className="grid grid-cols-2 gap-4 text-center font-mono text-[11px]">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-2 text-zinc-400">
            <span className="text-[9px] text-zinc-600 block">Branch Hash AB</span>
            {hAB}
          </div>
          <div className={`rounded-lg border p-2 font-bold ${
            tampered
              ? "border-red-500/40 bg-red-950/30 text-red-300"
              : "border-purple-500/40 bg-purple-950/30 text-purple-300"
          }`}>
            <span className="text-[9px] text-zinc-500 block">Branch Hash CD (Derived)</span>
            {hCD}
          </div>
        </div>

        {/* Bottom Level: 4 Leaf Transactions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-zinc-900">
          {txData.map((tx) => {
            const isTarget = tx.id === selectedTx;
            const isSibling = (selectedTx === 2 && tx.id === 3) || (selectedTx === 3 && tx.id === 2);
            return (
              <div
                key={tx.id}
                onClick={() => setSelectedTx(tx.id)}
                className={`rounded-lg border p-2.5 text-xs font-mono transition cursor-pointer ${
                  isTarget
                    ? "border-cyan-500 bg-cyan-950/30 text-cyan-200 ring-2 ring-cyan-500/30"
                    : isSibling
                    ? "border-purple-500/40 bg-purple-950/20 text-purple-300"
                    : "border-zinc-800 bg-zinc-900/30 text-zinc-500 hover:border-zinc-700"
                }`}
              >
                <div className="text-[10px] font-bold uppercase flex justify-between">
                  <span>{tx.id === 2 ? "Your Tx (Tx C)" : `Tx #${tx.id + 1}`}</span>
                  {isTarget && <span className="text-cyan-400">Target</span>}
                  {isSibling && <span className="text-purple-400">Sibling</span>}
                </div>
                <div className="font-bold text-zinc-200 mt-1">{tx.value}</div>
                <div className="text-[10px] text-zinc-400 truncate">Hash: {tx.hash}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tamper Test Toggle */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
        <div>
          <span className="text-xs font-bold text-zinc-200 block">
            {t({ en: "Try Tampering with Tx C Data:", ti: "ንትራንዛክሽን C ክትልውጦ ፈትን፦" }, isTi)}
          </span>
          <p className="text-xs text-zinc-400">
            {t(
              {
                en: "What if a hacker tries to forge your payment amount by 1 satoshi?",
                ti: "ሓደ ሰራቒ ነቲ ዝኸፈልካዮ መጠን ብ1 ሳትስ ጥራይ ክልውጦ እንተዝፍትን እንታይ መጋጠመ?",
              },
              isTi
            )}
          </p>
        </div>
        <button
          onClick={() => setTampered(!tampered)}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            tampered
              ? "bg-red-500 text-white"
              : "border border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
          }`}
        >
          {tampered ? (
            <>
              <XCircle className="h-4 w-4" />
              {t({ en: "Tamper Active (Corrupted!)", ti: "ምጭብርባር ተኸሲቱ!" }, isTi)}
            </>
          ) : (
            <>
              <Check className="h-4 w-4 text-emerald-400" />
              {t({ en: "Tamper 1 Byte in Tx C", ti: "1 ባይት ቀይር" }, isTi)}
            </>
          )}
        </button>
      </div>

      {/* SPV Proof Efficiency Insight */}
      <div className="mt-4 rounded-xl border border-cyan-500/40 bg-cyan-950/20 p-4 flex items-start gap-3">
        <Sparkles className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-300 space-y-1">
          <span className="font-bold text-cyan-300">
            {t({ en: "The Power of O(log N) Verification:", ti: "ናይ O(log N) ቅልጣፈ፦" }, isTi)}
          </span>
          <p className="leading-relaxed">
            {t(
              {
                en: "To verify your transaction in a block of 2,048 transactions, your phone does NOT need to download 2,048 transactions. It only downloads 11 partner hashes (less than 1 KB of data)! It hashes them up to the root, compares with the block header, and verifies inclusion with 100% cryptographic certainty.",
                ti: "ኣብ 2,048 ትራንዛክሽናት ዘለዎ ብሎክ፡ ስልክኻ ነተን 2,048 ትራንዛክሽናት ምውራድ ኣየድልያን። 11 መረጋገጺ ሃሽ ጥራይ (ትሕቲ 1 KB) ብምውራድ፡ ምስቲ ናይ ብሎክ ርእሲ ብምውድዳር 100% ቅኑዕ ምዃኑ ብሒሳብ ተረጋግጽ።",
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
