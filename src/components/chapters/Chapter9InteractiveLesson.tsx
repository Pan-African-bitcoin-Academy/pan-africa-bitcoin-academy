"use client";

import { useState, useMemo } from "react";
import {
  Coins,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Zap,
  TrendingDown,
  Layers,
  Sliders,
  Sparkles,
  Split,
  Scale,
  RefreshCw,
  Clock,
  Flame,
  ArrowDownRight,
  ExternalLink,
  Lock,
  Unlock,
  Info,
} from "lucide-react";

/* ─────────── Shared helpers ─────────── */

type Localized = { en: string; ti: string };
const t = (v: Localized, isTi: boolean) => (isTi ? v.ti : v.en);

const panelClass =
  "rounded-2xl border border-zinc-800 bg-zinc-950/90 p-4 shadow-xl sm:p-6 my-6";

/* =========================================================================
   Module 1: UTXO Lifecycle & Interactive Tree Diagram (Section 9.0)
   Theme: "What You Really Own — The UTXO Model (Tree of Spent & Unspent Coins)"
   ========================================================================= */

interface UtxoLifecycleProps {
  isTi: boolean;
}

interface SimulatedUtxo {
  id: string;
  amount: number; // in sats
  txid: string;
  vout: number;
}

function UtxoLifecycleSimulator({ isTi }: UtxoLifecycleProps) {
  const initialCoins: SimulatedUtxo[] = [
    { id: "c1", amount: 50000, txid: "7f2a...81c4", vout: 0 },
    { id: "c2", amount: 25000, txid: "3e9b...44a1", vout: 1 },
    { id: "c3", amount: 15000, txid: "9c01...2f89", vout: 0 },
  ];

  const [walletCoins, setWalletCoins] = useState<SimulatedUtxo[]>(initialCoins);
  const [selectedCoinId, setSelectedCoinId] = useState<string>("c1");
  const [spendAmount, setSpendAmount] = useState<number>(35000);
  const [modelMode, setModelMode] = useState<"utxo" | "account">("utxo");
  const [lastTx, setLastTx] = useState<{
    inputSpent: number;
    payment: number;
    change: number;
    fee: number;
  } | null>(null);

  const selectedCoin = walletCoins.find((c) => c.id === selectedCoinId) || walletCoins[0];
  const minerFee = 1000; // 1,000 sats
  const totalBalance = walletCoins.reduce((acc, c) => acc + c.amount, 0);

  const canSpend = selectedCoin && spendAmount > 0 && spendAmount + minerFee <= selectedCoin.amount;
  const changeAmount = selectedCoin ? Math.max(0, selectedCoin.amount - spendAmount - minerFee) : 0;

  const handleExecuteSpend = () => {
    if (!canSpend || !selectedCoin) return;

    // Remove the spent coin
    const remainingCoins = walletCoins.filter((c) => c.id !== selectedCoin.id);

    // If there is change, add a new change UTXO
    const newCoins = [...remainingCoins];
    if (changeAmount > 0) {
      newCoins.push({
        id: `change_${Date.now()}`,
        amount: changeAmount,
        txid: "e4d1...8923",
        vout: 1,
      });
    }

    setWalletCoins(newCoins);
    setLastTx({
      inputSpent: selectedCoin.amount,
      payment: spendAmount,
      change: changeAmount,
      fee: minerFee,
    });

    if (newCoins.length > 0) {
      setSelectedCoinId(newCoins[0].id);
    }
  };

  const handleReset = () => {
    setWalletCoins(initialCoins);
    setSelectedCoinId("c1");
    setSpendAmount(35000);
    setLastTx(null);
  };

  return (
    <div className={panelClass}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <Coins className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
                {t({ en: "Section 9.0 Interactive", ti: "ክፍሊ 9.0 መስተጋብራዊ" }, isTi)}
              </span>
              <span className="text-xs text-zinc-400">
                {t({ en: "UTXO vs Account Model", ti: "ናይ UTXO ሞዴል ምስ ናይ ባንኪ ሕሳብ" }, isTi)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100">
              {t(
                {
                  en: "What You Really Own: The Digital Coin & Change Mechanism",
                  ti: "ብሓቂ እትውንኖ፦ ናይ ዲጂታል ሳንቲም (UTXO)ን ተመላሲ ገንዘብን",
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
          {t({ en: "Reset Coins", ti: "ሳንቲማት ምለስ" }, isTi)}
        </button>
      </div>

      <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
        {t(
          {
            en: "Your Bitcoin wallet does not store a single balance number. Instead, it holds independent unspent coins (UTXOs). When you spend, you must spend a whole coin, receive change back, and pay a miner fee.",
            ti: "ናይ ቢትኮይን ዋሌትካ ሓደ ቁጽሪ ባላንስ ኣየቐምጥን። ኣብ ክንድኡ ነናጻ ዝኾኑ ዘይተኸፍሉ ሳንቲማት (UTXOs) ይሕዝ። ክትከፍል ከለኻ ሙሉእ ሳንቲም ተጥፍእ፡ ተመላሲ ትቕበል፡ ክፍሊት ማይነር ድማ ትኸፍል።",
          },
          isTi
        )}
      </p>

      {/* Model toggle: UTXO vs Bank Account */}
      <div className="mt-4 flex rounded-xl border border-zinc-800 bg-zinc-900/60 p-1 w-fit">
        <button
          onClick={() => setModelMode("utxo")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
            modelMode === "utxo"
              ? "bg-amber-500 text-zinc-950 shadow-sm"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Coins className="h-3.5 w-3.5" />
          {t({ en: "Bitcoin UTXO Model", ti: "ናይ ቢትኮይን UTXO ሞዴል" }, isTi)}
        </button>
        <button
          onClick={() => setModelMode("account")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
            modelMode === "account"
              ? "bg-amber-500 text-zinc-950 shadow-sm"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Scale className="h-3.5 w-3.5" />
          {t({ en: "Traditional Bank Ledger", ti: "ልሙድ ናይ ባንኪ መዝገብ" }, isTi)}
        </button>
      </div>

      {modelMode === "account" ? (
        <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            {t({ en: "Traditional Bank Balance (Account Model):", ti: "ልሙድ ናይ ባንኪ ባላንስ (ናይ ሕሳብ ሞዴል)፦" }, isTi)}
          </div>
          <div className="rounded-xl bg-zinc-950 p-4 border border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-zinc-500">{t({ en: "Single Fiat Account Balance", ti: "ናይ ባንኪ ሓደ ባላንስ" }, isTi)}</span>
              <div className="text-2xl font-bold font-mono text-zinc-100">${(totalBalance / 1000).toFixed(2)} USD</div>
            </div>
            <div className="text-xs text-zinc-400 max-w-xs text-right">
              {t(
                {
                  en: "Banks simply debit -$35 from your single ledger entry. No coins exist, no change addresses, and no cryptographic inputs.",
                  ti: "ባንክታት ካብቲ ሓደ ቁጽሪ ጥራይ -$35 ይንክዩ። ሳንቲማት የለዉን፡ ተመላሲ ኣድራሻ የለን፡ ክሪፕቶግራፊክ ኢንፑት የለን።",
                },
                isTi
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Coins className="h-3.5 w-3.5" />
                {t({ en: "Available UTXOs in Your Wallet:", ti: "ኣብ ዋሌትካ ዘለዉ UTXOs፦" }, isTi)}
              </span>
              <span className="text-xs font-mono text-zinc-400">
                {t({ en: "Total Spendable:", ti: "ጠቕላላ ዘሎ፦" }, isTi)}{" "}
                <strong className="text-amber-400 font-bold">{totalBalance.toLocaleString()} sats</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {walletCoins.map((coin, index) => {
                const isSelected = coin.id === selectedCoin?.id;
                return (
                  <button
                    key={coin.id}
                    onClick={() => setSelectedCoinId(coin.id)}
                    className={`rounded-xl border p-3.5 text-left transition cursor-pointer relative ${
                      isSelected
                        ? "border-amber-500 bg-amber-500/10 shadow-md ring-1 ring-amber-500/30"
                        : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">
                        UTXO #{index + 1}
                      </span>
                      {isSelected && (
                        <span className="rounded bg-amber-500 text-zinc-950 px-1.5 py-0.2 text-[9px] font-bold uppercase">
                          {t({ en: "Selected Input", ti: "ዝተመርጸ" }, isTi)}
                        </span>
                      )}
                    </div>
                    <div className="text-lg font-bold font-mono text-zinc-100">
                      {coin.amount.toLocaleString()}{" "}
                      <span className="text-xs font-normal text-amber-400">sats</span>
                    </div>
                    <div className="text-[10px] font-mono text-zinc-500 mt-1 truncate">
                      {coin.txid}:{coin.vout}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Split className="h-3.5 w-3.5 text-cyan-400" />
              {t({ en: "Construct Payment & Watch Coin Splitting:", ti: "ክፍሊት ስራሕን ምምቃል ሳንቲምን ተዓዘብ፦" }, isTi)}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-zinc-400">
                  {t({ en: "Amount to Send to Merchant (sats):", ti: "ናብ ነጋዳይ ዝስደድ መጠን (ሳትስ)፦" }, isTi)}
                </label>
                <input
                  type="number"
                  min={1000}
                  step={1000}
                  value={spendAmount}
                  onChange={(e) => setSpendAmount(Math.max(1000, Number(e.target.value)))}
                  className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm font-mono text-zinc-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="rounded-lg bg-zinc-950 p-3 border border-zinc-800 text-xs font-mono space-y-1">
                <div className="flex justify-between text-zinc-400">
                  <span>{t({ en: "Input Selected:", ti: "ዝተመርጸ ሳንቲም፦" }, isTi)}</span>
                  <span className="text-zinc-200">{selectedCoin?.amount.toLocaleString()} sats</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>{t({ en: "Merchant Payment:", ti: "ንነጋዳይ፦" }, isTi)}</span>
                  <span className="text-cyan-400">-{spendAmount.toLocaleString()} sats</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>{t({ en: "Estimated Miner Fee:", ti: "ክፍሊት ማይነር፦" }, isTi)}</span>
                  <span className="text-red-400">-{minerFee.toLocaleString()} sats</span>
                </div>
                <div className="pt-1 border-t border-zinc-800 flex justify-between font-bold">
                  <span className="text-emerald-400">{t({ en: "Change Returned:", ti: "ተመላሲ ሳንቲም፦" }, isTi)}</span>
                  <span className="text-emerald-400">+{changeAmount.toLocaleString()} sats</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                {t({ en: "On-Chain Transaction Mechanics:", ti: "ናይ ብሎክቸይን ትራንዛክሽን መስርሕ፦" }, isTi)}
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="w-full sm:w-1/3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-2.5 text-center">
                  <div className="text-[10px] text-amber-400 font-bold uppercase">{t({ en: "1 Input Consumed", ti: "1 ዝጠፍእ ሳንቲም" }, isTi)}</div>
                  <div className="font-mono font-bold text-zinc-100 mt-1">
                    {selectedCoin?.amount.toLocaleString()} sats
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">{t({ en: "Completely destroyed", ti: "ሙሉእ ብሙሉእ ይጠፍእ" }, isTi)}</div>
                </div>

                <ArrowRight className="h-5 w-5 text-zinc-500 shrink-0 hidden sm:block" />

                <div className="w-full sm:w-2/3 space-y-2">
                  <div className="flex items-center justify-between rounded-lg border border-cyan-500/40 bg-cyan-950/20 px-3 py-1.5">
                    <span className="text-cyan-300 font-medium">{t({ en: "Output 1: Merchant Payment", ti: "ውጽኢት 1፦ ክፍሊት ነጋዳይ" }, isTi)}</span>
                    <span className="font-mono font-bold text-cyan-400">{spendAmount.toLocaleString()} sats</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-emerald-500/40 bg-emerald-950/20 px-3 py-1.5">
                    <span className="text-emerald-300 font-medium">{t({ en: "Output 2: Fresh Change UTXO", ti: "ውጽኢት 2፦ ሓድሽ ተመላሲ ሳንቲም" }, isTi)}</span>
                    <span className="font-mono font-bold text-emerald-400">{changeAmount.toLocaleString()} sats</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-red-500/30 bg-red-950/20 px-3 py-1 text-[11px]">
                    <span className="text-zinc-400">{t({ en: "Implicit Miner Fee", ti: "ክፍሊት ማይነር" }, isTi)}</span>
                    <span className="font-mono text-red-300">{minerFee.toLocaleString()} sats</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleExecuteSpend}
              disabled={!canSpend}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold text-zinc-950 transition hover:bg-amber-400 disabled:opacity-40 cursor-pointer"
            >
              <Split className="h-4 w-4" />
              {canSpend
                ? t(
                    {
                      en: `Broadcast Spend of ${selectedCoin?.amount.toLocaleString()} sats coin`,
                      ti: `ናይ ${selectedCoin?.amount.toLocaleString()} ሳትስ ሳንቲም ከፊልካ ስደድ`,
                    },
                    isTi
                  )
                : t(
                    {
                      en: "Selected UTXO too small for this amount + fee. Pick a larger coin.",
                      ti: "ዝተመርጸ ሳንቲም ንኽፍሊት ኣይኣክልን። ዝዓበየ ምረጽ።",
                    },
                    isTi
                  )}
            </button>
          </div>

          {lastTx && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-3.5 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-zinc-300 space-y-1">
                <span className="font-bold text-emerald-300">
                  {t({ en: "Transaction Confirmed! New UTXOs Created:", ti: "ክፍሊት ተረጋጊጹ! ሓደስቲ ሳንቲማት ተፈጢሮም፦" }, isTi)}
                </span>
                <p className="text-[11px] text-zinc-400">
                  {t(
                    {
                      en: `Your old ${lastTx.inputSpent.toLocaleString()} sat UTXO was spent. The merchant received ${lastTx.payment.toLocaleString()} sats, and a brand new ${lastTx.change.toLocaleString()} sat change UTXO was created in your wallet!`,
                      ti: `እቲ ዝነበረካ ናይ ${lastTx.inputSpent.toLocaleString()} ሳትስ ሳንቲም ተጠቒምካዮ። እቲ ነጋዳይ ${lastTx.payment.toLocaleString()} ሳትስ ተቐቢሉ፡ ኣብ ዋሌትካ ድማ ናይ ${lastTx.change.toLocaleString()} ሳትስ ሓድሽ ተመላሲ ሳንቲም ተፈጢሩ!`,
                    },
                    isTi
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   Module 2: The Bitcoin Fee Paradox Simulator (Section 9.1)
   Theme: "Fees Depend on Virtual Bytes (vB), NOT Amount Sent!"
   ========================================================================= */

interface FeeVbytesLabProps {
  isTi: boolean;
}

function FeeVbytesLab({ isTi }: FeeVbytesLabProps) {
  const [numInputs, setNumInputs] = useState<number>(1);
  const [numOutputs, setNumOutputs] = useState<number>(2);
  const [scriptType, setScriptType] = useState<"legacy" | "segwit" | "taproot">("segwit");
  const [satPerVb, setSatPerVb] = useState<number>(20);

  // Script type vByte weights:
  // Legacy (P2PKH): ~148 vB per input, 34 vB per output, 10 vB overhead
  // Native SegWit (P2WPKH): ~68 vB per input, 31 vB per output, 10.5 vB overhead
  // Taproot (P2TR): ~57.5 vB per input, 43 vB per output, 10.5 vB overhead
  const vBytes = useMemo(() => {
    let inputVb = 68;
    let outputVb = 31;
    let overhead = 10.5;

    if (scriptType === "legacy") {
      inputVb = 148;
      outputVb = 34;
      overhead = 10;
    } else if (scriptType === "taproot") {
      inputVb = 57.5;
      outputVb = 43;
      overhead = 10.5;
    }

    return Math.ceil(overhead + numInputs * inputVb + numOutputs * outputVb);
  }, [numInputs, numOutputs, scriptType]);

  const totalFeeSats = vBytes * satPerVb;
  const btcPriceUsd = 85000;
  const totalFeeUsd = (totalFeeSats / 100000000) * btcPriceUsd;

  return (
    <div className={panelClass}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-400">
                {t({ en: "Section 9.1 Interactive", ti: "ክፍሊ 9.1 መስተጋብራዊ" }, isTi)}
              </span>
              <span className="text-xs text-zinc-400">
                {t({ en: "Transaction Weight & Fee Calculator", ti: "ናይ ትራንዛክሽን ክብደትን ክፍሊትን" }, isTi)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100">
              {t(
                {
                  en: "The Fee Paradox: Why Virtual Size (vBytes) Dictates Cost",
                  ti: "ናይ ክፍሊት ምስጢር፦ ስለምንታይ እዩ ናይ ዳታ ስፍሓት (vBytes) ንዋጋ ዝውስኖ",
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
            en: "In Bitcoin, you do not pay a percentage of the money you send. You pay for the storage space (virtual bytes) your transaction consumes on the blockchain ledger.",
            ti: "ኣብ ቢትኮይን ካብቲ እትሰዶ ገንዘብ ሚእታዊት ኣይትኸፍልን ኢኻ። እቲ ትራንዛክሽንካ ኣብ ብሎክቸይን ዝወስዶ ናይ ዳታ ቦታ (virtual bytes) ጥራይ ኢኻ ትኸፍል።",
          },
          isTi
        )}
      </p>

      {/* The Famous Paradox Comparison Cards */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Scenario 1: Whale sending $1,000,000 */}
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-400">
              {t({ en: "Transaction A: The Whale", ti: "ትራንዛክሽን 1፦ ናይ ሃፍታም ክፍሊት" }, isTi)}
            </span>
            <span className="text-xs font-mono text-zinc-400">1 Native SegWit input</span>
          </div>
          <div className="text-lg font-bold text-zinc-100">
            {t({ en: "Sending $1,000,000 USD (11.7 BTC)", ti: "$1,000,000 USD (11.7 BTC) ምስዳድ" }, isTi)}
          </div>
          <div className="text-xs text-zinc-300">
            {t(
              {
                en: "Virtual Size: 140 vBytes · Fee at 20 sat/vB: 2,800 sats",
                ti: "ናይ ዳታ ስፍሓት፦ 140 vBytes · ክፍሊት፦ 2,800 ሳትስ",
              },
              isTi
            )}
          </div>
          <div className="rounded bg-zinc-950 p-2 font-mono text-sm font-bold text-emerald-400 flex items-center justify-between">
            <span>{t({ en: "Total Fee:", ti: "ጠቕላላ ክፍሊት፦" }, isTi)}</span>
            <span>$2.38 USD (0.0002% fee!)</span>
          </div>
        </div>

        {/* Scenario 2: Micro-tipper sending $15 with 30 dust inputs */}
        <div className="rounded-xl border border-red-500/30 bg-red-950/10 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="rounded bg-red-500/20 px-2 py-0.5 text-xs font-bold text-red-400">
              {t({ en: "Transaction B: The Dust Trap", ti: "ትራንዛክሽን 2፦ ናይ ደቂቕ ሳንቲማት መጻወድያ" }, isTi)}
            </span>
            <span className="text-xs font-mono text-zinc-400">25 Legacy inputs</span>
          </div>
          <div className="text-lg font-bold text-zinc-100">
            {t({ en: "Sending $15.00 USD (17,600 sats)", ti: "$15.00 USD (17,600 ሳትስ) ምስዳድ" }, isTi)}
          </div>
          <div className="text-xs text-zinc-300">
            {t(
              {
                en: "Virtual Size: 3,768 vBytes · Fee at 20 sat/vB: 75,360 sats",
                ti: "ናይ ዳታ ስፍሓት፦ 3,768 vBytes · ክፍሊት፦ 75,360 ሳትስ",
              },
              isTi
            )}
          </div>
          <div className="rounded bg-zinc-950 p-2 font-mono text-sm font-bold text-red-400 flex items-center justify-between">
            <span>{t({ en: "Total Fee:", ti: "ጠቕላላ ክፍሊት፦" }, isTi)}</span>
            <span>$64.05 USD (400% of payment!)</span>
          </div>
        </div>
      </div>

      {/* Interactive Size & Fee Workbench */}
      <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
          <Sliders className="h-3.5 w-3.5" />
          {t({ en: "Interactive vByte Weight & Fee Calculator:", ti: "መስተጋብራዊ ናይ vByte ክብደትን ክፍሊትን መተመኒ፦" }, isTi)}
        </div>

        {/* Script Type selector */}
        <div>
          <label className="text-xs text-zinc-400 block mb-1.5">
            {t({ en: "Wallet Script Type (Address format):", ti: "ናይ ዋሌት ኣድራሻ ዓይነት፦" }, isTi)}
          </label>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => setScriptType("legacy")}
              className={`rounded-lg border p-2 text-center transition cursor-pointer ${
                scriptType === "legacy"
                  ? "border-amber-500 bg-amber-500/20 text-amber-200 font-bold"
                  : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <div>Legacy (1...)</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">~148 vB / input</div>
            </button>
            <button
              onClick={() => setScriptType("segwit")}
              className={`rounded-lg border p-2 text-center transition cursor-pointer ${
                scriptType === "segwit"
                  ? "border-cyan-500 bg-cyan-500/20 text-cyan-200 font-bold"
                  : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <div>Native SegWit (bc1q...)</div>
              <div className="text-[10px] text-cyan-400 mt-0.5">~68 vB / input (Popular)</div>
            </button>
            <button
              onClick={() => setScriptType("taproot")}
              className={`rounded-lg border p-2 text-center transition cursor-pointer ${
                scriptType === "taproot"
                  ? "border-purple-500 bg-purple-500/20 text-purple-200 font-bold"
                  : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <div>Taproot (bc1p...)</div>
              <div className="text-[10px] text-purple-400 mt-0.5">~57.5 vB / input (Smallest)</div>
            </button>
          </div>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <div className="flex justify-between text-xs text-zinc-300 mb-1">
              <span>{t({ en: "Number of Inputs:", ti: "በዝሒ ኢንፑትስ፦" }, isTi)}</span>
              <span className="font-bold font-mono text-cyan-400">{numInputs}</span>
            </div>
            <input
              type="range"
              min={1}
              max={25}
              value={numInputs}
              onChange={(e) => setNumInputs(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-zinc-300 mb-1">
              <span>{t({ en: "Number of Outputs:", ti: "በዝሒ ውጽኢት፦" }, isTi)}</span>
              <span className="font-bold font-mono text-cyan-400">{numOutputs}</span>
            </div>
            <input
              type="range"
              min={1}
              max={4}
              value={numOutputs}
              onChange={(e) => setNumOutputs(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-zinc-300 mb-1">
              <span>{t({ en: "Mempool Fee Rate:", ti: "ናይ ሜምፑል ክፍሊት፦" }, isTi)}</span>
              <span className="font-bold font-mono text-cyan-400">{satPerVb} sat/vB</span>
            </div>
            <input
              type="range"
              min={1}
              max={100}
              value={satPerVb}
              onChange={(e) => setSatPerVb(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>
        </div>

        {/* Result Breakdown Card */}
        <div className="rounded-xl bg-zinc-950 p-4 border border-zinc-800 flex flex-wrap items-center justify-between gap-4 font-mono">
          <div>
            <span className="text-[11px] text-zinc-500 uppercase">{t({ en: "Calculated Weight:", ti: "ዝተጸባጸበ ስፍሓት፦" }, isTi)}</span>
            <div className="text-xl font-bold text-zinc-100">{vBytes.toLocaleString()} vBytes</div>
          </div>
          <div>
            <span className="text-[11px] text-zinc-500 uppercase">{t({ en: "Total Fee in Sats:", ti: "ክፍሊት ብሳትስ፦" }, isTi)}</span>
            <div className="text-xl font-bold text-amber-400">{totalFeeSats.toLocaleString()} sats</div>
          </div>
          <div>
            <span className="text-[11px] text-zinc-500 uppercase">{t({ en: "Estimated USD Cost:", ti: "ግምታዊ ክፍሊት ብUSD፦" }, isTi)}</span>
            <div className="text-xl font-bold text-emerald-400">${totalFeeUsd.toFixed(2)} USD</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   Module 3: The Coin Control Cockpit (Curriculum Activity - Section 9.1)
   Theme: "Plan a Spend from a UTXO Set & Avoid Tainted Merges"
   ========================================================================= */

interface CoinControlProps {
  isTi: boolean;
}

interface LabeledUtxo {
  id: string;
  labelEn: string;
  labelTi: string;
  amount: number; // in sats
  isKyc: boolean;
  tagColor: string;
}

function CoinControlCockpit({ isTi }: CoinControlProps) {
  const invoiceTarget = 50000; // 50,000 sats
  const feePerInput = 1200; // 1,200 sats

  const availableUtxos: LabeledUtxo[] = [
    {
      id: "u1",
      labelEn: "KYC Exchange Buy (Linked to Real Identity)",
      labelTi: "ናይ ኤክስቸንጅ ዕድጊ (ምስ ሓቀኛ መንነት ዝተኣሳሰረ)",
      amount: 80000,
      isKyc: true,
      tagColor: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    },
    {
      id: "u2",
      labelEn: "P2P Cash Trade (Anonymous Non-KYC)",
      labelTi: "ናይ P2P ዕድጊ (ስም ዘይብሉ ናጻ)",
      amount: 45000,
      isKyc: false,
      tagColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    },
    {
      id: "u3",
      labelEn: "Mining Pool Payout",
      labelTi: "ናይ ማይኒንግ ክፍሊት",
      amount: 15000,
      isKyc: false,
      tagColor: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
    },
    {
      id: "u4",
      labelEn: "Coffee Shop Change",
      labelTi: "ናይ ካፈ ተመላሲ ሳንቲም",
      amount: 5000,
      isKyc: false,
      tagColor: "text-purple-400 border-purple-500/30 bg-purple-500/10",
    },
    {
      id: "u5",
      labelEn: "Micro-tip Dust",
      labelTi: "ደቂቕ ሳንቲም (Dust)",
      amount: 2000,
      isKyc: false,
      tagColor: "text-zinc-400 border-zinc-700 bg-zinc-800",
    },
  ];

  const [selectedIds, setSelectedIds] = useState<string[]>(["u2", "u3"]);

  const toggleUtxo = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectedUtxos = availableUtxos.filter((u) => selectedIds.includes(u.id));
  const totalInputSats = selectedUtxos.reduce((acc, u) => acc + u.amount, 0);
  const totalFeeSats = selectedUtxos.length * feePerInput;
  const changeSats = totalInputSats - invoiceTarget - totalFeeSats;
  const isSufficient = totalInputSats >= invoiceTarget + totalFeeSats;

  // Privacy evaluation: did they mix KYC and non-KYC?
  const hasKyc = selectedUtxos.some((u) => u.isKyc);
  const hasNonKyc = selectedUtxos.some((u) => !u.isKyc);
  const isTaintedMerge = hasKyc && hasNonKyc;

  return (
    <div className={panelClass}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-400">
                {t({ en: "Curriculum Interactive Activity", ti: "ናይ ትምህርቲ መስተጋብራዊ ዕዮ" }, isTi)}
              </span>
              <span className="text-xs text-zinc-400">
                {t({ en: "Coin Control & Privacy Hygiene", ti: "ምምራጽ ሳንቲማትን ምዕቃብ ውልቃውነትን" }, isTi)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100">
              {t(
                {
                  en: "The Coin Control Cockpit: Pay a 50,000 Sat Invoice",
                  ti: "ናይ ኮይን ኮንትሮል ላቦራቶሪ፦ 50,000 ሳትስ ክፍሊት ምኽፋል",
                },
                isTi
              )}
            </h3>
          </div>
        </div>
        <button
          onClick={() => setSelectedIds(["u2", "u3"])}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {t({ en: "Reset Selection", ti: "ምርጫ ምለስ" }, isTi)}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-zinc-900/60 p-3 border border-zinc-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-zinc-400">{t({ en: "Target Merchant Invoice:", ti: "ዝኽፈል መጠን፦" }, isTi)}</span>
          <span className="rounded bg-cyan-500/10 px-2.5 py-1 font-bold font-mono text-cyan-300 text-sm">
            {invoiceTarget.toLocaleString()} sats
          </span>
        </div>
        <div className="text-zinc-400">
          {t({ en: "Select specific UTXOs below to fund the payment.", ti: "ነዚ ንምኽፋል ካብ ታሕቲ ሳንቲማት ምረጽ።" }, isTi)}
        </div>
      </div>

      {/* UTXO Selection Table */}
      <div className="mt-4 space-y-2">
        {availableUtxos.map((utxo) => {
          const isSelected = selectedIds.includes(utxo.id);
          return (
            <div
              key={utxo.id}
              onClick={() => toggleUtxo(utxo.id)}
              className={`rounded-xl border p-3 flex flex-wrap items-center justify-between gap-3 cursor-pointer transition ${
                isSelected
                  ? "border-purple-500 bg-purple-950/20"
                  : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {}} // handled by div click
                  className="rounded accent-purple-500 h-4 w-4 pointer-events-none"
                />
                <div>
                  <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${utxo.tagColor}`}>
                    {isTi ? utxo.labelTi : utxo.labelEn}
                  </span>
                  <div className="text-[11px] font-mono text-zinc-500 mt-1">UTXO ID: {utxo.id}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-base font-bold font-mono text-zinc-100">
                  {utxo.amount.toLocaleString()} sats
                </div>
                <div className="text-[10px] text-zinc-400">
                  {utxo.isKyc ? t({ en: "KYC ID Tagged", ti: "መንነት ዝሓዘ" }, isTi) : t({ en: "Clean Privacy", ti: "ጽሩይ ውልቃውነት" }, isTi)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Outcome Analysis Panel */}
      <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          {t({ en: "Transaction Feasibility & Privacy Score:", ti: "ናይ ትራንዛክሽን ሚዛንን ውልቃውነትን፦" }, isTi)}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="rounded-lg bg-zinc-950 p-2.5 border border-zinc-800">
            <span className="text-[10px] text-zinc-500">{t({ en: "Total Inputs", ti: "ጠቕላላ ኢንፑት" }, isTi)}</span>
            <div className="text-sm font-bold text-zinc-200">{totalInputSats.toLocaleString()} sats</div>
          </div>
          <div className="rounded-lg bg-zinc-950 p-2.5 border border-zinc-800">
            <span className="text-[10px] text-zinc-500">{t({ en: "Network Fee", ti: "ክፍሊት መርበብ" }, isTi)}</span>
            <div className="text-sm font-bold text-amber-400">{totalFeeSats.toLocaleString()} sats</div>
          </div>
          <div className="rounded-lg bg-zinc-950 p-2.5 border border-zinc-800">
            <span className="text-[10px] text-zinc-500">{t({ en: "Change Returned", ti: "ተመላሲ ሳንቲም" }, isTi)}</span>
            <div className={`text-sm font-bold ${changeSats >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {changeSats >= 0 ? `${changeSats.toLocaleString()} sats` : "Insufficient"}
            </div>
          </div>
          <div className="rounded-lg bg-zinc-950 p-2.5 border border-zinc-800">
            <span className="text-[10px] text-zinc-500">{t({ en: "Inputs Count", ti: "በዝሒ ሳንቲማት" }, isTi)}</span>
            <div className="text-sm font-bold text-cyan-400">{selectedUtxos.length} coins</div>
          </div>
        </div>

        {/* Dynamic Privacy & Hygiene Diagnostics */}
        {isTaintedMerge ? (
          <div className="rounded-lg border border-amber-500/40 bg-amber-950/20 p-3 text-xs text-amber-300 flex items-start gap-2.5">
            <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">{t({ en: "Warning: Harmful KYC & Non-KYC Merge!", ti: "መጠንቀቕታ፦ ናይ መንነትን ናጻን ሳንቲማት ተሓዋዊሶም!" }, isTi)}</span>
              <p className="text-[11px] text-amber-200/90 mt-0.5 leading-relaxed">
                {t(
                  {
                    en: "You combined a KYC exchange coin with an anonymous P2P coin into the same transaction. Common input ownership heuristics now link your real name to your anonymous coins forever!",
                    ti: "ናይ ኤክስቸንጅ ሳንቲምን ናጻ ዝኾነ P2P ሳንቲምን ኣብ ሓደ ኣወሃሂድካዮም። ናይ ብሎክቸይን መመርመሪታት መንነትካ ምስቲ ናጻ ዝነበረ ሳንቲም ንሓዋሩ የዛምድዎ!",
                  },
                  isTi
                )}
              </p>
            </div>
          </div>
        ) : isSufficient ? (
          <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/20 p-3 text-xs text-emerald-300 flex items-start gap-2.5">
            <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">{t({ en: "Clean Coin Control Selection!", ti: "ጽሩይ ናይ ሳንቲማት ምርጫ!" }, isTi)}</span>
              <p className="text-[11px] text-emerald-200/90 mt-0.5">
                {t(
                  {
                    en: "Sufficient funds to cover the invoice and miner fee without compromising privacy or leaking identity linkages.",
                    ti: "ንክፍሊትን ንማይነርን ብቑዕ ገንዘብ ብምጥቃም፡ ውልቃውነትካ ከይተበላሸወ ብጽሬት ዝተኸፍለ።",
                  },
                  isTi
                )}
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-red-500/40 bg-red-950/20 p-3 text-xs text-red-300 flex items-start gap-2.5">
            <ShieldAlert className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">{t({ en: "Insufficient Input Balance", ti: "ዘይኣክል ባላንስ" }, isTi)}</span>
              <p className="text-[11px] text-red-200/90 mt-0.5">
                {t(
                  {
                    en: `You need at least ${(invoiceTarget + totalFeeSats).toLocaleString()} sats to cover the 50,000 sat invoice + miner fee. Select additional UTXOs.`,
                    ti: `ነቲ 50,000 ሳትስ ምስ ክፍሊት ማይነር ንምሽፋን ብውሕዱ ${(invoiceTarget + totalFeeSats).toLocaleString()} ሳትስ የድልየካ። ተወሳኺ ሳንቲም ምረጽ።`,
                  },
                  isTi
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   Module 4: Mempool Consolidation Time Machine (Section 9.2)
   Theme: "Consolidate during quiet weekends to avoid bull market fee spikes"
   ========================================================================= */

interface ConsolidationProps {
  isTi: boolean;
}

function ConsolidationTimeMachine({ isTi }: ConsolidationProps) {
  const [feeEnvironment, setFeeEnvironment] = useState<"quiet" | "congested">("quiet");
  const [isConsolidated, setIsConsolidated] = useState<boolean>(false);

  // 10 small UTXOs (10,000 sats each = 100,000 sats total)
  const totalFundsSats = 100000;
  const numSmallCoins = 10;

  // Rate in sat/vB
  const satRate = feeEnvironment === "quiet" ? 3 : 120; // 3 sat/vB vs 120 sat/vB

  // Size of spending 10 inputs (SegWit): ~680 vBytes
  const unconsolidatedVb = 680;
  // Size of spending 1 input (SegWit): ~140 vBytes
  const consolidatedVb = 140;

  // Cost to spend without consolidation
  const costWithoutConsolidationSats = unconsolidatedVb * satRate;
  // Cost to spend with 1 consolidated input
  const costWithConsolidationSats = consolidatedVb * satRate;

  // Cost to perform consolidation right now (10 in, 1 out): ~700 vBytes
  const consolidationExecutionCostSats = 700 * satRate;

  return (
    <div className={panelClass}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                {t({ en: "Section 9.2 Interactive", ti: "ክፍሊ 9.2 መስተጋብራዊ" }, isTi)}
              </span>
              <span className="text-xs text-zinc-400">
                {t({ en: "Mempool Timing & UTXO Management", ti: "ናይ ሜምፑል ግዜን ምውህሃድ ሳንቲማትን" }, isTi)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100">
              {t(
                {
                  en: "Consolidation Time Machine: Save 90%+ in Fees Before Mempools Spike",
                  ti: "ናይ ግዜ መተመኒ፦ ክፍሊት ቅድሚ ምውሳኹ 90%+ ምቑጣብ",
                },
                isTi
              )}
            </h3>
          </div>
        </div>
        <button
          onClick={() => {
            setIsConsolidated(false);
            setFeeEnvironment("quiet");
          }}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {t({ en: "Reset Simulation", ti: "ሲሙሌሽን ምለስ" }, isTi)}
        </button>
      </div>

      <p className="mt-3 text-sm text-zinc-300">
        {t(
          {
            en: "Consolidation means combining many small UTXOs into a single large UTXO during quiet periods (like weekends). If you wait until a bull market spike, spending small coins will destroy your savings in fees.",
            ti: "ምውህሃድ ማለት ኣብ ህዱእ ግዜ (ከም ቀዳመ-ሰንበት) ብዙሓት ደቂቕ ሳንቲማት ናብ ሓደ ዓቢ ሳንቲም ምቕያር ማለት እዩ። ክሳብ ክፍሊት ዝንህር እንተተጸቢኻ፡ ደቂቕ ሳንቲማት ንምጥቃም ዘድሊ ክፍሊት ንገንዘብካ ክውድኦ ይኽእል።",
          },
          isTi
        )}
      </p>

      {/* Mempool Climate Switcher */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          {t({ en: "Simulate Network Mempool Congestion:", ti: "ናይ መርበብ ጽቕጥቕጥ ኩነታት ምረጽ፦" }, isTi)}
        </span>
        <div className="flex rounded-lg bg-zinc-900 border border-zinc-800 p-1">
          <button
            onClick={() => setFeeEnvironment("quiet")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
              feeEnvironment === "quiet"
                ? "bg-emerald-500 text-zinc-950"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            {t({ en: "Quiet Weekend (3 sat/vB)", ti: "ህዱእ ቀዳመ-ሰንበት (3 sat/vB)" }, isTi)}
          </button>
          <button
            onClick={() => setFeeEnvironment("congested")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
              feeEnvironment === "congested"
                ? "bg-red-500 text-white"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Flame className="h-3.5 w-3.5" />
            {t({ en: "Bull Market Mania (120 sat/vB)", ti: "ናይ ዕዳጋ ውዕዉዕ ግዜ (120 sat/vB)" }, isTi)}
          </button>
        </div>
      </div>

      {/* Visual Coin State */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Current State */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">
              {t({ en: "Your Wallet Layout:", ti: "ናይ ዋሌትካ ቅርጺ፦" }, isTi)}
            </span>
            <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs font-mono text-zinc-300">
              {isConsolidated ? "1 Large UTXO" : `${numSmallCoins} Small Fragmented UTXOs`}
            </span>
          </div>

          {isConsolidated ? (
            <div className="rounded-xl border border-emerald-500/50 bg-emerald-950/20 p-4 text-center space-y-1">
              <span className="text-xs text-emerald-400 font-bold uppercase">{t({ en: "Consolidated Master Coin", ti: "ዝተወሃሃደ ዓቢ ሳንቲም" }, isTi)}</span>
              <div className="text-2xl font-bold font-mono text-zinc-100">
                {(totalFundsSats - consolidationExecutionCostSats).toLocaleString()} sats
              </div>
              <div className="text-[11px] text-zinc-400">
                {t({ en: "Ready to spend with only 140 vBytes of weight!", ti: "ብ140 vBytes ጥራይ ንምስዳድ ድሉው!" }, isTi)}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-1.5 p-2 bg-zinc-950 rounded-lg border border-zinc-800">
              {Array.from({ length: numSmallCoins }).map((_, i) => (
                <div
                  key={i}
                  className="rounded bg-zinc-900 border border-zinc-700/80 p-2 text-center text-[10px] font-mono text-amber-300 font-bold"
                >
                  10k
                </div>
              ))}
            </div>
          )}

          {!isConsolidated && (
            <button
              onClick={() => setIsConsolidated(true)}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500 cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              {t(
                {
                  en: `Consolidate 10 UTXOs into 1 (Cost: ${consolidationExecutionCostSats.toLocaleString()} sats)`,
                  ti: `10 ሳንቲማት ናብ 1 ኣወሃህድ (ክፍሊት፦ ${consolidationExecutionCostSats.toLocaleString()} ሳትስ)`,
                },
                isTi
              )}
            </button>
          )}
        </div>

        {/* Impact Analysis */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
          <span className="text-xs font-semibold text-zinc-400 block">
            {t({ en: "Cost to Spend Funds Right Now:", ti: "ሕጂ ነዚ ገንዘብ ንምስዳድ ዘድሊ ክፍሊት፦" }, isTi)}
          </span>

          <div className="space-y-2 text-xs font-mono">
            <div className="rounded-lg bg-zinc-950 p-2.5 border border-zinc-800 flex justify-between items-center">
              <span className="text-zinc-400">{t({ en: "Unconsolidated (10 inputs):", ti: "ዘይተወሃሃደ (10 ሳንቲማት)፦" }, isTi)}</span>
              <span className="text-red-400 font-bold">
                {costWithoutConsolidationSats.toLocaleString()} sats (${((costWithoutConsolidationSats / 100000000) * 85000).toFixed(2)})
              </span>
            </div>

            <div className="rounded-lg bg-zinc-950 p-2.5 border border-zinc-800 flex justify-between items-center">
              <span className="text-zinc-400">{t({ en: "Consolidated (1 input):", ti: "ዝተወሃሃደ (1 ሳንቲም)፦" }, isTi)}</span>
              <span className="text-emerald-400 font-bold">
                {costWithConsolidationSats.toLocaleString()} sats (${((costWithConsolidationSats / 100000000) * 85000).toFixed(2)})
              </span>
            </div>
          </div>

          {feeEnvironment === "congested" && !isConsolidated ? (
            <div className="rounded-lg border border-red-500/40 bg-red-950/20 p-2.5 text-xs text-red-300">
              <span className="font-bold">{t({ en: "Fee Disaster!", ti: "ናይ ክፍሊት ሓደጋ!" }, isTi)}</span>
              <p className="text-[11px] text-red-200/90 mt-0.5">
                {t(
                  {
                    en: `Spending your 100,000 sats now consumes ${costWithoutConsolidationSats.toLocaleString()} sats (80%+ of your total balance!) solely on miner fees.`,
                    ti: `ነቲ 100,000 ሳትስካ ሕጂ ንምስዳድ ${costWithoutConsolidationSats.toLocaleString()} ሳትስ (ካብ 80% ንላዕሊ) ብክፍሊት ማይነር ጥራይ ይጠፍእ!`,
                  },
                  isTi
                )}
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/20 p-2.5 text-xs text-emerald-300">
              <span className="font-bold">{t({ en: "Proactive Strategy:", ti: "ጥበባዊ ስትራተጂ፦" }, isTi)}</span>
              <p className="text-[11px] text-emerald-200/90 mt-0.5">
                {t(
                  {
                    en: "By consolidating when the mempool is calm (3 sat/vB), you preserve your purchasing power when fees spike later.",
                    ti: "ሜምፑል ኣብ ዝሃድኣሉ ግዜ (3 sat/vB) ብምውህሃድ፡ ጸኒሑ ክፍሊት ክውስኽ ከሎ ገንዘብካ ትዕቅብ።",
                  },
                  isTi
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   Master Component Export
   ========================================================================= */

interface Chapter9InteractiveLessonProps {
  module:
    | "utxo_lifecycle"
    | "fee_vbytes_lab"
    | "coin_control_cockpit"
    | "consolidation_time_machine";
  isTi?: boolean;
}

export function Chapter9InteractiveLesson({
  module,
  isTi = false,
}: Chapter9InteractiveLessonProps) {
  switch (module) {
    case "utxo_lifecycle":
      return <UtxoLifecycleSimulator isTi={isTi} />;
    case "fee_vbytes_lab":
      return <FeeVbytesLab isTi={isTi} />;
    case "coin_control_cockpit":
      return <CoinControlCockpit isTi={isTi} />;
    case "consolidation_time_machine":
      return <ConsolidationTimeMachine isTi={isTi} />;
    default:
      return null;
  }
}
