"use client";

import { useState, type ComponentType } from "react";
import {
  CreditCard,
  Coins,
  Cpu,
  FileText,
  Building2,
  Lock,
  Key,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Fingerprint,
  Link2,
  ShieldCheck,
  Newspaper,
  Sparkles,
  Layers,
  Check,
  X,
  History,
} from "lucide-react";

type Localized = { en: string; ti: string };
const t = (v: Localized, isTi: boolean) => (isTi ? v.ti : v.en);

const panelClass =
  "rounded-2xl border border-zinc-800 bg-zinc-950/90 p-4 shadow-inner sm:p-6 my-6";

/* =========================================================================
   4.1  Cypherpunks → Digital Attempts → Satoshi's Breakthrough
   ========================================================================= */

type Attempt = {
  year: string;
  name: string;
  icon: ComponentType<{ className?: string }>;
  who: Localized;
  idea: Localized;
  failure: Localized;
  isSuccess: boolean;
  failureColor: string;
  borderColor: string;
  textColor: string;
};

const attempts: Attempt[] = [
  {
    year: "1983",
    name: "DigiCash",
    icon: CreditCard,
    who: { en: "David Chaum", ti: "ዴቪድ ቻውም" },
    idea: {
      en: "First ever digital cash — anonymous, cryptographically protected payments.",
      ti: "ቀዳምነት ዲጂታላዊ ጥረ ገንዘብ — ስሱር፡ ብክሪፕቶ ዝሕሉ ምትሕልላፍ ክፍሊት።",
    },
    failure: {
      en: "Required a central company to operate. When the company went bankrupt in 1998, DigiCash collapsed with it.",
      ti: "ንምስራሕ ማእከላይ ኩባንያ ይሓትት ነይሩ። እቲ ኩባንያ ኣብ 1998 ምስ ፈሸለ፡ DigiCash ምስኡ ተደምሰሰ።",
    },
    isSuccess: false,
    failureColor: "bg-rose-500/10 border-rose-500/30 text-rose-300",
    borderColor: "border-purple-500/40",
    textColor: "text-purple-300",
  },
  {
    year: "1996",
    name: "E-Gold",
    icon: Coins,
    who: { en: "Douglas Jackson", ti: "ዳግላስ ጃክሰን" },
    idea: {
      en: "Digital currency backed by real physical gold — a return to sound commodity money on the internet.",
      ti: "ብሓቀኛ ወርቂ ዝድገፍ ዲጂታላዊ ባጤራ — ናብ ጥዑይ ገንዘብ ምምላስ ኣብ ኢንተርኔት።",
    },
    failure: {
      en: "US Government shut it down in 2008, indicting the operators. Centralized custody created a single point of failure.",
      ti: "ናይ ኣሜሪካ መንግስቲ ኣብ 2008 ዓጽይዎ። ማእከላይ ኣቀማምጣ ስለ ዝነበሮ ቀሊል መጥቃዕቲ ኮይኑ ጠፊኡ።",
    },
    isSuccess: false,
    failureColor: "bg-rose-500/10 border-rose-500/30 text-rose-300",
    borderColor: "border-yellow-500/40",
    textColor: "text-yellow-300",
  },
  {
    year: "1997",
    name: "Hashcash",
    icon: Cpu,
    who: { en: "Adam Back", ti: "ኣዳም ባክ" },
    idea: {
      en: "Created to fight email spam — computers had to solve a small computational puzzle before sending mail.",
      ti: "ንኢሜይል ስፓም ንምምካት ዝተፈጥረ — ኮምፒተራት ቅድሚ ኢሜይል ምስዳድ ናይ ኮምፒተር ስራሕ ከርእያ ይሓትት ነይሩ።",
    },
    failure: {
      en: "Not intended as a currency — but its 'Proof of Work' mechanism directly inspired Bitcoin mining. Cited in the whitepaper.",
      ti: "ባጤራ ኣይነበረን — ግናኸ እቲ 'Proof of Work' (ናይ ስራሕ መርትዖ) ዝብል መሃዝነቱ ንዕደና ቢትኮይን ቀጥታ መሰረት ኮነ።",
    },
    isSuccess: true,
    failureColor: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    borderColor: "border-orange-500/40",
    textColor: "text-orange-300",
  },
];

