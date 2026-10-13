'use client';

import { BlurText } from '@/components/BlurText';
import { useLanguage } from '@/contexts/LanguageContext';

const handleAnimationComplete = () => {
  console.log('Animation completed!');
};

export function HeroHeadline({
  onAnimationComplete = handleAnimationComplete,
}: {
  onAnimationComplete?: () => void;
}) {
  const { language } = useLanguage();
  const isTigrinya = language === 'ti';

  return (
    <>
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-zinc-50 leading-tight">
        <BlurText
          key={isTigrinya ? 'ti-title' : 'en-title'}
          text={isTigrinya ? "ኣጠቓቕማ ቢትኮይን ምስፋሕ" : "Scaling Bitcoin adoption"}
          delay={300}
          animateBy="words"
          direction="top"
          onAnimationComplete={onAnimationComplete}
          className="inline-block mb-8"
        />
      </h1>
      <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-orange-400 leading-tight">
        <BlurText
          key={isTigrinya ? 'ti-subtitle' : 'en-subtitle'}
          text={isTigrinya ? "ቢትኮይን ንዓቢ ፋይናንስያዊ ንለውጢ" : "Turning Africa orange"}
          delay={600}
          animateBy="words"
          direction="bottom"
          className="inline-block"
        />
      </p>
      <p className="w-full text-base sm:text-lg text-zinc-400 leading-relaxed sm:max-w-2xl sm:mx-auto">
        {isTigrinya
          ? "ኣብቲ ንኣፍሪቃ ዝተዳለወ ብተግባር ዝምህር ትምህርቲ ቤት ቢትኮይንና ተጸንበሩ። ብምግባር ተማሃሩ፣ ሳትስ (sats) ረኸቡ፣ ኣብቲ እናዓበየ ዝኸይድ ማሕበረሰብ ሃነጽቲ ክፋል ኩኑ።"
          : "Join our hands-on Bitcoin academy designed for Africa. Learn by doing, earn sats, and become part of a growing community of builders."}
      </p>
    </>
  );
}
