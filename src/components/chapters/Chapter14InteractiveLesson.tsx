"use client";

import { useState, useEffect, useRef, useMemo } from "react";
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
  Play,
  Square,
  StepForward,
  Sliders,
  Users,
  PieChart,
  Globe2,
  Server,
  DollarSign,
  Activity,
  Award,
} from "lucide-react";

/* ─────────── Shared helpers ─────────── */

type Localized = { en: string; ti: string };
const t = (v: Localized, isTi: boolean) => (isTi ? v.ti : v.en);

const panelClass =
  "rounded-2xl border border-zinc-800 bg-zinc-950/90 p-4 shadow-xl sm:p-6 my-6";

/** Browser-native SHA-256 using Web Crypto, returns 64-character hex string */
async function sha256Hex(text: string): Promise<string> {
  if (typeof window === "undefined" || !window.crypto || !window.crypto.subtle) {
    return "0000000000000000000000000000000000000000000000000000000000000000";
  }
  const data = new TextEncoder().encode(text);
  const buf = await window.crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function shortHash(hash: string, lead = 10, tail = 8): string {
  if (!hash || hash.length <= lead + tail) return hash || "—";
  return `${hash.slice(0, lead)}…${hash.slice(-tail)}`;
}

/* =========================================================================
   Module 1: Practical Mining Cockpit (Section 14.0)
   Features:
   - Live in-browser SHA-256 worker
   - Configurable difficulty slider (1 to 4 hex zeros)
   - Real-time Hashrate (H/s), Nonce counter, Attempts
   - Block Header template with Coinbase reward
   - 2016-Block Retarget Thermostat Simulator tab
   ========================================================================= */

interface ModuleProps {
  isTi: boolean;
}

function PracticalMiningCockpit({ isTi }: ModuleProps) {
  const [activeTab, setActiveTab] = useState<"live_miner" | "thermostat">("live_miner");

  // Miner State
  const [blockHeight] = useState(840000);
  const [prevHash] = useState("00000000000000000002b8d9c1e4f7a284e931b7a6d8e1f0c2d3e4f5a6b7c8d9");
  const [merkleRoot] = useState("4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b");
  const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000));
  const [nonce, setNonce] = useState(0);
  const [difficulty, setDifficulty] = useState<number>(2); // 1 = "0", 2 = "00", 3 = "000", 4 = "0000"
  const [currentHash, setCurrentHash] = useState<string>("");
  const [isMining, setIsMining] = useState<boolean>(false);
  const [solved, setSolved] = useState<boolean>(false);
  const [winningNonce, setWinningNonce] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<number>(0);
  const [hashRate, setHashRate] = useState<number>(0);
  const [minerBalance, setMinerBalance] = useState<number>(0);

  // Speed setting: batch size per tick (1 to 50)
  const [miningSpeed, setMiningSpeed] = useState<number>(10);

  const miningTimerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const targetPrefix = useMemo(() => "0".repeat(difficulty), [difficulty]);
  const meetsTarget = currentHash.startsWith(targetPrefix);

  // Calculate hash when nonce or block data changes
  useEffect(() => {
    const rawHeader = `${blockHeight}|${prevHash}|${merkleRoot}|${timestamp}|${nonce}`;
    sha256Hex(rawHeader).then(setCurrentHash);
  }, [nonce, blockHeight, prevHash, merkleRoot, timestamp]);

  // When a valid hash is found
  useEffect(() => {
    if (meetsTarget && !solved && nonce > 0) {
      setSolved(true);
      setWinningNonce(nonce);
      setIsMining(false);
      setMinerBalance((b) => Number((b + 3.575).toFixed(3)));
      if (miningTimerRef.current) {
        clearInterval(miningTimerRef.current);
        miningTimerRef.current = null;
      }
    }
  }, [currentHash, meetsTarget, solved, nonce]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (miningTimerRef.current) clearInterval(miningTimerRef.current);
    };
  }, []);

  const handleStartMining = () => {
    if (solved) {
      setSolved(false);
      setWinningNonce(null);
    }
    setIsMining(true);
    setAttempts(0);
    startTimeRef.current = Date.now();
    let currentNonce = nonce;

    miningTimerRef.current = window.setInterval(() => {
      currentNonce += miningSpeed;
      setNonce(currentNonce);
      setAttempts((a) => a + miningSpeed);

      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      if (elapsed > 0) {
        setHashRate(Math.round((currentNonce - nonce) / elapsed));
      }
    }, 20);
  };

  const handleStopMining = () => {
    setIsMining(false);
    if (miningTimerRef.current) {
      clearInterval(miningTimerRef.current);
      miningTimerRef.current = null;
    }
  };

  const handleManualStep = () => {
    if (isMining) return;
    setNonce((n) => n + 1);
    setAttempts((a) => a + 1);
  };

  const handleResetMiner = () => {
    handleStopMining();
    setNonce(0);
    setSolved(false);
    setWinningNonce(null);
    setAttempts(0);
    setHashRate(0);
    setTimestamp(Math.floor(Date.now() / 1000));
  };

  /* ─────────────────────────────────────────────────────────────
     2016-Block Retarget Thermostat Simulator State
     Target: 2016 blocks * 10 mins = 20,160 minutes (14 days)
     ───────────────────────────────────────────────────────────── */
  const [actualDaysTaken, setActualDaysTaken] = useState<number>(10); // Slider: 3 to 28 days
  const actualMinutes = actualDaysTaken * 24 * 60;
  const targetMinutes = 20160; // 14 days
  const rawRatio = targetMinutes / actualMinutes;
  // Bitcoin consensus clamps adjustment between 0.25x and 4x
  const clampedRatio = Math.min(4, Math.max(0.25, rawRatio));
  const adjustmentPercentage = Math.round((clampedRatio - 1) * 100);
  const avgBlockTimeMinutes = (actualMinutes / 2016).toFixed(1);

  return (
    <div className={panelClass}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <Pickaxe className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
                {t({ en: "Section 14.0 Interactive Cockpit", ti: "ክፍሊ 14.0 መስተጋብራዊ ኮክፒት" }, isTi)}
              </span>
              <span className="text-xs text-zinc-400">
                {t({ en: "Live Hasher & Difficulty Adjustment", ti: "ቀጥታ ሃሸርን ምትዕርራይ ጸገምን" }, isTi)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100">
              {t(
                {
                  en: "Practical Mining Cockpit: Live SHA-256 Worker & The 2016-Block Thermostat",
                  ti: "ግብራዊ ናይ ዕደና ኮክፒት፦ ቀጥታ SHA-256 ሃሸርን ናይ 2016 ብሎክ ቴርሞስታትን",
                },
                isTi
              )}
            </h3>
          </div>
        </div>

        {/* Balance badge */}
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/20 px-3 py-1.5">
          <Coins className="h-4 w-4 text-emerald-400" />
          <span className="text-xs text-zinc-300">
            {t({ en: "Miner Balance:", ti: "ሚዛን ዓዳኒ፦" }, isTi)}
          </span>
          <span className="font-mono text-sm font-bold text-emerald-400">
            {minerBalance} BTC
          </span>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="mt-4 flex rounded-xl border border-zinc-800 bg-zinc-900/60 p-1 w-fit">
        <button
          onClick={() => setActiveTab("live_miner")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
            activeTab === "live_miner"
              ? "bg-amber-500 text-black shadow-sm font-bold"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Cpu className="h-3.5 w-3.5" />
          {t({ en: "1. Live Block Hasher", ti: "1. ቀጥታ ናይ ብሎክ ሃሸር" }, isTi)}
        </button>
        <button
          onClick={() => setActiveTab("thermostat")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
            activeTab === "thermostat"
              ? "bg-amber-500 text-black shadow-sm font-bold"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Sliders className="h-3.5 w-3.5" />
          {t({ en: "2. 2016-Block Retarget Thermostat", ti: "2. ናይ 2016 ብሎክ ቴርሞስታት" }, isTi)}
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: LIVE BLOCK HASHER
         ───────────────────────────────────────────────────────────── */}
      {activeTab === "live_miner" && (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-zinc-300 leading-relaxed">
            {t(
              {
                en: "Miners bundle transactions, create a block header, and repeatedly increment the 'nonce' looking for a SHA-256 hash below the network target. Test real mining below right in your browser!",
                ti: "ዓደንቲ ትራንዛክሽናት ይጥርንፉ፡ ናይ ብሎክ ርእሲ ይሰርሑ፡ ድሕሪኡ ካብቲ ናይ መርበብ ዕላማ ትሕቲ ዝኾነ SHA-256 ሃሽ ክሳብ ዝረኽቡ 'ኖንስ' (nonce) እናወሰኹ ይፍትኑ። ኣብዚ ብትኽክል ብብራውዘርካ ፈትኖ!",
              },
              isTi
            )}
          </p>

          {/* Difficulty and Speed Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            {/* Difficulty Target Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-zinc-300">
                  {t({ en: "Network Difficulty (Leading Zeroes):", ti: "ጸገም መርበብ (ናይ መጀመርታ ዜሮታት)፦" }, isTi)}
                </span>
                <span className="font-mono font-bold text-amber-400">
                  Target: &quot;{targetPrefix}&quot; ({difficulty} zeroes)
                </span>
              </div>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map((d) => (
                  <button
                    key={d}
                    disabled={isMining}
                    onClick={() => {
                      setDifficulty(d);
                      setSolved(false);
                      setWinningNonce(null);
                    }}
                    className={`flex-1 rounded-lg py-1.5 text-xs font-mono font-bold border transition cursor-pointer ${
                      difficulty === d
                        ? "border-amber-500 bg-amber-500/20 text-amber-300"
                        : "border-zinc-800 bg-black/40 text-zinc-400 hover:border-zinc-700"
                    } ${isMining ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {d} Zero{d > 1 ? "es" : ""} {d === 1 ? "(Fast)" : d === 2 ? "(Normal)" : d === 3 ? "(Hard)" : "(Extreme)"}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-zinc-500 mt-1.5">
                {t(
                  {
                    en: `Requires on average 16^${difficulty} (~${Math.pow(16, difficulty).toLocaleString()} hashes) to find a valid block.`,
                    ti: `ቅኑዕ ብሎክ ንምርካብ ብማእከላይ ገምጋም 16^${difficulty} (~${Math.pow(16, difficulty).toLocaleString()} ፈተነታት ሃሽ) ይሓትት።`,
                  },
                  isTi
                )}
              </p>
            </div>

            {/* Mining Speed */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-zinc-300">
                  {t({ en: "Miner Engine Speed:", ti: "ናይ ዓዳኒ ፍጥነት፦" }, isTi)}
                </span>
                <span className="font-mono text-zinc-400">
                  {miningSpeed} nonces/tick
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={50}
                value={miningSpeed}
                onChange={(e) => setMiningSpeed(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
                <span>1x (Slow step)</span>
                <span>25x (Medium)</span>
                <span>50x (Full ASIC Turbo)</span>
              </div>
            </div>
          </div>

          {/* Block Header Template Box */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-amber-400" />
                {t({ en: "Candidate Block Header Template", ti: "ናይ ሕጹይ ብሎክ ርእሲ ቅጥዒ" }, isTi)}
              </span>
              <span className="rounded bg-zinc-800 px-2.5 py-0.5 text-xs font-mono text-zinc-300">
                Height #{blockHeight.toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="rounded-lg bg-black/50 p-2.5 border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 uppercase block font-semibold">
                  {t({ en: "Previous Block Hash", ti: "ናይ ቅድሚኡ ብሎክ ሃሽ" }, isTi)}
                </span>
                <span className="text-zinc-400 break-all">{shortHash(prevHash, 16, 12)}</span>
              </div>

              <div className="rounded-lg bg-black/50 p-2.5 border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 uppercase block font-semibold">
                  {t({ en: "Merkle Root (2,840 Transactions)", ti: "ሜርክል ሩት (2,840 ትራንዛክሽናት)" }, isTi)}
                </span>
                <span className="text-zinc-400 break-all">{shortHash(merkleRoot, 16, 12)}</span>
              </div>

              <div className="rounded-lg bg-black/50 p-2.5 border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 uppercase block font-semibold">
                  {t({ en: "Coinbase Reward (Output 0)", ti: "ሽልማት ኮይንበይስ" }, isTi)}
                </span>
                <span className="text-emerald-400 font-bold">3.125 Subsidy + 0.450 Fees = 3.575 BTC</span>
              </div>

              <div className="rounded-lg bg-black/50 p-2.5 border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 uppercase block font-semibold">
                  {t({ en: "Timestamp (Unix)", ti: "ናይ ግዜ ምልክት" }, isTi)}
                </span>
                <span className="text-zinc-300">{timestamp}</span>
              </div>
            </div>

            {/* Nonce Counter and Hash Output */}
            <div className="rounded-xl border border-zinc-700 bg-zinc-900/80 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Nonce:
                  </span>
                  <span className="font-mono text-xl font-bold text-white bg-black/60 px-3 py-1 rounded-lg border border-zinc-800">
                    {nonce.toLocaleString()}
                  </span>
                  <span className="text-xs font-mono text-zinc-500">
                    (0x{nonce.toString(16).toUpperCase().padStart(8, "0")})
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-zinc-400">
                    {t({ en: "Attempts:", ti: "ፈተነታት፦" }, isTi)}{" "}
                    <strong className="text-white">{attempts.toLocaleString()}</strong>
                  </span>
                  <span className="text-zinc-400">
                    {t({ en: "Hashrate:", ti: "ፍጥነት፦" }, isTi)}{" "}
                    <strong className="text-amber-400">{hashRate} H/s</strong>
                  </span>
                </div>
              </div>

              {/* Real-time Hash Bar */}
              <div>
                <div className="text-[10px] uppercase font-semibold text-zinc-400 mb-1 flex items-center justify-between">
                  <span>{t({ en: "Computed SHA-256 Hash:", ti: "ዝተሓሰበ SHA-256 ሃሽ፦" }, isTi)}</span>
                  <span>Target requirement: Starts with &quot;{targetPrefix}&quot;</span>
                </div>
                <div className="rounded-lg bg-black p-3 font-mono text-xs sm:text-sm break-all border border-zinc-800 flex items-center gap-1">
                  {currentHash ? (
                    <>
                      <span className={`font-bold px-1 rounded ${
                        meetsTarget
                          ? "bg-emerald-500 text-black animate-pulse"
                          : "bg-red-950 text-red-400"
                      }`}>
                        {currentHash.slice(0, difficulty)}
                      </span>
                      <span className={meetsTarget ? "text-emerald-300 font-bold" : "text-zinc-400"}>
                        {currentHash.slice(difficulty)}
                      </span>
                    </>
                  ) : (
                    <span className="text-zinc-600">Calculating initial hash…</span>
                  )}
                </div>
              </div>

              {/* Status Outcome */}
              {solved ? (
                <div className="rounded-xl border border-emerald-500/50 bg-emerald-950/30 p-4 space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <Award className="h-5 w-5" />
                    <span>
                      {t(
                        {
                          en: `🎉 BLOCK FOUND! Golden Nonce: ${winningNonce?.toLocaleString()}`,
                          ti: `🎉 ቅኑዕ ብሎክ ተረኺቡ! ኖንስ፦ ${winningNonce?.toLocaleString()}`,
                        },
                        isTi
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 font-mono">
                    {t(
                      {
                        en: `The computed hash meets the difficulty target (${targetPrefix})! This block has been validated by consensus rules and broadcast to the network. You earned the 3.575 BTC reward!`,
                        ti: `እቲ ዝተሓስበ ሃሽ ነቲ ናይ ጸገም ዕላማ (${targetPrefix}) ኣማሊእዎ! እዚ ብሎክ ብሕግታት ስምምዕ ጸዲቑ ናብ መርበብ ተዘርጊሑ። 3.575 BTC ተሸሊምካ!`,
                      },
                      isTi
                    )}
                  </p>
                </div>
              ) : isMining ? (
                <div className="flex items-center gap-2 text-xs text-amber-400 font-mono">
                  <Flame className="h-4 w-4 animate-bounce text-amber-500" />
                  <span>
                    {t(
                      {
                        en: "ASIC Miner Hashing… Searching for leading zeroes…",
                        ti: "ዕደና ይካየድ ኣሎ… ዜሮታት ይድለ ኣሎ…",
                      },
                      isTi
                    )}
                  </span>
                </div>
              ) : (
                <div className="text-xs text-zinc-500 font-mono">
                  {t(
                    {
                      en: "Ready to mine. Click 'Start Auto-Miner' or 'Step Nonce +1' manually.",
                      ti: "ንዕደና ድሉው። 'ኣውቶ-ዕደና ጀምር' ወይ '1 ኖንስ ወስኽ' ብምጥዋቕ ፈትን።",
                    },
                    isTi
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {!isMining ? (
                <button
                  onClick={handleStartMining}
                  className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold px-4 py-2.5 text-xs transition shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <Play className="h-4 w-4 fill-current" />
                  {t({ en: "Start Auto-Miner", ti: "ኣውቶ-ዕደና ጀምር" }, isTi)}
                </button>
              ) : (
                <button
                  onClick={handleStopMining}
                  className="flex items-center gap-2 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold px-4 py-2.5 text-xs transition shadow-lg shadow-red-500/20 cursor-pointer"
                >
                  <Square className="h-4 w-4 fill-current" />
                  {t({ en: "Stop Mining", ti: "ዕደና ኣቋርጽ" }, isTi)}
                </button>
              )}

              <button
                disabled={isMining}
                onClick={handleManualStep}
                className={`flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3.5 py-2.5 text-xs font-semibold transition cursor-pointer ${
                  isMining ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <StepForward className="h-4 w-4" />
                {t({ en: "Step Nonce (+1)", ti: "1 ኖንስ ወስኽ (+1)" }, isTi)}
              </button>

              <button
                onClick={handleResetMiner}
                className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 px-3 py-2.5 text-xs transition cursor-pointer ml-auto"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                {t({ en: "Reset", ti: "ዳግማይ ጀምር" }, isTi)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: 2016-BLOCK RETARGET THERMOSTAT SIMULATOR
         ───────────────────────────────────────────────────────────── */}
      {activeTab === "thermostat" && (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-zinc-300 leading-relaxed">
            {t(
              {
                en: "Bitcoin's consensus rules target an average block time of exactly 10 minutes. Every 2016 blocks (~2 weeks), the network compares the actual time taken against the 20,160-minute target and adjusts difficulty automatically like a thermostat.",
                ti: "ሕጊ ስምምዕ ቢትኮይን ሓደ ብሎክ ንምርካብ ብማእከላይ ገምጋም ልክዕ 10 ደቓይቕ ክወስድ ይዓልም። ኣብ ነፍሲ ወከፍ 2016 ብሎክ (ኣስታት 2 ሰሙን)፡ እቲ መርበብ ነቲ ጭቡጥ ዝወሰዶ ግዜ ምስቲ ናይ 20,160 ደቓይቕ ዕላማ ብምንጽጻር ከም ቴርሞስታት ብኣውቶማቲክ ጸገም የስተኻኽል።",
              },
              isTi
            )}
          </p>

          {/* Interactive Epoch Slider */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-4">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-zinc-200 uppercase tracking-wider">
                  {t({ en: "Actual Time Taken to Mine 2,016 Blocks:", ti: "2,016 ብሎክ ንምዕዳን ዝወሰዶ ጭቡጥ ግዜ፦" }, isTi)}
                </span>
                <span className="font-mono text-base font-bold text-amber-400">
                  {actualDaysTaken} Days ({actualMinutes.toLocaleString()} mins)
                </span>
              </div>
              <input
                type="range"
                min={4}
                max={28}
                value={actualDaysTaken}
                onChange={(e) => setActualDaysTaken(Number(e.target.value))}
                className="mt-3 w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
                <span>4 Days (Huge Hashrate Spike)</span>
                <span className="text-emerald-400 font-bold">14 Days (Target Goal)</span>
                <span>28 Days (Huge Miner Capitulation)</span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-black/40 p-3 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase block font-semibold">
                  {t({ en: "Target Duration", ti: "ዕላማ ግዜ" }, isTi)}
                </span>
                <span className="font-mono text-base font-bold text-zinc-300 mt-0.5 block">
                  14.0 Days (20,160 min)
                </span>
                <span className="text-[10px] text-zinc-500">2016 × 10 min</span>
              </div>

              <div className="rounded-lg bg-black/40 p-3 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase block font-semibold">
                  {t({ en: "Average Block Time", ti: "ማእከላይ ግዜ ብሎክ" }, isTi)}
                </span>
                <span className={`font-mono text-base font-bold mt-0.5 block ${
                  Number(avgBlockTimeMinutes) < 10
                    ? "text-amber-400"
                    : Number(avgBlockTimeMinutes) > 10
                    ? "text-sky-400"
                    : "text-emerald-400"
                }`}>
                  {avgBlockTimeMinutes} Minutes
                </span>
                <span className="text-[10px] text-zinc-500">
                  {Number(avgBlockTimeMinutes) < 10 ? t({ en: "Too Fast!", ti: "ኣዝዩ ቅልጡፍ!" }, isTi) : Number(avgBlockTimeMinutes) > 10 ? t({ en: "Too Slow!", ti: "ኣዝዩ ደንጓዪ!" }, isTi) : t({ en: "Perfect Pace", ti: "ትኽክለኛ" }, isTi)}
                </span>
              </div>

              <div className={`rounded-lg p-3 border ${
                adjustmentPercentage > 0
                  ? "border-amber-500/40 bg-amber-950/20"
                  : adjustmentPercentage < 0
                  ? "border-sky-500/40 bg-sky-950/20"
                  : "border-emerald-500/40 bg-emerald-950/20"
              }`}>
                <span className="text-[10px] uppercase block font-semibold text-zinc-400">
                  {t({ en: "Difficulty Retarget", ti: "ምትዕርራይ ጸገም" }, isTi)}
                </span>
                <span className={`font-mono text-lg font-black mt-0.5 block ${
                  adjustmentPercentage > 0
                    ? "text-amber-400"
                    : adjustmentPercentage < 0
                    ? "text-sky-400"
                    : "text-emerald-400"
                }`}>
                  {adjustmentPercentage > 0 ? `+${adjustmentPercentage}%` : `${adjustmentPercentage}%`}
                </span>
                <span className="text-[10px] text-zinc-400">
                  Ratio: {clampedRatio.toFixed(2)}x
                </span>
              </div>
            </div>

            {/* Dynamic Explanation Callout */}
            <div className="rounded-xl border border-zinc-800 bg-black/50 p-3.5 text-xs text-zinc-300 leading-relaxed font-mono">
              {actualDaysTaken < 14 ? (
                <div className="flex items-start gap-2.5">
                  <Flame className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-300">
                      {t({ en: "Thermostat Action (Cooling down): ", ti: "ስጉምቲ ቴርሞስታት (ምዝሓል)፦ " }, isTi)}
                    </span>
                    {t(
                      {
                        en: `Miners found 2,016 blocks in only ${actualDaysTaken} days (average ${avgBlockTimeMinutes} mins/block). Because hashrate grew, the difficulty automatically increases by +${adjustmentPercentage}% to slow block generation back down to 10 minutes.`,
                        ti: `ዓደንቲ 2,016 ብሎካት ብ ${actualDaysTaken} መዓልታት ጥራይ ረኺቦሞ (ማእከላይ ገምጋም ${avgBlockTimeMinutes} ደቒቕ ንሓደ ብሎክ)። ሓይሊ ዕደና ስለዝወሰኸ፡ ናይ ብሎክ ግዜ ናብ 10 ደቓይቕ ንምምላስ ጸገም ብ +${adjustmentPercentage}% ይውስኽ።`,
                      },
                      isTi
                    )}
                  </div>
                </div>
              ) : actualDaysTaken > 14 ? (
                <div className="flex items-start gap-2.5">
                  <TrendingDown className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-sky-300">
                      {t({ en: "Thermostat Action (Heating up): ", ti: "ስጉምቲ ቴርሞስታት (ምምሟቕ)፦ " }, isTi)}
                    </span>
                    {t(
                      {
                        en: `Blocks were sluggish, taking ${actualDaysTaken} days (average ${avgBlockTimeMinutes} mins/block) because miners turned off rigs. Difficulty drops by ${adjustmentPercentage}% to make finding blocks easier and restore the 10-minute cadence.`,
                        ti: `ዓደንቲ መሳርሒታቶም ስለዘጥፍኡ ብሎካት ደንጉዮም ብ ${actualDaysTaken} መዓልታት ተረኺቦም (ማእከላይ ገምጋም ${avgBlockTimeMinutes} ደቒቕ)። ሓደስቲ ብሎካት ምንዳይ ቀሊል ንኽኸውንን ናብ 10 ደቓይቕ ንምምላስን ጸገም ብ ${adjustmentPercentage}% ይጎድል።`,
                      },
                      isTi
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2.5 text-emerald-400">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">
                      {t({ en: "Equilibrium: ", ti: "ሚዛናዊ ኩነታት፦ " }, isTi)}
                    </span>
                    {t(
                      {
                        en: "Blocks were mined in exactly 14 days (10.0 minutes per block). Difficulty remains unchanged (0% change).",
                        ti: "ብሎካት ብልክዕ ብ 14 መዓልታት ተዓዲኖም (10.0 ደቓይቕ ንሓደ ብሎክ)። እቲ ጸገም ከይተለወጠ ይቕጽል (0% ለውጢ)።",
                      },
                      isTi
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   Module 2: Mining Pools & Centralization Risk (Section 14.1)
   Theme: "Solo vs Pool Mining, Payout Variance & Stratum V2 Sovereignty"
   ========================================================================= */

function MiningPoolSimulator({ isTi }: ModuleProps) {
  const [minerMode, setMinerMode] = useState<"solo" | "pool">("pool");
  const [hashPowerTh, setHashPowerTh] = useState<number>(200); // 1 Antminer S21 = 200 TH/s

  // Global hashrate: ~650 EH/s = 650,000,000 TH/s
  const globalHashrateTh = 650000000;
  const shareOfNetwork = hashPowerTh / globalHashrateTh;
  const blocksPerDay = 144;
  const expectedDaysToFindBlock = Math.round(1 / (shareOfNetwork * blocksPerDay));
  const expectedYears = (expectedDaysToFindBlock / 365).toFixed(1);

  // Daily expected reward in sats:
  // 144 blocks/day * 3.125 BTC * share
  const dailyRewardBtc = Number((blocksPerDay * 3.125 * shareOfNetwork).toFixed(8));
  const dailyRewardSats = Math.round(dailyRewardBtc * 100000000);

  return (
    <div className={panelClass}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-400">
                {t({ en: "Section 14.1 Interactive", ti: "ክፍሊ 14.1 መስተጋብራዊ" }, isTi)}
              </span>
              <span className="text-xs text-zinc-400">
                {t({ en: "Pool Economics & Stratum Protocol", ti: "ቁጠባ ፑልን ፕሮቶኮል ስትራተምን" }, isTi)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100">
              {t(
                {
                  en: "Solo vs Pool Mining: Variance, Payout Models, and Stratum V2",
                  ti: "ውልቃዊ ኣንጻር ፑል ዕደና፦ ቫርያንስ፣ ሞዴላት ክፍሊትን ስትራተም V2ን",
                },
                isTi
              )}
            </h3>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex rounded-lg border border-zinc-800 bg-zinc-900/60 p-1">
          <button
            onClick={() => setMinerMode("solo")}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition cursor-pointer ${
              minerMode === "solo"
                ? "bg-purple-500 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {t({ en: "Solo Miner", ti: "ውልቃዊ ዓዳኒ" }, isTi)}
          </button>
          <button
            onClick={() => setMinerMode("pool")}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition cursor-pointer ${
              minerMode === "pool"
                ? "bg-purple-500 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {t({ en: "Mining Pool (Stratum)", ti: "ናይ ዕደና ፑል (ስትራተም)" }, isTi)}
          </button>
        </div>
      </div>

      <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
        {t(
          {
            en: "Why don't miners operate alone? Because with hundreds of millions of terahashes competing, finding a block solo is like winning the lottery once a century. Mining pools smooth out income variance by sharing rewards proportionally.",
            ti: "ዓደንቲ ስለምንታይ በይኖም ዘይዓድኑ? ምኽንያቱ ብኣማኢት ሚልዮናት ዝቑጸሩ ቴራሃሽ እናተወዳደሩ፡ በይንኻ ሓደ ብሎክ ምርካብ ኣብ ክፍለ-ዘመን ሓንቲ ግዜ ከም ምዕዋት ሎተሪ እዩ። ናይ ዕደና ፑላት ሽልማት ብመጠኑ ብምክፋል ቀጻሊ መዓልታዊ ኣታዊ የረጋግጹ።",
          },
          isTi
        )}
      </p>

      {/* Hardware Slider */}
      <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-semibold text-zinc-300">
            {t({ en: "Your Mining Hardware Hashpower:", ti: "ናይ መሳርሒኻ ናይ ዕደና ሓይሊ፦" }, isTi)}
          </span>
          <span className="font-mono text-sm font-bold text-purple-400">
            {hashPowerTh.toLocaleString()} TH/s ({Math.round(hashPowerTh / 200)}x Antminer S21)
          </span>
        </div>
        <input
          type="range"
          min={100}
          max={5000}
          step={100}
          value={hashPowerTh}
          onChange={(e) => setHashPowerTh(Number(e.target.value))}
          className="mt-3 w-full accent-purple-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
          <span>100 TH/s (1 Home ASIC)</span>
          <span>1,000 TH/s (Small Rig)</span>
          <span>5,000 TH/s (Mini Data Center)</span>
        </div>
      </div>

      {/* Outcome Comparison */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Solo Card */}
        <div className={`rounded-xl border p-4 sm:p-5 flex flex-col justify-between transition-all ${
          minerMode === "solo"
            ? "border-amber-500/50 bg-amber-950/20 ring-1 ring-amber-500/40"
            : "border-zinc-800 bg-zinc-950/60 opacity-60"
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                {t({ en: "Solo Mining Outcome", ti: "ውጽኢት ውልቃዊ ዕደና" }, isTi)}
              </span>
              <span className="text-[10px] font-mono text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded">
                Extreme Variance
              </span>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold font-mono text-white">
                ~1 block every {expectedYears} years
              </span>
              <div className="text-xs text-zinc-400 mt-1">
                {t(
                  {
                    en: `Probability of winning block: 1 in ${Math.round(1 / shareOfNetwork).toLocaleString()}`,
                    ti: `ዕድል ምርካብ ብሎክ፦ 1 ካብ ${Math.round(1 / shareOfNetwork).toLocaleString()}`,
                  },
                  isTi
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-800 text-xs text-zinc-300 space-y-1 font-mono">
            <div>Income: $0 for years, then a 3.575 BTC jackpot.</div>
            <div className="text-red-400">High risk of going bankrupt paying electricity while waiting for lucky hit.</div>
          </div>
        </div>

        {/* Pool Card */}
        <div className={`rounded-xl border p-4 sm:p-5 flex flex-col justify-between transition-all ${
          minerMode === "pool"
            ? "border-purple-500/50 bg-purple-950/20 ring-1 ring-purple-500/40"
            : "border-zinc-800 bg-zinc-950/60 opacity-60"
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                {t({ en: "Pool Mining Outcome (FPPS/PPLNS)", ti: "ውጽኢት ናይ ፑል ዕደና" }, isTi)}
              </span>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded">
                Zero Variance (Smooth Daily Pay)
              </span>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold font-mono text-white">
                +{dailyRewardSats.toLocaleString()} sats / day
              </span>
              <div className="text-xs text-zinc-400 mt-1">
                {t(
                  {
                    en: `~${dailyRewardBtc} BTC paid directly to your wallet every 24 hours based on submitted shares.`,
                    ti: `ኣብ ነፍሲ ወከፍ 24 ሰዓት ብመሰረት ዘረከብካዮ ስራሕ ~${dailyRewardBtc} BTC ብቐጥታ ናብ ቦርሳኻ ይኽፈል!`,
                  },
                  isTi
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-800 text-xs text-zinc-300 space-y-1 font-mono">
            <div>Predictable cashflow covers monthly electricity bill.</div>
            <div className="text-emerald-400">Pool fee: usually 1% to 2% paid to pool operator.</div>
          </div>
        </div>
      </div>

      {/* Stratum V2 Sovereignty Callout */}
      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
          <ShieldCheck className="h-4 w-4" />
          <span>{t({ en: "The Stratum V2 Upgrade (Defeating Pool Censorship)", ti: "ምምሕያሽ ስትራተም V2 (ሳንሱር ፑል ምፍሻል)" }, isTi)}</span>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">
          {t(
            {
              en: "In legacy Stratum v1, the pool coordinator decides which transactions enter the block. If 2 or 3 pools cooperate, they could theoretically attempt to censor transactions. Stratum V2 fixes this by allowing individual miners to construct their own block templates while still aggregating hashes for smooth pool payouts!",
              ti: "ኣብቲ ናይ ቀደም ስትራተም v1፡ ኣተሓባባሪ ፑል እዩ ኣየኖት ትራንዛክሽናት ኣብቲ ብሎክ ከምዝኣትዉ ዝውስን። 2 ወይ 3 ፑላት እንተተሰማሚዖም ንትራንዛክሽናት ሳንሱር ክገብሩ ይኽእሉ ነይሮም። ስትራተም V2 (Stratum V2) ነፍሲ ወከፍ ዓዳኒ ናይ ገዛእ ርእሱ ብሎክ ክመርጽ ብምፍቃድ፡ ነዚ ሓደጋ ብምሉእ ይፈትሖ!",
            },
            isTi
          )}
        </p>
      </div>
    </div>
  );
}

/* =========================================================================
   Module 3: Security Budget & Fee Sustainability (Section 14.2)
   Theme: "Long-Term Security Budget (Subsidy vs Fees)"
   ========================================================================= */

function SecurityBudgetSimulator({ isTi }: ModuleProps) {
  const [btcPrice, setBtcPrice] = useState<number>(65000);
  const [globalHashrateEh, setGlobalHashrateEh] = useState<number>(650);
  const [powerCostKwh, setPowerCostKwh] = useState<number>(0.05);

  // 51% Attack Computations
  const attackHashrateEh = Number((globalHashrateEh * 0.51).toFixed(1));
  const attackHashrateTh = attackHashrateEh * 1000000;
  // 1 Antminer S21 = 200 TH/s, ~3,500 Watts (17.5 J/TH), cost ~$3,000
  const asicUnitsRequired = Math.round(attackHashrateTh / 200);
  const hardwareCostBillion = Number(((asicUnitsRequired * 3000) / 1000000000).toFixed(2));
  
  // Power needed: 17.5 Joules per TH = 17.5 W per TH/s
  const powerMegawatts = Math.round((attackHashrateTh * 17.5) / 1000000);
  const hourlyElectricityCost = Math.round(powerMegawatts * 1000 * powerCostKwh);
  const dailyElectricityCostMillion = Number(((hourlyElectricityCost * 24) / 1000000).toFixed(2));

  // Honest Miner Annual Revenue Pool (144 blocks/day * 365 days * 3.575 BTC * price)
  const annualSecurityBudgetBillion = Number(
    ((144 * 365 * 3.575 * btcPrice) / 1000000000).toFixed(2)
  );

  return (
    <div className={panelClass}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-400">
                {t({ en: "Section 14.2 Interactive", ti: "ክፍሊ 14.2 መስተጋብራዊ" }, isTi)}
              </span>
              <span className="text-xs text-zinc-400">
                {t({ en: "51% Attack Cost & Defense Wall", ti: "ወጻኢታት መጥቃዕቲ 51%ን ናይ ምክልኻል መንደቕን" }, isTi)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100">
              {t(
                {
                  en: "Bitcoin Security Budget: The Mathematical Cost to 51% Attack the Ledger",
                  ti: "ናይ ቢትኮይን ናይ ድሕነት ባጀት፦ ንሰንሰለት 51% ንምጥቃዕ ዝሓትት ክቡር ወጻኢታት",
                },
                isTi
              )}
            </h3>
          </div>
        </div>

        <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 px-3 py-1.5 font-mono text-xs text-cyan-300">
          Annual Defense Budget: ~$${annualSecurityBudgetBillion}B
        </div>
      </div>

      <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
        {t(
          {
            en: "Bitcoin does not rely on trust or laws—it relies on thermodynamic cost. To rewrite transaction history, an attacker must command more than 51% of global hashrate. Adjust the network variables below to calculate the real-world dollar cost of attempting an attack.",
            ti: "ቢትኮይን ኣብ ምትእምማን ወይ ሕግታት ኣይምርኮስን—ኣብ ቴርሞዳይናሚካዊ ወጻኢታት እዩ ዝምርኮስ። ታሪኽ ትራንዛክሽን ንምቕያር፡ ሓደ ኣጥቃዒ ልዕሊ 51% ናይ ዓለማዊ ሓይሊ ዕደና ክቆጻጸር ኣለዎ። ነዚ መጥቃዕቲ ንምፍታን ዝሓቶ ጭቡጥ ወጻኢታት ንምርኣይ ነዞም መለክዒታት ቀይሮም።",
          },
          isTi
        )}
      </p>

      {/* Network Inputs Sliders */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
        {/* BTC Price */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-zinc-400">{t({ en: "Bitcoin Price:", ti: "ዋጋ ቢትኮይን፦" }, isTi)}</span>
            <span className="font-mono font-bold text-emerald-400">$${btcPrice.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={30000}
            max={150000}
            step={5000}
            value={btcPrice}
            onChange={(e) => setBtcPrice(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        {/* Global Hashrate */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-zinc-400">{t({ en: "Global Hashrate:", ti: "ዓለማዊ ሓይሊ ሃሽ፦" }, isTi)}</span>
            <span className="font-mono font-bold text-amber-400">{globalHashrateEh} EH/s</span>
          </div>
          <input
            type="range"
            min={400}
            max={1200}
            step={25}
            value={globalHashrateEh}
            onChange={(e) => setGlobalHashrateEh(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        {/* Electricity Cost */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-zinc-400">{t({ en: "Electricity Rate:", ti: "ዋጋ ኤሌክትሪክ፦" }, isTi)}</span>
            <span className="font-mono font-bold text-sky-400">$${powerCostKwh.toFixed(2)} / kWh</span>
          </div>
          <input
            type="range"
            min={0.02}
            max={0.10}
            step={0.01}
            value={powerCostKwh}
            onChange={(e) => setPowerCostKwh(Number(e.target.value))}
            className="w-full accent-sky-500 cursor-pointer"
          />
        </div>
      </div>

      {/* 51% Attack Requirements Grid */}
      <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 sm:p-5 space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
          <ShieldAlert className="h-4 w-4" />
          <span>{t({ en: "Capital & Energy Required to Execute a 51% Attack:", ti: "ን 51% መጥቃዕቲ ዘድሊ ካፒታልን ሓይሊ ኤሌክትሪክን፦" }, isTi)}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="rounded-lg bg-black/40 p-3 border border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase block font-semibold">
              {t({ en: "Required 51% Hashrate", ti: "ዘድሊ 51% ሓይሊ" }, isTi)}
            </span>
            <span className="font-mono text-base font-bold text-rose-400 mt-0.5 block">
              {attackHashrateEh} EH/s
            </span>
            <span className="text-[10px] text-zinc-500">51% of network</span>
          </div>

          <div className="rounded-lg bg-black/40 p-3 border border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase block font-semibold">
              {t({ en: "ASIC Rigs to Acquire", ti: "ዘድልዩ ናይ ASIC መሳርሒታት" }, isTi)}
            </span>
            <span className="font-mono text-base font-bold text-white mt-0.5 block">
              ~{asicUnitsRequired.toLocaleString()}
            </span>
            <span className="text-[10px] text-zinc-500">Antminer S21 Units</span>
          </div>

          <div className="rounded-lg bg-black/40 p-3 border border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase block font-semibold">
              {t({ en: "Hardware CapEx", ti: "ወጻኢታት ሃርድዌር" }, isTi)}
            </span>
            <span className="font-mono text-base font-bold text-amber-400 mt-0.5 block">
              ~$${hardwareCostBillion} Billion
            </span>
            <span className="text-[10px] text-zinc-500">Upfront chip cost</span>
          </div>

          <div className="rounded-lg bg-black/40 p-3 border border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase block font-semibold">
              {t({ en: "Daily Electricity Burn", ti: "መዓልታዊ ዝነድድ ሓይሊ" }, isTi)}
            </span>
            <span className="font-mono text-base font-bold text-red-400 mt-0.5 block">
              ~$${dailyElectricityCostMillion}M / day
            </span>
            <span className="text-[10px] text-zinc-500">{powerMegawatts.toLocaleString()} MW capacity</span>
          </div>
        </div>

        {/* Game Theory Comparison: Dishonest Attack vs Honest Mining */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-zinc-800">
          {/* Dishonest Option */}
          <div className="rounded-xl border border-red-500/40 bg-red-950/20 p-4 space-y-2">
            <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider">
              <XCircle className="h-4 w-4" />
              <span>{t({ en: "Option A: Attempt 51% Attack (ምግርጫው)", ti: "ምርጫ 1፦ 51% መጥቃዕቲ ምፍታን (ምግርጫው)" }, isTi)}</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-mono">
              {t(
                {
                  en: `Attacker spends $${hardwareCostBillion}B to secretly mine alternate blocks. When they broadcast their reorg, full nodes reject invalid spends, the market crashes, and the attacker's $${hardwareCostBillion}B in specialized ASICs becomes worthless instantly.`,
                  ti: `እቲ ኣጥቃዒ $${hardwareCostBillion}B ኣውጺኡ ብምስጢር ካልእ ሰንሰለት ይሰርሕ። ነቲ ምግርጫው ክፍትን እንከሎ ግን፡ ኖድስ ነቲ ዘይሕጋዊ ትራንዛክሽን ይነጽግዎ፡ ዋጋ ቢትኮይን ይወድቕ፡ ናይቲ ኣጥቃዒ $${hardwareCostBillion}B ዝወጸሉ ሃርድዌር ድማ ብቕጽበት ናብ ከንቱ ይቕየር።`,
                },
                isTi
              )}
            </p>
          </div>

          {/* Honest Option */}
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="h-4 w-4" />
              <span>{t({ en: "Option B: Honest Mining (ቅኑዕ ዕደና)", ti: "ምርጫ 2፦ ብቕንዕና ምዕዳን (ቅኑዕ ዕደና)" }, isTi)}</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-mono">
              {t(
                {
                  en: `The same miner simply follows consensus rules. They earn 51% of all network block rewards & transaction fees, generating ~$${((annualSecurityBudgetBillion * 0.51 * 1000) / 12).toFixed(0)}M in legitimate monthly cashflow without risking their capital.`,
                  ti: `እቲ ዓዳኒ ነቲ ሓይሊ ተጠቒሙ ብቕንዕና ይዓድን። 51% ካብ ኩሉ ናይ ብሎክ ሽልማትን ክፍሊትን ብምውሳድ፡ ኣብ ነፍሲ ወከፍ ወርሒ ~$${((annualSecurityBudgetBillion * 0.51 * 1000) / 12).toFixed(0)}M ሕጋዊ ኣታዊ ይረክብ! ካፒታሉ ድማ ፈጺሙ ኣብ ሓደጋ ኣይወድቕን።`,
                },
                isTi
              )}
            </p>
          </div>
        </div>

        {/* Thermodynamic Defense Callout */}
        <div className="rounded-xl border border-zinc-800 bg-black/60 p-3 text-xs text-zinc-300 flex items-start gap-2.5">
          <Sparkles className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-white">
              {t({ en: "Why Proof of Work Prevents Attacks: ", ti: "መርትዖ ስራሕ መጥቃዕቲ ዘይከኣል ዝገብረሉ ምኽንያት፦ " }, isTi)}
            </strong>
            {t(
              {
                en: "Satoshi's genius was turning attackers into defenders. Anyone who amasses the astronomical capital to threaten Bitcoin will make vastly more money by defending the network than by trying to break it.",
                ti: "ናይ ሳቶሺ ብልሓት ንኣጥቃዕቲ ባዕሎም ናብ ተኸላኸልቲ ምቕያሩ እዩ። ንቢትኮይን ኣብ ሓደጋ ከእቱ ዝኽእል ዓቢ ካፒታል ዘለዎ ዝኾነ ሰብ፡ ነቲ መርበብ ካብ ምጥቃዕ ብምክልኻል ኣዝዩ ዝዓበየ መኽሰብ ይረክብ።",
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
   Module 4: ASIC Geopolitics & Geographic Decentralization (Section 14.3)
   ========================================================================= */

function AsicGeopoliticsVisualizer({ isTi }: ModuleProps) {
  return (
    <div className={panelClass}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
            <Globe2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-400">
                {t({ en: "Section 14.3 Representation", ti: "ክፍሊ 14.3 ምርኢት" }, isTi)}
              </span>
              <span className="text-xs text-zinc-400">
                {t({ en: "Hardware Supply Chains & Stranded Energy", ti: "ቀረብ ሃርድዌርን ዝተረፈ ሓይልን" }, isTi)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100">
              {t(
                {
                  en: "ASIC Supply Chains & The Global Energy Arbitrage",
                  ti: "ቀረብ ሰንሰለት ASICን ዓለማዊ ናይ ሓይሊ ዕደናን",
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
            en: "Bitcoin mining is an energy buyer of last resort. Miners scour the earth for stranded, wasted, or curtailment energy—hydro, methane flare gas, geothermal, and solar—monetizing electrons that would otherwise be lost.",
            ti: "ዕደና ቢትኮይን ብኸንቱ ዝባኽን ወይ ዘይተጠቕሙሉ ሓይሊ ኤሌክትሪክ (ከም ናይ ሩባ ውሒዝ፣ ጋዝ ምንዳድ፣ ጂኦተርማልን ጸሓይን) ብምድላይ ናብ ገንዘብ ዝቕይር ብሉጽ ዓለማዊ ዓማዊል እዩ።",
          },
          isTi
        )}
      </p>

      {/* 3 Pillars */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-2">
          <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">
            1. Semiconductor Bottleneck
          </span>
          <p className="text-xs text-zinc-300 leading-relaxed">
            High-efficiency ASIC silicon (3nm / 4nm wafers) depends heavily on foundries like TSMC. Diversifying chip packaging globally is vital for hardware sovereignty.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
            2. Methane Flare Mitigation
          </span>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Oil fields trap wasted venting methane and pipe it into mobile ASIC shipping containers, converting harmful greenhouse gas into secure cryptographic hashes.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-2">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
            3. Grid Balancing
          </span>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Because ASICs can be switched on or shut down in sub-second intervals, miners act as flexible grid shock absorbers for renewable wind and solar farms.
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   Master Export
   ========================================================================= */

interface Chapter14LessonProps {
  module:
    | "mining_cockpit"
    | "mining_pool_simulator"
    | "security_budget_analyzer"
    | "asic_geopolitics_map";
  isTi?: boolean;
}

export function Chapter14InteractiveLesson({
  module,
  isTi = false,
}: Chapter14LessonProps) {
  switch (module) {
    case "mining_cockpit":
      return <PracticalMiningCockpit isTi={isTi} />;
    case "mining_pool_simulator":
      return <MiningPoolSimulator isTi={isTi} />;
    case "security_budget_analyzer":
      return <SecurityBudgetSimulator isTi={isTi} />;
    case "asic_geopolitics_map":
      return <AsicGeopoliticsVisualizer isTi={isTi} />;
    default:
      return null;
  }
}
