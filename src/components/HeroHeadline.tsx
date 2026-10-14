'use client';

import { BlurText } from '@/components/BlurText';
import { useLanguage } from '@/contexts/LanguageContext';
import { getHomeCopy } from '@/lib/translations/home';

const handleAnimationComplete = () => {
  console.log('Animation completed!');
};

export function HeroHeadline({
  onAnimationComplete = handleAnimationComplete,
}: {
  onAnimationComplete?: () => void;
}) {
  const { language } = useLanguage();
  const t = getHomeCopy(language);

  return (
    <>
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-zinc-50 leading-tight">
        <BlurText
          key={`${language}-heading`}
          text={t.hero.heading}
          delay={300}
          animateBy="words"
          direction="top"
          onAnimationComplete={onAnimationComplete}
          className="inline-block mb-8"
        />
      </h1>
      <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-orange-400 leading-tight">
        <BlurText
          key={`${language}-subheading`}
          text={t.hero.subheading}
          delay={600}
          animateBy="words"
          direction="bottom"
          className="inline-block"
        />
      </p>
    </>
  );
}
