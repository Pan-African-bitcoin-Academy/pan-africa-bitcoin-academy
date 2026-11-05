"use client";

import { useState, type ReactNode } from "react";

export type Chapter2Module =
  | "evolution"
  | "barter_commodity"
  | "coinage_aksum"
  | "goldsmith_paper"
  | "fiat_inflation"
  | "assessment";

type Localized = { en: string; ti: string };
type Choice = { label: Localized; correct: boolean };

const text = (value: Localized, isTi: boolean) => (isTi ? value.ti : value.en);

const panelClass =
  "rounded-2xl border border-zinc-800 bg-zinc-950/90 p-4 shadow-inner sm:p-6";
const cardClass =
  "rounded-xl border border-zinc-800 bg-black/40 p-4";
const buttonClass =
  "rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-200 transition-colors hover:border-orange-400/60 hover:bg-orange-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400";
const selectedButtonClass =
  "rounded-lg border border-orange-400/70 bg-orange-500/15 px-3 py-2 text-sm font-semibold text-orange-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400";

function LessonPanel({
  eyebrow,
  title,
  description,
  isTi,
  children,
}: {
  eyebrow: Localized;
  title: Localized;
  description: Localized;
  isTi: boolean;
  children: ReactNode;
}) {
  return (
    <section className={panelClass} aria-label={text(title, isTi)}>
      <div className="mb-5 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-400">
          {text(eyebrow, isTi)}
        </p>
        <h3 className="mt-2 text-xl font-bold text-zinc-50 sm:text-2xl">
          {text(title, isTi)}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-300 sm:text-base">
          {text(description, isTi)}
        </p>
      </div>
      {children}
    </section>
  );
}

