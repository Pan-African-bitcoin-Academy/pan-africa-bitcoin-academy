/**
 * Chapter list content: theory, practice, LiveSession, quiz per chapter.
 * Used by /chapters page and by home page upcoming events (match by title).
 */
export type ChapterListItem = {
  id: number;
  level: number;
  number: number;
  title: string;
  difficulty: string;
  time: string;
  icon: string;
  type: string;
  activities: string[];
  learnPoints: string[];
  theory: string[];
  practice: string[];
  LiveSession?: string;
  quiz?: string;
};

export const chaptersList: ChapterListItem[] = [
  { id: 1, level: 1, number: 1, title: "The Nature of Money", difficulty: "Beginner", time: "45 min", icon: "📘", type: "theory", activities: ["Class Questions on 'What is Money?'"], learnPoints: ["Why humans created money", "Functions of money — Medium of Exchange, Store of Value, Unit of Account", "Properties of sound money — Scarce, Durable, Portable, Divisible, Recognizable"], theory: ["Introduction to money", "Why humans created money", "Functions and properties of money"], practice: ["Class discussion on money", "Activity: What is Money?"], LiveSession: "5-minute explanation of money evolution", quiz: "questions on money fundamentals" },
  { id: 2, level: 1, number: 2, title: "The Journey of Money", difficulty: "Beginner", time: "50 min", icon: "📘", type: "theory", activities: ["Timeline of Money"], learnPoints: ["From barter to commodity exchange", "Coinage and precious metals", "Paper money and banknotes", "The rise of fiat currencies", "Precursors to Bitcoin — Haber & Stornetta Time-Stamping"], theory: ["History of money evolution", "Barter to fiat transition", "Pre-Bitcoin innovations"], practice: ["Create timeline of money", "Activity: Timeline of Money"], LiveSession: "Visual journey through money history", quiz: "questions on money evolution" },
  { id: 3, level: 1, number: 3, title: "Problems with Traditional (Fiat) Money", difficulty: "Beginner", time: "55 min", icon: "📘", type: "theory", activities: ["Class Discussion: 'Do We Trust Our Money?'"], learnPoints: ["Inflation and loss of purchasing power", "Centralized control — Governments and Banks", "Financial exclusion and inequality", "Fragility of the current system"], theory: ["Fiat money problems", "Inflation mechanisms", "Centralization risks"], practice: ["Class discussion", "Activity: Trust in money"], LiveSession: "Problems with fiat explained", quiz: "questions on fiat issues" },
  { id: 4, level: 1, number: 4, title: "From Crisis to Innovation", difficulty: "Beginner", time: "60 min", icon: "📘", type: "theory", activities: ["The Effects of Inflation — An Auction Simulation"], learnPoints: ["Why the old system was failing", "Decreasing purchasing power", "Monetary inflation and its effects", "Global debt burden and social inequality", "The Cypherpunks & Early Digital Currencies"], theory: ["System failures", "Inflation effects", "Cypherpunk movement"], practice: ["Auction simulation", "Activity: Inflation effects"], LiveSession: "Crisis to innovation story", quiz: "questions on crisis and innovation" },
  { id: 5, level: 1, number: 5, title: "The Birth of Bitcoin", difficulty: "Beginner", time: "50 min", icon: "📘", type: "theory", activities: ["Reading a Simplified Whitepaper Excerpt"], learnPoints: ["2008 Financial Crisis context", "Satoshi Nakamoto and the Whitepaper", "Bitcoin as Peer-to-Peer Electronic Cash", "Ledger/platform money concept"], theory: ["2008 crisis", "Satoshi's vision", "Bitcoin whitepaper basics"], practice: ["Read whitepaper excerpt", "Activity: Whitepaper analysis"], LiveSession: "Birth of Bitcoin story", quiz: "questions on Bitcoin origins" },
  { id: 6, level: 1, number: 6, title: "Keys and Transactions", difficulty: "Beginner", time: "60 min", icon: "🛠", type: "practice", activities: ["Role-play a Bitcoin Transaction"], learnPoints: ["Digital signatures — How Bitcoin verifies ownership", "Public/Private keys explained simply", "Peer-to-Peer transactions (broadcast, verification, confirmation)"], theory: ["Digital signatures", "Public/private keys", "Transaction flow"], practice: ["Role-play transaction", "Activity: Transaction simulation"], LiveSession: "Keys and transactions explained", quiz: "questions on keys and transactions" },
  { id: 7, level: 1, number: 7, title: "Blockchain Basics", difficulty: "Beginner", time: "55 min", icon: "📘", type: "theory", activities: ["Build a Paper Blockchain (hash-link demo)"], learnPoints: ["Blocks, Hashes, and Linking", "The Role of Merkle Trees in Proving Transactions", "Immutability, Tamper-Evidence, and Trust-Minimization", "What Miners Hash — Anatomy of a Block Header"], theory: ["Block structure", "Merkle trees", "Immutability concepts"], practice: ["Paper blockchain demo", "Activity: Hash-link demo"], LiveSession: "Blockchain basics visualized", quiz: "questions on blockchain" },
  { id: 8, level: 1, number: 8, title: "Exchange & Software Wallet", difficulty: "Beginner", time: "70 min", icon: "🛠", type: "practice", activities: ["Testnet Walkthrough — Buy mock sats → send to class wallets"], learnPoints: ["What Is an Exchange? How to Acquire Bitcoin", "Software Signer (mobile/desktop): create wallet, seed backup", "Complete a First Transaction (send/receive)", "Privacy Basics (VPN, address reuse awareness, local-first tools)"], theory: ["Exchanges overview", "Wallet basics", "Privacy fundamentals"], practice: ["Create wallet", "Testnet transaction", "Activity: Testnet walkthrough"], LiveSession: "Wallet setup tutorial", quiz: "questions on wallets" },
  { id: 9, level: 2, number: 9, title: "UTXOs, Fees & Coin Control", difficulty: "Intermediate", time: "65 min", icon: "🛠", type: "practice", activities: ["Plan a Spend from a UTXO Set (paper exercise)"], learnPoints: ["What You Really Own (UTXO model)", "Fees and Input Selection (change outputs; sat/vB basics)", "UTXO Management & When to Consolidate", "Privacy & fee trade-offs"], theory: ["UTXO model", "Fee mechanisms", "Coin control"], practice: ["UTXO planning", "Activity: UTXO set exercise"], LiveSession: "UTXOs explained", quiz: "questions on UTXOs" },
  { id: 10, level: 2, number: 10, title: "Good Bitcoin Hygiene", difficulty: "Intermediate", time: "50 min", icon: "🛠", type: "practice", activities: ["Hygiene Checklist Audit on a Demo Wallet"], learnPoints: ["New Receive Address Each Time; verify on the device", "Labeling Transactions and UTXOs for future spending", "Basic Privacy Habits (avoid reuse; payment flow awareness)"], theory: ["Privacy best practices", "Address management", "Transaction labeling"], practice: ["Hygiene audit", "Activity: Checklist audit"], LiveSession: "Bitcoin hygiene guide", quiz: "questions on hygiene" },
  { id: 11, level: 2, number: 11, title: "Hardware Signers", difficulty: "Intermediate", time: "75 min", icon: "🛠", type: "practice", activities: ["Dry-Run Recovery (no funds) + sign a testnet PSBT"], learnPoints: ["Why Hardware (threats it mitigates; hot vs cold)", "Setup, Backup, and Test Recovery (seed vs passphrase basics)", "Spending Safely with a Hardware Signer (PSBT flow)"], theory: ["Hardware wallet security", "Hot vs cold storage", "PSBT basics"], practice: ["Hardware setup", "Recovery test", "Activity: PSBT signing"], LiveSession: "Hardware wallet tutorial", quiz: "questions on hardware wallets" },
  { id: 12, level: 2, number: 12, title: "Verify for Yourself — Block Explorers & Nodes", difficulty: "Intermediate", time: "60 min", icon: "🛠", type: "practice", activities: ["Explorer Scavenger Hunt"], learnPoints: ["Using a Block Explorer (txids, confirmations, feerates)", "Proving Inclusion (Merkle path, high-level)", "Why Run a Node (don't trust—verify; mempool view; policy/relay)", "First-Time Sync & Costs"], theory: ["Block explorers", "Node importance", "Verification methods"], practice: ["Explorer usage", "Activity: Scavenger hunt"], LiveSession: "Nodes and explorers guide", quiz: "questions on verification" },
  { id: 13, level: 2, number: 13, title: "Proof of Work and Block Rewards", difficulty: "Intermediate", time: "55 min", icon: "📘", type: "theory", activities: ["'Proof-of-Work by Hand' classroom game"], learnPoints: ["Proof of Work (hard to make, easy to verify)", "Miners & Block Rewards — current reward 3.125 BTC", "Halving Schedule and Monetary Inflation", "Subsidy Timeline — 2140 End of New Supply"], theory: ["Proof of Work", "Mining rewards", "Halving schedule"], practice: ["PoW game", "Activity: Proof-of-Work by hand"], LiveSession: "Mining explained", quiz: "questions on PoW" },
  { id: 14, level: 2, number: 14, title: "Mining in Practice", difficulty: "Intermediate", time: "60 min", icon: "📘", type: "theory", activities: ["Chart the Impact of Difficulty and Fees on Security"], learnPoints: ["Difficulty Adjustment (every 2,016 blocks; ~10-min target)", "Mining Pools & Centralization Risk", "The 'Security Budget': subsidy decline vs fee market", "ASIC Supply Chains & Geopolitical Risk"], theory: ["Difficulty adjustment", "Mining pools", "Security budget"], practice: ["Security analysis", "Activity: Chart impact"], LiveSession: "Mining in practice", quiz: "questions on mining" },
  { id: 15, level: 2, number: 15, title: "Layer 2 & Sidechains in Daily Life", difficulty: "Intermediate", time: "70 min", icon: "⚡", type: "practice", activities: ["Live Lightning Payment Demo"], learnPoints: ["Lightning Basics (fast payments; settlement trade-offs)", "Receive and Spend via Lightning (custodial vs non-custodial)", "Sidechains Overview (e.g., Liquid — federated trade-offs)", "Circular Economies — markets that run on sats"], theory: ["Lightning Network", "Layer 2 solutions", "Sidechains"], practice: ["Lightning payment", "Activity: Live demo"], LiveSession: "Lightning explained", quiz: "questions on Lightning" },
  { id: 16, level: 3, number: 16, title: "Full Node & Opening a Lightning Channel", difficulty: "Advanced", time: "80 min", icon: "🛠", type: "practice", activities: ["Simulated channel open/close (regtest/testnet)"], learnPoints: ["Choosing a Node Stack; privacy tips", "Open/Close a Channel; routing basics", "Backups/watchtowers"], theory: ["Node stacks", "Lightning channels", "Routing basics"], practice: ["Channel operations", "Activity: Channel simulation"], LiveSession: "Node and Lightning setup", quiz: " questions on nodes and channels" },
  { id: 17, level: 3, number: 17, title: "Multi-Sig (Collaborative Custody)", difficulty: "Advanced", time: "70 min", icon: "🛠", type: "practice", activities: ["Design a 2-of-3 Family Custody Plan"], learnPoints: ["Why Multi-Sig (family/orgs/inheritance)", "M-of-N Designs; coordinator vs coordinator-less flows", "Backup Strategies and Operational Playbooks"], theory: ["Multi-sig concepts", "M-of-N designs", "Custody strategies"], practice: ["Multi-sig setup", "Activity: Family custody plan"], LiveSession: "Multi-sig explained", quiz: "questions on multi-sig" },
  { id: 18, level: 3, number: 18, title: "Intro to Bitcoin Script (Optional Track)", difficulty: "Advanced", time: "65 min", icon: "📘", type: "theory", activities: [], learnPoints: ["Locking & Unlocking Conditions (P2PKH → P2WPKH)", "Timelocks & Simple Policies (high-level)", "Where Script Appears in Real Wallets"], theory: ["Bitcoin Script", "Locking conditions", "Timelocks"], practice: ["Script examples", "Policy design"], LiveSession: "Script basics", quiz: "questions on Script" },
  { id: 19, level: 3, number: 19, title: "UTXO Consolidation & Privacy Risks", difficulty: "Advanced", time: "60 min", icon: "🛠", type: "practice", activities: ["Draft a Consolidation Plan for a Noisy UTXO Set"], learnPoints: ["When to Consolidate (fee windows; mempool conditions)", "Privacy Erosion Risks & Coin-Control Discipline", "Spend Plans for Future Fees and Privacy"], theory: ["Consolidation strategies", "Privacy risks", "Coin control"], practice: ["Consolidation planning", "Activity: Draft plan"], LiveSession: "Privacy and consolidation", quiz: "questions on consolidation" },
  { id: 20, level: 3, number: 20, title: "Why Bitcoin? Philosophy & Adoption", difficulty: "Advanced", time: "55 min", icon: "📘", type: "theory", activities: ["Debate: 'Do You Trust Code or State?'"], learnPoints: ["Chartalist vs Metallist vs Platform Money (thinking framework)", "Bitcoin vs bitcoin (protocol/network vs unit)", "Trust-Minimized Finance & Who Benefits"], theory: ["Money philosophy", "Bitcoin vs bitcoin", "Trust minimization"], practice: ["Philosophical debate", "Activity: Code vs State debate"], LiveSession: "Bitcoin philosophy", quiz: "questions on philosophy" },
  { id: 21, level: 3, number: 21, title: "Wrap-Up & Resources", difficulty: "Advanced", time: "40 min", icon: "📘", type: "theory", activities: ["Final Reflection — 'From Failing Fiat to Sovereign Bitcoin'"], learnPoints: ["Glossary of key terms", "Primary Sources & Local-First Tools", "Final Reflection on the journey"], theory: ["Course summary", "Resources", "Next steps"], practice: ["Final reflection", "Activity: Reflection exercise"], LiveSession: "Course wrap-up", quiz: "Final assessment" },
];

