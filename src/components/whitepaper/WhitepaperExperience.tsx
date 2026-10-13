'use client';

import Link from 'next/link';

export function WhitepaperExperience() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10 text-center">
        <span className="inline-block rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-300">
          ናይ ሳቶሺ ናካሞቶ ወረቐት
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          ቢትኮይን፡ ስርዓት ናይ መዘና-ናብ-መዘና ኤሌክትሮኒካዊ ገንዘብ
        </h1>
        <p className="mt-3 text-lg text-zinc-400">
          Bitcoin: A Peer-to-Peer Electronic Cash System — ትርጉም ብትግርኛ
        </p>
      </header>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6 sm:p-10 space-y-6 text-zinc-300 leading-relaxed text-base sm:text-lg">
        <h2 className="text-xl font-bold text-orange-200">ጽሟቕ (Abstract)</h2>
        <p>
          ምሉእ ብምሉእ መዘና-ናብ-መዘና ዝኾነ ስሪት ናይ ኤሌክትሮኒካዊ ገንዘብ፡ ብዘይ ገለ ናይ ፋይናንስ ትካል ኣቢሉ ካብ ሓደ ወገን ናብ ካልእ ወገን ኦንላይን ክፍሊታት ብቐጥታ ንኽስደድ የኽእል። ዲጂታላዊ ፌርማታት ናይዚ ፍታሕ ሓደ ክፋል ይህቡ፡ እንተኾነ ግን እቲ ዓቢ ረብሓታት ካልኣይ ሳልሳይ ወገን ንምዕጋት ዕጽፊ-ወጻኢታት ዘድሊ እንተኾይኑ ይጠፍእ።
        </p>
        <p>
          ንሕና ንጸገም ዕጽፊ-ወጻኢታት መዘና-ናብ-መዘና መርበብ ብምጥቃም ፍታሕ ነቕርብ። እቲ መርበብ ንትራንዛክሽናት ናብ ቀጻሊ ሰንሰለት ናይ መርትዖ-ስራሕ (Proof-of-Work) ብምቕያር የረጋግጾም፡ እዚ ድማ መርትዖ-ስራሕ ዳግማይ ከይተሰርሐ ክቕየር ዘይክእል መዝገብ ይፈጥር።
        </p>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/chapters"
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-orange-400 to-cyan-400 px-6 py-3.5 text-base font-semibold text-black transition hover:brightness-110"
        >
          ናብ ትምህርትታት ቢትኮይን ኪድ
        </Link>
      </div>
    </div>
  );
}

export default WhitepaperExperience;
