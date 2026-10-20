'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatedSection } from "@/components/AnimatedSection";
import { AnimatedHeading } from "@/components/AnimatedHeading";
import SplitText from "@/components/SplitText";
import { useLanguage } from "@/contexts/LanguageContext";
import { getDonateCopy } from "@/lib/translations/donate";
import { DonateBitcoinAnimation } from "@/components/DonateBitcoinAnimation";

const ONCHAIN_ADDRESS = 'bc1q4pg073ws86qdnxac3y8zhk4t8vtkg2vx529jrj';
const ONCHAIN_QR_SRC = '/images/onchain-btc-qr.jpeg';
const LIGHTNING_ADDRESS = 'panafricanbitcoin@blink.sv';
const LNURL_QR_SRC = '/images/lunrl_qr.jpeg';

export default function DonatePage() {
  const { language } = useLanguage();
  const t = getDonateCopy(language);

  const [copiedLightning, setCopiedLightning] = useState(false);
  const [copiedOnchain, setCopiedOnchain] = useState(false);

  const handleCopyLightning = () => {
    navigator.clipboard?.writeText(LIGHTNING_ADDRESS);
    setCopiedLightning(true);
    setTimeout(() => setCopiedLightning(false), 2000);
  };

  const handleCopyOnchain = () => {
    navigator.clipboard?.writeText(ONCHAIN_ADDRESS);
    setCopiedOnchain(true);
    setTimeout(() => setCopiedOnchain(false), 2000);
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#070b14] text-zinc-100 selection:bg-orange-500/30 selection:text-orange-200">

      {/* ── Background ─────────────────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <DonateBitcoinAnimation className="absolute inset-0 h-full w-full" />
        <div className="absolute -top-20 left-1/4 h-[50vmax] w-[50vmax] max-h-[600px] max-w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-orange-500/15 via-orange-500/5 to-transparent blur-3xl" />
        <div className="absolute top-1/2 right-0 h-[40vmax] w-[40vmax] max-h-[500px] max-w-[500px] rounded-full bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-cyan-500/10 via-cyan-500/4 to-transparent blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070b14]/65 via-[#070b14]/55 to-[#070b14]/75" />
      </div>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">

          {/* ── Hero ───────────────────────────────────────────────────────── */}
          <AnimatedSection animation="slideUp">
            <div className="mb-20 text-center">

              {/* ₿ badge */}
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/8 px-5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
                <span className="text-sm font-black">₿</span>
                Bitcoin Only
              </div>

              <AnimatedHeading as="h1" className="text-4xl font-black tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl">
                <SplitText
                  text={t.hero.title}
                  tag="span"
                  className="inline-block"
                  delay={45}
                  duration={1.2}
                  ease="bounce.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-100px"
                  textAlign="center"
                />
              </AnimatedHeading>

              <p className="mx-auto mt-6 max-w-2xl text-base text-zinc-400 sm:text-lg leading-relaxed">
                {t.hero.subtitle}
              </p>

              {/* Thin orange divider line */}
              <div className="mt-10 mx-auto h-px w-24 bg-gradient-to-r from-transparent via-orange-500/60 to-transparent" />
            </div>
          </AnimatedSection>

          <div className="space-y-10">

            {/* ── Why Donations Matter ────────────────────────────────────── */}
            <AnimatedSection animation="slideRight">
              <section className="rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-md overflow-hidden">
                {/* Top accent bar */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-orange-500/30 bg-orange-500/10 text-sm font-black text-orange-400">
                      ₿
                    </div>
                    <AnimatedHeading as="h2" className="text-base font-bold tracking-wide text-zinc-100 sm:text-lg">
                      {t.why_donations_matter.heading}
                    </AnimatedHeading>
                  </div>

                  <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
                    {t.why_donations_matter.intro}
                  </p>

                  <ul className="grid gap-2 sm:grid-cols-2">
                    {[
                      t.why_donations_matter.points.education,
                      t.why_donations_matter.points.rewards,
                      t.why_donations_matter.points.infrastructure,
                      t.why_donations_matter.points.reach,
                      t.why_donations_matter.points.mentors,
                    ].map((text, i) => (
                      <li key={i} className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500 ring-2 ring-orange-500/25" />
                        <span className="text-sm text-zinc-300 leading-snug">{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </AnimatedSection>

            {/* ── Payment Methods ─────────────────────────────────────────── */}
            <AnimatedSection animation="slideLeft">
              <section className="space-y-4">
                <div className="mb-2">
                  <AnimatedHeading as="h2" className="text-base font-bold tracking-wide text-zinc-100 sm:text-lg">
                    {t.payment_methods.heading}
                  </AnimatedHeading>
                  <p className="mt-1 text-sm text-zinc-500">{t.payment_methods.intro}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">

                  {/* Lightning Card */}
                  <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-cyan-500/15 bg-white/[0.03] backdrop-blur-md transition-all hover:border-cyan-500/30 hover:bg-white/[0.05]">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

                    <div className="flex flex-col flex-1 p-5">
                      {/* Card header */}
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                          <span className="text-lg leading-none text-cyan-300">⚡</span>
                          <AnimatedHeading as="h3" className="text-sm font-bold text-cyan-200 sm:text-base">
                            {t.payment_methods.lightning.title}
                          </AnimatedHeading>
                        </div>
                        <span className="rounded-md border border-cyan-500/20 bg-cyan-500/8 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                          Instant
                        </span>
                      </div>

                      {/* QR */}
                      <div className="flex flex-col items-center gap-2 mb-5">
                        <div className="rounded-xl border border-cyan-500/20 bg-zinc-950/80 p-3 transition-transform group-hover:scale-[1.015] shadow-[0_0_30px_rgba(34,211,238,0.06)]">
                          <img
                            src={LNURL_QR_SRC}
                            alt={t.payment_methods.lightning.qr_alt}
                            className="h-40 w-40 rounded-lg object-contain"
                          />
                        </div>
                        <p className="text-[11px] text-zinc-600 tracking-wide">{t.payment_methods.lightning.scan_text}</p>
                      </div>

                      {/* Address + copy */}
                      <div className="mt-auto space-y-2">
                        <p className="text-center text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                          {t.payment_methods.lightning.label}
                        </p>
                        <div className="rounded-lg border border-cyan-500/10 bg-zinc-950/60 px-3 py-2 font-mono text-[11px] text-cyan-400 break-all text-center leading-relaxed">
                          {LIGHTNING_ADDRESS}
                        </div>
                        <button
                          onClick={handleCopyLightning}
                          className="group/btn relative w-full overflow-hidden rounded-xl bg-cyan-500/10 border border-cyan-500/20 px-4 py-2.5 text-sm font-bold text-cyan-300 transition-all hover:bg-cyan-500/20 hover:text-cyan-200 active:scale-95 flex items-center justify-center gap-2"
                        >
                          {copiedLightning ? (
                            <>
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                              {t.payment_methods.lightning.copied_button}
                            </>
                          ) : (
                            <>
                              <span>⚡</span>
                              {t.payment_methods.lightning.copy_button}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* On-Chain Card */}
                  <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-orange-500/15 bg-white/[0.03] backdrop-blur-md transition-all hover:border-orange-500/30 hover:bg-white/[0.05]">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

                    <div className="flex flex-col flex-1 p-5">
                      {/* Card header */}
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                          <span className="text-lg leading-none font-black text-orange-400">₿</span>
                          <AnimatedHeading as="h3" className="text-sm font-bold text-orange-200 sm:text-base">
                            {t.payment_methods.onchain.title}
                          </AnimatedHeading>
                        </div>
                        <span className="rounded-md border border-orange-500/20 bg-orange-500/8 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-orange-400">
                          On-chain
                        </span>
                      </div>

                      {/* QR */}
                      <div className="flex flex-col items-center gap-2 mb-5">
                        <div className="rounded-xl border border-orange-500/20 bg-zinc-950/80 p-3 transition-transform group-hover:scale-[1.015] shadow-[0_0_30px_rgba(249,115,22,0.06)]">
                          <img
                            src={ONCHAIN_QR_SRC}
                            alt={t.payment_methods.onchain.qr_alt}
                            className="h-40 w-40 rounded-lg object-contain"
                          />
                        </div>
                        <p className="text-[11px] text-zinc-600 tracking-wide">{t.payment_methods.onchain.scan_text}</p>
                      </div>

                      {/* Address + copy */}
                      <div className="mt-auto space-y-2">
                        <p className="text-center text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                          {t.payment_methods.onchain.label}
                        </p>
                        <div className="rounded-lg border border-orange-500/10 bg-zinc-950/60 px-3 py-2 font-mono text-[11px] text-orange-400 break-all text-center leading-relaxed">
                          {ONCHAIN_ADDRESS}
                        </div>
                        <button
                          onClick={handleCopyOnchain}
                          className="w-full rounded-xl bg-orange-500/10 border border-orange-500/20 px-4 py-2.5 text-sm font-bold text-orange-300 transition-all hover:bg-orange-500/20 hover:text-orange-200 active:scale-95 flex items-center justify-center gap-2"
                        >
                          {copiedOnchain ? (
                            <>
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                              {t.payment_methods.onchain.copied_button}
                            </>
                          ) : (
                            <>
                              <span className="font-black">₿</span>
                              {t.payment_methods.onchain.copy_button}
                            </>
                          )}
                        </button>
                      </div>

                      {/* Note */}
                      <p className="mt-3 rounded-lg border border-orange-500/10 bg-orange-500/5 px-3 py-2 text-[11px] text-zinc-500 leading-relaxed">
                        <span className="font-semibold text-orange-400">{t.payment_methods.onchain.note_prefix}</span>{' '}
                        {t.payment_methods.onchain.note_text}
                      </p>
                    </div>
                  </div>

                </div>
              </section>
            </AnimatedSection>

            {/* ── Transparency ────────────────────────────────────────────── */}
            <AnimatedSection animation="slideRight">
              <section className="rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-md overflow-hidden">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    {/* Simple SVG icon — no emoji */}
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-purple-500/30 bg-purple-500/10">
                      <svg className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <AnimatedHeading as="h2" className="text-base font-bold tracking-wide text-zinc-100 sm:text-lg">
                      {t.transparency.heading}
                    </AnimatedHeading>
                  </div>

                  <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
                    {t.transparency.intro}
                  </p>

                  <ul className="grid gap-2 sm:grid-cols-2">
                    {[
                      { title: t.transparency.points.public_reporting_title, desc: t.transparency.points.public_reporting_desc },
                      { title: t.transparency.points.student_rewards_title,  desc: t.transparency.points.student_rewards_desc  },
                      { title: t.transparency.points.infrastructure_title,   desc: t.transparency.points.infrastructure_desc   },
                      { title: t.transparency.points.growth_title,           desc: t.transparency.points.growth_desc           },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500 ring-2 ring-purple-500/25" />
                        <span className="text-sm text-zinc-300 leading-snug">
                          <strong className="text-purple-300">{item.title}</strong>{' '}
                          {item.desc}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 rounded-xl border border-purple-500/10 bg-purple-500/5 px-4 py-3">
                    <p className="text-xs text-zinc-500">
                      {t.transparency.dashboard_note_prefix}{' '}
                      <Link href="/impact" className="font-semibold text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors">
                        {t.transparency.dashboard_link_text}
                      </Link>{' '}
                      {t.transparency.dashboard_note_suffix}
                    </p>
                  </div>
                </div>
              </section>
            </AnimatedSection>

            {/* ── Thank You ───────────────────────────────────────────────── */}
            <AnimatedSection animation="slideUp">
              <section className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-md text-center p-8 sm:p-12">
                {/* Faint ₿ watermark */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none" aria-hidden="true">
                  <span className="text-[220px] font-black leading-none text-orange-500/[0.025]">₿</span>
                </div>

                {/* Top glow line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

                <div className="relative space-y-4">
                  {/* Icon ring */}
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/8 shadow-[0_0_30px_rgba(34,211,238,0.12)]">
                    <svg className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>

                  <AnimatedHeading as="h2" className="text-2xl font-black text-zinc-50 sm:text-3xl">
                    {t.thank_you.heading}
                  </AnimatedHeading>

                  <p className="mx-auto max-w-lg text-sm text-zinc-400 sm:text-base leading-relaxed">
                    {t.thank_you.message}
                  </p>

                  <p className="text-xs text-zinc-600 pt-2">
                    {t.thank_you.questions_prefix}{' '}
                    <a
                      href="mailto:support@panafricanbitcoin.com"
                      className="text-cyan-500 hover:text-cyan-400 underline underline-offset-2 transition-colors"
                    >
                      support@panafricanbitcoin.com
                    </a>
                  </p>
                </div>
              </section>
            </AnimatedSection>

          </div>
        </div>
      </div>
    </div>
  );
}
