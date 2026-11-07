"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Wallet,
  Key,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  Copy,
  Check,
  Lock,
  Unlock,
  QrCode,
  Zap,
  Coins,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Wifi,
  Smartphone,
  Server,
  HardDrive,
  Eye,
  EyeOff,
  Flame,
  FileText,
  HelpCircle,
  TrendingUp,
  RefreshCw,
  Send,
  Download,
  AlertOctagon,
} from "lucide-react";

/* ─────────── Shared helpers ─────────── */

type Localized = { en: string; ti: string };
const t = (v: Localized, isTi: boolean) => (isTi ? v.ti : v.en);

const panelClass =
  "rounded-2xl border border-zinc-800 bg-zinc-950/90 p-4 shadow-xl sm:p-6 my-6";

/** Shorten a Bitcoin address for display */
function shortAddr(addr: string, head = 8, tail = 6): string {
  if (!addr || addr.length <= head + tail) return addr;
  return `${addr.slice(0, head)}…${addr.slice(-tail)}`;
}

/** Standard BIP39 sample list of 24 distinct words for interactive exercises */
const SAMPLE_BIP39_WORDS = [
  "abandon", "ability", "able", "about", "above", "absent",
  "absorb", "abstract", "absurd", "abuse", "access", "accident",
  "account", "accuse", "achieve", "acid", "acoustic", "acquire",
  "across", "act", "action", "actor", "actual", "adapt",
];

/* =========================================================================
   Module 1: Exchange Onramp & Custody Simulator (Section 8.0)
   Theme: "Exchanges are bridges, wallets are keys"
   ========================================================================= */

interface ExchangeOnrampProps {
  isTi: boolean;
}

