"use client";

import Link from "next/link";
import { AnimatedSection } from "@/components/AnimatedSection";
import { AnimatedHeading } from "@/components/AnimatedHeading";
import SplitText from "@/components/SplitText";
import { BitcoinP2PNetworkAnimation } from "@/components/BitcoinP2PNetworkAnimation";
import { useLanguage } from "@/contexts/LanguageContext";
import { getAboutCopy } from "@/lib/translations/about";

export default function AboutPage() {
  const { language } = useLanguage();
  const isTi = language === "ti";
  const t = getAboutCopy(language);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-black text-zinc-100 selection:bg-orange-500/30 selection:text-orange-200">
      
      {/* 1. Dynamic Bitcoin P2P Network Background Canvas */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <BitcoinP2PNetworkAnimation className="h-full w-full" />
        
        {/* Soft Ambient Radial Lights */}
        <div className="absolute -top-40 left-1/2 h-[500px] w-full max-w-7xl -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/15 via-cyan-500/10 to-transparent blur-3xl opacity-70" />

        {/* Translucent dark shade over canvas to ensure text is crisp and readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60 backdrop-blur-[0.5px]" />
      </div>

      {/* 2. Main Page Content */}
      <div className="relative z-10 w-full">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          
          {/* Hero Section */}
          <AnimatedSection animation="slideUp">
            <div className="relative mx-auto max-w-4xl text-center pt-2 pb-6">
              {/* Main Headline */}
              <AnimatedHeading as="h1" className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl leading-[1.28] sm:leading-[1.3] max-w-3xl mx-auto">
                <SplitText
                  text={t.hero.heading}
                  tag="span"
                  className="inline-block"
                  delay={30}
                  duration={1.1}
                  ease="power2.out"
                  splitType="words"
                  from={{ opacity: 0, y: 30 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-50px"
                  textAlign="center"
                />
              </AnimatedHeading>
            </div>
          </AnimatedSection>

          {/* Core Identity Banner */}
          <AnimatedSection animation="slideUp">
            <div className="mt-6 relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-zinc-900/90 via-zinc-950/95 to-black p-6 sm:p-10 shadow-[0_0_60px_rgba(6,182,212,0.15)] backdrop-blur-xl">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
              <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />

              <div className="relative mx-auto max-w-3xl text-center z-10">
                <span className="inline-block rounded-full bg-cyan-500/20 px-4 py-1 text-xs font-semibold tracking-wide text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                  {t.core_identity.label}
                </span>
                <p className="mt-5 text-base sm:text-lg lg:text-xl font-normal leading-relaxed text-zinc-200">
                  “{t.core_identity.body}”
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Main Content Sections */}
          <div className="mt-20 space-y-16 sm:space-y-24">
            
            {/* Mission & Philosophy */}
            <AnimatedSection animation="slideRight">
              <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/80 p-8 sm:p-12 shadow-2xl backdrop-blur-md">
                <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
                <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />

                <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
                  <div className="lg:col-span-7 space-y-6">
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
                      <span className="h-1.5 w-6 rounded-full bg-orange-400" />
                      <span>{t.mission.badge}</span>
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                      {t.mission.heading}
                    </h2>
                    <p className="text-base sm:text-lg leading-relaxed text-zinc-300">
                      {t.mission.body}
                    </p>
                  </div>

                  <div className="lg:col-span-5 space-y-4">
                    <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-zinc-900/90 to-zinc-950 p-6 sm:p-8 shadow-lg shadow-cyan-950/30">
                      <div className="text-4xl font-serif text-cyan-400/40">“</div>
                      <p className="relative -mt-4 text-base sm:text-lg font-semibold italic text-cyan-100">
                        {t.mission.quote}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-orange-500/30 bg-orange-500/10 p-6 text-orange-100 backdrop-blur-sm">
                      <p className="text-sm sm:text-base font-normal text-orange-200/90">{t.mission.disclaimer_1}</p>
                      <p className="mt-2 text-base sm:text-lg font-semibold text-orange-300">{t.mission.disclaimer_2}</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Who It Is For - 3 Rich Cards */}
            <AnimatedSection animation="slideLeft">
              <div>
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <div className="inline-block rounded-full bg-zinc-900 px-3 py-1 text-xs font-mono text-zinc-400 border border-zinc-800 mb-3">
                    AUDIENCE
                  </div>
                  <AnimatedHeading as="h2" className="text-2xl font-bold tracking-tight text-white sm:text-4xl">
                    {t.who_its_for.heading}
                  </AnimatedHeading>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {/* Group 1: New Learners */}
                  <div className="relative group overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 sm:p-8 hover:border-orange-500/50 transition-all duration-300 shadow-lg">
                    <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-500/5 blur-2xl group-hover:bg-orange-500/15 transition-all" />
                    
                    <div className="relative z-10">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400 border border-orange-500/30 mb-6 font-mono font-bold text-sm">
                        01
                      </div>
                      <h3 className="text-lg font-bold text-white mb-4">
                        {t.who_its_for.group_1.title}
                      </h3>
                      <ul className="space-y-3.5 text-sm sm:text-base text-zinc-300">
                        {t.who_its_for.group_1.items.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Group 2: Tech Deep-Dive */}
                  <div className="relative group overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 sm:p-8 hover:border-cyan-500/50 transition-all duration-300 shadow-lg">
                    <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-500/5 blur-2xl group-hover:bg-cyan-500/15 transition-all" />

                    <div className="relative z-10">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 mb-6 font-mono font-bold text-sm">
                        02
                      </div>
                      <h3 className="text-lg font-bold text-white mb-4">
                        {t.who_its_for.group_2.title}
                      </h3>
                      <p className="text-sm sm:text-base leading-relaxed text-zinc-300">
                        {t.who_its_for.group_2.body}
                      </p>
                    </div>
                  </div>

                  {/* Group 3: Future Developers */}
                  <div className="relative group overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 sm:p-8 hover:border-purple-500/50 transition-all duration-300 shadow-lg">
                    <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-purple-500/5 blur-2xl group-hover:bg-purple-500/15 transition-all" />

                    <div className="relative z-10">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-400 border border-purple-500/30 mb-6 font-mono font-bold text-sm">
                        03
                      </div>
                      <h3 className="text-lg font-bold text-white mb-4">
                        {t.who_its_for.group_3.title}
                      </h3>
                      <p className="text-sm sm:text-base leading-relaxed text-zinc-300">
                        {t.who_its_for.group_3.body}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Developer Support & Contributors */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Dev Support Card */}
              <AnimatedSection animation="slideRight">
                <div className="relative h-full overflow-hidden rounded-3xl border border-cyan-500/25 bg-zinc-950/85 p-6 sm:p-10 shadow-[0_0_35px_rgba(6,182,212,0.1)] flex flex-col justify-between">
                  <div className="pointer-events-none absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

                  <div className="relative z-10">
                    <div className="inline-block rounded-xl bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-300 border border-cyan-500/25 mb-5">
                      {t.developer_support.badge}
                    </div>
                    <AnimatedHeading as="h2" className="text-xl font-bold text-white sm:text-2xl lg:text-3xl mb-6">
                      {t.developer_support.heading}
                    </AnimatedHeading>
                    <ul className="space-y-4 text-sm sm:text-base text-zinc-300">
                      {t.developer_support.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3.5">
                          <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold flex-shrink-0">
                            ✓
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AnimatedSection>

              {/* Students as Contributors & Community */}
              <div className="space-y-6">
                <AnimatedSection animation="slideLeft">
                  <div className="relative overflow-hidden rounded-3xl border border-purple-500/25 bg-zinc-950/85 p-6 sm:p-8 shadow-lg">
                    <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-purple-500/10 blur-2xl" />
                    <div className="relative z-10">
                      <div className="inline-block rounded-xl bg-purple-500/10 px-3.5 py-1 text-xs font-semibold text-purple-300 border border-purple-500/25 mb-4">
                        {t.students_as_contributors.badge}
                      </div>
                      <AnimatedHeading as="h2" className="text-xl font-bold text-white sm:text-2xl mb-3">
                        {t.students_as_contributors.heading}
                      </AnimatedHeading>
                      <p className="text-sm sm:text-base leading-relaxed text-zinc-300">
                        {t.students_as_contributors.body}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>

                {/* Community: Emerald / Greenish theme */}
                <AnimatedSection animation="slideLeft">
                  <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-zinc-950/85 p-6 sm:p-8 shadow-[0_0_30px_rgba(16,185,129,0.12)]">
                    <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-2xl" />
                    <div className="relative z-10">
                      <div className="inline-block rounded-xl bg-emerald-500/15 px-3.5 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/30 mb-4">
                        {t.community.badge}
                      </div>
                      <AnimatedHeading as="h2" className="text-xl font-bold text-white sm:text-2xl mb-3">
                        {t.community.heading}
                      </AnimatedHeading>
                      <p className="text-sm sm:text-base leading-relaxed text-zinc-300">
                        {t.community.body}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              </div>
            </div>

            {/* What we do NOT do - Greenish Emerald Styling for the Empowering Security focus */}
            <AnimatedSection animation="slideUp">
              <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/90 p-6 sm:p-10 shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-zinc-300 font-bold text-lg border border-zinc-700">
                    ℹ
                  </div>
                  <AnimatedHeading as="h2" className="text-xl font-bold text-white sm:text-2xl lg:text-3xl">
                    {t.what_we_dont_do.heading}
                  </AnimatedHeading>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {t.what_we_dont_do.items.map((item, idx) => {
                    const isFocusPoint = idx === 2; // "ርእስኻ ንምክልኻል ክትክእል..."

                    if (isFocusPoint) {
                      return (
                        <div
                          key={idx}
                          className="relative overflow-hidden rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/30 via-zinc-900/90 to-emerald-950/20 p-6 shadow-[0_0_30px_rgba(16,185,129,0.15)] backdrop-blur-md"
                        >
                          <div className="pointer-events-none absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-emerald-500/15 blur-xl" />
                          <div className="relative z-10">
                            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300 mb-3">
                              <span>✓</span>
                              <span>{isTi ? "ቀንዲ ትኹረትና" : "Our Core Focus"}</span>
                            </div>
                            <p className="text-sm sm:text-base text-emerald-100 leading-relaxed font-semibold">
                              {item}
                            </p>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={idx}
                        className="rounded-2xl border border-red-500/25 bg-red-500/5 p-6 backdrop-blur-sm"
                      >
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 border border-red-500/30 px-2.5 py-0.5 text-[11px] font-bold text-red-300 mb-3">
                          <span>✕</span>
                          <span>{isTi ? "ኣይንገብርን" : "We Do Not"}</span>
                        </div>
                        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-medium">
                          {item}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </AnimatedSection>

            {/* Open Source License */}
            <AnimatedSection animation="slideUp">
              <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/90 p-6 sm:p-10 backdrop-blur-md shadow-2xl">
                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <div className="inline-block rounded-lg bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300 border border-cyan-500/20 mb-2">
                        GPL-3.0
                      </div>
                      <AnimatedHeading as="h2" className="text-xl font-bold text-white sm:text-2xl">
                        {t.open_source.heading}
                      </AnimatedHeading>
                    </div>
                    
                    <a
                      href="/LICENSE"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-fit items-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-5 py-2.5 text-xs sm:text-sm font-semibold text-cyan-300 transition hover:bg-cyan-500/20 hover:border-cyan-400"
                    >
                      <span>{t.open_source.view_license}</span>
                      <span>↗</span>
                    </a>
                  </div>

                  <p className="text-sm sm:text-base text-zinc-300 leading-relaxed mb-4 max-w-4xl">
                    {t.open_source.body_prefix}{" "}
                    <a
                      href="https://www.gnu.org/licenses/gpl-3.0.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 underline font-semibold"
                    >
                      {t.open_source.license_link_text}
                    </a>{" "}
                    {t.open_source.body_suffix}
                  </p>
                  
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-4xl">
                    {t.open_source.disclaimer}
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* An Evolving Project (Bottom Callout with Glowing Hub) */}
            <AnimatedSection animation="slideUp">
              <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-950 via-zinc-900/60 to-black p-8 sm:p-14 text-center max-w-4xl mx-auto shadow-2xl">
                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />
                
                <div className="relative z-10">
                  <AnimatedHeading as="h2" className="text-2xl font-bold text-white sm:text-4xl mb-5">
                    {t.evolving.heading}
                  </AnimatedHeading>
                  <p className="text-base sm:text-lg text-zinc-300 leading-relaxed mb-10 max-w-2xl mx-auto">
                    {t.evolving.body}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <Link
                      href="/chapters"
                      className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:scale-105 active:scale-95"
                    >
                      {t.evolving.cta_curriculum}
                    </Link>
                    <Link
                      href="/impact"
                      className="inline-flex items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900/90 px-7 py-3.5 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500 hover:text-white hover:bg-zinc-800"
                    >
                      {t.evolving.cta_impact}
                    </Link>
                  </div>
                </div>
              </div>
            </AnimatedSection>

          </div>
        </div>
      </div>
    </div>
  );
}
