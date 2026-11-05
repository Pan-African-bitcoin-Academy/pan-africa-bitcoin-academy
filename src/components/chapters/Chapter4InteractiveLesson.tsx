"use client";

import { useState } from "react";

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
  emoji: string;
  who: Localized;
  idea: Localized;
  failure: Localized;
  failureColor: string;
  borderColor: string;
  textColor: string;
};

const attempts: Attempt[] = [
  {
    year: "1983",
    name: "DigiCash",
    emoji: "💳",
    who: { en: "David Chaum", ti: "ዴቪድ ቻውም" },
    idea: {
      en: "First ever digital cash — anonymous, cryptographically protected payments.",
      ti: "ቀዳምነት ዲጂታላዊ ጥረ ገንዘብ — ስሱር፡ ብክሪፕቶ ዝሕሉ ምትሕልላፍ ክፍሊት።",
    },
    failure: {
      en: "❌ Required a central company to operate. When the company went bankrupt in 1998, DigiCash died with it.",
      ti: "❌ ንምስራሕ ማእከላይ ኩባንያ ይሓትት ነይሩ። እቲ ኩባንያ ኣብ 1998 ምስ ፈሸለ፡ DigiCash ምስኡ ሞተ።",
    },
    failureColor: "bg-red-500/10 border-red-500/30 text-red-300",
    borderColor: "border-purple-500/40",
    textColor: "text-purple-300",
  },
  {
    year: "1996",
    name: "E-Gold",
    emoji: "🥇",
    who: { en: "Douglas Jackson", ti: "ዳግላስ ጃክሰን" },
    idea: {
      en: "Digital currency backed by real gold — a return to sound money on the internet.",
      ti: "ብሓቀኛ ወርቂ ዝድገፍ ዲጂታላዊ ባጤራ — ናብ ጥዑይ ገንዘብ ምምላስ ኣብ ኢንተርኔት።",
    },
    failure: {
      en: "❌ US Government shut it down in 2008, charging operators with money laundering. No decentralization = easy target.",
      ti: "❌ ናይ ኣሜሪካ መንግስቲ ኣብ 2008 ዓጺዮም፡ ኦፐረተራት ብናይ ገንዘብ ምሕጻብ ክሲ ኣቕሪቦምሎም። ዘይ-ዲሴንትራሊዝድ = ቀሊል ኣሸናፊ።",
    },
    failureColor: "bg-red-500/10 border-red-500/30 text-red-300",
    borderColor: "border-yellow-500/40",
    textColor: "text-yellow-300",
  },
  {
    year: "1997",
    name: "Hashcash",
    emoji: "⛏️",
    who: { en: "Adam Back", ti: "ኣዳም ባክ" },
    idea: {
      en: "Invented to fight email spam — computers had to solve a small puzzle before sending mail, making spam expensive.",
      ti: "ንኢሜይል ስፓም ንምምካት ዝተፈጥረ — ኮምፒተራት ቅድሚ ኢሜይል ምስዳድ ንእሽቶ ሽግር ክፈትሑ ይሓትት ነይሩ፡ ስፓምን ክቡር ገይሩ።",
    },
    failure: {
      en: "✅ Not a currency — but its 'Proof of Work' puzzle idea directly inspired Bitcoin mining. Satoshi cited Adam Back's work in the Bitcoin whitepaper.",
      ti: "✅ ባጤራ ኣይኮነን — ሓሳቡ ናይ 'Proof of Work' ሽግር ግን ንዕደና ቢትኮይን ቀጥታ ኣነቓቒሑ። ሳቶሺ ናይ ኣዳም ባክ ስራሕ ኣብ ናይ ቢትኮይን ጻዕዳ ወረቐት ጠቒሱ።",
    },
    failureColor: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    borderColor: "border-orange-500/40",
    textColor: "text-orange-300",
  },
];

