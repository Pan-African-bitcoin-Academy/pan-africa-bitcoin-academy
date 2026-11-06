"use client";

import { useState, type ComponentType } from "react";
import {
  FileText,
  Newspaper,
  Terminal,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Globe2,
  Users,
  Lock,
  Eye,
  EyeOff,
  Coins,
  TrendingDown,
  Building2,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Zap,
  Server,
  Key,
  Check,
  X,
  Sparkles,
  Info,
  ExternalLink,
  Ban,
  AlertCircle,
  DollarSign,
  Clock,
  RotateCcw,
  Pause,
  Play,
} from "lucide-react";

type Localized = { en: string; ti: string };
const t = (v: Localized, isTi: boolean) => (isTi ? v.ti : v.en);

const panelClass =
  "rounded-2xl border border-zinc-800 bg-zinc-950/90 p-4 shadow-inner sm:p-6 my-6";
const cardClass = "rounded-xl border border-zinc-800 bg-black/40 p-4";
const buttonClass =
  "rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-200 transition-colors hover:border-cyan-400/60 hover:bg-cyan-500/10";
const selectedButtonClass =
  "rounded-lg border border-cyan-400/70 bg-cyan-500/15 px-3 py-2 text-sm font-semibold text-cyan-100";

/* =========================================================================
   5.1 Genesis Block, 2008 Crisis & Satoshi's Whitepaper
   ========================================================================= */

type WhitepaperPage = {
  page: number;
  title: Localized;
  problem: Localized;
  solution: Localized;
  quote: string;
};

const whitepaperPages: WhitepaperPage[] = [
  {
    page: 1,
    title: { en: "Abstract & Introduction", ti: "ሓጺር ጽሑፍን መእተውን" },
    problem: {
      en: "Commerce on the Internet relies almost exclusively on financial institutions serving as trusted third parties. This creates high fees and reversible transactions.",
      ti: "ኣብ ኢንተርነት ዝካየድ ንግዲ ኣብ ማእከላይ ትካላት ፋይናንስ ዝምርኮስ ብምዃኑ፡ ልዑል ክፍሊት የኽፍል፡ ትራንዛክሽን ድማ ብቀሊሉ ክስረዝ ይኽእል።",
    },
    solution: {
      en: "A purely peer-to-peer version of electronic cash that allows online payments without going through a financial institution.",
      ti: "ብዘይ ማእከላይ ባንኪ ወይ ትካል ካብ ሓደ ሰብ ናብ ካልእ ሰብ ብቐጥታ ዝለኣኽ ዲጂታላዊ ጥረ ገንዘብ ምፍጣር።",
    },
    quote: "A purely peer-to-peer version of electronic cash would allow online payments to be sent directly from one party to another without going through a financial institution.",
  },
  {
    page: 2,
    title: { en: "Transactions & Signatures", ti: "ትራንዛክሽናትን ዲጂታላዊ ፌርማን" },
    problem: {
      en: "How to prove ownership of digital coins without a central registry or trusted intermediary.",
      ti: "ብዘይ ማእከላይ መዝገብ ወይ ባንኪ፡ ዲጂታላዊ ገንዘብ ናትካ ምዃኑ ከመይ ጌርካ ተረጋግጽ?",
    },
    solution: {
      en: "A chain of digital signatures. Each owner transfers coin by digitally signing a hash of the previous transaction with their private key.",
      ti: "ሰንሰለት ዲጂታላዊ ፌርማታት። ነፍሲ ወከፍ ዋና ብምስጢራዊ ቁልፉ (private key) ኣቢሉ ብምፍራም ንካልእ የሕልፎ።",
    },
    quote: "We define an electronic coin as a chain of digital signatures.",
  },
  {
    page: 3,
    title: { en: "Timestamp Server", ti: "ናይ ግዜ መረጋገጺ ሰርቨር (Timestamp)" },
    problem: {
      en: "The Double-Spending Problem: How to prevent a payee from spending the same digital token twice.",
      ti: "ሓደ ሰብ ንሓደ ዲጂታላዊ ሳንቲም ንክልተ ዝተፈላለዩ ሰባት ከየመሓላልፎ (Double-Spend) ከመይ ጌርካ ትከላኸል?",
    },
    solution: {
      en: "A distributed timestamp server that takes a hash of a block of items and widely publishes it, proving the data existed at that moment.",
      ti: "ኩሉ ሰብ ዝርእዮን ዘረጋግጾን ናይ ግዜ መረጋገጺ (Timestamp Server) ብምጥቃም ቅደም-ተኸተል ትራንዛክሽናት ምሕላው።",
    },
    quote: "The timestamp proves that the data must have existed at the time, obviously, in order to get into the hash.",
  },
  {
    page: 4,
    title: { en: "Proof-of-Work", ti: "ናይ ስራሕ መረጋገጺ (Proof-of-Work)" },
    problem: {
      en: "If anyone can vote with IP addresses, an attacker with many computers could rewrite history (Sybil attack).",
      ti: "ሓደ ሰረቕቲ ብዙሕ ናይ ኮምፒዩተር ኣድራሻታት (IP) ብምሓዝ ታሪኽ ትራንዛክሽን ከይቕይሮ ከመይ ጌርካ ትከላኸል?",
    },
    solution: {
      en: "One-CPU-one-vote using Adam Back's Hashcash. Consensus is determined by the longest chain with the greatest proof-of-work effort invested.",
      ti: "ሓደ-ሲፒዩ-ሓደ-ድምጺ (One-CPU-one-vote) ብምጥቃም፡ እቲ ዝበዝሐ ናይ ስራሕ ጻዕሪ (PoW) ዘለዎ ሰንሰለት ጥራይ ተቐባልነት ይረክብ።",
    },
    quote: "Proof-of-work is essentially one-CPU-one-vote. The majority decision is represented by the longest chain.",
  },
  {
    page: 5,
    title: { en: "Network Steps", ti: "ናይ መርበብ ስጉምትታት" },
    problem: {
      en: "Coordinating thousands of anonymous nodes worldwide without a central commander.",
      ti: "ኣብ መላእ ዓለም ዘለዉ ኣሽሓት ዘይተፋለጡ ኮምፒዩተራት (Nodes) ብዘይ ማእከላይ መራሒ ከመይ ጌሮም ይሰማምዑ?",
    },
    solution: {
      en: "Independent nodes broadcast new transactions, work on Proof-of-Work, and accept blocks only if all transactions are valid and not double-spent.",
      ti: "ነፍሲ ወከፍ ኖድ ሓደሽቲ ትራንዛክሽናት ይቕበል፡ ስራሕ የረጋግጽ፡ ቅኑዕ ምስ ዝኸውን ጥራይ ድማ ናብ ሰንሰለቱ ይውስኾ።",
    },
    quote: "Nodes accept the block only if all transactions in it are valid and not already spent.",
  },
  {
    page: 6,
    title: { en: "Incentive & Scarcity", ti: "ምትብባዕን ውሱንነትን (Incentive)" },
    problem: {
      en: "Why would anyone spend expensive electricity and hardware to support the network?",
      ti: "ሰባት ንምንታይ ኢሎም ኤሌክትሪክን ኮምፒዩተርን ኣጥፊኦም ነዚ መርበብ ይሕግዙ?",
    },
    solution: {
      en: "Miners receive newly minted coins (block subsidy) and transaction fees. This simultaneously distributes new currency into circulation fairly.",
      ti: "ዕደናውያን ሓድሽ ዝተወልደ ቢትኮይንን ናይ ትራንዛክሽን ክፍሊትን ይረኽቡ። እዚ ድማ ሓድሽ ገንዘብ ብፍትሓዊ መንገዲ የከፋፍል።",
    },
    quote: "The steady addition of a constant of amount of new coins is analogous to gold miners expending resources to add gold to circulation.",
  },
  {
    page: 7,
    title: { en: "Reclaiming Disk Space", ti: "ቦታ ምዕቃብ (Merkle Tree)" },
    problem: {
      en: "If the blockchain records every transaction forever, nodes would run out of hard drive space.",
      ti: "ኩሉ ትራንዛክሽን ንዘለኣለም ዝዕቀብ እንተኾይኑ፡ ናይ ኮምፒዩተር መኽዘን ቦታ (Hard drive) ብቕልጡፍ ይምላእ።",
    },
    solution: {
      en: "Transactions are hashed in a Merkle Tree. Old spent transactions can be pruned while keeping the block hash intact.",
      ti: "ትራንዛክሽናት ብመርክል ትሪ (Merkle Tree) ይጥመረሩ፡ ብምዃኑ ዝኣረጉ ዝተወድኡ ትራንዛክሽናት ብምስራዝ ቦታ ምዕቃብ ይከኣል።",
    },
    quote: "Once the latest transaction in a coin is buried under enough blocks, the spent transactions before it can be discarded to save disk space.",
  },
  {
    page: 8,
    title: { en: "Simplified Payment (SPV)", ti: "ቀሊል ናይ ክፍሊት ምርግጋጽ (SPV)" },
    problem: {
      en: "Mobile phones and everyday users cannot download the hundreds of gigabytes of full blockchain data.",
      ti: "ተራ ተጠቀምትን ተንቀሳቐስቲ ቴለፎናትን ብምሉኡ ዓቢ ዳታ ብሎክቸይን ክጽዕና ኣይኽእላን።",
    },
    solution: {
      en: "SPV light clients only need to keep a copy of the block headers of the longest Proof-of-Work chain and obtain Merkle branch proofs.",
      ti: "ቀለልቲ ዋለታት (SPV) ርእሲ ብሎክ (Block Header) ጥራይ ብምሓዝ ትራንዛክሽነን ብዘተኣማምን መንገዲ የረጋግጻ።",
    },
    quote: "It is possible to verify payments without running a full network node.",
  },
  {
    page: 9,
    title: { en: "Privacy & Conclusion", ti: "ምስጢራውነትን መደምደምታን" },
    problem: {
      en: "Traditional banks maintain privacy by hiding transaction records from the public.",
      ti: "ባንክታት ናይ ሰባት ምስጢር ንምሕላው መዛግብቶም ካብ ህዝቢ ይሓብእዎ።",
    },
    solution: {
      en: "Bitcoin makes transactions public, but keeps identities private using pseudonymous public keys (public addresses) decoupled from real names.",
      ti: "ቢትኮይን ትራንዛክሽኑ ንኹሉ ግሉጽ ይገብሮ፡ መንነት ግን ኣብ ክንዲ ስም ብዘይተፈልጡ ኣድራሻታት (Public Keys) ብምስጢር ይሕዞ።",
    },
    quote: "The public can see that someone is sending an amount to someone else, but without information linking the transaction to anyone.",
  },
];

