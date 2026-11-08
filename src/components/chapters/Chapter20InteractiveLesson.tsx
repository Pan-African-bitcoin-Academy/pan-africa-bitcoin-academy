"use client";

import React, { useState } from "react";
import {
  Scale,
  Coins,
  Network,
  Globe2,
  Users,
  ShieldCheck,
  Building2,
  Landmark,
  Cpu,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  HeartHandshake,
  Lock,
  ArrowRight,
  Sparkles,
  Layers,
  Zap,
} from "lucide-react";

interface Props {
  module: "monetary_frameworks_spectrum" | "protocol_vs_asset_lens" | "trust_minimized_beneficiaries_map";
  isTi?: boolean;
}

export function Chapter20InteractiveLesson({ module, isTi = false }: Props) {
  // ==========================================
  // MODULE 1: MONETARY FRAMEWORKS SPECTRUM
  // ==========================================
  if (module === "monetary_frameworks_spectrum") {
    return <MonetaryFrameworksSection isTi={isTi} />;
  }

  // ==========================================
  // MODULE 2: BITCOIN (NETWORK) VS BITCOIN (ASSET)
  // ==========================================
  if (module === "protocol_vs_asset_lens") {
    return <ProtocolVsAssetSection isTi={isTi} />;
  }

  // ==========================================
  // MODULE 3: TRUST-MINIMIZED BENEFICIARIES MAP
  // ==========================================
  if (module === "trust_minimized_beneficiaries_map") {
    return <TrustMinimizedBeneficiariesSection isTi={isTi} />;
  }

  return null;
}

