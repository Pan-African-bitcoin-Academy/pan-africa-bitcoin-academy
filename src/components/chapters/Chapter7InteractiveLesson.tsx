"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Hash,
  Link2,
  Pickaxe,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Copy,
  Check,
  Plus,
  ArrowRight,
  Layers,
  Clock,
  Coins,
  Cpu,
  Radio,
  FileCode,
  Flame,
  Search,
} from "lucide-react";
import { LiveBlockchainData } from "@/components/LiveBlockchainData";

/* ─────────── Shared helpers ─────────── */

type Localized = { en: string; ti: string };
const t = (v: Localized, isTi: boolean) => (isTi ? v.ti : v.en);

const panelClass =
  "rounded-2xl border border-zinc-800 bg-zinc-950/90 p-4 shadow-xl sm:p-6 my-6";

/** Browser-native SHA-256, returns 64-char hex string. */
async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Truncate a hex hash for compact display. */
function shortHash(hash: string, len = 12): string {
  if (!hash) return "—";
  return hash.slice(0, len) + "…";
}

/* =========================================================================
   Module 1: Block Formation Simulator (Section 7.0 - What Is a Block?)
   ========================================================================= */

interface MempoolTx {
  id: string;
  sender: string;
  receiver: string;
  amountBtc: number;
  feeSats: number;
}

const INITIAL_MEMPOOL_TXS: MempoolTx[] = [
  { id: "tx_1", sender: "Alice", receiver: "Bob", amountBtc: 0.25, feeSats: 2400 },
  { id: "tx_2", sender: "Dawit", receiver: "Chaltu", amountBtc: 1.10, feeSats: 4500 },
  { id: "tx_3", sender: "Satoshi", receiver: "Hal Finney", amountBtc: 10.0, feeSats: 1000 },
  { id: "tx_4", sender: "Kofi", receiver: "Amina", amountBtc: 0.05, feeSats: 1800 },
  { id: "tx_5", sender: "PBA Treasury", receiver: "Student Grant", amountBtc: 0.50, feeSats: 3200 },
];