function KnowledgeCheck({
  question,
  choices,
  explanation,
  isTi,
}: {
  question: Localized;
  choices: Choice[];
  explanation: Localized;
  isTi: boolean;
}) {
  const [answer, setAnswer] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  return (
    <div className={`${cardClass} mt-5`}>
      <h4 className="font-semibold text-zinc-100">{text(question, isTi)}</h4>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {choices.map((choice, index) => (
          <button
            type="button"
            key={text(choice.label, isTi)}
            aria-pressed={answer === index}
            className={answer === index ? selectedButtonClass : buttonClass}
            onClick={() => {
              setAnswer(index);
              setChecked(false);
            }}
          >
            {text(choice.label, isTi)}
          </button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-zinc-950 hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={answer === null}
          onClick={() => setChecked(true)}
        >
          {isTi ? "መልሲ ኣረጋግጽ" : "Check answer"}
        </button>
        {checked && answer !== null ? (
          <p
            className={`text-sm ${choices[answer].correct ? "text-emerald-300" : "text-amber-200"}`}
            role="status"
          >
            {choices[answer].correct
              ? isTi
                ? "ትኽክለኛ መልሲ! "
                : "That's right! "
              : isTi
                ? "ልክዕ ኣይኮነን። "
                : "Not quite. "}
            {text(explanation, isTi)}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/* =========================================================================
   1. Evolution of Money Interactive Stepper / Graphic
   ========================================================================= */
type Stage = {
  id: string;
  name: Localized;
  era: Localized;
  icon: string;
  problemSolved: Localized;
  newFriction: Localized;
  details: Localized;
  accent: string;
};

const STAGES: Stage[] = [
  {
    id: "barter",
    name: { en: "1. Direct Barter", ti: "1. ቀጥታዊ ባርተር" },
    era: { en: "Ancient Times", ti: "ጥንታዊ እዋን" },
    icon: "🤝",
    problemSolved: {
      en: "Allowed mutual direct trade of surplus goods.",
      ti: "ትርፊ ፍርያት ብቐጥታ ንምልውዋጥ ኣኽኢሉ።",
    },
    newFriction: {
      en: "Double coincidence of wants; perishable items spoil.",
      ti: "ድርብ ምግጥጣም ድሌታት የድሊ፤ ዝበላሾ ኣቕሓ ቀልጢፉ ይሓልቕ።",
    },
    details: {
      en: "Traders spent endless energy seeking partners with matching desires and equal quantities.",
      ti: "ነጋዶ ተመሳሳሊ ድሌትን መጠንን ዘለዎ ሰብ ንምርካብ ነዊሕ ጻዕርን ግዜን የጥፍኡ ነይሮም።",
    },
    accent: "from-amber-600/20 to-orange-600/10 border-amber-500/30",
  },
  {
    id: "commodity",
    name: { en: "2. Commodity Money", ti: "2. ሸቐጣዊ ገንዘብ" },
    era: { en: "9000+ BCE", ti: "9000+ ቅ.ል.ክ" },
    icon: "🐚",
    problemSolved: {
      en: "Commonly accepted items (Cowrie shells, salt, spices) bridged separate trades.",
      ti: "ኩሉ ዝደልዮም ኣቕሑት (ቅርፊት ላም/ሸል፣ ጨው፣ ቅመማት) ንንግዲ ኣተኣሳሲሮም።",
    },
    newFriction: {
      en: "Heavy to haul, hard to standardize quality and measure.",
      ti: "ምስካሙ ከቢድ፣ ጽሬትን መዐቀኒን ንምውሓስ ኣጸጋሚ።",
    },
    details: {
      en: "In Africa, cowrie shells and salt blocks became trusted mediums across long caravan routes.",
      ti: "ኣብ ኣፍሪቃ ሸልን ኣሞለን (ጨው) ኣብ ነዊሕ ናይ ንግዲ ጉዕዞታት እሙናት መለዋወጢ ኮይኖም።",
    },
    accent: "from-cyan-600/20 to-blue-600/10 border-cyan-500/30",
  },
  {
    id: "coins",
    name: { en: "3. Metal Coinage", ti: "3. ሳንቲም ክቡር ሓጺን" },
    era: { en: "600 BCE – 1000 CE", ti: "600 ቅ.ል.ክ – 1000 ድ.ል.ክ" },
    icon: "🪙",
    problemSolved: {
      en: "Standard weight, verifiable purity, high value in small volume (Aksum coins).",
      ti: "ደረጃ ዘለዎ ክብደት፣ ዝረጋገጽ ንጽህና፣ ኣብ ንእሽቶ ቦታ ዝለዓለ ዋጋ (ሳንቲም ኣኽሱም)።",
    },
    newFriction: {
      en: "Heavy for massive trade; targets for robbery and clipping/debasement.",
      ti: "ንዓበይቲ ንግዲ ከቢድ፤ ዕላማ ስርቂን ምቕላስ/ምቕናስ ጽሬት ወርቅን ዝኾነ።",
    },
    details: {
      en: "The Kingdom of Aksum minted gold and silver coins, connecting Red Sea and Mediterranean trade routes.",
      ti: "ንግስነት ኣኽሱም ወርቅን ብሩርን ሳንቲም ብምቕራጽ ንግዲ ቀይሕ ባሕርን ሜዲተራንያንን ኣራኺቡ።",
    },
    accent: "from-yellow-600/20 to-amber-600/10 border-yellow-500/30",
  },
  {
    id: "paper",
    name: { en: "4. Paper / Banknotes", ti: "4. ወረቐት ባንክኖት" },
    era: { en: "7th – 17th Century", ti: "7ይ – 17ይ ክፍለ ዘመን" },
    icon: "📜",
    problemSolved: {
      en: "Lightweight paper receipts backed 1:1 by gold kept safely in vault.",
      ti: "ኣብ ካዝና ብዝተቐመጠ ወርቂ ዝድገፍ ቀሊል ናይ ወረቐት ቅብሊት።",
    },
    newFriction: {
      en: "Temptation of goldsmiths and states to issue more paper than gold held (fractional reserve).",
      ti: "ኣንጠረኛታትን መንግስታትን ካብቲ ዘለዎም ወርቂ ንላዕሊ ወረቐት ናይ ምሕታም ፈተና።",
    },
    details: {
      en: "Traders circulated paper claim checks directly instead of carrying heavy chests of gold.",
      ti: "ነጋዶ ከበድቲ ሳንዱቕ ወርቂ ኣብ ክንዲ ምጽዓን ነቲ ወረቐት ባዕሉ ከም ገንዘብ ኣዘዋዊሮምዎ።",
    },
    accent: "from-emerald-600/20 to-teal-600/10 border-emerald-500/30",
  },
  {
    id: "fiat",
    name: { en: "5. Fiat Currency", ti: "5. ፊያት ባጤራ" },
    era: { en: "1971 – Present", ti: "1971 – ሕጂ" },
    icon: "💵",
    problemSolved: {
      en: "Infinite flexibility for governments to manage liquidity and emergencies.",
      ti: "መንግስታት ንቕልውላዋትን ሃገራዊ ወጻኢታትን ብተዓጻጻፍነት ንምምሕዳር ዘኽኣለ።",
    },
    newFriction: {
      en: "Loss of natural scarcity; purchasing power loss and hyperinflation (e.g. Zimbabwe).",
      ti: "ተፈጥሮኣዊ ዋሕዲ ምስኣን፤ ምውዳቕ ናይ ምግዛእ ዓቕምን ዝቕባበን (ንኣብነት ዚምባብወ)።",
    },
    details: {
      en: "In 1971 the gold link was severed. Money is valued purely by legal decree and state monopoly.",
      ti: "ኣብ 1971 መዐቀኒ ወርቂ ተቛሪጹ። ገንዘብ ብመንግስታዊ ኣዋጅን እምነትን ጥራይ ዋጋ ረኺቡ።",
    },
    accent: "from-red-600/20 to-orange-600/10 border-red-500/30",
  },
  {
    id: "bitcoin",
    name: { en: "6. Digital Sound Money", ti: "6. ዲጂታላዊ ድልዱል ገንዘብ" },
    era: { en: "2009 – Future", ti: "2009 – መጻኢ" },
    icon: "₿",
    problemSolved: {
      en: "Combines scarcity of gold (fixed 21M cap) with digital portability and borderless verifiability.",
      ti: "ዋሕዲ ወርቂ (ቀዋሚ 21 ሚልዮን ደረት) ምስ ዲጂታላዊ ቅልጣፈን ዘይማእከላይ ምርግጋጽን ዘተሓጋገዘ።",
    },
    newFriction: {
      en: "Adoption learning curve, self-custody responsibility, and network infrastructure dependencies.",
      ti: "ናይ ምጥቃም ፍልጠት ምምሃር፣ ናይ ገዛእ ርእስኻ ቁልፊ ምዕቃብን ኢንተርነት ምምርኳስን።",
    },
    details: {
      en: "Bitcoin introduces peer-to-peer electronic cash without a central point of failure or arbitrary printing.",
      ti: "ቢትኮይን ብዘይ ማእከላይ ትካል ወይ ደረት ኣልቦ ሕትመት ካብ ሰብ ናብ ሰብ ዝሰጋገር ዲጂታል ገንዘብ ፈጢሩ።",
    },
    accent: "from-orange-500/25 to-yellow-500/10 border-orange-400/40",
  },
];

function MoneyEvolutionStepper({ isTi }: { isTi: boolean }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeStage = STAGES[activeIdx];

  return (
    <LessonPanel
      eyebrow={{ en: "Interactive Timeline", ti: "መስተጋብራዊ ናይ ግዜ ሰሌዳ" }}
      title={{ en: "The 6 Eras of Monetary Evolution", ti: "እተን 6 መድረኻት ምዕባለ ገንዘብ" }}
      description={{
        en: "Every form of money emerged to fix a breaking point of the previous one. Step through history to see what was gained and what friction remained.",
        ti: "ነፍሲ ወከፍ ዓይነት ገንዘብ ነቲ ናይ ቅድሚኡ ዝነበረ ደረት ንምእላይ እዩ ተፈጢሩ። ኣብ ነፍሲ ወከፍ መድረኽ ጠውቕ እሞ ዝተረኽበ ፍታሕን ዝተረፈ ጸገምን ተመልከት።",
      }}
      isTi={isTi}
    >
      {/* Step buttons */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6" role="tablist">
        {STAGES.map((s, idx) => {
          const isSelected = idx === activeIdx;
          return (
            <button
              type="button"
              key={s.id}
              role="tab"
              aria-selected={isSelected}
              className={`flex flex-col items-center rounded-xl border p-2.5 text-center transition-all ${
                isSelected
                  ? "border-orange-400/80 bg-orange-500/20 shadow-md shadow-orange-500/10"
                  : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900"
              }`}
              onClick={() => setActiveIdx(idx)}
            >
              <span className="text-2xl">{s.icon}</span>
              <span className="mt-1 text-xs font-semibold text-zinc-200">
                {text(s.name, isTi).split(".")[1]?.trim() ?? text(s.name, isTi)}
              </span>
              <span className="text-[10px] text-zinc-500">{text(s.era, isTi)}</span>
            </button>
          );
        })}
      </div>

      {/* Progress Flow bar */}
      <div className="relative mt-5 hidden h-1.5 w-full overflow-hidden rounded-full bg-zinc-800 sm:block">
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 transition-all duration-500"
          style={{ width: `${((activeIdx + 1) / STAGES.length) * 100}%` }}
        />
      </div>

      {/* Active Stage Card */}
      <div
        className={`mt-4 rounded-xl border bg-gradient-to-b p-4 sm:p-6 transition-all ${activeStage.accent}`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{activeStage.icon}</span>
            <div>
              <h4 className="text-lg font-bold text-zinc-100 sm:text-xl">
                {text(activeStage.name, isTi)}
              </h4>
              <p className="text-xs uppercase tracking-wider text-orange-300">
                {text(activeStage.era, isTi)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={buttonClass}
              disabled={activeIdx === 0}
              onClick={() => setActiveIdx((i) => Math.max(0, i - 1))}
            >
              {isTi ? "← ቅድሚት" : "← Previous"}
            </button>
            <button
              type="button"
              className={buttonClass}
              disabled={activeIdx === STAGES.length - 1}
              onClick={() => setActiveIdx((i) => Math.min(STAGES.length - 1, i + 1))}
            >
              {isTi ? "ቀጻሊ →" : "Next →"}
            </button>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-zinc-200 sm:text-base">
          {text(activeStage.details, isTi)}
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-3.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              {isTi ? "✓ ዝተፈትሐ ጸገም" : "✓ What It Solved"}
            </p>
            <p className="mt-1 text-sm text-emerald-100">
              {text(activeStage.problemSolved, isTi)}
            </p>
          </div>
          <div className="rounded-lg border border-rose-500/30 bg-rose-950/20 p-3.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-rose-400">
              {isTi ? "✕ ዝተረፈ ደረት/ጸገም" : "✕ The New Friction"}
            </p>
            <p className="mt-1 text-sm text-rose-100">
              {text(activeStage.newFriction, isTi)}
            </p>
          </div>
        </div>
      </div>
    </LessonPanel>
  );
}

/* =========================================================================
   2. Barter vs Commodity Flow Animation (Section 2.1)
   ========================================================================= */
function BarterVsCommodityGraphic({ isTi }: { isTi: boolean }) {
  const [mode, setMode] = useState<"direct" | "commodity">("direct");

  return (
    <LessonPanel
      eyebrow={{ en: "Section 2.1 Visualizer", ti: "ክፍሊ 2.1 ስእላዊ መግለጺ" }}
      title={{
        en: "The Barter Bottleneck vs. Commodity Liquidity",
        ti: "ናይ ባርተር ዕንክሊል ኣንጻር ናይ ሸቐጥ ቅልጣፈ",
      }}
      description={{
        en: "Toggle between direct barter and commodity money to watch how introducing an accepted intermediary (like cowrie shells or salt) unblocks frozen trade.",
        ti: "ኣብ መንጎ ቀጥታዊ ባርተርን ሸቐጣዊ ገንዘብን ብምቕያር፡ ሓባራዊ መለዋወጢ (ከም ሸል ወይ ጨው) ከመይ ጌሩ ንዝተዓጸወ ንግዲ ከም ዘንቀሳቕሶ ርአ።",
      }}
      isTi={isTi}
    >
      <div className="flex gap-2">
        <button
          type="button"
          className={mode === "direct" ? selectedButtonClass : buttonClass}
          onClick={() => {
            setMode("direct");
          }}
        >
          {isTi ? "🚫 ቀጥታዊ ባርተር (ዕንክሊል)" : "🚫 Direct Barter (Stalled)"}
        </button>
        <button
          type="button"
          className={mode === "commodity" ? selectedButtonClass : buttonClass}
          onClick={() => {
            setMode("commodity");
          }}
        >
          {isTi ? "🐚 ብሸቐጣዊ ገንዘብ (ስሉጥ)" : "🐚 Commodity Intermediary (Flows)"}
        </button>
      </div>

      {/* Visual Canvas */}
      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4 sm:p-6">
        {mode === "direct" ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              {/* Party A */}
              <div className="w-full rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-center md:w-1/3">
                <span className="text-3xl">🌽</span>
                <h5 className="mt-1 font-bold text-amber-200">
                  {isTi ? "ሓረስታይ ዕፉን" : "Maize Farmer"}
                </h5>
                <p className="mt-1 text-xs text-zinc-400">
                  {isTi ? "ዘለዎ፦ 50 ኪሎ ዕፉን" : "Has: 50kg Maize"}
                </p>
                <div className="mt-2 rounded bg-amber-500/20 py-1 text-xs font-semibold text-amber-300">
                  {isTi ? "ዝደልዮ፦ ዓሳ 🐟" : "Wants: Fish 🐟"}
                </div>
              </div>

              {/* Direct Trade Arrow with Conflict */}
              <div className="flex flex-col items-center justify-center text-center">
                <div className="flex items-center gap-2 font-mono text-2xl text-red-400">
                  <span>❌</span>
                  <span className="h-0.5 w-16 bg-red-500/50 sm:w-24"></span>
                  <span>❌</span>
                </div>
                <span className="mt-1 text-xs font-bold uppercase tracking-wider text-rose-400">
                  {isTi ? "ድርብ ምግጥጣም የለን" : "No Mutual Match"}
                </span>
                <span className="text-[11px] text-zinc-400">
                  {isTi
                    ? "እቲ ገፋፍ ዓሳ ዕፉን ኣይደልን!"
                    : "The fisherman already has maize!"}
                </span>
              </div>

              {/* Party B */}
              <div className="w-full rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4 text-center md:w-1/3">
                <span className="text-3xl">🐟</span>
                <h5 className="mt-1 font-bold text-cyan-200">
                  {isTi ? "ገፋፍ ዓሳ" : "Fisherman"}
                </h5>
                <p className="mt-1 text-xs text-zinc-400">
                  {isTi ? "ዘለዎ፦ ትኩስ ዓሳ" : "Has: Fresh Fish"}
                </p>
                <div className="mt-2 rounded bg-cyan-500/20 py-1 text-xs font-semibold text-cyan-300">
                  {isTi ? "ዝደልዮ፦ መሳርሒ ሓጺን ⛏️" : "Wants: Iron Tools ⛏️"}
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-red-500/30 bg-red-950/20 p-3 text-sm text-red-200">
              <strong className="font-semibold text-red-100">
                {isTi ? "ናይ ባርተር ሽግር፦" : "The Barter Problem:"}
              </strong>{" "}
              {isTi
                ? "እቲ ሓረስታይ ዓሳ ክወስድ ኣይከኣለን፣ ምኽንያቱ እቲ ገፋፍ ዓሳ መሳርሒ ሓጺን እምበር ዕፉን ኣይደልን። ዓሳ ድማ ቀልጢፉ ይበላሾ!"
                : "The farmer cannot get fish, because the fisherman wants iron tools, not maize. Meanwhile, the perishable fish spoils!"}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
              {/* Farmer */}
              <div className="w-full rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5 text-center md:w-1/4">
                <span className="text-2xl">🌽</span>
                <h5 className="font-bold text-amber-200">
                  {isTi ? "ሓረስታይ" : "Farmer"}
                </h5>
                <p className="text-[11px] text-zinc-400">
                  {isTi ? "ዕፉን ብሸል ይሸይጥ" : "Sells maize for shells"}
                </p>
              </div>

              {/* Step 1 Arrow */}
              <div className="flex items-center text-orange-400">
                <span className="text-sm font-bold sm:text-base">1. 🌽 ➔</span>
              </div>

              {/* Intermediary Commodity */}
              <div className="w-full rounded-xl border border-orange-400/50 bg-gradient-to-b from-orange-500/20 to-yellow-500/10 p-4 text-center shadow-lg md:w-1/3">
                <span className="text-4xl animate-bounce">🐚</span>
                <h5 className="mt-1 font-bold text-orange-200">
                  {isTi ? "ቅርፊት ላም (ሸል) / ጨው" : "Cowrie Shells / Salt"}
                </h5>
                <span className="inline-block rounded-full bg-orange-500/30 px-2 py-0.5 text-[11px] font-semibold text-orange-100">
                  {isTi ? "ማእከላይ መለዋወጢ" : "Universal Medium"}
                </span>
                <p className="mt-1 text-[11px] text-zinc-300">
                  {isTi
                    ? "ኩሉ ሰብ ስለ ዝቕበሎ ንንግዲ የቕልሎ"
                    : "Universally desired & durable"}
                </p>
              </div>

              {/* Step 2 Arrow */}
              <div className="flex items-center text-orange-400">
                <span className="text-sm font-bold sm:text-base">2. 🐚 ➔ 🐟</span>
              </div>

              {/* Fisherman */}
              <div className="w-full rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-3.5 text-center md:w-1/4">
                <span className="text-2xl">🐟</span>
                <h5 className="font-bold text-cyan-200">
                  {isTi ? "ገፋፍ ዓሳ" : "Fisherman"}
                </h5>
                <p className="text-[11px] text-zinc-400">
                  {isTi ? "ሸል ተቐቢሉ ዓሳ ይህብ" : "Accepts shells, gives fish"}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-3 text-sm text-emerald-200">
              <strong className="font-semibold text-emerald-100">
                {isTi ? "ስሉጥ ፍታሕ፦" : "The Breakthrough:"}
              </strong>{" "}
              {isTi
                ? "እቲ ሓረስታይ ዕፉኑ ብሸል ይሸይጥ፣ ድሕሪኡ በቲ ሸል ካብቲ ገፋፍ ዓሳ ዓሳ ይገዝእ። እቲ ገፋፍ ዓሳ ድማ በቲ ሸል ደሓር መሳርሒ ሓጺን ይገዝእ!"
                : "The farmer exchanges maize for cowrie shells, then purchases fish using the shells. The fisherman later uses those same shells to purchase iron tools!"}
            </div>
          </div>
        )}
      </div>
    </LessonPanel>
  );
}

/* =========================================================================
   3. Coinage & Aksum Interactive Visual (Section 2.2)
   ========================================================================= */
function CoinageAndAksumGraphic({ isTi }: { isTi: boolean }) {
  const [activeTab, setActiveTab] = useState<"aksum" | "salt_vs_coin">("aksum");

  return (
    <LessonPanel
      eyebrow={{ en: "Section 2.2 Explorer", ti: "ክፍሊ 2.2 መጽናዕቲ" }}
      title={{
        en: "African Coinage Innovation: The Kingdom of Aksum",
        ti: "ምህዞ ሳንቲም ኣብ ኣፍሪቃ፦ ንግስነት ኣኽሱም",
      }}
      description={{
        en: "The Kingdom of Aksum (Eritrea and Ethiopia) was one of the first world civilizations to mint standardized gold, silver, and bronze coinage with official royal seals.",
        ti: "ንግስነት ኣኽሱም (ናይ ሎሚ ኤርትራን ኢትዮጵያን) ኣብ ዓለም ናይ ገዛእ ርእሱ ወርቅን ብሩርን ሳንቲም ብወግዓዊ ማሕተም ካብ ዝቐረጹ ቀዳሞት ስልጣነታት ሓደ ነበረ።",
      }}
      isTi={isTi}
    >
      <div className="flex gap-2">
        <button
          type="button"
          className={activeTab === "aksum" ? selectedButtonClass : buttonClass}
          onClick={() => setActiveTab("aksum")}
        >
          {isTi ? "👑 ሳንቲም ኣኽሱምን ኣድማሳዊ ንግድን" : "👑 Aksum Coinage & Trade"}
        </button>
        <button
          type="button"
          className={activeTab === "salt_vs_coin" ? selectedButtonClass : buttonClass}
          onClick={() => setActiveTab("salt_vs_coin")}
        >
          {isTi ? "⚖️ 50 ኪሎ ጨው ኣንጻር ሳንቲም ጁባ" : "⚖️ 50kg Salt vs Pocket of Coins"}
        </button>
      </div>

      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4 sm:p-6">
        {activeTab === "aksum" ? (
          <div className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
            {/* Visual Coin Card */}
            <div className="flex flex-col items-center justify-center rounded-xl border border-yellow-500/40 bg-gradient-to-b from-yellow-500/15 to-amber-950/20 p-6 text-center">
              <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-4 border-yellow-400 bg-gradient-to-tr from-yellow-600 via-amber-400 to-yellow-200 shadow-xl shadow-yellow-500/20">
                <span className="text-4xl">👑</span>
                <div className="absolute -bottom-2 rounded-full bg-zinc-950 px-2 py-0.5 text-[10px] font-bold text-yellow-300 border border-yellow-500/50">
                  AKSUM GOLD
                </div>
              </div>
              <h5 className="mt-4 font-bold text-yellow-100">
                {isTi ? "ሳንቲም ወርቂ ንግስነት ኣኽሱም" : "Aksumite Gold Stater"}
              </h5>
              <p className="mt-1 text-xs text-zinc-300">
                {isTi
                  ? "ክ.ዘ 270 – 600 ድ.ል.ክ (ቀይሕ ባሕሪ)"
                  : "c. 270 – 600 CE (Red Sea Corridor)"}
              </p>
            </div>

            {/* Historical Facts */}
            <div className="space-y-3">
              <h4 className="font-bold text-zinc-100 sm:text-lg">
                {isTi
                  ? "ሳንቲም ኣኽሱም ንምንታይ ዓለማዊ መለክዒ ኮይኑ?"
                  : "Why Aksum Coinage Revolutionized Trade"}
              </h4>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">●</span>
                  <span>
                    <strong className="text-zinc-100">
                      {isTi ? "ውሑስ ክብደት፦" : "Certified Weight:"}
                    </strong>{" "}
                    {isTi
                      ? "ነጋዶ ኣብ ነፍሲ ወከፍ ዕዳጋ ሚዛን ሒዞም ንጽህና ወርቂ ክምርምሩ ኣየድለዮምን።"
                      : "Traders no longer had to carry scales and assaying tools to test raw gold purity."}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">●</span>
                  <span>
                    <strong className="text-zinc-100">
                      {isTi ? "ዓለማዊ ርክብ፦" : "International Reach:"}
                    </strong>{" "}
                    {isTi
                      ? "ካብ ኣዱሊስ (ኤርትራ) ክሳብ ሮማ፣ ህንድን ግብጽን ተቐባልነት ዝነበሮ ዓለምለኻዊ ገንዘብ።"
                      : "Accepted across Adulis port (Eritrea), the Roman Empire, India, and Byzantium."}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">●</span>
                  <span>
                    <strong className="text-zinc-100">
                      {isTi ? "ተንቀሳቓስነት፦" : "Extreme Portability:"}
                    </strong>{" "}
                    {isTi
                      ? "ሓደ ነጋዲ ዓቢ ሃብቲ ኣብ ንእሽቶ ጁባኡ ሒዙ ኣሽሓት ኪሎሜተራት ክጓዓዝ ኣኽኣሎ።"
                      : "Allowed merchants to travel thousands of kilometers carrying enormous wealth safely in one pocket."}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h4 className="font-bold text-zinc-100 sm:text-lg">
              {isTi
                ? "ተንቀሳቓሲነት ምውድዳር፦ ጨው ኣንጻር ሳንቲም"
                : "Portability Comparison: Salt Blocks vs. Gold Coins"}
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🧂</span>
                  <div>
                    <h5 className="font-bold text-zinc-100">
                      {isTi ? "ዕንቅፋት ጨው (ኣሞለ)" : "Commodity Salt Blocks"}
                    </h5>
                    <p className="text-xs text-rose-300">
                      {isTi ? "ከቢድን ዝበላሾን" : "Heavy, Bulky, Moisture Risk"}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-zinc-300 sm:text-sm">
                  {isTi
                    ? "ሓንቲ ላም ንምግዛእ 50 ኪሎ ጨው ብኣድጊ ወይ ብግመል ምጽዓን የድሊ። ዝናብ እንተዘኒቡ ዋጋኡ ይጠፍእ!"
                    : "To buy cattle, you had to haul 50kg of salt blocks on pack mules. If it rained, your savings dissolved!"}
                </p>
              </div>

              <div className="rounded-xl border border-yellow-500/40 bg-yellow-950/20 p-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🪙</span>
                  <div>
                    <h5 className="font-bold text-yellow-200">
                      {isTi ? "ሳንቲም ወርቂ" : "Minted Gold Coins"}
                    </h5>
                    <p className="text-xs text-yellow-300">
                      {isTi ? "ቀሊልን ነባርን" : "Durable, Light & Uniform"}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-zinc-300 sm:text-sm">
                  {isTi
                    ? "ተመሳሳሊ ዋጋ ኣብ ሓንቲ ንእሽቶ ሳንቲም ይኣቱ። ኣይበላሾን፣ ማይ ኣይጎድኦን፣ ንዘመናት ይጸንሕ!"
                    : "The same value fits in a tiny 5-gram coin. Rain cannot destroy it, and it endures for millennia without rotting."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </LessonPanel>
  );
}

/* =========================================================================
   4. Goldsmith Vault to Banknote Simulation (Section 2.3)
   ========================================================================= */
function GoldsmithVaultSimulation({ isTi }: { isTi: boolean }) {
  const [vaultGold, setVaultGold] = useState(10);
  const [paperIssued, setPaperIssued] = useState(10);
  const [bankRun, setBankRun] = useState(false);

  const issueMorePaper = () => {
    setPaperIssued((prev) => prev + 5);
  };

  const triggerRun = () => {
    setBankRun(true);
  };

  const reset = () => {
    setVaultGold(10);
    setPaperIssued(10);
    setBankRun(false);
  };

  const reserveRatio = Math.round((vaultGold / paperIssued) * 100);

  return (
    <LessonPanel
      eyebrow={{ en: "Section 2.3 Simulation", ti: "ክፍሊ 2.3 ሲሙሌሽን" }}
      title={{
        en: "How Gold Receipts Became Paper Banknotes",
        ti: "ቅብሊት ወርቂ ከመይ ጌሩ ናይ ወረቐት ባንክኖት ኮነ",
      }}
      description={{
        en: "Goldsmiths kept heavy gold in safe vaults and issued paper claim checks. When merchants realized they could simply trade the paper receipts, banknotes were born.",
        ti: "ኣንጠረኛታት ወርቂ ንወርቂ ኣብ ድልዱል ካዝና ብምዕቃብ ናይ ወረቐት ቅብሊት ይህቡ ነበሩ። ሰባት ነቲ ወረቐት ንባዕሉ ከም ገንዘብ ክለዋወጡ ምስ ጀመሩ ባንክኖት ተወሊዱ።",
      }}
      isTi={isTi}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {/* Vault Status */}
        <div className={cardClass}>
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <h5 className="font-bold text-zinc-100 flex items-center gap-2">
              <span>🏦</span> {isTi ? "ካዝና ወርቂ (Vault)" : "Gold Vault"}
            </h5>
            <span className="font-mono text-xs text-yellow-400">
              {vaultGold} {isTi ? "ሳንዱቕ ወርቂ" : "Gold Bars"}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {Array.from({ length: vaultGold }).map((_, i) => (
              <span
                key={i}
                className="rounded border border-yellow-500/40 bg-yellow-500/20 px-2 py-1 text-xs font-mono text-yellow-300"
              >
                🧈 GOLD
              </span>
            ))}
          </div>

          <div className="mt-6 border-t border-zinc-800 pt-3">
            <p className="text-xs uppercase tracking-wider text-zinc-400">
              {isTi ? "ናይ ወረቐት ቅብሊት ዝወጸ፦" : "Paper Receipts in Circulation:"}
            </p>
            <p className="text-2xl font-bold text-orange-200">
              {paperIssued} {isTi ? "ወረቐት ኖት" : "Paper Notes"}
            </p>
            <p className="text-xs text-zinc-400">
              {isTi ? "መጠነ-ዕቑር (Reserve Ratio)፦" : "Reserve Backing Ratio:"}{" "}
              <span
                className={`font-bold ${reserveRatio === 100 ? "text-emerald-400" : reserveRatio >= 50 ? "text-amber-400" : "text-rose-400"}`}
              >
                {reserveRatio}%
              </span>
            </p>
          </div>
        </div>

        {/* Goldsmith Actions */}
        <div className={`${cardClass} flex flex-col justify-between`}>
          <div>
            <h5 className="font-bold text-zinc-100">
              {isTi ? "ፈተና ኣንጠረኛ (The Goldsmith's Temptation)" : "Fractional Temptation"}
            </h5>
            <p className="mt-1 text-xs leading-relaxed text-zinc-300 sm:text-sm">
              {isTi
                ? "ወነንቲ ወርቂ ኩሎም ብሓንሳብ ወርቆም ንምውሳድ ከም ዘይመጹ ምስ ረኣዩ፡ ኣንጠረኛታት ካብቲ ዘለዎም ወርቂ ንላዕሊ ወረቐት ኖት ክሓትሙ ጀመሩ!"
                : "Seeing that gold depositors rarely demanded their metal at the same time, goldsmiths began printing more paper notes than they had gold in the vault."}
            </p>
          </div>

          <div className="mt-4 space-y-2">
            <button
              type="button"
              className={`${buttonClass} w-full text-left flex items-center justify-between`}
              onClick={issueMorePaper}
              disabled={bankRun}
            >
              <span>🖨️ {isTi ? "ተወሳኺ 5 ወረቐት ኖት ሕተም" : "Print +5 Paper Notes"}</span>
              <span className="text-xs text-orange-400 font-mono">+5 Notes</span>
            </button>
            <button
              type="button"
              className="w-full rounded-lg border border-red-500/40 bg-red-950/30 px-3 py-2 text-sm font-semibold text-red-200 hover:bg-red-900/40"
              onClick={triggerRun}
              disabled={bankRun}
            >
              🏃‍♂️ {isTi ? "ህዝባዊ ሃለውታ ባንክ ፈትን (Bank Run!)" : "Simulate Bank Run!"}
            </button>
            <button
              type="button"
              className={`${buttonClass} w-full`}
              onClick={reset}
            >
              {isTi ? "ዳግማይ ጀምር" : "Reset Vault"}
            </button>
          </div>
        </div>
      </div>

      {bankRun ? (
        <div className="mt-4 rounded-xl border border-red-500/50 bg-red-950/40 p-4">
          <h5 className="font-bold text-red-100 flex items-center gap-2">
            <span>🚨</span>{" "}
            {isTi ? "ውድቀት ባንክ (Bank Run Collapse)!" : "Bank Run Reality!"}
          </h5>
          <p className="mt-1 text-xs leading-relaxed text-red-200 sm:text-sm">
            {reserveRatio < 100
              ? isTi
                ? `ህዝቢ ወርቁ ንምውሳድ ተሰሪዑ፡ እቲ ካዝና ግን ን${vaultGold} ሰባት ጥራይ ዝኸውን ወርቂ ኣለዎ! እቶም ዝተረፉ ${paperIssued - vaultGold} ወረቐት ሒዞም ጥራሕ እዮም ተሪፎም። እዚ እዩ ድኽመት ፍራክሽናል ሪዘርቭ!`
                : `Depositors rushed to withdraw! The vault only had ${vaultGold} gold bars for ${paperIssued} paper notes! The remaining ${paperIssued - vaultGold} depositors were left holding worthless paper. This is the origin of banking crises!`
              : isTi
                ? "እቲ ካዝና 100% ወርቂ ስለዘለዎ ኩሉ ሰብ ወርቁ ረኺቡ። ምሉእ ዕቑር (Full Reserve) ወትሩ ውሑስ እዩ።"
                : "100% full reserve! Every single note was safely redeemed for real gold."}
          </p>
        </div>
      ) : null}
    </LessonPanel>
  );
}

/* =========================================================================
   5. The 1971 Gold Window Severance (Pre-1971 vs Post-1971) (Section 2.4)
   ========================================================================= */
function GoldStandardSeverance1971({ isTi }: { isTi: boolean }) {
  const [era, setEra] = useState<"pre1971" | "post1971">("pre1971");

  return (
    <LessonPanel
      eyebrow={{ en: "Section 2.4 Historical Pivot", ti: "ክፍሊ 2.4 ታሪኻዊ ለውጢ" }}
      title={{
        en: "1971: The Severing of the Gold Link",
        ti: "1971፦ ምቑራጽ ምትእስሳር ወርቂ",
      }}
      description={{
        en: "In August 1971, the US officially ended the gold standard. Switch between eras to see how money transformed from a gold-backed warehouse receipt into pure fiat (by decree).",
        ti: "ኣብ ነሓሰ 1971 ኣመሪካ መዐቀኒ ወርቂ ብወግዒ ኣቋሪጻቶ። ገንዘብ ብወርቂ ካብ ዝድገፍ ናብ ፊያት (ብኣዋጅ ዝተሰረተ) ከመይ ከም ዝተቐየረ ንምርኣይ ኣብ መንጎ ክልቲኡ እዋን ቀይር።",
      }}
      isTi={isTi}
    >
      {/* Era Toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          className={era === "pre1971" ? selectedButtonClass : buttonClass}
          onClick={() => setEra("pre1971")}
        >
          {isTi ? "🔒 ቅድሚ 1971፦ ብወርቂ ዝተደገፈ" : "🔒 Pre-1971: The Gold Standard"}
        </button>
        <button
          type="button"
          className={era === "post1971" ? selectedButtonClass : buttonClass}
          onClick={() => setEra("post1971")}
        >
          {isTi ? "✂️ ድሕሪ 1971፦ ፊያት (ብኣዋጅ)" : "✂️ Post-1971: Fiat by Decree"}
        </button>
      </div>

      {/* Interactive Visual Canvas */}
      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4 sm:p-6">
        {era === "pre1971" ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              {/* Paper Note */}
              <div className="w-full rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-4 text-center md:w-5/12">
                <span className="text-4xl">📜</span>
                <h5 className="mt-2 font-bold text-emerald-200">
                  {isTi ? "ወግዓዊ ቅብሊት ወርቂ (Gold Certificate)" : "Gold Certificate / Note"}
                </h5>
                <p className="mt-1 text-xs text-zinc-300">
                  {isTi
                    ? "«እዚ ወረቐት ኣብ ዝኾነ እዋን ብወርቂ ይቕየር»"
                    : "\"Redeemable in gold coin on demand\""}
                </p>
                <div className="mt-2 rounded bg-emerald-500/20 py-1 text-xs font-mono font-bold text-emerald-300">
                  $35 = 1 Ounce of Gold
                </div>
              </div>

              {/* Secure Gold Link Chain */}
              <div className="flex flex-col items-center justify-center text-center">
                <div className="flex items-center gap-1 font-mono text-2xl text-yellow-400">
                  <span>⛓️</span>
                  <span className="h-1 w-12 bg-yellow-400/80 sm:w-20"></span>
                  <span>⛓️</span>
                </div>
                <span className="mt-1 text-xs font-bold uppercase tracking-wider text-yellow-300">
                  {isTi ? "1:1 ብወርቂ ዝተኣሳሰረ" : "Physical Gold Link"}
                </span>
                <span className="text-[11px] text-zinc-400">
                  {isTi ? "ቀረብ ብመጠን ወርቂ ይድረት" : "Supply strictly disciplined"}
                </span>
              </div>

              {/* Fort Knox Vault */}
              <div className="w-full rounded-xl border border-yellow-500/40 bg-yellow-950/20 p-4 text-center md:w-5/12">
                <span className="text-4xl">🏦</span>
                <h5 className="mt-2 font-bold text-yellow-200">
                  {isTi ? "ካዝና ወርቂ (Fort Knox Vault)" : "Fort Knox Gold Vault"}
                </h5>
                <p className="mt-1 text-xs text-zinc-300">
                  {isTi
                    ? "ነፍሲ ወከፍ ዶላር ኣብ ካዝና ብዘሎ ወርቂ ይዕቀብ"
                    : "Real physical gold safely stored in vaults"}
                </p>
                <div className="mt-2 rounded bg-yellow-500/20 py-1 text-xs font-mono font-bold text-yellow-300">
                  {isTi ? "ተፈጥሮኣዊ ዋሕዲ" : "Natural Physical Scarcity"}
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-3.5 text-sm text-emerald-200">
              <strong className="font-semibold text-emerald-100">
                {isTi ? "ስርዓት መዐቀኒ ወርቂ፦" : "The Gold Standard Mechanism:"}
              </strong>{" "}
              {isTi
                ? "መንግስታት ዝደለይዎ መጠን ገንዘብ ክሓትሙ ኣይክእሉን ነይሮም፤ ተወሳኺ ገንዘብ ንምሕታም መጀመርታ ተወሳኺ ወርቂ ናብቲ ካዝና ምእካብ የድሊ ነበረ። እዚ ድማ ንዋጋ ገንዘብ ዘተኣማምን ገይርዎ ነበረ።"
                : "Governments could not print unlimited currency. To issue more banknotes, they had to physically acquire and store more gold in the vault. This anchored the value of money in natural physical reality."}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              {/* Fiat Paper Note */}
              <div className="w-full rounded-xl border border-rose-500/40 bg-rose-950/20 p-4 text-center md:w-5/12">
                <span className="text-4xl">💵</span>
                <h5 className="mt-2 font-bold text-rose-200">
                  {isTi ? "ፊያት ኖት (ብኣዋጅ ጥራሕ ዝሰርሕ)" : "Modern Fiat Note"}
                </h5>
                <p className="mt-1 text-xs text-zinc-300">
                  {isTi
                    ? "«እዚ ሕጋዊ ባጤራ እዩ» (ብወርቂ ኣይቕየርን)"
                    : "\"This note is legal tender\" (Unbacked)"}
                </p>
                <div className="mt-2 rounded bg-rose-500/20 py-1 text-xs font-mono font-bold text-rose-300">
                  {isTi ? "ደረት ኣልቦ ሕትመት" : "Unlimited Creation by Decree"}
                </div>
              </div>

              {/* Severed Scissors */}
              <div className="flex flex-col items-center justify-center text-center">
                <div className="flex items-center gap-2 font-mono text-3xl text-rose-400 animate-pulse">
                  <span>✂️</span>
                  <span className="h-0.5 w-12 border-t-2 border-dashed border-rose-500 sm:w-20"></span>
                  <span>💥</span>
                </div>
                <span className="mt-1 text-xs font-bold uppercase tracking-wider text-rose-400">
                  {isTi ? "ምትእስሳር ተቖሪጹ (1971)" : "Gold Link Severed (1971)"}
                </span>
                <span className="text-[11px] text-zinc-400">
                  {isTi ? "«ኒክሰን ሾክ» (Nixon Shock)" : "\"The Nixon Shock\""}
                </span>
              </div>

              {/* Free-Floating Central Bank */}
              <div className="w-full rounded-xl border border-zinc-700 bg-zinc-900/60 p-4 text-center md:w-5/12">
                <span className="text-4xl">🏛️</span>
                <h5 className="mt-2 font-bold text-zinc-200">
                  {isTi ? "ማእከላይ ባንክ (Central Bank)" : "Central Bank Printing"}
                </h5>
                <p className="mt-1 text-xs text-zinc-400">
                  {isTi
                    ? "ብኣዋጅ ገንዘብ ይፍጠር፤ ወርቂ ኣብ ካዝና ምዕቃብ ኣየድልን"
                    : "Money created by policy decision, no gold backing required"}
                </p>
                <div className="mt-2 rounded bg-zinc-800 py-1 text-xs font-mono font-bold text-orange-300">
                  {isTi ? "እምነት ኣብ መንግስቲ ጥራይ" : "Pure Trust in Government"}
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-rose-500/30 bg-rose-950/20 p-3.5 text-sm text-rose-200">
              <strong className="font-semibold text-rose-100">
                {isTi ? "ትርጉም ፊያት፦" : "The Meaning of 'Fiat':"}
              </strong>{" "}
              {isTi
                ? "ፊያት ማለት ብላቲን 'ይኹን' (ብኣዋጅ) ማለት እዩ። ገንዘብ ዋጋ ዘለዎ መንግስታት ከምኡ ስለዝኣወጁ ጥራይ እዩ። እዚ ንመንግስታት ተዓጻጻፍነት እንተሃበ፡ ነቲ ንዘመናት ንገንዘብ ጽኑዕ ዝገበሮ ተፈጥሮኣዊ ዋሕዲ ግን ኣጥፊእዎ።"
                : "Fiat comes from Latin meaning 'let it be done' (by decree). Money no longer represents gold; it holds value simply because governments declare it as legal tender. While flexible for states, it severed money from natural scarcity."}
            </div>
          </div>
        )}
      </div>

      {/* Historical Context Callout */}
      <div className="mt-4 rounded-xl border border-orange-500/30 bg-orange-500/10 p-3.5 text-xs text-orange-200 sm:text-sm">
        💡 <strong className="text-orange-100">{isTi ? "ስለምንታይ እዚ ኣገዳሲ ዝኾነ፦" : "Why This Matters for Bitcoin:"}</strong>{" "}
        {isTi
          ? "ቢትኮይን ዝተፈጥረ ነቲ ድሕሪ 1971 ዝጠፍአ ተፈጥሮኣዊ ዋሕዲ ወርቂ፡ ናብዚ ዘመነ ዲጂታል ብሕጋጋት ማቲማቲክስ (21 ሚልዮን ሳንቲም) ዳግማይ ንምምላስ እዩ።"
          : "Bitcoin was created in 2009 to restore the mathematically enforced scarcity that money lost when the gold standard ended in 1971."}
      </div>
    </LessonPanel>
  );
}

/* =========================================================================
   6. Final Chapter 2 Mastery Assessment
   ========================================================================= */
function Chapter2FinalQuiz({ isTi }: { isTi: boolean }) {
  const questions: {
    question: Localized;
    choices: Choice[];
    explanation: Localized;
  }[] = [
    {
      question: {
        en: "1. What is the fundamental problem of direct barter trade?",
        ti: "1. ናይ ቀጥታዊ ንግዲ ባርተር ቀንዲ መሰረታዊ ጸገም እንታይ እዩ?",
      },
      choices: [
        {
          label: {
            en: "Double coincidence of wants",
            ti: "ድርብ ምግጥጣም ድሌታት ምድላይ",
          },
          correct: true,
        },
        {
          label: {
            en: "Items are too cheap",
            ti: "ኣቕሑ ኣዝዩ ሕሱር ምዃኑ",
          },
          correct: false,
        },
        {
          label: {
            en: "Lack of internet connection",
            ti: "ኢንተርነት ዘይምንባሩ",
          },
          correct: false,
        },
      ],
      explanation: {
        en: "Direct barter stalls unless both traders want each other's specific item at the same time in matching amounts.",
        ti: "ክልቲኦም ነጋዶ ነቲ እቲ ካልእ ዘለዎ ነገር ብሓንሳብ እንተዘይደልዮም ባርተር ይዕገት።",
      },
    },
    {
      question: {
        en: "2. Which historic East African civilization struck internationally traded gold coins centuries ago?",
        ti: "2. ቅድሚ ዘመናት ዓለምለኻዊ ተቐባልነት ዝነበሮም ሳንቲም ወርቂ ዝቐረጸ ምብራቕ ኣፍሪቃዊ ስልጣነ ኣየናይ እዩ?",
      },
      choices: [
        {
          label: {
            en: "The Kingdom of Aksum",
            ti: "ንግስነት ኣኽሱም",
          },
          correct: true,
        },
        {
          label: {
            en: "Ancient Rome",
            ti: "ጥንታዊት ሮማ",
          },
          correct: false,
        },
        {
          label: {
            en: "The Song Dynasty",
            ti: "ስርወ መንግስቲ ሶንግ",
          },
          correct: false,
        },
      ],
      explanation: {
        en: "Aksum (in modern Eritrea & Ethiopia) minted world-renowned gold and silver coins that traded across the Red Sea and Mediterranean.",
        ti: "ኣኽሱም (ኣብ ናይ ሎሚ ኤርትራን ኢትዮጵያን) ዓለምለኻዊ ሳንቲም ወርቅን ብሩርን ዝቐረጸ ኃያል ስልጣነ ነበረ።",
      },
    },
    {
      question: {
        en: "3. What does 'Fiat' mean in the context of fiat currency?",
        ti: "3. ኣብ ፊያት ባጤራ 'ፊያት' ዝብል ቃል እንታይ ማለት እዩ?",
      },
      choices: [
        {
          label: {
            en: "By decree / government declaration",
            ti: "ብኣዋጅ / ብመንግስታዊ ትእዛዝ",
          },
          correct: true,
        },
        {
          label: {
            en: "100% backed by gold in vault",
            ti: "100% ብወርቂ ዝተደገፈ",
          },
          correct: false,
        },
        {
          label: {
            en: "Made out of silver metal",
            ti: "ካብ ብሩር ዝተሰርሐ",
          },
          correct: false,
        },
      ],
      explanation: {
        en: "Fiat is Latin for 'let it be done'—meaning value is declared by law and decree, not backed by physical gold.",
        ti: "ፊያት ማለት ብኣዋጅ ዝተሰረተ እምበር ብኣካላዊ ወርቂ ዝተደገፈ ኣይኮነን።",
      },
    },
  ];

  return (
    <LessonPanel
      eyebrow={{ en: "Knowledge Check", ti: "ናይ ፍልጠት መረጋገጺ" }}
      title={{
        en: "Chapter 2 Mastery Review",
        ti: "ምዕራፍ 2 ፍልጠትካ ገምግም",
      }}
      description={{
        en: "Test your understanding of the journey of money from ancient barter to modern fiat.",
        ti: "ካብ ጥንታዊ ባርተር ክሳብ ዘመናዊ ፊያት ዝነበረ ጉዕዞ ገንዘብ ክሳብ ክንደይ ከም እተረደእካ ፈትን።",
      }}
      isTi={isTi}
    >
      <div className="space-y-6">
        {questions.map((q, idx) => (
          <KnowledgeCheck
            key={idx}
            question={q.question}
            choices={q.choices}
            explanation={q.explanation}
            isTi={isTi}
          />
        ))}
      </div>
    </LessonPanel>
  );
}

/* =========================================================================
   Main Chapter2InteractiveLesson Export
   ========================================================================= */
export function Chapter2InteractiveLesson({
  module,
  isTi,
}: {
  module: Chapter2Module;
  isTi: boolean;
}) {
  switch (module) {
    case "evolution":
      return <MoneyEvolutionStepper isTi={isTi} />;
    case "barter_commodity":
      return <BarterVsCommodityGraphic isTi={isTi} />;
    case "coinage_aksum":
      return <CoinageAndAksumGraphic isTi={isTi} />;
    case "goldsmith_paper":
      return <GoldsmithVaultSimulation isTi={isTi} />;
    case "fiat_inflation":
      return <GoldStandardSeverance1971 isTi={isTi} />;
    case "assessment":
      return <Chapter2FinalQuiz isTi={isTi} />;
  }
}
