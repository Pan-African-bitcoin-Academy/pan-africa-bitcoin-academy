'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  TrendingDown, 
  Building2, 
  Users, 
  Wheat, 
  Clock, 
  Share2, 
  Check, 
  Calendar,
  AlertTriangle,
  ShieldCheck,
  Coins,
  ArrowRight,
  Sparkles,
  BookOpen,
  ExternalLink
} from 'lucide-react';
import { MarkdownContent } from '@/components/MarkdownContent';
import { ZoomableImage } from '@/components/ZoomableImage';
import { DownloadPdfButton } from '@/components/DownloadPdfButton';
import { crash1929ArticleSections } from '@/content/crash1929Article';



const CRASH_1929_PDF_NAME = 'Tig The 1929 Stock Market Crash and the Great Depression - panBTC.pdf';
const CRASH_1929_PDF_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/doc_files/${encodeURIComponent(CRASH_1929_PDF_NAME)}`
  : `/doc_files/${encodeURIComponent(CRASH_1929_PDF_NAME)}`;

// Historical eras grouping for the circular ticker ribbon
const HISTORICAL_ERAS = [
  { id: 'era-all', label: 'ኩሉ ትሕዝቶ', range: 'መላእ ጽሑፍ', icon: Sparkles, targetId: 'intro' },
  { id: 'era-prosperity', label: '1920ታት: ብልጽግና', range: 'ምዕራፍ 1 – 4', icon: Sparkles, targetId: 'section-2' },
  { id: 'era-crash', label: 'ጥቅምቲ 1929: ምውዳቕ', range: 'ምዕራፍ 5 – 6', icon: TrendingDown, targetId: 'section-5' },
  { id: 'era-depression', label: '1930–1933: ዓቢ ቅልውላው', range: 'ምዕራፍ 7 – 13', icon: AlertTriangle, targetId: 'section-7' },
  { id: 'era-reforms', label: 'ጽገናታትን ቢትኮይንን', range: 'ምዕራፍ 14 – 18', icon: Coins, targetId: 'section-14' },
];

// 5 Misconceptions from 1929 Crash (Section 17)
const MISCONCEPTIONS_DATA = [
  {
    step: '1',
    myth: 'ጌጋ ርድኢት 1: ናይ ዕዳጋ ስቶክ ውድቀት ጥራሕ ነቲ ዓቢ ቅልውላውን ኣስዒብዎ',
    reality: [
      'እቲ ውድቀት ኣገዳሲ ምዝባዕ ነበረ፡ እንተኾነ ግን ናይቲ ቅልውላውን እንኮ ምኽንያት ኣይነበረን።',
      'ናይ ባንክታት ፍርሃት፡ ናይ ገንዘብን ልቓሕን ምፍራስ፡ ዲፍሌሽን፡ ናይ ፖሊሲ ውድቀታት፡ ኣህጉራዊ ናይ ዕዳ ሽግራት ንናይ ወርቂ ደረጃ ገደቦታትን ንናይቲ ቕልውላው ዕምቆትን ዝተናወሐ እዋን ኣስተዋጽኦ ጌሩ።',
    ],
  },
  {
    step: '2',
    myth: 'ጌጋ ርድኢት 2: ኣብ ስቶክ ወፍሪ ዝገበረ ኩሉ ሰብ ብሓደ ለይቲ ድኻ ኾነ',
    reality: [
      'ገሊኦም ኣውፈርቲ ዓበይቲ መጠን ገንዘብ ክኸስሩ ከለዉ፡ ካልኦት ግን ኣብቲ ዕዳጋ ውሑድ ተሳትፎ ነበሮም ወይ ቅድሚቶም ዝዓበዩ ውድቀታት ሸይጦም ነበሩ።',
      'እቲ ዝሰፍሐ ኢኮኖሚይዊ ሳዕቤናት ግን ካብ ናይ ነፍሲ ወከፍ ሰብ ናይ ወፍሪ ንጥፈታት ንላዕሊ ኣዝዩ ሰፊሕ ነበረ። ኣብ ዕዳጋ ስቶክ ወፍሪ ዘይነበሮም ሰራሕተኛታትን ስደራቤታትን እውን ካብ ሽቅለት-ኣልቦነት፡ ትሑት ደሞዝ፡ ናይ ትካላት ምዕጻውን ናይ ባንክታት ምፍራስን ተጎድኡ።',
    ],
  },
  {
    step: '3',
    myth: 'ጌጋ ርድኢት 3: ዋጋታት ምስ ወረደ እቲ ኢኮኖሚያዊ ስርዓት ብተፈጥሮኡ ብኡንብኡ ይምለስ',
    reality: [
      'ዝወረደ ዋጋታት ምትዕርራይ ኢኮኖምይ ኣያረጋግጹን እዮም። ኣታዊታትን ናይ ንብረት ዋጋታትን ክወርዱ ኸለዉ ዕዳታት ዘይተቐየሩ ኮይኖም እንተጸኒሖም፡ ተለቃሕቲ ንምክፋል ዘለዎም ዓቕሚ ክደክም ይኽእል እዩ። ዝወረዱ ዋጋታት እውን ወጻኢታት ክቐንሱ ንናይ ትካላት ኣታዊ ድማ ክደክሙ ይኽእሉ እዮም።',
      'ስለዚ ዲፍሌሽን ነቲ ምውዳቅ ብቕልጡፍ ካብ ምትንሳእ ብዝኸፍአ ምውዳቅ ክስዕቦ ይኽእል እዩ።',
    ],
  },
  {
    step: '4',
    myth: 'ጌጋ ርድኢት 4: ሩዝቬልት ፕሬዚደንት ክሳብ ዝኸውን መንግስቲ ዝገበሮ የለን',
    reality: [
      'ናይ ሁቨር መንግስቲ ነቲ ቕልውላው ንምእላይ እተፈላለዩ መዐቀኒታት ኣተኣታተወ፡ ናይ ህዝቢ ስራሕቲ ፈተነታትን Reconstruction Finance Corporation ን ዘጠቓለለ።',
      'እቲ ሕቶ እቲ መንግስቲ ሰሪሑዶ ኣይሰርሐን ዝብል ጥራሕ ኣይኮነን። እቲ ናይዞም ስራሕቲ እዚኦም መጠን፡ እዋንን ዓይነትን ንናይቲ ቕልውላው ምትዕርራይ እኹል ነይሩዶ ኣይነበረን ዝብል እዩ።',
    ],
  },
  {
    step: '5',
    myth: 'ጌጋ ርድኢት 5: እቲ ሓዲሽ ውዕል ብኡንብኡ ነቲ ቅልውላው ኣብቅዖ',
    reality: [
      'እቲ ሓዲሽ ውዕል ንፋይናንሳዊ ስርዓት ቀይርዎ ኢዩ፡ ዓቢ ረድኤት እውን ኣቅሪቡ ኢዩ፡ እንተኾነ ግን ሰፊሕ ሽቅለት-ኣልቦነት ኣብ መብዛሕትኡ ክሳብ ናይ 1930ታት ጸንሐ።',
      'ምስ ናይ ኲናት እዋን ምድላዋት ዝተኣሳሰረ ኢኮኖሚያዊ ምግፋሕ ናይ ስራሕ ዕድላት ኣብ ምፍጣር ወሳኒ ነበረ።',
    ],
  },
];

// 7 Lessons from 1929 Crash (Clean Section 8 styled structure)
const LESSONS_DATA = [
  {
    step: '1',
    title: 'ትምህርቲ 1: ዝዓቢ ናይ ንብረት ዋጋታት ስግኣት ኣየወግዱን እዮም',
    paragraphs: [
      'ሓደ ወፍሪ ንነዊሕ እዋን ዋጋኡ ክውስኽ ይኽእል እዩ፡ እንተኾነ ግን ንሃንደበታዊ ምልዋጥ ዝተቓልዐ ኮይኑ ይጸንሕ።',
      'ናይ ሕሉፍ ወሰኽ ዋጋታት ንናይ መጻኢ ረብሓታት ኣያረጋግጽን እዩ። ዋጋታት ክውስኹ እዮም ብዝብል ናይ ኣውፈርቲ እምነት ክሳብ ክንደይ ብቕልጡፍ ክቐይር ከምዝኽእል ከየስተውዕልዎ ይኽእሉ እዮም።',
    ],
  },
  {
    step: '2',
    title: 'ትምህርቲ 2: ምልቃሕ ንረብሓን ጥፍኣትን የዕብዮ እዩ',
    paragraphs: [
      'ማርጂን (leverage) ንኣውፈርቲን ትካላትን ብውሑድ ናቶም ካፒታል ንኽዓይዩ የኽሎም። እንተኾነ ግን ምልቃሕ ናይ ንብረት ዋጋታትን ኣታዊታትን ክወድቁ ኸለዉ እውን ዘይጠፍኡ ዕዳታት ይፈጥር።',
      'ብዙሓት ተሳተፍቲ ብሓደ እዋን ለቃሕ እንተተጠቒሞም፡ ናይ ግዴታ ምሽያጥ ምስኮነ ናይ ዕዳጋ ምውዳቅ ክስዕብ ይኽእል እዩ።',
    ],
  },
  {
    step: '3',
    title: 'ትምህርቲ 3: ባንክታት ኣብ ኢኮኖሚያዊ ስርዓት ኣገዳሲ ተራ ይጻወቱ',
    paragraphs: [
      'ባንክታት ንክፍሊታት ይደግፉ፡ ቁጥባታት ይሕግዙ፡ ንስደራቤታትን ትካላትን ድማ ልቓሕ የቐርቡ።',
      'ኣብ ልዕሊ ባንክታት ዘሎ እምነት ምስ ዝፈርስ፡ ሳዕቤኑ ካብቶም ትካላት ንላዕሊ ይዘርግሕ። ንቡራት ምልውዋጣቶች ብዝኸፍአ ኣሸጋሪ ይኾኑ፡ ትካላት ናብ ምምዋል ምብጻሕ ዕድሎም ይስእኑ፡ ቁጠባዊ ንጥፈት ድማ ይወድቕ።',
    ],
  },
  {
    step: '4',
    title: 'ትምህርቲ 4: ዲፍሌሽን ንዕዳ ናብ ዝገደደ ጾር ክቐይሮ ይኽእል',
    paragraphs: [
      'ኣታዊታትን ዋጋታትን ክወድቁ ኸለዉ ዕዳታት ዘይተቐየሩ ኮይኖም እንተጸኒሖም፡ ተለቃሕቲ ግዴታታቶም ንምእላይ ብኣሸጋሪ መገዲ ብዝርከብ ገንዘብ ክከፍሉ ኣለዎም።',
      'እዚ ንምዕጻዋት ክውስኽ፡ ወጻኢታት ክቐንስን ንፋይናንሳዊ ስርዓት ክጎድእን ይኽእል እዩ።',
    ],
  },
  {
    step: '5',
    title: 'ትምህርቲ 5: ፋይናንሳዊ ቕልውላዋት እዋናውን ውጽኢታውን ምላሽ የድልዮም',
    paragraphs: [
      'እቲ ዓቢ ቅልውላውን ናይ ገንዘብን ፋይናንስን ትካላት ሓደ ምውዳቅ ዝተወሰነ ኮይኑ ክጸንሕዶ ወይ ናብ ዝተናወሐ ሓደጋ ክቐይር ይኽእል ጽልዋ ከምዘለዎም ኣርኣየ።',
      'ናይ ባንክታት ፍርሃት ምግታእ፡ ናይ ልቓሕ ዋሕዚ ምሕላውን ዘየድልዩ ጽኑዕ ምሕጻራት ምውጋድን ኣብ እዋን ቕልውላው ዓቢ ኣገዳስነት ኣለዎም።',
      'እቲ ዝግብኦ ምላሽ ኣብ ኩነታት ዝተመርኮሰ እዩ፡ ታሪኻውያንን ኢኮኖሚይዋያንን ድማ ብዛዕባ ናይ ፍሉያት ፖሊሲታት ውጽኢታውነት ክትዖም ይቐጽሉ ኣለዉ።',
    ],
  },
  {
    step: '6',
    title: 'ትምህርቲ 6: ናይ ውሽጢ ሃገር ኢኮኖሚያዊ ፖሊሲ ኣህጉራዊ ሳዕቤናት ክሃልዎ ይኽእል',
    paragraphs: [
      'ናይ ንግዲ ገደባትን ናይ ገንዘብ ውሳኔታትን ኣብ ምልቃሕ ዝገበሩ ለውጥታትን ብኣህጉራዊ ፋይናንሳዊ ንግዲን መእሰሪታት ኣቢሎም ንካልኦት ሃገራት ክጸልዉ ይኽእሉ እዮም።',
      'ሓደ ሃገር ኣብ ናይ ውሽጢ ሃገር ኩነታት ጥራሕ ብምድሃብ ኩሉ እዋን ካብ ቕልውላው ባዕሉ ክከላኸል ኣይክእልን እዩ።',
    ],
  },
  {
    step: '7',
    title: 'ትምህርቲ 7: ኢኮኖሚያዊ ቕልውላዋት ነቶም ዘይፈጠርዎ ሰባት ይጸልዎም እዩ',
    paragraphs: [
      'ኣብ እዋን እቲ ቅልውላውን ዝተጎድኡ ብዙሓት ስደራታት ኣብ ዕዳጋ ስቶክ ግምትታት ኣይሳተፉን ነበሩ።',
      'ሰራሕተኛታት ስራሕቶም ስኣኑ፡ ሓረስቶት መሬቶም ስኣኑ፡ ገሊኦም ዝዓቆርዎ ሃብቲ ስኣኑ፡ ማሕበረሰባታት ድማ ዝገደደ ድኽነት ገጠሞም።',
      'ናይ ፋይናንሳዊ ዘይምርግጋእ ማሕበራዊ ሳዕቤናት ስለምንታይ ናይ ተጠቃሚ ምክልኻልን ውጽኢታውያን ናይ ህዝቢ ትካላትን ኣገደስቲ ከምዝኾኑ ዘርኢ እዩ።',
    ],
  },
];

// Historical references & scholarly literature with verified direct links
const REFERENCES_DATA = [
  {
    id: '01',
    author: 'National Bureau of Economic Research (NBER)',
    work: 'Business Cycle Dating Committee chronology of U.S. expansions and contractions.',
    year: 'NBER',
    url: 'https://www.nber.org/system/files/chapters/c7498/c7498.pdf',
    domain: 'nber.org (PDF)',
  },
  {
    id: '02',
    author: 'Federal Reserve History',
    work: "Historical accounts of the stock market crash of 1929, the Great Depression, and the Federal Reserve's response.",
    year: 'Fed Archive',
    url: 'https://www.federalreservehistory.org/essays/stock-market-crash-of-1929',
    domain: 'federalreservehistory.org',
  },
  {
    id: '03',
    author: 'Milton Friedman and Anna Jacobson Schwartz',
    work: 'A Monetary History of the United States, 1867–1960.',
    year: '1963',
    url: 'https://www.nber.org/books-and-chapters/monetary-history-united-states-1867-1960',
    domain: 'nber.org / Princeton',
  },
  {
    id: '04',
    author: 'Ben S. Bernanke',
    work: 'Essays on the Great Depression.',
    year: '2000',
    url: 'https://press.princeton.edu/books/paperback/9780691118208/essays-on-the-great-depression',
    domain: 'press.princeton.edu',
  },
  {
    id: '05',
    author: 'Barry Eichengreen',
    work: 'Golden Fetters: The Gold Standard and the Great Depression, 1919–1939.',
    year: '1992',
    url: 'https://www.nber.org/books-and-chapters/golden-fetters-gold-standard-and-great-depression-1919-1939',
    domain: 'nber.org / Oxford',
  },
  {
    id: '06',
    author: 'John Kenneth Galbraith',
    work: 'The Great Crash 1929.',
    year: '1954',
    url: 'https://archive.org/details/greatcrash19290000galb_h2e8',
    domain: 'archive.org',
  },
];

export function Crash1929Client() {
  // Reading progress and active section state
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState('intro');
  const [showTopBar, setShowTopBar] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Track scroll position for progress bar, active section spy, and floating toolbar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollY = window.scrollY;
      
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollY / totalHeight) * 100));
        setReadingProgress(Math.round(progress));
      }

      setShowTopBar(scrollY > 450);

      // Scroll spy for active chapter
      const sectionElements: { id: string; el: HTMLElement }[] = [];
      for (const s of crash1929ArticleSections) {
        const el = document.getElementById(s.id);
        if (el) {
          sectionElements.push({ id: s.id, el });
        }
      }

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const { id, el } = sectionElements[i];
        const rect = el.getBoundingClientRect();
        if (rect.top <= 220) {
          setActiveSectionId(id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: '1929: ምውዳቅ ስቶክ ማርኬትን እቲ ዓቢ ቅልውላውን',
          text: 'ኣብ ጥቅምቲ 1929 ዘጋጠመ ናይ ስቶክ ማርኬት ምውዳቕን ናይ 1930ታት ዓቢ ቅልውላውን ዝድህስስ ምሉእ ናይ ትግርኛ ጽሑፍ።',
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    await navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Standard comfortable font size class for Tigrinya reading
  const contentFontClass = 'text-base sm:text-lg leading-[1.95]';

  // Current section title for top bar
  const currentSection = crash1929ArticleSections.find((s) => s.id === activeSectionId);

  return (
    <>
      {/* 1. Global Reading Progress Bar fixed at the absolute top */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-black/40">
        <div
          className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300 shadow-[0_0_12px_rgba(245,158,11,0.7)] transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* 2. Sticky Editorial Companion Floating Bar */}
      <div
        className={`fixed top-1 left-0 right-0 z-40 transition-all duration-300 ${
          showTopBar
            ? 'translate-y-0 opacity-100 backdrop-blur-md bg-[#090b10]/90 border-b border-amber-900/40 shadow-xl'
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8 flex items-center justify-between gap-3 text-xs sm:text-sm">
          {/* Current reading chapter tag */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-300 shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              1929 ARCHIVE
            </span>
            <p className="truncate font-medium text-stone-200">
              {currentSection ? currentSection.heading : '1929: ምውዳቅ ስቶክ ማርኬትን እቲ ዓቢ ቅልውላውን'}
            </p>
          </div>

          {/* Controls: Share */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Share button */}
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-lg border border-stone-800 bg-stone-900/80 px-3 py-1.5 text-xs text-stone-300 hover:border-amber-500/40 hover:text-amber-300 transition"
              title="Share Article"
            >
              {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
              <span>{copiedLink ? 'ተቐዲሑ!' : 'ኣካፍል'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Page Container with increased width */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        
        {/* Broadsheet Masthead Header Strip */}
        <div className="border-b border-amber-900/40 pb-3 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono tracking-widest uppercase text-stone-400">
            <div className="flex items-center gap-2 text-amber-400">
              <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
              <span>ታሪኻዊ መዝገብ ፋይናንስ • ጥራዝ 1929</span>
            </div>
            <div className="hidden md:flex items-center gap-4 text-stone-500">
              <span>✦ ዎል ስትሪትን እቲ ዓቢ ቅልውላውን ✦</span>
              <span>1929 – 1939</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-500 font-semibold">PAN-AFRICAN BITCOIN ACADEMY</span>
            </div>
          </div>
        </div>

        {/* Hero Section: Broadsheet Archival Style */}
        <header className="animate-crash-hero relative mb-12 rounded-3xl border border-amber-900/30 bg-gradient-to-b from-[#11131a] via-[#0d0f15] to-[#08090d] p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden">
          {/* Subtle warm amber radial backdrop */}
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-amber-600/10 blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute top-1/2 -right-24 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

          {/* Vintage Ticker Tape Ribbon */}
          <div className="mb-6 inline-flex flex-wrap items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-950/20 px-3.5 py-1.5 text-xs text-amber-300 font-mono transition-colors hover:border-amber-400/40">
            <span className="font-bold text-amber-400">NYSE:</span>
            <span>ጥቅምቲ 1929 📉</span>
            <span className="text-stone-600">•</span>
            <span>ጸሊም ሓሙስ</span>
            <span className="text-stone-600">•</span>
            <span>ጸሊም ሰሉስ</span>
            <span className="text-stone-600">•</span>
            <span>ምፍራስ ባንክታት</span>
            <span className="text-stone-600">•</span>
            <span>ዕዳ-ዲፍሌሽን</span>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
            <div>
              <p className="mb-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-amber-400/90 font-mono">
                Historical Economic Dossier
              </p>
              
              <h1 className="animate-crash-title text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-[1.25] sm:leading-[1.2]">
                1929: ምውዳቅ ስቶክ ማርኬትን እቲ ዓቢ ቅልውላውን
              </h1>

              <p className="mt-4 text-base sm:text-lg text-stone-300 leading-relaxed max-w-3xl transition-colors hover:text-stone-200">
                ካብ ናይ 1920ታት ዘበነ ብልጽግና (Roaring Twenties) ክሳዕ ጸሊም ሓሙስ፡ ምፍራስ 9,000 ባንክታትን ንዓለም ዘናወጸ ናይ 1930ታት ዓቢ ቅልውላውን (The Great Depression) — ምሉእ ታሪኻውን ቁጠባውን ትንተና ብትግርኛ።
              </p>

              {/* Reading Meta Badges */}
              <div className="mt-6 flex flex-wrap items-center gap-2.5 text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-3.5 py-1.5 font-medium text-amber-300 transition-transform duration-200 hover:scale-105">
                  <Clock className="h-3.5 w-3.5" />
                  15-20 ደቒቕ ንባብ
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-700 bg-stone-900/90 px-3.5 py-1.5 text-stone-300 transition-transform duration-200 hover:scale-105">
                  ትግርኛ (Tigrinya)
                </span>
              </div>

              {/* Download PDF Button with Sign-In Verification */}
              <div className="mt-4">
                <DownloadPdfButton
                  pdfUrl={CRASH_1929_PDF_URL}
                  fileName={CRASH_1929_PDF_NAME}
                  buttonText="ፒዲኤፍ ኣውርድ (Download PDF)"
                  downloadingText="የውርድ ኣሎ..."
                  className="inline-flex items-center gap-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs sm:text-sm font-semibold text-amber-300 transition-all duration-300 hover:bg-amber-500/20 hover:text-amber-200 hover:border-amber-400 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer"
                />
              </div>
            </div>

            {/* Hero Archival Showcase Card */}
            <div className="relative group hover-lift-card">
              <div className="relative overflow-hidden rounded-2xl border-2 border-amber-900/40 bg-black shadow-2xl p-2.5 transition-all duration-300 group-hover:border-amber-500/50 group-hover:shadow-[0_15px_40px_rgba(245,158,11,0.15)]">
                <div className="relative overflow-hidden rounded-xl">
                  <ZoomableImage
                    src={`/1929/${encodeURIComponent('the greate depression.jpg')}`}
                    alt="1929: ምውዳቅ ስቶክ ማርኬትን እቲ ዓቢ ቅልውላውን"
                    caption="እቲ ዓቢ ቅልውላው (The Great Depression)፡ ኣብ 1930ታት ኣብ ልዕሊ ሚልዮናት ስድራቤታትን ዓለምለኻዊ ቁጠባን ዘስዓቦ ዘይሃስስ ማሕበራውን ፋይናንሳውን ስንብራት።"
                    thumbnailClassName="max-h-[380px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                
                {/* Archival metadata tag */}
                <div className="mt-2.5 flex items-center justify-between px-2 text-[11px] font-mono text-stone-400 border-t border-stone-800/80 pt-2">
                  <span className="text-amber-400/90">መዝገብ ስእሊ • 1929 WALL ST.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Historical Telemetry HUD: 4 Key Metrics of the 1929 Crash */}
          <div className="mt-10 pt-8 border-t border-amber-900/40 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="hover-lift-card rounded-2xl border border-rose-900/40 bg-gradient-to-b from-rose-950/20 to-black/60 p-4 transition-all duration-300 hover:border-rose-500/60 hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]">
              <div className="flex items-center justify-between text-rose-400 mb-1">
                <span className="text-xs font-mono uppercase tracking-wider">Dow Jones Collapse</span>
                <TrendingDown className="h-4 w-4" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-300">-89.2%</div>
              <p className="mt-1 text-[11px] text-stone-400">ካብ 381 ነጥቢ (1929) ናብ 41 ነጥቢ (1932)</p>
            </div>

            <div className="hover-lift-card rounded-2xl border border-amber-900/40 bg-gradient-to-b from-amber-950/20 to-black/60 p-4 transition-all duration-300 hover:border-amber-500/60 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]">
              <div className="flex items-center justify-between text-amber-400 mb-1">
                <span className="text-xs font-mono uppercase tracking-wider">Bank Failures</span>
                <Building2 className="h-4 w-4" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-300">9,000+</div>
              <p className="mt-1 text-[11px] text-stone-400">ኣብ ሕቡራት መንግስታት ኣሜሪካ ዝፈረሳ ባንክታት</p>
            </div>

            <div className="hover-lift-card rounded-2xl border border-rose-900/40 bg-gradient-to-b from-rose-950/20 to-black/60 p-4 transition-all duration-300 hover:border-rose-500/60 hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]">
              <div className="flex items-center justify-between text-rose-400 mb-1">
                <span className="text-xs font-mono uppercase tracking-wider">Peak Unemployment</span>
                <Users className="h-4 w-4" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-300">24.9%</div>
              <p className="mt-1 text-[11px] text-stone-400">ኣብ 1933 ሓደ ካብ ኣርባዕተ ዜጋታት ስራሕ ሰኣነ</p>
            </div>

            <div className="hover-lift-card rounded-2xl border border-stone-800 bg-gradient-to-b from-stone-900/30 to-black/60 p-4 transition-all duration-300 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]">
              <div className="flex items-center justify-between text-stone-300 mb-1">
                <span className="text-xs font-mono uppercase tracking-wider">Industrial Drop</span>
                <Wheat className="h-4 w-4 text-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-stone-200">-50%+</div>
              <p className="mt-1 text-[11px] text-stone-400">ምቑራጽ ዋጋታት ፍርያት ሕርሻን ምህርትን</p>
            </div>
          </div>
        </header>

        {/* Circular / Moving Historical Eras Navigation Ribbon */}
        <nav aria-label="Historical Eras" className="mb-12 relative overflow-hidden py-2 border-y border-stone-800/80 bg-stone-950/40 rounded-2xl">
          {/* Subtle fade masks on left and right */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#07080b] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#07080b] to-transparent z-10" />

          <div className="flex items-center">
            {/* Stationary Header Label */}
            <div className="flex items-center gap-1.5 shrink-0 pr-4 z-20 bg-[#07080b]/95 backdrop-blur-sm py-2 pl-3 border-r border-amber-900/40 text-xs font-mono text-amber-400 uppercase tracking-wider">
              <Calendar className="h-3.5 w-3.5" />
              <span>ታሪኻዊ እዋናት:</span>
            </div>

            {/* Seamless Circular Moving Loop Track */}
            <div className="flex w-max animate-scroll-left gap-3.5 pl-4 hover:[animation-play-state:paused]">
              {[...HISTORICAL_ERAS, ...HISTORICAL_ERAS].map((era, index) => {
                const Icon = era.icon;
                return (
                  <button
                    key={`${era.id}-${index}`}
                    type="button"
                    onClick={() => scrollToSection(era.targetId)}
                    className="inline-flex items-center gap-2.5 rounded-xl border border-amber-900/40 bg-[#0d0f15]/90 hover:border-amber-500/60 hover:bg-amber-950/30 px-4 py-2 text-xs font-medium text-stone-300 hover:text-amber-200 transition shrink-0 shadow-md cursor-pointer"
                  >
                    <Icon className="h-3.5 w-3.5 text-amber-400" />
                    <span>{era.label}</span>
                    <span className="text-[10px] font-mono text-stone-500">({era.range})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* 4. Main Long-Form Article Stream with Expansive Width */}
        <main className="mx-auto max-w-6xl space-y-12">
          {crash1929ArticleSections.map((section, sectionIndex) => {
            const isIntro = section.id === 'intro';
            const isSection5 = section.id === 'section-5';
            const isSection8 = section.id === 'section-8';
            const isSection17 = section.id === 'section-17';
            const isSection18 = section.id === 'section-18';
            const isConclusion = section.id === 'conclusion';

            return (
              <article
                key={section.id}
                id={section.id}
                className={`scroll-mt-24 rounded-3xl border transition-all duration-300 p-6 sm:p-10 ${
                  activeSectionId === section.id
                    ? 'border-amber-500/50 bg-gradient-to-b from-[#131620] via-[#0d0f17] to-[#090b10] shadow-[0_10px_35px_rgba(245,158,11,0.09)]'
                    : 'border-stone-800/90 bg-[#090b10]/95 hover:border-stone-700/90 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
                }`}
              >
                {/* Chapter Masthead Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-stone-800/80">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-amber-300 transition-transform duration-200 hover:scale-105">
                      {isIntro ? 'መእተዊ' : isConclusion ? 'መደምደምታ' : `ምዕራፍ ${String(sectionIndex).padStart(2, '0')}`}
                    </span>
                    {section.highlightTerms && section.highlightTerms.length > 0 && (
                      <span className="hidden sm:inline-block text-xs font-mono text-stone-500">
                        {section.highlightTerms.slice(0, 3).join(' • ')}
                      </span>
                    )}
                  </div>

                  <a
                    href={`#${section.id}`}
                    className="text-xs font-mono text-stone-500 hover:text-amber-400 hover:underline transition"
                    title="Direct Link"
                  >
                    #{section.id}
                  </a>
                </div>

                {/* Section Title */}
                <h2 className="group flex items-center gap-2 text-2xl sm:text-3xl font-bold tracking-tight text-stone-100 leading-snug mb-6 transition-all duration-300 hover:text-amber-200">
                  <span className="transition-transform duration-300 group-hover:translate-x-1">{section.heading}</span>
                </h2>

                {/* Content: Section 17 Myth Buster Showcase */}
                {isSection17 ? (
                  <div className="space-y-6">
                    <p className={`text-stone-300 leading-relaxed ${contentFontClass}`}>
                      ብዙሓት ዝተቓለሉ መብሪህቲታት እዚ ቕልውላው ሰባት ከመይ ከም ዝርድእዎ ይቐርጹ ኣለዉ።
                    </p>

                    <div className="space-y-4 pt-1">
                      {MISCONCEPTIONS_DATA.map((item) => (
                        <div
                          key={item.step}
                          className="rounded-2xl border border-stone-800/90 bg-gradient-to-br from-stone-900/60 via-[#10121a] to-stone-950 p-5 sm:p-6 hover:border-amber-500/40 transition-all duration-200 shadow-lg"
                        >
                          {/* Myth Tag & Title */}
                          <div className="flex items-start gap-3 mb-3.5 pb-3 border-b border-stone-800/80">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-rose-400 font-mono text-xs font-bold mt-0.5">
                              ✕
                            </span>
                            <div className="flex-1 min-w-0">
                              <span className="inline-block rounded-md border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[11px] font-mono font-semibold text-rose-300 mb-1.5">
                                ጌጋ ርድኢት {item.step}
                              </span>
                              <h3 className="font-bold text-stone-100 text-sm sm:text-base leading-snug">
                                {item.myth.replace(/^ጌጋ ርድኢት \d+: /, '')}
                              </h3>
                            </div>
                          </div>

                          {/* Historical Reality */}
                          <div className="pl-9 space-y-2">
                            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono font-semibold">
                              <span>✓</span>
                              <span>ታሪኻዊ ሓቂን መብርህን:</span>
                            </div>
                            {item.reality.map((p, pIdx) => (
                              <p key={pIdx} className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                                {p}
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : isSection18 ? (
                  <div className="space-y-6">
                    <p className={`text-stone-300 leading-relaxed ${contentFontClass}`}>
                      እቲ ዓቢ ቅልውላውን ኣገዳሲ ናይ መጽናዕቲ ኣርእስቲ ኮይኑ ይርከብ፡ ምኽንያቱ እተፈላለዩ ፋይናንሳውን ኢኮኖሚያዊ ድኽመታት ከመይ ገይሮም ንሓደዶም ከሐይሉ ከምዝኽእሉ ስለዘርእይ።
                    </p>

                    <div className="space-y-2.5">
                      {LESSONS_DATA.map((item) => (
                        <div
                          key={item.step}
                          className="flex items-start gap-3.5 rounded-xl border border-stone-800/80 bg-stone-900/50 p-3.5 sm:p-4 hover:border-stone-700/80 transition"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-mono text-xs font-bold mt-0.5">
                            {item.step}
                          </span>
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <h4 className="font-semibold text-stone-100 text-xs sm:text-sm">
                              {item.title}
                            </h4>
                            {item.paragraphs.map((p, pIndex) => (
                              <p key={pIndex} className="text-xs text-stone-400 leading-relaxed">
                                {p}
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className={`text-stone-300 ${contentFontClass} space-y-6 prose-stone`}>
                    <MarkdownContent
                      content={section.body}
                      highlightTerms={section.highlightTerms ?? []}
                    />
                  </div>
                )}

                {/* ==================================================================== */}
                {/* FEATURE SPOTLIGHT 1: Section 5 - The Three Black Days of October 1929 */}
                {/* ==================================================================== */}
                {isSection5 && (
                  <div className="hover-lift-card mt-8 rounded-2xl border-2 border-rose-900/40 bg-gradient-to-b from-rose-950/25 via-stone-950 to-black p-5 sm:p-7 shadow-2xl transition-all duration-300 hover:border-rose-500/50 hover:shadow-[0_15px_40px_rgba(244,63,94,0.15)]">
                    <div className="flex items-center gap-2 text-rose-400 mb-3">
                      <AlertTriangle className="h-5 w-5 animate-pulse" />
                      <h3 className="font-bold text-base sm:text-lg text-rose-200">
                        ጥቅምቲ 1929: ሰለስተ ጸለምቲ መዓልታት (The Three Black Days)
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-6">
                      እቲ ናይ ስቶክ ማርኬት ምውዳቕ ብሓንቲ ለይቲ ዘጋጠመ ኣይነበረን፤ ኣብ ሰለስተ ወሰንቲ መዓልታት ዝተኸፍተ ናይ ፍርህን ዕዳጋ ምፍራስን ፍጻመ ነበረ።
                    </p>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="hover-lift-card rounded-xl border border-stone-800 bg-stone-900/60 p-4 transition-all duration-300 hover:border-amber-500/50">
                        <div className="flex items-center justify-between text-xs font-mono text-amber-400 mb-2">
                          <span>መዓልቲ 1</span>
                          <span className="font-bold">ጥቅምቲ 24</span>
                        </div>
                        <h4 className="font-bold text-stone-100 text-sm mb-1.5">ጸሊም ሓሙስ (Black Thursday)</h4>
                        <p className="text-xs text-stone-400 leading-relaxed">
                          12.9 ሚልዮን ስቶክስ ብሓንሳብ ንምሻጥ ተጓየዩ። ባንከራት J.P. Morgan ገንዘብ ብምውፋር ዕዳጋ ንምዕጋብ ፈተኑ።
                        </p>
                      </div>

                      <div className="hover-lift-card rounded-xl border border-rose-900/60 bg-rose-950/20 p-4 transition-all duration-300 hover:border-rose-500/60">
                        <div className="flex items-center justify-between text-xs font-mono text-rose-400 mb-2">
                          <span>መዓልቲ 2</span>
                          <span className="font-bold">ጥቅምቲ 28</span>
                        </div>
                        <h4 className="font-bold text-rose-200 text-sm mb-1.5">ጸሊም ሰኑይ (Black Monday)</h4>
                        <p className="text-xs text-stone-400 leading-relaxed">
                          ዳው ጆንስ ብ12.8% ወደቐ። ደላሎ ንተለቃሕቲ ተወሳኺ ገንዘብ (margin calls) ክኸፍሉ ብምግዳዶም ምሽያጥ በረኸ።
                        </p>
                      </div>

                      <div className="hover-lift-card rounded-xl border border-rose-900/80 bg-rose-950/30 p-4 transition-all duration-300 hover:border-rose-400/80">
                        <div className="flex items-center justify-between text-xs font-mono text-rose-300 mb-2">
                          <span>መዓልቲ 3</span>
                          <span className="font-bold">ጥቅምቲ 29</span>
                        </div>
                        <h4 className="font-bold text-rose-100 text-sm mb-1.5">ጸሊም ሰሉስ (Black Tuesday)</h4>
                        <p className="text-xs text-stone-400 leading-relaxed">
                          16.4 ሚልዮን ስቶክስ ተሸጡ፤ ዳው ጆንስ ብተወሳኺ 11.7% ወደቐ። ዕዳጋ ሙሉእ ብሙሉእ ዓቕሚ ገንዘብ (liquidity) ሰኣነ።
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ==================================================================== */}
                {/* FEATURE SPOTLIGHT 2: Section 8 - Irving Fisher Debt-Deflation Spiral */}
                {/* ==================================================================== */}
                {isSection8 && (
                  <div className="hover-lift-card mt-8 rounded-2xl border-2 border-amber-900/40 bg-gradient-to-b from-amber-950/20 via-stone-950 to-black p-5 sm:p-7 shadow-2xl transition-all duration-300 hover:border-amber-500/50 hover:shadow-[0_15px_40px_rgba(245,158,11,0.15)]">
                    <div className="flex items-center gap-2 text-amber-400 mb-3">
                      <TrendingDown className="h-5 w-5" />
                      <h3 className="font-bold text-base sm:text-lg text-amber-200">
                        ናይ ኢርቪንግ ፊሸር ዕዳ-ዲፍሌሽን ዑደት (Irving Fisher Debt-Deflation Spiral)
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-6">
                      ኢርቪንግ ፊሸር (1933)፡ ኣብ እዋን ቅልውላው ዕዳ ንምኽፋል ዝግበር ህጹጽ ምሻጥ ንብረት ከመይ ገይሩ ዋጋታት ብምውዳቕ ነቲ ዘሎ ዕዳ ናይ ብሓቂ ጾር መሊሱ ከም ዘክብዶ ዘብርሀሉ ኣዕናዊ ዑደት፡
                    </p>

                    <div className="space-y-2.5">
                      {[
                        { step: '1', title: 'ዕዳ ምኽፋል (Liquidation)', desc: 'ተለቃሕቲ ዘለዎም ዕዳ ንምኽፋል ንብረቶም ብህጹጽ ናብ ዕዳጋ የውጽኡ።' },
                        { step: '2', title: 'ምንቁልቋል ዋጋታት (Deflation)', desc: 'ህጹጽ ምሻጥ ንብረትን ምጉዳል ገንዘብን ንዋጋታት ኩሉ ዓይነት ኣቑሑትን ንብረትን የውርዶ።' },
                        { step: '3', title: 'ናይ ዕዳ ናይ ብሓቂ ጾር ምውሳኽ', desc: 'ዋጋታት ክወርዱ ከለዉ ናይ ገንዘብ ዋጋ ይዓቢ፤ እቲ ክኽፈል ዘለዎ ናይ ቀደም ዕዳ ብሓቂ ይኸብድ።' },
                        { step: '4', title: 'ምኽሳር ትካላትን ምፍራስ ባንክታትን', desc: 'ትካላት ንዕዳታትን ደሞዝን ክኸፍሉ ብዘይምኽኣሎም ይዕጸዉ፤ ባንክታት ድማ ይፈርሳ።' },
                        { step: '5', title: 'ስራሕ-ኣልቦነትን ዝገደደ ሕጽረትን', desc: 'ዝወደቐ ኣታዊ ንወጻኢታት የጉድሎ፤ እቲ ናይ ቅልውላው ዑደት ድማ ዳግማይ ይጅምር።' },
                      ].map((item) => (
                        <div key={item.step} className="hover-lift-card flex items-start gap-3 rounded-xl border border-stone-800/80 bg-stone-900/50 p-3 sm:p-3.5 transition-all duration-300 hover:border-amber-500/40 hover:bg-stone-900/80">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-mono text-xs font-bold transition-transform duration-200 group-hover:scale-110">
                            {item.step}
                          </span>
                          <div>
                            <h4 className="font-semibold text-stone-100 text-xs sm:text-sm transition-colors hover:text-amber-300">{item.title}</h4>
                            <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ==================================================================== */}
                {/* FEATURE SPOTLIGHT 3: Conclusion ONLY - Lessons for Bitcoin & Sound Money */}
                {/* ==================================================================== */}
                {isConclusion && (
                  <div className="hover-lift-card mt-8 rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-950/30 via-[#10131a] to-stone-950 p-6 sm:p-8 shadow-2xl transition-all duration-300 hover:border-amber-400 hover:shadow-[0_20px_50px_rgba(245,158,11,0.2)]">
                    <div className="flex items-center gap-2 text-amber-400 mb-3">
                      <Coins className="h-6 w-6 text-amber-400 animate-bounce" />
                      <h3 className="font-bold text-lg sm:text-xl text-amber-200">
                        ካብ 1929 ናብ ቢትኮይን: ናይ ጽኑዕ ገንዘብ (Sound Money) ትምህርቲ
                      </h3>
                    </div>
                    
                    <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-6">
                      ናይ 1929 ውድቀትን ናይ 1930ታት ዓቢ ቅልውላውን ብቐንዱ ኣብ ዙርያ ፍራክሽናል ሪዘርቭ ባንክ (fractional reserve banking)፡ ዘይሓላፍነታዊ ልቓሕ ምስፋሕን ናይ መንግስቲ ውሳኔታትን ዘንጸባርቕ እዩ።
                    </p>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="hover-lift-card rounded-xl border border-stone-800 bg-stone-900/70 p-4 transition-all duration-300 hover:border-rose-900/60">
                        <h4 className="flex items-center gap-2 font-bold text-stone-200 text-sm mb-2">
                          <span className="text-rose-400">⚠️</span> ድኽመት ናይ 1929 ስርዓት
                        </h4>
                        <ul className="space-y-1.5 text-xs text-stone-400 leading-relaxed list-disc list-inside">
                          <li>ባንክታት ካብቲ ዝሓዝዎ ጥረ ገንዘብ ንላዕሊ ልቓሕ ብምፍጣር ንባብል ደገፉ</li>
                          <li>ኣብ 1933 መንግስቲ ብኣዋጅ (Executive Order 6102) ናይ ህዝቢ ወርቂ ወሰደ</li>
                          <li>ማእከላይ ባንክታት ብናጻ ገንዘብ ብምሕታም ናይ ገንዘብ ዓቕሚ ምዕዳግ ኣህሰሱ</li>
                        </ul>
                      </div>

                      <div className="hover-lift-card rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 transition-all duration-300 hover:border-amber-400/60 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                        <h4 className="flex items-center gap-2 font-bold text-amber-300 text-sm mb-2">
                          <ShieldCheck className="h-4 w-4 text-amber-400" /> መልሲ ቢትኮይን (Bitcoin)
                        </h4>
                        <ul className="space-y-1.5 text-xs text-stone-300 leading-relaxed list-disc list-inside">
                          <li><strong>ውሱን ቀረብ:</strong> 21 ሚልዮን ቢትኮይን ጥራሕ — ብዝኾነ ማእከላይ ሓይሊ ኣይሕተምን</li>
                          <li><strong>ርእሰ-ዋንነት (Self-Custody):</strong> ዋንነትካ ባንክታት ከይፈርሳ ባዕልኻ ትቆጻጸሮ</li>
                          <li><strong>ግሉጽነት (Transparency):</strong> ኣብ ሒሳብ-መዝገብ (Blockchain) ኩሉ ብሒሳባዊ መረጋገጺ ይረጋገጽ</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}


              </article>
            );
          })}
        </main>

        {/* 5. Archival References & Historical Literature Section */}
        <section className="mx-auto max-w-6xl mt-14 rounded-3xl border border-amber-900/40 bg-gradient-to-b from-[#11131a] via-[#0d0f15] to-[#08090d] p-6 sm:p-10 shadow-2xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-800">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <BookOpen className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-stone-100">
                ንዝያዳ ምንባብ ፣ታሪኻዊ መወከሲታትን
              </h3>
              <p className="text-xs text-stone-400 mt-1 font-mono">
                Historical references, economic research, and archival literature
              </p>
            </div>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {REFERENCES_DATA.map((ref) => (
              <a
                key={ref.id}
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-stone-800/80 bg-stone-900/40 p-4 sm:p-5 hover:border-amber-500/50 hover:bg-stone-900/80 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-amber-400/90 mb-2">
                    <span className="font-bold">[{ref.id}]</span>
                    <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-300 border border-amber-500/20">
                      {ref.year}
                    </span>
                  </div>
                  <h4 className="font-semibold text-stone-100 group-hover:text-amber-200 transition text-sm leading-snug mb-2">
                    {ref.author}
                  </h4>
                  <p className="text-xs text-stone-400 leading-relaxed mb-4">
                    {ref.work}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between text-[11px] font-mono text-amber-400/80 group-hover:text-amber-300 transition">
                  <span className="truncate">{ref.domain}</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* 6. Academy Journey Navigation Footer */}
        <footer className="mx-auto max-w-6xl mt-14 rounded-3xl border border-stone-800 bg-[#080a0f] p-6 sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-amber-400">
                PanAfrican Bitcoin Academy
              </p>
              <h4 className="text-base sm:text-lg font-bold text-stone-200 mt-1">
                ዲጂታላዊ ናጽነትን ጽኑዕ ገንዘብን ንምርዳእ ዝግበር ጉዕዞ
              </h4>
              <p className="text-xs text-stone-400 mt-1">
                Tigrinya translation & historical economic archive.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/cypher-punks"
                className="inline-flex items-center gap-2 rounded-xl border border-stone-700 bg-stone-900/80 px-4 py-2 text-xs font-medium text-stone-200 hover:border-amber-400 hover:text-amber-300 transition"
              >
                <span>ሳይፈርፓንክስ (Cypherpunks)</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/chapters"
                className="inline-flex items-center gap-2 rounded-xl border border-stone-700 bg-stone-900/80 px-4 py-2 text-xs font-medium text-stone-200 hover:border-amber-400 hover:text-amber-300 transition"
              >
                <span>ምዕራፋት ቢትኮይን</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/white_paper"
                className="inline-flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs font-medium text-amber-300 hover:bg-amber-500/20 transition"
              >
                <span>ዋይትፐፐር ብትግርኛ</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