function BlockFormationSimulator({ isTi }: { isTi: boolean }) {
  const [availableMempool, setAvailableMempool] = useState<MempoolTx[]>(INITIAL_MEMPOOL_TXS);
  const [selectedTxs, setSelectedTxs] = useState<MempoolTx[]>([INITIAL_MEMPOOL_TXS[0], INITIAL_MEMPOOL_TXS[1]]);
  const [nonce, setNonce] = useState(1048576);
  const [timestamp, setTimestamp] = useState<string>("");
  const [merkleRoot, setMerkleRoot] = useState<string>("");
  const [blockHash, setBlockHash] = useState<string>("");
  const [isSealed, setIsSealed] = useState(false);

  // Custom tx inputs
  const [customSender, setCustomSender] = useState("");
  const [customReceiver, setCustomReceiver] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [showAddTx, setShowAddTx] = useState(false);

  const prevHash = "00000000000000000001a4f3b8c9d2e1f0e4b7a2d5c8e1f3a6b9c2d5e8f1a4b7";
  const blockHeight = 884210;
  const coinbaseReward = 3.125; // current subsidy

  // Set initial timestamp
  useEffect(() => {
    setTimestamp(new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC");
  }, []);

  // Compute Merkle Root & Block Hash when transactions change
  useEffect(() => {
    let cancelled = false;
    async function calculate() {
      // Merkle root of coinbase + selected txs
      const txPayload = `coinbase:3.125|` + selectedTxs.map((t) => `${t.sender}->${t.receiver}:${t.amountBtc}`).join("|");
      const root = await sha256Hex(txPayload);
      if (cancelled) return;
      setMerkleRoot(root);

      // Block Header hash = sha256(prevHash + merkleRoot + timestamp + nonce)
      const header = `${prevHash}|${root}|${timestamp}|${nonce}`;
      const bHash = await sha256Hex(header);
      if (cancelled) return;
      setBlockHash(bHash);
    }
    calculate();
    return () => {
      cancelled = true;
    };
  }, [selectedTxs, nonce, timestamp]);

  const addTxToBlock = (tx: MempoolTx) => {
    if (selectedTxs.find((t) => t.id === tx.id)) return;
    setSelectedTxs((prev) => [...prev, tx]);
    setAvailableMempool((prev) => prev.filter((t) => t.id !== tx.id));
    setIsSealed(false);
  };

  const removeTxFromBlock = (tx: MempoolTx) => {
    setSelectedTxs((prev) => prev.filter((t) => t.id !== tx.id));
    setAvailableMempool((prev) => [...prev, tx]);
    setIsSealed(false);
  };

  const handleBroadcastCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSender || !customReceiver || !customAmount) return;
    const newTx: MempoolTx = {
      id: `custom_${Date.now()}`,
      sender: customSender.trim(),
      receiver: customReceiver.trim(),
      amountBtc: parseFloat(customAmount) || 0.1,
      feeSats: Math.floor(Math.random() * 3000) + 1500,
    };
    setSelectedTxs((prev) => [...prev, newTx]);
    setCustomSender("");
    setCustomReceiver("");
    setCustomAmount("");
    setShowAddTx(false);
    setIsSealed(false);
  };

  const totalFeesSats = selectedTxs.reduce((sum, tx) => sum + tx.feeSats, 0);
  const totalBtcMoved = selectedTxs.reduce((sum, tx) => sum + tx.amountBtc, 0);

  return (
    <section className={panelClass} aria-label="Block Formation Simulator">
      {/* Header */}
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-400">
          {t(
            { en: "7.0 Interactive: Anatomy of a Bitcoin Block", ti: "7.0 ተሳታፊ: ውቅር ናይ ቢትኮይን ብሎክ" },
            isTi
          )}
        </p>
        <h4 className="mt-1 text-lg font-bold text-zinc-100 sm:text-xl">
          {t(
            { en: "Assemble a Block from the Mempool", ti: "ካብ ሜምፑል ብሎክ ኣዳሉ" },
            isTi
          )}
        </h4>
        <p className="mt-1 text-xs text-zinc-400">
          {t(
            {
              en: "A Bitcoin block is made of two parts: the Block Header (metadata & cryptographic proof) and the Block Body (coinbase reward + user transactions chosen from the mempool).",
              ti: "ናይ ቢትኮይን ብሎክ ካብ ክልተ ኣካላት ዝቖመ እዩ: ርእሲ ብሎክ (Block Header) ከምኡ'ውን ናይ ግብረ-መልስታት ዝርዝር (Block Body).",
            },
            isTi
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Left Column: Mempool Selection (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-cyan-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                  {t({ en: "Mempool (Waiting Queue)", ti: "ሜምፑል (ተጸባይ ግብረ-መልስታት)" }, isTi)}
                </span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">
                {availableMempool.length} {t({ en: "pending", ti: "ይጽበዩ" }, isTi)}
              </span>
            </div>

            <p className="text-xs text-zinc-400 mb-3">
              {t(
                {
                  en: "Click '+' to include pending transactions into your block candidate:",
                  ti: "ግብረ-መልሲ ናብቲ ብሎክ ንምእታው '+' ጠውቕ:",
                },
                isTi
              )}
            </p>

            {/* Mempool TX cards */}
            <div className="space-y-2">
              {availableMempool.length === 0 ? (
                <div className="rounded-lg border border-dashed border-zinc-700 p-4 text-center text-xs text-zinc-500">
                  {t({ en: "All transactions are packed into the block!", ti: "ኩሎም ግብረ-መልስታት ናብ ብሎክ ኣትዮም!" }, isTi)}
                </div>
              ) : (
                availableMempool.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/80 p-2.5 text-xs hover:border-cyan-500/40 transition"
                  >
                    <div>
                      <div className="font-semibold text-zinc-200">
                        {tx.sender} → {tx.receiver}
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        {tx.amountBtc} BTC · Fee: <span className="text-cyan-400 font-mono">+{tx.feeSats} sats</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => addTxToBlock(tx)}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 cursor-pointer transition"
                      title="Add to block"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Custom transaction toggle */}
            {!showAddTx ? (
              <button
                type="button"
                onClick={() => setShowAddTx(true)}
                className="mt-3 w-full rounded-lg border border-dashed border-zinc-700 py-2 text-xs font-medium text-zinc-400 hover:border-cyan-500/50 hover:text-cyan-300 transition cursor-pointer"
              >
                + {t({ en: "Broadcast Custom Transaction", ti: "ሓድሽ ግብረ-መልሲ ፍጠር" }, isTi)}
              </button>
            ) : (
              <form onSubmit={handleBroadcastCustom} className="mt-3 rounded-lg border border-cyan-500/30 bg-zinc-950 p-3 space-y-2 text-xs">
                <span className="font-bold text-zinc-200">{t({ en: "New Transaction", ti: "ሓድሽ ግብረ-መልሲ" }, isTi)}</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Sender (e.g. You)"
                    value={customSender}
                    onChange={(e) => setCustomSender(e.target.value)}
                    className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-200 text-xs"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Receiver (e.g. Merchant)"
                    value={customReceiver}
                    onChange={(e) => setCustomReceiver(e.target.value)}
                    className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-200 text-xs"
                    required
                  />
                </div>
                <input
                  type="number"
                  step="0.001"
                  min="0.001"
                  placeholder="Amount in BTC (e.g. 0.15)"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-200 text-xs"
                  required
                />
                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 rounded bg-cyan-600 py-1 font-semibold text-white hover:bg-cyan-500 transition cursor-pointer"
                  >
                    {t({ en: "Add to Block", ti: "ናብ ብሎክ ወስኽ" }, isTi)}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddTx(false)}
                    className="rounded border border-zinc-700 px-2 py-1 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                  >
                    {t({ en: "Cancel", ti: "ሰርዝ" }, isTi)}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Quick stats */}
          <div className="mt-4 pt-3 border-t border-zinc-800 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-zinc-950 p-2">
              <span className="text-[10px] text-zinc-500 uppercase">{t({ en: "Total Volume", ti: "ጠቕላላ መጠን" }, isTi)}</span>
              <p className="font-bold text-zinc-200 font-mono">{totalBtcMoved.toFixed(3)} BTC</p>
            </div>
            <div className="rounded-lg bg-zinc-950 p-2">
              <span className="text-[10px] text-zinc-500 uppercase">{t({ en: "Miner Fees", ti: "ክፍሊት ዓፋኝ" }, isTi)}</span>
              <p className="font-bold text-cyan-300 font-mono">+{totalFeesSats.toLocaleString()} sats</p>
            </div>
          </div>
        </div>

        {/* Right Column: Block Anatomy Structure (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-cyan-500/40 bg-zinc-900/80 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Layers className="h-4 w-4" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-zinc-100 sm:text-base">
                    Block #{blockHeight.toLocaleString()}
                  </h5>
                  <p className="text-[11px] text-zinc-400 font-mono">
                    {selectedTxs.length + 1} {t({ en: "transactions included", ti: "ዝተኻተቱ ግብረ-መልስታት" }, isTi)}
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300">
                Candidate Block
              </span>
            </div>

            {/* Section A: Block Header */}
            <div className="rounded-xl border border-zinc-700 bg-zinc-950/90 p-3.5 mb-3 text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <FileCode className="h-3.5 w-3.5 text-purple-400" />
                  Block Header (80 Bytes)
                </span>
                <span className="text-[10px] text-zinc-500">What Miners Hash</span>
              </div>

              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center justify-between bg-zinc-900/60 p-1.5 rounded">
                  <span className="text-zinc-500">Previous Block Hash:</span>
                  <span className="text-zinc-400 truncate max-w-[200px]" title={prevHash}>{shortHash(prevHash, 16)}</span>
                </div>
                <div className="flex items-center justify-between bg-zinc-900/60 p-1.5 rounded">
                  <span className="text-zinc-500">Merkle Root Hash:</span>
                  <span className="text-cyan-300 truncate max-w-[200px]" title={merkleRoot}>{shortHash(merkleRoot, 16)}</span>
                </div>
                <div className="flex items-center justify-between bg-zinc-900/60 p-1.5 rounded">
                  <span className="text-zinc-500">Timestamp:</span>
                  <span className="text-zinc-300">{timestamp || "Loading..."}</span>
                </div>
                <div className="flex items-center justify-between bg-zinc-900/60 p-1.5 rounded">
                  <span className="text-zinc-500">Nonce:</span>
                  <span className="text-amber-400 font-bold">{nonce.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Section B: Block Body (Transactions) */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3.5 text-xs space-y-2">
              <span className="font-bold text-cyan-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Coins className="h-3.5 w-3.5 text-cyan-400" />
                Block Body (Transactions List)
              </span>

              {/* Tx 0: Coinbase transaction */}
              <div className="rounded-lg border border-amber-500/40 bg-amber-950/20 p-2 flex items-center justify-between font-mono text-[11px]">
                <div>
                  <span className="font-bold text-amber-300">Tx 0 (Coinbase):</span>{" "}
                  <span className="text-zinc-300">New issuance + fees</span>
                </div>
                <span className="font-bold text-amber-400">
                  +{(coinbaseReward + totalFeesSats / 1e8).toFixed(5)} BTC
                </span>
              </div>

              {/* User transactions */}
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {selectedTxs.map((tx, idx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between rounded bg-zinc-900/80 px-2.5 py-1.5 font-mono text-[11px] border border-zinc-800/80"
                  >
                    <span className="text-zinc-400">
                      Tx {idx + 1}: <strong className="text-zinc-200">{tx.sender}</strong> → {tx.receiver}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-300 font-semibold">{tx.amountBtc} BTC</span>
                      <button
                        type="button"
                        onClick={() => removeTxFromBlock(tx)}
                        className="text-zinc-500 hover:text-red-400 text-xs px-1 cursor-pointer"
                        title="Remove from block"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Computed Block Hash output */}
          <div className="mt-4 pt-3 border-t border-zinc-800">
            <div className="flex items-center justify-between mb-1 text-xs">
              <span className="font-semibold text-zinc-400 flex items-center gap-1">
                <Hash className="h-3.5 w-3.5 text-cyan-400" />
                Resulting Block Hash:
              </span>
              <button
                type="button"
                onClick={() => setIsSealed(true)}
                className={`rounded px-2.5 py-1 text-[11px] font-bold cursor-pointer transition ${
                  isSealed
                    ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                    : "bg-cyan-500 border border-cyan-400 text-zinc-950 hover:bg-cyan-400"
                }`}
              >
                {isSealed ? "✓ Block Sealed" : "Seal & Hash Block"}
              </button>
            </div>
            <p className="font-mono text-xs text-cyan-200 break-all select-all bg-zinc-950 p-2.5 rounded-lg border border-cyan-500/20">
              {blockHash || "Computing..."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   Module 2: Hash Fingerprint Lab (Section 7.1 - Why Hashes Matter)
   ========================================================================= */

function HashFingerprintLab({ isTi }: { isTi: boolean }) {
  const [input, setInput] = useState("Hello, Bitcoin!");
  const [hash, setHash] = useState("");
  const [prevHash, setPrevHash] = useState("");
  const [diffCount, setDiffCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const isFirst = useRef(true);

  useEffect(() => {
    let cancelled = false;
    sha256Hex(input).then((h) => {
      if (cancelled) return;
      if (!isFirst.current) {
        let diffs = 0;
        for (let i = 0; i < h.length; i++) {
          if (h[i] !== hash[i]) diffs++;
        }
        setDiffCount(diffs);
        setPrevHash(hash);
      }
      isFirst.current = false;
      setHash(h);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  const handleCopy = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const presets = [
    { label: "Hello, Bitcoin!", value: "Hello, Bitcoin!" },
    { label: "Hello, Bitcoin!!", value: "Hello, Bitcoin!!" },
    { label: "hello, bitcoin!", value: "hello, bitcoin!" },
    { label: "Send 1.0 BTC to Alice", value: "Send 1.0 BTC to Alice" },
    { label: "Send 1.1 BTC to Alice", value: "Send 1.1 BTC to Alice" },
  ];

  return (
    <section className={panelClass} aria-label="Hash Fingerprint Lab">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-purple-400">
          {t(
            { en: "7.1 Interactive: Hash Fingerprint Lab", ti: "7.1 ተሳታፊ: ናይ ሃሽ ዓሻራ ላብ" },
            isTi
          )}
        </p>
        <h4 className="mt-1 text-lg font-bold text-zinc-100 sm:text-xl">
          {t(
            { en: "See How Hashes Work — The Avalanche Effect", ti: "ሃሽ ከመይ ከም ዝሰርሕ ርአ — ናይ ምልውዋጥ ሳዕቤን" },
            isTi
          )}
        </h4>
        <p className="mt-1 text-xs text-zinc-400">
          {t(
            {
              en: "A cryptographic hash is a one-way digital fingerprint. Type anything below and watch how a single letter change completely scrambles the resulting 256 bits.",
              ti: "ናይ ክሪፕቶግራፊ ሃሽ ሓደ-ኣንፈት ዘለዎ ዲጂታላዊ ዓሻራ እዩ። ኣብ ታሕቲ ዝኾነ ጽሓፍ እሞ ሓንቲ ፊደል ምቕያር ነቲ 256 ቢትስ ብምሉኡ ከመይ ከም ዝልውጦ ተዓዘብ።",
            },
            isTi
          )}
        </p>
      </div>

      {/* Preset buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {presets.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => setInput(p.value)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
              input === p.value
                ? "border-purple-500 bg-purple-500/20 text-purple-200"
                : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-purple-500/50 hover:text-purple-300"
            }`}
          >
            &quot;{p.label}&quot;
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-zinc-500 mb-1">
          {t({ en: "Your input text:", ti: "ናትካ ኢንፑት ጽሑፍ:" }, isTi)}
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 font-mono focus:border-purple-500 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20"
          placeholder="Type anything..."
        />
      </div>

      {/* Hash output */}
      <div className="rounded-xl border border-purple-500/30 bg-zinc-900/80 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-purple-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              SHA-256 {t({ en: "Hash Output (256 bits / 64 hex characters)", ti: "ናይ ሃሽ ውጽኢት" }, isTi)}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 text-[11px] text-purple-400 hover:text-purple-300 cursor-pointer"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <p className="font-mono text-sm text-purple-200 break-all select-all leading-relaxed bg-zinc-950 p-3 rounded-lg border border-purple-500/20">
          {hash || "Computing..."}
        </p>

        {prevHash && diffCount > 0 && (
          <div className="mt-3 pt-3 border-t border-zinc-800 space-y-1">
            <p className="text-xs text-zinc-500">
              {t({ en: "Previous hash:", ti: "ቀዳማይ ሃሽ:" }, isTi)}
            </p>
            <p className="font-mono text-xs text-zinc-600 break-all">{prevHash}</p>
            <p className="text-xs font-semibold text-amber-400 mt-2 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5" />
              {diffCount} / 64 {t({ en: "hex characters flipped", ti: "ናይ ሄክስ ፊደላት ተቐዪሮም" }, isTi)}{" "}
              ({Math.round((diffCount / 64) * 100)}% avalanche)
            </p>
          </div>
        )}
      </div>

      {/* Lesson callout */}
      <div className="mt-4 rounded-xl border border-purple-500/20 bg-purple-500/5 p-3.5">
        <p className="text-xs text-purple-200 leading-relaxed">
          <strong>💡 {t({ en: "The Avalanche Effect:", ti: "ናይ ምልውዋጥ ሳዕቤን:" }, isTi)}</strong>{" "}
          {t(
            {
              en: "A tiny 1-character change in the input produces an entirely different hash. This property makes it mathematically impossible to alter past transactions without everyone immediately detecting the fraud.",
              ti: "ኣብቲ ጽሑፍ ሓንቲ ፊደል ምቕያር ፍጹም ዝተፈልየ ሃሽ ይፈጥር። እዚ ባህሪ ዝሓለፈ ግብረ-መልሲ ንምጭብራቕ ዘይከኣል ይገብሮ።",
            },
            isTi
          )}
        </p>
      </div>
    </section>
  );
}

/* =========================================================================
   Module 3: Build-a-Chain Connected with Mempool (Section 7.2 - Why It's Called a Chain)
   ========================================================================= */

interface ChainBlock {
  index: number;
  data: string;
  txCount: number;
  prevHash: string;
  hash: string;
  tampered: boolean;
}

function BuildChainWithMempoolSimulator({ isTi }: { isTi: boolean }) {
  const [activeTab, setActiveTab] = useState<"simulator" | "live_mempool">("simulator");
  const [blocks, setBlocks] = useState<ChainBlock[]>([]);
  const [pendingMempoolTxs, setPendingMempoolTxs] = useState<string[]>([
    "Alice → Bob 0.42 BTC",
    "Chaltu → Dawit 1.5 BTC",
    "Kofi → Mining Pool 0.08 BTC",
    "Sara → Maya 2.1 BTC",
  ]);
  const [tamperIdx, setTamperIdx] = useState<number | null>(null);
  const [tamperData, setTamperData] = useState("");
  const chainRef = useRef<HTMLDivElement>(null);

  // Initialize genesis block
  useEffect(() => {
    sha256Hex("Genesis: The Times 03/Jan/2009 Chancellor on brink of second bailout for banks").then((h) => {
      setBlocks([
        {
          index: 0,
          data: "Genesis: The Times 03/Jan/2009",
          txCount: 1,
          prevHash: "00000000000000000000000000000000",
          hash: h,
          tampered: false,
        },
      ]);
    });
  }, []);

  const mineAndAppendBlock = useCallback(async () => {
    if (pendingMempoolTxs.length === 0) return;
    const txToPack = pendingMempoolTxs[0];
    const prev = blocks[blocks.length - 1];
    const blockIndex = prev.index + 1;
    const blockContent = `Block #${blockIndex}: ${txToPack} | prev: ${prev.hash}`;
    const h = await sha256Hex(blockContent);

    setBlocks((cur) => [
      ...cur,
      {
        index: blockIndex,
        data: txToPack,
        txCount: Math.floor(Math.random() * 8) + 2,
        prevHash: prev.hash,
        hash: h,
        tampered: false,
      },
    ]);

    // Remove from mempool and generate a replacement tx
    setPendingMempoolTxs((prevTxs) => {
      const remaining = prevTxs.slice(1);
      const newTxs = [
        ...remaining,
        `Student_${Math.floor(Math.random() * 900) + 100} → Lightning Node ${(Math.random() * 0.5 + 0.01).toFixed(3)} BTC`,
      ];
      return newTxs;
    });

    setTimeout(() => {
      chainRef.current?.scrollTo({ left: chainRef.current.scrollWidth, behavior: "smooth" });
    }, 100);
  }, [blocks, pendingMempoolTxs]);

  const startTamper = (idx: number) => {
    if (idx === 0) return;
    setTamperIdx(idx);
    setTamperData(blocks[idx].data);
  };

  const applyTamper = useCallback(async () => {
    if (tamperIdx === null) return;
    const updated = [...blocks];

    const prev = updated[tamperIdx - 1];
    const blockContent = `Block #${tamperIdx}: ${tamperData.trim()} | prev: ${prev.hash}`;
    const newHash = await sha256Hex(blockContent);

    updated[tamperIdx] = {
      ...updated[tamperIdx],
      data: tamperData.trim(),
      hash: newHash,
      tampered: true,
    };

    // Mark all subsequent blocks as broken
    for (let i = tamperIdx + 1; i < updated.length; i++) {
      updated[i] = { ...updated[i], tampered: true };
    }

    setBlocks(updated);
    setTamperIdx(null);
    setTamperData("");
  }, [blocks, tamperIdx, tamperData]);

  const resetChain = () => {
    sha256Hex("Genesis: The Times 03/Jan/2009 Chancellor on brink of second bailout for banks").then((h) => {
      setBlocks([
        {
          index: 0,
          data: "Genesis: The Times 03/Jan/2009",
          txCount: 1,
          prevHash: "00000000000000000000000000000000",
          hash: h,
          tampered: false,
        },
      ]);
      setTamperIdx(null);
      setTamperData("");
    });
  };

  const hasTamper = blocks.some((b) => b.tampered);

  return (
    <section className={panelClass} aria-label="Build a Blockchain Simulator">
      {/* Tab bar header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800 pb-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-400">
            {t(
              { en: "7.2 Interactive: Build a Chain with Mempool", ti: "7.2 ተሳታፊ: ሰንሰለት ብሎክ ምስ ሜምፑል ስራሕ" },
              isTi
            )}
          </p>
          <h4 className="mt-1 text-lg font-bold text-zinc-100 sm:text-xl">
            {t(
              { en: "Cryptographic Hash-Pointers & Tamper Evidence", ti: "ክሪፕቶግራፊክ ናይ ሃሽ መላግቦታትን መርትዖ ምጭብራቕን" },
              isTi
            )}
          </h4>
        </div>

        {/* View mode toggle */}
        <div className="flex rounded-lg border border-zinc-800 bg-zinc-900 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("simulator")}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition cursor-pointer ${
              activeTab === "simulator"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            ⛓ {t({ en: "Chain Simulator", ti: "ናይ ሰንሰለት ሲሙሌተር" }, isTi)}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("live_mempool")}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "live_mempool"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            {t({ en: "Live Bitcoin Blocks", ti: "ህያው ናይ ቢትኮይን ብሎኮች" }, isTi)}
          </button>
        </div>
      </div>

      {activeTab === "live_mempool" ? (
        <div className="space-y-3">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 text-xs text-emerald-300 flex items-center gap-2">
            <Radio className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>
              {t(
                {
                  en: "Displaying real live Bitcoin mainnet blocks and pending mempool transactions in real time:",
                  ti: "ናይ ሓቂ ህያው ናይ ቢትኮይን ሜይንኔት ብሎኮችን ሜምፑልን ብቐጥታ የርኢ:",
                },
                isTi
              )}
            </span>
          </div>
          <LiveBlockchainData />
        </div>
      ) : (
        <div>
          <p className="text-xs text-zinc-400 mb-4">
            {t(
              {
                en: "Each block locks in the cryptographic hash of the previous block. Pack pending transactions from the mempool to extend the chain, or click any past block to test what happens when someone attempts to tamper with historical records.",
                ti: "ነፍሲ-ወከፍ ብሎክ ነቲ ናይቲ ቅድሚኡ ዝነበረ ብሎክ ሃሽ ሒዙ ይዕሾ። ግብረ-መልስታት ወሲኽካ ሰንሰለት ኣንውሕ፡ ወይ ዝኾነ ዝሓለፈ ብሎክ ጠዊቕካ ምጭብራቕ እንታይ ከም ዘስዕብ ፈትን።",
              },
              isTi
            )}
          </p>

          {/* Mempool bar */}
          <div className="mb-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-500/10 text-cyan-400">
                <Radio className="h-3.5 w-3.5 animate-pulse" />
              </span>
              <span className="text-xs text-zinc-300 font-semibold">
                {t({ en: "Next in Mempool:", ti: "ቀጻሊ ኣብ ሜምፑል:" }, isTi)}{" "}
                <strong className="text-cyan-300 font-mono">{pendingMempoolTxs[0]}</strong>
              </span>
            </div>

            <button
              type="button"
              onClick={mineAndAppendBlock}
              disabled={hasTamper}
              className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500 bg-cyan-500/20 px-3.5 py-1.5 text-xs font-bold text-cyan-200 hover:bg-cyan-500/30 disabled:opacity-40 transition cursor-pointer"
            >
              <Pickaxe className="h-3.5 w-3.5 text-cyan-400" />
              {t({ en: "Mine Next Block into Chain", ti: "ቀጻሊ ብሎክ ጽዒንካ ናብ ሰንሰለት ወስኽ" }, isTi)}
            </button>
          </div>

          {/* Visual Horizontal Chain */}
          <div
            ref={chainRef}
            className="flex gap-3 overflow-x-auto pb-4 pt-2 snap-x"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {blocks.map((block, i) => {
              const isBroken = block.tampered && i > 0;
              const prevMismatch = i > 0 && block.prevHash !== blocks[i - 1].hash;

              return (
                <div key={block.index} className="flex items-center shrink-0 snap-start">
                  {i > 0 && (
                    <div className="flex flex-col items-center mx-1.5">
                      <Link2
                        className={`h-5 w-5 ${
                          prevMismatch || isBroken
                            ? "text-red-500 animate-pulse"
                            : "text-cyan-400"
                        }`}
                      />
                      {(prevMismatch || isBroken) && (
                        <span className="text-[9px] text-red-400 font-bold mt-0.5 uppercase tracking-wider">
                          Broken Link
                        </span>
                      )}
                    </div>
                  )}

                  {/* Block Card */}
                  <div
                    onClick={() => block.index > 0 && !hasTamper && startTamper(block.index)}
                    className={`w-64 rounded-xl border p-3.5 text-xs transition-all cursor-pointer ${
                      isBroken
                        ? "border-red-500/70 bg-red-950/40 shadow-[0_0_25px_rgba(239,68,68,0.2)]"
                        : block.index === 0
                          ? "border-purple-500/40 bg-purple-950/30"
                          : "border-cyan-500/30 bg-zinc-900/80 hover:border-cyan-400/60 hover:shadow-md hover:shadow-cyan-500/10"
                    }`}
                    title={
                      block.index === 0
                        ? "Genesis block (immutable anchor)"
                        : hasTamper
                          ? "Reset chain to restore integrity"
                          : "Click to tamper with this block's data"
                    }
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-zinc-100 flex items-center gap-1.5">
                        {block.index === 0 ? "⛏ Genesis Block" : `Block #${block.index}`}
                      </span>
                      {isBroken ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-300">
                          <AlertTriangle className="h-3 w-3" /> Invalid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                          <CheckCircle2 className="h-3 w-3" /> Valid
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5 font-mono text-[11px]">
                      <div>
                        <span className="text-zinc-500 text-[10px] block">Transactions:</span>
                        <p className="text-zinc-300 truncate font-sans font-medium">{block.data}</p>
                      </div>
                      <div className="pt-1 border-t border-zinc-800">
                        <span className="text-zinc-500 text-[10px] block">Previous Hash (Link):</span>
                        <p className={`truncate ${prevMismatch ? "text-red-400 line-through font-bold" : "text-zinc-400"}`}>
                          {shortHash(block.prevHash, 14)}
                        </p>
                      </div>
                      <div>
                        <span className="text-zinc-500 text-[10px] block">Block Hash:</span>
                        <p className={`truncate font-bold ${isBroken ? "text-red-400" : "text-cyan-300"}`}>
                          {shortHash(block.hash, 14)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tamper Modal / Box */}
          {tamperIdx !== null && (
            <div className="mt-4 rounded-xl border border-amber-500/40 bg-amber-950/30 p-4">
              <p className="text-xs font-bold text-amber-300 mb-1.5 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" />
                {t({ en: `Simulating Tamper on Block #${tamperIdx}`, ti: `ብሎክ #${tamperIdx} ምቕያር ምፍታን` }, isTi)}
              </p>
              <p className="text-xs text-zinc-400 mb-2.5">
                {t(
                  {
                    en: "Change the transaction data (e.g. divert funds to yourself) and see what happens to the chain:",
                    ti: "ናይቲ ግብረ-መልሲ ዳታ ቀይር እሞ ኣብቲ ሰንሰለት እንታይ ከም ዘጋጥም ተዓዘብ:",
                  },
                  isTi
                )}
              </p>
              <input
                type="text"
                value={tamperData}
                onChange={(e) => setTamperData(e.target.value)}
                className="w-full rounded-lg border border-amber-500/50 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 font-mono focus:border-amber-400 focus:outline-hidden mb-3"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={applyTamper}
                  className="rounded-lg bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-500 cursor-pointer transition"
                >
                  {t({ en: "Apply Tamper & Break Chain", ti: "ምቕያር ኣተግብር" }, isTi)}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTamperIdx(null);
                    setTamperData("");
                  }}
                  className="rounded-lg border border-zinc-700 px-4 py-2 text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
                >
                  {t({ en: "Cancel", ti: "ሰርዝ" }, isTi)}
                </button>
              </div>
            </div>
          )}

          {/* Tamper alert */}
          {hasTamper && (
            <div className="mt-4 rounded-xl border border-red-500/40 bg-red-950/40 p-4 space-y-2.5 animate-in fade-in">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <p className="text-sm font-bold text-red-300">
                  {t({ en: "Chain Integrity Broken! Fraud Detected.", ti: "ናይ ሰንሰለት ምልኡነት ተሰቢሩ! ምጭብራቕ ተረኺቡ።" }, isTi)}
                </p>
              </div>
              <p className="text-xs text-red-200/90 leading-relaxed">
                {t(
                  {
                    en: "Because the hash of the modified block changed, the 'Previous Hash' link stored in the following block no longer matches. Every block from the tampered one onward becomes invalid! Every Bitcoin node on earth rejects this fraudulent chain.",
                    ti: "ናይቲ ዝተቐየረ ብሎክ ሃሽ ስለ ዝተለወጠ፡ እቲ ኣብ ዝቕጽል ብሎክ ዘሎ 'ቀዳማይ ሃሽ' ደጊም ኣይሰማማዕን። ድሕሪኡ ዘለዉ ኹሎም ብሎኮች ዘይቅቡላት ይኾኑ።",
                  },
                  isTi
                )}
              </p>
              <button
                type="button"
                onClick={resetChain}
                className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/50 bg-cyan-500/20 px-4 py-2 text-xs font-semibold text-cyan-200 hover:bg-cyan-500/30 cursor-pointer transition"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                {t({ en: "Restore Honest Chain", ti: "ቅኑዕ ሰንሰለት ምለስ" }, isTi)}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

/* =========================================================================
   Module 4: Mini Mining Puzzle (Section 7.3 - Who Adds the Blocks?)
   ========================================================================= */

function MiniMiningPuzzle({ isTi }: { isTi: boolean }) {
  const [blockData] = useState("PBA Genesis · Alice → Bob 0.5 BTC · Miner Reward: 3.125 BTC");
  const [prevHash] = useState("00000000000000000002b8d9c1e4f7a2");
  const [nonce, setNonce] = useState(0);
  const [difficulty, setDifficulty] = useState(2);
  const [currentHash, setCurrentHash] = useState("");
  const [isMining, setIsMining] = useState(false);
  const [solved, setSolved] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [hashRate, setHashRate] = useState(0);
  const miningRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Compute hash whenever nonce changes
  useEffect(() => {
    sha256Hex(`${prevHash}|${blockData}|nonce:${nonce}`).then(setCurrentHash);
  }, [nonce, blockData, prevHash]);

  const target = "0".repeat(difficulty);
  const meetsTarget = currentHash.startsWith(target);

  useEffect(() => {
    if (meetsTarget && !solved && nonce > 0) {
      setSolved(true);
      setIsMining(false);
      if (miningRef.current) {
        clearInterval(miningRef.current);
        miningRef.current = null;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentHash, meetsTarget]);

  const startMining = () => {
    setSolved(false);
    setIsMining(true);
    setAttempts(0);
    startTimeRef.current = Date.now();
    let n = nonce;
    miningRef.current = window.setInterval(() => {
      // Step 5 nonces per tick for good visual feedback
      n += 5;
      setNonce(n);
      setAttempts((a) => a + 5);

      const elapsedSec = (Date.now() - startTimeRef.current) / 1000;
      if (elapsedSec > 0) {
        setHashRate(Math.round((n - nonce) / elapsedSec));
      }
    }, 25);
  };

  const manualStep = () => {
    if (isMining) return;
    setNonce((n) => n + 1);
    setAttempts((a) => a + 1);
  };

  const stopMining = () => {
    setIsMining(false);
    if (miningRef.current) {
      clearInterval(miningRef.current);
      miningRef.current = null;
    }
  };

  const reset = () => {
    stopMining();
    setNonce(0);
    setSolved(false);
    setAttempts(0);
    setHashRate(0);
  };

  useEffect(() => {
    return () => {
      if (miningRef.current) clearInterval(miningRef.current);
    };
  }, []);

  return (
    <section className={panelClass} aria-label="Proof of Work Mining Puzzle">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-400">
          {t(
            { en: "7.3 Interactive: Proof-of-Work Mining Simulator", ti: "7.3 ተሳታፊ: ናይ ስራሕ መረጋገጺ (Proof of Work) ሲሙሌተር" },
            isTi
          )}
        </p>
        <h4 className="mt-1 text-lg font-bold text-zinc-100 sm:text-xl">
          {t(
            { en: "The Nonce Guessing Game: Mine a Valid Block", ti: "ናይ ኖንስ ምግማት ጸወታ: ቅቡል ብሎክ ጽዓን" },
            isTi
          )}
        </h4>
        <p className="mt-1 text-xs text-zinc-400">
          {t(
            {
              en: "Miners cannot predict what hash will come out. They must iterate through a counter called the 'nonce' millions of times until they discover a hash that meets the network difficulty target (leading zeros).",
              ti: "ዓፋኝታት ዝወጽእ ሃሽ ኣቐዲሞም ክፈልጡ ኣይኽእሉን። እቲ ሃሽ ነቲ ዝተወሰነ ጽንኩርነት (ቅድሚ ዜሮታት) ክሳብ ዘማልእ 'ኖንስ' ዝተባህለ ቁጽሪ ብተደጋጋሚ ይቕይሩ።",
            },
            isTi
          )}
        </p>
      </div>

      {/* Block under construction */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 mb-4 space-y-2 text-xs">
        <div className="flex items-center justify-between text-zinc-400 font-mono text-[11px]">
          <span className="text-zinc-500">Prev Block Hash:</span>
          <span className="text-zinc-400 truncate max-w-[280px]">{shortHash(prevHash, 24)}</span>
        </div>
        <div className="flex items-center justify-between text-zinc-400 font-mono text-[11px]">
          <span className="text-zinc-500">Block Data:</span>
          <span className="text-zinc-300 truncate max-w-[280px]">{blockData}</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
          <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px]">
            Nonce (The Golden Number):
          </span>
          <span className="font-mono text-xl font-extrabold text-amber-300">
            {nonce.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Target Difficulty Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
        <div className="text-xs">
          <span className="font-semibold text-zinc-300 block">
            {t({ en: "Target Difficulty:", ti: "ናይ ጽንኩርነት ዕላማ:" }, isTi)}
          </span>
          <span className="text-[11px] text-zinc-500">
            {t({ en: "Hash must start with leading zeros", ti: "ሃሽ ብዜሮታት ክጅምር ኣለዎ" }, isTi)}
          </span>
        </div>

        <div className="flex gap-2">
          {[1, 2, 3, 4].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => {
                setDifficulty(d);
                reset();
              }}
              disabled={isMining}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold font-mono transition cursor-pointer ${
                difficulty === d
                  ? "bg-amber-500/20 border border-amber-500 text-amber-300 shadow-sm"
                  : "bg-zinc-800 border border-zinc-700 text-zinc-400 hover:border-amber-500/40 disabled:opacity-40"
              }`}
            >
              {"0".repeat(d)}… <span className="text-[10px] text-zinc-500 font-sans">({d} zero{d > 1 ? "s" : ""})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Hash Output Box */}
      <div
        className={`rounded-xl border p-4 mb-4 transition-all ${
          solved
            ? "border-emerald-500/60 bg-emerald-950/30 shadow-[0_0_35px_rgba(16,185,129,0.15)] ring-2 ring-emerald-500/30"
            : "border-zinc-800 bg-zinc-950"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {solved ? (
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
            ) : (
              <Hash className="h-4 w-4 text-zinc-500" />
            )}
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                solved ? "text-emerald-400 font-extrabold" : "text-zinc-400"
              }`}
            >
              {solved
                ? t({ en: "Block Solved & Accepted! ✓", ti: "ብሎክ ተፈቲሑ ተቐቢልናዮ! ✓" }, isTi)
                : t({ en: "Live Computed Block Hash", ti: "ህሉው ዝተሓሰበ ናይ ብሎክ ሃሽ" }, isTi)}
            </span>
          </div>

          <div className="text-[11px] font-mono text-zinc-500">
            Target: <strong className="text-amber-400">{target}</strong>…
          </div>
        </div>

        <p className="font-mono text-sm break-all select-all leading-relaxed bg-zinc-900/90 p-3 rounded-lg border border-zinc-800">
          <span className={solved ? "text-emerald-300 font-bold bg-emerald-500/20 px-1 rounded" : "text-red-400"}>
            {currentHash.slice(0, difficulty)}
          </span>
          <span className="text-zinc-300">{currentHash.slice(difficulty)}</span>
        </p>

        {isMining && (
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-zinc-500">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Cpu className="h-3.5 w-3.5 animate-spin" />
              Mining in progress…
            </span>
            <span>Speed: {hashRate.toLocaleString()} H/s</span>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {!isMining && !solved && (
            <>
              <button
                type="button"
                onClick={startMining}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-amber-500 transition cursor-pointer shadow-lg shadow-amber-600/20"
              >
                <Pickaxe className="h-4 w-4" />
                {t({ en: "Start Auto-Mining", ti: "ኣውቶ-ምጽዓን ጀምር" }, isTi)}
              </button>
              <button
                type="button"
                onClick={manualStep}
                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-xs font-semibold text-zinc-200 hover:border-amber-500/40 cursor-pointer"
              >
                +1 Nonce
              </button>
            </>
          )}

          {isMining && (
            <button
              type="button"
              onClick={stopMining}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-500 transition cursor-pointer"
            >
              ⏹ {t({ en: "Stop Mining", ti: "ኣቋርጽ" }, isTi)}
            </button>
          )}

          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {t({ en: "Reset", ti: "ደግም" }, isTi)}
          </button>
        </div>

        {(attempts > 0 || solved) && (
          <div className="text-xs text-zinc-400 font-mono">
            Attempts: <strong className="text-zinc-100">{attempts.toLocaleString()}</strong>
          </div>
        )}
      </div>

      {/* Solved Celebration */}
      {solved && (
        <div className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-4 space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-300 text-sm flex items-center gap-1.5">
              <Coins className="h-4 w-4 text-emerald-400" />
              {t({ en: "Block Mined Successfully! Reward Claimed:", ti: "ብሎክ ብዓወት ተጸዒኑ! ዓስቢ ተረኺቡ:" }, isTi)}
            </span>
            <span className="font-mono text-emerald-300 font-bold text-sm">+3.125 BTC</span>
          </div>
          <p className="text-xs text-emerald-200/80 leading-relaxed">
            {t(
              {
                en: `After ${attempts.toLocaleString()} nonce guesses, your computer discovered a hash starting with "${target}". In real Bitcoin, miners worldwide perform ~700,000,000,000,000,000,000 guesses per second (700 EH/s) to find a hash starting with roughly 19 zeros every 10 minutes!`,
                ti: `ድሕሪ ${attempts.toLocaleString()} ፈተነታት፡ ኮምፒተርካ ብ"${target}" ዝጅምር ሃሽ ረኺባ። ኣብቲ ናይ ሓቂ ቢትኮይን ዓለም-ለኻዊ ዓፋኝታት ኣብ ሰከንድ 700 EH/s ግምታት ይገብሩ!`,
              },
              isTi
            )}
          </p>
        </div>
      )}
    </section>
  );
}

/* =========================================================================
   Main Chapter 7 Interactive Lesson Export
   ========================================================================= */

export type Chapter7Module = "block_formation" | "hash_fingerprint" | "build_chain" | "mining_puzzle";

export function Chapter7InteractiveLesson({
  module,
  isTi,
}: {
  module: Chapter7Module;
  isTi: boolean;
}) {
  switch (module) {
    case "block_formation":
      return <BlockFormationSimulator isTi={isTi} />;
    case "hash_fingerprint":
      return <HashFingerprintLab isTi={isTi} />;
    case "build_chain":
      return <BuildChainWithMempoolSimulator isTi={isTi} />;
    case "mining_puzzle":
      return <MiniMiningPuzzle isTi={isTi} />;
    default:
      return null;
  }
}
