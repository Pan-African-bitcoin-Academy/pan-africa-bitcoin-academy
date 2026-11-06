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
                en: "5.1 Interactive Artifact: Genesis & The Whitepaper",
                ti: "5.1 መስተጋብራዊ ቅርስ: ጀነሲስ ብሎክን ዋይትፐይፐርን",
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
  const [mode, setMode] = useState<"centralized" | "p2p">("centralized");
  const [step, setStep] = useState(0);
  const [censorshipTriggered, setCensorshipTriggered] = useState(false);

  const resetSim = (newMode: "centralized" | "p2p") => {
    setMode(newMode);
    setStep(0);
    setCensorshipTriggered(false);
  };

  return (
    <section className={panelClass} aria-label="Peer-to-Peer vs Centralized Simulator">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-400">
          {t(
            {
              en: "5.2 Network Simulator: Money Transmission",
              ti: "5.2 መስተጋብራዊ መርበብ: ምስግጋር ገንዘብ",
            },
            isTi
          )}
        </p>
        <h4 className="mt-1 text-lg font-bold text-zinc-100 sm:text-xl">
          {t(
            {
              en: "Traditional Banking Wire vs. Bitcoin Peer-to-Peer",
              ti: "ናይ ባንኪ ምስግጋር ኣንጻር መዘዛዊ (P2P) ቢትኮይን",
            },
            isTi
          )}
        </h4>
        <p className="mt-1 text-xs text-zinc-400">
          {t(
            {
              en: "Scenario: Alice in Kampala wants to send $100 (or equivalent Sats) to Bob in Asmara across borders.",
              ti: "ኣብነት: ኣሊስ ኣብ ካምፓላ ዘላ ንቦብ ኣብ ኣስመራ ዘሎ ዶባት ሰጊራ $100 ወይ ሳትስ ክትሰደሉ ትደሊ።",
            },
            isTi
          )}
        </p>
      </div>

      {/* Mode Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          type="button"
          onClick={() => resetSim("centralized")}
          className={mode === "centralized" ? selectedButtonClass : buttonClass}
        >
          <span className="flex items-center gap-1.5">
            <Building2 className="h-4 w-4 text-rose-400" />
            {t({ en: "Traditional Centralized Bank", ti: "ባህላዊ ማእከላይ ባንኪ" }, isTi)}
          </span>
        </button>
        <button
          type="button"
          onClick={() => resetSim("p2p")}
          className={mode === "p2p" ? selectedButtonClass : buttonClass}
        >
          <span className="flex items-center gap-1.5">
            <Globe2 className="h-4 w-4 text-emerald-400" />
            {t({ en: "Bitcoin Peer-to-Peer Network", ti: "መዘዛዊ (P2P) ቢትኮይን" }, isTi)}
          </span>
        </button>
      </div>

      {/* Centralized Pipeline */}
      {mode === "centralized" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            {/* Step 1 */}
            <div
              className={`rounded-xl border p-3 transition-all ${
                step >= 1
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

            {/* Step 2 */}
            <div
              className={`rounded-xl border p-3 transition-all ${
                censorshipTriggered
                  ? "border-rose-500 bg-rose-950/40 text-rose-200"
                  : step >= 2
                  ? "border-amber-500/50 bg-amber-950/20 text-amber-200"
                  : "border-zinc-800 bg-zinc-950 text-zinc-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">2. SWIFT / Clearing</span>
                {censorshipTriggered ? (
                  <ShieldAlert className="h-4 w-4 text-rose-400 animate-pulse" />
                ) : (
                  <Building2 className="h-4 w-4 text-zinc-400" />
                )}
              </div>
              <p className="mt-2 text-[11px] leading-tight">
                {censorshipTriggered
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

            {/* Step 3 */}
            <div
              className={`rounded-xl border p-3 transition-all ${
                step >= 3
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

            {/* Step 4 */}
            <div
              className={`rounded-xl border p-3 transition-all ${
                step >= 4
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

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              disabled={censorshipTriggered || step >= 4}
              onClick={() => setStep((s) => Math.min(s + 1, 4))}
              className="rounded-lg bg-amber-500/20 border border-amber-500/50 px-4 py-2 text-xs font-semibold text-amber-200 hover:bg-amber-500/30 disabled:opacity-40"
            >
              {step === 0
                ? t({ en: "Initiate Bank Wire", ti: "ምስግጋር ባንኪ ጀምር" }, isTi)
                : t({ en: `Advance Step (${step}/4)`, ti: `ንቕድሚት ቀጽል (${step}/4)` }, isTi)}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep(2);
                setCensorshipTriggered(true);
              }}
              className="rounded-lg bg-rose-500/20 border border-rose-500/50 px-3 py-2 text-xs font-semibold text-rose-200 hover:bg-rose-500/30"
            >
              {t({ en: "Simulate Bank Account Freeze / Refusal", ti: "ናይ ምእጋድ ሓደጋ ፈትን" }, isTi)}
            </button>
            <button
              type="button"
              onClick={() => resetSim("centralized")}
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-zinc-400 hover:text-zinc-200"
            >
              {t({ en: "Reset", ti: "ዳግማይ ጀምር" }, isTi)}
            </button>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-black/40 p-3 text-xs text-zinc-300">
            <span className="font-semibold text-rose-400">
              {t({ en: "The Centralized Trade-off:", ti: "ናይ ማእከላይ ባንኪ ድሩትነት:" }, isTi)}
            </span>{" "}
            {t(
              {
                en: "Every intermediary has the power to seize, delay, freeze, or censor the funds. You need their permission to use your own money.",
                ti: "ኣብ መንጎ ዘሎ ነፍሲ ወከፍ ማእከላይ ትካል ገንዘብካ ናይ ምእጋድ፡ ምድንጓይ፡ ወይ ምኽልካል ምሉእ ስልጣን ኣለዎ። ናትካ ገንዘብ ንምጥቃም ናቶም ፍቓድ የድልየካ።",
              },
              isTi
            )}
          </div>
        </div>
      )}

      {/* P2P Pipeline */}
      {mode === "p2p" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* Step 1 */}
            <div
              className={`rounded-xl border p-3 transition-all ${
                step >= 1
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

            {/* Step 2 */}
            <div
              className={`rounded-xl border p-3 transition-all ${
                step >= 2
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

            {/* Step 3 */}
            <div
              className={`rounded-xl border p-3 transition-all ${
                step >= 3
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

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              disabled={step >= 3}
              onClick={() => setStep((s) => Math.min(s + 1, 3))}
              className="rounded-lg bg-emerald-500/20 border border-emerald-500/50 px-4 py-2 text-xs font-semibold text-emerald-200 hover:bg-emerald-500/30 disabled:opacity-40"
            >
              {step === 0
                ? t({ en: "Broadcast P2P Transaction", ti: "ናይ ቢትኮይን ምስግጋር ፈኑ" }, isTi)
                : t({ en: `Confirm Next Block (${step}/3)`, ti: `ብሎክ ኣረጋግጽ (${step}/3)` }, isTi)}
            </button>
            <button
              type="button"
              onClick={() => resetSim("p2p")}
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-zinc-400 hover:text-zinc-200"
            >
              {t({ en: "Reset", ti: "ዳግማይ ጀምር" }, isTi)}
            </button>
          </div>

          <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/15 p-3 text-xs text-emerald-200">
            <span className="font-semibold text-emerald-400">
              {t({ en: "The Peer-to-Peer Breakthrough:", ti: "ናይ መዘዛዊ መርበብ ዓወት:" }, isTi)}
            </span>{" "}
            {t(
              {
                en: "No one can close the network on weekends, seize the transfer, or charge confiscatory intermediary fees. Digital cash operates like physical cash handed over person-to-person.",
                ti: "ቀዳመ-ሰንበት ዝዕጾ ባንኪ የለን፡ ማንም ገንዘብካ ክዓግት ወይ ልዑል ክፍሊት ክቖርጽ ኣይኽእልን። ልክዕ ከም ናይ ኢድ ጥረ ገንዘብ ብቐጥታ ካብ ኢድ ናብ ኢድ ይሰጋገር።",
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
   5.2 The Three Pillars of Bitcoin
   ========================================================================= */

type NodeLocation = {
  id: string;
  city: string;
  country: string;
  online: boolean;
};

const initialNodes: NodeLocation[] = [
  { id: "n1", city: "Nairobi", country: "Kenya", online: true },
  { id: "n2", city: "Lagos", country: "Nigeria", online: true },
  { id: "n3", city: "Asmara", country: "Eritrea", online: true },
  { id: "n4", city: "Frankfurt", country: "Germany", online: true },
  { id: "n5", city: "Tokyo", country: "Japan", online: true },
  { id: "n6", city: "São Paulo", country: "Brazil", online: true },
  { id: "n7", city: "New York", country: "USA", online: true },
  { id: "n8", city: "Johannesburg", country: "South Africa", online: true },
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

  // Pillar 3: Scarcity Halving slider
  const [epochIndex, setEpochIndex] = useState(4); // default 2024 (epoch 4)

  const epochs = [
    { year: 2009, reward: "50 BTC", mined: "10,500,000", pct: "50.0%", era: "Genesis era" },
    { year: 2012, reward: "25 BTC", mined: "15,750,000", pct: "75.0%", era: "1st Halving" },
    { year: 2016, reward: "12.5 BTC", mined: "18,375,000", pct: "87.5%", era: "2nd Halving" },
    { year: 2020, reward: "6.25 BTC", mined: "19,687,500", pct: "93.75%", era: "3rd Halving" },
    { year: 2024, reward: "3.125 BTC", mined: "20,343,750", pct: "96.87%", era: "4th Halving (Current)" },
    { year: 2028, reward: "1.5625 BTC", mined: "20,671,875", pct: "98.43%", era: "5th Halving" },
    { year: 2140, reward: "0 BTC", mined: "21,000,000", pct: "100.0%", era: "Final Halving (End of Issuance)" },
  ];

  const currentEpoch = epochs[epochIndex];

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
          <p className="text-xs text-zinc-300">
            {t(
              {
                en: "Unlike fiat currencies which central banks print endlessly, Bitcoin has an absolute mathematical hard cap of 21,000,000 coins. Every 210,000 blocks (~4 years), the block subsidy cuts in half:",
                ti: "ማእከላይ ባንክታት ብዘይ ገደብ ዝሓትምዎ ፊያት ገንዘብ ዘይኮነስ፡ ቢትኮይን 21,000,000 ጥራይ ዝውሰን ቀዋሚ ቁጽሪ ኣለዎ። ኣብ ነፍሲ ወከፍ 4 ዓመት (210,000 ብሎክስ) ሓድሽ ዝወሃብ ብፍርቂ ይጎድል:",
              },
              isTi
            )}
          </p>

          {/* Halving Selector */}
          <div className="rounded-xl border border-amber-500/30 bg-zinc-950 p-4">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center border-b border-zinc-800 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  {currentEpoch.era} · {currentEpoch.year}
                </span>
                <h5 className="mt-0.5 text-base font-bold text-zinc-100">
                  Block Reward: <span className="text-amber-300">{currentEpoch.reward}</span>
                </h5>
              </div>
              <div className="text-right">
                <span className="text-xs text-zinc-400">Total Coins Mined:</span>
                <p className="text-sm font-mono font-bold text-emerald-300">
                  {currentEpoch.mined} / 21,000,000 ({currentEpoch.pct})
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                <span>0 BTC</span>
                <span>21,000,000 BTC (Hard Limit)</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
                  style={{ width: currentEpoch.pct }}
                />
              </div>
            </div>

            {/* Slider */}
            <div className="mt-5">
              <label htmlFor="epoch-range" className="text-xs font-medium text-zinc-400">
                {t(
                  {
                    en: "Slide through Halving Epochs (2009 to 2140):",
                    ti: "ናይ ምጉዳል መድረኻት ምረጽ (2009 ክሳብ 2140):",
                  },
                  isTi
                )}
              </label>
              <input
                id="epoch-range"
                type="range"
                min={0}
                max={epochs.length - 1}
                value={epochIndex}
                onChange={(e) => setEpochIndex(Number(e.target.value))}
                className="mt-2 w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
                {epochs.map((ep, i) => (
                  <span
                    key={ep.year}
                    className={i === epochIndex ? "font-bold text-amber-300" : ""}
                  >
                    {ep.year}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-3 text-xs text-amber-200">
            <span className="font-semibold text-amber-300">
              {t({ en: "Mathematical Certainty:", ti: "ሒሳባዊ ርግጸኝነት:" }, isTi)}
            </span>{" "}
            {t(
              {
                en: "Over 93% of all Bitcoin has already been mined. By year 2140, the final satoshi will be minted, and miners will be rewarded solely through transaction fees. No government decree or bank crisis can ever increase the 21 million limit.",
                ti: "ልዕሊ 93% ካብ ኩሉ ቢትኮይን ድሮ ተዓዲሉ ተወዲኡ እዩ። ኣብ 2140 እታ ናይ መወዳእታ ሳት ምስ ወጸት፡ ዕደናውያን ብናይ ምስግጋር ክፍሊት ጥራይ ይኽፈሉ። ማንም መንግስቲ ወይ ባንኪ ካብ 21 ሚልዮን ንላዕሊ ክውስኽ ኣይክእልን።",
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
   Main Chapter 5 Export
   ========================================================================= */

export type Chapter5Module =
  | "genesis_whitepaper"
  | "p2p_vs_centralized"
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
    case "three_pillars":
      return <ThreePillarsExplorer isTi={isTi} />;
    default:
      return null;
  }
}