function CypherpunkTimelineGraphic({ isTi }: { isTi: boolean }) {
  const [selected, setSelected] = useState<number>(0);
  const current = attempts[selected];
  const CurrentIcon = current.icon;

  return (
    <section className={panelClass} aria-label={t({ en: "Cypherpunk Timeline", ti: "ናይ ሳይፈርፓንክ ጊዜ-ሰሌዳ" }, isTi)}>
      {/* Eyebrow */}
      <div className="flex items-center gap-2">
        <History className="h-4 w-4 text-orange-400" />
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-400">
          {t({ en: "Interactive 4.1", ti: "መስተጋብራዊ 4.1" }, isTi)}
        </p>
      </div>
      <h4 className="mt-1 text-lg font-bold text-zinc-100 sm:text-xl">
        {t(
          {
            en: "Cypherpunks & Early Digital Cash — Why They Failed",
            ti: "ሳይፈርፓንክስን ቀዳሞት ዲጂታላዊ ባጤራታትን — ስለምንታይ ፈሺሎም",
          },
          isTi
        )}
      </h4>

      {/* Intro */}
      <p className="mt-2 text-xs text-zinc-400 sm:text-sm">
        {t(
          {
            en: "In the 1990s, a group of computer rebels called cypherpunks believed that money controlled by governments and banks would destroy privacy and freedom. They tried to build digital cash — but each attempt had a fatal flaw.",
            ti: "ኣብ 1990ታት ሳይፈርፓንክ ዝበሃሉ ጉጅለ ዓመጽቲ ኮምፒተር ኣብ ሓደ ሓሳብ ይኣምኑ ነበሩ፦ ገንዘብ ብመንግስታትን ባንክታትን ምስ ቆጻጸሩ ብሕትውናን ናጽነትን ከም ዝጠፍእ። ዲጂታላዊ ጥረ ገንዘብ ንምህናጽ ፈቲኖም — ግን ነፍሲ ወከፍ ፈተነ ዝፈሸለሉ ሕጽኖት ነይርዎ።",
          },
          isTi
        )}
      </p>

      {/* Timeline tab buttons */}
      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {attempts.map((a, i) => {
          const IconComponent = a.icon;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(i)}
              className={`flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
                selected === i
                  ? `${a.borderColor} bg-zinc-900 ${a.textColor} shadow-md`
                  : "border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:border-zinc-600"
              }`}
            >
              <IconComponent className="h-4 w-4 shrink-0" />
              <span>{a.year}</span>
              <span className="font-bold">{a.name}</span>
            </button>
          );
        })}
      </div>

      {/* Detail card */}
      <div className={`mt-4 rounded-xl border p-4 space-y-3 ${current.borderColor} bg-zinc-950/60`}>
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className={`rounded-xl border p-2.5 bg-zinc-900/80 ${current.borderColor}`}>
            <CurrentIcon className={`h-6 w-6 ${current.textColor}`} />
          </div>
          <div>
            <p className={`text-lg font-black ${current.textColor}`}>{current.name}</p>
            <p className="text-xs text-zinc-400">{current.year} · {t(current.who, isTi)}</p>
          </div>
        </div>

        {/* Idea */}
        <div className="rounded-lg bg-zinc-900/80 px-3 py-2.5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
            {t({ en: "The Idea", ti: "ሓሳቡ" }, isTi)}
          </p>
          <p className="text-sm text-zinc-200">{t(current.idea, isTi)}</p>
        </div>

        {/* Outcome */}
        <div className={`rounded-lg border px-3 py-2.5 ${current.failureColor}`}>
          <div className="flex items-center gap-1.5 mb-1">
            {current.isSuccess ? (
              <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
            ) : (
              <X className="h-3.5 w-3.5 shrink-0 text-rose-400" />
            )}
            <p className="text-[11px] font-bold uppercase tracking-widest opacity-80">
              {t({ en: "What Happened", ti: "እንታይ ኮነ" }, isTi)}
            </p>
          </div>
          <p className="text-sm">{t(current.failure, isTi)}</p>
        </div>
      </div>

      {/* Pattern callout */}
      <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <Key className="h-4 w-4 text-amber-400 shrink-0" />
          <p className="text-xs font-bold text-amber-300">
            {t({ en: "The Pattern:", ti: "ቀንዲ ሕጽኖት፦" }, isTi)}
          </p>
        </div>
        <p className="mt-1 text-xs text-zinc-300">
          {t(
            {
              en: "Every attempt either relied on a central company (which could fail) or a central vault (which could be shut down). The missing ingredient was a system with NO central point of failure.",
              ti: "ነፍሲ ወከፍ ፈተነ ወይ ኣብ ማእከላይ ኩባንያ (ክትፈርስ እትኽእል) ወይ ኣብ ማእከላይ መኽዘን (ክዕጾ ዝኽእል) ተደጊፉ ነይሩ። እቲ ዝጎደለ መፍትሒ ዝኾነ ማእከላይ መጥቃዕቲ ዘይብሉ ስርዓት ምፍጣር እዩ ነይሩ።",
            },
            isTi
          )}
        </p>
      </div>

      {/* 2008 Bridge */}
      <div className="mt-6 rounded-xl border border-rose-500/30 bg-rose-500/5 px-4 py-4 space-y-2">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-rose-400 shrink-0" />
          <p className="text-xs font-bold uppercase tracking-widest text-rose-400">
            {t({ en: "The Crisis That Changed Everything — 2008", ti: "እቲ ኩሉ ዝቐየረ ቅልውላው — 2008" }, isTi)}
          </p>
        </div>
        <p className="text-sm text-zinc-300 leading-relaxed">
          {t(
            {
              en: "Then came 2008. The global financial crisis hit. Banks collapsed, families lost homes and life savings, and governments printed trillions to bail out the very institutions that caused the disaster — while ordinary citizens absorbed the loss.",
              ti: "ሽዑ 2008 መጸ። ዓለማዊ ፋይናንሳዊ ቅልውላው ወቒዑ። ባንክታት ፈሪሰን፡ ሰባት ገዛውተንን ዕቋረንን ስኢኖም፡ መንግስታት ድማ ነተን ነቲ ዕንወት ዝፈጠራ ትካላት ንምድሓን ትሪልዮናት ሓቲሞም — ተራ ሰባት ግን ዋጋ ከፊሎም ተረፉ።",
            },
            isTi
          )}
        </p>
      </div>

      {/* Satoshi reveal */}
      <div className="mt-4 rounded-xl border border-orange-400/40 bg-gradient-to-br from-orange-500/10 via-zinc-950/60 to-zinc-950 px-4 py-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-orange-500/40 bg-orange-500/10 p-2.5">
            <FileText className="h-6 w-6 text-orange-300" />
          </div>
          <div>
            <p className="text-base font-black text-orange-200">
              {t({ en: "Satoshi Nakamoto — October 31, 2008", ti: "ሳቶሺ ናካሞቶ — 31 ጥቅምቲ 2008" }, isTi)}
            </p>
            <p className="text-xs text-zinc-400 font-mono">
              {t({ en: "Bitcoin: A Peer-to-Peer Electronic Cash System", ti: "ቢትኮይን፦ ናይ ሰብ-ናብ-ሰብ ኤሌክትሮኒካዊ ጥረ ገንዘብ ስርዓት" }, isTi)}
            </p>
          </div>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed">
          {t(
            {
              en: "At that exact moment, Satoshi Nakamoto released a 9-page whitepaper describing a new form of money — pure digital cash with no central bank, no government, and no counterparty risk.",
              ti: "ኣብታ ልክዕ ህሞት፡ ሳቶሺ ናካሞቶ 9 ገጽ ዝሓዘ ጻዕዳ ወረቐት ኣውጺኡ ሓድሽ ዓይነት ገንዘብ ኣላልዩ — ማእከላይ ባንክ፡ መንግስቲ ወይ መንጎኛ ዘይብሉ ንጹር ዲጂታላዊ ጥረ ገንዘብ።",
            },
            isTi
          )}
        </p>

        {/* Three solved problems */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 mt-2">
          {[
            {
              icon: Building2,
              label: { en: "No Central Bank", ti: "ማእከላይ ባንክ የለን" },
              sub: { en: "No single point to shut down", ti: "ዝዕጾ ማእከል የብሉን" },
            },
            {
              icon: Layers,
              label: { en: "Fixed Supply", ti: "ቀዋሚ ደረት" },
              sub: { en: "Strict mathematical limit", ti: "ብሕሳብ ዝተወሰነ ደረት" },
            },
            {
              icon: Lock,
              label: { en: "Permissionless", ti: "ፍቓድ ዘየድልዮ" },
              sub: { en: "Censorship-resistant cash", ti: "ምዕጻው ዘይከኣል ጥረ ገንዘብ" },
            },
          ].map((item, i) => {
            const PillarIcon = item.icon;
            return (
              <div key={i} className="rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-2.5 text-center">
                <PillarIcon className="h-5 w-5 text-orange-300 mx-auto" />
                <p className="mt-1.5 text-xs font-bold text-orange-200">{t(item.label, isTi)}</p>
                <p className="mt-0.5 text-[10px] text-zinc-400">{t(item.sub, isTi)}</p>
              </div>
            );
          })}
        </div>

        <div className="rounded-lg border border-orange-500/40 bg-orange-500/10 px-3 py-2 text-center">
          <p className="text-xs font-bold text-orange-200">
            {t(
              {
                en: "\"For the first time in history, humans had digital money that no one could shut down, inflate, or control.\"",
                ti: "\"ኣብ ታሪኽ ንፈለማ እዋን ደቂ ሰባት ክዓጽዎ፡ ከንፍሖ፡ ወይ ክቆጻጸሮ ዘይክእል ዲጂታላዊ ገንዘብ ሒዞም።\"",
              },
              isTi
            )}
          </p>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   4.2  Haber & Stornetta Time-Stamping (1991–92): How It Works
   ========================================================================= */

function TimestampChainGraphic({ isTi }: { isTi: boolean }) {
  const [isTampered, setIsTampered] = useState<boolean>(false);

  return (
    <section className={panelClass} aria-label={t({ en: "Cryptographic Time-Stamping", ti: "ክሪፕቶግራፊካዊ ናይ ግዜ-ማሕተም" }, isTi)}>
      {/* Eyebrow */}
      <div className="flex items-center gap-2">
        <Link2 className="h-4 w-4 text-cyan-400" />
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-400">
          {t({ en: "Interactive 4.2", ti: "መስተጋብራዊ 4.2" }, isTi)}
        </p>
      </div>
      <h4 className="mt-1 text-lg font-bold text-zinc-100 sm:text-xl">
        {t(
          {
            en: "How Cryptographic Time-Stamping Works (Haber & Stornetta 1991)",
            ti: "ክሪፕቶግራፊካዊ ናይ ግዜ-ማሕተም ብኸመይ ይሰርሕ (ሃበርን ስቶርኔታን 1991)",
          },
          isTi
        )}
      </h4>

      {/* Intro */}
      <p className="mt-2 text-xs text-zinc-400 sm:text-sm">
        {t(
          {
            en: "In 1991, Stuart Haber and W. Scott Stornetta solved a big problem: how can you prove a digital document existed at a specific time without trusting a central authority? Their solution became the foundation of Bitcoin's blockchain.",
            ti: "ኣብ 1991፡ ስቱዋርት ሃበርን ደብሊው ስኮት ስቶርኔታን ሓደ ዓቢ ሕቶ ፈቲሖም፦ ሓደ ዲጂታላዊ ሰነድ ኣብ ሓደ ፍሉይ ግዜ ከም ዝነበረ ብዘይ ማእከላይ ትካል ብኸመይ ከተረጋግጽ ትኽእል? እዚ መፍትሒ እዚ መሰረት ናይ ቢትኮይን ብሎክቸይን ኮነ።",
          },
          isTi
        )}
      </p>

      {/* Interactive Controls */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
        <span className="text-xs font-semibold text-zinc-300">
          {t({ en: "Test the Time-Stamp Chain:", ti: "ነቲ ናይ ግዜ-ማሕተም ሰንሰለት ፈትኖ፦" }, isTi)}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsTampered(false)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              !isTampered
                ? "border border-emerald-500/60 bg-emerald-500/20 text-emerald-200 shadow-sm"
                : "border border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300 shrink-0" />
            <span>{t({ en: "Genuine Chain", ti: "ትክክለኛ ሰንሰለት" }, isTi)}</span>
          </button>
          <button
            type="button"
            onClick={() => setIsTampered(true)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              isTampered
                ? "border border-rose-500/60 bg-rose-500/20 text-rose-200 shadow-sm"
                : "border border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5 text-rose-300 shrink-0" />
            <span>{t({ en: "Alter Document A (Tamper)", ti: "ንሰነድ A ቀይሮ (ምጭብርባር)" }, isTi)}</span>
          </button>
        </div>
      </div>

      {/* Chain Status Banner */}
      <div
        className={`mt-3 flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-center text-xs font-mono font-bold transition-all ${
          !isTampered
            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
            : "border-rose-500/50 bg-rose-500/15 text-rose-300"
        }`}
      >
        {!isTampered ? (
          <ShieldCheck className="h-4 w-4 text-emerald-300 shrink-0" />
        ) : (
          <AlertTriangle className="h-4 w-4 text-rose-300 shrink-0 animate-bounce" />
        )}
        <span>
          {!isTampered
            ? t({ en: "STATUS: CHAIN VALID — All hashes match perfectly!", ti: "ኩነታት፦ ሰንሰለት ትክክል እዩ — ኩሎም ኣሰራት ብልክዕ ገጢሞም!" }, isTi)
            : t({ en: "STATUS: FRAUD DETECTED! Altering Document A broke the entire chain downstream!", ti: "ኩነታት፦ ምጭብርባር ተረኺቡ! ንሰነድ A ምቕያር ንኩሉ ሰንሰለት ኣፍሪስዎ!" }, isTi)}
        </span>
      </div>

      {/* Visual Chain: Block 1 -> Block 2 -> Block 3 */}
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        {/* Document 1 */}
        <div
          className={`rounded-xl border p-3.5 transition-all ${
            !isTampered
              ? "border-emerald-500/40 bg-zinc-950/80 shadow-md"
              : "border-rose-500/70 bg-rose-950/20 shadow-lg shadow-rose-500/10"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              {t({ en: "Record 1 (1991)", ti: "ሰነድ 1 (1991)" }, isTi)}
            </span>
            <span
              className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                !isTampered ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/30 text-rose-300"
              }`}
            >
              {!isTampered ? (
                <>
                  <Check className="h-3 w-3 text-emerald-300" />
                  <span>Intact</span>
                </>
              ) : (
                <>
                  <X className="h-3 w-3 text-rose-300" />
                  <span>Altered</span>
                </>
              )}
            </span>
          </div>

          <div className="mt-2 rounded bg-zinc-900/90 p-2 text-xs">
            <p className="text-[10px] font-semibold text-zinc-500 uppercase">{t({ en: "Data:", ti: "ትሕዝቶ፦" }, isTi)}</p>
            <p className={`font-mono font-semibold ${!isTampered ? "text-zinc-200" : "text-rose-300 line-through"}`}>
              {t({ en: "Doc A: 'Patent Claim #401'", ti: "ሰነድ A፦ 'ናይ መሃዝነት መሰል #401'" }, isTi)}
            </p>
            {isTampered && (
              <p className="font-mono text-[11px] font-bold text-rose-400">
                {t({ en: "Altered: 'Fake Patent Claim'", ti: "ዝተለወጠ፦ 'ናይ ሓሶት መሃዝነት'" }, isTi)}
              </p>
            )}
            <p className="mt-1 text-[10px] text-zinc-500">1991-04-12 09:14:02 UTC</p>
          </div>

          <div className="mt-2 space-y-1 text-[11px] font-mono">
            <div className="flex justify-between text-zinc-500 text-[10px]">
              <span>Prev Hash:</span>
              <span>00000000 (Genesis)</span>
            </div>
            <div
              className={`flex justify-between rounded px-2 py-1 font-bold ${
                !isTampered ? "bg-emerald-500/15 text-emerald-300" : "bg-rose-500/20 text-rose-300"
              }`}
            >
              <span>Hash Output:</span>
              <span>{!isTampered ? "#A8F2" : "#FF00"}</span>
            </div>
          </div>
        </div>

        {/* Document 2 */}
        <div
          className={`rounded-xl border p-3.5 transition-all ${
            !isTampered
              ? "border-emerald-500/40 bg-zinc-950/80 shadow-md"
              : "border-rose-500/40 bg-zinc-950/80 opacity-90"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              {t({ en: "Record 2 (1992)", ti: "ሰነድ 2 (1992)" }, isTi)}
            </span>
            <span
              className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                !isTampered ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-400"
              }`}
            >
              {!isTampered ? (
                <>
                  <Check className="h-3 w-3 text-emerald-300" />
                  <span>Linked</span>
                </>
              ) : (
                <>
                  <Zap className="h-3 w-3 text-rose-400" />
                  <span>Broken Link</span>
                </>
              )}
            </span>
          </div>

          <div className="mt-2 rounded bg-zinc-900/90 p-2 text-xs">
            <p className="text-[10px] font-semibold text-zinc-500 uppercase">{t({ en: "Data:", ti: "ትሕዝቶ፦" }, isTi)}</p>
            <p className="font-mono text-zinc-200">
              {t({ en: "Doc B: 'Land Title Transfer'", ti: "ሰነድ B፦ 'ምስግጋር ወረቐት ባይታ'" }, isTi)}
            </p>
            <p className="mt-1 text-[10px] text-zinc-500">1992-06-20 14:22:15 UTC</p>
          </div>

          <div className="mt-2 space-y-1 text-[11px] font-mono">
            <div
              className={`flex justify-between rounded px-1.5 py-0.5 text-[10px] ${
                !isTampered ? "text-emerald-400" : "bg-rose-500/20 text-rose-300 font-bold"
              }`}
            >
              <span>Includes Prev:</span>
              <span>{!isTampered ? "#A8F2 (Matches)" : "Expected #A8F2"}</span>
            </div>
            <div
              className={`flex justify-between rounded px-2 py-1 font-bold ${
                !isTampered ? "bg-emerald-500/15 text-emerald-300" : "bg-zinc-800 text-zinc-500"
              }`}
            >
              <span>Hash Output:</span>
              <span>{!isTampered ? "#4C7B" : "INVALID"}</span>
            </div>
          </div>
        </div>

        {/* Document 3 */}
        <div
          className={`rounded-xl border p-3.5 transition-all ${
            !isTampered
              ? "border-emerald-500/40 bg-zinc-950/80 shadow-md"
              : "border-rose-500/40 bg-zinc-950/80 opacity-90"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              {t({ en: "Record 3 (1993)", ti: "ሰነድ 3 (1993)" }, isTi)}
            </span>
            <span
              className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                !isTampered ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-400"
              }`}
            >
              {!isTampered ? (
                <>
                  <Check className="h-3 w-3 text-emerald-300" />
                  <span>Linked</span>
                </>
              ) : (
                <>
                  <Zap className="h-3 w-3 text-rose-400" />
                  <span>Broken Link</span>
                </>
              )}
            </span>
          </div>

          <div className="mt-2 rounded bg-zinc-900/90 p-2 text-xs">
            <p className="text-[10px] font-semibold text-zinc-500 uppercase">{t({ en: "Data:", ti: "ትሕዝቶ፦" }, isTi)}</p>
            <p className="font-mono text-zinc-200">
              {t({ en: "Doc C: 'Business Contract'", ti: "ሰነድ C፦ 'ናይ ንግዲ ውዕል'" }, isTi)}
            </p>
            <p className="mt-1 text-[10px] text-zinc-500">1993-11-05 18:40:50 UTC</p>
          </div>

          <div className="mt-2 space-y-1 text-[11px] font-mono">
            <div
              className={`flex justify-between rounded px-1.5 py-0.5 text-[10px] ${
                !isTampered ? "text-emerald-400" : "bg-rose-500/20 text-rose-300 font-bold"
              }`}
            >
              <span>Includes Prev:</span>
              <span>{!isTampered ? "#4C7B (Matches)" : "Chain Broken"}</span>
            </div>
            <div
              className={`flex justify-between rounded px-2 py-1 font-bold ${
                !isTampered ? "bg-emerald-500/15 text-emerald-300" : "bg-zinc-800 text-zinc-500"
              }`}
            >
              <span>Hash Output:</span>
              <span>{!isTampered ? "#9E03" : "INVALID"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Step Breakdown */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 text-center">
          <Fingerprint className="h-6 w-6 text-cyan-300 mx-auto" />
          <p className="mt-2 text-xs font-bold text-cyan-300">
            {t({ en: "1. Fingerprint (Hash)", ti: "1. ዲጂታላዊ ኣሰር (Hash)" }, isTi)}
          </p>
          <p className="mt-1 text-[11px] text-zinc-400">
            {t(
              {
                en: "Any document turns into a unique cryptographic hash code. Even a 1-character edit creates a completely different hash.",
                ti: "ዝኾነ ሰነድ ናብ ሓደ ፍሉይ ክሪፕቶግራፊካዊ ኮድ ይቕየር። ሓንቲ ፊደል እንተ ተቐይራ፡ እቲ ኣሰር ብሙሉኡ ይቕየር።",
              },
              isTi
            )}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 text-center">
          <Link2 className="h-6 w-6 text-amber-300 mx-auto" />
          <p className="mt-2 text-xs font-bold text-amber-300">
            {t({ en: "2. Chaining", ti: "2. ሰንሰለታዊ ምትእስሳር" }, isTi)}
          </p>
          <p className="mt-1 text-[11px] text-zinc-400">
            {t(
              {
                en: "Every new record includes the previous record's hash inside it. This links all records in an unbroken, chronological chain.",
                ti: "ነፍሲ ወከፍ ሓድሽ ሰነድ ናይቲ ቅድሚኡ ዝነበረ ሰነድ ኣሰር ኣብ ውሽጡ የጠቓልል። እዚ ንኹሎም ሰነዳት ኣብ ዘይስበር ሰንሰለት የኣስሮም።",
              },
              isTi
            )}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 text-center">
          <ShieldCheck className="h-6 w-6 text-emerald-300 mx-auto" />
          <p className="mt-2 text-xs font-bold text-emerald-300">
            {t({ en: "3. Tamper-Proof History", ti: "3. ዘይጭበርበር ታሪኽ" }, isTi)}
          </p>
          <p className="mt-1 text-[11px] text-zinc-400">
            {t(
              {
                en: "To secretly alter one past record, an attacker must recalculate every block that came after it — which is mathematically detectable.",
                ti: "ኣብ ዝሓለፈ ሓደ ሰነድ ብስቱር ንምቕያር፡ ሓደ ሰብ ንኹሎም ድሕሪኡ ዝመጹ ብሎካት ክቕይሮም ኣለዎ — እዚ ድማ ብቐሊሉ ይፍለጥ።",
              },
              isTi
            )}
          </p>
        </div>
      </div>

      {/* The New York Times Classifieds Breakthrough */}
      <div className="mt-5 rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4">
        <div className="flex items-start gap-3">
          <Newspaper className="h-6 w-6 text-cyan-300 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-cyan-300">
              {t(
                {
                  en: "Real History: The New York Times Classified Ads (1995)",
                  ti: "ናይ ሓቂ ታሪኽ፦ ኣብ ጋዜጣ ኒው ዮርክ ታይምስ ዝወጸ ማሕተም (1995)",
                },
                isTi
              )}
            </p>
            <p className="mt-1 text-xs text-zinc-300 sm:text-sm leading-relaxed">
              {t(
                {
                  en: "Before decentralized blockchains existed, Haber and Stornetta's company (Surety) proved their database was untampered by publishing their weekly master hash in the Sunday New York Times classified section under 'Notices'. Because millions of physical newspapers were printed worldwide, no government or company could alter past history without rounding up every paper on earth!",
                  ti: "ዲሴንትራላይዝድ ብሎክቸይን ቅድሚ ምምጻኡ፡ ሃበርን ስቶርኔታን (ኩባንያ Surety) መዝገቦም ከም ዘይተጨበርበረ ንምርግጋጽ፡ ነቲ ናይ ሰሙን ዋና ኣሰር (master hash) ኣብ ሰንበት ጋዜጣ ኒው ዮርክ ታይምስ ኣብ ዓምዲ ምልክታታት ይሓትምዎ ነበሩ። ሚልዮናት ጋዜጣታት ኣብ ዓለም ስለ ዝተዘርገሑ፡ ዝኾነ መንግስቲ ወይ ኩባንያ ነቲ ታሪኽ ክጭበርብሮ ኣይክእልን ነበረ!",
                },
                isTi
              )}
            </p>
            <div className="mt-2.5 inline-flex items-center gap-1.5 rounded bg-cyan-500/10 px-2.5 py-1 text-[11px] font-mono text-cyan-300 border border-cyan-500/20">
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              <span>
                {t(
                  {
                    en: "Satoshi Nakamoto cited Haber & Stornetta 3 times in the Bitcoin whitepaper (references #2, #3, and #4)!",
                    ti: "ሳቶሺ ናካሞቶ ንሃበርን ስቶርኔታን ኣብ ናይ ቢትኮይን ጻዕዳ ወረቐት 3 ግዜ ጠቒስዎም (መወከሲ #2፣ #3ን #4ን)!",
                  },
                  isTi
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   Main Chapter 4 Export
   ========================================================================= */
export type Chapter4Module = "cypherpunk_timeline" | "timestamp_chain";

export function Chapter4InteractiveLesson({
  module,
  isTi,
}: {
  module: Chapter4Module;
  isTi: boolean;
}) {
  switch (module) {
    case "cypherpunk_timeline":
      return <CypherpunkTimelineGraphic isTi={isTi} />;
    case "timestamp_chain":
      return <TimestampChainGraphic isTi={isTi} />;
  }
}
