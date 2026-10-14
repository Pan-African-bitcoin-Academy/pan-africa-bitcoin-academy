'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Music2 } from 'lucide-react';
import { AnimatedSection } from '@/components/AnimatedSection';
import { AnimatedHeading } from '@/components/AnimatedHeading';
import { AnimatedList } from '@/components/AnimatedList';
import { TrueFocus } from '@/components/TrueFocus';
import { ImpactStatsCountUp } from '@/components/ImpactStatsCountUp';
import { UpcomingEventsWithModal } from '@/components/UpcomingEventsWithModal';
import { useLanguage } from '@/contexts/LanguageContext';

export interface Mentor {
  name: string;
  role: string;
  description: string;
  image: string | null;
  github: string | null;
  twitter: string | null;
  type: string | null;
}

export interface ImpactStats {
  studentsTrained: number;
  satsRewarded: number;
  countriesRepresented: number;
}

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  quote: string;
  rating: number;
  photo: string | null;
}

export function HomeSectionsClient({
  mentors,
  impactStats,
  upcomingEvents,
  testimonials,
}: {
  mentors: Mentor[];
  impactStats: ImpactStats;
  upcomingEvents: any[];
  testimonials: Testimonial[];
}) {
  const { language } = useLanguage();
  const isTigrinya = language === 'ti';

  const curriculumCards = [
    {
      title: isTigrinya ? "መሰረታት ቢትኮይን" : "Bitcoin Basics",
      description: isTigrinya
        ? "ቢትኮይን እንታይ ምዃኑ፣ ብኸመይ ከም ዝሰርሕን ንፋይናንሳዊ ርእሰ-ውሳነ ኣገዳሲ ስለምንታይ ምዃኑን ምርዳእ።"
        : "Understanding what Bitcoin is, how it works, and why it matters for financial sovereignty.",
      icon: "₿",
    },
    {
      title: isTigrinya ? "ቢትኮይን ብኸመይ ይሰርሕ" : "How Bitcoin Works",
      description: isTigrinya
        ? "ብዛዕባ መፍትሕታት (keys)፣ ኣድራሻታት (addresses)፣ UTXOs፣ ልውውጣት ገንዘብ (transactions) እና ብሎካት (blocks) ቀለልቲን ብስእሊ ዝተደገፉን መብርሂታት።"
        : "Simple and visual explanations of keys, addresses, UTXOs, transactions, and blocks.",
      icon: "🔗",
    },
    {
      title: isTigrinya ? "ክእለታት Lightning Network" : "Lightning Skills",
      description: isTigrinya
        ? "ብLightning Network ቅልጡፋትን ውሑድ ክፍሊት ዝሓትቱን ልውውጣት ቢትኮይን ከመይ ከም ዝፍጸሙ ተማሃሩ።"
        : "Learn to use Lightning Network for fast, low-cost Bitcoin transactions.",
      icon: "⚡",
    },
  ];

  const howItWorksSteps = [
    {
      step: "1",
      title: isTigrinya ? "ናብ ጉጅለ ትምህርቲ ተጸንበሩ" : "Join a cohort",
      description: isTigrinya
        ? "መመልከቲ ኣቕርቡ፣ ኣብ ብዝተወደበ መደብ ትምህርቲ ድማ ተቐባልነት ርኸቡ።"
        : "Apply and get accepted into a structured, mentor-led learning program.",
    },
    {
      step: "2",
      title: isTigrinya ? "ቀጥታዊ ክፍለ-ግዜታት ተኸታተሉ" : "Attend live sessions",
      description: isTigrinya
        ? "ምስ መምህራንን መማኸርትን ኣብ ዝግበር ናይ ምይይጥ ክፍላትን ተሳተፉ"
        : "Join interactive classes and learn directly from Bitcoin educators.",
    },
    {
      step: "3",
      title: isTigrinya ? "ተግባራዊ ዕዮታት ኣተግብሩ" : "Complete practical tasks",
      description: isTigrinya
        ? "ተግባራዊ ናይ ቢትኮይን ልምምዳትን ዕዮታትን ምስራሕ"
        : "Build real skills with hands-on exercises and assignments.",
    },
    {
      step: "4",
      title: isTigrinya ? "ሳትስ (sats) + ምስክር ወረቐት ውሰዱ" : "Earn sats + certificate",
      description: isTigrinya
        ? "ብቢትኮይን ተሸለሙ ከምኡ’ውን ናይ ምስክር ወረቐትኩም ተቐበሉ"
        : "Get paid in Bitcoin for your progress and earn a verified certificate.",
    },
  ];

  return (
    <div className="relative z-10 w-full bg-black/60 backdrop-blur-sm">
      <div className="w-full px-4 py-12 sm:px-6 sm:py-16 sm:max-w-7xl sm:mx-auto lg:px-8 lg:py-20">
        
        {/* 2. How It Started Section */}
        <AnimatedSection animation="slideUp">
          <section className="mb-32 space-y-8">
            <div className="text-center">
              <AnimatedHeading as="h2" className="text-3xl font-semibold text-orange-200 sm:text-4xl lg:text-5xl">
                {isTigrinya ? (
                  <>
                    ከመይ ከም ዝጀመረ፦{' '}
                    <TrueFocus
                      sentence="ካብ ምድሓን-ባንክታት ናብ ብሎክቸይን"
                      focusOnlyIndices={[1, 3]}
                      pauseBetweenAnimations={5}
                      blurAmount={10}
                      borderColor="#22d3ee"
                      glowColor="rgba(34, 211, 238, 0.6)"
                      animationDuration={3}
                    />
                  </>
                ) : (
                  <>
                    How It Started:{' '}
                    <TrueFocus
                      sentence="Bailouts to Blockchain"
                      focusOnlyIndices={[0, 2]}
                      pauseBetweenAnimations={5}
                      blurAmount={5}
                      borderColor="#22d3ee"
                      glowColor="rgba(34, 211, 238, 0.6)"
                      animationDuration={3}
                    />
                  </>
                )}
              </AnimatedHeading>
              <p className="mt-4 text-base leading-relaxed text-zinc-300 sm:text-lg w-full sm:max-w-3xl sm:mx-auto">
                {isTigrinya
                  ? "ኣብ 2008፣ ዓለምለኻዊ ቅልውላው ፋይናንስ ድኹምነት ናይቲ ባህላዊ ስርዓት ባንክታት ኣቃሊዑ። መንግስታት ንባንክታት ካብ ውድቀት ንምድሓን እናሓገዙ ከለዉ፣ ተራ ሰባት ገዛውቶም፣ ስራሕቶምን ዝዓቖርዎ ገንዘብን ሰኣኑ። ቢትኮይን ካብዚ ቅልውላው ተወሊዱ፤ ኣብ ባንክታት ወይ መንግስታት ክትኣምኑ ዘየድልዮ፣ ማእከላይ ተቖጻጻሪ ዘይብሉ ኣማራጺ እዩ።"
                  : "In 2008, the global financial crisis exposed the fragility of traditional banking. While governments bailed out the banks, ordinary people lost homes, jobs, and savings. Bitcoin was born from this crisis — a decentralized alternative that doesn't require trust in banks or governments."}
              </p>
            </div>
            <div className="flex items-center justify-center w-full">
              <div className="relative w-full sm:max-w-4xl rounded-xl overflow-hidden border border-orange-500/25 shadow-[0_0_40px_rgba(249,115,22,0.2)]">
                <div className="relative w-full bg-gradient-to-br from-zinc-900 via-orange-900/20 to-zinc-900 flex items-center justify-center">
                  <img 
                    src="/images/bailouts-to-blockchain.jpg" 
                    alt={isTigrinya ? "ካብ ምድሓን ባንክታት ናብ Blockchain — መበቆል ታሪኽ ቢትኮይን" : "From Bailouts to Blockchain - Bitcoin's origin story"}
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* 3. Core Identity */}
        <AnimatedSection animation="slideUp">
          <section className="mb-16 w-full rounded-xl border border-cyan-500/30 bg-gradient-to-r from-zinc-900 via-cyan-900/20 to-zinc-900 p-8 shadow-[0_0_40px_rgba(14,165,233,0.2)] sm:p-10">
            <div className="w-full sm:max-w-4xl sm:mx-auto text-center">
              <div className="mb-4 inline-block rounded-full bg-cyan-500/20 px-4 py-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
                  {isTigrinya ? "ቀንዲ መንነትና" : "Our Core Identity"}
                </p>
              </div>
              <p className="text-xl font-semibold leading-relaxed text-cyan-100 sm:text-2xl lg:text-3xl">
                {isTigrinya
                  ? "ፓን-ኣፍሪካን ቢትኮይን ኣካዳሚ ካብ መሰረታዊ ጽንሰ-ሓሳባት ጀሚሩ ቢትኮይን ዝምህርን ኣብ ዘይተበጽሑ ማሕበረሰባት ናይ ነዊሕ ግዜ ቴክኒካዊን ኣበርካቲን ዓቕሚ ዝሃንጽ ክፉት ምንጪ (open-source) ትምህርታዊ መሰረት እዩ።"
                  : "Pan-African Bitcoin Academy is an open-source Bitcoin education infrastructure that teaches Bitcoin from first principles and builds long-term technical and contributor capacity in underserved communities."}
              </p>
            </div>
          </section>
        </AnimatedSection>

        {/* 4. Mission Section */}
        <AnimatedSection animation="slideLeft">
          <section className="mb-32 rounded-xl border border-orange-500/25 bg-black/80 p-8 shadow-[0_0_40px_rgba(249,115,22,0.2)] sm:p-12">
            <div className="flex flex-col items-center text-center">
              <AnimatedHeading as="h2" className="text-3xl font-semibold text-orange-200 sm:text-4xl">
                {isTigrinya ? "ተልእኾና" : "Our Mission"}
              </AnimatedHeading>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">
                {isTigrinya
                  ? "ቢትኮይን ናይ ፋይናንሳዊ ናጽነት መሳርሒ እዩ፤ ብፍላይ ኣብ ኣፍሪቃ።"
                  : "Bitcoin is a tool for sovereignty and economic empowerment — especially in Africa."}
              </p>
              <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">
                {isTigrinya
                  ? "ትምህርቲና ብተግባራዊ ትምህርትን ደገፍ ማሕበረሰብን፣ ሰባት ቢትኮይን ክርድኡ፣ ክጥቀሙሉን ብቢትኮይን ክሃንጹን ትሕግዝ።"
                  : "Our academy helps people understand, use, and build with Bitcoin through hands-on learning and community support."}
              </p>
              <Link
                href="/about"
                className="mt-6 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-orange-400 to-cyan-400 px-6 py-3 text-base font-semibold text-black transition hover:brightness-110"
              >
                {isTigrinya ? "ተልእኾና ኣንብቡ" : "Read Our Mission"}
              </Link>
              <div className="relative mt-10 flex h-64 w-64 items-center justify-center">
                <Image
                  src="/images/logo_3.png"
                  alt="Pan-African Bitcoin Academy Logo - First Eritrea Based Bitcoin Academy"
                  width={256}
                  height={256}
                  priority
                  loading="eager"
                  className="object-contain brightness-110 contrast-125 saturate-120"
                  style={{ width: 'auto', height: 'auto' }}
                  quality={95}
                  sizes="(max-width: 768px) 192px, 256px"
                  fetchPriority="high"
                />
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* 5. Curriculum Preview */}
        <AnimatedSection animation="slideUp">
          <section className="mb-32 space-y-8">
            <div className="text-center">
              <AnimatedHeading as="h2" className="text-3xl font-semibold text-zinc-50 sm:text-4xl lg:text-5xl">
                {isTigrinya ? "እንታይ ክትመሃሩ ኢኹም" : "What You Will Learn"}
              </AnimatedHeading>
            </div>
            <AnimatedList animation="slideUp" className="grid gap-6 sm:grid-cols-3">
              {curriculumCards.map((card, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center rounded-xl border border-cyan-400/25 bg-black/80 p-8 text-center shadow-[0_0_20px_rgba(34,211,238,0.1)] transition hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]"
                >
                  <div className="mb-6 text-5xl">{card.icon}</div>
                  <AnimatedHeading as="h3" className="mb-3 text-xl font-semibold text-cyan-200">{card.title}</AnimatedHeading>
                  <p className="text-base text-zinc-400">{card.description}</p>
                </div>
              ))}
            </AnimatedList>
            <div className="text-center">
              <Link
                href="/chapters"
                className="inline-flex items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-6 py-3 text-base font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
              >
                {isTigrinya ? "ምሉእ መደብ ትምህርቲ ርአዩ" : "View Full Curriculum"}
              </Link>
            </div>
          </section>
        </AnimatedSection>

        {/* 6. How It Works Preview */}
        <AnimatedSection animation="slideUp">
          <section className="mb-32 space-y-12">
            <div className="text-center">
              <AnimatedHeading as="h2" className="text-3xl font-semibold text-zinc-50 sm:text-4xl lg:text-5xl">
                {isTigrinya ? "ብኸመይ ይሰርሕ" : "How It Works"}
              </AnimatedHeading>
              <p className="mx-auto mt-4 max-w-xl text-base text-zinc-400 sm:text-lg">
                {isTigrinya ? "ናይ ቢትኮይን ትምህርትኹም ዝመርሕ ቀሊል መንገዲ" : "A clear path from sign-up to your first sats and certificate."}
              </p>
            </div>
            <AnimatedList animation="slideLeft" className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {howItWorksSteps.map((item, index) => (
                <div
                  key={index}
                  className="relative flex flex-col items-center text-center rounded-2xl border border-orange-500/20 bg-gradient-to-b from-zinc-900/95 to-black/90 p-8 shadow-[0_0_30px_rgba(249,115,22,0.08)] ring-1 ring-orange-400/5 transition-all duration-300 hover:border-orange-400/40 hover:shadow-[0_0_40px_rgba(249,115,22,0.12)] hover:ring-orange-400/15"
                >
                  <div className="mb-6 flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500/30 to-cyan-500/30 text-4xl font-bold text-orange-200 shadow-[0_0_24px_rgba(249,115,22,0.2)] ring-2 ring-orange-400/20">
                    {item.step}
                  </div>
                  <AnimatedHeading as="h3" className="mb-3 text-lg font-semibold text-zinc-50 sm:text-xl">{item.title}</AnimatedHeading>
                  <p className="text-sm leading-relaxed text-zinc-400">{item.description}</p>
                  {index < howItWorksSteps.length - 1 && (
                    <div className="absolute -right-4 top-1/2 hidden -translate-y-1/2 translate-x-full text-2xl text-orange-400/70 lg:block" aria-hidden>
                      →
                    </div>
                  )}
                </div>
              ))}
            </AnimatedList>
            <div className="text-center">
              <Link
                href="/chapters"
                className="inline-flex items-center justify-center rounded-xl border border-orange-400/40 bg-orange-500/10 px-6 py-3.5 text-base font-semibold text-orange-300 transition hover:bg-orange-500/20 hover:border-orange-400/60"
              >
                {isTigrinya ? "እቲ ኣካዳሚ ከመይ ከም ዝሰርሕ ርኣዩ" : "See how the academy works"}
              </Link>
            </div>
          </section>
        </AnimatedSection>

        {/* 7. Impact Preview */}
        <AnimatedSection animation="slideUp">
          <ImpactStatsCountUp
            studentsTrained={impactStats.studentsTrained}
            satsRewarded={impactStats.satsRewarded}
            countriesRepresented={impactStats.countriesRepresented}
          />
        </AnimatedSection>

        {/* 8. Community Preview */}
        <AnimatedSection animation="slideUp">
          <section className="mb-32 space-y-10">
            <div className="text-center">
              <AnimatedHeading as="h2" className="text-3xl font-semibold text-zinc-50 sm:text-4xl lg:text-5xl">
                {isTigrinya ? "ኣብ ግሩፓትና ተጸንበሩ" : "Join Our Community"}
              </AnimatedHeading>
              <p className="mx-auto mt-4 max-w-xl text-base text-zinc-400 sm:text-lg">
                {isTigrinya
                  ? "ኣብቲ እናዓበየ ዝኸይድ ዘሎ መርበብ ተመሃሮ፣ ሃነጽትን መምህራን ቢትኮይንን ተጸንበሩ።"
                  : "Connect with learners, builders, and Bitcoin educators across the continent."}
              </p>
            </div>

            <AnimatedList animation="slideUp" className="grid gap-5 sm:grid-cols-3">
              {/* WhatsApp */}
              <a
                href="https://chat.whatsapp.com/KpjlC90BGIj1EChMHsW6Ji"
                target="_blank"
                rel="noreferrer"
                className="group relative flex flex-col items-center rounded-2xl border border-green-500/20 bg-black/70 px-6 py-8 text-center transition-all duration-300 hover:border-green-400/50 hover:shadow-[0_0_35px_rgba(34,197,94,0.15)] hover:-translate-y-1"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-green-500/10 transition-colors group-hover:bg-green-500/20">
                  <svg className="h-7 w-7 text-green-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <AnimatedHeading as="h3" className="mb-1.5 text-lg font-semibold text-zinc-50">WhatsApp</AnimatedHeading>
                <p className="mb-5 text-sm leading-relaxed text-zinc-400">
                  {isTigrinya ? "መዓልታዊ ምይይጣት፣ ሓባራዊ ደገፍን ናይ ጉጅለ ሓበሬታታትን።" : "Daily discussions, peer support, and cohort updates."}
                </p>
                <span className="mt-auto inline-flex items-center gap-2 rounded-full bg-green-500/10 px-5 py-2 text-sm font-medium text-green-400 ring-1 ring-green-500/25 transition-all group-hover:bg-green-500/20 group-hover:ring-green-400/40">
                  {isTigrinya ? "ኣብ ጉጅለ ተጸንበሩ" : "Join Group"}
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
                </span>
              </a>

              {/* Discord */}
              <a
                href="https://discord.gg/4G4TUAP7"
                target="_blank"
                rel="noreferrer"
                className="group relative flex flex-col items-center rounded-2xl border border-indigo-500/20 bg-black/70 px-6 py-8 text-center transition-all duration-300 hover:border-indigo-400/50 hover:shadow-[0_0_35px_rgba(99,102,241,0.15)] hover:-translate-y-1"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-500/10 transition-colors group-hover:bg-indigo-500/20">
                  <svg className="h-7 w-7 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </div>
                <AnimatedHeading as="h3" className="mb-1.5 text-lg font-semibold text-zinc-50">Discord</AnimatedHeading>
                <p className="mb-5 text-sm leading-relaxed text-zinc-400">
                  {isTigrinya ? "ናይ ነፍሲ ወከፍ ጉጅለ ቻነላት፣ ናይ መጽናዕቲ ጉጅለታትን ቀጥታዊ ፍጻሜታትን።" : "Channels for each cohort, study groups, and live events."}
                </p>
                <span className="mt-auto inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-5 py-2 text-sm font-medium text-indigo-400 ring-1 ring-indigo-500/25 transition-all group-hover:bg-indigo-500/20 group-hover:ring-indigo-400/40">
                  {isTigrinya ? "ኣብ ሰርቨር ተጸንበሩ" : "Join Server"}
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
                </span>
              </a>

              {/* Nostr */}
              <a
                href="https://jumble.social/users/npub1q659nzy6j3mn8nr8ljznzumplesd40276tefj6gjz72npmqqg5cqmh70vv"
                target="_blank"
                rel="noreferrer"
                className="group relative flex flex-col items-center rounded-2xl border border-purple-500/20 bg-black/70 px-6 py-8 text-center transition-all duration-300 hover:border-purple-400/50 hover:shadow-[0_0_35px_rgba(168,85,247,0.15)] hover:-translate-y-1"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-purple-500/10 transition-colors group-hover:bg-purple-500/20">
                  <svg className="h-7 w-7 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.5 2L3 13h7.5l-1 9 10.5-11h-7.5l1-9z"/>
                  </svg>
                </div>
                <AnimatedHeading as="h3" className="mb-1.5 text-lg font-semibold text-zinc-50">Nostr</AnimatedHeading>
                <p className="mb-5 text-sm leading-relaxed text-zinc-400">
                  {isTigrinya ? "ካብ ምዕጋት ናጻ ዝኾኑ ሓበሬታታትን ናይ ቢትኮይን ምይይጣትን።" : "Censorship-resistant updates and the Bitcoin conversation."}
                </p>
                <span className="mt-auto inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-5 py-2 text-sm font-medium text-purple-400 ring-1 ring-purple-500/25 transition-all group-hover:bg-purple-500/20 group-hover:ring-purple-400/40">
                  {isTigrinya ? "ተኸታተሉና" : "Follow Us"}
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
                </span>
              </a>
            </AnimatedList>
          </section>
        </AnimatedSection>

        {/* 9. Mentors Preview */}
        <AnimatedSection animation="slideUp">
          <section className="mb-32 space-y-8">
            <div className="text-center">
              <AnimatedHeading as="h2" className="text-3xl font-semibold text-zinc-50 sm:text-4xl lg:text-5xl">
                {isTigrinya ? "ብመምህራንን መራሕቲ ማሕበረሰብን ዝምራሕ" : "Guided by Mentors & Community Leaders"}
              </AnimatedHeading>
            </div>
            <AnimatedList animation="slideLeft" className="flex flex-wrap justify-center items-center gap-6 max-w-7xl mx-auto">
              {mentors.map((mentor, index) => (
                <div
                  key={index}
                  className="w-full sm:w-auto max-w-sm rounded-xl border border-cyan-400/25 bg-black/80 p-8 shadow-[0_0_20px_rgba(34,211,238,0.1)] flex flex-col items-center text-center"
                >
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-500/20 to-cyan-500/20 overflow-hidden">
                    {mentor.image ? (
                      <Image
                        src={mentor.image}
                        alt={mentor.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl">👤</span>
                    )}
                  </div>
                  <AnimatedHeading as="h3" className="mb-2 text-xl font-semibold text-zinc-50">{mentor.name}</AnimatedHeading>
                  <p className="mb-2 text-base font-medium text-cyan-300">{mentor.role}</p>
                  {mentor.type && (
                    <p className="mb-3 text-xs font-medium text-orange-300">{mentor.type}</p>
                  )}
                  <p className="mb-4 text-sm text-zinc-400 flex-grow">"{mentor.description}"</p>
                  {(mentor.github || mentor.twitter) && (
                    <div className="flex items-center justify-center gap-3 mt-auto pt-4 border-t border-zinc-700 w-full">
                      {mentor.github && (
                        <a
                          href={mentor.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-400 hover:text-cyan-400 transition-colors"
                          aria-label={`${mentor.name}'s GitHub`}
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                          </svg>
                        </a>
                      )}
                      {mentor.twitter && (
                        <a
                          href={mentor.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-400 hover:text-cyan-400 transition-colors"
                          aria-label={`${mentor.name}'s Twitter`}
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </AnimatedList>
            <div className="text-center">
              <Link
                href="/mentorship"
                className="inline-flex items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-6 py-3 text-base font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
              >
                {isTigrinya ? "ምስ መማኸርቲ ተጸንበሩ" : "Join us on mentoring"}
              </Link>
            </div>
          </section>
        </AnimatedSection>

        {/* 10. Student Testimonials */}
        {testimonials.length > 0 && (
          <AnimatedSection animation="slideUp">
            <section className="mb-32 space-y-8">
              <div className="text-center">
                <AnimatedHeading as="h2" className="text-3xl font-semibold text-zinc-50 sm:text-4xl lg:text-5xl">
                  {isTigrinya ? "ተመሃሮና እንታይ ይብሉ" : "What Our Students Say"}
                </AnimatedHeading>
                <p className="mt-4 text-base text-zinc-400 sm:text-lg">
                  {isTigrinya
                    ? "ብዛዕባ ተመክሮኦም ኣብ ኣካዳሚ ካብ ተመሃሮና ስምዑ።"
                    : "Hear from our students about their experience at the academy."}
                </p>
              </div>
              <AnimatedList animation="slideUp" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {testimonials.map((t) => (
                  <div
                    key={t.id}
                    className="rounded-xl border border-cyan-400/25 bg-black/80 p-6 shadow-[0_0_20px_rgba(34,211,238,0.1)] transition hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] flex flex-col"
                  >
                    <div className="flex items-center gap-0.5 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className={`h-4 w-4 ${star <= t.rating ? 'text-yellow-400' : 'text-zinc-700'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm text-zinc-300 leading-relaxed flex-grow mb-4">&ldquo;{t.quote}&rdquo;</p>
                    <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500/20 to-cyan-500/20 overflow-hidden shrink-0">
                        {t.photo ? (
                          <Image src={t.photo} alt={t.name} width={40} height={40} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-lg">👤</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-zinc-100">{t.name}</p>
                        {t.city && <p className="text-xs text-zinc-500">{t.city}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </AnimatedList>
            </section>
          </AnimatedSection>
        )}

        {/* 11. Articles Section */}
        <AnimatedSection animation="slideUp">
          <section className="mb-32 space-y-8">
            <div className="text-center">
              <AnimatedHeading as="h2" className="text-3xl font-semibold text-zinc-50 sm:text-4xl lg:text-5xl">
                {isTigrinya ? "ጽሑፋትን መብርሂታትን" : "Articles & Deep Dives"}
              </AnimatedHeading>
              <p className="mx-auto mt-4 max-w-xl text-base text-zinc-400 sm:text-lg">
                {isTigrinya
                  ? "ብዛዕባ ታሪኽ ቢትኮይን፣ ፍልስፍና ቢትኮይን ዲጂታላዊ ናጽነትን ዝድህስሱ ዓሙቚ መጽናዕትታት።"
                  : "In-depth explorations of Bitcoin history, BItcoin philosophy, and the ideas shaping digital freedom."}
              </p>
            </div>
            <AnimatedList animation="slideUp" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: isTigrinya
                    ? "ሳይፈርፓንክስ፡ ብሕታዊነት፡ ክሪፕቶግራፊን: ቃልሲ ንዲጂታላዊ ናጽነትን"
                    : "The Cypherpunks: Privacy, Cryptography & the Fight for Digital Freedom",
                  subtitle: isTigrinya
                    ? "ብሕታዊነት፡ ክሪፕቶግራፊን ቃልሲ ንዲጂታላዊ ናጽነትን"
                    : "Cypherpunks: Privacy, Cryptography & the Fight for Digital Freedom",
                  description: isTigrinya
                    ? "ካብ መበቆል ክሪፕቶግራፊን ናይ ኢመይል መልእኽትታትን ጀሚሩ፣ ብውግእ ክሪፕቶግራፊ ኣቢሉ ክሳዕ ቢትኮይንን ድሕንነትን ዘለዎ ዘይሃስስ ጽልዋ ዝድህስስ ምሉእ ናይ ትግርኛ ጽሑፍ።"
                    : "A comprehensive article exploring the cypherpunk movement — from its origins in cryptography and mailing lists, through the Crypto Wars, to its enduring influence on Bitcoin and digital privacy.",
                  image: "/cypher-punk/The%20cypherpunk%20movement.jpg",
                  href: "/cypher-punks",
                  lang: isTigrinya ? "ትግርኛ" : "Tigrinya",
                  readTime: isTigrinya ? "10-12 ደቒቕ ንባብ" : "10-12 min read",
                  tags: isTigrinya
                    ? ["ሳይፈርፓንክስ", "ብሕታዊነት", "ክሪፕቶግራፊ"]
                    : ["Cypherpunks", "Privacy", "Cryptography"],
                },
              ].map((article, index) => (
                <Link
                  key={index}
                  href={article.href}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-orange-500/20 bg-black/80 shadow-[0_0_20px_rgba(249,115,22,0.08)] transition-all duration-300 hover:border-orange-400/50 hover:shadow-[0_0_35px_rgba(249,115,22,0.15)] hover:-translate-y-1"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-zinc-900 via-orange-900/20 to-zinc-900">
                    <img
                      src={article.image}
                      alt={article.subtitle}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute left-3 top-3 flex items-center gap-2">
                      <span className="rounded-full border border-cyan-500/40 bg-cyan-500/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-300 backdrop-blur-sm">
                        {article.lang}
                      </span>
                    </div>
                    <div className="absolute right-3 top-3">
                      <span className="rounded-full border border-zinc-600/50 bg-black/60 px-2.5 py-1 text-[10px] font-medium text-zinc-300 backdrop-blur-sm">
                        {article.readTime}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="mb-1 text-lg font-bold leading-snug text-orange-200 transition-colors group-hover:text-orange-100">
                      {article.title}
                    </h3>
                    <p className="mb-3 text-sm font-medium text-zinc-400">
                      {article.subtitle}
                    </p>
                    <p className="mb-4 text-sm leading-relaxed text-zinc-400 line-clamp-3">
                      {article.description}
                    </p>
                    <div className="mt-auto flex flex-wrap gap-2">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-orange-500/25 bg-orange-500/10 px-2.5 py-1 text-[10px] font-medium text-orange-300/80"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-cyan-400 transition-colors group-hover:text-cyan-300">
                      {isTigrinya ? "ጽሑፍ ኣንብቡ" : "Read article"}
                      <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </AnimatedList>
          </section>
        </AnimatedSection>

        {/* 12. Partners & Funders Section */}
        <AnimatedSection animation="slideUp">
          <section className="mb-32 space-y-8">
            <div className="text-center">
              <AnimatedHeading as="h2" className="text-3xl font-semibold text-zinc-50 sm:text-4xl lg:text-5xl">
                {isTigrinya ? "መሻርኽትናን ደገፍትን" : "Our Partners & Supporters"}
              </AnimatedHeading>
              <p className="mx-auto mt-4 max-w-xl text-base text-zinc-400 sm:text-lg">
                {isTigrinya
                  ? "ትምህርቲ ቢትኮይን ኣብ መላእ ኣፍሪቃ ንምስፋሕ ብዝሰርሑ ማሕበራት ዝድገፍ።"
                  : "Backed by organizations advancing Bitcoin education across Africa."}
              </p>
            </div>
            <div className="relative overflow-hidden py-4">
              <div className="absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-black to-transparent pointer-events-none" />
              <div className="absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-black to-transparent pointer-events-none" />
              <div className="flex animate-scroll-left gap-8 w-max">
                {[
                  { name: "Bitcoin", icon: "₿", color: "from-orange-500/20 to-orange-600/10", border: "border-orange-500/20", text: "text-orange-400" },
                  { name: "Lightning Network", icon: "⚡", color: "from-yellow-500/20 to-yellow-600/10", border: "border-yellow-500/20", text: "text-yellow-400" },
                  { name: "Open Source", icon: "🌍", color: "from-cyan-500/20 to-cyan-600/10", border: "border-cyan-500/20", text: "text-cyan-400" },
                  { name: "Africa Dev", icon: "🌐", color: "from-green-500/20 to-green-600/10", border: "border-green-500/20", text: "text-green-400" },
                  { name: "Education Fund", icon: "🎓", color: "from-purple-500/20 to-purple-600/10", border: "border-purple-500/20", text: "text-purple-400" },
                  { name: "Community", icon: "🤝", color: "from-pink-500/20 to-pink-600/10", border: "border-pink-500/20", text: "text-pink-400" },
                  { name: "Bitcoin", icon: "₿", color: "from-orange-500/20 to-orange-600/10", border: "border-orange-500/20", text: "text-orange-400" },
                  { name: "Lightning Network", icon: "⚡", color: "from-yellow-500/20 to-yellow-600/10", border: "border-yellow-500/20", text: "text-yellow-400" },
                  { name: "Open Source", icon: "🌍", color: "from-cyan-500/20 to-cyan-600/10", border: "border-cyan-500/20", text: "text-cyan-400" },
                  { name: "Africa Dev", icon: "🌐", color: "from-green-500/20 to-green-600/10", border: "border-green-500/20", text: "text-green-400" },
                  { name: "Education Fund", icon: "🎓", color: "from-purple-500/20 to-purple-600/10", border: "border-purple-500/20", text: "text-purple-400" },
                  { name: "Community", icon: "🤝", color: "from-pink-500/20 to-pink-600/10", border: "border-pink-500/20", text: "text-pink-400" },
                ].map((p, i) => (
                  <div
                    key={i}
                    className={`flex shrink-0 items-center gap-4 rounded-2xl border ${p.border} bg-gradient-to-br ${p.color} px-8 py-5 transition hover:scale-105`}
                  >
                    <span className="text-4xl">{p.icon}</span>
                    <span className={`text-sm font-semibold ${p.text} whitespace-nowrap`}>{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* 13. Social Media Section */}
        <AnimatedSection animation="slideUp">
          <section className="mb-32 space-y-8">
            <div className="text-center">
              <AnimatedHeading as="h2" className="text-3xl font-semibold text-zinc-50 sm:text-4xl lg:text-5xl">
                {isTigrinya ? "ምሳና ተራኸቡ" : "Connect With Us"}
              </AnimatedHeading>
              <p className="mt-4 text-base text-zinc-400 sm:text-lg">
                {isTigrinya
                  ? "ናይ መወዳእታ ዜናታት፣ ፍጻሜታትን ናይ ቢትኮይን ትምህርታዊ ትሕዝቶታትን ንክትከታተሉ ኣብ ማሕበራዊ መራኸቢታት ተኸታተሉና።"
                  : "Follow us on social media to stay updated with the latest news, events, and Bitcoin education content."}
              </p>
            </div>
            <AnimatedList animation="slideLeft" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  name: "Facebook",
                  icon: Facebook,
                  url: "https://www.facebook.com/profile.php?id=61586743276906",
                  color: "hover:bg-blue-500/20",
                },
                {
                  name: "X (Twitter)",
                  icon: Twitter,
                  url: "https://x.com/panafricanbtc",
                  color: "hover:bg-slate-500/20",
                },
                {
                  name: "Instagram",
                  icon: Instagram,
                  url: "https://www.instagram.com/panafricanbitcoin/",
                  color: "hover:bg-pink-500/20",
                },
                {
                  name: "TikTok",
                  icon: Music2,
                  url: "https://www.tiktok.com/@panafricanbitcoin",
                  color: "hover:bg-purple-500/20",
                },
              ].map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`group flex flex-col items-center justify-center rounded-xl border border-cyan-400/25 bg-black/80 p-6 text-center transition hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] ${social.color}`}
                  >
                    {IconComponent && (
                      <IconComponent className="mb-3 h-8 w-8 text-cyan-400 group-hover:text-cyan-300 transition" />
                    )}
                    <AnimatedHeading as="h3" className="text-sm font-semibold text-zinc-50 group-hover:text-cyan-200 transition">
                      {social.name}
                    </AnimatedHeading>
                  </a>
                );
              })}
            </AnimatedList>
          </section>
        </AnimatedSection>

        {/* 14. Donate Preview */}
        <AnimatedSection animation="slideUp">
          <section className="mb-20 rounded-xl border border-orange-500/25 bg-black/80 p-12 text-center shadow-[0_0_40px_rgba(249,115,22,0.2)]">
            <AnimatedHeading as="h2" className="mb-6 text-3xl font-semibold text-orange-200 sm:text-4xl">
              {isTigrinya ? "ተልእኾና ደግፉ" : "Support Our Mission"}
            </AnimatedHeading>
            <p className="mb-8 text-base text-zinc-300 sm:text-lg">
              {isTigrinya
                ? "ትምህርቲ ቢትኮይን ኣብ መላእ ኣፍሪቃ ንምስፍሕፋሕ ንዘሎና ዕላማ ደግፉ።"
                : "Support our mission to expand Bitcoin education across Africa."}
            </p>
            <Link
              href="/donate"
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-orange-400 to-cyan-400 px-8 py-4 text-base font-semibold text-black transition hover:brightness-110"
            >
              {isTigrinya ? "ወፈያ ግበር" : "Support the Academy"}
            </Link>
          </section>
        </AnimatedSection>

        {/* 15. Upcoming Events */}
        <AnimatedSection animation="slideUp">
          <section className="mb-20 space-y-8">
            <div className="text-center">
              <AnimatedHeading as="h2" className="text-3xl font-semibold text-zinc-50 sm:text-4xl lg:text-5xl">
                {isTigrinya ? "ቀረባ እዋን ዝካየዱ መደባት" : "Upcoming Events"}
              </AnimatedHeading>
              <p className="mt-4 text-base text-zinc-400 sm:text-lg">
                {isTigrinya ? "ኣብ ዝመጹ ክፍለ-ግዜታትን ዎርክሾፓትን ተሳተፉ።" : "Join our upcoming sessions and workshops."}
              </p>
            </div>
            <UpcomingEventsWithModal events={upcomingEvents} />
            <div className="text-center">
              <Link
                href="/apply"
                className="inline-flex items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-6 py-3 text-base font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
              >
                {isTigrinya ? "ናብ ጉጅለ ተጸንበሩ" : "Join a Cohort"}
              </Link>
            </div>
          </section>
        </AnimatedSection>

      </div>
    </div>
  );
}
