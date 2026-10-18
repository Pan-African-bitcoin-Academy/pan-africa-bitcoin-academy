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
      <Crash1929Client />
    </div>
  );
}