function GenesisWhitepaperGraphic({ isTi }: { isTi: boolean }) {
  const [activeTab, setActiveTab] = useState<"newspaper" | "hex" | "pages">("newspaper");
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [hexDecoded, setHexDecoded] = useState(false);

  const rawHex =
    "04ffff001d0104455468652054696d65732030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66207365636f6e64206261696c6f757420666f722062616e6b73";
  const decodedText = "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks";

  const currentPageData = whitepaperPages.find((p) => p.page === selectedPage) || whitepaperPages[0];

  return (
    <section className={panelClass} aria-label="Genesis Block and Whitepaper">
      <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-400">
            {t(
              {
                en: "5.1 Practical Example: Genesis & The Whitepaper",
                ti: "5.1 ተግባራዊ ኣብነት: ጀነሲስ ብሎክን ዋይትፐይፐርን",
              },
              isTi
            )}
          </p>
          <h4 className="mt-1 text-lg font-bold text-zinc-100 sm:text-xl">
            {t(
              {
                en: "The Genesis Message & Satoshi's 9-Page Roadmap",
                ti: "ናይ ጀነሲስ መልእኽትን ናይ ሳቶሺ 9-ገጽ መምርሒ",
              },
              isTi
            )}
          </h4>
          <div className="mt-2.5">
            <a
              href="https://panafricanbitcoin.com/white_paper"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/50 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 shadow-sm transition-all hover:border-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-200"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>
                {t(
                  {
                    en: "Read Full Whitepaper (PanAfrican Bitcoin) →",
                    ti: "ናይ ቢትኮይን ዋይትፐይፐር ኣብዚ ኣንብብ →",
                  },
                  isTi
                )}
              </span>
              <ExternalLink className="h-3 w-3 opacity-70" />
            </a>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("newspaper")}
            className={activeTab === "newspaper" ? selectedButtonClass : buttonClass}
          >
            <span className="flex items-center gap-1.5">
              <Newspaper className="h-4 w-4" />
              {t({ en: "Genesis Headline", ti: "ናይ ጀነሲስ ዜና" }, isTi)}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("hex")}
            className={activeTab === "hex" ? selectedButtonClass : buttonClass}
          >
            <span className="flex items-center gap-1.5">
              <Terminal className="h-4 w-4" />
              {t({ en: "Raw Hex in Block 0", ti: "ኮድ ኣብ ብሎክ 0" }, isTi)}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pages")}
            className={activeTab === "pages" ? selectedButtonClass : buttonClass}
          >
            <span className="flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              {t({ en: "Whitepaper Pages (1-9)", ti: "ዋይትፐይፐር (1-9)" }, isTi)}
            </span>
          </button>
        </div>
      </div>

      {activeTab === "newspaper" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-amber-600/40 bg-gradient-to-b from-amber-950/20 via-zinc-950 to-black p-5 text-amber-100 shadow-xl">
            <div className="border-b border-amber-500/30 pb-3 text-center">
              <p className="font-serif text-xs uppercase tracking-[0.3em] text-amber-400">
                The Times · London · 03 Jan 2009
              </p>
              <h5 className="mt-2 font-serif text-2xl font-black tracking-tight text-amber-200 sm:text-3xl">
                Chancellor on brink of second bailout for banks
              </h5>
              <p className="mt-1 text-xs text-zinc-400">
                {t(
                  {
                    en: "Alistair Darling considers unprecedented billions to rescue collapsing financial titans",
                    ti: "ሚኒስተር ፋይናንስ ብሪጣንያ ንዝወድቁ ዝነበሩ ዓበይቲ ባንክታት ንምድሓን ካልኣይ ዙር ብልዮናት ፓውንድ ንምዕዳል ይዳሎ",
                  },
                  isTi
                )}
              </p>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 text-xs text-zinc-300 sm:grid-cols-2">
              <div className="rounded-lg border border-amber-500/20 bg-amber-950/10 p-3">
                <span className="font-semibold text-amber-300">
                  {t({ en: "The 2008 Systemic Failure:", ti: "ናይ 2008 ውድቀት ባንክታት:" }, isTi)}
                </span>
                <p className="mt-1 text-zinc-300 leading-relaxed">
                  {t(
                    {
                      en: "Commercial banks took reckless gambles with depositors' savings. When the bubble burst, governments printed taxpayer money to rescue the banks while citizens lost their homes.",
                      ti: "ባንክታት ብገንዘብ ተቐማጦ ሓደገኛ ቁማር ተጻዊቶም ምስ ወደቁ፡ መንግስታት ንተራ ዜጋታት ገዲፎም ነቶም ባንክታት ካብ ግብሪ ዝተረኽበ ገንዘብ ኣትሪፎም ኣድሒኖምዎም።",
                    },
                    isTi
                  )}
                </p>
              </div>
              <div className="rounded-lg border border-cyan-500/20 bg-cyan-950/10 p-3">
                <span className="font-semibold text-cyan-300">
                  {t({ en: "Why Satoshi Embedded This:", ti: "ሳቶሺ ስለምንታይ ኣብ ብሎክ 0 ጸሓፎ:" }, isTi)}
                </span>
                <p className="mt-1 text-zinc-300 leading-relaxed">
                  {t(
                    {
                      en: "1) Immutable Proof of Date: Bitcoin could not have been pre-mined before Jan 3, 2009. 2) A Permanent Moral Manifesto against fractional reserve banking bailouts.",
                      ti: "1) ናይ ዕለት መረጋገጺ፡ ቅድሚ 3 ጥሪ 2009 ዝተሰርሐ ከምዘይኮነ ንምርኣይ። 2) ኣብ ልዕሊ ዘይተኣማምን ናይ ፊያት ባንክታት ምሕታምን ምድሓንን ዝተጻሕፈ ዘይድምሰስ ታሪኻዊ ተቓውሞ።",
                    },
                    isTi
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "hex" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-black p-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-2 text-zinc-400">
                <Terminal className="h-4 w-4 text-cyan-400" />
                <span>Genesis Block #0 · Coinbase ScriptSig</span>
              </div>
              <button
                type="button"
                onClick={() => setHexDecoded(!hexDecoded)}
                className="flex items-center gap-1 rounded bg-cyan-500/20 px-2 py-1 text-[11px] font-semibold text-cyan-200 hover:bg-cyan-500/30"
              >
                <RefreshCw className="h-3 w-3" />
                {hexDecoded
                  ? t({ en: "Show Hex", ti: "ኮድ ሄክስ ኣርኢ" }, isTi)
                  : t({ en: "Decode Hex to ASCII", ti: "ናብ ጽሑፍ ተርጉም" }, isTi)}
              </button>
            </div>
            <div className="mt-3 overflow-x-auto p-2">
              {hexDecoded ? (
                <div className="rounded border border-emerald-500/30 bg-emerald-950/20 p-3 text-emerald-300">
                  <p className="text-zinc-400 text-[11px] mb-1">
                    {t({ en: "Decoded ASCII String:", ti: "ዝተተርጎመ ጽሑፍ:" }, isTi)}
                  </p>
                  <p className="text-sm font-bold tracking-wide">&quot;{decodedText}&quot;</p>
                </div>
              ) : (
                <p className="break-all text-cyan-300/90 leading-relaxed tracking-wider">
                  {rawHex}
                </p>
              )}
            </div>
          </div>
          <p className="text-xs text-zinc-400">
            {t(
              {
                en: "This 77-byte hex string sits inside the genesis block forever. Every full node running on Earth today validates this exact line of data.",
                ti: "እዚ 77 ባይት ዝሓዘ ሄክስ ኮድ ኣብ ውሽጢ ጀነሲስ ብሎክ ንዘለኣለም ተቐሪጹ ይርከብ። ሎሚ ኣብ መላእ ዓለም ዘሎ ነፍሲ ወከፍ ፉል ኖድ ነዛ ዳታ እዚኣ የረጋግጻ።",
              },
              isTi
            )}
          </p>
        </div>
      )}

      {activeTab === "pages" && (
        <div className="space-y-4">
          <p className="text-xs text-zinc-400">
            {t(
              {
                en: "Click through Satoshi's 9-page whitepaper to see how each core problem of digital money was solved without a central bank:",
                ti: "ሳቶሺ ኣብተን 9 ገጻት ዋይትፐይፐር ነፍሲ ወከፍ ጸገም ዲጂታላዊ ገንዘብ ብዘይ ማእከላይ ባንኪ ከመይ ከም ዝፈትሖ ንምርኣይ ጠውቕ:",
              },
              isTi
            )}
          </p>

          {/* Page Pills */}
          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-9">
            {whitepaperPages.map((p) => (
              <button
                key={p.page}
                type="button"
                onClick={() => setSelectedPage(p.page)}
                className={`rounded-lg py-2 px-1 text-center transition-all ${
                  selectedPage === p.page
                    ? "border border-cyan-400 bg-cyan-500/20 font-bold text-cyan-200 shadow"
                    : "border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                }`}
              >
                <div className="text-[10px] uppercase text-zinc-500">Page</div>
                <div className="text-sm">{p.page}</div>
              </button>
            ))}
          </div>

          {/* Active Page Card */}
          <div className="rounded-xl border border-cyan-500/30 bg-zinc-950 p-4 shadow-lg sm:p-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-xs font-semibold text-cyan-300">
                Page {currentPageData.page} of 9
              </span>
              <h5 className="text-base font-bold text-zinc-100 sm:text-lg">
                {t(currentPageData.title, isTi)}
              </h5>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-rose-500/20 bg-rose-950/10 p-3">
                <span className="flex items-center gap-1 text-xs font-bold text-rose-300">
                  <X className="h-3.5 w-3.5" />
                  {t({ en: "The Hard Problem:", ti: "ዝነበረ ዓቢ ጸገም:" }, isTi)}
                </span>
                <p className="mt-1 text-xs text-zinc-300 leading-relaxed">
                  {t(currentPageData.problem, isTi)}
                </p>
              </div>

              <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/10 p-3">
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-300">
                  <Check className="h-3.5 w-3.5" />
                  {t({ en: "Satoshi's Breakthrough:", ti: "ናይ ሳቶሺ ፍታሕ:" }, isTi)}
                </span>
                <p className="mt-1 text-xs text-zinc-300 leading-relaxed">
                  {t(currentPageData.solution, isTi)}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400">
                {t({ en: "Original Whitepaper Excerpt:", ti: "ካብቲ ዋና ጽሑፍ ዝተወስደ ሓሳብ:" }, isTi)}
              </span>
              <p className="mt-1 font-serif text-xs italic text-zinc-300 leading-relaxed">
                &ldquo;{currentPageData.quote}&rdquo;
              </p>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-800/80 pt-3 text-xs">
              <span className="text-zinc-400">
                {t(
                  {
                    en: "Explore the complete bilingual whitepaper:",
                    ti: "ሙሉእ ትርጉም ዋይትፐይፐር ንምንባብ:",
                  },
                  isTi
                )}
              </span>
              <a
                href="https://panafricanbitcoin.com/white_paper"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-cyan-300 hover:underline"
              >
                <span>https://panafricanbitcoin.com/white_paper</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* =========================================================================
   5.2 Peer-to-Peer vs. Centralized Intermediary Simulator
   ========================================================================= */

function PeerToPeerSimulator({ isTi }: { isTi: boolean }) {
  const [activeTab, setActiveTab] = useState<"race" | "centralized" | "p2p">("race");

  // Race Simulation State
  const [raceRunning, setRaceRunning] = useState(false);
  const [bankProgress, setBankProgress] = useState(0); // 0 to 100
  const [btcProgress, setBtcProgress] = useState(0);   // 0 to 100
  const [bankFrozen, setBankFrozen] = useState(false);
  const [btcCensorAttempted, setBtcCensorAttempted] = useState(false);

  // Single Deep-Dive States
  const [centralizedStep, setCentralizedStep] = useState(0);
  const [singleBankFrozen, setSingleBankFrozen] = useState(false);
  const [p2pStep, setP2pStep] = useState(0);

  // Run Race Simulation with interval
  const startRace = () => {
    setRaceRunning(true);
    setBankFrozen(false);
    setBtcCensorAttempted(false);
    setBtcProgress(15);
    setBankProgress(10);

    // Bitcoin completes fast (~10 min simulated in 3 seconds)
    setTimeout(() => setBtcProgress(55), 1000);
    setTimeout(() => setBtcProgress(85), 2000);
    setTimeout(() => {
      setBtcProgress(100);
    }, 2800);

    // Bank takes long days (slow progression)
    setTimeout(() => setBankProgress(25), 1200);
    setTimeout(() => setBankProgress(40), 2400);
    setTimeout(() => setBankProgress(60), 3800);
    setTimeout(() => {
      setBankProgress(85);
      setRaceRunning(false);
    }, 5000);
  };

  const resetRace = () => {
    setRaceRunning(false);
    setBankProgress(0);
    setBtcProgress(0);
    setBankFrozen(false);
    setBtcCensorAttempted(false);
  };

  const freezeBankAction = () => {
    setBankFrozen(true);
    setRaceRunning(false);
  };

  const attemptBtcCensor = () => {
    setBtcCensorAttempted(true);
    setTimeout(() => setBtcCensorAttempted(false), 4000);
  };

  return (
    <section className={panelClass} aria-label="Peer-to-Peer vs Centralized Simulator">
      {/* Header */}
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-400">
          {t(
            {
              en: "5.2 Practical Example: Money Transmission",
              ti: "5.2 ተግባራዊ ኣብነት: ምስግጋር ገንዘብ",
            },
            isTi
          )}
        </p>
        <h4 className="mt-1 text-lg font-bold text-zinc-100 sm:text-xl">
          {t(
            {
              en: "Traditional Bank Wire vs. Bitcoin Peer-to-Peer",
              ti: "ናይ ባንኪ ምስግጋር ኣንጻር መዘዛዊ (P2P) ቢትኮይን",
            },
            isTi
          )}
        </h4>
        <p className="mt-1 text-xs text-zinc-400">
          {t(
            {
              en: "Scenario: Alice in Kampala wants to send $100 (or equivalent in Sats) across borders to Bob in Asmara.",
              ti: "ኣብነት: ኣሊስ ኣብ ካምፓላ ዘላ ንቦብ ኣብ ኣስመራ ዘሎ ዶባት ሰጊራ $100 ወይ ሳትስ ክትሰደሉ ትደሊ።",
            },
            isTi
          )}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab("race")}
          className={activeTab === "race" ? selectedButtonClass : buttonClass}
        >
          <span className="flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-amber-400" />
            {t({ en: "Live Transfer Race", ti: "ናይ ክልቲኦም ምውድዳር" }, isTi)}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("centralized")}
          className={activeTab === "centralized" ? selectedButtonClass : buttonClass}
        >
          <span className="flex items-center gap-1.5">
            <Building2 className="h-4 w-4 text-rose-400" />
            {t({ en: "Legacy Bank Details", ti: "ናይ ባንኪ መስርሕ ብዝርዝር" }, isTi)}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("p2p")}
          className={activeTab === "p2p" ? selectedButtonClass : buttonClass}
        >
          <span className="flex items-center gap-1.5">
            <Globe2 className="h-4 w-4 text-emerald-400" />
            {t({ en: "Bitcoin P2P Details", ti: "ናይ ቢትኮይን P2P ብዝርዝር" }, isTi)}
          </span>
        </button>
      </div>

      {/* ================= TAB 1: LIVE RACE ================= */}
      {activeTab === "race" && (
        <div className="space-y-6">
          {/* Race Controls */}
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/80 p-3.5">
            <button
              type="button"
              disabled={raceRunning || btcProgress === 100}
              onClick={startRace}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-xs font-bold text-zinc-950 shadow-md hover:from-amber-400 hover:to-orange-400 disabled:opacity-40"
            >
              <Play className="h-4 w-4 fill-current" />
              {raceRunning
                ? t({ en: "Transferring...", ti: "ይሰጋገር ኣሎ..." }, isTi)
                : t({ en: "Start Transfer Race", ti: "ምስግጋር ጀምር" }, isTi)}
            </button>

            <button
              type="button"
              onClick={resetRace}
              className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-300 hover:text-zinc-100"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {t({ en: "Reset", ti: "ዳግማይ ጀምር" }, isTi)}
            </button>

            <div className="ml-auto text-[11px] text-zinc-400">
              {t(
                {
                  en: "Watch settlement speed, intermediary fees, and censorship vulnerability:",
                  ti: "ናይ ግዜ ፍጥነት፡ ናይ ባንክታት ክፍሊትን ናይ ምእጋድ ሓደጋን ተዓዘብ:",
                },
                isTi
              )}
            </div>
          </div>

          {/* Lane 1: Traditional Bank Wire */}
          <div className="rounded-2xl border border-rose-500/30 bg-gradient-to-r from-rose-950/15 via-zinc-950 to-zinc-950 p-4 sm:p-5 shadow-lg">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2.5">
                <div className="rounded-lg bg-rose-500/20 p-2 text-rose-300">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-zinc-100 sm:text-base">
                    {t({ en: "Traditional Centralized Bank Wire", ti: "ባህላዊ ማእከላይ ባንኪ" }, isTi)}
                  </h5>
                  <p className="text-xs text-zinc-400">
                    Alice ($100) ➔ Kampala Bank ➔ Clearing House ➔ Correspondent Bank ➔ Asmara ➔ Bob
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div>
                {bankFrozen ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-rose-500 bg-rose-500/20 px-3 py-1 text-xs font-bold text-rose-300 animate-pulse">
                    <Ban className="h-3.5 w-3.5" />
                    {t({ en: "ACCOUNT FROZEN (KYC/Sanction)", ti: "ሕሳብ ተዓጽዩ / ደው ኢሉ!" }, isTi)}
                  </span>
                ) : bankProgress >= 85 ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-300">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {t({ en: "Arrived after 4 Days (-$18.50 Fee)", ti: "ድሕሪ 4 መዓልቲ ($18.50 ተቖሪጹ) በጺሑ" }, isTi)}
                  </span>
                ) : bankProgress > 0 ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-300">
                    <Clock className="h-3.5 w-3.5 text-rose-400 animate-spin" />
                    {t({ en: "Processing via SWIFT... (Day 2 of 4)", ti: "ብባንክታት ይሕለፍ ኣሎ... (መዓልቲ 2 ካብ 4)" }, isTi)}
                  </span>
                ) : (
                  <span className="text-xs text-zinc-500">
                    {t({ en: "Ready to initiate wire", ti: "ምስግጋር ንምጅማር ድሉው" }, isTi)}
                  </span>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-800">
                <div
                  className={`h-full transition-all duration-700 ${
                    bankFrozen ? "bg-rose-500" : "bg-gradient-to-r from-rose-500 to-amber-500"
                  }`}
                  style={{ width: bankFrozen ? "45%" : `${bankProgress}%` }}
                />
              </div>
            </div>

            {/* Metrics */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
              <div className="rounded-lg border border-zinc-800 bg-black/40 p-2.5">
                <span className="text-[10px] uppercase text-zinc-500">
                  {t({ en: "Settlement Time", ti: "ዝወስዶ ግዜ" }, isTi)}
                </span>
                <p className="font-bold text-zinc-200">
                  {bankFrozen
                    ? t({ en: "Indefinite Hold", ti: "ንዘይተወሰነ እዋን ተዓጊቱ" }, isTi)
                    : t({ en: "3 to 5 Business Days", ti: "3 - 5 ናይ ስራሕ መዓልታት" }, isTi)}
                </p>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-black/40 p-2.5">
                <span className="text-[10px] uppercase text-zinc-500">
                  {t({ en: "Intermediary Fee", ti: "ዝተቖርጸ ክፍሊት" }, isTi)}
                </span>
                <p className="font-bold text-rose-300">-$18.50 (18.5% cut)</p>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-black/40 p-2.5">
                <span className="text-[10px] uppercase text-zinc-500">
                  {t({ en: "Final Delivery", ti: "ተቐባሊ ዝረኸቦ" }, isTi)}
                </span>
                <p className="font-bold text-amber-300">
                  {bankFrozen ? "$0.00 (Frozen)" : "$81.50"}
                </p>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-black/40 p-2.5">
                <span className="text-[10px] uppercase text-zinc-500">
                  {t({ en: "Censorship Vulnerability", ti: "ናይ ምእጋድ ሓደጋ" }, isTi)}
                </span>
                <p className="font-bold text-rose-400">
                  {t({ en: "High (4 Intermediaries)", ti: "ልዑል (4 ማእከላይ ትካላት)" }, isTi)}
                </p>
              </div>
            </div>

            {/* Freeze Button for Bank */}
            <div className="mt-3 flex items-center justify-between border-t border-rose-500/20 pt-3">
              <span className="text-xs text-zinc-400">
                {t(
                  {
                    en: "Test centralized vulnerability:",
                    ti: "ማእከላይ ባንኪ ክዓግት ከሎ እንታይ ከም ዝኸውን ፈትን:",
                  },
                  isTi
                )}
              </span>
              <button
                type="button"
                onClick={freezeBankAction}
                disabled={bankFrozen}
                className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/50 bg-rose-500/20 px-3 py-1.5 text-xs font-semibold text-rose-200 hover:bg-rose-500/30 disabled:opacity-50"
              >
                <ShieldAlert className="h-3.5 w-3.5" />
                {t({ en: "Trigger Bank Freeze / KYC Demand", ti: "ሕሳብ ዓጽው / ደው ኣብሎ" }, isTi)}
              </button>
            </div>
          </div>

          {/* Lane 2: Bitcoin Peer-to-Peer */}
          <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/20 via-zinc-950 to-zinc-950 p-4 sm:p-5 shadow-lg">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2.5">
                <div className="rounded-lg bg-emerald-500/20 p-2 text-emerald-300">
                  <Globe2 className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-zinc-100 sm:text-base">
                    {t({ en: "Bitcoin Peer-to-Peer Network", ti: "መዘዛዊ (P2P) ቢትኮይን መርበብ" }, isTi)}
                  </h5>
                  <p className="text-xs text-zinc-400">
                    Alice [Signed Key] ══════ [Global Peer Nodes & Miners] ══════→ Bob [Public Address]
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div>
                {btcProgress === 100 ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400 bg-emerald-500/25 px-3 py-1 text-xs font-bold text-emerald-200 shadow">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                    {t({ en: "CONFIRMED ON-CHAIN (~10 min)", ti: "ኣብ ውሽጢ 10 ደቓይቕ ተረጋጊጹ!" }, isTi)}
                  </span>
                ) : btcProgress > 0 ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-cyan-500/40 bg-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-200">
                    <Zap className="h-3.5 w-3.5 text-cyan-400 animate-bounce" />
                    {t({ en: "Broadcasting across peer nodes...", ti: "ናብ መላእ ዓለም ይዘርጋሕ ኣሎ..." }, isTi)}
                  </span>
                ) : (
                  <span className="text-xs text-zinc-500">
                    {t({ en: "Ready to sign & broadcast", ti: "ብምስጢራዊ ቁልፊ ክፍረም ድሉው" }, isTi)}
                  </span>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-emerald-300 transition-all duration-500 shadow-sm"
                  style={{ width: `${btcProgress}%` }}
                />
              </div>
            </div>

            {/* Metrics */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
              <div className="rounded-lg border border-zinc-800 bg-black/40 p-2.5">
                <span className="text-[10px] uppercase text-zinc-500">
                  {t({ en: "Settlement Time", ti: "ዝወስዶ ግዜ" }, isTi)}
                </span>
                <p className="font-bold text-emerald-300">
                  {t({ en: "~10 Minutes (Next Block)", ti: "~10 ደቓይቕ (ቀጻሊ ብሎክ)" }, isTi)}
                </p>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-black/40 p-2.5">
                <span className="text-[10px] uppercase text-zinc-500">
                  {t({ en: "Network Miner Fee", ti: "ናይ ዕደና ክፍሊት" }, isTi)}
                </span>
                <p className="font-bold text-cyan-300">&lt; $0.40 (Pure Sats)</p>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-black/40 p-2.5">
                <span className="text-[10px] uppercase text-zinc-500">
                  {t({ en: "Final Delivery", ti: "ተቐባሊ ዝረኸቦ" }, isTi)}
                </span>
                <p className="font-bold text-emerald-200">
                  150,000 Sats (100% of principal)
                </p>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-black/40 p-2.5">
                <span className="text-[10px] uppercase text-zinc-500">
                  {t({ en: "Censorship Vulnerability", ti: "ናይ ምእጋድ ሓደጋ" }, isTi)}
                </span>
                <p className="font-bold text-emerald-400">
                  {t({ en: "Zero (No Middleman)", ti: "ዜሮ (ማእከላይ የለን)" }, isTi)}
                </p>
              </div>
            </div>

            {/* Censorship Test for BTC */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-emerald-500/20 pt-3">
              <span className="text-xs text-zinc-400">
                {t(
                  {
                    en: "Can a government or bank stop this transaction?",
                    ti: "መንግስቲ ወይ ባንኪ ነዚ ትራንዛክሽን ደው ከብሎ ይኽእል ድዩ?",
                  },
                  isTi
                )}
              </span>
              <button
                type="button"
                onClick={attemptBtcCensor}
                className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/50 bg-cyan-500/15 px-3 py-1.5 text-xs font-semibold text-cyan-200 hover:bg-cyan-500/25"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                {t({ en: "Attempt to Censor Bitcoin Transfer", ti: "ቢትኮይን ንምዕጋት ፈትን" }, isTi)}
              </button>
            </div>

            {btcCensorAttempted && (
              <div className="mt-3 rounded-lg border border-emerald-400/50 bg-emerald-950/40 p-3 text-xs text-emerald-200 animate-fadeIn">
                <div className="flex items-center gap-2 font-bold text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>
                    {t(
                      {
                        en: "Censorship Blocked: Network Rebuffed Intervention!",
                        ti: "ምዕጋት ኣይተኻእለን: እቲ መርበብ ንምዕጋት ዝተገብረ ፈተነ ነጺግዎ!",
                      },
                      isTi
                    )}
                  </span>
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-zinc-300">
                  {t(
                    {
                      en: "Alice's signature is mathematically valid. No CEO, politician, or bank server has the cryptographic key to rewrite the block or cancel the broadcast.",
                      ti: "ናይ ኣሊስ ፌርማ ብሒሳብ ቅኑዕ ስለዝኾነ፡ ማንም ፕረዚደንት፡ ባንክ ወይ በዓል ስልጣን ነቲ ትራንዛክሽን ናይ ምዕጋት ወይ ናይ ምድምሳስ ቁልፊ የብሉን።",
                    },
                    isTi
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Key Takeaway Card */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-xs text-zinc-300">
            <span className="font-bold text-amber-400">
              {t({ en: "The Fundamental Lesson:", ti: "ቀንዲ ትምህርቲ:" }, isTi)}
            </span>{" "}
            {t(
              {
                en: "Traditional money transmission relies on trusted third parties who extract rent, dictate business hours, and can seize funds. Bitcoin acts as pure peer-to-peer electronic cash — permissionless, borderless, and mathematically settled.",
                ti: "ባህላዊ ምስግጋር ገንዘብ ኣብ ማእከላይ ትካላት ዝምርኮስ ኮይኑ፡ ልዑል ክፍሊት የኽፍል፡ ናይ ስራሕ ሰዓታት ይውስን፡ ገንዘብካ እውን ክዓግት ይኽእል። ቢትኮይን ግን መዛኑ ንመዛኑ (P2P) ዝኾነ ናጻ፡ ዶብ ዘይብሉ፡ ብሒሳብ ዝተረጋገጸ ዲጂታላዊ ጥረ ገንዘብ እዩ።",
              },
              isTi
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: CENTRALIZED DEEP DIVE ================= */}
      {activeTab === "centralized" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            <div
              className={`rounded-xl border p-3 transition-all ${
                centralizedStep >= 1
                  ? "border-amber-500/50 bg-amber-950/20 text-amber-200"
                  : "border-zinc-800 bg-zinc-950 text-zinc-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">1. Origin Bank</span>
                <Building2 className="h-4 w-4 text-amber-400" />
              </div>
              <p className="mt-2 text-[11px] leading-tight">
                {t(
                  {
                    en: "Alice submits transfer. Bank checks ID, operating hours, and AML forms.",
                    ti: "ኣሊስ ትሓትት። ባንኪ መንነት፡ ናይ ስራሕ ሰዓታት፡ ሰነዳት AML የረጋግጽ።",
                  },
                  isTi
                )}
              </p>
            </div>

            <div
              className={`rounded-xl border p-3 transition-all ${
                singleBankFrozen
                  ? "border-rose-500 bg-rose-950/40 text-rose-200"
                  : centralizedStep >= 2
                  ? "border-amber-500/50 bg-amber-950/20 text-amber-200"
                  : "border-zinc-800 bg-zinc-950 text-zinc-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">2. SWIFT / Clearing</span>
                {singleBankFrozen ? (
                  <ShieldAlert className="h-4 w-4 text-rose-400 animate-pulse" />
                ) : (
                  <Building2 className="h-4 w-4 text-zinc-400" />
                )}
              </div>
              <p className="mt-2 text-[11px] leading-tight">
                {singleBankFrozen
                  ? t(
                      {
                        en: "FLAGGED / FROZEN: 'Cross-border sanction match or missing intermediary license.'",
                        ti: "ተዓጊቱ: 'ናይ ዶብ ማዕቀብ ወይ ፍቓድ ምስኣን ብዝብል ገንዘቡ ደው ኢሉ!'",
                      },
                      isTi
                    )
                  : t(
                      {
                        en: "International correspondent routing. 3-5 business days delay.",
                        ti: "ዓለምለኻዊ ማእከላይ ባንክታት። ካብ 3 ክሳብ 5 ናይ ስራሕ መዓልታት ይወስድ።",
                      },
                      isTi
                    )}
              </p>
            </div>

            <div
              className={`rounded-xl border p-3 transition-all ${
                centralizedStep >= 3
                  ? "border-amber-500/50 bg-amber-950/20 text-amber-200"
                  : "border-zinc-800 bg-zinc-950 text-zinc-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">3. Destination Bank</span>
                <Building2 className="h-4 w-4 text-amber-400" />
              </div>
              <p className="mt-2 text-[11px] leading-tight">
                {t(
                  {
                    en: "Foreign exchange markup applied ($12-$25 fee deducted from Alice's $100).",
                    ti: "ናይ ሸርፊ ወሰኽን ክፍሊትን ($12-$25 ካብቲ ገንዘብ ተቖሪጹ ይተርፍ)።",
                  },
                  isTi
                )}
              </p>
            </div>

            <div
              className={`rounded-xl border p-3 transition-all ${
                centralizedStep >= 4
                  ? "border-emerald-500/50 bg-emerald-950/20 text-emerald-200"
                  : "border-zinc-800 bg-zinc-950 text-zinc-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">4. Bob Receives</span>
                <Users className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="mt-2 text-[11px] leading-tight">
                {t(
                  {
                    en: "Bob must present physical passport in person during branch hours.",
                    ti: "ቦብ ባንኪ ክፍቲ ኣብ ዝኾነሉ ብኣካል ፓስፖርት ሒዙ ክቐርብ ኣለዎ።",
                  },
                  isTi
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              disabled={singleBankFrozen || centralizedStep >= 4}
              onClick={() => setCentralizedStep((s) => Math.min(s + 1, 4))}
              className="rounded-lg bg-amber-500/20 border border-amber-500/50 px-4 py-2 text-xs font-semibold text-amber-200 hover:bg-amber-500/30 disabled:opacity-40"
            >
              {centralizedStep === 0
                ? t({ en: "Initiate Bank Wire", ti: "ምስግጋር ባንኪ ጀምር" }, isTi)
                : t({ en: `Advance Step (${centralizedStep}/4)`, ti: `ንቕድሚት ቀጽል (${centralizedStep}/4)` }, isTi)}
            </button>
            <button
              type="button"
              onClick={() => {
                setCentralizedStep(2);
                setSingleBankFrozen(true);
              }}
              className="rounded-lg bg-rose-500/20 border border-rose-500/50 px-3 py-2 text-xs font-semibold text-rose-200 hover:bg-rose-500/30"
            >
              {t({ en: "Simulate Bank Account Freeze / Refusal", ti: "ናይ ምእጋድ ሓደጋ ፈትን" }, isTi)}
            </button>
            <button
              type="button"
              onClick={() => {
                setCentralizedStep(0);
                setSingleBankFrozen(false);
              }}
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-zinc-400 hover:text-zinc-200"
            >
              {t({ en: "Reset", ti: "ዳግማይ ጀምር" }, isTi)}
            </button>
          </div>
        </div>
      )}

      {/* ================= TAB 3: P2P DEEP DIVE ================= */}
      {activeTab === "p2p" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div
              className={`rounded-xl border p-3 transition-all ${
                p2pStep >= 1
                  ? "border-cyan-500/50 bg-cyan-950/20 text-cyan-200"
                  : "border-zinc-800 bg-zinc-950 text-zinc-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">1. Signed With Private Key</span>
                <Key className="h-4 w-4 text-cyan-400" />
              </div>
              <p className="mt-2 text-[11px] leading-tight">
                {t(
                  {
                    en: "Alice signs transaction cryptographically with her phone. No ID or bank account needed.",
                    ti: "ኣሊስ ብሞባይላ ብምስጢራዊ ቁልፋ ትፍርም። ባንኪ ወይ ወረቐት ኣየድልያን።",
                  },
                  isTi
                )}
              </p>
            </div>

            <div
              className={`rounded-xl border p-3 transition-all ${
                p2pStep >= 2
                  ? "border-cyan-500/50 bg-cyan-950/20 text-cyan-200"
                  : "border-zinc-800 bg-zinc-950 text-zinc-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">2. Broadcast to Global Nodes</span>
                <Globe2 className="h-4 w-4 text-cyan-400" />
              </div>
              <p className="mt-2 text-[11px] leading-tight">
                {t(
                  {
                    en: "Sent directly to peer nodes worldwide. Validated by math, not corporate permission.",
                    ti: "ናብ መላእ ዓለም ዘለዉ ኖድስ ይዘርጋሕ። ብሒሳባዊ ሕጊ ይረጋገጽ እምበር ብፍቓድ ሰብ ኣይኮነን።",
                  },
                  isTi
                )}
              </p>
            </div>

            <div
              className={`rounded-xl border p-3 transition-all ${
                p2pStep >= 3
                  ? "border-emerald-500/50 bg-emerald-950/20 text-emerald-200"
                  : "border-zinc-800 bg-zinc-950 text-zinc-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">3. Block Confirmed: Bob Holds Sats</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="mt-2 text-[11px] leading-tight">
                {t(
                  {
                    en: "Included in blockchain. Final, immutable, irreversible settlement in ~10 minutes.",
                    ti: "ኣብ ብሎክቸይን ይምዝገብ። ዘይድምሰስን ቀዋምን ክፍሊት ኣብ ውሽጢ 10 ደቓይቕ ይፍጸም።",
                  },
                  isTi
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              disabled={p2pStep >= 3}
              onClick={() => setP2pStep((s) => Math.min(s + 1, 3))}
              className="rounded-lg bg-emerald-500/20 border border-emerald-500/50 px-4 py-2 text-xs font-semibold text-emerald-200 hover:bg-emerald-500/30 disabled:opacity-40"
            >
              {p2pStep === 0
                ? t({ en: "Broadcast P2P Transaction", ti: "ናይ ቢትኮይን ምስግጋር ፈኑ" }, isTi)
                : t({ en: `Confirm Next Block (${p2pStep}/3)`, ti: `ብሎክ ኣረጋግጽ (${p2pStep}/3)` }, isTi)}
            </button>
            <button
              type="button"
              onClick={() => setP2pStep(0)}
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-zinc-400 hover:text-zinc-200"
            >
              {t({ en: "Reset", ti: "ዳግማይ ጀምር" }, isTi)}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/* =========================================================================
   5.2 The Three Pillars of Bitcoin
   ========================================================================= */

/* =========================================================================
   5.2 The Three Pillars of Bitcoin
   ========================================================================= */

type NodeLocation = {
  id: string;
  city: string;
  country: string;
  online: boolean;
};

const initialNodes: NodeLocation[] = [
  { id: 'n1', city: 'Nairobi', country: 'Kenya', online: true },
  { id: 'n2', city: 'Lagos', country: 'Nigeria', online: true },
  { id: 'n3', city: 'Asmara', country: 'Eritrea', online: true },
  { id: 'n4', city: 'Frankfurt', country: 'Germany', online: true },
  { id: 'n5', city: 'Tokyo', country: 'Japan', online: true },
  { id: 'n6', city: 'São Paulo', country: 'Brazil', online: true },
  { id: 'n7', city: 'New York', country: 'USA', online: true },
  { id: 'n8', city: 'Johannesburg', country: 'South Africa', online: true },
];

function ThreePillarsExplorer({ isTi }: { isTi: boolean }) {
  const [pillar, setPillar] = useState<"decentralization" | "transparency" | "scarcity">(
    "decentralization"
  );

  // Pillar 1: Node network state
  const [nodes, setNodes] = useState<NodeLocation[]>(initialNodes);

  const toggleNode = (id: string) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, online: !n.online } : n))
    );
  };

  const shutDownRegion = () => {
    setNodes((prev) =>
      prev.map((n, idx) => (idx % 2 === 0 ? { ...n, online: false } : n))
    );
  };

  const restoreAllNodes = () => {
    setNodes(initialNodes);
  };

  const onlineCount = nodes.filter((n) => n.online).length;

  // Pillar 2: Transparency state
  const [showIdentity, setShowIdentity] = useState(false);


  return (
    <section className={panelClass} aria-label="The Three Pillars of Bitcoin">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-400">
          {t(
            {
              en: "5.2 Core Principles: The Three Revolutionary Pillars",
              ti: "5.2 መሰረታዊ ዓንደ-ሕንጻታት: ሰለስተ ሰውራዊ ዓንዲታት ቢትኮይን",
            },
            isTi
          )}
        </p>
        <h4 className="mt-1 text-lg font-bold text-zinc-100 sm:text-xl">
          {t(
            {
              en: "Decentralization · Pseudonymity · Mathematical Scarcity",
              ti: "ዘይማእከላይነት · ስም-ኣልቦነት · ሒሳባዊ ውሱንነት",
            },
            isTi
          )}
        </h4>
      </div>

      {/* Pillar Tabs */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 mb-6">
        <button
          type="button"
          onClick={() => setPillar("decentralization")}
          className={`rounded-xl border p-3 text-left transition-all ${
            pillar === "decentralization"
              ? "border-cyan-400 bg-cyan-950/30 text-cyan-100 shadow"
              : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <Server className="h-4 w-4 text-cyan-400" />
            <span>1. {t({ en: "Decentralization", ti: "ዘይማእከላይነት" }, isTi)}</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-400">
            {t({ en: "No single point of failure", ti: "ማእከላይ መጥቃዕቲ ዘይብሉ" }, isTi)}
          </p>
        </button>

        <button
          type="button"
          onClick={() => setPillar("transparency")}
          className={`rounded-xl border p-3 text-left transition-all ${
            pillar === "transparency"
              ? "border-purple-400 bg-purple-950/30 text-purple-100 shadow"
              : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <Eye className="h-4 w-4 text-purple-400" />
            <span>2. {t({ en: "Pseudonymity", ti: "ግሉጽነት ብዘይ ስም" }, isTi)}</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-400">
            {t({ en: "Public audit, private keys", ti: "ግሉጽ መዝገብ፡ ውልቃዊ መንነት" }, isTi)}
          </p>
        </button>

        <button
          type="button"
          onClick={() => setPillar("scarcity")}
          className={`rounded-xl border p-3 text-left transition-all ${
            pillar === "scarcity"
              ? "border-amber-400 bg-amber-950/30 text-amber-100 shadow"
              : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <Coins className="h-4 w-4 text-amber-400" />
            <span>3. {t({ en: "21 Million Scarcity", ti: "21 ሚልዮን ውሱንነት" }, isTi)}</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-400">
            {t({ en: "Immutable supply cap", ti: "ክውሰኽ ዘይክእል ቀዋሚ ቁጽሪ" }, isTi)}
          </p>
        </button>
      </div>

      {/* Pillar 1 Content */}
      {pillar === "decentralization" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-300">
              {t(
                {
                  en: "Thousands of independent nodes hold identical copies of the blockchain ledger. Click any node to simulate an outage or attack:",
                  ti: "ኣሽሓት ናጻ ኖድታት ሓደ ዓይነት መዝገብ ሒዞም ይሰርሑ። ሓደ ኖድ እንተ ወደቐ እቲ መርበብ ከመይ ከም ዝቕጽል ንምርኣይ ጠውቕ:",
                },
                isTi
              )}
            </p>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                onlineCount > 0
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
              }`}
            >
              {onlineCount} / {nodes.length} {t({ en: "Nodes Online", ti: "ኖድስ ብህይወት ኣለዉ" }, isTi)}
            </span>
          </div>

          {/* Node Grid */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {nodes.map((node) => (
              <button
                key={node.id}
                type="button"
                onClick={() => toggleNode(node.id)}
                className={`rounded-xl border p-3 text-left transition-all ${
                  node.online
                    ? "border-emerald-500/40 bg-emerald-950/15 text-emerald-100 hover:border-emerald-400"
                    : "border-rose-500/30 bg-rose-950/20 text-rose-300 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">{node.city}</span>
                  <div
                    className={`h-2 w-2 rounded-full ${
                      node.online ? "bg-emerald-400 animate-pulse" : "bg-rose-500"
                    }`}
                  />
                </div>
                <div className="mt-1 text-[11px] text-zinc-400">{node.country}</div>
                <div className="mt-2 text-[10px] uppercase font-semibold">
                  {node.online
                    ? t({ en: "Validating Blocks", ti: "ብሎክ የረጋግጽ ኣሎ" }, isTi)
                    : t({ en: "Offline / Blocked", ti: "ወዲቑ / ተዓጽዩ" }, isTi)}
                </div>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              onClick={shutDownRegion}
              className="rounded-lg border border-amber-500/50 bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-200 hover:bg-amber-500/30"
            >
              {t({ en: "Simulate Severe 50% Regional Outage", ti: "50% ናይ ዞባ ምቁራጽ ፈትን" }, isTi)}
            </button>
            <button
              type="button"
              onClick={restoreAllNodes}
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300 hover:border-zinc-500"
            >
              {t({ en: "Restore All Nodes", ti: "ኩሎም ኖድስ ምለስ" }, isTi)}
            </button>
          </div>

          <div className="rounded-lg border border-cyan-500/30 bg-cyan-950/20 p-3 text-xs text-cyan-200">
            <span className="font-semibold text-cyan-300">
              {t({ en: "Resilience Insight:", ti: "ናይ ጽንዓት ሚስጢር:" }, isTi)}
            </span>{" "}
            {onlineCount > 0
              ? t(
                  {
                    en: `Even with ${nodes.length - onlineCount} node(s) destroyed or banned, the surviving ${onlineCount} node(s) enforce the rules with 100% data integrity. There is no central server to seize.`,
                    ti: `ዋላ ${nodes.length - onlineCount} ኖድስ እንተ ወደቑ፡ እቶም ዝተረፉ ${onlineCount} ኖድስ ብዘይ ፍርሒ ስራሖም ይቕጽሉ። ማእከላይ ኮምፒዩተር ስለዘየለ ቢትኮይን ክዕጾ ኣይክእልን።`,
                  },
                  isTi
                )
              : t(
                  {
                    en: "If every single node on earth shut down, the chain would pause until one node restarted with the saved ledger.",
                    ti: "ኩሎም ኮምፒዩተራት ዓለም እንተ ጠፊኦም ጥራይ ደው ይብል፡ ሓንቲ ኮምፒዩተር ምስ ተኸፍተት ግን ታሪኽ ሒዛ ትቕጽል።",
                  },
                  isTi
                )}
          </div>
        </div>
      )}

      {/* Pillar 2 Content */}
      {pillar === "transparency" && (
        <div className="space-y-4">
          <p className="text-xs text-zinc-300">
            {t(
              {
                en: "Bitcoin balances public accountability with personal privacy. The ledger shows public addresses, never real identities:",
                ti: "ቢትኮይን ግሉጽነት ምስ ናይ ውልቀ ምስጢር የተኣሳስር። ኣብ ብሎክቸይን ዘሎ ናይ ሒሳብ ኣድራሻታት እምበር ናይ ሰባት መንነት ኣይኮነን:",
              },
              isTi
            )}
          </p>

          {/* Interactive Block Explorer Card */}
          <div className="rounded-xl border border-zinc-800 bg-black/60 p-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-400">Block #840,000 · Transaction Sample</span>
              <button
                type="button"
                onClick={() => setShowIdentity(!showIdentity)}
                className="flex items-center gap-1.5 rounded bg-purple-500/20 px-2.5 py-1 text-[11px] font-semibold text-purple-200 hover:bg-purple-500/30"
              >
                {showIdentity ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {showIdentity
                  ? t({ en: "Show Bitcoin Pseudonymous View", ti: "ናይ ቢትኮይን ስም-ኣልቦ ገጽ ኣርኢ" }, isTi)
                  : t({ en: "Reveal Real Identity (Bank View)", ti: "ናይ ባንኪ ናይ ስም ገጽ ኣርኢ" }, isTi)}
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Sender */}
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                <span className="text-[11px] text-zinc-500 uppercase">Sender (From)</span>
                {showIdentity ? (
                  <div className="mt-1 text-rose-300">
                    <p className="font-bold">Alice Kidane (ID: ER-489201)</p>
                    <p className="text-[10px] text-zinc-400">Bank: Standard Chartered Kampala</p>
                  </div>
                ) : (
                  <div className="mt-1 text-cyan-300">
                    <p className="font-bold">bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</p>
                    <p className="text-[10px] text-zinc-500">Public Key Hash (Pseudonym)</p>
                  </div>
                )}
              </div>

              {/* Recipient */}
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                <span className="text-[11px] text-zinc-500 uppercase">Recipient (To)</span>
                {showIdentity ? (
                  <div className="mt-1 text-rose-300">
                    <p className="font-bold">Bob Berhane (Passport: P901842)</p>
                    <p className="text-[10px] text-zinc-400">Location: Asmara, Eritrea</p>
                  </div>
                ) : (
                  <div className="mt-1 text-purple-300">
                    <p className="font-bold">bc1q7w0e5x8p9k3n2m4q6r8t0y2u4i6o8p0a2s4d6f</p>
                    <p className="text-[10px] text-zinc-500">Public Key Hash (Pseudonym)</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between rounded border border-zinc-800 bg-zinc-900/60 p-2.5">
              <span className="text-zinc-400">Amount Transferred:</span>
              <span className="font-bold text-amber-300">0.05000000 BTC (5,000,000 Sats)</span>
            </div>
          </div>

          <div className="rounded-lg border border-purple-500/30 bg-purple-950/20 p-3 text-xs text-purple-200">
            <span className="font-semibold text-purple-300">
              {t({ en: "Pseudonymity Principle:", ti: "ናይ ስም-ኣልቦነት መትከል:" }, isTi)}
            </span>{" "}
            {t(
              {
                en: "Anyone can verify the mathematics, account balance, and cryptographic signature on the blockchain. But the protocol itself neither knows nor stores names, addresses, or phone numbers.",
                ti: "ዝኾነ ሰብ ነቲ ሒሳብ፡ መጠን ገንዘብ፡ ፌርማን ኣብ ብሎክቸይን ከረጋግጽ ይኽእል እዩ። እቲ ስርዓት ግን ስም፡ ኣድራሻ ወይ ቴለፎንካ ኣይሓትትን ወይ ኣይፈልጥን።",
              },
              isTi
            )}
          </div>
        </div>
      )}

      {/* Pillar 3 Content */}
      {pillar === "scarcity" && (
        <div className="space-y-4">
          {/* Intro */}
          <p className="text-sm text-zinc-300 leading-relaxed">
            {t(
              {
                en: "Unlike fiat currencies that central banks can print without limit, Bitcoin has an absolute mathematical hard cap of 21,000,000 coins — enforced by code and shared by every node on the network.",
                ti: "ማእከላይ ባንክታት ብዘይ ዝኾነ ገደብ ዝሓትምዎ ፊያት ገንዘብ ዘይኮነስ፡ ቢትኮይን ቀዋሚ ሒሳባዊ ዝለዓለ ቁጽሪ 21,000,000 ሳንቲም ጥራይ ኣለዎ — እዚ ብኮድ ዝተተግበረን ብነፍሲ ወከፍ ኖድ ናይቲ መርበብ ዝካፈልን እዩ።",
              },
              isTi
            )}
          </p>

          {/* Fact cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* Hard Cap */}
            <div className="rounded-xl border border-amber-500/30 bg-zinc-900 p-4 flex flex-col gap-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-1">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
                {t({ en: "Absolute Hard Cap", ti: "ቀዋሚ ዝለዓለ ዳርጋ" }, isTi)}
              </p>
              <p className="text-sm text-zinc-200 font-mono font-bold">21,000,000 BTC</p>
              <p className="text-xs text-zinc-400">
                {t(
                  { en: "No government or bank can ever increase this limit.", ti: "ዝኾነ መንግስቲ ወይ ባንኪ እዚ ዳርጋ ዘይቕይሮ ኮይኑ ይጸንሕ።" },
                  isTi
                )}
              </p>
            </div>

            {/* Already Mined */}
            <div className="rounded-xl border border-emerald-500/30 bg-zinc-900 p-4 flex flex-col gap-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-1">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m14 12-8.5 8.5a2.12 2.12 0 1 1-3-3L11 9" />
                  <path d="M21 3a16 16 0 0 0-8.5 2.5l5.5 5.5A16 16 0 0 0 21 3Z" />
                  <path d="M3 21l3-3" />
                </svg>
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {t({ en: "Already Mined (2024)", ti: "ድሮ ዝተዓደለ (2024)" }, isTi)}
              </p>
              <p className="text-sm text-zinc-200 font-mono font-bold">~93%</p>
              <p className="text-xs text-zinc-400">
                {t(
                  { en: "Over 93% of all Bitcoin already distributed to miners.", ti: "ልዕሊ 93% ካብ ኩሉ ቢትኮይን ድሮ ናብ ዕደናውያን ተዓዲሉ ኣሎ።" },
                  isTi
                )}
              </p>
            </div>

            {/* Halving */}
            <div className="rounded-xl border border-cyan-500/30 bg-zinc-900 p-4 flex flex-col gap-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-1">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 22h14" />
                  <path d="M5 2h14" />
                  <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
                  <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
                </svg>
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                {t({ en: "Halving Every ~4 Years", ti: "ኣብ ነፍሲ ወከፍ ~4 ዓመት ምጉዳል" }, isTi)}
              </p>
              <p className="text-sm text-zinc-200 font-mono font-bold">210,000 {t({ en: "blocks", ti: "ብሎክስ" }, isTi)}</p>
              <p className="text-xs text-zinc-400">
                {t(
                  { en: "New issuance cuts in half, making Bitcoin increasingly scarce over time.", ti: "ሓድሽ ዝወሃብ ቢትኮይን ብፍርቂ ይጎድል፡ ምስ ግዜ ኣጸጋሚ ይኸውን።" },
                  isTi
                )}
              </p>
            </div>
          </div>

          {/* Callout */}
          <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-4 text-xs text-amber-200">
            <span className="font-semibold text-amber-300">
              {t({ en: "Mathematical Certainty:", ti: "ሒሳባዊ ርግጸኝነት:" }, isTi)}
            </span>{" "}
            {t(
              {
                en: "Bitcoin's scarcity is enforced by mathematics and consensus — not by any person, company, or government. Explore the full Halving schedule in the Mining chapter.",
                ti: "ዋሕዲ ቢትኮይን ብሒሳብን ምስምምዓትን ዝተተግበረ እዩ — ብዝኾነ ሰብ፡ ኩባንያ ወይ መንግስቲ ዘይኮነስ። ናይ ምጉዳል ፕሮግራም ሙሉእ ዝርዝር ኣብ ምዕራፍ ዕደና ዕዘበሉ።",
              },
              isTi
            )}
          </div>
        </div>
      )}
    </section>
  );
}

/* =========================================================================
   Interactive Graphical Representation: Decentralized vs Centralized
   Replacing static dec.jpeg with interactive SVG topologies
   ========================================================================= */

export function NetworkTopologyGraphic({ isTi }: { isTi: boolean }) {
  const [isBankDown, setIsBankDown] = useState(false);
  const [offlinePeer, setOfflinePeer] = useState<number | null>(null);

  // 6 node coordinates arranged in a circle (center 150, 150, radius 96)
  const nodes = [
    { id: 0, x: 150, y: 54, label: "Alice" },
    { id: 1, x: 233, y: 102, label: "Bob" },
    { id: 2, x: 233, y: 198, label: "Charlie" },
    { id: 3, x: 150, y: 246, label: "David" },
    { id: 4, x: 67, y: 198, label: "Emma" },
    { id: 5, x: 67, y: 102, label: "Frank" },
  ];

  // All 15 full-mesh pairs
  const meshLines: [number, number][] = [
    [0, 1], [0, 2], [0, 3], [0, 4], [0, 5],
    [1, 2], [1, 3], [1, 4], [1, 5],
    [2, 3], [2, 4], [2, 5],
    [3, 4], [3, 5],
    [4, 5],
  ];

  return (
    <section
      className="my-6 rounded-2xl border border-zinc-800 bg-zinc-950/90 p-4 shadow-xl sm:p-6"
      aria-label="Network Topology: Decentralized vs Centralized"
    >
      {/* Header */}
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-400">
          {t(
            {
              en: "5.2 Visual Architecture: Network Topologies",
              ti: "5.2 ስእላዊ ኣሰራርሓ: ቅርጺ መርበባት (Network Topologies)",
            },
            isTi
          )}
        </p>
        <h4 className="mt-1 text-lg font-bold text-zinc-100 sm:text-xl">
          {t(
            {
              en: "Decentralized Mesh (DeFi) vs Centralized Star (CeFi)",
              ti: "ዘይማእከላዊ መርበብ (P2P) ኣንጻር ማእከላይ ባንኪ (Star)",
            },
            isTi
          )}
        </h4>
        <p className="mt-1 text-xs text-zinc-400">
          {t(
            {
              en: "Compare how payments route directly peer-to-peer versus requiring authorization from a single custodial intermediary.",
              ti: "ክፍሊታት ብቐጥታ መዛኑ ንመዛኑ ክሰጋገር ከሎን ብሓደ ማእከላይ መንጎኛ ባንኪ ክሓልፍ ከሎን ዘሎ ፍልልይ ተዓዘብ።",
            },
            isTi
          )}
        </p>
      </div>

      {/* Side-by-side Topologies */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* LEFT: Decentralized Mesh Network */}
        <div className="flex flex-col justify-between rounded-xl border border-cyan-500/30 bg-zinc-900/60 p-4 sm:p-5">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 text-[11px] font-bold text-cyan-300">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                  DeFi · {t({ en: "Decentralized Network", ti: "ዘይማእከላዊ መርበብ" }, isTi)}
                </span>
                <h5 className="mt-1.5 text-base font-bold text-zinc-100">
                  {t({ en: "Peer-to-Peer Full Mesh", ti: "መዛኑ ንመዛኑ (Full Mesh)" }, isTi)}
                </h5>
              </div>
              <span className="text-xs font-mono text-cyan-400/80">
                15 {t({ en: "routes", ti: "መስመራት" }, isTi)}
              </span>
            </div>

            {/* SVG Canvas */}
            <div className="relative mx-auto my-4 flex aspect-square max-w-[280px] items-center justify-center">
              <svg viewBox="0 0 300 300" className="h-full w-full select-none">
                <defs>
                  <linearGradient id="meshGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
                  </linearGradient>
                </defs>

                {/* Mesh Connecting Lines */}
                {meshLines.map(([fromIdx, toIdx], i) => {
                  const fromNode = nodes[fromIdx];
                  const toNode = nodes[toIdx];
                  const isLineSevered = offlinePeer !== null && (fromIdx === offlinePeer || toIdx === offlinePeer);

                  return (
                    <line
                      key={"mesh-line-" + i}
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke={isLineSevered ? "#ef4444" : "url(#meshGradient)"}
                      strokeWidth={isLineSevered ? "1" : "1.75"}
                      strokeDasharray={isLineSevered ? "3 3" : undefined}
                      strokeOpacity={isLineSevered ? 0.35 : 0.75}
                      className="transition-all duration-300"
                    />
                  );
                })}

                {/* 6 User Nodes */}
                {nodes.map((n) => {
                  const isNodeOffline = offlinePeer === n.id;
                  return (
                    <g
                      key={n.id}
                      className="cursor-pointer transition-transform hover:scale-110"
                      onClick={() => setOfflinePeer(isNodeOffline ? null : n.id)}
                    >
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r="18"
                        fill={isNodeOffline ? "#450a0a" : "#082f49"}
                        stroke={isNodeOffline ? "#ef4444" : "#38bdf8"}
                        strokeWidth="2"
                        className="transition-colors duration-300 shadow-lg"
                      />
                      {/* Avatar head & shoulders */}
                      <circle
                        cx={n.x}
                        cy={n.y - 3}
                        r="4.5"
                        fill={isNodeOffline ? "#f87171" : "#38bdf8"}
                      />
                      <path
                        d={"M " + (n.x - 7.5) + " " + (n.y + 10) + " a 7.5 6 0 0 1 15 0"}
                        fill={isNodeOffline ? "#f87171" : "#38bdf8"}
                      />
                      {/* Node Label */}
                      <text
                        x={n.x}
                        y={n.y + 28}
                        textAnchor="middle"
                        className="fill-zinc-400 text-[10px] font-mono font-medium"
                      >
                        {n.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <p className="text-center text-[11px] text-zinc-400 italic">
              {t(
                {
                  en: "Click any peer to simulate a local failure — other 5 peers stay fully interconnected.",
                  ti: "ሓደ መዛኑ ንምቁራጽ ጠውቕ — ዝተረፉ 5 መዛኑ ቀጥታዊ ርክቦም ከይተቛረጸ ይቕጽል።",
                },
                isTi
              )}
            </p>
          </div>

          {/* Bullet Breakdown */}
          <div className="mt-4 space-y-2 border-t border-zinc-800 pt-3 text-xs text-zinc-300">
            <div className="flex items-center gap-2 text-emerald-300 font-semibold">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-[11px]">✓</span>
              <span>{t({ en: "Direct Peer-to-Peer settlement", ti: "ቀጥታዊ ስግግር ካብ ኢድ ናብ ኢድ" }, isTi)}</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-300 font-semibold">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-[11px]">✓</span>
              <span>{t({ en: "No central point of control or shutdown", ti: "ማእከላይ መጥቃዕቲ ወይ Kill Switch የለን" }, isTi)}</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-300 font-semibold">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-[11px]">✓</span>
              <span>{t({ en: "Resilient: Reroutes around any outage", ti: "ሓያል: ሓደ እንተወደቐ ብኻልእ መስመር ይቕጽል" }, isTi)}</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Centralized Star Network */}
        <div className={"flex flex-col justify-between rounded-xl border p-4 sm:p-5 transition-colors duration-300 " + (isBankDown ? "border-rose-500/50 bg-rose-950/20" : "border-amber-500/30 bg-zinc-900/60")}>
          <div>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className={"inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold " + (isBankDown ? "bg-rose-500/20 border-rose-500/40 text-rose-300" : "bg-amber-500/10 border-amber-500/30 text-amber-300")}>
                  <span className={"h-2 w-2 rounded-full " + (isBankDown ? "bg-rose-400" : "bg-amber-400")} />
                  CeFi · {t({ en: "Centralized Network", ti: "ማእከላይ መርበብ" }, isTi)}
                </span>
                <h5 className="mt-1.5 text-base font-bold text-zinc-100">
                  {t({ en: "Star Topology (Custodial Bank)", ti: "ማእከላይ መርበብ (መንጎኛ ባንኪ)" }, isTi)}
                </h5>
              </div>
              <span className="text-xs font-mono text-amber-400/80">
                {isBankDown
                  ? t({ en: "OUTAGE", ti: "ተቛሪጹ" }, isTi)
                  : t({ en: "1 Chokepoint", ti: "1 ማእከል" }, isTi)}
              </span>
            </div>

            {/* SVG Canvas */}
            <div className="relative mx-auto my-4 flex aspect-square max-w-[280px] items-center justify-center">
              <svg viewBox="0 0 300 300" className="h-full w-full select-none">
                <defs>
                  {/* Arrow marker pointing inward to center */}
                  <marker
                    id="arrowInward"
                    viewBox="0 0 10 10"
                    refX="6"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 8 5 L 0 9 z" fill={isBankDown ? "#f43f5e" : "#f59e0b"} />
                  </marker>
                </defs>

                {/* 6 Inward Arrows to Central Bank */}
                {nodes.map((n) => {
                  // Angle towards center (150, 150)
                  const dx = 150 - n.x;
                  const dy = 150 - n.y;
                  const dist = Math.sqrt(dx * dx + dy * dy);
                  // stop line slightly before bank circle of radius 32
                  const stopX = 150 - (dx / dist) * 32;
                  const stopY = 150 - (dy / dist) * 32;

                  return (
                    <g key={"star-" + n.id}>
                      <line
                        x1={n.x}
                        y1={n.y}
                        x2={stopX}
                        y2={stopY}
                        stroke={isBankDown ? "#f43f5e" : "#f59e0b"}
                        strokeWidth="2"
                        strokeDasharray={isBankDown ? "4 4" : undefined}
                        strokeOpacity={isBankDown ? 0.4 : 0.8}
                        markerEnd="url(#arrowInward)"
                        className="transition-all duration-300"
                      />
                      {isBankDown && (
                        <text
                          x={(n.x + stopX) / 2}
                          y={(n.y + stopY) / 2}
                          textAnchor="middle"
                          className="fill-rose-400 text-xs font-bold"
                        >
                          ✕
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Central Bank Icon at (150, 150) */}
                <g className="transition-all duration-300">
                  <circle
                    cx="150"
                    cy="150"
                    r="34"
                    fill={isBankDown ? "#450a0a" : "#451a03"}
                    stroke={isBankDown ? "#f43f5e" : "#f59e0b"}
                    strokeWidth="2.5"
                    className="shadow-2xl"
                  />
                  {/* Bank Building graphic */}
                  {/* Pediment roof */}
                  <polygon
                    points="132,140 150,126 168,140"
                    fill={isBankDown ? "#f87171" : "#fbbf24"}
                  />
                  {/* Pillars */}
                  <rect x="134" y="142" width="4" height="15" fill={isBankDown ? "#f87171" : "#fbbf24"} />
                  <rect x="142" y="142" width="4" height="15" fill={isBankDown ? "#f87171" : "#fbbf24"} />
                  <rect x="154" y="142" width="4" height="15" fill={isBankDown ? "#f87171" : "#fbbf24"} />
                  <rect x="162" y="142" width="4" height="15" fill={isBankDown ? "#f87171" : "#fbbf24"} />
                  {/* Base step */}
                  <rect x="130" y="158" width="40" height="4" fill={isBankDown ? "#f87171" : "#fbbf24"} />

                  <text
                    x="150"
                    y="173"
                    textAnchor="middle"
                    className={"text-[9px] font-bold font-mono " + (isBankDown ? "fill-rose-300" : "fill-amber-300")}
                  >
                    {isBankDown ? "OFFLINE" : "BANK"}
                  </text>
                </g>

                {/* 6 Peripheral Users */}
                {nodes.map((n) => (
                  <g key={n.id}>
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r="18"
                      fill={isBankDown ? "#27272a" : "#27272a"}
                      stroke={isBankDown ? "#f43f5e" : "#fbbf24"}
                      strokeWidth="1.5"
                      strokeDasharray={isBankDown ? "2 2" : undefined}
                      className="transition-colors duration-300"
                    />
                    <circle
                      cx={n.x}
                      cy={n.y - 3}
                      r="4.5"
                      fill={isBankDown ? "#71717a" : "#f59e0b"}
                    />
                    <path
                      d={"M " + (n.x - 7.5) + " " + (n.y + 10) + " a 7.5 6 0 0 1 15 0"}
                      fill={isBankDown ? "#71717a" : "#f59e0b"}
                    />
                    <text
                      x={n.x}
                      y={n.y + 28}
                      textAnchor="middle"
                      className="fill-zinc-400 text-[10px] font-mono font-medium"
                    >
                      {n.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            <p className={"text-center text-[11px] italic transition-colors " + (isBankDown ? "text-rose-300 font-medium" : "text-zinc-400")}>
              {isBankDown
                ? t(
                    {
                      en: "⚠️ The bank is down: All 6 users are completely cut off and frozen.",
                      ti: "⚠️ እቲ ማእከላይ ባንኪ ወደቐ: ኩሎም 6 ተጠቀምቲ ብሓንሳብ ተዓጽዮምን ተቛሪጾምን።",
                    },
                    isTi
                  )
                : t(
                    {
                      en: "Every single transaction must funnel through the central bank for approval.",
                      ti: "ነፍሲ ወከፍ ትራንዛክሽን ብማእከላይ ባንኪ ጥራይ ክሓልፍን ፍቓድ ክረክብን ኣለዎ።",
                    },
                    isTi
                  )}
            </p>
          </div>

          {/* Bullet Breakdown */}
          <div className="mt-4 space-y-2 border-t border-zinc-800 pt-3 text-xs text-zinc-300">
            <div className="flex items-center gap-2 text-rose-300 font-semibold">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/20 text-rose-400 text-[11px]">✕</span>
              <span>{t({ en: "Intermediary chokepoint controls balances", ti: "ማእከላይ መንጎኛ ሕሳብካ ይቆጻጸር" }, isTi)}</span>
            </div>
            <div className="flex items-center gap-2 text-rose-300 font-semibold">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/20 text-rose-400 text-[11px]">✕</span>
              <span>{t({ en: "Bank can freeze, delay, or censor payments", ti: "ባንክ ክፍሊትካ ክዓግት ወይ ክሰርዝ ይኽእል" }, isTi)}</span>
            </div>
            <div className="flex items-center gap-2 text-rose-300 font-semibold">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/20 text-rose-400 text-[11px]">✕</span>
              <span>{t({ en: "Catastrophic Single Point of Failure", ti: "ሓደገኛ ንጽል ነጥቢ ውድቀት (Single Point of Failure)" }, isTi)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Simulation Controls */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 sm:p-4">
        <div className="text-xs text-zinc-300">
          <span className="font-semibold text-zinc-100">
            {t({ en: "Interactive Test:", ti: "ፈተነ ኣካይድ:" }, isTi)}
          </span>{" "}
          {t(
            {
              en: "Toggle an outage on the central bank to witness how a single point of failure paralyzes an entire economy.",
              ti: "ሓደ ማእከላይ ትካል እንተፈሺሉ ምሉእ ቁጠባ ከመይ ከም ዝዕጾ ንምርኣይ ነቲ ባንኪ ኣጥፍኣዮ።",
            },
            isTi
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsBankDown(!isBankDown)}
            className={"rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all " + (isBankDown ? "border-emerald-500/60 bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30" : "border-rose-500/60 bg-rose-500/20 text-rose-200 hover:bg-rose-500/30")}
          >
            {isBankDown
              ? t({ en: "Restore Bank System", ti: "ንቡር ባንኪ ምለስ" }, isTi)
              : t({ en: "Simulate Bank System Outage", ti: "ናይ ባንኪ ምቁራጽ ፈትን" }, isTi)}
          </button>
          {offlinePeer !== null && (
            <button
              type="button"
              onClick={() => setOfflinePeer(null)}
              className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-2.5 py-1.5 text-xs font-medium text-cyan-200 hover:bg-cyan-500/20"
            >
              {t({ en: "Reconnect All Peers", ti: "ኩሎም መዛኑ ኣተሓሕዝ" }, isTi)}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}


/* =========================================================================
   Main Chapter 5 Export
   ========================================================================= */

export type Chapter5Module =
  | "genesis_whitepaper"
  | "p2p_vs_centralized"
  | "network_topology"
  | "three_pillars";

export function Chapter5InteractiveLesson({
  module,
  isTi,
}: {
  module: Chapter5Module;
  isTi: boolean;
}) {
  switch (module) {
    case "genesis_whitepaper":
      return <GenesisWhitepaperGraphic isTi={isTi} />;
    case "p2p_vs_centralized":
      return <PeerToPeerSimulator isTi={isTi} />;
    case "network_topology":
      return <NetworkTopologyGraphic isTi={isTi} />;
    case "three_pillars":
      return <ThreePillarsExplorer isTi={isTi} />;
    default:
      return null;
  }
}