function CypherpunkTimelineGraphic({ isTi }: { isTi: boolean }) {
  const [selected, setSelected] = useState<number>(0);
  const current = attempts[selected];

  return (
    <section className={panelClass} aria-label={t({ en: "Cypherpunk Timeline", ti: "ናይ ሳይፈርፓንክ ጊዜ-ሰሌዳ" }, isTi)}>
      {/* Eyebrow */}
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-400">
        {t({ en: "Interactive 4.1", ti: "መስተጋብራዊ 4.1" }, isTi)}
      </p>
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
            ti: "ኣብ 1990ታት ሳይፈርፓንክ ዝበሃሉ ጉጅለ ዓመጽቲ ኮምፒተር ኣብ ሓደ ሓሳብ ይኣምኑ ነበሩ: ገንዘብ ብመንግስታትን ባንክታትን ምስ ቆጻጸሩ ብሕትውናን ናጽነትን ከም ዝጠፍእ። ዲጂታላዊ ጥረ ገንዘብ ንምህናጽ ፈቲኖም — ግን ነፍሲ ወከፍ ፈተነ ሞይቱ ዝጸንሓሉ ቅሉዕ ሕጽኖት ነይሮ።",
          },
          isTi
        )}
      </p>

      {/* Timeline tab buttons */}
      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {attempts.map((a, i) => (
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
            <span>{a.emoji}</span>
            <span>{a.year}</span>
            <span className="font-bold">{a.name}</span>
          </button>
        ))}
      </div>

      {/* Detail card */}
      <div className={`mt-4 rounded-xl border p-4 space-y-3 ${current.borderColor} bg-zinc-950/60`}>
        {/* Header */}
        <div className="flex items-center gap-3">
          <span className="text-4xl">{current.emoji}</span>
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
          <p className="text-[11px] font-bold uppercase tracking-widest mb-1 opacity-70">
            {t({ en: "What Happened", ti: "እንታይ ኮነ" }, isTi)}
          </p>
          <p className="text-sm">{t(current.failure, isTi)}</p>
        </div>
      </div>

      {/* Pattern callout */}
      <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3">
        <p className="text-xs font-bold text-amber-300">
          {t({ en: "🔑 The Pattern:", ti: "🔑 ቅርጺ:" }, isTi)}
        </p>
        <p className="mt-1 text-xs text-zinc-300">
          {t(
            {
              en: "Every attempt either relied on a central company (which could fail or be bought) or was shut down by governments. The missing ingredient: a system with NO central point to attack.",
              ti: "ነፍሲ ወከፍ ፈተነ ወይ ኣብ ማእከላይ ኩባንያ ደሊዩ (ዝፈሸል ወይ ዝዕደግ ዝኽእል) ወይ ብመንግስታት ተዓጺዩ። ዝጎደለ ኣካል: ዝኾነ ማእከላይ ቦታ ዘይብሉ ስርዓት።",
            },
            isTi
          )}
        </p>
      </div>

      {/* 2008 Bridge */}
      <div className="mt-6 rounded-xl border border-rose-500/30 bg-rose-500/5 px-4 py-4 space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-rose-400">
          {t({ en: "⚡ The Crisis That Changed Everything — 2008", ti: "⚡ ቅልውላው ዝቐየረ ኩሉ — 2008" }, isTi)}
        </p>
        <p className="text-sm text-zinc-300">
          {t(
            {
              en: "Then came 2008. The global financial crisis hit. Banks collapsed, people lost their homes and life savings, and governments printed trillions to bail out the very institutions that caused the disaster — while ordinary people got nothing.",
              ti: "ሽዑ 2008 መጸ። ዓለማዊ ፋይናንሳዊ ቅልውላው ወቒዑ። ባንክታት ፈሪሰን፡ ሰባት ገዛውቲ ስኢነን፡ ዕቋሮም ጠፊኡ፡ መንግስታት ድማ ነተን ኣብ ቀዳምነት ነቲ ሕቶ ዝፈጠራ ትካላት ዋሕስ ምውጻእ ትሪልዮናት ሓቲሞም — ተራ ሰባት ግን ምንም ኣይረኸቡን።",
            },
            isTi
          )}
        </p>
      </div>

      {/* Satoshi reveal */}
      <div className="mt-4 rounded-xl border border-orange-400/40 bg-gradient-to-br from-orange-500/10 to-zinc-950 px-4 py-4 space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-4xl">📄</span>
          <div>
            <p className="text-base font-black text-orange-200">
              {t({ en: "Satoshi Nakamoto — October 31, 2008", ti: "ሳቶሺ ናካሞቶ — 31 ጥቅምቲ 2008" }, isTi)}
            </p>
            <p className="text-xs text-zinc-400">
              {t({ en: "Bitcoin: A Peer-to-Peer Electronic Cash System", ti: "ቢትኮይን፦ ናይ ሰብ-ናብ-ሰብ ኤሌክትሮኒካዊ ጥረ ገንዘብ ስርዓት" }, isTi)}
            </p>
          </div>
        </div>

        <p className="text-sm text-zinc-300">
          {t(
            {
              en: "At that exact moment, someone (or a group) using the name Satoshi Nakamoto released a 9-page whitepaper describing a new kind of money — digital cash with no bank, no government, no central company. Something that could never be shut down.",
              ti: "ኣብታ ልክዕ ህሞት፡ ሳቶሺ ናካሞቶ ዝተባህለ ሰብ (ወይ ጉጅለ) 9 ገጽ ዝሓዘ ጻዕዳ ወረቐት ኣውጺኡ ሓድሽ ዓይነት ገንዘብ ይገልጽ — ባንክ ዘይሓትት፡ መንግስቲ ዘይሓትት፡ ማእከላይ ኩባንያ ዘይሓትት ዲጂታላዊ ጥረ ገንዘብ። ዝኾነ ሰብ ክዓጽዎ ዘይክእሎ ነገር።",
            },
            isTi
          )}
        </p>

        {/* Three solved problems */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 mt-2">
          {[
            {
              icon: "🏛️",
              label: { en: "No Central Bank", ti: "ማእከላይ ባንክ የለን" },
              sub: { en: "No single point to shut down", ti: "ዝዓጽዎ ማእከል የለን" },
            },
            {
              icon: "🖨️",
              label: { en: "Fixed Supply", ti: "ቀዋሚ ቀረብ" },
              sub: { en: "Nobody can print more Bitcoin", ti: "ዝያዳ ቢትኮይን ዝሕትም ሰብ የለን" },
            },
            {
              icon: "🔐",
              label: { en: "No Permission Needed", ti: "ፍቓድ ኣየድልን" },
              sub: { en: "Anyone, anywhere can use it", ti: "ዝኾነ ሰብ፡ ኣብ ዝኾነ ቦታ ክጥቀመሉ ይኽእል" },
            },
          ].map((item, i) => (
            <div key={i} className="rounded-lg border border-zinc-700 bg-zinc-900/80 px-3 py-2.5 text-center">
              <span className="text-2xl">{item.icon}</span>
              <p className="mt-1 text-xs font-bold text-orange-200">{t(item.label, isTi)}</p>
              <p className="mt-0.5 text-[10px] text-zinc-400">{t(item.sub, isTi)}</p>
            </div>
          ))}
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
   Main Chapter 4 Export
   ========================================================================= */
export type Chapter4Module = "cypherpunk_timeline";

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
  }
}
