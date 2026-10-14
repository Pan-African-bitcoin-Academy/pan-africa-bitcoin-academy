'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export function HeroCtaButtons() {
  const { language } = useLanguage();
  const isTigrinya = language === 'ti';

  return (
    <div className="flex flex-col items-stretch sm:items-center sm:justify-center gap-3 sm:gap-4 sm:flex-row w-full sm:w-auto">
      <Link
        href="/apply"
        className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 via-orange-400 to-purple-500 px-6 sm:px-8 py-4 min-h-[52px] text-base font-semibold text-black shadow-[0_0_40px_rgba(249,115,22,0.8)] transition active:brightness-110 active:scale-95 touch-target w-full sm:w-auto"
      >
        {isTigrinya ? "ናብ ቀዳማይ ጉጅለ ተጸንበሩ" : "Join Cohort 1"}
      </Link>
      <Link
        href="/chapters"
        className="inline-flex items-center justify-center rounded-full border-2 border-orange-400/50 bg-orange-400/10 px-6 sm:px-8 py-4 min-h-[52px] text-base font-semibold text-orange-300 backdrop-blur-sm transition active:bg-orange-400/20 active:scale-95 touch-target w-full sm:w-auto"
      >
        {isTigrinya ? "መንገድታት ትምህርቲ ዳህስሱ" : "Explore Learning Paths"}
      </Link>
    </div>
  );
}
