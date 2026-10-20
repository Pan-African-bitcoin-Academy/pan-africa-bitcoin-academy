'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatedSection } from "@/components/AnimatedSection";
import { AnimatedHeading } from "@/components/AnimatedHeading";
import SplitText from "@/components/SplitText";
import { useLanguage } from "@/contexts/LanguageContext";
import { getDonateCopy } from "@/lib/translations/donate";

const ONCHAIN_ADDRESS = 'bc1q4pg073ws86qdnxac3y8zhk4t8vtkg2vx529jrj';
const ONCHAIN_QR_SRC = '/images/onchain-btc-qr.jpeg'; // Using provided JPEG QR image
const LIGHTNING_ADDRESS = 'panafricanbitcoin@blink.sv';
const LNURL_QR_SRC = '/images/lunrl_qr.jpeg'; // Lightning QR code image

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
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <div className="relative z-10 w-full bg-black/95">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <AnimatedSection animation="slideUp">
            <div className="mb-16 text-center">
              <AnimatedHeading as="h1" className="text-4xl font-bold tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl">
                <SplitText
                  text={t.hero.title}
                  tag="span"
                  className="inline-block"
                  delay={50}
                  duration={1.25}
                  ease="bounce.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-100px"
                  textAlign="center"
                />
              </AnimatedHeading>
              <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-400 sm:text-xl">
                {t.hero.subtitle}
              </p>
            </div>
          </AnimatedSection>

          <div className="space-y-12">
            {/* Why Donations Matter */}
            <AnimatedSection animation="slideRight">
              <section className="space-y-4 rounded-xl border border-orange-500/25 bg-black/80 p-6 shadow-[0_0_40px_rgba(249,115,22,0.2)]">
                <AnimatedHeading as="h2" className="text-xl font-semibold text-orange-200">
                  {t.why_donations_matter.heading}
                </AnimatedHeading>
                <p className="text-sm text-zinc-300 sm:text-base">
                  {t.why_donations_matter.intro}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-zinc-300 sm:text-base">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400">•</span>
                    <span>{t.why_donations_matter.points.education}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400">•</span>
                    <span>{t.why_donations_matter.points.rewards}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400">•</span>
                    <span>{t.why_donations_matter.points.infrastructure}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400">•</span>
                    <span>{t.why_donations_matter.points.reach}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400">•</span>
                    <span>{t.why_donations_matter.points.mentors}</span>
                  </li>
                </ul>
              </section>
            </AnimatedSection>

            {/* Payment Methods */}
            <AnimatedSection animation="slideLeft">
              <section className="space-y-6">
                <AnimatedHeading as="h2" className="text-xl font-semibold text-zinc-50">
                  {t.payment_methods.heading}
                </AnimatedHeading>
                <p className="text-sm text-zinc-400">
                  {t.payment_methods.intro}
                </p>

                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Lightning Network */}
                  <div className="rounded-xl border border-cyan-400/25 bg-black/80 p-6 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                    <AnimatedHeading as="h3" className="mb-4 text-lg font-semibold text-cyan-200">
                      {t.payment_methods.lightning.title}
                    </AnimatedHeading>
                    <div className="space-y-4">
                      {/* Lightning QR Code */}
                      <div className="flex flex-col items-center gap-3">
                        <div className="rounded-xl border border-cyan-400/30 bg-zinc-900/60 p-3">
                          <img
                            src={LNURL_QR_SRC}
                            alt={t.payment_methods.lightning.qr_alt}
                            className="h-48 w-48 rounded-lg object-contain"
                          />
                        </div>
                        <p className="text-xs text-zinc-400">{t.payment_methods.lightning.scan_text}</p>
                      </div>

                      {/* Paycode section */}
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-400 text-center block">
                          {t.payment_methods.lightning.label}
                        </label>
                        <div className="rounded-lg border border-cyan-400/20 bg-zinc-900/50 p-3 font-mono text-xs text-cyan-300 break-all text-center">
                          {LIGHTNING_ADDRESS}
                        </div>
                        <button
                          onClick={handleCopyLightning}
                          className="w-full rounded-lg bg-gradient-to-r from-cyan-400 to-orange-400 px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110"
                        >
                          {copiedLightning ? t.payment_methods.lightning.copied_button : t.payment_methods.lightning.copy_button}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* On-Chain */}
                  <div className="rounded-xl border border-orange-500/25 bg-black/80 p-6 shadow-[0_0_30px_rgba(249,115,22,0.2)]">
                    <AnimatedHeading as="h3" className="mb-4 text-lg font-semibold text-orange-200">
                      {t.payment_methods.onchain.title}
                    </AnimatedHeading>
                    <div className="space-y-4">
                      {/* QR Image */}
                      <div className="flex flex-col items-center gap-3">
                        <div className="rounded-xl border border-orange-500/30 bg-zinc-900/60 p-3">
                          <img
                            src={ONCHAIN_QR_SRC}
                            alt={t.payment_methods.onchain.qr_alt}
                            className="h-48 w-48 rounded-lg object-contain"
                          />
                        </div>
                        <p className="text-xs text-zinc-400">{t.payment_methods.onchain.scan_text}</p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-400 text-center block">
                          {t.payment_methods.onchain.label}
                        </label>
                        <div className="rounded-lg border border-orange-500/20 bg-zinc-900/50 p-3 font-mono text-xs text-orange-300 break-all text-center">
                          {ONCHAIN_ADDRESS}
                        </div>
                        <button
                          onClick={handleCopyOnchain}
                          className="w-full rounded-lg bg-gradient-to-r from-orange-400 to-cyan-400 px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110"
                        >
                          {copiedOnchain ? t.payment_methods.onchain.copied_button : t.payment_methods.onchain.copy_button}
                        </button>
                      </div>
                      <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-3">
                        <p className="text-xs text-zinc-400">
                          <span className="font-semibold text-orange-300">{t.payment_methods.onchain.note_prefix}</span>{" "}
                          {t.payment_methods.onchain.note_text}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </AnimatedSection>

            {/* Transparency Plan */}
            <AnimatedSection animation="slideRight">
              <section className="space-y-4 rounded-xl border border-purple-500/25 bg-black/80 p-6 shadow-[0_0_40px_rgba(168,85,247,0.2)]">
                <AnimatedHeading as="h2" className="text-xl font-semibold text-purple-200">
                  {t.transparency.heading}
                </AnimatedHeading>
                <p className="text-sm text-zinc-300 sm:text-base">
                  {t.transparency.intro}
                </p>
                <ul className="mt-4 space-y-3 text-sm text-zinc-300 sm:text-base">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">✓</span>
                    <span>
                      <strong className="text-purple-200">{t.transparency.points.public_reporting_title}</strong>{" "}
                      {t.transparency.points.public_reporting_desc}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">✓</span>
                    <span>
                      <strong className="text-purple-200">{t.transparency.points.student_rewards_title}</strong>{" "}
                      {t.transparency.points.student_rewards_desc}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">✓</span>
                    <span>
                      <strong className="text-purple-200">{t.transparency.points.infrastructure_title}</strong>{" "}
                      {t.transparency.points.infrastructure_desc}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">✓</span>
                    <span>
                      <strong className="text-purple-200">{t.transparency.points.growth_title}</strong>{" "}
                      {t.transparency.points.growth_desc}
                    </span>
                  </li>
                </ul>
                <div className="mt-4 rounded-lg border border-purple-500/20 bg-purple-500/5 p-4">
                  <p className="text-xs text-zinc-400">
                    {t.transparency.dashboard_note_prefix}{" "}
                    <Link href="/impact" className="font-semibold text-purple-300 hover:text-purple-200">
                      {t.transparency.dashboard_link_text}
                    </Link>{" "}
                    {t.transparency.dashboard_note_suffix}
                  </p>
                </div>
              </section>
            </AnimatedSection>

            {/* Thank You */}
            <AnimatedSection animation="slideUp">
              <section className="text-center">
                <div className="rounded-xl border border-cyan-400/25 bg-black/80 p-8 shadow-[0_0_40px_rgba(34,211,238,0.2)]">
                  <AnimatedHeading as="h2" className="text-2xl font-semibold text-cyan-200">
                    {t.thank_you.heading}
                  </AnimatedHeading>
                  <p className="mt-4 text-sm text-zinc-300 sm:text-base">
                    {t.thank_you.message}
                  </p>
                  <p className="mt-2 text-xs text-zinc-400">
                    {t.thank_you.questions_prefix}{" "}
                    <a href="mailto:support@panafricanbitcoin.com" className="text-cyan-300 hover:text-cyan-200">
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
