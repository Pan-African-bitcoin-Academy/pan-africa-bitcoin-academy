'use client';

import { AnimatedSection } from "@/components/AnimatedSection";
import { HeroHeadline } from "@/components/HeroHeadline";
import { HeroCtaButtons } from "@/components/HeroCtaButtons";
import { HomeSectionsClient, type ImpactStats, type Mentor, type Testimonial } from "@/components/HomeSectionsClient";
import { useLanguage } from "@/contexts/LanguageContext";
import { getHomeCopy } from "@/lib/translations/home";

export function HomePageClient({
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
  const t = getHomeCopy(language);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <AnimatedSection animation="fadeIn" duration={700} threshold={0.05}>
        <section className="relative flex min-h-screen flex-col items-center justify-center w-full">
          <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="pointer-events-none absolute left-0 top-32 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />

          <div className="relative z-10 w-full px-4 space-y-6 sm:space-y-8 text-center sm:max-w-4xl ml-auto lg:px-6">
            <HeroHeadline />
            <p className="w-full text-base sm:text-lg text-zinc-400 leading-relaxed sm:max-w-2xl sm:mx-auto">
              {t.hero.description}
            </p>
            <HeroCtaButtons />
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-1/3 overflow-hidden">
            <div className="relative h-full w-full">
              <div className="absolute inset-0 opacity-30" style={{ display: 'grid', gridTemplateColumns: 'repeat(40, 1fr)', gap: '2px' }}>
                {Array.from({ length: 800 }).map((_, i) => {
                  const x = i % 40;
                  const y = Math.floor(i / 40);
                  const seed = (x * 7 + y * 13) % 100;
                  const isLand = seed < 30;
                  const isGlow = seed > 95;
                  return (
                    <div
                      key={i}
                      className={`h-2 w-2 ${
                        isGlow
                          ? "bg-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.8)]"
                          : isLand
                          ? "bg-orange-500/60"
                          : "bg-transparent"
                      }`}
                    />
                  );
                })}
              </div>
              <div className="absolute inset-0">
                {[
                  { x: "15%", y: "30%" },
                  { x: "35%", y: "25%" },
                  { x: "50%", y: "35%" },
                  { x: "70%", y: "40%" },
                  { x: "25%", y: "60%" },
                  { x: "60%", y: "65%" },
                ].map((point, i) => (
                  <div
                    key={i}
                    className="absolute h-3 w-3 rounded-full bg-orange-400 shadow-[0_0_20px_rgba(249,115,22,1)]"
                    style={{
                      left: point.x,
                      top: point.y,
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      <HomeSectionsClient
        mentors={mentors}
        impactStats={impactStats}
        upcomingEvents={upcomingEvents}
        testimonials={testimonials}
      />
    </div>
  );
}
