"use client";

import { useState } from "react";
import {
  Server,
  Cpu,
  Layers,
  Zap,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  Key,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RefreshCw,
  Clock,
  Sparkles,
  Radio,
  HardDrive,
  Network,
  RotateCcw,
  Sliders,
  AlertTriangle,
  Play,
  Gavel,
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
   Module 1: Sovereign Node Stack Architecture (Section 16.0)
   Theme: "Choosing a Node Stack: Bitcoin Core + Lightning (LND vs CLN) + Tor"
   ========================================================================= */

function NodeStackArchitect({ isTi }: ModuleProps) {
  const [selectedImpl, setSelectedImpl] = useState<"lnd" | "cln">("lnd");
  const [torEnabled, setTorEnabled] = useState<boolean>(true);

  return (
    <div className={panelClass}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
            <Server className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-400">
                {t({ en: "Section 16.0 Representation", ti: "ክፍሊ 16.0 ምርኢት" }, isTi)}
              </span>
              <span className="text-xs text-zinc-400">
                {t({ en: "Sovereign Infrastructure", ti: "ልኡላዊ መሰረተ-ልምዓት" }, isTi)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100">
              {t(
                {
                  en: "The Sovereign Node Stack: Bitcoin Core + Lightning + Tor",
                  ti: "ልኡላዊ ናይ ኖድ ስታክ፦ ቢትኮይን ኮር + ላይትኒንግ + ቶር (Tor)",
                },
                isTi
              )}
            </h3>
          </div>
        </div>

        {/* Implementation Switch */}
        <div className="flex rounded-lg border border-zinc-800 bg-zinc-900/60 p-1">
          <button
            onClick={() => setSelectedImpl("lnd")}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition cursor-pointer ${
              selectedImpl === "lnd"
                ? "bg-purple-500 text-white shadow-sm font-bold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            LND (Go)
          </button>
          <button
            onClick={() => setSelectedImpl("cln")}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition cursor-pointer ${
              selectedImpl === "cln"
                ? "bg-purple-500 text-white shadow-sm font-bold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Core Lightning (C)
          </button>
        </div>
      </div>

      <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
        {t(
          {
            en: "A sovereign Lightning node sits on top of a fully synchronized Bitcoin Core full node. Bitcoin Core verifies consensus and anchors multi-sig funding transactions, while the Lightning daemon routes fast, onion-encrypted payments over Tor.",
            ti: "ሓደ ልኡላዊ ናይ ላይትኒንግ ኖድ ኣብ ልዕሊ ምሉእ ብምሉእ ዝተመሳሰለ ቢትኮይን ኮር (Bitcoin Core) ኖድ ይስራሕ። ቢትኮይን ኮር ሕግታት ስምምዕ የረጋግጽን ናይ ብዙሕ-ፊርማ ቻነላት ይዓቁብን፤ እቲ ናይ ላይትኒንግ መስመር ድማ ብቶር (Tor) ኣቢሉ ቅልጡፍን ውሑስን ክፍሊታት የመሓላልፍ።",
          },
          isTi
        )}
      </p>

      {/* 3-Tier Layered Stack Diagram */}
      <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 sm:p-6 space-y-4">
        {/* Tier 3: Management & Client App */}
        <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Layers className="h-4 w-4" />
              {t({ en: "Tier 3: Client Apps & Management", ti: "ደረጃ 3፦ መተግበሪታትን ምሕደራን" }, isTi)}
            </span>
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded">
              Zeus / Ride The Lightning / Alby
            </span>
          </div>
          <p className="text-xs text-zinc-300">
            {t(
              {
                en: "Connect mobile wallets or desktop dashboards remotely to your home node via encrypted Tor REST / gRPC connections.",
                ti: "ናይ ስልኪ ቦርሳታት ወይ ኮምፒተር ምስ ናይ ገዛኻ ኖድ ብቶር (Tor) ኣቢልካ ብምስጢር ተራኺብካ ትቈጻጸሮ።",
              },
              isTi
            )}
          </p>
        </div>

        {/* Tier 2: Lightning Routing Engine */}
        <div className="rounded-xl border border-amber-500/40 bg-amber-950/20 p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Zap className="h-4 w-4 fill-amber-400" />
              {t({ en: "Tier 2: Lightning Network Daemon", ti: "ደረጃ 2፦ ናይ ላይትኒንግ ሞተር" }, isTi)}
            </span>
            <span className="text-[10px] font-mono text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded font-bold">
              {selectedImpl === "lnd" ? "LND (Lightning Labs)" : "Core Lightning / CLN (Blockstream)"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="rounded-lg bg-black/50 p-2.5 border border-zinc-800">
              <span className="text-[10px] text-zinc-500 block">Hot Key Management:</span>
              <span className="text-zinc-200">Holds active channel signing keys in encrypted SQLite / bbolt database.</span>
            </div>
            <div className="rounded-lg bg-black/50 p-2.5 border border-zinc-800">
              <span className="text-[10px] text-zinc-500 block">P2P Gossip Network:</span>
              <span className="text-zinc-200">Routes onion-encrypted HTLCs through 15,000+ public network channels.</span>
            </div>
          </div>

          {/* LND vs CLN Highlight Note */}
          <div className="text-[11px] text-amber-200/90 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
            {selectedImpl === "lnd" ? (
              <span><strong>LND Feature:</strong> Most popular, vast mobile app integration, built-in autopilot channel balancer and Watchtower client.</span>
            ) : (
              <span><strong>CLN Feature:</strong> Minimalist resource footprint (runs on 512MB RAM), powerful Python/Rust plugin ecosystem, dual-funding support.</span>
            )}
          </div>
        </div>

        {/* Tier 1: Base Layer Anchor */}
        <div className="rounded-xl border border-sky-500/30 bg-sky-950/20 p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <HardDrive className="h-4 w-4" />
              {t({ en: "Tier 1: Bitcoin Core (Base Layer Verification)", ti: "ደረጃ 1፦ ቢትኮይን ኮር (መሰረታዊ መረጋገጺ)" }, isTi)}
            </span>
            <span className="text-[10px] font-mono text-sky-300 bg-sky-500/20 px-2 py-0.5 rounded">
              bitcoind RPC / ZeroMQ
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="rounded-lg bg-black/50 p-2.5 border border-zinc-800">
              <span className="text-[10px] text-zinc-500 block">Storage Requirements:</span>
              <span className="text-zinc-200">~600 GB SSD NVMe (full archival) or ~10 GB (pruned mode).</span>
            </div>
            <div className="rounded-lg bg-black/50 p-2.5 border border-zinc-800">
              <span className="text-[10px] text-zinc-500 block">Chain State Watchdog:</span>
              <span className="text-zinc-200">Alerts Lightning daemon whenever 2-of-2 funding transactions confirm.</span>
            </div>
          </div>
        </div>

        {/* Tor Privacy Shield Toggle */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Radio className={`h-4 w-4 ${torEnabled ? "text-emerald-400 animate-pulse" : "text-zinc-500"}`} />
            <div>
              <span className="text-xs font-bold text-white block">
                {t({ en: "Tor Onion Routing Shield (Privacy Mode):", ti: "ናይ ቶር (Tor) ናይ ብሕትውና መከላኸሊ፦" }, isTi)}
              </span>
              <span className="text-[11px] text-zinc-400 font-mono">
                {torEnabled
                  ? "Node IP masked behind a .onion address; ISP cannot link transactions to home."
                  : "Exposing public IP address directly to Lightning peers."}
              </span>
            </div>
          </div>

          <button
            onClick={() => setTorEnabled(!torEnabled)}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer border ${
              torEnabled
                ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            {torEnabled ? t({ en: "Tor Active (Shielded)", ti: "ቶር ይሰርሕ ኣሎ" }, isTi) : t({ en: "Enable Tor", ti: "ቶር ኣጀምር" }, isTi)}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   Module 2: Channel Lifecycle Workbench (Section 16.1)
   Theme: "Opening & Closing Lightning Channels: On-Chain Funding to Settlement"
   ========================================================================= */

function ChannelLifecycleWorkbench({ isTi }: ModuleProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [closeType, setCloseType] = useState<"cooperative" | "force">("cooperative");

  return (
    <div className={panelClass}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
                {t({ en: "Section 16.1 Interactive", ti: "ክፍሊ 16.1 መስተጋብራዊ" }, isTi)}
              </span>
              <span className="text-xs text-zinc-400">
                {t({ en: "2-of-2 Multi-Sig Lifecycle", ti: "ናይ 2-ካብ-2 ቻነል ዕድመ" }, isTi)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100">
              {t(
                {
                  en: "Lightning Channel Lifecycle: From Multi-Sig Funding to Settlement",
                  ti: "ናይ ላይትኒንግ ቻነል መስርሕ፦ ካብ ናይ ብዙሕ-ፊርማ ምኽፋት ክሳብ ምዕጻው",
                },
                isTi
              )}
            </h3>
          </div>
        </div>

        {/* Step Buttons */}
        <div className="flex rounded-lg border border-zinc-800 bg-zinc-900/60 p-1">
          {[1, 2, 3].map((step) => (
            <button
              key={step}
              onClick={() => setCurrentStep(step)}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                currentStep === step
                  ? "bg-amber-500 text-black shadow-sm font-bold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {step === 1
                ? "1. Open Channel"
                : step === 2
                ? "2. Off-Chain Routing"
                : "3. Close & Settle"}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
        {t(
          {
            en: "Every Lightning channel lives inside a single on-chain 2-of-2 multi-signature UTXO. Watch the 3 stages of a channel's existence from initial funding to final on-chain settlement.",
            ti: "ነፍሲ ወከፍ ናይ ላይትኒንግ ቻነል ኣብ ውሽጢ ሓደ ናይ ቢትኮይን 2-ካብ-2 ብዙሕ-ፊርማ UTXO እዩ ዝነብር። እቲ ቻነል ካብ ዝኽፈተሉ ክሳብ ዝዕጾ ዘለዉ 3 ወሰንቲ ደረጃታት ተዓዘብ።",
          },
          isTi
        )}
      </p>

      {/* Dynamic Lifecycle Stages */}
      <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 sm:p-6 space-y-5">
        {/* Step 1: Open Channel */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Step 1: Broadcast On-Chain Funding Transaction
              </span>
              <span className="text-xs font-mono text-zinc-400">
                Wait 3 Confirmations (~30 mins)
              </span>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-3 font-mono text-xs">
              <div className="text-zinc-300">
                <strong>Funding Script:</strong>
              </div>
              <div className="bg-black/60 p-3 rounded-lg border border-zinc-800 text-amber-300 text-[11px] break-all">
                2 &lt;Alice_PubKey&gt; &lt;Bob_PubKey&gt; 2 OP_CHECKMULTISIG
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Alice locks 500,000 sats into this script. Neither Alice nor Bob can spend these funds alone. Both must cooperate to sign any new balance distribution.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Off-Chain Routing & HTLCs */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Step 2: Unlimited Off-Chain Payments & HTLC Routing
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                Channel Active ⚡
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5 space-y-1.5">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold">1. Instant Revocation</span>
                <p className="text-zinc-300 text-[11px]">
                  Every payment generates a new commitment transaction and exchanges a revocation secret for the old state.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5 space-y-1.5">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold">2. HTLC Onion Routing</span>
                <p className="text-zinc-300 text-[11px]">
                  Payments jump multi-hop (Alice → Routing Node → Charlie) using cryptographic hashlocks; intermediate nodes learn nothing about sender or receiver.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5 space-y-1.5">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold">3. Zero Blockchain Bloat</span>
                <p className="text-zinc-300 text-[11px]">
                  10,000 micro-payments happen inside this channel without a single byte written to the Bitcoin blockchain!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Close & Settle */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                Step 3: Channel Closure & Final Settlement
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCloseType("cooperative")}
                  className={`rounded px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer ${
                    closeType === "cooperative"
                      ? "bg-emerald-500 text-black font-bold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Cooperative Close
                </button>
                <button
                  onClick={() => setCloseType("force")}
                  className={`rounded px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer ${
                    closeType === "force"
                      ? "bg-red-500 text-white font-bold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Force-Close (Unilateral)
                </button>
              </div>
            </div>

            {closeType === "cooperative" ? (
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-4 space-y-2 text-xs font-mono">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Cooperative Close (Mutual Agreement)</span>
                </div>
                <p className="text-zinc-300 text-[11px] leading-relaxed">
                  Both nodes negotiate final balances (e.g. Alice: 320,000 sats, Bob: 180,000 sats). A single on-chain transaction pays out to both Layer 1 addresses. Funds are spendable immediately in the very next block with no timelock delay!
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-red-500/40 bg-red-950/20 p-4 space-y-2 text-xs font-mono">
                <div className="flex items-center gap-2 text-red-400 font-bold">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Force-Close (Peer Offline or Unresponsive)</span>
                </div>
                <p className="text-zinc-300 text-[11px] leading-relaxed">
                  Alice broadcasts the latest signed commitment transaction unilaterally. Bob’s balance is paid out immediately, but Alice’s funds are locked behind a <span className="text-amber-300 font-bold">to_self_delay (e.g. 144 blocks ~ 1 day)</span>. This delay gives Bob’s node (or his Watchtower) time to dispute if Alice tried broadcasting a stale state!
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
   Module 3: Watchtowers & The Justice Penalty Simulator (Section 16.2)
   Theme: "Channel State Protection: Backups, Watchtowers & Confiscation"
   ========================================================================= */

function WatchtowerPenaltySimulator({ isTi }: ModuleProps) {
  const [hasWatchtower, setHasWatchtower] = useState<boolean>(true);
  const [cheatAttempted, setCheatAttempted] = useState<boolean>(false);

  const handleSimulateCheat = () => {
    setCheatAttempted(true);
  };

  const handleReset = () => {
    setCheatAttempted(false);
  };

  return (
    <div className={panelClass}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
            <Gavel className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-400">
                {t({ en: "Section 16.2 Interactive", ti: "ክፍሊ 16.2 መስተጋብራዊ" }, isTi)}
              </span>
              <span className="text-xs text-zinc-400">
                {t({ en: "Security & Fraud Defense", ti: "ሓለዋ ድሕነትን ምግርጫውን" }, isTi)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100">
              {t(
                {
                  en: "Watchtowers & The Justice Penalty: Catching Stale Channel Fraud",
                  ti: "ዋችታወርስን ናይ መቕጻዕቲ ስጉምትን፦ ናይ ኣረጊት ቻነል ምግርጫው ምሓዝ",
                },
                isTi
              )}
            </h3>
          </div>
        </div>

        {/* Watchtower Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setHasWatchtower(!hasWatchtower)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
              hasWatchtower
                ? "border-emerald-500 bg-emerald-950/40 text-emerald-300"
                : "border-red-500/50 bg-red-950/20 text-red-400"
            }`}
          >
            {hasWatchtower
              ? t({ en: "Watchtower: ACTIVE 🛡️", ti: "ዋችታወር፦ ንቑሕ 🛡️" }, isTi)
              : t({ en: "Watchtower: DISABLED ⚠️", ti: "ዋችታወር፦ ዘይሰርሕ ⚠️" }, isTi)}
          </button>
          <button
            onClick={handleReset}
            className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-400 hover:text-white transition cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
        {t(
          {
            en: "What happens if your node goes offline and your channel partner broadcasts an old, revoked channel state to steal your funds? A Watchtower acts as an automated 24/7 cryptographic sentry that punishes cheats by confiscating 100% of their channel funds.",
            ti: "ናትካ ኖድ ካብ መስመር ወጻኢ ኣብ ዝኾነሉ እዋን፡ ናይ ቻነል መሻርኽትኻ ገንዘብካ ንምውሳድ ናይ ቀደም ዝተሰረዘ ኩነታት ናብ ብሎክቸይን እንተዘርጊሑ እንታይ ይፍጸም? ዋችታወር (Watchtower) ንመዓልታዊ ሓለዋ ዝሰርሕ ናጻ ሓላዊ ኮይኑ፡ ነቲ ምግርጫው ብምሓዝ 100% ካብቲ ናይቲ ሰራቒ ገንዘብ ይወስደሉ!",
          },
          isTi
        )}
      </p>

      {/* Interactive Scenario Box */}
      <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 sm:p-6 space-y-5">
        {/* The Setup */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-2">
            <span className="text-[10px] text-zinc-500 uppercase font-semibold block">True Current Balance (State #42)</span>
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-emerald-400">You (Alice): 450,000 sats</span>
              <span className="text-zinc-400">Mallory: 50,000 sats</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Mallory spent 400,000 sats yesterday to buy a phone.
            </p>
          </div>

          <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-4 space-y-2">
            <span className="text-[10px] text-red-400 uppercase font-semibold block">Mallory's Stale Cheat Attempt (State #1)</span>
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-zinc-400">You (Alice): 100,000 sats</span>
              <span className="text-red-400">Mallory: 400,000 sats</span>
            </div>
            <p className="text-[11px] text-red-300">
              Mallory broadcasts State #1 on-chain while your node is asleep!
            </p>
          </div>
        </div>

        {/* Cheat Simulation Trigger */}
        {!cheatAttempted ? (
          <div className="pt-2 text-center">
            <button
              onClick={handleSimulateCheat}
              className="rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold px-5 py-2.5 text-xs transition shadow-lg shadow-red-500/20 cursor-pointer flex items-center gap-2 mx-auto"
            >
              <AlertTriangle className="h-4 w-4" />
              {t({ en: "Simulate Mallory's Dishonest Close (ምግርጫው)", ti: "ናይ ማሎሪ ናይ ምግርጫው ፈተነ ፈትን" }, isTi)}
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in">
            {hasWatchtower ? (
              <div className="rounded-xl border border-emerald-500/50 bg-emerald-950/30 p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <ShieldCheck className="h-5 w-5" />
                  <span>
                    {t(
                      {
                        en: "JUSTICE PENALTY ENFORCED: Watchtower Caught The Cheat!",
                        ti: "ናይ ፍትሒ መቕጻዕቲ ተፈጺሙ፦ ዋችታወር ነቲ ምግርጫው ሒዝዎ!",
                      },
                      isTi
                    )}
                  </span>
                </div>
                <p className="text-xs text-zinc-300 font-mono leading-relaxed">
                  {t(
                    {
                      en: "1. The Watchtower detected Mallory broadcasting revoked State #1 on Layer 1.\n2. It used the Revocation Key you provided to broadcast a Justice Penalty Transaction within the dispute window.\n3. RESULT: Mallory's remaining 50,000 sats were completely confiscated as punishment! You received 500,000 sats (100% of the channel capacity).",
                      ti: "1. ዋችታወር ማሎሪ ናይ ቀደም ዝተሰረዘ ኩነታት ኣብ ብርኪ 1 ክትዘርግሕ ከላ ሒዝዋ።\n2. ነቲ ዘለዋ ናይ ምስራዝ መፍትሕ ተጠቒማ ናይ ፍትሒ መቕጻዕቲ ናብ ሰንሰለት ፈንያ።\n3. ውጽኢት፦ ዝነበራ 50,000 ሳትስ ተወሪሱ! ንስኻ 100% ካብቲ ቻነል (500,000 ሳትስ) ተረኪብካ፡ እታ ሰራቒት ድማ ባዶ ኢዳ ተሪፋ!",
                    },
                    isTi
                  )}
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-red-500/50 bg-red-950/40 p-4 space-y-2">
                <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                  <ShieldAlert className="h-5 w-5" />
                  <span>
                    {t(
                      {
                        en: "THEFT SUCCEEDED: No Watchtower & Your Node Was Offline!",
                        ti: "ስርቂ ተዓዊቱ፦ ዋችታወር ኣይነበረን፡ ኖድካ ድማ ደቂሱ ነይሩ!",
                      },
                      isTi
                    )}
                  </span>
                </div>
                <p className="text-xs text-zinc-300 font-mono leading-relaxed">
                  {t(
                    {
                      en: "Because your node was offline and you had no Watchtower, the dispute timelock expired unchallenged. Mallory walked away with 400,000 sats that rightfully belonged to you! This is why channel state backups and Watchtowers are mandatory for serious node operators.",
                      ti: "ኖድካ ካብ መስመር ወጻኢ ስለዝነበረን ዋችታወር ስለዘይነበረካን፡ እቲ ናይ ተቓውሞ ግዜ ሓሊፉ። ማሎሪ ናትካ ዝነበረ 400,000 ሳትስ ወሲዳቶ! ስለዚ እዩ ናይ ቻነል ኩነታት ባክኣፕን ዋችታወርን ንነፍሲ ወከፍ ኖድ ዘድልዮ።",
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
   Master Export
   ========================================================================= */

interface Chapter16LessonProps {
  module:
    | "node_stack_architect"
    | "channel_lifecycle_workbench"
    | "watchtower_penalty_simulator";
  isTi?: boolean;
}

export function Chapter16InteractiveLesson({
  module,
  isTi = false,
}: Chapter16LessonProps) {
  switch (module) {
    case "node_stack_architect":
      return <NodeStackArchitect isTi={isTi} />;
    case "channel_lifecycle_workbench":
      return <ChannelLifecycleWorkbench isTi={isTi} />;
    case "watchtower_penalty_simulator":
      return <WatchtowerPenaltySimulator isTi={isTi} />;
    default:
      return null;
  }
}
