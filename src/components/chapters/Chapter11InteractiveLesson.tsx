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
  HardDrive,
  Key,
  Laptop,
  Radio,
  QrCode,
  CheckSquare,
  ChevronRight,
  Cpu,
  Wifi,
  WifiOff,
} from "lucide-react";

/* ─────────── Shared helpers ─────────── */

type Localized = { en: string; ti: string };
const t = (v: Localized, isTi: boolean) => (isTi ? v.ti : v.en);

const panelClass =
  "rounded-2xl border border-zinc-800 bg-zinc-950/90 p-4 shadow-xl sm:p-6 my-6";

/* =========================================================================
   Module 1: Threat Model Sandbox (Section 11.0)
   Theme: "Why Hardware: Hot Wallet vs Hardware Signer Threat Defense Matrix"
   ========================================================================= */

interface ThreatModelProps {
  isTi: boolean;
}

type AttackType = "clipboard" | "keylogger" | "rat" | "memory_dump";
type DeviceChoice = "hot_software" | "cold_hardware";

function ThreatModelSandbox({ isTi }: ThreatModelProps) {
  const [device, setDevice] = useState<DeviceChoice>("hot_software");
  const [activeAttack, setActiveAttack] = useState<AttackType>("clipboard");
  const [simulated, setSimulated] = useState<boolean>(false);
  const [selectedHardwareModel, setSelectedHardwareModel] = useState<"jade" | "coldcard" | "trezor">("jade");

  const attackScenarios: Record<
    AttackType,
    {
      title: Localized;
      desc: Localized;
      hotOutcome: Localized;
      coldOutcome: Localized;
    }
  > = {
    clipboard: {
      title: {
        en: "Clipboard Clipper Malware",
        ti: "ናይ ክሊፕቦርድ ሰራቒ ቫይረስ",
      },
      desc: {
        en: "Malware silently monitors clipboard copies and swaps Bitcoin destination addresses with the hacker's address.",
        ti: "ቫይረስ ንዝተቐድሐ ኣድራሻ ብስቕታ እናተኸታተለ ብናይ ሰራቒ ኣድራሻ ይልውጦ።",
      },
      hotOutcome: {
        en: "ATTACK SUCCEEDED: Software wallet pasted and broadcasted to the hacker's swapped address. 100% of funds lost.",
        ti: "መጥቃዕቲ ተዓዊቱ፦ ሶፍትዌር ዋሌት ነቲ ዝተለወጠ ናይ ሰራቒ ኣድራሻ ሰዲድዎ። ኩሉ ገንዘብ ጠፊኡ።",
      },
      coldOutcome: {
        en: "ATTACK DEFEATED: Even though computer clipboard was tampered, the hardware signer's physical screen displayed the real destination. User caught the mismatch and rejected it!",
        ti: "መጥቃዕቲ ተሳዒሩ፦ ናይ ኮምፒተር ክሊፕቦርድ እኳ እንተተለወጠ፡ ናይቲ ሃርድዌር መሳርሒ ስክሪን ሓቀኛ ኣድራሻ ኣርእዩ። እቲ ተጠቃሚ ኣለልዩ ሰሪዝዎ!",
      },
    },
    keylogger: {
      title: {
        en: "Hardware/Software Keylogger",
        ti: "ናይ ፊደላት መመዝገቢ ቫይረስ (Keylogger)",
      },
      desc: {
        en: "Secretly logs all keystrokes, recording passwords, PIN codes, and typed seed phrases.",
        ti: "ኩሉ ኣብ ኪቦርድ ዝጽሓፍ ፊደላት፡ ናይ ሕሳብ ቃላት ምስጢርን ናይ ዘርኢ ቃላትን ብስቕታ ይቐድሕ።",
      },
      hotOutcome: {
        en: "ATTACK SUCCEEDED: Attacker captured your software wallet spending password and wallet decryption phrase as you typed it.",
        ti: "መጥቃዕቲ ተዓዊቱ፦ እቲ ሰራቒ ነቲ ዝጸሓፍካዮ ናይ ሶፍትዌር ዋሌት ናይ ምስጢር ቃል ብቐሊሉ ቀዲሕዎ።",
      },
      coldOutcome: {
        en: "ATTACK DEFEATED: Private keys never touch the keyboard or computer OS. PIN is entered on device or scrambled matrix.",
        ti: "መጥቃዕቲ ተሳዒሩ፦ ናይ ውሽጢ መፍትሕ ናብ ኪቦርድ ወይ ኮምፒተር ፈጺሙ ኣይበጽሕን። PIN ኣብቲ መሳርሒ ጥራይ ይምላእ።",
      },
    },
    rat: {
      title: {
        en: "Remote Access Trojan (RAT)",
        ti: "ካብ ርሑቕ ዝቆጻጸር ቫይረስ (RAT)",
      },
      desc: {
        en: "Attacker has full silent remote desktop and terminal control over your PC or smartphone.",
        ti: "ሰራቒ ኣብ ልዕሊ ኮምፒተርካ ወይ ስልክኻ ሙሉእ ናይ ርሑቕ ቁጽጽር ረኺቡ።",
      },
      hotOutcome: {
        en: "ATTACK SUCCEEDED: The hacker used remote mouse/keyboard control to open your software wallet and drain all UTXOs immediately.",
        ti: "መጥቃዕቲ ተዓዊቱ፦ ሰራቒ ካብ ርሑቕ ኮይኑ ንዋሌትካ ብምኽፋት ኩሉ ዘሎ ሳንቲማት ሰሪቕዎ።",
      },
      coldOutcome: {
        en: "ATTACK DEFEATED: Hacker can see your computer screen, but cannot physically press the hardware confirmation button on your desk!",
        ti: "መጥቃዕቲ ተሳዒሩ፦ ሰራቒ ንስክሪን ኮምፒተርካ ይርእዮ ይኸውን፡ ኣብ ጠረጴዛኻ ዘሎ ናይ ሃርድዌር መሳርሒ መተሓላለፊ ቁልፊ ብኣካል ክጥውቕ ግን ኣይክእልን!",
      },
    },
    memory_dump: {
      title: {
        en: "RAM Memory Dump / Zero-Day OS Exploit",
        ti: "ናይ ኮምፒተር ዝኽሪ (RAM) ምብባር",
      },
      desc: {
        en: "A kernel-level exploit reads active RAM looking for unencrypted cryptographic keys.",
        ti: "ሓደገኛ ቫይረስ ናይ ኮምፒተርካ RAM ብምፍታሽ ኣብ ዝኽሪ ዘለዉ ምስጢራዊ ቁልፍታት ይደሊ።",
      },
      hotOutcome: {
        en: "ATTACK SUCCEEDED: Hot wallet must load private keys into computer RAM to sign transactions. Malware dumped memory and extracted keys.",
        ti: "መጥቃዕቲ ተዓዊቱ፦ ሶፍትዌር ዋሌት ንምፍራም ቁልፊ ኣብ RAM ክጽዕን ስለዝግደድ፡ እቲ ቫይረስ ካብ ዝኽሪ ቀዲሕዎ።",
      },
      coldOutcome: {
        en: "ATTACK DEFEATED: Private keys NEVER leave the dedicated Secure Element / internal microcontroller. Zero bytes of key material ever touch computer RAM.",
        ti: "መጥቃዕቲ ተሳዒሩ፦ ምስጢራዊ መፍትሕ ካብቲ ውሑስ ናይ ሃርድዌር ቺፕ ፈጺሙ ኣይወጽእን። ናብ ናይ ኮምፒተር RAM ዝበጽሕ ነገር የለን።",
      },
    },
  };

  const handleSimulate = () => {
    setSimulated(true);
  };

  const handleReset = () => {
    setSimulated(false);
  };

  return (
    <div className={panelClass}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
                {t({ en: "Section 11.0 Interactive", ti: "ክፍሊ 11.0 መስተጋብራዊ" }, isTi)}
              </span>
              <span className="text-xs text-zinc-400">
                {t({ en: "Threat Defense Sandbox", ti: "መከላኸሊ መጥቃዕቲ ፈተነ" }, isTi)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100">
              {t(
                {
                  en: "Why Hardware: Hot Wallet vs Hardware Signer Threat Matrix",
                  ti: "ስለምንታይ ሃርድዌር፦ ሶፍትዌር ዋሌት ምስ ሃርድዌር መሳርሒ መከላኸሊ መጥቃዕቲ",
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
          {t({ en: "Reset Simulation", ti: "ፈተነ ምለስ" }, isTi)}
        </button>
      </div>

      <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
        {t(
          {
            en: "An internet-connected computer or phone has millions of lines of code, third-party apps, and browser extensions — any of which can be hacked. Test how each wallet architecture handles real-world cyber attacks:",
            ti: "ናብ ኢንተርነት ዝተተሓሓዘት ኮምፒተር ወይ ስልኪ ብሚልዮናት ዝቑጸር ኮድ፡ ናይ ደገ ኣፕሊኬሽናት ዝሓዘት ብምዃና ብቐሊሉ ንሓደጋ ዝተቓልዐት እያ። ዝተፈላለዩ ናይ ኢንተርነት መጥቃዕትታት ብኸመይ ከምዝምከቱ ፈትን፦",
          },
          isTi
        )}
      </p>

      {/* Target Device Selection */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => {
            setDevice("hot_software");
            setSimulated(false);
          }}
          className={`rounded-xl border p-4 text-left transition cursor-pointer relative ${
            device === "hot_software"
              ? "border-red-500 bg-red-950/20 shadow-md ring-1 ring-red-500/30"
              : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Laptop className="h-5 w-5 text-red-400" />
              <span className="font-bold text-sm text-zinc-100">
                {t({ en: "Hot Wallet (Software on PC/Phone)", ti: "ሶፍትዌር ዋሌት (ኣብ ስልኪ/ኮምፒተር)" }, isTi)}
              </span>
            </div>
            <Wifi className="h-4 w-4 text-red-400" />
          </div>
          <p className="text-xs text-zinc-400">
            {t(
              {
                en: "Private keys stored in operating system files or decrypted into RAM memory during signing.",
                ti: "ምስጢራዊ መፍትሕ ኣብ ፋይል ኮምፒተር ወይ ኣብ RAM ተቐሚጡ ኣብ ዝፍረመሉ ግዜ ይኽፈት።",
              },
              isTi
            )}
          </p>
        </button>

        <button
          onClick={() => {
            setDevice("cold_hardware");
            setSimulated(false);
          }}
          className={`rounded-xl border p-4 text-left transition cursor-pointer relative ${
            device === "cold_hardware"
              ? "border-emerald-500 bg-emerald-950/20 shadow-md ring-1 ring-emerald-500/30"
              : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-emerald-400" />
              <span className="font-bold text-sm text-zinc-100">
                {t({ en: "Hardware Signer (Offline Cold Vault)", ti: "ሃርድዌር መሳርሒ (ካብ ኢንተርነት ወጻኢ)" }, isTi)}
              </span>
            </div>
            <WifiOff className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-xs text-zinc-400">
            {t(
              {
                en: "Private keys locked inside air-gapped secure silicon. Physical button press required for all signatures.",
                ti: "ምስጢራዊ መፍትሕ ኣብ ውሽጢ ቺፕ ተዓጽዩ ይተርፍ። ንምፍራም ግድን ብኣካል ቁልፊ ምጥዋቕ የድሊ።",
              },
              isTi
            )}
          </p>
        </button>
      </div>

      {/* Attack Scenario Selector */}
      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
          {t({ en: "Select Attack Vector to Test:", ti: "ክትፍትኖ እትደሊ ናይ መጥቃዕቲ ዓይነት ምረጽ፦" }, isTi)}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {(Object.keys(attackScenarios) as AttackType[]).map((atk) => {
            const isSelected = activeAttack === atk;
            return (
              <button
                key={atk}
                onClick={() => {
                  setActiveAttack(atk);
                  setSimulated(false);
                }}
                className={`rounded-lg border p-2.5 text-left text-xs font-medium transition cursor-pointer ${
                  isSelected
                    ? "border-amber-500 bg-amber-500/10 text-amber-300"
                    : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <div className="font-bold">{t(attackScenarios[atk].title, isTi)}</div>
              </button>
            );
          })}
        </div>

        <div className="rounded-lg bg-zinc-950 p-3 border border-zinc-800 text-xs text-zinc-300">
          <span className="text-zinc-500 font-semibold block mb-1">
            {t({ en: "Threat Description:", ti: "ናይዚ ሓደጋ መብርሂ፦" }, isTi)}
          </span>
          {t(attackScenarios[activeAttack].desc, isTi)}
        </div>

        <button
          onClick={handleSimulate}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-zinc-950 transition hover:bg-amber-400 cursor-pointer shadow-lg"
        >
          <Flame className="h-4 w-4" />
          {t(
            {
              en: `Launch ${t(attackScenarios[activeAttack].title, false)} Simulation`,
              ti: `ናይ ${t(attackScenarios[activeAttack].title, true)} ፈተነ ኣበግስ`,
            },
            isTi
          )}
        </button>
      </div>

      {/* Simulation Result */}
      {simulated && (
        <div className="mt-4">
          {device === "hot_software" ? (
            <div className="rounded-xl border border-red-500/40 bg-red-950/20 p-4 space-y-2">
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                <ShieldAlert className="h-5 w-5" />
                <span>{t({ en: "CRITICAL FAILURE: Hot Wallet Compromised!", ti: "ሓደጋ፦ ሶፍትዌር ዋሌት ተሰይሩ!" }, isTi)}</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-mono">
                {t(attackScenarios[activeAttack].hotOutcome, isTi)}
              </p>
              <div className="rounded-lg bg-black/40 p-2.5 border border-red-900/40 text-[11px] font-mono text-red-300 flex items-center justify-between">
                <span>Wallet UTXO Balance:</span>
                <span className="font-bold line-through">0.50000000 BTC</span>
                <span className="font-bold text-red-400">0.00000000 BTC (Drained)</span>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <ShieldCheck className="h-5 w-5" />
                <span>{t({ en: "FORTRESS DEFENSE: Hardware Signer Safe!", ti: "ውሑስ ምክልኻል፦ ሃርድዌር መሳርሒ ድሒኑ!" }, isTi)}</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-mono">
                {t(attackScenarios[activeAttack].coldOutcome, isTi)}
              </p>
              <div className="rounded-lg bg-black/40 p-2.5 border border-emerald-900/40 text-[11px] font-mono text-emerald-300 flex items-center justify-between">
                <span>Hardware Vault Balance:</span>
                <span className="font-bold">0.50000000 BTC (Untouched & Safe)</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hardware Device Architecture Deep-Dive */}
      <div className="mt-5 pt-4 border-t border-zinc-800 space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
          {t({ en: "Explore Popular Hardware Signer Architectures:", ti: "ፍሉጣት ናይ ሃርድዌር መሳርሒታት ኣሰራርሓ፦" }, isTi)}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: "jade",
              name: "Blockstream Jade",
              type: "Air-Gapped Camera / QR",
              perk: "Stateless option, open source, camera for 100% air-gap.",
            },
            {
              id: "coldcard",
              name: "Coldcard Q / Mk4",
              type: "MicroSD / NFC / Air-Gap",
              perk: "True dual secure elements, dedicated PIN pad, duress pins.",
            },
            {
              id: "trezor",
              name: "Trezor Safe 3",
              type: "USB-C + Secure Element",
              perk: "Open-source firmware, secure element, multi-currency support.",
            },
          ].map((h) => (
            <button
              key={h.id}
              onClick={() => setSelectedHardwareModel(h.id as any)}
              className={`rounded-xl border p-3 text-left transition cursor-pointer ${
                selectedHardwareModel === h.id
                  ? "border-amber-500 bg-amber-500/10 shadow-sm"
                  : "border-zinc-800 bg-zinc-900/30 hover:border-zinc-700"
              }`}
            >
              <div className="font-bold text-xs text-zinc-100">{h.name}</div>
              <div className="text-[10px] text-amber-400 font-mono mt-0.5">{h.type}</div>
              <p className="text-[11px] text-zinc-400 mt-1.5 leading-snug">{h.perk}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   Module 2: Passphrase & Dry-Run Recovery Lab (Section 11.1)
   Theme: "Setup, Backup, and Test Recovery: The 25th Word & Recovery Drill"
   ========================================================================= */

interface PassphraseVaultProps {
  isTi: boolean;
}

function PassphraseVaultLab({ isTi }: PassphraseVaultProps) {
  const [activeTab, setActiveTab] = useState<"passphrase" | "dry_run">("passphrase");

  // Passphrase state
  const [passphrase, setPassphrase] = useState<string>("");
  const [showPassphrase, setShowPassphrase] = useState<boolean>(false);

  // Dry-run drill state
  const testWords = [
    "abandon", "ability", "able", "about", "above", "absent",
    "absorb", "abstract", "absurd", "abuse", "access", "accident"
  ];
  const [userInputs, setUserInputs] = useState<string[]>(Array(12).fill(""));
  const [drillVerified, setDrillVerified] = useState<boolean | null>(null);

  // Derivation simulation based on passphrase
  const isPassphraseActive = passphrase.trim().length > 0;
  const derivedAddress = useMemo(() => {
    if (!isPassphraseActive) {
      return "bc1q-standard-decoy-d8a2x4981z";
    }
    // Simple deterministic mock hash
    let hash = 0;
    for (let i = 0; i < passphrase.length; i++) {
      hash = (hash << 5) - hash + passphrase.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(6, "0");
    return `bc1q-vault-${hex}-sec771k`;
  }, [passphrase, isPassphraseActive]);

  const derivedBalance = isPassphraseActive ? "2.45000000 BTC" : "0.00500000 BTC";
  const walletTypeLabel = isPassphraseActive
    ? { en: "Hidden Vault Wallet (Protected by 25th Word)", ti: "ዝተሓብአ ናይ ዕቋር ዋሌት (ብ25ይ ቃል ዝተሓለወ)" }
    : { en: "Default Decoy Wallet (Clean Seed Only)", ti: "ቀዳማይ ናይ መታለሊ ዋሌት (ናይ ዘርኢ ቃላት ጥራይ)" };

  const handleFillDemoSeed = () => {
    setUserInputs([...testWords]);
    setDrillVerified(null);
  };

  const handleVerifyDrill = () => {
    const isAllMatch = userInputs.every((w, i) => w.trim().toLowerCase() === testWords[i]);
    setDrillVerified(isAllMatch);
  };

  const handleResetDrill = () => {
    setUserInputs(Array(12).fill(""));
    setDrillVerified(null);
  };

  return (
    <div className={panelClass}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
            <Key className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-400">
                {t({ en: "Section 11.1 Interactive", ti: "ክፍሊ 11.1 መስተጋብራዊ" }, isTi)}
              </span>
              <span className="text-xs text-zinc-400">
                {t({ en: "The 25th Word & Recovery Drill", ti: "መበል 25ይ ቃልን ናይ ምምላስ ፈተነን" }, isTi)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100">
              {t(
                {
                  en: "Passphrase Architecture & Plausible Deniability Vaults",
                  ti: "ናይ ምስጢር ቃል (Passphrase)ን ዝተሓብኡ ዋሌታትን",
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
            en: "A hardware wallet seed phrase is your master key. But what if an attacker forces you to unlock it? Adding an optional BIP39 Passphrase (the '25th word') creates an entirely different, hidden wallet with plausible deniability.",
            ti: "ናይ ዘርኢ ቃላት ናይ ዋሌትካ ዋና መፍትሕ እዩ። ሓደ ሰራቒ ብሓይሊ ክትከፍቶ እንተኣገዲዱኻኸ? ናይ BIP39 ምስጢራዊ ቃል (መበል 25ይ ቃል) ብምውሳኽ ፈጺሙ ካልእ ዝኾነ ዝተሓብአ ዋሌት ክትፈጥር ትኽእል።",
          },
          isTi
        )}
      </p>

      {/* Tabs */}
      <div className="mt-4 flex flex-wrap gap-2 border-b border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab("passphrase")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
            activeTab === "passphrase"
              ? "bg-cyan-500 text-zinc-950 shadow-sm"
              : "bg-zinc-900 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Lock className="h-3.5 w-3.5" />
          {t({ en: "1. Passphrase / 25th Word Vault Lab", ti: "1. ናይ 25ይ ቃል ፈተነ" }, isTi)}
        </button>
        <button
          onClick={() => setActiveTab("dry_run")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
            activeTab === "dry_run"
              ? "bg-cyan-500 text-zinc-950 shadow-sm"
              : "bg-zinc-900 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <CheckSquare className="h-3.5 w-3.5" />
          {t({ en: "2. Dry-Run Recovery Drill", ti: "2. ናይ ምምላስ ልምምድ (Dry-Run)" }, isTi)}
        </button>
      </div>

      {activeTab === "passphrase" && (
        <div className="mt-4 space-y-4">
          {/* Base 12 Word Seed */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-400">
              <span className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-amber-400" />
                {t({ en: "Master Seed Words (Stamped on Steel):", ti: "ናይ ሓጺን ዝተቐረጹ 12 ናይ ዘርኢ ቃላት፦" }, isTi)}
              </span>
              <span className="text-zinc-500 font-mono text-[11px]">BIP-39 Standard (12 Words)</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1 font-mono text-xs">
              {testWords.map((word, i) => (
                <div key={i} className="rounded-lg bg-zinc-950 p-1.5 border border-zinc-800 text-center">
                  <span className="text-[9px] text-zinc-600 block">{i + 1}</span>
                  <span className="text-zinc-200">{word}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Passphrase Input */}
          <div className="rounded-xl border border-cyan-500/40 bg-zinc-950 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                <Key className="h-4 w-4" />
                {t({ en: "Enter Optional Passphrase ('25th Word'):", ti: "መበል 25ይ ምስጢራዊ ቃል ኣእቱ፦" }, isTi)}
              </label>
              <button
                type="button"
                onClick={() => setShowPassphrase(!showPassphrase)}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {showPassphrase ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {showPassphrase ? t({ en: "Hide", ti: "ሕባእ" }, isTi) : t({ en: "Show", ti: "ኣርኢ" }, isTi)}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type={showPassphrase ? "text" : "password"}
                value={passphrase}
                placeholder={t({ en: "Try typing: AfricanBitcoin2026 or leave blank", ti: "ንኣብነት፦ AfricanBitcoin2026 ወይ ባዶ ግደፎ" }, isTi)}
                onChange={(e) => setPassphrase(e.target.value)}
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-mono text-zinc-100 focus:border-cyan-500 focus:outline-none"
              />
              <button
                onClick={() => setPassphrase("AfricanBitcoin2026")}
                className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 cursor-pointer"
              >
                {t({ en: "Use Sample Passphrase", ti: "መርኣያ ቃል ተጠቐም" }, isTi)}
              </button>
            </div>

            <p className="text-[11px] text-zinc-400">
              {t(
                {
                  en: "Notice: Unlike a password, there is NO 'wrong' passphrase! Every single string creates a completely valid, mathematically independent Bitcoin wallet.",
                  ti: "ኣስተውዕል፦ ከም ልሙድ ናይ ፓስዎርድ 'ዝተጋገየ' ቃል ዝበሃል የለን! ዝኾነ ቃል ፍጹም ነጻ ዝኾነ ሓድሽ ናይ ቢትኮይን ዋሌት እዩ ዝኸፍት።",
                },
                isTi
              )}
            </p>
          </div>

          {/* Derived Wallet Display */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                {t(walletTypeLabel, isTi)}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                isPassphraseActive
                  ? "bg-cyan-500/20 text-cyan-300"
                  : "bg-zinc-800 text-zinc-400"
              }`}>
                {isPassphraseActive ? "Vault Active" : "Decoy Mode"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="rounded-lg bg-zinc-950 p-3 border border-zinc-800">
                <span className="text-zinc-500 text-[10px] block uppercase">Derived On-Chain Address</span>
                <span className="text-zinc-200 font-bold break-all">{derivedAddress}</span>
              </div>
              <div className="rounded-lg bg-zinc-950 p-3 border border-zinc-800">
                <span className="text-zinc-500 text-[10px] block uppercase">Vault Balance</span>
                <span className={`text-lg font-bold ${isPassphraseActive ? "text-emerald-400" : "text-amber-400"}`}>
                  {derivedBalance}
                </span>
              </div>
            </div>

            <div className="rounded-lg bg-zinc-950/80 p-3 border border-zinc-800/80 text-xs text-zinc-400 leading-relaxed">
              <span className="font-bold text-zinc-200 block mb-1">
                {t({ en: "Plausible Deniability in Action:", ti: "ናይ ምኽዋል ሓይሊ (Plausible Deniability)፦" }, isTi)}
              </span>
              {isPassphraseActive
                ? t(
                    {
                      en: "If under duress, you can surrender your 12 words. The robber unlocks the 0.005 BTC decoy wallet. They have zero mathematical way of knowing your 'AfricanBitcoin2026' passphrase exists, protecting your 2.45 BTC vault!",
                      ti: "ብሓይሊ እንተተገዲድካ ነተን 12 ቃላት ትህቦም። እቲ ሰራቒ ነቲ 0.005 BTC ዘለዎ መታለሊ ዋሌት ይረክብ። ነቲ 'AfricanBitcoin2026' ዝሓዘ 2.45 BTC ዘለዎ ዋሌትካ ከምዘሎ ዝፈልጠሉ ዝኾነ መንገዲ የለን!",
                    },
                    isTi
                  )
                : t(
                    {
                      en: "Without a passphrase, you are on the default wallet. Keep only petty cash here so you can surrender it under coercion.",
                      ti: "ብዘይ 25ይ ቃል፡ ኣብቲ ልሙድ ቀዳማይ ዋሌት ኢኻ ዘለኻ። ሓደጋ እንተጋጢሙ ንምሃብ ንእሽቶ ገንዘብ ጥራይ ኣቐምጠሉ።",
                    },
                    isTi
                  )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "dry_run" && (
        <div className="mt-4 space-y-4">
          <p className="text-xs text-zinc-400 leading-relaxed">
            {t(
              {
                en: "Before sending real Bitcoin to a hardware wallet, you must perform a Dry-Run Recovery. This tests your steel/paper backup without wiping your active device keys:",
                ti: "ሓቀኛ ቢትኮይን ናብቲ መሳርሒ ቅድሚ ምስዳድካ፡ ናይ ምምላስ ልምምድ (Dry-Run) ክትገብር ኣለካ። እዚ ማለት ንዋሌትካ ከይደምሰስካ እተን ዝጸሓፍካየን ቃላት ልክዕ ምዃነን ተረጋግጽ፦",
              },
              isTi
            )}
          </p>

          <div className="flex justify-end gap-2">
            <button
              onClick={handleFillDemoSeed}
              className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 cursor-pointer"
            >
              {t({ en: "Auto-Fill Valid Backup", ti: "ቅኑዕ ዘርኢ ብቐጥታ ምላእ" }, isTi)}
            </button>
            <button
              onClick={handleResetDrill}
              className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-700 cursor-pointer"
            >
              {t({ en: "Clear Inputs", ti: "ኣጽሪ" }, isTi)}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {testWords.map((_, i) => (
              <div key={i} className="rounded-lg border border-zinc-800 bg-zinc-950 p-2">
                <span className="text-[10px] text-zinc-500 font-mono block mb-1">Word #{i + 1}</span>
                <input
                  type="text"
                  value={userInputs[i]}
                  placeholder={`word ${i + 1}`}
                  onChange={(e) => {
                    const next = [...userInputs];
                    next[i] = e.target.value;
                    setUserInputs(next);
                    setDrillVerified(null);
                  }}
                  className="w-full rounded bg-zinc-900 border border-zinc-700 px-2 py-1 text-xs font-mono text-zinc-200 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleVerifyDrill}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-bold text-zinc-950 transition hover:bg-cyan-400 cursor-pointer shadow-lg"
          >
            <CheckCircle2 className="h-4 w-4" />
            {t({ en: "Run Hardware Recovery Check", ti: "ናይ ምምላስ ምርግጋጽ ፈትን" }, isTi)}
          </button>

          {drillVerified !== null && (
            <div
              className={`rounded-xl border p-4 flex items-start gap-3 ${
                drillVerified
                  ? "border-emerald-500/40 bg-emerald-950/20 text-emerald-300"
                  : "border-red-500/40 bg-red-950/20 text-red-300"
              }`}
            >
              {drillVerified ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              )}
              <div className="text-xs space-y-1">
                <span className="font-bold text-sm block">
                  {drillVerified
                    ? t({ en: "Dry-Run Recovery Succeeded! Backup 100% Verified.", ti: "ናይ ምምላስ ፈተነ ተዓዊቱ! እተን ቃላት 100% ቅኑዓት እየን።" }, isTi)
                    : t({ en: "Checksum Failed or Words Mismatched!", ti: "ጌጋ ተረኺቡ፦ ቃላት ኣይተመሳሰሉን!" }, isTi)}
                </span>
                <p className="text-zinc-300">
                  {drillVerified
                    ? t(
                        {
                          en: "Your 12-word seed backup matches the internal cryptographic seed on the device. It is now safe to deposit funds.",
                          ti: "እተን ዝጸሓፍካየን 12 ቃላት ምስቲ ኣብ ውሽጢ መሳርሒ ዘሎ ቁልፊ ሓደ ኮይነን ተረኺበን። ሕጂ ገንዘብ ከተቐምጥ ውሑስ እዩ።",
                        },
                        isTi
                      )
                    : t(
                        {
                          en: "One or more words do not match the BIP39 dictionary or order. Never deposit funds until your dry-run passes!",
                          ti: "ሓደ ወይ ካብኡ ንላዕሊ ቃላት ተሳሒቶም ኣለዉ። እዚ ፈተነ ከይተዓወተ ፈጺምካ ቢትኮይን ከየተቐምጥ!",
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
   Module 3: PSBT Signing Pipeline Simulator (Section 11.2)
   Theme: "Spending Safely with a Hardware Signer: Air-Gapped PSBT Lifecycle"
   ========================================================================= */

interface PsbtPipelineProps {
  isTi: boolean;
}

function PsbtSigningPipeline({ isTi }: PsbtPipelineProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [deviceApproved, setDeviceApproved] = useState<boolean>(false);
  const [broadcasted, setBroadcasted] = useState<boolean>(false);

  const txDetails = {
    destination: "bc1q9v8k7m0a4xf3298h49sljnd2q04xpeq8v601a",
    amountSats: 50000,
    amountBtc: "0.00050000 BTC",
    feeSats: 1500,
    changeSats: 48500,
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setDeviceApproved(false);
    setBroadcasted(false);
  };

  return (
    <div className={panelClass}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
            <Radio className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-400">
                {t({ en: "Section 11.2 Interactive", ti: "ክፍሊ 11.2 መስተጋብራዊ" }, isTi)}
              </span>
              <span className="text-xs text-zinc-400">
                {t({ en: "BIP-174 PSBT Lifecycle", ti: "ናይ PSBT ናይ ክፍሊት መስርሕ" }, isTi)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100">
              {t(
                {
                  en: "Air-Gapped PSBT Pipeline: How Keys Stay Offline During a Spend",
                  ti: "ናይ PSBT ኣከያይዳ፦ ኣብ ክፍሊት እዋን መፍትሕ ብኸመይ ካብ ኢንተርነት ወጻኢ ይተርፍ",
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
          {t({ en: "Reset Pipeline", ti: "መስርሕ ምለስ" }, isTi)}
        </button>
      </div>

      <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
        {t(
          {
            en: "Partially Signed Bitcoin Transactions (BIP-174) allow you to safely build transactions on an internet-connected PC, transport them to an offline signer, and sign without exposing private keys.",
            ti: "ብኸፊል ዝተፈርመ ናይ ቢትኮይን ትራንዛክሽን (PSBT)፡ ኣብ ኮምፒተርካ ክፍሊት ኣዳልዩ፡ ናብቲ ካብ ኢንተርነት ወጻኢ ዝኾነ መሳርሒ ብምስግጋር ምስጢራዊ መፍትሕ ከይተቓልዐ ንኽትፈርም የኽእለካ።",
          },
          isTi
        )}
      </p>

      {/* Stepper Header */}
      <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs font-semibold">
        {[
          { num: 1, title: { en: "1. Build PSBT", ti: "1. ምድላው" } },
          { num: 2, title: { en: "2. Air-Gap Transfer", ti: "2. ምስግጋር" } },
          { num: 3, title: { en: "3. Device Screen", ti: "3. ምርግጋጽ" } },
          { num: 4, title: { en: "4. Broadcast", ti: "4. ምዝርጋሕ" } },
        ].map((s) => (
          <button
            key={s.num}
            onClick={() => setCurrentStep(s.num)}
            className={`rounded-xl p-2.5 border transition cursor-pointer ${
              currentStep === s.num
                ? "border-purple-500 bg-purple-500/20 text-purple-300 shadow-sm"
                : currentStep > s.num
                ? "border-emerald-500/40 bg-emerald-950/20 text-emerald-400"
                : "border-zinc-800 bg-zinc-900/40 text-zinc-500"
            }`}
          >
            <div className="text-[10px] uppercase">{t(s.title, isTi)}</div>
          </button>
        ))}
      </div>

      {/* Step Content */}
      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-5">
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-100">
              <Laptop className="h-4 w-4 text-purple-400" />
              <span>{t({ en: "Step 1: Watch-Only Coordinator (Sparrow / Electrum)", ti: "ደረጃ 1፦ ኣብ ኮምፒተር ክፍሊት ምድላው" }, isTi)}</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {t(
                {
                  en: "Your computer wallet holds ONLY public keys (xpub). It has zero private keys. It constructs an unsigned transaction proposal specifying inputs and outputs:",
                  ti: "ኣብ ኮምፒተርካ ዘሎ ዋሌት ህዝባዊ መፍትሕ (xpub) ጥራይ ይሕዝ። ዝኾነ ምስጢራዊ መፍትሕ የብሉን። ንሳንቲማትን ኣድራሻታትን ዘጠቓልል ዘይተፈርመ ውዕል የዳልው፦",
                },
                isTi
              )}
            </p>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 space-y-2 font-mono text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Destination:</span>
                <span className="text-zinc-200">{txDetails.destination}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Amount:</span>
                <span className="text-amber-400 font-bold">{txDetails.amountSats.toLocaleString()} sats ({txDetails.amountBtc})</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Change Returned:</span>
                <span className="text-emerald-400">{txDetails.changeSats.toLocaleString()} sats</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Miner Fee:</span>
                <span className="text-red-400">{txDetails.feeSats.toLocaleString()} sats</span>
              </div>
              <div className="pt-2 border-t border-zinc-800 flex justify-between text-[11px] text-purple-300 font-bold">
                <span>Status:</span>
                <span>UNSIGNED RAW PSBT (Safe to export over insecure channels)</span>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-500 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-purple-400 cursor-pointer"
            >
              <span>{t({ en: "Export PSBT to Hardware Signer", ti: "ናብ ሃርድዌር መሳርሒ ኣመሓላልፍ" }, isTi)}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-100">
              <QrCode className="h-4 w-4 text-purple-400" />
              <span>{t({ en: "Step 2: 100% Air-Gapped Transmission", ti: "ደረጃ 2፦ ብዘይ ኢንተርነት ዝግበር ምልውዋጥ" }, isTi)}</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {t(
                {
                  en: "How does the unsigned PSBT get into the offline device without an internet connection? Via optical Animated QR Codes or MicroSD card:",
                  ti: "እቲ ዘይተፈርመ ውዕል ብዘይ ዝኾነ ኢንተርነት ብኸመይ ናብቲ መሳርሒ ይኣቱ? ብናይ ካሜራ QR ኮድ ወይ ብናይ MicroSD ካርድ ኣቢሉ፦",
                },
                isTi
              )}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-center space-y-2">
                <div className="h-28 w-28 mx-auto bg-white rounded-lg flex items-center justify-center text-zinc-950 font-mono text-[10px] font-bold p-2">
                  <div className="text-center">
                    <QrCode className="h-12 w-12 mx-auto text-zinc-950 mb-1" />
                    [ANIMATED QR STREAM]
                  </div>
                </div>
                <span className="text-[11px] font-mono text-zinc-400 block">Watch-Only Screen</span>
              </div>

              <div className="flex flex-col items-center gap-1 text-purple-400">
                <ArrowRight className="h-6 w-6 animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-wider">Zero Cables / Zero RF</span>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-center space-y-2">
                <div className="h-28 w-28 mx-auto border-2 border-emerald-500/60 rounded-lg flex flex-col items-center justify-center text-emerald-400 font-mono text-[10px] p-2 bg-emerald-950/20">
                  <CameraIcon className="h-8 w-8 mb-1" />
                  <span>Hardware Camera Scans QR</span>
                </div>
                <span className="text-[11px] font-mono text-zinc-400 block">Offline Device Lens</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                className="rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-xs text-zinc-300 hover:bg-zinc-700 cursor-pointer"
              >
                {t({ en: "Back", ti: "ንድሕሪት" }, isTi)}
              </button>
              <button
                onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-purple-500 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-purple-400 cursor-pointer"
              >
                <span>{t({ en: "Inspect on Hardware Signer Screen", ti: "ኣብ መሳርሒ ስክሪን መርምር" }, isTi)}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-100">
              <Eye className="h-4 w-4 text-purple-400" />
              <span>{t({ en: "Step 3: Hardware Trusted Screen Verification", ti: "ደረጃ 3፦ ኣብ ናይቲ መሳርሒ ስክሪን ብጥንቃቐ ምርጋጽ" }, isTi)}</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {t(
                {
                  en: "CRITICAL MOMENT: Malware on a PC can lie, but malware CANNOT modify the hardware signer's physical OLED screen. Verify the address character by character before pressing the button:",
                  ti: "ኣገዳሲ ህሞት፦ ኣብ ኮምፒተር ዘሎ ቫይረስ ሓሶት ከርእየካ ይኽእል እዩ፡ ኣብቲ ናይ ሃርድዌር መሳርሒ ስክሪን ግን ዝኾነ ቫይረስ ክልውጦ ኣይክእልን። ቁልፊ ቅድሚ ምጥዋቕካ ኣድራሻን መጠንን ኣረጋግጽ፦",
                },
                isTi
              )}
            </p>

            {/* Hardware Device OLED Screen Mockup */}
            <div className="max-w-md mx-auto rounded-3xl border-4 border-zinc-700 bg-zinc-950 p-5 shadow-2xl space-y-3">
              <div className="rounded-xl border border-cyan-500/50 bg-black p-4 font-mono text-cyan-400 space-y-2 text-xs">
                <div className="flex justify-between border-b border-cyan-900 pb-1 text-[10px] text-cyan-500">
                  <span>BLOCKSTREAM JADE / SIGNER</span>
                  <span>PSBT #1</span>
                </div>
                <div>
                  <span className="text-[10px] text-cyan-600 block uppercase">SEND TO:</span>
                  <span className="break-all font-bold text-white">{txDetails.destination}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-cyan-600">AMOUNT:</span>
                  <span className="font-bold text-amber-400">{txDetails.amountSats.toLocaleString()} sats</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-600">FEE:</span>
                  <span className="text-red-400">{txDetails.feeSats.toLocaleString()} sats</span>
                </div>
                <div className="pt-2 border-t border-cyan-900/60 text-center text-[10px] text-zinc-400">
                  {deviceApproved ? "✓ TRANSACTION SIGNED WITH ECDSA KEY" : "PRESS PHYSICAL BUTTON TO SIGN"}
                </div>
              </div>

              {/* Physical Click Wheel / Button */}
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => setDeviceApproved(true)}
                  disabled={deviceApproved}
                  className={`rounded-full px-6 py-2.5 text-xs font-bold transition cursor-pointer flex items-center gap-2 shadow-lg ${
                    deviceApproved
                      ? "bg-emerald-500 text-zinc-950"
                      : "bg-cyan-500 hover:bg-cyan-400 text-zinc-950 animate-pulse"
                  }`}
                >
                  <Lock className="h-4 w-4" />
                  {deviceApproved
                    ? t({ en: "Hardware Signature Generated!", ti: "ፊርማ ብዓወት ተፈጢሩ!" }, isTi)
                    : t({ en: "Press Physical Button to Sign", ti: "ንምፍራም ናይቲ መሳርሒ ቁልፊ ጥወቕ" }, isTi)}
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handlePrev}
                className="rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-xs text-zinc-300 hover:bg-zinc-700 cursor-pointer"
              >
                {t({ en: "Back", ti: "ንድሕሪት" }, isTi)}
              </button>
              <button
                onClick={handleNext}
                disabled={!deviceApproved}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-purple-500 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-purple-400 disabled:opacity-40 cursor-pointer"
              >
                <span>{t({ en: "Export Signed PSBT & Broadcast", ti: "ዝተፈርመ ውዕል መሊስካ ዘርግሕ" }, isTi)}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-100">
              <Send className="h-4 w-4 text-purple-400" />
              <span>{t({ en: "Step 4: Final Broadcast to Bitcoin Mempool", ti: "ደረጃ 4፦ ናብ መላእ ዓለም ምዝርጋሕ" }, isTi)}</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {t(
                {
                  en: "The hardware signer transferred ONLY the cryptographic signatures back to the computer wallet. The computer extracts the signatures, synthesizes the final transaction, and pushes it to global nodes:",
                  ti: "እቲ ሃርድዌር መሳርሒ ክሪፕቶግራፊክ ፊርማ ጥራይ ናብ ኮምፒተር መሊስዎ። ኮምፒተር ነቲ ዝተፈርመ ትራንዛክሽን ናብ ኩሎም ናይ ቢትኮይን ኖዳት ትዝርግሖ፦",
                },
                isTi
              )}
            </p>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center text-zinc-400 border-b border-zinc-800 pb-2">
                <span>Signed PSBT Status:</span>
                <span className="text-emerald-400 font-bold">100% COMPLETE & SIGNED</span>
              </div>
              <div className="text-[11px] text-zinc-500 break-all">
                RAW HEX: 02000000018c3b4e91...47304402207f...0121038b4f...ffffff
              </div>
            </div>

            <button
              onClick={() => setBroadcasted(true)}
              disabled={broadcasted}
              className={`w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold transition cursor-pointer shadow-lg ${
                broadcasted
                  ? "bg-emerald-500 text-zinc-950"
                  : "bg-purple-500 hover:bg-purple-400 text-white"
              }`}
            >
              <Send className="h-4 w-4" />
              {broadcasted
                ? t({ en: "Transaction Broadcasted to Bitcoin Network!", ti: "ትራንዛክሽን ብዓወት ተዘርጊሑ!" }, isTi)
                : t({ en: "Broadcast Signed Transaction to Mempool", ti: "ናብ ሜምፑል ዘርግሕ" }, isTi)}
            </button>

            {broadcasted && (
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>{t({ en: "Spend Completed with Zero Key Exposure!", ti: "ክፍሊት ብዘይ ዝኾነ ናይ ቁልፊ ሓደጋ ተዛዚሙ!" }, isTi)}</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed font-mono">
                  {t(
                    {
                      en: "TxID: e9a10fc4...89b1c. Private keys never left the offline device. Your computer, even if infected with 1,000 viruses, was completely powerless to steal your funds.",
                      ti: "ናይ ትራንዛክሽን መለለዪ (TxID)፦ e9a10fc4...89b1c። ምስጢራዊ መፍትሕ ካብቲ መሳርሒ ፈጺሙ ኣይወጸን። ኮምፒተርካ ብኣሽሓት ቫይረስ እኳ እንተተበላሸወት፡ ገንዘብካ ክትሰርቕ ፈጺማ ኣይትኽእልን።",
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

// Inline fallback camera icon
function CameraIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

/* =========================================================================
   Master Chapter 11 Export Component
   ========================================================================= */

interface Chapter11LessonProps {
  module: "threat_model_sandbox" | "passphrase_vault_lab" | "psbt_signing_pipeline";
  isTi: boolean;
}

export function Chapter11InteractiveLesson({ module, isTi }: Chapter11LessonProps) {
  switch (module) {
    case "threat_model_sandbox":
      return <ThreatModelSandbox isTi={isTi} />;
    case "passphrase_vault_lab":
      return <PassphraseVaultLab isTi={isTi} />;
    case "psbt_signing_pipeline":
      return <PsbtSigningPipeline isTi={isTi} />;
    default:
      return null;
  }
}
