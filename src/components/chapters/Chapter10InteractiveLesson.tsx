"use client";

import { useState, useMemo } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  Tag,
  Copy,
  Check,
  Smartphone,
  Eye,
  EyeOff,
  Flame,
  Search,
  Sliders,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Layers,
  FileText,
  Lock,
  Unlock,
  Clipboard,
  ClipboardCheck,
  RefreshCw,
  Coins,
  Send,
  HelpCircle,
  Download,
  Split,
  Scale,
  XCircle,
} from "lucide-react";

/* ─────────── Shared helpers ─────────── */

type Localized = { en: string; ti: string };
const t = (v: Localized, isTi: boolean) => (isTi ? v.ti : v.en);

const panelClass =
  "rounded-2xl border border-zinc-800 bg-zinc-950/90 p-4 shadow-xl sm:p-6 my-6";

/* =========================================================================
   Module 1: Address Verification & Clipboard Malware Defense (Section 10.0)
   Theme: "New Receive Address Each Time; Verify on the Device"
   ========================================================================= */

interface AddressVerificationProps {
  isTi: boolean;
}

function AddressVerificationLab({ isTi }: AddressVerificationProps) {
  const genuineAddress = "bc1q9v8k7m0a4xf3298h49sljnd2q04xpeq8v601a";
  const malwareAddress = "bc1q9v8k7m0a4xf3298h49sljnd2q04xpeq8h4ckr";

  const [malwareActive, setMalwareActive] = useState<boolean>(false);
  const [copiedAddress, setCopiedAddress] = useState<string>("");
  const [copiedToast, setCopiedToast] = useState<boolean>(false);
  const [pastedAddress, setPastedAddress] = useState<string>("");
  const [decisionOutcome, setDecisionOutcome] = useState<"approved_safe" | "approved_stolen" | "rejected_saved" | "rejected_false_alarm" | null>(null);

  const handleCopy = () => {
    // If malware is active, it silently swaps the clipboard to attacker's address!
    const effective = malwareActive ? malwareAddress : genuineAddress;
    setCopiedAddress(effective);
    setCopiedToast(true);
    setDecisionOutcome(null);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  const handlePaste = () => {
    const effective = copiedAddress || (malwareActive ? malwareAddress : genuineAddress);
    setPastedAddress(effective);
    setDecisionOutcome(null);
  };

  const handleApproveSend = () => {
    if (!pastedAddress) return;
    if (pastedAddress === malwareAddress) {
      setDecisionOutcome("approved_stolen");
    } else {
      setDecisionOutcome("approved_safe");
    }
  };

  const handleRejectMismatch = () => {
    if (!pastedAddress) return;
    if (pastedAddress === malwareAddress) {
      setDecisionOutcome("rejected_saved");
    } else {
      setDecisionOutcome("rejected_false_alarm");
    }
  };

  const handleReset = () => {
    setMalwareActive(false);
    setCopiedAddress("");
    setCopiedToast(false);
    setPastedAddress("");
    setDecisionOutcome(null);
  };

  return (
    <div className={panelClass}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
            <Smartphone className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-400">
                {t({ en: "Section 10.0 Interactive", ti: "ክፍሊ 10.0 መስተጋብራዊ" }, isTi)}
              </span>
              <span className="text-xs text-zinc-400">
                {t({ en: "Trusted Display vs. Clipboard Malware", ti: "ውሑስ ስክሪንን ናይ ክሊፕቦርድ ቫይረስን" }, isTi)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100">
              {t(
                {
                  en: "Address Verification Lab: Defeat Clipboard Poisoning",
                  ti: "ላቦራቶሪ ምርግጋጽ ኣድራሻ፦ ናይ ኮምፒተር ስርቂ ምፍሻል",
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
          {t({ en: "Reset Lab", ti: "ዳግማይ ኣበግስ" }, isTi)}
        </button>
      </div>

      <p className="mt-3 text-sm text-zinc-300">
        {t(
          {
            en: "Malicious background software (clipboard clippers) can silently watch your clipboard and swap Bitcoin addresses with an attacker's lookalike. Always verify the address on your hardware device's trusted screen before sending.",
            ti: "ናይ ስርቂ ሶፍትዌር (ክሊፕቦርድ ቫይረስ) ኣብ ኮምፒተርካ ተሓቢኡ ዝተቐድሐ ኣድራሻ ብናይ ሰራቒ ኣድራሻ ብስቕታ ይቕይሮ። ኣብ ናይ ሃርድዌር መሳርሒኻ ስክሪን ብጥንቃቐ ምርጋጽ ፈጺሙ ዘይተርፍ ልምዲ እዩ።",
          },
          isTi
        )}
      </p>

      {/* Malware Attack Simulation Toggle */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className={`h-4 w-4 ${malwareActive ? "text-red-400 animate-pulse" : "text-zinc-500"}`} />
          <span className="text-xs text-zinc-300">
            {t({ en: "Simulate Trojan / Clipboard Clipper Malware:", ti: "ናይ ክሊፕቦርድ ሰራቒ ቫይረስ ፈትን፦" }, isTi)}
          </span>
        </div>
        <button
          onClick={() => {
            setMalwareActive((prev) => !prev);
            setCopiedAddress("");
            setPastedAddress("");
            setDecisionOutcome(null);
          }}
          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
            malwareActive
              ? "bg-red-500 text-white shadow-md shadow-red-500/20"
              : "bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700"
          }`}
        >
          {malwareActive
            ? t({ en: "Malware Active (Address Will Be Swapped!)", ti: "ቫይረስ ንጡፍ እዩ (ኣድራሻ ክቕየር እዩ!)" }, isTi)
            : t({ en: "Turn On Clipboard Malware", ti: "ናይ ቫይረስ መጥቃዕቲ ኣብርህ" }, isTi)}
        </button>
      </div>

      {/* Two Displays: Computer Desktop App vs Hardware Trusted Screen */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Host Computer / Desktop Wallet App */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              {t({ en: "1. Computer / Phone Screen (Untrusted)", ti: "1. ስክሪን ኮምፒተር / ስልኪ (ዘይውሑስ)" }, isTi)}
            </span>
            <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400 font-mono">
              Desktop Wallet
            </span>
          </div>

          <div>
            <span className="text-xs text-zinc-400 block mb-1">
              {t({ en: "Wallet Displayed Receive Address:", ti: "ኣብ ስክሪን ዝረአ ተቐባሊ ኣድራሻ፦" }, isTi)}
            </span>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 font-mono text-xs text-zinc-200 break-all select-all">
              {genuineAddress}
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 cursor-pointer"
          >
            {copiedToast ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            {copiedToast
              ? t({ en: "Address Copied to OS Clipboard!", ti: "ኣድራሻ ናብ ክሊፕቦርድ ተቐዲሑ!" }, isTi)
              : t({ en: "Copy Address to Clipboard", ti: "ኣድራሻ ናብ ክሊፕቦርድ ቅዳሕ" }, isTi)}
          </button>

          {/* Destination / Withdrawal Input Box */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
              <span>{t({ en: "Paste in Exchange / Sender Field:", ti: "ኣብ ኤክስቸንጅ ዝጥቀዕ ኣድራሻ፦" }, isTi)}</span>
              <button
                onClick={handlePaste}
                className="text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                {t({ en: "Paste From Clipboard", ti: "ካብ ክሊፕቦርድ ጥቃዕ" }, isTi)}
              </button>
            </div>
            <input
              type="text"
              readOnly
              value={pastedAddress}
              placeholder={t({ en: "Click 'Paste From Clipboard'...", ti: "ኣብዚ 'ካብ ክሊፕቦርድ ጥቃዕ' ጠውቕ..." }, isTi)}
              className={`w-full rounded-lg border px-3 py-2 text-xs font-mono transition ${
                pastedAddress === malwareAddress
                  ? "border-red-500 bg-red-950/20 text-red-200 font-bold"
                  : pastedAddress === genuineAddress
                  ? "border-emerald-500 bg-emerald-950/20 text-emerald-200"
                  : "border-zinc-800 bg-zinc-950 text-zinc-400"
              }`}
            />
          </div>
        </div>

        {/* Right: Hardware Signer Trusted Display Screen */}
        <div className="rounded-xl border border-cyan-500/30 bg-zinc-900/60 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <div className="flex items-center gap-1.5 text-cyan-400">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                {t({ en: "2. Hardware Signer (Trusted Screen)", ti: "2. ናይ ሃርድዌር ስክሪን (ውሑስ ሓቂ)" }, isTi)}
              </span>
            </div>
            <span className="rounded bg-cyan-500/10 px-2 py-0.5 text-[10px] text-cyan-300 font-mono">
              Offline Display
            </span>
          </div>

          <p className="text-xs text-zinc-300">
            {t(
              {
                en: "Because the hardware signer is isolated from the internet and computer OS, malware can NEVER tamper with its physical screen:",
                ti: "እዚ መሳርሒ ካብ ኢንተርነት ዝተፈልየ ብምዃኑ፡ ዝኾነ ቫይረስ ኣብዚ ስክሪን ዝረአ ጽሑፍ ክቕይሮ ኣይክእልን፦",
              },
              isTi
            )}
          </p>

          <div className="rounded-xl border border-cyan-500/40 bg-zinc-950 p-3.5 space-y-2">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">
              {t({ en: "Genuine Cryptographic Address on Device:", ti: "ኣብ መሳርሒ ዝተረጋገጸ ሓቀኛ ኣድራሻ፦" }, isTi)}
            </span>
            <div className="font-mono text-xs text-emerald-400 font-bold break-all">
              <span className="bg-emerald-500/20 px-1 py-0.5 rounded text-emerald-300 font-extrabold">
                {genuineAddress.slice(0, 8)}
              </span>
              <span>{genuineAddress.slice(8, -8)}</span>
              <span className="bg-emerald-500/20 px-1 py-0.5 rounded text-emerald-300 font-extrabold">
                {genuineAddress.slice(-8)}
              </span>
            </div>
            <div className="text-[10px] text-zinc-400 flex items-center justify-between pt-1 border-t border-zinc-800/80">
              <span>{t({ en: "First 8 chars: bc1q9v8k", ti: "ቀዳሞት 8 ፊደላት: bc1q9v8k" }, isTi)}</span>
              <span>{t({ en: "Last 8 chars: q8v601a", ti: "ዳሕሮት 8 ፊደላት: q8v601a" }, isTi)}</span>
            </div>
          </div>

          {/* Clear Decision Action: Approve or Reject */}
          {pastedAddress && (
            <div className="space-y-2 pt-1">
              <span className="text-xs text-zinc-300 block font-medium">
                {t({ en: "Compare the pasted address with your hardware screen. What do you do?", ti: "እቲ ዝጠቐዕካዮ ኣድራሻ ምስ ናይ ሃርድዌር ስክሪን ኣረኣእዮ። እንታይ ትገብር?" }, isTi)}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleApproveSend}
                  className="rounded-lg border border-emerald-500/50 bg-emerald-950/40 py-2.5 px-2 text-xs font-bold text-emerald-300 hover:bg-emerald-900/50 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  {t({ en: "Approve & Send", ti: "ኣጽድቕን ስደድን" }, isTi)}
                </button>
                <button
                  onClick={handleRejectMismatch}
                  className="rounded-lg border border-red-500/50 bg-red-950/40 py-2.5 px-2 text-xs font-bold text-red-300 hover:bg-red-900/50 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  {t({ en: "Reject (Mismatch!)", ti: "ንጸግ (ኣይሰማማዕን!)" }, isTi)}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Verification Feedback Banner */}
      {decisionOutcome && (
        <div
          className={`mt-4 rounded-xl border p-4 flex items-start gap-3 ${
            decisionOutcome === "approved_stolen"
              ? "border-red-500/60 bg-red-950/30 text-red-300"
              : decisionOutcome === "rejected_saved"
              ? "border-emerald-500/60 bg-emerald-950/30 text-emerald-300"
              : decisionOutcome === "approved_safe"
              ? "border-emerald-500/60 bg-emerald-950/30 text-emerald-300"
              : "border-amber-500/60 bg-amber-950/30 text-amber-300"
          }`}
        >
          {decisionOutcome === "approved_stolen" ? (
            <>
              <ShieldAlert className="h-6 w-6 text-red-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <span className="font-bold text-red-300 text-sm">
                  {t({ en: "CRITICAL FAILURE: Funds Stolen by Hacker!", ti: "ሓደገኛ ውድቀት፦ ገንዘብካ ብሰራቒ ተሰሪቑ!" }, isTi)}
                </span>
                <p className="text-red-200/90 leading-relaxed">
                  {t(
                    {
                      en: "You clicked 'Approve & Send', but the clipboard malware had secretly swapped the address to the attacker's lookalike (ending in 'h4ckr'). Because you didn't check the hardware screen's last 8 characters, your Bitcoin was sent to the attacker irreversibly!",
                      ti: "ኣጽዲቕካ ሰዲድካዮ፡ ግን እቲ ክሊፕቦርድ ቫይረስ ነቲ ኣድራሻ ብናይ ሰራቒ ኣድራሻ ('h4ckr') ቀይርዎ ነይሩ። ናይ ሃርድዌርካ ስክሪን ከየረጋገጽካ ብምስዳድካ ቢትኮይንካ ንሓዋሩ ተሰሪቑ!",
                    },
                    isTi
                  )}
                </p>
              </div>
            </>
          ) : decisionOutcome === "rejected_saved" ? (
            <>
              <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <span className="font-bold text-emerald-300 text-sm">
                  {t({ en: "ATTACK DEFEATED! Funds Saved by Hardware Screen Check!", ti: "መጥቃዕቲ ፈሺሉ! ብምርግጋጽካ ገንዘብካ ድሒኑ!" }, isTi)}
                </span>
                <p className="text-zinc-200 leading-relaxed">
                  {t(
                    {
                      en: "Clipboard malware swapped the address to the attacker's fake address ending in 'h4ckr'. Because you checked your hardware device screen and noticed the mismatch, you rejected the payment before any coins were lost!",
                      ti: "እቲ ቫይረስ ነቲ ኣድራሻ ብናይ ሰራቒ ኣድራሻ ('h4ckr') ቀይርዎ ነይሩ። ኣብ ናይ ሃርድዌር ስክሪን ብምርኣይካ ዘይምስምማዕ ኣስተውዒልካ ነቲ ክፍሊት ኣፍሺልካዮ!",
                    },
                    isTi
                  )}
                </p>
              </div>
            </>
          ) : decisionOutcome === "approved_safe" ? (
            <>
              <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <span className="font-bold text-emerald-300 text-sm">
                  {t({ en: "Clean & Safe Transaction Broadcasted!", ti: "ጽሩይን ውሑስን ክፍሊት ተሰዲዱ!" }, isTi)}
                </span>
                <p className="text-zinc-200">
                  {t(
                    {
                      en: "The address pasted matched your hardware screen exactly ('q8v601a'). Safe Bitcoin hygiene confirmed.",
                      ti: "እቲ ዝጠቐዕካዮ ኣድራሻ ምስ ናይ ሃርድዌር ስክሪን ልክዕ ተሰማሚዑ ('q8v601a')። ውሑስ ናይ ቢትኮይን ጽሬት ተረጋጊጹ።",
                    },
                    isTi
                  )}
                </p>
              </div>
            </>
          ) : (
            <>
              <AlertTriangle className="h-6 w-6 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <span className="font-bold text-amber-300 text-sm">
                  {t({ en: "False Alarm (Address was actually genuine)", ti: "ጌጋ መጠንቀቕታ (እቲ ኣድራሻ ሓቀኛ እዩ ነይሩ)" }, isTi)}
                </span>
                <p className="text-zinc-200">
                  {t(
                    {
                      en: "The pasted address was actually your genuine hardware address. However, being overly cautious is always better than sending blindly!",
                      ti: "እቲ ኣድራሻ ብሓቂ ናትካ ሓቀኛ ኣድራሻ እዩ ነይሩ። ይኹን እምበር ብዕዉር ካብ ምስዳድ ጥንቁቕ ምዃን ወትሩ ዝሓሸ እዩ!",
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
  );
}

/* =========================================================================
   Module 2: Understanding Transaction Size & UTXO Flowchart (Section 10.1)
   Theme: "Understanding Transaction Size: Transaction A vs Transaction B"
   (Directly modeled on the uploaded mempool.space infographic)
   ========================================================================= */

interface UtxoSizeFlowchartProps {
  isTi: boolean;
}

function UtxoSizeFlowchartAndLabeling({ isTi }: UtxoSizeFlowchartProps) {
  const [sliderInputs, setSliderInputs] = useState<number>(3);
  const [activeTab, setActiveTab] = useState<"flowchart" | "journal">("flowchart");

  // Dynamic vBytes calculation
  const calculatedVb = 10 + sliderInputs * 68 + 2 * 31; // Native SegWit
  const calculatedSatFee = calculatedVb * 20; // 20 sat/vB
  const calculatedUsdFee = (calculatedSatFee / 100000000) * 85000;

  return (
    <div className={panelClass}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-400">
                {t({ en: "Section 10.1 Interactive", ti: "ክፍሊ 10.1 መስተጋብራዊ" }, isTi)}
              </span>
              <span className="text-xs text-zinc-400">
                {t({ en: "Mempool Transaction Size & UTXO Bundles", ti: "ናይ ትራንዛክሽን ስፍሓትን ሳንቲማትን" }, isTi)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100">
              {t(
                {
                  en: "Understanding Transaction Size: Why Input Count Dictates Fees",
                  ti: "ናይ ትራንዛክሽን ስፍሓት ምርዳእ፦ ስለምንታይ በዝሒ ሳንቲማት ክፍሊት ይውስን",
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
            en: "Why is labeling and managing UTXOs so important? Because Bitcoin fees depend on virtual size (vBytes), not amount. Compare Transaction A (clean, 3 inputs) with Transaction B (bloated, 17 dust inputs) below:",
            ti: "ንUTXOs ምልክት ምግባርን ምምሕዳርን ስለምንታይ ኣገዳሲ ኮይኑ? ናይ ቢትኮይን ክፍሊት ኣብ ናይ ዳታ ስፍሓት (vBytes) እምበር ኣብ መጠን ገንዘብ ስለዘይተመርኮሰ እዩ። ትራንዛክሽን Aን ትራንዛክሽን Bን ኣነጻጽር፦",
          },
          isTi
        )}
      </p>

      {/* Tabs */}
      <div className="mt-4 flex flex-wrap gap-2 border-b border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab("flowchart")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
            activeTab === "flowchart"
              ? "bg-purple-500 text-white shadow-sm"
              : "bg-zinc-900 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Split className="h-3.5 w-3.5" />
          {t({ en: "1. Transaction Size Flowchart (Tx A vs Tx B)", ti: "1. ናይ ትራንዛክሽን ስፍሓት ፍሰት (Tx A vs Tx B)" }, isTi)}
        </button>
        <button
          onClick={() => setActiveTab("journal")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
            activeTab === "journal"
              ? "bg-purple-500 text-white shadow-sm"
              : "bg-zinc-900 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Tag className="h-3.5 w-3.5" />
          {t({ en: "2. UTXO Labeling & Prevention Journal", ti: "2. መዝገብ ምልክትን መከላከልን" }, isTi)}
        </button>
      </div>

      {activeTab === "flowchart" && (
        <div className="mt-4 space-y-5">
          {/* Side by side comparison: Transaction A vs Transaction B matching user's image */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Transaction A Card */}
            <div className="rounded-2xl border border-cyan-500/40 bg-zinc-950 p-4 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-xs font-bold text-cyan-300">
                    Transaction A (Lean & Clean)
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">Credit: mempool.space</span>
              </div>

              {/* Graphic Flow Representation */}
              <div className="relative rounded-xl border border-zinc-800 bg-black p-4 flex items-center justify-between">
                {/* 3 Input streams */}
                <div className="space-y-2 w-1/3">
                  <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase mb-1">
                    Input UTXOs (3)
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="h-1.5 w-full rounded-full bg-cyan-500/70" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="h-1.5 w-full rounded-full bg-cyan-500/70" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="h-1.5 w-full rounded-full bg-cyan-500/70" />
                  </div>
                </div>

                {/* Funnel Center */}
                <div className="flex flex-col items-center justify-center px-3">
                  <div className="rounded-full border border-cyan-500/50 bg-cyan-950/60 p-2.5 text-cyan-300 shadow-md">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 mt-1">258 vB</span>
                </div>

                {/* 2 Output streams */}
                <div className="space-y-3 w-1/3 text-right">
                  <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase mb-1">
                    Outputs (2)
                  </div>
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="h-1.5 w-full rounded-full bg-emerald-500/70" />
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="h-1.5 w-full rounded-full bg-emerald-500/70" />
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  </div>
                </div>
              </div>

              {/* Exact Stats matching uploaded image */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                <div className="rounded bg-zinc-900/80 p-2">
                  <span className="text-[10px] text-zinc-400 block">{t({ en: "Number of UTXO Inputs:", ti: "በዝሒ ኢንፑትስ፦" }, isTi)}</span>
                  <span className="text-zinc-100 font-bold text-sm">3 inputs</span>
                </div>
                <div className="rounded bg-zinc-900/80 p-2">
                  <span className="text-[10px] text-zinc-400 block">{t({ en: "Transaction Size:", ti: "ናይ ዳታ ስፍሓት፦" }, isTi)}</span>
                  <span className="text-cyan-400 font-bold text-sm">258 virtual bytes</span>
                </div>
                <div className="rounded bg-zinc-900/80 p-2">
                  <span className="text-[10px] text-zinc-400 block">{t({ en: "Transaction Amt:", ti: "ዝተላእከ መጠን፦" }, isTi)}</span>
                  <span className="text-zinc-100 font-bold text-sm">0.26 BTC ($22.1k)</span>
                </div>
                <div className="rounded bg-zinc-900/80 p-2 border border-emerald-500/30">
                  <span className="text-[10px] text-emerald-400 block font-bold">{t({ en: "Transaction Fee:", ti: "ክፍሊት፦" }, isTi)}</span>
                  <span className="text-emerald-300 font-bold text-sm">$6.63 USD (0.03%)</span>
                </div>
              </div>
            </div>

            {/* Transaction B Card */}
            <div className="rounded-2xl border border-red-500/40 bg-zinc-950 p-4 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-red-500/20 px-2 py-0.5 text-xs font-bold text-red-300">
                    Transaction B (Bloated Dust Trap)
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">Credit: mempool.space</span>
              </div>

              {/* Graphic Flow Representation */}
              <div className="relative rounded-xl border border-zinc-800 bg-black p-4 flex items-center justify-between">
                {/* 17 Input streams crowded */}
                <div className="space-y-0.5 w-1/3 max-h-[85px] overflow-hidden pr-1">
                  <div className="text-[10px] font-mono text-red-400 font-bold uppercase mb-1">
                    Input UTXOs (17)
                  </div>
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                      <span className="h-1 w-full rounded-full bg-red-500/60" />
                    </div>
                  ))}
                  <span className="text-[9px] text-red-400 italic block mt-0.5">+ 8 more inputs...</span>
                </div>

                {/* Funnel Center */}
                <div className="flex flex-col items-center justify-center px-3">
                  <div className="rounded-full border border-red-500/50 bg-red-950/60 p-2.5 text-red-300 shadow-md">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono text-red-400 mt-1 font-bold">1,570 vB</span>
                </div>

                {/* 2 Output streams */}
                <div className="space-y-3 w-1/3 text-right">
                  <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase mb-1">
                    Outputs (2)
                  </div>
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="h-1.5 w-full rounded-full bg-emerald-500/70" />
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="h-1.5 w-full rounded-full bg-emerald-500/70" />
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  </div>
                </div>
              </div>

              {/* Exact Stats matching uploaded image */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                <div className="rounded bg-zinc-900/80 p-2">
                  <span className="text-[10px] text-zinc-400 block">{t({ en: "Number of UTXO Inputs:", ti: "በዝሒ ኢንፑትስ፦" }, isTi)}</span>
                  <span className="text-red-400 font-bold text-sm">17 inputs</span>
                </div>
                <div className="rounded bg-zinc-900/80 p-2">
                  <span className="text-[10px] text-zinc-400 block">{t({ en: "Transaction Size:", ti: "ናይ ዳታ ስፍሓት፦" }, isTi)}</span>
                  <span className="text-red-400 font-bold text-sm">1,570 virtual bytes</span>
                </div>
                <div className="rounded bg-zinc-900/80 p-2">
                  <span className="text-[10px] text-zinc-400 block">{t({ en: "Transaction Amt:", ti: "ዝተላእከ መጠን፦" }, isTi)}</span>
                  <span className="text-zinc-100 font-bold text-sm">0.15 BTC ($12.7k)</span>
                </div>
                <div className="rounded bg-zinc-900/80 p-2 border border-red-500/40 bg-red-950/20">
                  <span className="text-[10px] text-red-400 block font-bold">{t({ en: "Transaction Fee:", ti: "ክፍሊት፦" }, isTi)}</span>
                  <span className="text-red-300 font-bold text-sm">$61.37 USD (10x higher!)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Insight Takeaway */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200 flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300">
                {t({ en: "The Core Lesson from Mempool Data:", ti: "ቀንዲ ትምህርቲ ካብዚ ዳታ፦" }, isTi)}
              </span>
              <p className="mt-1 leading-relaxed text-zinc-300">
                {t(
                  {
                    en: "Transaction B sent 40% LESS money than Transaction A, yet paid nearly 10X HIGHER in fees! Why? Because Transaction B pulled in 17 tiny fragmented coins. Labeling your UTXOs ensures you know your coin sizes and avoid accidentally bundling 17 micro-coins during fee spikes.",
                    ti: "ትራንዛክሽን B ካብ ትራንዛክሽን A ብ40% ዝወሓደ ገንዘብ እናሰደደ፡ ብ10 ዕጽፊ ዝለዓለ ክፍሊት ከፊሉ! ስለምንታይ? 17 ደቂቕ ሳንቲማት ስለዝሓወሰ እዩ። ንሳንቲማትካ ምልክት ምግባር ዓቐኖም ንኽትፈልጥን ኣብ ናይ ክፍሊት ንህረት ከይትውሓጥን ይሕግዘካ።",
                  },
                  isTi
                )}
              </p>
            </div>
          </div>

          {/* Interactive Pipe Funnel Slider */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5" />
                {t({ en: "Interactive Pipe Funnel Simulator: Test Input Count Weight", ti: "ናይ መስመር ፈተነ፦ በዝሒ ሳንቲማት ክፍሊት ከመይ ከምዝውስኽ ፈትን" }, isTi)}
              </span>
              <span className="font-mono text-xs text-purple-300 font-bold">
                {sliderInputs} {sliderInputs === 1 ? "Input UTXO" : "Input UTXOs"}
              </span>
            </div>

            <input
              type="range"
              min={1}
              max={25}
              value={sliderInputs}
              onChange={(e) => setSliderInputs(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />

            <div className="grid grid-cols-3 gap-2 text-xs font-mono pt-1 text-center">
              <div className="rounded-lg bg-zinc-950 p-2 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block uppercase">Weight</span>
                <span className="text-zinc-100 font-bold">{calculatedVb} vBytes</span>
              </div>
              <div className="rounded-lg bg-zinc-950 p-2 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block uppercase">Sat Fee (20 sat/vB)</span>
                <span className="text-amber-400 font-bold">{calculatedSatFee.toLocaleString()} sats</span>
              </div>
              <div className="rounded-lg bg-zinc-950 p-2 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block uppercase">USD Fee</span>
                <span className={`font-bold ${sliderInputs > 10 ? "text-red-400" : "text-emerald-400"}`}>
                  ${calculatedUsdFee.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "journal" && (
        <div className="mt-4 space-y-4">
          <p className="text-xs text-zinc-400 leading-relaxed">
            {t(
              {
                en: "Label your incoming UTXOs below with their source and amount. When you spend later, your wallet UI will clearly show you which coins are large and safe to spend without triggering Transaction B's 17-input bloat:",
                ti: "ኣብ ታሕቲ ንዘለዉ ሳንቲማትካ ምልክት ግበረሎም። ጸኒሕካ ክትከፍል ከለኻ ናይ ትራንዛክሽን B ዓይነት 17 ሳንቲማት ናይ ምሕዋስ ጌጋ ከይትገብር ብንጹር ይሕግዘካ፦",
              },
              isTi
            )}
          </p>

          <div className="space-y-2.5">
            {[
              { id: "u-1", txid: "4c1a...89bf", btc: "0.25 BTC", sat: "25,000,000 sats", defaultLabel: "Exchange DCA Purchase (Large UTXO)", tag: "Large UTXO (Safe)" },
              { id: "u-2", txid: "7f29...a10e", btc: "0.005 BTC", sat: "500,000 sats", defaultLabel: "P2P Tutoring Income", tag: "Medium UTXO" },
              { id: "u-3", txid: "3e01...99cd", btc: "0.0001 BTC", sat: "10,000 sats", defaultLabel: "Micro Faucet Dust (Do not spend alone!)", tag: "Dust UTXO" },
            ].map((u) => (
              <div key={u.id} className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-zinc-400 font-semibold">{u.txid}</span>
                    <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-purple-300 font-mono">
                      {u.tag}
                    </span>
                  </div>
                  <div className="font-mono text-xs text-zinc-200 mt-1 font-bold">
                    {u.btc} ({u.sat})
                  </div>
                </div>

                <div className="w-full sm:w-1/2">
                  <input
                    type="text"
                    defaultValue={u.defaultLabel}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-200 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   Module 3: Payment Flow & Cluster Defense Simulator (Section 10.2)
   Theme: "Basic Privacy Habits (Avoid Reuse; Payment Flow Awareness)"
   ========================================================================= */

interface PaymentFlowProps {
  isTi: boolean;
}

function PaymentFlowSimulator({ isTi }: PaymentFlowProps) {
  const [strategy, setStrategy] = useState<"toxic_merge" | "clean_split">("toxic_merge");

  return (
    <div className={panelClass}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-400">
                {t({ en: "Section 10.2 Interactive", ti: "ክፍሊ 10.2 መስተጋብራዊ" }, isTi)}
              </span>
              <span className="text-xs text-zinc-400">
                {t({ en: "Common Input Ownership Heuristic", ti: "ናይ ብሎክቸይን መመርመሪን ሓባራዊ ዋንነትን" }, isTi)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100">
              {t(
                {
                  en: "Payment Flow Simulator: Preventing Blockchain Identity Clusters",
                  ti: "ናይ ክፍሊት ዋሕዚ ሲሙሌተር፦ መንነትካ ኣብ ብሎክቸይን ከይጋላሕ ምዕቃብ",
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
            en: "When you send Bitcoin using multiple UTXOs at once, blockchain analytics software assumes all inputs belong to the same person (Common Input Ownership Heuristic). Observe what an outside surveillance spy sees under both strategies:",
            ti: "ብዙሓት ሳንቲማት ኣብ ሓደ ትራንዛክሽን ሓዊስካ ክትከፍል ከለኻ፡ ናይ ብሎክቸይን ተቖጻጸርቲ ኩሎም ሳንቲማት ናይ ሓደ ሰብ ምዃኖም ይፈልጡ። ኣብ ክልቲኡ ስትራተጂታት እንታይ ከም ዝረአ ተዓዘብ፦",
          },
          isTi
        )}
      </p>

      {/* Strategy selector */}
      <div className="mt-4 flex rounded-xl border border-zinc-800 bg-zinc-900/60 p-1 w-fit">
        <button
          onClick={() => setStrategy("toxic_merge")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
            strategy === "toxic_merge"
              ? "bg-red-500 text-white shadow-sm"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          {t({ en: "Careless Merge (Toxic Flow)", ti: "ዕሹኽ ምትሕውዋስ (ሓደገኛ)" }, isTi)}
        </button>
        <button
          onClick={() => setStrategy("clean_split")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
            strategy === "clean_split"
              ? "bg-emerald-500 text-zinc-950 shadow-sm"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          {t({ en: "Isolated Coin Control (Clean)", ti: "ዝተፈልየ ሳንቲም ምጥቃም (ውሑስ)" }, isTi)}
        </button>
      </div>

      {/* Visual Cluster Diagram */}
      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-4">
        {strategy === "toxic_merge" ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-red-400">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" />
                {t({ en: "Surveillance Outcome: Identity Cluster Expanded!", ti: "ናይ ተቖጻጻሪ ውጽኢት፦ መንነትካ ምሉእ ብምሉእ ተጋሊሑ!" }, isTi)}
              </span>
              <span className="rounded bg-red-950/60 px-2 py-0.5 text-[10px] font-bold text-red-400 uppercase">
                Privacy Leaked
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="rounded-xl border border-red-500/40 bg-red-950/20 p-3 space-y-1">
                <span className="text-[10px] text-zinc-400 uppercase font-mono">{t({ en: "Input 1", ti: "ሳንቲም 1" }, isTi)}</span>
                <div className="font-bold text-zinc-200">{t({ en: "Exchange Buy (KYC)", ti: "ካብ ኤክስቸንጅ (መንነት ዝሓዘ)" }, isTi)}</div>
                <div className="text-[11px] text-red-400">{t({ en: "Alice's National Passport ID", ti: "ናይ ኣሊስ ፓስፖርት" }, isTi)}</div>
              </div>

              <div className="rounded-xl border border-red-500/40 bg-red-950/20 p-3 space-y-1">
                <span className="text-[10px] text-zinc-400 uppercase font-mono">{t({ en: "Input 2", ti: "ሳንቲም 2" }, isTi)}</span>
                <div className="font-bold text-zinc-200">{t({ en: "P2P Cash (Private)", ti: "ናይ ጥረ ገንዘብ (ምስጢራዊ)" }, isTi)}</div>
                <div className="text-[11px] text-red-400">{t({ en: "Anonymous In-Person Cash", ti: "ስም ዘይብሉ ዝነበረ" }, isTi)}</div>
              </div>

              <div className="rounded-xl border border-red-600 bg-red-950/40 p-3 space-y-1">
                <span className="text-[10px] text-red-400 uppercase font-bold">{t({ en: "Analytics Finding", ti: "ናይ ተቖጻጻሪ መደምደምታ" }, isTi)}</span>
                <div className="font-bold text-red-200">{t({ en: "Merged in 1 Transaction!", ti: "ኣብ ሓደ ክፍሊት ተሓዊሶም!" }, isTi)}</div>
                <div className="text-[11px] text-zinc-300">
                  {t(
                    {
                      en: "Chainalysis now flags Alice as the permanent owner of the anonymous P2P coins.",
                      ti: "ኣሊስ ናይቲ ስም ዘይነበሮ ናይ ጥረ ገንዘብ ሳንቲም ወናኒት ምዃና ብቐሊሉ ተፈሊጡ።",
                    },
                    isTi
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                {t({ en: "Surveillance Outcome: Total Cluster Isolation", ti: "ናይ ተቖጻጻሪ ውጽኢት፦ መንነትካ ብጽሬት ተሓልዩ!" }, isTi)}
              </span>
              <span className="rounded bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-400 uppercase">
                Privacy Preserved
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-3 space-y-1">
                <span className="text-[10px] text-zinc-400 uppercase font-mono">{t({ en: "Payment UTXO", ti: "ዝተኸፍለ ሳንቲም" }, isTi)}</span>
                <div className="font-bold text-zinc-200">{t({ en: "Single P2P Coin Spent", ti: "1 ናጻ ሳንቲም ጥራይ ተጠቒምካ" }, isTi)}</div>
                <div className="text-[11px] text-emerald-400">{t({ en: "Paid merchant directly", ti: "ቀጥታ ንነጋዳይ ተኸፊሉ" }, isTi)}</div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 space-y-1">
                <span className="text-[10px] text-zinc-400 uppercase font-mono">{t({ en: "Isolated UTXO", ti: "ዝተፈልየ ሳንቲም" }, isTi)}</span>
                <div className="font-bold text-zinc-200">{t({ en: "KYC Coin Left Alone", ti: "ናይ KYC ሳንቲም ኣይተተንከፈን" }, isTi)}</div>
                <div className="text-[11px] text-zinc-400">{t({ en: "Never co-spent or linked", ti: "ፈጺሙ ኣይተሓወሰን" }, isTi)}</div>
              </div>

              <div className="rounded-xl border border-emerald-600 bg-emerald-950/40 p-3 space-y-1">
                <span className="text-[10px] text-emerald-400 uppercase font-bold">{t({ en: "Analytics Finding", ti: "ናይ ተቖጻጻሪ መደምደምታ" }, isTi)}</span>
                <div className="font-bold text-emerald-200">{t({ en: "No Linkage Possible", ti: "ምትእስሳር ፈጺሙ ኣይከኣልን" }, isTi)}</div>
                <div className="text-[11px] text-zinc-300">
                  {t(
                    {
                      en: "The merchant and outside observers learn nothing about Alice's other balances or real-world identity.",
                      ti: "እቲ ነጋዳይን ተዓዘብትን ብዛዕባ ካልእ ዘለዋ ገንዘብ ወይ መንነት ዝፈልጥዎ ነገር የለን።",
                    },
                    isTi
                  )}
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
   Module 4: Hygiene Checklist Audit on a Demo Wallet (Activity - Section 10.2)
   Theme: "Perform a Hygiene Checklist Audit on a Demo Wallet"
   ========================================================================= */

interface HygieneAuditProps {
  isTi: boolean;
}

interface AuditQuestion {
  id: string;
  questionEn: string;
  questionTi: string;
  optionsEn: string[];
  optionsTi: string[];
  correctIndex: number;
  explanationEn: string;
  explanationTi: string;
}

function HygieneAuditChecklist({ isTi }: HygieneAuditProps) {
  const auditQuestions: AuditQuestion[] = [
    {
      id: "q1",
      questionEn: "Transaction #104 receives funds into an address that was already used 3 times in past weeks. What is the hygiene rating?",
      questionTi: "ትራንዛክሽን #104 ቅድሚ ሕጂ 3 ግዜ ኣብ ዝተጠቕመ ኣድራሻ ገንዘብ ተቐቢሉ ኣሎ። ናይዚ ግምገማ እንታይ እዩ?",
      optionsEn: [
        "Dangerous: Address reuse links multiple transactions and destroys privacy",
        "Safe: Reusing addresses saves network fees and block space",
        "Recommended: It is easier to remember a single address",
      ],
      optionsTi: [
        "ሓደገኛ፦ ተደጋጋሚ ኣድራሻ ምጥቃም ንክፍሊታት ኣተኣሳሲሩ ውልቃውነት የጥፍእ",
        "ውሑስ፦ ኣድራሻ ምድጋም ክፍሊት መርበብ ይቑጥብ",
        "ዝምከር፦ ሓደ ኣድራሻ ጥራይ ምሓዝ ዝቐለለ እዩ",
      ],
      correctIndex: 0,
      explanationEn: "Address reuse is a primary cause of on-chain privacy loss. Every receive must generate a brand new address.",
      explanationTi: "ተደጋጋሚ ኣድራሻ ምጥቃም ናይ ውልቃውነት ቀዳማይ ጸላኢ እዩ። ኣብ ነፍሲ ወከፍ እዋን ሓድሽ ኣድራሻ ክትጥቀም ኣለካ።",
    },
    {
      id: "q2",
      questionEn: "A student copies a withdrawal address from their laptop and immediately sends funds without looking at their hardware screen. What risk occurred?",
      questionTi: "ሓደ ተምሃራይ ኣብ ኮምፒተሩ ዘሎ ኣድራሻ ቅዲሑ ናብ ናይ ሃርድዌር ስክሪን ከይረኣየ ቀጥታ ሰዲዱ። እንታይ ስግኣት ተፈጢሩ?",
      optionsEn: [
        "Vulnerable to clipboard malware swapping the address with a hacker's address",
        "None: Copy-paste is 100% cryptographically guaranteed",
        "It slows down confirmation time by 10 minutes",
      ],
      optionsTi: [
        "ናይ ክሊፕቦርድ ቫይረስ ነቲ ኣድራሻ ብናይ ሰራቒ ኣድራሻ ናይ ምቕያር ሓደጋ ኣለዎ",
        "ስግኣት የለን፦ ኮፒ-ፔስት 100% ውሑስ እዩ",
        "ናይቲ ብሎክ ግዜ ብ10 ደቒቕ የደናጉዮ",
      ],
      correctIndex: 0,
      explanationEn: "Malware can compromise the host OS clipboard. Only the hardware screen represents the authentic offline truth.",
      explanationTi: "ኣብ ኮምፒተር ዘሎ ክሊፕቦርድ ብቫይረስ ክስረቕ ይኽእል እዩ። እቲ ናይ ሃርድዌር ስክሪን ጥራይ እዩ ናይ ሓቂ ውሑስ መረጋገጺ።",
    },
    {
      id: "q3",
      questionEn: "Why is immediate labeling of UTXOs considered essential Bitcoin hygiene?",
      questionTi: "ንዝተቐበልካዮም ሳንቲማት (UTXOs) ቀልጢፍካ ምልክት ምግባር ስለምንታይ እዩ ኣገዳሲ ዝኸውን?",
      optionsEn: [
        "It prevents accidental merging of KYC and non-KYC coins during future spends",
        "The Bitcoin blockchain requires labels to mine blocks",
        "It increases the interest rate paid by your wallet",
      ],
      optionsTi: [
        "ኣብ መጻኢ ክፍሊታት መንነት ዘለዎምን ናጻ ዝኾኑን ሳንቲማት ከይሕወሱ ይከላኸል",
        "ብሎክ ንምዕሻው ናይ ግድን ምልክታት የድልዩ እዮም",
        "ዋሌትካ ዝኸፍሎ ናይ ወለድ መጠን ይውስኽ",
      ],
      correctIndex: 0,
      explanationEn: "Labels give you context when making coin control decisions months or years later.",
      explanationTi: "ምልክታት ድሕሪ ኣዋርሕ ወይ ዓመታት ሳንቲማት ክትመርጽ ከለኻ ናይ ነፍሲ ወከፍ ሳንቲም ታሪኽ ክትፈልጥ የኽእሉኻ።",
    },
  ];

  const [answers, setAnswers] = useState<Record<string, number>>({});

  const handleSelect = (qId: string, optIdx: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const score = useMemo(() => {
    let correct = 0;
    auditQuestions.forEach((q) => {
      if (answers[q.id] === q.correctIndex) correct++;
    });
    return Math.round((correct / auditQuestions.length) * 100);
  }, [answers]);

  const handleReset = () => {
    setAnswers({});
  };

  return (
    <div className={panelClass}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <ClipboardCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                {t({ en: "Curriculum Interactive Activity", ti: "ናይ ትምህርቲ መስተጋብራዊ ዕዮ" }, isTi)}
              </span>
              <span className="text-xs text-zinc-400">
                {t({ en: "Hygiene Checklist Audit on a Demo Wallet", ti: "ናይ ዲሞ ዋሌት ናይ ጽሬት ኦዲት" }, isTi)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100">
              {t(
                {
                  en: "Hygiene Audit Checklist: Test Your Security & Privacy IQ",
                  ti: "ናይ ጽሬት ኦዲት፦ ናይ ድሕነትን ውልቃውነትን ፍልጠትካ ፈትን",
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
          {t({ en: "Reset Audit", ti: "ኦዲት ምለስ" }, isTi)}
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-xl bg-zinc-900/60 p-3 border border-zinc-800 text-xs">
        <span className="text-zinc-400">
          {t({ en: "Current Hygiene Rating:", ti: "ናይ ሕጂ ናይ ጽሬት ደረጃ፦" }, isTi)}
        </span>
        <span
          className={`font-mono font-bold text-sm ${
            score === 100
              ? "text-emerald-400"
              : score > 50
              ? "text-amber-400"
              : "text-zinc-400"
          }`}
        >
          {Object.keys(answers).length > 0 ? `${score}% Hygiene Score` : "Not Started"}
        </span>
      </div>

      {/* Questions list */}
      <div className="mt-4 space-y-4">
        {auditQuestions.map((q, qIdx) => {
          const selected = answers[q.id];
          const isAnswered = selected !== undefined;
          const isCorrect = selected === q.correctIndex;

          return (
            <div
              key={q.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3"
            >
              <div className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold text-zinc-300">
                  {qIdx + 1}
                </span>
                <span className="text-xs font-semibold text-zinc-200">
                  {isTi ? q.questionTi : q.questionEn}
                </span>
              </div>

              <div className="space-y-2 pl-7">
                {(isTi ? q.optionsTi : q.optionsEn).map((opt, optIdx) => {
                  const isOptionSelected = selected === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelect(q.id, optIdx)}
                      className={`w-full rounded-lg border p-2.5 text-left text-xs transition cursor-pointer ${
                        isOptionSelected
                          ? isCorrect
                            ? "border-emerald-500 bg-emerald-950/30 text-emerald-200 font-semibold"
                            : "border-red-500 bg-red-950/30 text-red-200 font-semibold"
                          : "border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div
                  className={`mt-2 rounded-lg p-2.5 text-[11px] pl-7 ${
                    isCorrect
                      ? "bg-emerald-950/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-red-950/20 text-red-300 border border-red-500/30"
                  }`}
                >
                  <span className="font-bold">
                    {isCorrect
                      ? t({ en: "✓ Correct Hygiene Standard: ", ti: "✓ ቅኑዕ ናይ ጽሬት መምርሒ፦ " }, isTi)
                      : t({ en: "✕ Hygiene Risk Detected: ", ti: "✕ ናይ ጽሬት ሓደጋ ተረኺቡ፦ " }, isTi)}
                  </span>
                  {isTi ? q.explanationTi : q.explanationEn}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================================
   Master Component Export
   ========================================================================= */

interface Chapter10InteractiveLessonProps {
  module:
    | "address_verification_lab"
    | "utxo_labeling_workbench"
    | "payment_flow_simulator"
    | "hygiene_audit_checklist";
  isTi?: boolean;
}

export function Chapter10InteractiveLesson({
  module,
  isTi = false,
}: Chapter10InteractiveLessonProps) {
  switch (module) {
    case "address_verification_lab":
      return <AddressVerificationLab isTi={isTi} />;
    case "utxo_labeling_workbench":
      return <UtxoSizeFlowchartAndLabeling isTi={isTi} />;
    case "payment_flow_simulator":
      return <PaymentFlowSimulator isTi={isTi} />;
    case "hygiene_audit_checklist":
      return <HygieneAuditChecklist isTi={isTi} />;
    default:
      return null;
  }
}