// -------------------------------------------------------------
// MODULE 1: Monetary Frameworks Spectrum
// -------------------------------------------------------------
function MonetaryFrameworksSection({ isTi }: { isTi: boolean }) {
  const [selectedFramework, setSelectedFramework] = useState<"chartalism" | "metallism" | "platform">("platform");

  const frameworks = {
    chartalism: {
      name: isTi ? "ቻርታሊዝም (Chartalism - Fiat)" : "Chartalism (Fiat Money)",
      tagline: isTi ? "ዋጋ ካብ ውሳነን ግብርን መንግስቲ ይመጽእ" : "Value derived from state decree & legal tender taxation",
      sourceOfValue: isTi ? "ናይ መንግስቲ ሕግን ግብርን (State authority & tax obligation)" : "Government monopoly decree & compulsory taxation",
      issuance: isTi ? "ማእከላይ ባንክ ብዘይ ገደብ ይሓትም" : "Arbitrary central bank expansion (seigniorage)",
      verifiability: isTi ? "ማእከላይ (ኣብ ባንክታትን ስርዓተ-ፍትሕን ይምርኮስ)" : "Requires institutional audits & legal courts",
      portability: isTi ? "ዲጂታል (ግን ብናይ ዶብን ባንክን ገደብ ይዕገት)" : "Digital bits, but constrained by capital controls & borders",
      confiscationRisk: isTi ? "ዝለዓለ (ናይ ባንክ ሕሳብ ምዕጻው ወይ ምውሳድ ቀሊል እዩ)" : "High (accounts frozen, bail-ins, inflation tax)",
      summary: isTi
        ? "ገንዘብ መንግስቲ ስለ ዝደለዮ ጥራይ ዋጋ ይህልዎ። እቲ ቀንዲ ድሩትነቱ፡ መንግስታት ዕዳኦም ንምኽፋል ገንዘብ ብምሕታም ንናይ ዜጋታት ዕቋር የጥፍእዎ።"
        : "Asserts that money is exclusively a creature of the state. Its fatal vulnerability is perpetual debasement: states print away purchasing power to fund debt.",
      icon: Landmark,
      color: "border-blue-500/40 bg-blue-950/20 text-blue-300",
    },
    metallism: {
      name: isTi ? "ሜታሊዝም (Metallism - Commodity)" : "Metallism (Commodity Money)",
      tagline: isTi ? "ዋጋ ካብቲ ፊዚካዊ ማዕድን ባህሪ ይምንጭው" : "Value derived from intrinsic physical scarcity (Gold/Silver)",
      sourceOfValue: isTi ? "ፊዚካዊ ጸጋን ኬሚካላዊ ጽንዓትን (Physical rare elements)" : "Geological scarcity & chemical indestructibility",
      issuance: isTi ? "ብናይ ምድሪ ዕደና ይድረኽ (~1.5% ኣብ ዓመት)" : "Constrained by physical earth crust mining (~1.5%/year)",
      verifiability: isTi ? "ኸቢድ (ምምካኽ፡ ምምዛንን ናይ ኬሚስትሪ ፈተሻን የድሊ)" : "Expensive & slow (requires assaying, melting, scales)",
      portability: isTi ? "ትሑት (ከቢድ፡ ዶብ ንምስጋርን ንምጉዓዝን ኣጸጋሚ)" : "Poor (heavy physical mass, unsafe across borders)",
      confiscationRisk: isTi ? "ማእከላይ ክሳብ ዝለዓለ (Executive Order 6102 - ኣብ ቮልታት ይምንጠል)" : "High when custodial (gold centralization in bank vaults enabled 1933 seizures)",
      summary: isTi
        ? "ወርቂ ንኣሽሓት ዓመታት ጽቡቕ ዕቋር ኮይኑ ጸኒሑ እዩ። ግን ብምኽንያት ክብደቱን ምምዛኑ ዘለዎ ጸገምን ኣብ ባንክታት ተዓቚሩ ናብ ወረቐት ባንክ ተቐይሩ፡ ኣብ መወዳእታ ድማ መንግስታት ወሲዶምዎ።"
        : "Gold anchored sound money for millennia. However, its high transport/assay friction forced civilization into paper certificates, enabling centralization and state capture.",
      icon: Scale,
      color: "border-amber-500/40 bg-amber-950/20 text-amber-300",
    },
    platform: {
      name: isTi ? "ፕላትፎርም ገንዘብ (Platform Money - Bitcoin)" : "Platform Money (Bitcoin Consensus)",
      tagline: isTi ? "ዋጋ ካብ ሒሳባዊ ውሱንነትን መርበብ ስምምዕን ይመጽእ" : "Value derived from cryptographic consensus & absolute digital scarcity",
      sourceOfValue: isTi ? "ቴርሞዳይናሚክ PoW + ናይ 21M ውሱንነት + ማዕረ ስምምዕ" : "Thermodynamic Proof-of-Work + 21M supply cap + peer-to-peer verification",
      issuance: isTi ? "ኣብ ኮድ ዝተቐርጸ 21 ሚልዮን (ብሓደ ወገን ዘይቅየር)" : "Programmatic, unalterable 21M hard cap with 4-year halvings",
      verifiability: isTi ? "ፍጹም ቀሊል ($50 ዝዋግኡ ኖድ ኣብ ሚሊ-ሰከንድ የረጋግጾ)" : "Instantaneous & free (any $50 mini-PC full node validates consensus)",
      portability: isTi ? "ፍጹም (1 ቢልዮን ዶላር ኣብ ኣእምሮኻ ብ 12 ቃላት ኣብ ዶብ ተሳግር)" : "Infinite (teleport billions over radio, satellite, or internet memory seed)",
      confiscationRisk: isTi ? "ዝተሓተ (ብዘይ ናትካ ብሕታዊ ቁልፊ ዋላ ሓደ ሓይሊ ክወስዶ ኣይኽእልን)" : "Mathematically zero if self-custodied (unseizable without private key)",
      summary: isTi
        ? "ቢትኮይን ሳልሳይ ናይ ታሪኽ ምዕራፍ እዩ። ዋጋኡ ካብ ናይ መንግስቲ ውሳነ ወይ ካብ ፊዚካዊ ማዕድን ዘይኮነስ፡ ካብ ናይ ሒሳብ ሕግን ናይ ኩሎም ተጠቀምቲ ናጻ ስምምዕን ይመጽእ።"
        : "Bitcoin establishes an entirely new monetary paradigm: incorruptible platform money combining gold's scarcity with digital teleportability, verified without masters.",
      icon: Cpu,
      color: "border-orange-500/50 bg-orange-950/30 text-orange-200 ring-1 ring-orange-500/40",
    },
  };

  const IconComp = frameworks[selectedFramework].icon;

  return (
    <div className="my-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-5 sm:p-7 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-100 sm:text-lg">
              {isTi ? "20.0 ማዕቀፋት ገንዘብ (Monetary Frameworks Spectrum)" : "20.0 Monetary Frameworks: Chartalism vs Metallism vs Platform Money"}
            </h3>
            <p className="text-xs text-zinc-400">
              {isTi ? "ገንዘብ ዋጋኡ ካበይ የውጽእ፧ ካብ መንግስቲ፡ ካብ ማዕድን፡ ወይስ ካብ ናጻ መርበብ ስምምዕ፧" : "Deconstructing the root origin of monetary value across three historical paradigms"}
            </p>
          </div>
        </div>
        <span className="rounded-full border border-orange-500/30 bg-orange-950/40 px-2.5 py-0.5 text-xs font-medium text-orange-300">
          {isTi ? "ፍልስፍናዊ መረዳእታ" : "Monetary Philosophy"}
        </span>
      </div>

      {/* Tabs */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(["chartalism", "metallism", "platform"] as const).map((key) => {
          const item = frameworks[key];
          const isSelected = selectedFramework === key;
          const TabIcon = item.icon;
          return (
            <button
              key={key}
              onClick={() => setSelectedFramework(key)}
              className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? "border-orange-500 bg-orange-950/40 text-orange-200 ring-1 ring-orange-500/40 shadow-lg"
                  : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">{item.name.split(" ")[0]}</span>
                <TabIcon className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium leading-snug line-clamp-2">{item.tagline}</span>
            </button>
          );
        })}
      </div>

      {/* Framework Deep Dive Card */}
      <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
              <IconComp className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-zinc-100">
                {frameworks[selectedFramework].name}
              </h4>
              <p className="text-xs text-orange-300/80 font-medium">
                {frameworks[selectedFramework].tagline}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
          {frameworks[selectedFramework].summary}
        </p>

        {/* Property Grid Comparison */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="rounded-lg bg-zinc-950 p-3 border border-zinc-800">
            <span className="text-zinc-500 block mb-1 font-semibold">
              {isTi ? "ምንጪ ዋጋ (Source of Value):" : "Source of Value:"}
            </span>
            <span className="text-zinc-200 font-medium">{frameworks[selectedFramework].sourceOfValue}</span>
          </div>

          <div className="rounded-lg bg-zinc-950 p-3 border border-zinc-800">
            <span className="text-zinc-500 block mb-1 font-semibold">
              {isTi ? "ሕትመት / ቁጽጽር (Issuance Rule):" : "Issuance Rule:"}
            </span>
            <span className="text-zinc-200 font-medium">{frameworks[selectedFramework].issuance}</span>
          </div>

          <div className="rounded-lg bg-zinc-950 p-3 border border-zinc-800">
            <span className="text-zinc-500 block mb-1 font-semibold">
              {isTi ? "ናይ ምርግጋጽ ቀሊልነት (Auditability):" : "Auditability:"}
            </span>
            <span className="text-zinc-200 font-medium">{frameworks[selectedFramework].verifiability}</span>
          </div>

          <div className="rounded-lg bg-zinc-950 p-3 border border-zinc-800">
            <span className="text-zinc-500 block mb-1 font-semibold">
              {isTi ? "ሓደጋ ምምንጣል (Confiscation Risk):" : "Confiscation Risk:"}
            </span>
            <span className="text-zinc-200 font-medium">{frameworks[selectedFramework].confiscationRisk}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MODULE 2: Bitcoin vs bitcoin (Protocol vs Asset)
// -------------------------------------------------------------
function ProtocolVsAssetSection({ isTi }: { isTi: boolean }) {
  const [activeSide, setActiveSide] = useState<"both" | "protocol" | "asset">("both");

  return (
    <div className="my-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-5 sm:p-7 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <Network className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-100 sm:text-lg">
              {isTi ? "20.1 ቢትኮይን ኣንጻር ቢትኮይን (Bitcoin Protocol vs bitcoin Asset)" : "20.1 Bitcoin vs bitcoin: Network vs Asset"}
            </h3>
            <p className="text-xs text-zinc-400">
              {isTi ? "እቲ ዓቢ ፊደል B (መርበብን ፕሮቶኮልን) vs እቲ ንእሽቶ ፊደል b (ንብረትን ኣሃዱን)" : "Distinguishing the neutral communication protocol from the scarce bearer monetary asset"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-xs">
          <button
            onClick={() => setActiveSide("both")}
            className={`px-2.5 py-1 rounded transition ${activeSide === "both" ? "bg-orange-600 text-white font-semibold" : "text-zinc-400"}`}
          >
            {isTi ? "ክልቲኦም" : "Side-by-Side"}
          </button>
          <button
            onClick={() => setActiveSide("protocol")}
            className={`px-2.5 py-1 rounded transition ${activeSide === "protocol" ? "bg-orange-600 text-white font-semibold" : "text-zinc-400"}`}
          >
            Bitcoin (Network)
          </button>
          <button
            onClick={() => setActiveSide("asset")}
            className={`px-2.5 py-1 rounded transition ${activeSide === "asset" ? "bg-orange-600 text-white font-semibold" : "text-zinc-400"}`}
          >
            bitcoin (Asset)
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Bitcoin Protocol */}
        {(activeSide === "both" || activeSide === "protocol") && (
          <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-blue-900/50 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-300 font-bold font-mono text-lg">
                    B
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-blue-200">
                      Bitcoin (Capital "B")
                    </h4>
                    <span className="text-[11px] text-blue-300/80">
                      {isTi ? "እቲ ፕሮቶኮልን መርበብን (The Protocol & Rail)" : "The Protocol, Rules & Network Rail"}
                    </span>
                  </div>
                </div>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-900/60 text-blue-200">
                  Open Standard
                </span>
              </div>

              <p className="mt-3 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {isTi
                  ? "ከምቲ ኢንተርኔት (TCP/IP) ንመልእኽቲ ዘመሓላልፍ፡ Bitcoin ድማ ንዋጋ ብዘይ ሳልሳይ ወገን ዘመሓላልፍ ክፍቲ ናይ ኮምፒዩተር መርበብ ፕሮቶኮል እዩ። ማንም ሰብ ፍቓድ ከይሓተተ ኖድ ከንቀሳቕስ ይኽእል።"
                  : "Like the internet's TCP/IP protocol routes packets of information, Bitcoin is an open neutral communication rail that verifies and clears value globally without permission."}
              </p>

              <div className="mt-4 space-y-2 text-xs">
                <div className="rounded bg-zinc-950/80 p-2.5 border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px] uppercase font-bold">{isTi ? "ቁልፊ ባህርያት፦" : "Core Characteristics:"}</span>
                  <span className="text-zinc-200">
                    {isTi ? "ኖዳት፡ ማይነራት፡ Proof-of-Work፡ ናይ ስምምዕ ሕግታት፡ 99.99%+ ናይ ስራሕ ዕድመ" : "Full Nodes, ASIC miners, PoW difficulty adjustment, 99.998% uptime since 2009"}
                  </span>
                </div>
                <div className="rounded bg-zinc-950/80 p-2.5 border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px] uppercase font-bold">{isTi ? "ዕላማ፦" : "Primary Function:"}</span>
                  <span className="text-zinc-200">
                    {isTi ? "ምግርጫው ዘይብሉ፡ ምቁራጽ ዘይፈልጥ ናይ ዓለም ክፍቲ መርበብ ክፍሊት ምዃን" : "Immutable settlement engine, censorship-resistant timestamping & peer validation"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-blue-900/40 text-[11px] text-blue-300 font-mono">
              Status: Validating new block every ~10 mins
            </div>
          </div>
        )}

        {/* Right: bitcoin Asset */}
        {(activeSide === "both" || activeSide === "asset") && (
          <div className="rounded-xl border border-orange-500/40 bg-orange-950/20 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-orange-900/50 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/20 text-orange-400 font-bold font-mono text-lg">
                    b
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-orange-200">
                      bitcoin (Lowercase "b")
                    </h4>
                    <span className="text-[11px] text-orange-300/80">
                      {isTi ? "እቲ ንብረትን ኣሃዱን (The Bearer Asset & Unit)" : "The Native Digital Asset & Monetary Token"}
                    </span>
                  </div>
                </div>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-orange-900/60 text-orange-200">
                  21,000,000 Cap
                </span>
              </div>

              <p className="mt-3 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {isTi
                  ? "ኣብ ውሽጢ እቲ መርበብ ዝንቀሳቐስ ፍጹም ውሱን ንብረት እዩ። ካብ 21 ሚልዮን ንላዕሊ ፈጺሙ ክፈሪ ዘይክእል፡ ነፍሲ ወከፍ ሳንቲም ድማ ናብ 100 ሚልዮን ሳቶሺ ዝምቀል እዩ።"
                  : "The scarce digital property unit recorded across the UTXO set. Strictly capped at 21M units, each divisible into 100,000,000 satoshis, unencumbered by debt."}
              </p>

              <div className="mt-4 space-y-2 text-xs">
                <div className="rounded bg-zinc-950/80 p-2.5 border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px] uppercase font-bold">{isTi ? "ቁልፊ ባህርያት፦" : "Core Characteristics:"}</span>
                  <span className="text-zinc-200">
                    {isTi ? "ፍጹም ውሱንነት (21M)፡ ፍጹም ዋንነት፡ ዘይሕተት ዕዳ፡ ኣብ ሒሳብ ዝተሰረተ ሓቂ" : "Hard absolute scarcity, self-custodied property right, zero counterparty credit risk"}
                  </span>
                </div>
                <div className="rounded bg-zinc-950/80 p-2.5 border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px] uppercase font-bold">{isTi ? "ዕላማ፦" : "Primary Function:"}</span>
                  <span className="text-zinc-200">
                    {isTi ? "ንውልቀሰባት ካብ ናይ ባጤራ ምብስባስን ግሽበትን መዕቆቢ ምዃን" : "Store of value, hedge against fiat currency devaluation, unseizable generational wealth"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-orange-900/40 text-[11px] text-orange-300 font-mono">
              Cap: 21,000,000.00000000 BTC
            </div>
          </div>
        )}
      </div>

      {/* Synthesis Insight Callout */}
      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
        <p className="text-xs text-zinc-300 leading-relaxed">
          <strong className="text-zinc-100">{isTi ? "ስለምንታይ እዚ ፍልልይ የድሊ፧ " : "Why this distinction matters: "}</strong>
          {isTi
            ? "ናይቲ ንብረት (bitcoin) ዋጋ ኣብ ዕዳጋ ክወርድን ክድይብን ይኽእል እዩ፤ እቲ መርበብ (Bitcoin) ግን ብዘይ ዝኾነ ምቁራጽ ኣብ ነፍሲ ወከፍ 10 ደቒቕ ብሎካት እናረጋገጸ ብቐጻሊ ይሰርሕ። ዋጋ ንብረት ናይ መርበብ ሓቂ ኣይቅይሮን!"
            : "Market exchange price may fluctuate violently, but the Bitcoin protocol ticks rhythmically forward every 10 minutes without central bankers, bailouts, or downtime. The network's architectural integrity is independent of short-term speculative volatility."}
        </p>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MODULE 3: Trust-Minimized Finance & Who Benefits
// -------------------------------------------------------------
function TrustMinimizedBeneficiariesSection({ isTi }: { isTi: boolean }) {
  const [selectedPersona, setSelectedPersona] = useState<number>(0);

  const personas = [
    {
      role: isTi ? "1. ኣብ ትሕቲ ግሽበት ዘሎ ዜጋ (The Hyperinflation Survivor)" : "1. The Hyperinflation Survivor",
      subtitle: isTi ? "ዕቋር ካብ ምብስባስ ባጤራ ምድሓን" : "Protecting purchasing power from local fiat debasement",
      context: isTi
        ? "ናይ ሓያሎ ሃገራት ባጤራ (ከም ናይዚ ቀረባ ግዜ ናይ ኣፍሪቃ ባጤራታት ወይ ሊባኖስ) ኣብ ውሽጢ ውሑዳት ኣዋርሕ 50%–80% ዓቕሙ የጥፍእ።"
        : "Families watching local fiat currencies (Naira, Cedi, Nakfa, Lebanese Pound) lose 50%+ purchasing power over short windows.",
      solution: isTi
        ? "ቢትኮይን መንግስቲ ብሓቂ ክሓትሞ ዘይክእል 21 ሚልዮን ውሱን ስለ ዝኾነ፡ ጻዕሮም ብዘይ ፍርሒ ግሽበት ይዕቅብዎ።"
        : "Bitcoin provides an un-inflatable mathematical life raft with an absolute 21M hard cap, protecting life savings from money printing.",
      icon: TrendingUp,
    },
    {
      role: isTi ? "2. ናይ ዶብ ስግረት ሰራሕተኛ (The Borderless Remittance Sender)" : "2. The Borderless Remittance Worker",
      subtitle: isTi ? "ካብ 10%+ ናይ ደላሎ ክፍሊት ምግልጋል" : "Escaping 8%–15% legacy remittance extraction",
      context: isTi
        ? "ናብ ስድራቤቶም ገንዘብ ዝሰዱ ሰባት ን Western Union ወይ ባንክታት ክሳብ 12% ናይ ኮሚሽን ክፍሊት ይኸፍሉ፡ ንመዓልታት ድማ ይጽበዩ።"
        : "Diaspora workers sending money home to support families, losing painful fees to Western Union and facing days of delays.",
      solution: isTi
        ? "ብላይትኒንግ ኔትዎርክ (Lightning Network) ኣቢሎም ኣብ ውሽጢ ካልኢታት ብዘይ ዝኾነ ዓቢ ክፍሊት ብቐጥታ ናብ ስድራቤቶም ይሰዱ።"
        : "Lightning Network enables instant cross-border settlement for fractions of a penny, delivering 100% of the funds directly to loved ones.",
      icon: Globe2,
    },
    {
      role: isTi ? "3. ባንክ ዘይብሉ ንኣሽቶ ነጋዳይ (The Unbanked Merchant)" : "3. The Unbanked Informal Entrepreneur",
      subtitle: isTi ? "ብዘይ ባንክ ወይ ወረቐት ናጻ ናይ ገንዘብ ኣካውንት" : "Sovereign merchant autonomy without a commercial bank account",
      context: isTi
        ? "ኣብ ዓለም ልዕሊ 1.4 ቢልዮን ሰባት ናይ ባንክ ሕሳብ የብሎምን፤ ባንክታት ንኣሽቱ ሰባት ከገልግሉ ፍቓደኛታት ኣይኮኑን።"
        : "Over 1.4 billion adults lack access to formal banking infrastructure due to lack of documentation, minimum balance fees, or remote geography.",
      solution: isTi
        ? "ብሓደ ተራ ስማርትፎን ጥራይ ብዘይ ፍቓድ ዝኾነ ሰብ ናይ ገዛእ ርእሱ ዓለምለኻዊ ናይ ቢትኮይን ባንክ ይኸውን።"
        : "Any open-source smartphone app turns an individual into their own sovereign bank, accepting global payments instantly with zero paperwork.",
      icon: Users,
    },
    {
      role: isTi ? "4. ናይ ሓሳብ ናጽነት ዝጠልብ ዜጋ (Censorship Defense)" : "4. The Debanked Dissident & Civil Society",
      subtitle: isTi ? "ካብ ፖለቲካዊ ናይ ባንክ ምዕጻው ምክልኻል" : "Protection against political debanking and arbitrary financial freezes",
      context: isTi
        ? "መንግስታት ወይ ባንክታት ንዘይፈተውዎም ሰባት ወይ ጋዜጠኛታት ብኡንብኡ ናይ ባንክ ሕሳቦም ይዓጽውዎ።"
        : "Protesters, human rights activists, and journalists facing frozen bank accounts and state financial deplatforming.",
      solution: isTi
        ? "ቢትኮይን ናይ ምዕጻው መልጎም የብሉን። ንፉዕ ናይ ምዕጻው ስክሪፕት ዘለዎ ወናኒ ብዘይ ፍቓድ ሳንቲሙ ከንቀሳቕስ ይኽእል።"
        : "Bitcoin transactions cannot be censored or halted by any government bureaucrat. It is mathematically impossible to freeze an air-gapped UTXO.",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="my-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-5 sm:p-7 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <HeartHandshake className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-100 sm:text-lg">
              {isTi ? "20.2 እምነት ዝተንከየ ፋይናንስን መን ይጥቀምን (Trust-Minimized Finance & Beneficiaries)" : "20.2 Trust-Minimized Finance & Real-World Beneficiaries"}
            </h3>
            <p className="text-xs text-zinc-400">
              {isTi ? "ቢትኮይን ብሓቂ ንመን እዩ ዘገልግል፧ ካብ መላጋዕቲ ነጻ ዝኾነ ፋይናንስ" : "Moving beyond speculative price narratives to real human sovereignty and inclusion"}
            </p>
          </div>
        </div>
      </div>

      {/* Trust vs Verification Collapsed Pipeline */}
      <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-3">
          {isTi ? "ናይ እምነት ንጣባት ምንጻር (Collapsing Intermediary Trust Layers):" : "Trust-Minimization: Collapsing Counterparty Layers"}
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="rounded-lg bg-zinc-950 p-3.5 border border-rose-900/30">
            <span className="text-rose-400 font-bold block mb-1">
              {isTi ? "ባህላዊ ባንክ፦ 5+ ናይ እምነት ደላሎታት የድልዩ" : "Legacy Banking: 5+ Layers of Counterparty Trust"}
            </span>
            <div className="mt-2 text-zinc-400 font-mono text-[11px] space-y-1">
              <div>1. Central Bank (Prints & Devalues)</div>
              <div>$\rightarrow$ 2. Commercial Bank (Holds custody / Insolvency risk)</div>
              <div>$\rightarrow$ 3. Payment Network (Visa / SWIFT surveillance)</div>
              <div>$\rightarrow$ 4. Clearinghouse (Takes 3–5 days to settle)</div>
              <div>$\rightarrow$ 5. Local Merchant (Risk of chargebacks)</div>
            </div>
          </div>

          <div className="rounded-lg bg-emerald-950/20 p-3.5 border border-emerald-500/40">
            <span className="text-emerald-300 font-bold block mb-1">
              {isTi ? "ቢትኮይን፦ 1 ናጻ ንጣብ (ሒሳባዊ ሓቂ ጥራይ)" : "Bitcoin: 1 Direct Sovereign Layer (Math & Code)"}
            </span>
            <div className="mt-2 text-zinc-300 font-mono text-[11px] space-y-1">
              <div className="text-emerald-400 font-bold">You (Self-Custody Private Key)</div>
              <div>$\longleftrightarrow$ Peer-to-Peer Proof-of-Work Consensus</div>
              <div className="text-emerald-400 font-bold">Recipient (Verified in ~10 mins on-chain)</div>
              <div className="pt-1 text-[10px] text-zinc-400">Zero middlemen. Zero permission required. Zero counterparty default.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Human Persona Beneficiaries */}
      <div className="mt-6 border-t border-zinc-800/80 pt-5">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-3">
          {isTi ? "እቶም ቀንዲ ተጠቀምቲ መን እዮም፧ (Select Impact Profile):" : "Who Benefits Most from Sovereign Bitcoin?"}
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {personas.map((p, idx) => {
            const isSelected = selectedPersona === idx;
            const PIcon = p.icon;
            return (
              <button
                key={idx}
                onClick={() => setSelectedPersona(idx)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? "border-orange-500 bg-orange-950/40 text-orange-200 ring-1 ring-orange-500/40 shadow-md"
                    : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-mono text-xs font-bold">0{idx + 1}</span>
                  <PIcon className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold line-clamp-1">{p.role.split("(")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Persona Detail */}
        <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 sm:p-5">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <h4 className="text-sm sm:text-base font-bold text-zinc-100">
              {personas[selectedPersona].role}
            </h4>
          </div>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg bg-zinc-950 p-3.5 border border-zinc-800">
              <span className="text-xs font-semibold text-rose-400 block mb-1">
                {isTi ? "እቲ ዘሎ ጸገም (Legacy Barrier):" : "The Legacy System Failure:"}
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {personas[selectedPersona].context}
              </p>
            </div>

            <div className="rounded-lg bg-orange-950/20 p-3.5 border border-orange-500/30">
              <span className="text-xs font-semibold text-orange-300 block mb-1">
                {isTi ? "ቢትኮይን ዘምጽኦ ፍታሕ (Bitcoin Liberation):" : "How Bitcoin Solves It:"}
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {personas[selectedPersona].solution}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
