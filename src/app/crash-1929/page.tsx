import type { Metadata } from 'next';
import { Noto_Sans_Ethiopic } from 'next/font/google';
import { StructuredData } from '@/components/StructuredData';
import { Crash1929Client } from './Crash1929Client';

const notoEthiopic = Noto_Sans_Ethiopic({
  subsets: ['ethiopic'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: '1929: ምውዳቅ ስቶክ ማርኬትን እቲ ዓቢ ቅልውላውን | PanAfrican Bitcoin Academy',
  description:
    'ኣብ ጥቅምቲ 1929 ዘጋጠመ ናይ ስቶክ ማርኬት ምውዳቕ፡ ምፍራስ ባንክታትን ንዓለም ዘናወጸ ናይ 1930ታት ዓቢ ቅልውላውን (The Great Depression) ዝድህስስ ምሉእ ናይ ትግርኛ ጽሑፍ።',
  alternates: {
    canonical: '/crash-1929',
  },
  openGraph: {
    title: '1929: ምውዳቅ ስቶክ ማርኬትን እቲ ዓቢ ቅልውላውን',
    description:
      'ኣብ ጥቅምቲ 1929 ዘጋጠመ ናይ ስቶክ ማርኬት ምውዳቕ፡ ምፍራስ ባንክታትን ንዓለም ዘናወጸ ናይ 1930ታት ዓቢ ቅልውላውን ዝድህስስ ምሉእ ናይ ትግርኛ ጽሑፍ።',
    url: '/crash-1929',
    siteName: 'PanAfrican Bitcoin Academy',
    locale: 'ti_ET',
    type: 'article',
    images: [
      {
        url: '/1929/the%20greate%20depression.jpg',
        width: 1200,
        height: 630,
        alt: '1929: ምውዳቅ ስቶክ ማርኬትን እቲ ዓቢ ቅልውላውን',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '1929: ምውዳቅ ስቶክ ማርኬትን እቲ ዓቢ ቅልውላውን',
    description:
      'ኣብ ጥቅምቲ 1929 ዘጋጠመ ናይ ስቶክ ማርኬት ምውዳቕ፡ ምፍራስ ባንክታትን ንዓለም ዘናወጸ ናይ 1930ታት ዓቢ ቅልውላውን ዝድህስስ ምሉእ ናይ ትግርኛ ጽሑፍ።',
    images: ['/1929/the%20greate%20depression.jpg'],
  },
};

const sectionImages: Record<string, { src: string; alt: string; caption: string }[]> = {
  'section-2': [
    {
      src: 'electified apliances.jpg',
      alt: 'Electrified home appliances in the 1920s',
      caption: 'ኤሌክትሪካዊ መሳርሒታትን ናይ ተጠቃሚ ኣቑሑትን ኣብ መዓልታዊ ህይወት ዝፈጠሮ ዕብየት።',
    },
  ],
  'section-3': [
    {
      src: 'supply.jpg',
      alt: 'Illustration of supply, demand, and speculative market behavior',
      caption: 'ናይ ስቶክ ዕዳጋ ግምትታትን (speculation) ተራ ናይ ቀረብን ድልየትን ኣብ ምፍጣር ባብል (market bubble)።',
    },
  ],
  'section-6': [
    {
      src: 'car for 100.jpg',
      alt: 'Man selling his luxury roadster car for $100 cash after losing in the stock market',
      caption: 'ኣውፈርቲ ኣብ ዕዳጋ ስቶክ ድሕሪ ምኽሳሮም ዘለዎም ክቡር ንብረት ብሕሳር ዋጋ ($100 ጥረ ገንዘብ) ንምሽያጥ ተገደዱ።',
    },
  ],
  'section-7': [
    {
      src: 'need job.jpg',
      alt: 'Unemployed man wearing a sign stating his skills and need for a job',
      caption: 'ምፍራስ ባንክታትን ምዕጻው ፋብሪካታትን ንሚልዮናት ክኢላታት ሰራሕተኛታት ስራሕ-ኣልቦ ገበሮም።',
    },
  ],
  conclusion: [
    {
      src: 'the greate depression.jpg',
      alt: 'The Great Depression historic portrait of economic struggle and resilience',
      caption: 'እቲ ዓቢ ቅልውላው (The Great Depression) ኣብ ዘመናዊ ቁጠባ፡ ፋይናንሳዊ ስርዓታትን ትምህርቲ ጽኑዕ ገንዘብን ዘይሃስስ ታሪኻዊ ትምህርቲ ገደፈ።',
    },
  ],
};

const jsonLdData = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '1929: ምውዳቅ ስቶክ ማርኬትን እቲ ዓቢ ቅልውላውን',
  description:
    'ኣብ ጥቅምቲ 1929 ዘጋጠመ ናይ ስቶክ ማርኬት ምውዳቕ፡ ምፍራስ ባንክታትን ንዓለም ዘናወጸ ናይ 1930ታት ዓቢ ቅልውላውን (The Great Depression) ዝድህስስ ምሉእ ናይ ትግርኛ ጽሑፍ።',
  inLanguage: 'ti',
  image: 'https://panafricanbitcoin.com/1929/the%20greate%20depression.jpg',
  publisher: {
    '@type': 'Organization',
    name: 'PanAfrican Bitcoin Academy',
    url: 'https://panafricanbitcoin.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://panafricanbitcoin.com/icons/icon-512x512.png',
    },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://panafricanbitcoin.com/crash-1929',
  },
};

export default function Crash1929Page() {
  return (
    <div className={`${notoEthiopic.className} min-h-screen overflow-x-hidden bg-[#07080b] text-stone-100 selection:bg-amber-500/30 selection:text-amber-200`}>
      <StructuredData data={jsonLdData} />
      <Crash1929Client sectionImages={sectionImages} />
    </div>
  );
}