function ExchangeOnrampSimulator({ isTi }: ExchangeOnrampProps) {
  const [fiatBalance, setFiatBalance] = useState<number>(200);
  const [depositAmount, setDepositAmount] = useState<number>(100);
  const [exchangeFiat, setExchangeFiat] = useState<number>(0);
  const [exchangeBtc, setExchangeBtc] = useState<number>(0);
  const [walletBtc, setWalletBtc] = useState<number>(0);
  const [btcPrice] = useState<number>(85000); // $85,000 USD
  const [exchangeFrozen, setExchangeFrozen] = useState<boolean>(false);
  const [withdrawalPending, setWithdrawalPending] = useState<boolean>(false);
  const [withdrawalSuccess, setWithdrawalSuccess] = useState<boolean>(false);
  const [txHistory, setTxHistory] = useState<Array<{ id: string; type: string; desc: string; time: string }>>([]);

  const tradingFeePercent = 0.01; // 1%
  const networkFeeBtc = 0.00005; // ~5,000 sats (~$4.25)
  const userWalletAddress = "bc1q9v8k7m0a4xf3298h49sljnd2q04xpeq8v6";

  const handleDeposit = () => {
    if (depositAmount <= 0 || depositAmount > fiatBalance) return;
    setFiatBalance((prev) => prev - depositAmount);
    setExchangeFiat((prev) => prev + depositAmount);
    setTxHistory((prev) => [
      {
        id: Math.random().toString(36).slice(2, 8),
        type: "deposit",
        desc: isTi ? `$${depositAmount} ናብ ኤክስቸንጅ ተቐሚጡ` : `Deposited $${depositAmount} to Exchange`,
        time: "Just now",
      },
      ...prev,
    ]);
  };

  const handleBuy = () => {
    if (exchangeFrozen || exchangeFiat <= 0) return;
    const fee = exchangeFiat * tradingFeePercent;
    const netFiat = exchangeFiat - fee;
    const btcBought = Number((netFiat / btcPrice).toFixed(8));
    setExchangeFiat(0);
    setExchangeBtc((prev) => Number((prev + btcBought).toFixed(8)));
    setTxHistory((prev) => [
      {
        id: Math.random().toString(36).slice(2, 8),
        type: "trade",
        desc: isTi
          ? `${btcBought} BTC ብ$${(exchangeFiat).toFixed(2)} ተገዚኡ (ክፍሊት: $${fee.toFixed(2)})`
          : `Bought ${btcBought} BTC for $${exchangeFiat.toFixed(2)} (Fee: $${fee.toFixed(2)})`,
        time: "Just now",
      },
      ...prev,
    ]);
  };

  const handleWithdraw = () => {
    if (exchangeFrozen || exchangeBtc <= networkFeeBtc) return;
    setWithdrawalPending(true);
    setTimeout(() => {
      const netBtc = Number((exchangeBtc - networkFeeBtc).toFixed(8));
      setExchangeBtc(0);
      setWalletBtc((prev) => Number((prev + netBtc).toFixed(8)));
      setWithdrawalPending(false);
      setWithdrawalSuccess(true);
      setTxHistory((prev) => [
        {
          id: Math.random().toString(36).slice(2, 8),
          type: "withdraw",
          desc: isTi
            ? `${netBtc} BTC ናብ ውልቃዊ ዋሌት ወጺኡ (ክፍሊት መርበብ: ${networkFeeBtc} BTC)`
            : `Withdrew ${netBtc} BTC to Self-Custody Wallet (Network fee: ${networkFeeBtc} BTC)`,
          time: "Just now",
        },
        ...prev,
      ]);
    }, 1200);
  };

  const handleReset = () => {
    setFiatBalance(200);
    setDepositAmount(100);
    setExchangeFiat(0);
    setExchangeBtc(0);
    setWalletBtc(0);
    setExchangeFrozen(false);
    setWithdrawalPending(false);
    setWithdrawalSuccess(false);
    setTxHistory([]);
  };

  return (
    <div className={panelClass}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
                {t({ en: "Section 8.0 Interactive", ti: "ክፍሊ 8.0 መስተጋብራዊ" }, isTi)}
              </span>
              <span className="text-xs text-zinc-400">
                {t({ en: "Centralized Exchange vs. Self-Custody", ti: "ማእከላይ ኤክስቸንጅን ውልቃዊ ምቁጽጻርን" }, isTi)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100">
              {t(
                {
                  en: "The Exchange Bridge: Acquire Bitcoin & Withdraw to Your Keys",
                  ti: "ድልድል ኤክስቸንጅ፡ ቢትኮይን ምግዛእን ናብ ናትካ መፍትሕ ምውጻእን",
                },
                isTi
              )}
            </h3>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {t({ en: "Reset Simulator", ti: "ዳግማይ ኣበግስ" }, isTi)}
        </button>
      </div>

      <p className="mt-3 text-sm text-zinc-300">
        {t(
          {
            en: "An exchange is a temporary on-ramp. While your bitcoin sits on the exchange, you only hold an IOU. Move it to your private wallet to achieve true financial ownership.",
            ti: "ኤክስቸንጅ ናይ መሸጋገሪ ድልድል እዩ። ቢትኮይንካ ኣብ ኤክስቸንጅ ክሳብ ዘሎ፡ ናይ ዕዳ ወረቐት (IOU) ጥራይ ኢኻ ትውንን። ናይ ሓቂ ዋንነት ንምርካብ ናብ ናትካ ውልቃዊ ዋሌት ኣውጽኣዮ።",
          },
          isTi
        )}
      </p>

      {/* Main 3-Column Visual Layout */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Column 1: Local Bank / Fiat Account */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              {t({ en: "1. Local Bank (Fiat)", ti: "1. ናይ ከባቢ ባንኪ (ፊያት)" }, isTi)}
            </span>
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-mono text-emerald-400">
              ${fiatBalance.toFixed(2)} USD
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <label className="text-xs text-zinc-400">
              {t({ en: "Deposit Amount (USD):", ti: "መቐመጢ መጠን (USD)፦" }, isTi)}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={10}
                max={fiatBalance}
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm font-mono text-zinc-100 focus:border-amber-500 focus:outline-none"
              />
              <button
                disabled={depositAmount <= 0 || depositAmount > fiatBalance}
                onClick={handleDeposit}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-zinc-950 transition hover:bg-amber-400 disabled:opacity-40"
              >
                {t({ en: "Deposit", ti: "ኣቐምጥ" }, isTi)}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="text-[11px] text-zinc-500">
              {t(
                {
                  en: "Centralized exchanges verify your identity (KYC) before letting you deposit local currency.",
                  ti: "ማእከላይ ኤክስቸንጅ ናይ ከባቢ ገንዘብ ቅድሚ ምቕማጥካ መንነትካ የረጋግጽ (KYC)።",
                },
                isTi
              )}
            </div>
          </div>
        </div>

        {/* Column 2: Centralized Exchange (Custodial Bridge) */}
        <div className={`rounded-xl border p-4 transition-all ${exchangeFrozen ? "border-red-600/70 bg-red-950/20" : "border-amber-500/40 bg-zinc-900/60"}`}>
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                {t({ en: "2. Centralized Exchange", ti: "2. ማእከላይ ኤክስቸንጅ" }, isTi)}
              </span>
            </div>
            {exchangeFrozen ? (
              <span className="flex items-center gap-1 rounded bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-400">
                <AlertOctagon className="h-3 w-3" />
                {t({ en: "FROZEN", ti: "ዕጹው" }, isTi)}
              </span>
            ) : (
              <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
                {t({ en: "IOU Custody", ti: "ናይ ዕዳ ሓላፍነት" }, isTi)}
              </span>
            )}
          </div>

          <div className="mt-3 space-y-2 text-xs">
            <div className="flex justify-between rounded bg-zinc-950/70 px-2.5 py-1.5 font-mono">
              <span className="text-zinc-400">{t({ en: "Fiat Balance:", ti: "ናይ ፊያት ባላንስ፦" }, isTi)}</span>
              <span className="text-zinc-200">${exchangeFiat.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between rounded bg-zinc-950/70 px-2.5 py-1.5 font-mono">
              <span className="text-zinc-400">{t({ en: "BTC Balance (IOU):", ti: "ናይ BTC ባላንስ (IOU)፦" }, isTi)}</span>
              <span className="font-bold text-amber-400">{exchangeBtc.toFixed(8)} BTC</span>
            </div>
          </div>

          {/* Action buttons inside exchange */}
          <div className="mt-4 space-y-2">
            <button
              onClick={handleBuy}
              disabled={exchangeFrozen || exchangeFiat <= 0}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-40"
            >
              <Coins className="h-3.5 w-3.5" />
              {t(
                {
                  en: `Swap $${exchangeFiat.toFixed(2)} Fiat for Bitcoin`,
                  ti: `$${exchangeFiat.toFixed(2)} ፊያት ናብ ቢትኮይን ቀይር`,
                },
                isTi
              )}
            </button>

            <button
              onClick={handleWithdraw}
              disabled={exchangeFrozen || exchangeBtc <= networkFeeBtc || withdrawalPending}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-zinc-950 transition hover:bg-amber-400 disabled:opacity-40"
            >
              {withdrawalPending ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              {withdrawalPending
                ? t({ en: "Broadcasting on-chain…", ti: "ናብ መርበብ ይሰድድ ኣሎ…" }, isTi)
                : t({ en: "Withdraw to Self-Custody", ti: "ናብ ውልቃዊ ዋሌት ኣውጽእ" }, isTi)}
            </button>

            {/* Exchange Risk Simulation Toggle */}
            <div className="pt-2 border-t border-zinc-800/80">
              <button
                onClick={() => setExchangeFrozen((prev) => !prev)}
                className={`w-full flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition ${
                  exchangeFrozen
                    ? "border-red-500 bg-red-950/40 text-red-300"
                    : "border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                }`}
              >
                <AlertTriangle className="h-3 w-3 text-amber-400" />
                {exchangeFrozen
                  ? t({ en: "Unfreeze Exchange Outage", ti: "ናይ ኤክስቸንጅ ዕጽዋ ፍታሕ" }, isTi)
                  : t({ en: "Simulate Exchange Freeze / Outage", ti: "ናይ ኤክስቸንጅ ምዕጻው/ጸገም ፈትን" }, isTi)}
              </button>
            </div>
          </div>
        </div>

        {/* Column 3: Self-Custody Wallet (Your Keys, Your Coins) */}
        <div className={`rounded-xl border p-4 transition-all ${walletBtc > 0 ? "border-emerald-500/50 bg-emerald-950/10" : "border-zinc-800 bg-zinc-900/60"}`}>
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                {t({ en: "3. Your Self-Custody Wallet", ti: "3. ናትካ ውልቃዊ ዋሌት" }, isTi)}
              </span>
            </div>
            <span className="flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
              <ShieldCheck className="h-3 w-3" />
              {t({ en: "Your Keys", ti: "ናትካ መፍትሕ" }, isTi)}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <div className="rounded-lg bg-zinc-950 p-3">
              <span className="text-[11px] text-zinc-400">{t({ en: "On-Chain Bitcoin Balance:", ti: "ኣብ ብሎክቸይን ዘሎ ባላንስ፦" }, isTi)}</span>
              <div className="text-xl font-bold font-mono text-emerald-400">
                {walletBtc.toFixed(8)} BTC
              </div>
              <div className="text-[11px] text-zinc-400 mt-1">
                ≈ ${(walletBtc * btcPrice).toFixed(2)} USD ({(walletBtc * 100000000).toLocaleString()} sats)
              </div>
            </div>

            <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-2.5 text-[11px] font-mono text-zinc-400">
              <div className="flex items-center justify-between mb-1">
                <span className="text-zinc-500">{t({ en: "Receiving Address:", ti: "ተቐባሊ ኣድራሻ፦" }, isTi)}</span>
                <span className="text-amber-400 text-[10px]">Native SegWit</span>
              </div>
              <div className="truncate text-zinc-300 font-semibold">{userWalletAddress}</div>
            </div>

            {walletBtc > 0 ? (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs text-emerald-300 flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                <span>
                  {t(
                    {
                      en: "Sovereign ownership active! No exchange or government can freeze these UTXOs without your private key.",
                      ti: "ናጻ ዋንነት ተረጋጊጹ! ብዘይካ ናትካ ምስጢራዊ መፍትሕ ዝኾነ ኤክስቸንጅ ወይ መንግስቲ ነዚ ክዓጽዎ ኣይክእልን።",
                    },
                    isTi
                  )}
                </span>
              </div>
            ) : (
              <div className="text-[11px] text-zinc-500">
                {t(
                  {
                    en: "Deposit fiat, buy bitcoin, and click withdraw to transfer coins to this sovereign wallet.",
                    ti: "ፊያት ኣቐምጥ፡ ቢትኮይን ዓድግ፡ ድሕሪኡ ናብዚ ናጻ ዋሌት ንምስግጋር ምውጻእ ጠውቕ።",
                  },
                  isTi
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transaction & Action Audit Feed */}
      {txHistory.length > 0 && (
        <div className="mt-5 rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-3">
          <div className="text-xs font-semibold text-zinc-400 mb-2">
            {t({ en: "Audit Log & Lifecycle Events:", ti: "ናይ ፍጻመታት መዝገብ፦" }, isTi)}
          </div>
          <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
            {txHistory.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded bg-zinc-900/80 px-2.5 py-1 text-xs text-zinc-300"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      entry.type === "withdraw"
                        ? "bg-emerald-400"
                        : entry.type === "trade"
                        ? "bg-amber-400"
                        : "bg-blue-400"
                    }`}
                  />
                  <span>{entry.desc}</span>
                </div>
                <span className="text-[10px] text-zinc-500">{entry.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   Module 2: BIP39 Seed Phrase & Signer Lab (Section 8.1)
   Theme: "Software Signer: create wallet, seed backup, recovery"
   ========================================================================= */

interface SeedBackupLabProps {
  isTi: boolean;
}

function SeedBackupLab({ isTi }: SeedBackupLabProps) {
  const [seedWords, setSeedWords] = useState<string[]>([]);
  const [scrambledWords, setScrambledWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isWiped, setIsWiped] = useState<boolean>(false);
  const [backupVerified, setBackupVerified] = useState<boolean | null>(null);
  const [revealed, setRevealed] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"generator" | "verifier" | "security">("generator");

  // Generate 12 deterministic/pseudo-random BIP39 words
  const generateNewSeed = useCallback(() => {
    const shuffled = [...SAMPLE_BIP39_WORDS].sort(() => 0.5 - Math.random());
    const twelve = shuffled.slice(0, 12);
    setSeedWords(twelve);
    setScrambledWords([...twelve].sort(() => 0.5 - Math.random()));
    setSelectedWords([]);
    setBackupVerified(null);
    setIsWiped(false);
  }, []);

  useEffect(() => {
    generateNewSeed();
  }, [generateNewSeed]);

  const handleWordSelect = (word: string) => {
    if (selectedWords.includes(word)) return;
    const next = [...selectedWords, word];
    setSelectedWords(next);

    if (next.length === 12) {
      const match = next.every((w, i) => w === seedWords[i]);
      setBackupVerified(match);
    }
  };

  const handleRemoveSelectedWord = (index: number) => {
    const updated = [...selectedWords];
    updated.splice(index, 1);
    setSelectedWords(updated);
    setBackupVerified(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(seedWords.join(" "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mock derived address from seed words
  const derivedAddress = useMemo(() => {
    if (seedWords.length === 0 || isWiped) return "—";
    const suffix = seedWords[0] ? seedWords[0].slice(0, 3) : "btc";
    const hashHex = seedWords.slice(0, 4).join("").length * 91823;
    return `bc1q${suffix}${hashHex.toString(16)}8f2940amcz`;
  }, [seedWords, isWiped]);

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
                {t({ en: "Section 8.1 Interactive", ti: "ክፍሊ 8.1 መስተጋብራዊ" }, isTi)}
              </span>
              <span className="text-xs text-zinc-400">
                {t({ en: "BIP39 Mnemonic & Master Key Derivation", ti: "BIP39 ምስጢራዊ ቃላትን ምውጻእ መፍትሕን" }, isTi)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100">
              {t(
                {
                  en: "Software Signer Lab: 12-Word Seed Generation & Recovery",
                  ti: "ላቦራቶሪ ሶፍትዌር ሳይነር፦ ምፍጣር 12 ቃላት ምስጢርን ምምላስን",
                },
                isTi
              )}
            </h3>
          </div>
        </div>
        <button
          onClick={generateNewSeed}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {t({ en: "Generate New Seed", ti: "ሓድሽ ምስጢራዊ ቃላት ፍጠር" }, isTi)}
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-4 flex flex-wrap gap-2 border-b border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab("generator")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            activeTab === "generator"
              ? "bg-purple-500 text-white font-semibold"
              : "bg-zinc-900 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          {t({ en: "1. 12-Word Seed & Derivation", ti: "1. 12 ቃላት ምስጢርን መፍትሕን" }, isTi)}
        </button>
        <button
          onClick={() => setActiveTab("verifier")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            activeTab === "verifier"
              ? "bg-purple-500 text-white font-semibold"
              : "bg-zinc-900 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          {t({ en: "2. Test Seed Backup Challenge", ti: "2. ፈተነ ምምላስ ቃላት" }, isTi)}
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            activeTab === "security"
              ? "bg-purple-500 text-white font-semibold"
              : "bg-zinc-900 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <ShieldAlert className="h-3.5 w-3.5" />
          {t({ en: "3. Paper vs. Cloud Risk Matrix", ti: "3. ወረቐት ምስ ደበና ስግኣት" }, isTi)}
        </button>
      </div>

      {/* Tab 1: Seed Generator & Key Derivation */}
      {activeTab === "generator" && (
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs text-zinc-400">
              {t(
                {
                  en: "These 12 words encode 128 bits of true randomness. They reconstruct all private keys, accounts, and addresses.",
                  ti: "እዚኦም 12 ቃላት 128 ቢት ናይ ሓቂ ዕድላውነት ይሕዙ። ንኹሎም ምስጢራዊ መፍትሕታትን ኣድራሻታትን ይፈጥሩ።",
                },
                isTi
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setRevealed((prev) => !prev)}
                className="flex items-center gap-1 rounded border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300 hover:bg-zinc-700"
              >
                {revealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {revealed ? t({ en: "Hide", ti: "ሕባእ" }, isTi) : t({ en: "Reveal", ti: "ኣርእይ" }, isTi)}
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 rounded border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300 hover:bg-zinc-700"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? t({ en: "Copied!", ti: "ተቐዲሑ!" }, isTi) : t({ en: "Copy Words", ti: "ቃላት ቅዳሕ" }, isTi)}
              </button>
            </div>
          </div>

          {/* 12 Words Grid */}
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
            {seedWords.map((word, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-sm font-mono shadow-sm"
              >
                <span className="w-5 text-right text-xs font-semibold text-zinc-500">
                  {idx + 1}.
                </span>
                <span className="font-semibold text-amber-300">
                  {isWiped
                    ? "••••••"
                    : revealed
                    ? word
                    : "••••••"}
                </span>
              </div>
            ))}
          </div>

          {/* Derivation Hierarchy Visualization */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-purple-400" />
              {t({ en: "Cryptographic Derivation Pipeline (BIP32 / BIP44 / BIP84):", ti: "ናይ ስነ-ምስጢር ምውጻእ መስርሕ፦" }, isTi)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
              <div className="rounded-lg bg-zinc-950 p-2.5 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase">{t({ en: "1. 512-bit Master Seed", ti: "1. ማስተር ዘርኢ" }, isTi)}</span>
                <div className="truncate text-zinc-300 mt-1 font-semibold">
                  {isWiped ? "—" : "a9b8f2c019d45e7f8a1...3b7"}
                </div>
              </div>
              <div className="rounded-lg bg-zinc-950 p-2.5 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase">{t({ en: "2. Master Private Key (xprv)", ti: "2. ማስተር ምስጢራዊ መፍትሕ" }, isTi)}</span>
                <div className="truncate text-amber-400 mt-1 font-semibold">
                  {isWiped ? "—" : "xprv9s21ZrQH143K25Q...8rN"}
                </div>
              </div>
              <div className="rounded-lg bg-zinc-950 p-2.5 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase">{t({ en: "3. First Native SegWit Address", ti: "3. ቀዳማይ ሰግዊት ኣድራሻ" }, isTi)}</span>
                <div className="truncate text-emerald-400 mt-1 font-semibold">
                  {derivedAddress}
                </div>
              </div>
            </div>
          </div>

          {/* Wipe / Restore simulator */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={() => setIsWiped((prev) => !prev)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                isWiped
                  ? "border-emerald-500 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50"
                  : "border-red-600/60 bg-red-950/30 text-red-300 hover:bg-red-900/40"
              }`}
            >
              <Flame className="h-3.5 w-3.5" />
              {isWiped
                ? t({ en: "Restore Wallet from Seed Words", ti: "ዋሌት ብምስጢራዊ ቃላት ምለስ" }, isTi)
                : t({ en: "Simulate Lost Phone / Wipe Device", ti: "ዝጠፍአ ስልኪ / ምዕጻው ፈትን" }, isTi)}
            </button>
            <span className="text-xs text-zinc-400">
              {isWiped
                ? t(
                    {
                      en: "Device wiped! The 12 words are the sole key needed to restore everything.",
                      ti: "መተግበሪ ጠፊኡ! እቶም 12 ቃላት ጥራይ እዮም ንኹሉ ዝመልሱ።",
                    },
                    isTi
                  )
                : t(
                    {
                      en: "Try wiping the wallet to experience why paper backups protect you against loss.",
                      ti: "ወረቐት መዕቀቢ ካብ ጥፍኣት ከመይ ከምዘድሕነካ ንምርኣይ ዋሌት ኣጥፍኣዮ ፈትን።",
                    },
                    isTi
                  )}
            </span>
          </div>
        </div>
      )}

      {/* Tab 2: Test Seed Backup Challenge */}
      {activeTab === "verifier" && (
        <div className="mt-4 space-y-4">
          <div className="text-xs text-zinc-300">
            {t(
              {
                en: "Verify you wrote down your seed correctly! Click the words below in their exact sequence (1 to 12):",
                ti: "ቃላትካ ብትኽክል ከም ዝጸሓፍካዮ ኣረጋግጽ! ነቶም ኣብ ታሕቲ ዘለዉ ቃላት ብቕደም ተኸተሎም (1 ክሳብ 12) ጠውቖም፦",
              },
              isTi
            )}
          </div>

          {/* Chosen Words Order */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 min-h-[70px] flex flex-wrap gap-2 items-center">
            {selectedWords.length === 0 ? (
              <span className="text-xs text-zinc-500 italic">
                {t({ en: "No words clicked yet. Select word #1 from below…", ti: "ዝተመርጸ ቃል የለን። ካብ ታሕቲ ቃል #1 ምረጽ…" }, isTi)}
              </span>
            ) : (
              selectedWords.map((word, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRemoveSelectedWord(idx)}
                  className="flex items-center gap-1.5 rounded-lg border border-purple-500/40 bg-purple-950/40 px-2.5 py-1 text-xs font-mono text-purple-200 transition hover:bg-purple-900/60"
                >
                  <span className="text-zinc-500 text-[10px]">{idx + 1}.</span>
                  <span>{word}</span>
                  <span className="text-zinc-400 text-[10px]">✕</span>
                </button>
              ))
            )}
          </div>

          {/* Scrambled word pool */}
          <div className="flex flex-wrap gap-2 pt-2">
            {scrambledWords.map((word, idx) => {
              const isUsed = selectedWords.includes(word);
              return (
                <button
                  key={idx}
                  disabled={isUsed}
                  onClick={() => handleWordSelect(word)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-mono transition ${
                    isUsed
                      ? "border-zinc-800 bg-zinc-900/40 text-zinc-600 opacity-40 cursor-not-allowed"
                      : "border-zinc-700 bg-zinc-800 text-zinc-200 hover:border-amber-400 hover:text-white"
                  }`}
                >
                  {word}
                </button>
              );
            })}
          </div>

          {/* Verification feedback banner */}
          {backupVerified !== null && (
            <div
              className={`rounded-xl border p-3 flex items-center gap-3 text-xs ${
                backupVerified
                  ? "border-emerald-500/50 bg-emerald-950/20 text-emerald-300"
                  : "border-red-500/50 bg-red-950/20 text-red-300"
              }`}
            >
              {backupVerified ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold">{t({ en: "Backup Verified Successfully!", ti: "መዕቀቢ ብትኽክል ተረጋጊጹ!" }, isTi)}</span>
                    <p className="text-[11px] text-emerald-400/90 mt-0.5">
                      {t(
                        {
                          en: "You have verified your 12-word seed in proper order. Store your physical paper or steel in a secure location.",
                          ti: "ነቶም 12 ቃላት ብቕደም ተኸተል ኣረጋጊጽካዮም ኣለኻ። ነቲ ወረቐት ኣብ ውሑስ ቦታ ኣቐምጦ።",
                        },
                        isTi
                      )}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5 text-red-400 shrink-0" />
                  <div>
                    <span className="font-bold">{t({ en: "Word Order Incorrect", ti: "ናይ ቃላት ቅደም ተኸተል ጌጋ" }, isTi)}</span>
                    <p className="text-[11px] text-red-300/90 mt-0.5">
                      {t(
                        {
                          en: "The words clicked do not match the generated seed. Click any word chip above to remove it and fix the order.",
                          ti: "እቶም ዝተመርጹ ቃላት ኣይተሰማምዑን። ንምእራም ነቲ ዝተመርጸ ቃል ጠውቖ።",
                        },
                        isTi
                      )}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Security & Storage Risk Matrix */}
      {activeTab === "security" && (
        <div className="mt-4 space-y-3">
          <div className="text-xs text-zinc-400">
            {t(
              {
                en: "Bitcoin is a bearer asset. Anyone who sees these 12 words can instantly spend your funds. Learn what is safe and what is disastrous:",
                ti: "ቢትኮይን ብኢድ ዝተታሕዘ ንብረት እዩ። ነዞም 12 ቃላት ዝረኣየ ሰብ ቀጥታ ገንዘብካ ክወስዶ ይኽእል። ውሑስን ሓደገኛን ዝኾነ ፍለጥ፦",
              },
              isTi
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Risk 1 */}
            <div className="rounded-xl border border-red-500/40 bg-red-950/20 p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 text-red-400 font-semibold text-xs">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{t({ en: "Cloud / Screenshot", ti: "ደበና / ስክሪንሾት" }, isTi)}</span>
              </div>
              <p className="text-[11px] text-zinc-300">
                {t(
                  {
                    en: "Saving to Google Photos, iCloud, or Notes app. Automatic sync makes it vulnerable to credential leaks and malware.",
                    ti: "ኣብ Google Photos፡ iCloud ወይ Notes ምዕቃብ። ናይ ደበና ምትእስሳር ንሰረቕቲ ኮምፒተር የቃልዖ።",
                  },
                  isTi
                )}
              </p>
              <div className="rounded bg-red-950/60 px-2 py-0.5 text-[10px] font-bold text-red-400 inline-block uppercase">
                {t({ en: "DANGEROUS (99% Risk)", ti: "ሓደገኛ (99% ስግኣት)" }, isTi)}
              </div>
            </div>

            {/* Risk 2 */}
            <div className="rounded-xl border border-amber-500/40 bg-amber-950/20 p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-xs">
                <HelpCircle className="h-4 w-4 shrink-0" />
                <span>{t({ en: "Email / Chat Apps", ti: "ኢመይል / ቻት" }, isTi)}</span>
              </div>
              <p className="text-[11px] text-zinc-300">
                {t(
                  {
                    en: "Sending the seed to yourself via email or Telegram. Subject to SIM-swaps, compromised email passwords, and clipboard scrapers.",
                    ti: "ብኢመይል ወይ ቴሌግራም ንርእስኻ ምስዳድ። ብSIM-swapን ምስጢረ-ቓል ምጥሓስን ይስረቕ።",
                  },
                  isTi
                )}
              </p>
              <div className="rounded bg-amber-950/60 px-2 py-0.5 text-[10px] font-bold text-amber-400 inline-block uppercase">
                {t({ en: "HIGH RISK", ti: "ልዑል ስግኣት" }, isTi)}
              </div>
            </div>

            {/* Secure Method */}
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-xs">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>{t({ en: "Offline Steel / Paper", ti: "ብኢድ ዝተጻሕፈ ወረቐት / ሓጺን" }, isTi)}</span>
              </div>
              <p className="text-[11px] text-zinc-300">
                {t(
                  {
                    en: "Written on quality paper or stamped into stainless steel plate. Stored in a fireproof safe. Completely isolated from the internet.",
                    ti: "ኣብ ጽቡቕ ወረቐት ብኢድ ዝተጻሕፈ ወይ ኣብ ሓጺን ዝተወቕረ። ካብ ኢንተርነት ፈጺሙ ዝተፈልየ።",
                  },
                  isTi
                )}
              </p>
              <div className="rounded bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-400 inline-block uppercase">
                {t({ en: "RECOMMENDED (Air-Gapped)", ti: "ዝምከር (ካብ መርበብ ርሑቕ)" }, isTi)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   Module 3: Send & Receive Transaction Playground (Section 8.2)
   Theme: "Complete a First Transaction: send/receive, fee priority, verification"
   ========================================================================= */

interface SendReceivePlaygroundProps {
  isTi: boolean;
}

function SendReceivePlayground({ isTi }: SendReceivePlaygroundProps) {
  const [activeTab, setActiveTab] = useState<"send" | "receive">("send");
  const [walletBalanceSats, setWalletBalanceSats] = useState<number>(150000); // 0.0015 BTC
  const [recipientAddr, setRecipientAddr] = useState<string>("bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh");
  const [unitMode, setUnitMode] = useState<"sats" | "btc">("sats");
  const [amountInput, setAmountInput] = useState<string>("25000");
  const [feeRate, setFeeRate] = useState<number>(15); // sat/vB
  const [isSigning, setIsSigning] = useState<boolean>(false);
  const [txConfirmed, setTxConfirmed] = useState<boolean>(false);
  const [txId, setTxId] = useState<string>("");
  const [copiedReceive, setCopiedReceive] = useState<boolean>(false);
  const [freshAddressIndex, setFreshAddressIndex] = useState<number>(0);

  const btcPriceUsd = 85000;
  const estimatedTxVBytes = 140; // 1 input 2 output SegWit
  const estimatedFeeSats = estimatedTxVBytes * feeRate;

  // Address pool for fresh receive address generation
  const receiveAddresses = [
    "bc1q9v8k7m0a4xf3298h49sljnd2q04xpeq8v601a",
    "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4",
    "bc1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gd",
    "bc1qf2389dskjh27389dh29837dh82937dh2938d7s",
  ];

  const currentReceiveAddr = receiveAddresses[freshAddressIndex % receiveAddresses.length];

  const handleNextReceiveAddress = () => {
    setFreshAddressIndex((prev) => prev + 1);
  };

  const handleSend = () => {
    const amountSats = unitMode === "sats" ? parseInt(amountInput || "0", 10) : Math.round(parseFloat(amountInput || "0") * 100000000);
    const totalDeduction = amountSats + estimatedFeeSats;
    if (isNaN(amountSats) || amountSats <= 0 || totalDeduction > walletBalanceSats) return;

    setIsSigning(true);
    setTimeout(() => {
      setWalletBalanceSats((prev) => prev - totalDeduction);
      setIsSigning(false);
      setTxConfirmed(true);
      setTxId("4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b");
    }, 1500);
  };

  const handleReset = () => {
    setWalletBalanceSats(150000);
    setAmountInput("25000");
    setFeeRate(15);
    setIsSigning(false);
    setTxConfirmed(false);
    setTxId("");
  };

  const parsedSendSats = unitMode === "sats" ? parseInt(amountInput || "0", 10) : Math.round(parseFloat(amountInput || "0") * 100000000);
  const totalCostSats = parsedSendSats + estimatedFeeSats;
  const hasSufficientFunds = !isNaN(parsedSendSats) && parsedSendSats > 0 && totalCostSats <= walletBalanceSats;

  return (
    <div className={panelClass}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
            <Send className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-400">
                {t({ en: "Section 8.2 Interactive", ti: "ክፍሊ 8.2 መስተጋብራዊ" }, isTi)}
              </span>
              <span className="text-xs text-zinc-400">
                {t({ en: "Transaction Cockpit & Fee Mechanics", ti: "ምስዳድ ገንዘብን ናይ ክፍሊት መምረጽን" }, isTi)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100">
              {t(
                {
                  en: "Transaction Simulator: Send, Receive, and Verify Addresses",
                  ti: "ናይ ምልውዋጥ ፈተነ፦ ስደድ፡ ተቐበል፡ ኣድራሻ ኣረጋግጽ",
                },
                isTi
              )}
            </h3>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {t({ en: "Reset Wallet", ti: "ዋሌት ሓድሽ ግበር" }, isTi)}
        </button>
      </div>

      {/* Balance Bar & Mode Tabs */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-zinc-900/80 p-3 border border-zinc-800">
        <div>
          <span className="text-xs text-zinc-400">{t({ en: "Current Spendable Balance:", ti: "ናጻ ባላንስ፦" }, isTi)}</span>
          <div className="text-lg font-bold font-mono text-cyan-400">
            {walletBalanceSats.toLocaleString()} sats{" "}
            <span className="text-xs font-normal text-zinc-400">
              ({(walletBalanceSats / 100000000).toFixed(8)} BTC · ${(walletBalanceSats / 100000000 * btcPriceUsd).toFixed(2)})
            </span>
          </div>
        </div>

        <div className="flex rounded-lg bg-zinc-950 p-1 border border-zinc-800">
          <button
            onClick={() => setActiveTab("send")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
              activeTab === "send" ? "bg-cyan-500 text-zinc-950 font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Send className="h-3.5 w-3.5" />
            {t({ en: "Send Bitcoin", ti: "ቢትኮይን ስደድ" }, isTi)}
          </button>
          <button
            onClick={() => setActiveTab("receive")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
              activeTab === "receive" ? "bg-cyan-500 text-zinc-950 font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Download className="h-3.5 w-3.5" />
            {t({ en: "Receive Bitcoin", ti: "ቢትኮይን ተቐበል" }, isTi)}
          </button>
        </div>
      </div>

      {/* Mode: Send Bitcoin */}
      {activeTab === "send" && (
        <div className="mt-4 space-y-4">
          {/* Recipient Address with Checksum Highlighting */}
          <div>
            <label className="text-xs font-medium text-zinc-300 flex items-center justify-between">
              <span>{t({ en: "Recipient Bitcoin Address:", ti: "ተቐባሊ ናይ ቢትኮይን ኣድራሻ፦" }, isTi)}</span>
              <span className="text-[11px] text-amber-400">
                {t({ en: "Always verify first 4 & last 4 chars", ti: "ቀዳሞት 4ን ዳሕሮት 4ን ፊደላት ኣረጋግጽ" }, isTi)}
              </span>
            </label>
            <input
              type="text"
              value={recipientAddr}
              onChange={(e) => setRecipientAddr(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs font-mono text-zinc-100 focus:border-cyan-500 focus:outline-none"
            />
            {/* Visual verification helper */}
            <div className="mt-1 flex items-center gap-2 text-[11px] text-zinc-400">
              <span>{t({ en: "Visual Check:", ti: "ናይ ዓይኒ ምፍታሽ፦" }, isTi)}</span>
              <span className="rounded bg-amber-500/20 px-1.5 py-0.5 font-mono font-bold text-amber-300">
                {recipientAddr.slice(0, 4)}
              </span>
              <span className="text-zinc-500">••••••••••••••••••••••••</span>
              <span className="rounded bg-amber-500/20 px-1.5 py-0.5 font-mono font-bold text-amber-300">
                {recipientAddr.slice(-4)}
              </span>
            </div>
          </div>

          {/* Amount and Unit Switcher */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-300">
                  {t({ en: "Amount to Send:", ti: "ዝስደድ መጠን፦" }, isTi)}
                </label>
                <div className="flex gap-1">
                  <button
                    onClick={() => setUnitMode("sats")}
                    className={`px-2 py-0.5 text-[10px] rounded ${
                      unitMode === "sats" ? "bg-cyan-500 text-zinc-950 font-bold" : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    sats
                  </button>
                  <button
                    onClick={() => setUnitMode("btc")}
                    className={`px-2 py-0.5 text-[10px] rounded ${
                      unitMode === "btc" ? "bg-cyan-500 text-zinc-950 font-bold" : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    BTC
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm font-mono text-zinc-100 focus:border-cyan-500 focus:outline-none"
              />
              <div className="mt-1 text-[11px] text-zinc-400">
                ≈ {parsedSendSats.toLocaleString()} sats (
                {(parsedSendSats / 100000000).toFixed(8)} BTC · $
                {((parsedSendSats / 100000000) * btcPriceUsd).toFixed(2)})
              </div>
            </div>

            {/* Fee Priority Slider */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-300">
                  {t({ en: "Miner Fee Priority:", ti: "ናይ ማይነር ክፍሊት ምርጫ፦" }, isTi)}
                </label>
                <span className="font-mono text-xs font-bold text-cyan-400">
                  {feeRate} sat/vB
                </span>
              </div>
              <input
                type="range"
                min={2}
                max={60}
                step={1}
                value={feeRate}
                onChange={(e) => setFeeRate(Number(e.target.value))}
                className="mt-2 w-full accent-cyan-500"
              />
              <div className="mt-1 flex justify-between text-[10px] text-zinc-400">
                <span>{t({ en: "Economy (~2 hrs)", ti: "ሕሳሲ (~2 ሰዓት)" }, isTi)}</span>
                <span>{t({ en: "Standard (~30 min)", ti: "ማእከላይ (~30 ደቒቕ)" }, isTi)}</span>
                <span>{t({ en: "Next Block (~10 min)", ti: "ቀዳማይ ብሎክ (~10 ደቒቕ)" }, isTi)}</span>
              </div>
              <div className="mt-1 text-[11px] text-zinc-400">
                {t({ en: "Est. Network Fee:", ti: "ግምታዊ ክፍሊት፦" }, isTi)}{" "}
                <span className="font-mono font-semibold text-zinc-200">
                  {estimatedFeeSats} sats (${((estimatedFeeSats / 100000000) * btcPriceUsd).toFixed(2)})
                </span>
              </div>
            </div>
          </div>

          {/* Broadcast button & summary */}
          <div className="pt-2">
            <button
              onClick={handleSend}
              disabled={!hasSufficientFunds || isSigning}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-bold text-zinc-950 transition hover:bg-cyan-400 disabled:opacity-40"
            >
              {isSigning ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  {t({ en: "Cryptographically Signing with Private Key…", ti: "ብምስጢራዊ መፍትሕ ይፍረም ኣሎ…" }, isTi)}
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  {t(
                    {
                      en: `Sign & Broadcast Payment (${(parsedSendSats + estimatedFeeSats).toLocaleString()} sats total)`,
                      ti: `ፍረምን ክፍሊት ስደድን (ጠቕላላ ${(parsedSendSats + estimatedFeeSats).toLocaleString()} ሳትስ)`,
                    },
                    isTi
                  )}
                </>
              )}
            </button>
          </div>

          {/* Broadcast Confirmation Banner */}
          {txConfirmed && (
            <div className="rounded-xl border border-emerald-500/50 bg-emerald-950/20 p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="h-5 w-5" />
                {t({ en: "Transaction Broadcasted & Included in Mempool!", ti: "ክፍሊት ተሰዲዱ ኣብ ሜምፑል ኣትዩ!" }, isTi)}
              </div>
              <p className="text-xs text-zinc-300">
                {t(
                  {
                    en: "Nodes across the global peer-to-peer network have verified your signature and added the transaction to their memory pools.",
                    ti: "ኣብ መላእ ዓለም ዘለዉ ኖድታት ፊርማኻ ኣረጋጊጾም ነቲ ክፍሊት ኣብ ሜምፑሎም መዝጊቦምዎ ኣለዉ።",
                  },
                  isTi
                )}
              </p>
              <div className="rounded bg-zinc-950 p-2 font-mono text-[11px] text-zinc-400 flex items-center justify-between">
                <span className="truncate">TXID: {txId}</span>
                <span className="text-emerald-400 text-xs shrink-0 font-sans font-medium">1 Confirmation</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode: Receive Bitcoin */}
      {activeTab === "receive" && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* QR & Visual */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 p-6 text-center">
            <div className="relative flex h-40 w-40 items-center justify-center rounded-xl bg-white p-3 shadow-inner">
              {/* Stylized simulated QR code */}
              <div className="grid grid-cols-6 gap-1 w-full h-full p-1 bg-zinc-100 rounded">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-sm ${
                      (i % 2 === 0 && i % 3 === 0) || i < 6 || i % 6 === 0 || i === 35
                        ? "bg-zinc-950"
                        : "bg-zinc-300"
                    }`}
                  />
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-full bg-amber-500 p-2 text-zinc-950 shadow-md">
                  <Coins className="h-5 w-5" />
                </div>
              </div>
            </div>
            <span className="text-[11px] text-zinc-500 mt-3">
              {t({ en: "Scan QR code with any Bitcoin wallet", ti: "ብዝኾነ ናይ ቢትኮይን ዋሌት QR ስካን ግበር" }, isTi)}
            </span>
          </div>

          {/* Details & Address generation */}
          <div className="space-y-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                {t({ en: "Your Fresh Receive Address:", ti: "ሓድሽ ተቐባሊ ኣድራሻኻ፦" }, isTi)}
              </span>
              <div className="mt-1.5 rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 font-mono text-xs text-zinc-200 break-all">
                {currentReceiveAddr}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(currentReceiveAddr);
                  setCopiedReceive(true);
                  setTimeout(() => setCopiedReceive(false), 2000);
                }}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-700"
              >
                {copiedReceive ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedReceive ? t({ en: "Address Copied!", ti: "ኣድራሻ ተቐዲሑ!" }, isTi) : t({ en: "Copy Address", ti: "ኣድራሻ ቅዳሕ" }, isTi)}
              </button>

              <button
                onClick={handleNextReceiveAddress}
                className="flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/30 px-3 py-1.5 text-xs font-medium text-cyan-300 hover:bg-cyan-900/40"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                {t({ en: "Generate Next Fresh Address", ti: "ቀጻሊ ሓድሽ ኣድራሻ ፍጠር" }, isTi)}
              </button>
            </div>

            {/* Privacy tip */}
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300 flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
              <span>
                {t(
                  {
                    en: "Privacy Standard: Good wallets automatically generate a brand new address for every invoice so external observers cannot cluster your transactions.",
                    ti: "ናይ ውልቃውነት መለክዒ፦ ጽቡቕ ዋሌት ሰባት ንዝገበርካዮም ክፍሊታት ከየተኣሳስሩዎም ኣብ ነፍሲ ወከፍ ግዜ ሓድሽ ኣድራሻ ይፈጥር።",
                  },
                  isTi
                )}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   Module 4: Privacy & Threat Defense Matrix (Section 8.3)
   Theme: "Privacy basics: address reuse awareness, VPN, local-first tools"
   ========================================================================= */

interface PrivacyInspectorProps {
  isTi: boolean;
}

function PrivacyInspector({ isTi }: PrivacyInspectorProps) {
  const [reuseMode, setReuseMode] = useState<"reused" | "fresh">("reused");
  const [activeThreat, setActiveThreat] = useState<number>(0);

  const threats = [
    {
      id: "reuse",
      titleEn: "Address Reuse Clustering",
      titleTi: "ተደጋጋሚ ኣድራሻ ምጥቃም",
      descEn: "Using the same Bitcoin address to receive salary, friend repayments, and purchases.",
      descTi: "ንደሞዝ፡ ካብ የዕሩኽት ንዝመጽእ ገንዘብን ሓደ ዓይነት ኣድራሻ ደጋጊምካ ምጥቃም።",
      weakChoiceEn: "Reuse 1 address for everything",
      weakChoiceTi: "ንኹሉ ሓደ ኣድራሻ ደጋጊምካ ተጠቐም",
      weakOutcomeEn: "Anyone who sends you 1 sat can look up the address on a block explorer and see your lifetime balance ($45,000) and all your past transactions.",
      weakOutcomeTi: "1 ሳት ዝሰደደልካ ሰብ እኳ ኣብ ብሎክ ኤክስፕሎረር ርእዩ ጠቕላላ ዘለካ ሃብትን ዝገበርካዮም ዝርዝር ክፍሊታትን ክፈልጥ ይኽእል።",
      strongChoiceEn: "Fresh address per invoice",
      strongChoiceTi: "ንነፍሲ ወከፍ ክፍሊት ሓድሽ ኣድራሻ",
      strongOutcomeEn: "Every transaction appears as an independent UTXO on-chain. Observers cannot connect them to one entity without advanced heuristics.",
      strongOutcomeTi: "ነፍሲ ወከፍ ክፍሊት ከም ናጻ UTXO ኣብ ብሎክቸይን ይረአ። ሰባት ናይ ሓደ ሰብ ምዃኑ ክፈልጡ ኣይክእሉን።",
    },
    {
      id: "wifi",
      titleEn: "Public Wi-Fi & ISP Snooping",
      titleTi: "ናይ ህዝቢ ዋይፋይን ናይ ኢንተርነት መርበብን ምጽናት",
      descEn: "Broadcasting a transaction from a coffee shop or hotel public Wi-Fi without encryption.",
      descTi: "ካብ ካፈ ወይ ሆቴል ዋይፋይ ብዘይ ውሑስ መርበብ ክፍሊት ምፍናው።",
      weakChoiceEn: "Plain Unencrypted Connection",
      weakChoiceTi: "ተራ ዘይተሓለወ መርበብ",
      weakOutcomeEn: "The Wi-Fi owner or ISP associates your real-world IP address with the specific Bitcoin transaction you broadcasted.",
      weakOutcomeTi: "ዋና እቲ ዋይፋይ ናትካ IP ኣድራሻ ምስቲ ዝሰደድካዮ ናይ ቢትኮይን ክፍሊት ኣተኣሳሲሩ ክፈልጦ ይኽእል።",
      strongChoiceEn: "Reputable VPN or Tor Node",
      strongChoiceTi: "ውሑስ VPN ወይ Tor መርበብ",
      strongOutcomeEn: "Hides your physical IP address from the local router and ISP, preventing geographic and identity correlation.",
      strongOutcomeTi: "ናይ ሓቂ IP ኣድራሻኻ ይሓብኦ፡ በዚ ድማ መንነትካን ዘለኻዮ ቦታን ከይፍለጥ ይከላኸል።",
    },
    {
      id: "2fa",
      titleEn: "Exchange 2FA: SMS vs. Authenticator",
      titleTi: "ናይ ኤክስቸንጅ መረጋገጺ፦ SMS ምስ Authenticator",
      descEn: "Securing your exchange account password with a second factor of authentication.",
      descTi: "ናይ ኤክስቸንጅ ሕሳብካ ብካልኣይ ደረጃ መረጋገጺ ምሕላው።",
      weakChoiceEn: "SMS Text Message 2FA",
      weakChoiceTi: "ናይ ተሌፎን መልእኽቲ (SMS 2FA)",
      weakOutcomeEn: "Vulnerable to SIM-swap attacks! Attackers bribe or trick your telecom provider into porting your phone number and steal your coins.",
      weakOutcomeTi: "ንSIM-swap መጥቃዕቲ ዝተቓልዐ እዩ! ሰረቕቲ ንቴሌኮም ብምድንጋር ቁጽርኻ ወሲዶም ገንዘብካ ይሰርቁ።",
      strongChoiceEn: "Hardware Key / TOTP App",
      strongChoiceTi: "ናይ መተግበሪ TOTP ወይ ሃርድዌር መፍትሕ",
      strongOutcomeEn: "Cryptographic codes generated completely offline on your device, immune to telecommunication interception.",
      strongOutcomeTi: "ብዘይ መርበብ ኣብ ስልክኻ ዝፍጠር ኮድ ብምዃኑ ብቴሌኮም ክስረቕ ፈጺሙ ኣይክእልን።",
    },
  ];

  const curr = threats[activeThreat];

  return (
    <div className={panelClass}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-400">
                {t({ en: "Section 8.3 Interactive", ti: "ክፍሊ 8.3 መስተጋብራዊ" }, isTi)}
              </span>
              <span className="text-xs text-zinc-400">
                {t({ en: "Privacy Posture & Threat Modeling", ti: "ናይ ውልቃውነት መከላከልን ስግኣታትን" }, isTi)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100">
              {t(
                {
                  en: "Privacy Defense Matrix: Address Clustering, VPNs & Identity Leaks",
                  ti: "ናይ ውልቃውነት መከላኸሊ፦ ምትእስሳር ኣድራሻታት፡ VPNን ምዕቃብ መንነትን",
                },
                isTi
              )}
            </h3>
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm text-zinc-300">
        {t(
          {
            en: "Bitcoin’s public ledger is permanent. Privacy is not a single tool—it is a posture built through disciplined habits.",
            ti: "ናይ ቢትኮይን ሓባራዊ መዝገብ ቀዋሚ እዩ። ውልቃውነት ሓደ መሳርሒ ጥራይ ዘይኮነስ ብጥንቁቕ ልምዲ ዝህነጽ መከላኸሊ እዩ።",
          },
          isTi
        )}
      </p>

      {/* Part 1: Visual Address Reuse Explorer Simulator */}
      <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            {t({ en: "Interactive Experiment: What Does a Blockchain Explorer See?", ti: "ፈተነ፦ ኣብ ብሎክ ኤክስፕሎረር እንታይ ይረአ?" }, isTi)}
          </span>
          <div className="flex rounded-lg bg-zinc-950 p-1 border border-zinc-800">
            <button
              onClick={() => setReuseMode("reused")}
              className={`px-3 py-1 text-xs rounded font-medium transition ${
                reuseMode === "reused"
                  ? "bg-red-500 text-white font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {t({ en: "Reused Address (Bad)", ti: "ዝተደጋገመ ኣድራሻ (ሕማቕ)" }, isTi)}
            </button>
            <button
              onClick={() => setReuseMode("fresh")}
              className={`px-3 py-1 text-xs rounded font-medium transition ${
                reuseMode === "fresh"
                  ? "bg-emerald-500 text-zinc-950 font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {t({ en: "Fresh Addresses (Good)", ti: "ሓደስቲ ኣድራሻታት (ጽቡቕ)" }, isTi)}
            </button>
          </div>
        </div>

        {/* Visual Graph comparison */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {reuseMode === "reused" ? (
            <>
              <div className="rounded-xl border border-red-500/30 bg-zinc-950 p-3 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase">{t({ en: "Incoming Payment 1", ti: "ክፍሊት 1" }, isTi)}</span>
                <div className="font-mono text-zinc-300">Employer Salary: +50,000 sats</div>
                <div className="text-[11px] text-red-400">→ Sent to bc1q_alice_same</div>
              </div>
              <div className="rounded-xl border border-red-500/30 bg-zinc-950 p-3 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase">{t({ en: "Incoming Payment 2", ti: "ክፍሊት 2" }, isTi)}</span>
                <div className="font-mono text-zinc-300">Friend Dinner Split: +10,000 sats</div>
                <div className="text-[11px] text-red-400">→ Sent to bc1q_alice_same</div>
              </div>
              <div className="rounded-xl border border-red-500/60 bg-red-950/30 p-3 space-y-1">
                <span className="text-[10px] text-red-400 font-bold uppercase">{t({ en: "Explorer Public Summary", ti: "ናይ ኤክስፕሎረር ሓበሬታ" }, isTi)}</span>
                <div className="font-mono font-bold text-red-300">Total Balance: 60,000 sats</div>
                <div className="text-[11px] text-zinc-400">
                  {t(
                    {
                      en: "Friend now sees your employer's address and knows your exact balance!",
                      ti: "እቲ ዓርክኻ ናይ ኣስራሒኻ ኣድራሻን ጠቕላላ ዘለካ ገንዘብን ብቐሊሉ ርእዩዎ!",
                    },
                    isTi
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-xl border border-emerald-500/30 bg-zinc-950 p-3 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase">{t({ en: "Incoming Payment 1", ti: "ክፍሊት 1" }, isTi)}</span>
                <div className="font-mono text-zinc-300">Employer Salary: +50,000 sats</div>
                <div className="text-[11px] text-emerald-400">→ Sent to bc1q_alice_addr1</div>
              </div>
              <div className="rounded-xl border border-emerald-500/30 bg-zinc-950 p-3 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase">{t({ en: "Incoming Payment 2", ti: "ክፍሊት 2" }, isTi)}</span>
                <div className="font-mono text-zinc-300">Friend Dinner Split: +10,000 sats</div>
                <div className="text-[11px] text-emerald-400">→ Sent to bc1q_alice_addr2</div>
              </div>
              <div className="rounded-xl border border-emerald-500/60 bg-emerald-950/30 p-3 space-y-1">
                <span className="text-[10px] text-emerald-400 font-bold uppercase">{t({ en: "Explorer Public Summary", ti: "ናይ ኤክስፕሎረር ሓበሬታ" }, isTi)}</span>
                <div className="font-mono font-bold text-emerald-300">Independent Balances</div>
                <div className="text-[11px] text-zinc-400">
                  {t(
                    {
                      en: "Friend sees only their 10,000 sats transfer. Your salary and savings remain totally private.",
                      ti: "እቲ ዓርክኻ ነታ ናቱ 10,000 ሳት ጥራይ ይርኢ። ደሞዝካን ዝተረፈ ገንዘብካን ምሉእ ብምሉእ ውሑስ እዩ።",
                    },
                    isTi
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Part 2: Threat Scenario Defense Inspector */}
      <div className="mt-5 space-y-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          {t({ en: "Select Real-World Threat Scenario:", ti: "ናይ ሓቂ ስግኣት ኩነታት ምረጽ፦" }, isTi)}
        </div>
        <div className="flex flex-wrap gap-2">
          {threats.map((thr, idx) => (
            <button
              key={thr.id}
              onClick={() => setActiveThreat(idx)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                activeThreat === idx
                  ? "bg-rose-500 text-white font-bold"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              {isTi ? thr.titleTi : thr.titleEn}
            </button>
          ))}
        </div>

        {/* Selected Scenario Card */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-3">
          <p className="text-xs text-zinc-300">{isTi ? curr.descTi : curr.descEn}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Weak Posture */}
            <div className="rounded-lg border border-red-500/30 bg-red-950/20 p-3">
              <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" />
                {isTi ? curr.weakChoiceTi : curr.weakChoiceEn}
              </span>
              <p className="mt-1 text-[11px] text-zinc-300">
                {isTi ? curr.weakOutcomeTi : curr.weakOutcomeEn}
              </p>
            </div>

            {/* Strong Posture */}
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-3">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                {isTi ? curr.strongChoiceTi : curr.strongChoiceEn}
              </span>
              <p className="mt-1 text-[11px] text-zinc-300">
                {isTi ? curr.strongOutcomeTi : curr.strongOutcomeEn}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   Master Component Export
   ========================================================================= */

interface Chapter8InteractiveLessonProps {
  module: "exchange_onramp" | "seed_backup_lab" | "send_receive_playground" | "privacy_inspector";
  isTi?: boolean;
}

export function Chapter8InteractiveLesson({
  module,
  isTi = false,
}: Chapter8InteractiveLessonProps) {
  switch (module) {
    case "exchange_onramp":
      return <ExchangeOnrampSimulator isTi={isTi} />;
    case "seed_backup_lab":
      return <SeedBackupLab isTi={isTi} />;
    case "send_receive_playground":
      return <SendReceivePlayground isTi={isTi} />;
    case "privacy_inspector":
      return <PrivacyInspector isTi={isTi} />;
    default:
      return null;
  }
}