/** O(1) lookup by title (used by home page upcoming events). */
const chapterListByTitle = new Map(chaptersList.map((c) => [c.title, c]));

/** Get chapter list item by title (for upcoming events topic matching). */
export function getChapterListByTitle(title: string): ChapterListItem | undefined {
  return chapterListByTitle.get(title);
}

import type { SiteLanguage } from "@/contexts/LanguageContext";

export const chaptersListTi: Partial<Record<number, Partial<ChapterListItem>>> = {
  1: {
    title: "ባህሪ ገንዘብ",
    learnPoints: [
      "ገንዘብ  ስለምንታይ ገደብ ምልውዋጥ ንምፍታሕ ተኣታትዩ።",
      "ማእከላይ መቀያየርን፣ መዕቆሪ ሃብቲ ፣ ክንቆጽረሉ ንኽእል መዕቀንን",
      "ጠባያት ጥዕይ ገንዘብ ጽንዓት፡ ምንቅስቃስ ፡ ምምቕቓል፡ ምልላይ፡ ዋሕዲ",
      "እምነት ከመይ ጌሩ ንዕዳጋን ገንዘብን ይድግፍ",
    ],
    activities: ["ናይ ክፍሊ ሕቶታት ብዛዕባ 'ገንዘብ እንታይ እዩ?'"],
    theory: ["መእተዊ ገንዘብ", "ስለምንታይ ደቂ ሰባት ገንዘብ ፈጢሮም", "ጥቅምታትን ባህርያትን ገንዘብ"],
    practice: ["ናይ ክፍሊ ምይይጥ", "ዕማም፡ ገንዘብ እንታይ እዩ?"],
    quiz: "ሕቶታት ብዛዕባ መሰረታት ገንዘብ",
  },
  2: {
    title: "ጉዕዞ ገንዘብ",
    learnPoints: [
      "ደረት ምልውዋጥን ምውሳኽ ገንዘብ ሸቐጣትን",
      "ሳንቲም ከመይ ጌሩ ተንቀሳቓሲነትን ደረጃታትን ከም ዘመሓይሾ",
      "ስለምንታይ ናይ ወረቐት ገንዘብ ንሓጺን ተኪኡ",
      "ፊያት ናይ ምትእምማንን ዝቕባበን ምትሕውዋስ’ዩ።",
      "ክሪፕቶግራፊክ ቅድመ-ኩነት ንቢትኮይን",
    ],
    activities: ["ናይ ታሪኽ ገንዘብ ዝርዝር"],
    theory: ["ናይ ገንዘብ ምዕባለ ታሪኽ", "ካብ ባርተር ናብ ፊያት ምስግጋር", "ቅድሚ ቢትኮይን ዝነበሩ ሓደስቲ ሓሳባት"],
    practice: ["ናይ ገንዘብ ታሪኽ ሰሌዳ ምድላው", "ዕማም፡ ናይ ታሪኽ ገንዘብ ዝርዝር"],
    quiz: "ሕቶታት ብዛዕባ ምዕባለ ገንዘብ",
  },
  3: {
    title: "ጸገማት ባህላዊ (ፊያት) ገንዘብ",
    learnPoints: [
      "ዋጋታት ንብረት ብኸመይ ንናይ ምዕዳግ ዓቕሚ የጉድሎ",
      "ማእከላይ ቁጽጽር ኣብ ቀረብን ተበጻሕነትን ገንዘብ",
      "ፋይናንሳዊ ምግላልን ዘይምዕሩይነትን",
      "ስርዓት ምብስባስ ኣብ ቅልውላው",
    ],
    activities: ["ናይ ክፍሊ ምይይጥ: 'ንገንዘብና ንኣምኖ ዲና?'"],
    theory: ["ናይ ፊያት ገንዘብ ጸገማት", "ናይ ዝቕባበ ኣሰራርሓ", "ናይ ማእከላይ ምቁጽጻር ሓደጋታት"],
    practice: ["ናይ ክፍሊ ምይይጥ", "ዕማም፡ ኣብ ገንዘብ ዘሎ ምትእምማን"],
    quiz: "ሕቶታት ብዛዕባ ጉዳያት ፊያት",
  },
  4: {
    title: "ካብ ቅልውላው ናብ ምህዞ",
    learnPoints: [
      "ስለምንታይ ሳይፈርፓንክስ ናይ ብሕቲ፡ ነጻ ገንዘብ ክደፍኡ",
      "እቲ ኣብ 2008 ዝነበረ ቅልውላው ንቢትኮይን ብኸመይ ከም ዘበገሶ",
    ],
    activities: ["ናይ መጨረሻ-ምዕራፍ ምስትብሃል: ሳይፈርፓንክስ ብዛዕባ ብሕትውናን ናጽነትን ስለምንታይ ይግደሱ?"],
    theory: ["ፍሽለታት ኣረጊት ስርዓት", "ምንቅስቓስ ሳይፈርፓንክ", "ቅድመ-ኩነት ቢትኮይን"],
    practice: ["ናይ ምስትብሃል ዕማም", "ዕማም: ምስ ቅልውላው ዝተሓሓዝ ምስትብሃል"],
    quiz: "ሕቶታት ብዛዕባ ቅልውላው ምህዞን",
  },
  5: {
    title: "ቢትኮይን",
    learnPoints: [
      "ስለምንታይ ኣብ ውርሻ ፋይናንስ ዝነበረ እምነት ተበቲኹ",
      "ጻዕዳ ወረቐትን ስሙ ዘይምጥቃስን ሳቶሺ",
      "መዛኑ መዛኑ ኤሌክትሮኒካዊ ኣዕኑድ ጥረ ገንዘብ",
    ],
    activities: ["ዕማም: ቀሊል ዝኾነ ናይ ዋይትፔፐር ጽሑፍ ምንባብ"],
    theory: ["ናይ 2008 ቅልውላው", "ናይ ሳቶሺ ራእይ", "መሰረታት ጻዕዳ ወረቐት ቢትኮይን"],
    practice: ["ናይ ዋይትፔፐር ጽሑፍ ምንባብ", "ዕማም: ናይ ዋይትፔፐር ትንተና"],
    quiz: "ሕቶታት ብዛዕባ ምጅማር ቢትኮይን",
  },
  6: {
    title: "መፍትሕን ትራንዛክሽንን",
    learnPoints: [
      "ህዝባዊ/ብሕታዊ መፍትሕን ዲጂታላዊ ፌርማን",
      "ዋሕዚ ትራንዛክሽን ካብ ምፍጣር ክሳብ ምርግጋፅ",
    ],
    activities: ["ዕማም: ናይ ቢትኮይን ትራንዛክሽን ተራ-ምጽዋት"],
    theory: ["ዲጂታላዊ ፌርማታት", "ህዝባዊ/ብሕታዊ መፍትሕታት", "ዋሕዚ ትራንዛክሽን"],
    practice: ["ናይ ትራንዛክሽን ተራ-ምጽዋት", "ዕማም: ናይ ትራንዛክሽን ሲሙሌሽን"],
    quiz: "ሕቶታት ብዛዕባ መፍትሕን ትራንዛክሽንን",
  },
  7: {
    title: "መሰረታዊ ብሎክቸይን",
    learnPoints: [
      "ብሎክ፡ ሃሽ፡ ሰንሰለት።",
      "ዘይምልዋጥን ምትዕንቓፍን-መርትዖ",
      "ተራ ዕደናውያንን መርትዖ ስራሕን።",
    ],
    activities: ["ናይ ወረቐት ብሎክቸይን ምህናጽ (ናይ ሃሽ-መላግቦ መርኣያ)"],
    theory: ["ናይ ብሎክ ቅርጺ", "ስለምንታይ ሃሽ ኣገዳሲ ምዃኑ", "ዘይቅየር ታሪኽ"],
    practice: ["መስተጋብራዊ ብሎክቸይን ዲሞ", "ዕማም፡ ሓደ ብሎክ ምርዳእ"],
    quiz: "ሕቶታት ብዛዕባ መሰረታዊ ብሎክቸይን",
  },
  8: {
    title: "ሶፍትዌር ዋለተ & ኤክስቸንጅ",
    learnPoints: [
      "ምልውዋጥ ብኸመይ ይሰርሕን ስለምንታይ ተውጽኦን",
      "ሶፍትዌር ዋለተ ፈጢርካ ነቲ ሲድ ዓቅብ",
      "ቀዳማይ ትራንዛክሽን ምልኣኽ/ምቕባል፤ መሰረታዊ ነገራት ክፍሊት",
      "ጀመርቲ ብሕትውና: ኣድራሻ ዳግመ-ምጥቃም, VPN, local-first",
    ],
    activities: ["ቴስትኔት መገሻ — ዘይሓቀኛ ሳትስ 'ግዛእ' → ናብ ናይ ክፍሊ ፖርተፊልዮታት ስደድ"],
    theory: ["ሓፈሻዊ ትሕዝቶ ምልውዋጥ", "መሰረታት ፖርተፊልዮ", "መሰረታት ብሕትውና"],
    practice: ["ፖርተፊልዮ ምፍጣር", "ናይ ቴስትኔት ትራንዛክሽን", "ንጥፈት: ቴስትኔት መገሻ"],
    quiz: "ሕቶታት ብዛዕባ ፖርተፊልዮታትን ምልውዋጥን",
  },
  9: {
    title: "UTXOs, Fees & Coin Control",
    learnPoints: [
      "ሞዴል UTXO vs ሞዴል ኣካውንት።",
      "ክፍሊት ኣብ መጠን (vbytes) እምበር ኣብ መጠን ኣይምርኮስን እዩ።",
      "ምድልዳል መዓስን ስለምንታይን",
    ],
    activities: ["ካብ ናይ UTXO ስብስብ ወጻኢ ምምጻእ ምውጣን (ናይ ወረቐት ዕዮ)"],
    theory: ["ሞዴል UTXO", "ስርዓት ክፍሊት", "ናይ ሳንቲም ቁጽጽር"],
    practice: ["ናይ UTXO ውጥን", "ንጥፈት: ናይ UTXO ስብስብ ዕዮ"],
    quiz: "ሕቶታት ብዛዕባ UTXOs",
  },
  10: {
    title: "ጽቡቅ ኣተሓሕዛ ቢትኮይን",
    learnPoints: [
      "ሓድሽ ናይ መቀበሊ ኣድራሻ ተጠቐም እሞ ኣብ መሳሪሕኻ ከኣ ኣረጋግጽ",
      "ንንጹርነት ትራንዛክሽን/UTXOs ዝብል ስያመ ምሃብ",
      "ካብ ጎዳኢ ውህደትን ኣድራሻ ዳግማይ ምጥቃምን ኣወግድ",
    ],
    activities: ["ኣብ ናይ ፈተነ ዋለት ናይ ጽሬት መርማሪት-ዝርዝር ኦዲት ምግባር"],
    theory: ["ናይ ብሕትውና ብሉጻት ልምድታት", "ምሕደራ ኣድራሻታት", "ምልክት ምግባር ትራንዛክሽን"],
    practice: ["ናይ ጽሬት ኦዲት", "ንጥፈት: መርማሪት-ዝርዝር ኦዲት"],
    quiz: "ሕቶታት ብዛዕባ ጽቡቕ ኣተሓሕዛ ቢትኮይን",
  },
  11: {
    title: "ሃርድዌር መፈረሚ",
    learnPoints: [
      "ስግኣታት ሃርድዌር ምቅላል vs ናይ ኢንተርነት ቦርሳታት",
      "ምድላው፣ ናይ መፍትሕ ቃላት/ምዕቃብን፣ መሰረታዊ ሓረግ ምሕላፍ",
      "ኣሰራርሓ ምፍራም PSBTን ኣብ መሳርሒ ምርግጋጽንን።",
    ],
    activities: ["ናይ ምምላስ ፈተነ (ብዘይ ገንዘብ) + ናይ ቴስትኔት PSBT ምፍራም"],
    theory: ["ናይ ሃርድዌር ዋለት ድሕነት", "ውዑይ ኣንጻር ዝሑል ምዕቃብ", "መሰረታት PSBT"],
    practice: ["ናይ ሃርድዌር ምድላው", "ናይ ምምላስ ፈተነ", "ንጥፈት: ምፍራም PSBT"],
    quiz: "ሕቶታት ብዛዕባ ሃርድዌር መፈረሚታት",
  },
  12: {
    title: "ባዕልኻ ኣረጋግጽ — Block Explorers & Nodes",
    learnPoints: [
      "ንtxids, ምርግጋጽ, ክፍሊት ዳህሰስቲ ተጠቐም",
      "መርክል መንገዲ ምትእትታው (ኣምር)",
      "ንምንታይ ኖድ ምጉያይ፤ mempool ርኡይነት፤ መሰረታዊ ፖሊሲ/ሪለይ",
    ],
    activities: ["ናይ ብሎክ ዳህሳሲ ሃድን (Scavenger Hunt)"],
    theory: ["ብሎክ ዳህሰስቲ", "ኣገዳስነት ኖድ", "ናይ ምርግጋጽ ሜላታት"],
    practice: ["ምጥቃም ዳህሳሲ", "ንጥፈት: ናይ ዳህሳሲ ሃድን"],
    quiz: "ሕቶታት ብዛዕባ ምርግጋጽን ኖድስን",
  },
};

export function getChaptersList(lang: SiteLanguage = "en"): ChapterListItem[] {
  if (lang !== "ti") return chaptersList;
  return chaptersList.map((ch) => {
    const override = chaptersListTi[ch.id];
    if (!override) return ch;
    return { ...ch, ...override };
  });
}
