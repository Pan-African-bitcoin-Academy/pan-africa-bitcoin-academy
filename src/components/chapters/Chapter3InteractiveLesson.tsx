"use client";

import { useState, type ReactNode } from "react";

export type Chapter3Module =
  | "inflation_power"
  | "centralized_control"
  | "cantillon_funnel"
  | "crisis_bailout_2008";

type Localized = { en: string; ti: string };

const text = (value: Localized, isTi: boolean) => (isTi ? value.ti : value.en);

const panelClass =
  "rounded-2xl border border-zinc-800 bg-zinc-950/90 p-4 shadow-inner sm:p-6 my-6";
const cardClass =
  "rounded-xl border border-zinc-800 bg-black/40 p-4";
const buttonClass =
  "rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-200 transition-colors hover:border-orange-400/60 hover:bg-orange-500/10";
const selectedButtonClass =
  "rounded-lg border border-orange-400/70 bg-orange-500/15 px-3 py-2 text-sm font-semibold text-orange-100";

function VisualPanel({
  eyebrow,
  title,
  isTi,
  children,
}: {
  eyebrow: Localized;
  title: Localized;
  isTi: boolean;
  children: ReactNode;
}) {
  return (
    <section className={panelClass} aria-label={text(title, isTi)}>
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-400">
          {text(eyebrow, isTi)}
        </p>
        <h4 className="mt-1 text-lg font-bold text-zinc-100 sm:text-xl">
          {text(title, isTi)}
        </h4>
      </div>
      {children}
    </section>
  );
}

/* =========================================================================
   3.1 Inflation & Purchasing Power (Uganda vs Zimbabwe presets)
   ========================================================================= */
function InflationPowerGraphic({ isTi }: { isTi: boolean }) {
  const [scenario, setScenario] = useState<"uganda" | "zimbabwe">("uganda");
  const [sliderYear, setSliderYear] = useState<number>(scenario === "uganda" ? 20 : 3);

  const selectPreset = (type: "uganda" | "zimbabwe") => {
    setScenario(type);
    setSliderYear(type === "uganda" ? 20 : 3);
  };

  // Uganda: ~8% annual depreciation over 30 yrs
  // Zimbabwe: exponential hyperinflation
  const ugandaDecay = Math.max(5, Math.round(100 * Math.pow(0.88, sliderYear)));
  const zimDecay = Math.max(1, Math.round(100 * Math.pow(0.15, sliderYear)));
  const power = scenario === "uganda" ? ugandaDecay : zimDecay;

  return (
    <VisualPanel
      eyebrow={{ en: "Interactive 3.1", ti: "መስተጋብራዊ 3.1" }}
      title={{
        en: "Purchasing Power Decay: Uganda vs. Zimbabwe",
        ti: "ምውዳቕ ናይ ምዕዳግ ዓቕሚ፦ ኡጋንዳ ኣንጻር ዚምባብወ",
      }}
      isTi={isTi}
    >
      <div className="flex gap-2">
        <button
          type="button"
          className={scenario === "uganda" ? selectedButtonClass : buttonClass}
          onClick={() => selectPreset("uganda")}
        >
          🇺🇬 {isTi ? "ኡጋንዳ (ቀጻሊ ምጉዳል ሽልንግ)" : "Uganda (Steady Shilling Decay)"}
        </button>
        <button
          type="button"
          className={scenario === "zimbabwe" ? selectedButtonClass : buttonClass}
          onClick={() => selectPreset("zimbabwe")}
        >
          🇿🇼 {isTi ? "ዚምባብወ (ከቢድ ዝቕባበ - ሃይፐርኢንፍሌሽን)" : "Zimbabwe (Hyperinflation)"}
        </button>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {/* Visual Slider */}
        <div className={cardClass}>
          <label htmlFor="ch3-year-slider" className="block text-sm font-semibold text-zinc-200">
            {isTi ? "ዝሓለፈ ግዜ" : "Timeline"}:{" "}
            <span className="font-mono text-orange-400 font-bold">
              {sliderYear} {isTi ? "ዓመታት" : "Years"}
            </span>
          </label>
          <input
            id="ch3-year-slider"
            type="range"
            min={1}
            max={scenario === "uganda" ? 30 : 5}
            step={1}
            value={sliderYear}
            onChange={(e) => setSliderYear(Number(e.target.value))}
            className="mt-3 w-full accent-orange-500"
          />
          <div className="flex justify-between text-[11px] text-zinc-500">
            <span>{isTi ? "1 ዓመት" : "Year 1"}</span>
            <span>{scenario === "uganda" ? (isTi ? "30 ዓመት" : "30 Years") : (isTi ? "5 ዓመት" : "5 Years")}</span>
          </div>

          <div className="mt-4 rounded border border-zinc-800 bg-zinc-950 p-2 text-xs text-zinc-300">
            {scenario === "uganda" ? (
              <span>
                {isTi
                  ? "ቅድሚ 20 ዓመት: 40,000 UGX → ሕጂ: 4,000,000 UGX ንሓደ ዓይነት ኣቕሓ!"
                  : "20 Years ago: 40,000 UGX → Today: 4,000,000 UGX for the exact same goods."}
              </span>
            ) : (
              <span>
                {isTi
                  ? "ሰባት ሸቐጥ ንምግዛእ ናይ ገንዘብ ዓረብያ ሒዞም ይኸዱ ነይሮም። ዋጋታት ኣብ ሰዓታት ይዕጸፍ!"
                  : "People carried wheelbarrows of paper notes to buy simple bread. Prices doubled within hours."}
              </span>
            )}
          </div>
        </div>

        {/* Goods Display */}
        <div className={`${cardClass} flex flex-col justify-between`}>
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-400">
              {isTi ? "ዝተረፈ ናይ ምግዛእ ዓቕሚ" : "Remaining Purchasing Power"}
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className={`text-4xl font-extrabold font-mono ${power < 20 ? "text-rose-400" : "text-orange-300"}`}>
                {power}%
              </span>
              <span className="text-xs text-zinc-500">
                {isTi ? "(ካብ መበገሲ ዋጋ)" : "(of original value)"}
              </span>
            </div>

            <div className="mt-3">
              <div className="flex justify-between text-xs text-zinc-400">
                <span>{isTi ? "ናይ ምግቢ ዓቕሚ" : "Basket Capacity"}</span>
                <span>{power}/100</span>
              </div>
              <div className="mt-1 h-3.5 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    power > 50 ? "bg-emerald-400" : power > 20 ? "bg-amber-400" : "bg-rose-500"
                  }`}
                  style={{ width: `${power}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-lg border border-orange-500/20 bg-orange-500/5 p-2.5 text-xs text-orange-200">
            <span>{scenario === "uganda" ? "🍞 40,000 UGX ➔ 4,000,000 UGX" : "🛒 1 Loaf = 100 Trillion ZWD"}</span>
            <span className="font-mono text-zinc-400">{isTi ? "ፊያት ዝቕባበ" : "Fiat Inflation"}</span>
          </div>
        </div>
      </div>
    </VisualPanel>
  );
}

/* =========================================================================
   3.2 Centralized Control Pyramid Graphic
   ========================================================================= */
function CentralizedControlGraphic({ isTi }: { isTi: boolean }) {
  const [activeTier, setActiveTier] = useState<"central" | "banks" | "citizens">("central");

  return (
    <VisualPanel
      eyebrow={{ en: "Interactive 3.2", ti: "መስተጋብራዊ 3.2" }}
      title={{
        en: "The Centralized Control Pyramid",
        ti: "ናይ ማእከላይ ቁጽጽር ፒራሚድ",
      }}
      isTi={isTi}
    >
      <div className="grid gap-4 md:grid-cols-3">
        {/* Tier 1: Central Bank */}
        <button
          type="button"
          onClick={() => setActiveTier("central")}
          className={`flex flex-col items-center rounded-xl border p-4 text-center transition-all ${
            activeTier === "central"
              ? "border-red-400 bg-red-950/30 shadow-lg shadow-red-500/10"
              : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
          }`}
        >
          <span className="text-3xl">🏛️</span>
          <span className="mt-2 text-sm font-bold text-red-200">
            {isTi ? "ማእከላይ ባንክን መንግስትን" : "Central Bank & State"}
          </span>
          <span className="mt-1 text-[11px] text-zinc-400">
            {isTi ? "ሕትመት ገንዘብን ወለድን ይውስኑ" : "Decides printing & interest"}
          </span>
        </button>

        {/* Tier 2: Commercial Banks */}
        <button
          type="button"
          onClick={() => setActiveTier("banks")}
          className={`flex flex-col items-center rounded-xl border p-4 text-center transition-all ${
            activeTier === "banks"
              ? "border-amber-400 bg-amber-950/30 shadow-lg shadow-amber-500/10"
              : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
          }`}
        >
          <span className="text-3xl">🏦</span>
          <span className="mt-2 text-sm font-bold text-amber-200">
            {isTi ? "ንግዳዊ ባንክታት" : "Commercial Banks"}
          </span>
          <span className="mt-1 text-[11px] text-zinc-400">
            {isTi ? "ሕሳባት ምዕጻው፡ ክፍሊት ምእካብ" : "Can freeze accounts & limit cash"}
          </span>
        </button>

        {/* Tier 3: Ordinary Citizens */}
        <button
          type="button"
          onClick={() => setActiveTier("citizens")}
          className={`flex flex-col items-center rounded-xl border p-4 text-center transition-all ${
            activeTier === "citizens"
              ? "border-cyan-400 bg-cyan-950/30 shadow-lg shadow-cyan-500/10"
              : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
          }`}
        >
          <span className="text-3xl">👥</span>
          <span className="mt-2 text-sm font-bold text-cyan-200">
            {isTi ? "ተራ ዜጋታት" : "Ordinary Citizens"}
          </span>
          <span className="mt-1 text-[11px] text-zinc-400">
            {isTi ? "ቁጽጽር የብሎምን፡ ጾር ይስከሙ" : "Zero control, bears inflation"}
          </span>
        </button>
      </div>

      {/* Info Card based on activeTier */}
      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
        {activeTier === "central" && (
          <div className="flex items-start gap-3">
            <span className="text-2xl text-red-400">⚠️</span>
            <div>
              <h5 className="font-bold text-red-200">
                {isTi ? "ማእከላይ ሓይሊ፦ ውሳነ ብውሑዳት ሰባት" : "Central Authority: Decisions by the Few"}
              </h5>
              <p className="mt-1 text-xs text-zinc-300 sm:text-sm">
                {isTi
                  ? "ማእከላይ ባንክታት ክንደይ ገንዘብ ከም ዝሕተም፡ ወለድ ክንደይ ከም ዝኸውንን ንመን ዋሕስ ከም ዝወጽእን ይውስኑ። ዜጋታት ኣብዚ ውሳነ እዚ ዝኾነ ድምጺ የብሎምን።"
                  : "A handful of officials decide when to expand the money supply and set interest rates. Citizens have no vote or veto over these decisions."}
              </p>
            </div>
          </div>
        )}
        {activeTier === "banks" && (
          <div className="flex items-start gap-3">
            <span className="text-2xl text-amber-400">🔒</span>
            <div>
              <h5 className="font-bold text-amber-200">
                {isTi ? "መዕገቲ ኣፍደገ፦ ፍቓድ የድሊ" : "The Gatekeepers: Permission Required"}
              </h5>
              <p className="mt-1 text-xs text-zinc-300 sm:text-sm">
                {isTi
                  ? "ባንክታት ሕሳብካ ክዓጽዋ፡ ገደብ ምውጻእ ገንዘብ ክገብራ፡ ወይ ልዑል ክፍሊት ክቖርጻ ይኽእላ። ገንዘብካ ብሓቂ ናትካ ኣይኮነን፤ ናይቲ ባንክ ተስፋ ጥራይ እዩ።"
                  : "Banks can freeze accounts, delay transfers, set daily limits, and charge steep fees. Money inside a bank is a claim check, not sovereign ownership."}
              </p>
            </div>
          </div>
        )}
        {activeTier === "citizens" && (
          <div className="flex items-start gap-3">
            <span className="text-2xl text-cyan-400">📉</span>
            <div>
              <h5 className="font-bold text-cyan-200">
                {isTi ? "ተቐባሊ ጸገም፦ ተራ ሰራሕተኛ" : "The Base: Carrying the Burden"}
              </h5>
              <p className="mt-1 text-xs text-zinc-300 sm:text-sm">
                {isTi
                  ? "መንግስቲ ወይ ባንክታት ኣብ ዝጋገዩሉ እዋን፡ ብዝቕባበን ምውዳቕ ናይ ምግዛእ ዓቕምን ዝሳቐዩ ተራ ዜጋታትን ደቀቕቲ ሸየጥትን እዮም።"
                  : "When leaders over-print to cover debts, ordinary savers, farmers, and wage earners quietly pay the penalty through lost purchasing power."}
              </p>
            </div>
          </div>
        )}
      </div>
    </VisualPanel>
  );
}

/* =========================================================================
   3.3 Cantillon Effect / Inequality Flow (Section 3.3)
   ========================================================================= */
function CantillonFunnelGraphic({ isTi }: { isTi: boolean }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  return (
    <VisualPanel
      eyebrow={{ en: "Interactive 3.3", ti: "መስተጋብራዊ 3.3" }}
      title={{
        en: "The Cantillon Effect: Who Gets the New Money First?",
        ti: "ካንቲዮን ኢፌክት፦ ሓድሽ ገንዘብ ቅድም ንመን ይበጽሕ?",
      }}
      isTi={isTi}
    >
      <div className="flex gap-2">
        <button
          type="button"
          className={step === 1 ? selectedButtonClass : buttonClass}
          onClick={() => setStep(1)}
        >
          {isTi ? "1. ሕትመት 🖨️" : "1. Newly Created Money"}
        </button>
        <button
          type="button"
          className={step === 2 ? selectedButtonClass : buttonClass}
          onClick={() => setStep(2)}
        >
          {isTi ? "2. ባንክታትን ኤሊትን 🏛️" : "2. Banks & Mega-Corps"}
        </button>
        <button
          type="button"
          className={step === 3 ? selectedButtonClass : buttonClass}
          onClick={() => setStep(3)}
        >
          {isTi ? "3. ተራ ሰራሕተኛታት 🛒" : "3. Ordinary Citizens"}
        </button>
      </div>

      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
        {step === 1 && (
          <div className="flex flex-col items-center justify-center text-center p-4">
            <span className="text-4xl animate-bounce">🖨️💵</span>
            <h5 className="mt-2 font-bold text-zinc-100">
              {isTi ? "ሓድሽ ገንዘብ ብማእከላይ ባንክ ይሕተም" : "New Fiat is Injected at the Center"}
            </h5>
            <p className="mt-1 max-w-md text-xs text-zinc-400 sm:text-sm">
              {isTi
                ? "ገንዘብ ኣብ ኩሉ ብማዕረ ኣይተዘርግሐን። እቶም ኣብ ጥቓ እቲ ማእከል ዘለዉ ቅድም ይረኽብዎ።"
                : "Money is never distributed evenly to everyone at the same time. It flows outward in ripples."}
            </p>
          </div>
        )}
        {step === 2 && (
          <div className="flex flex-col items-center justify-center text-center p-4">
            <span className="text-4xl">🏛️📈</span>
            <h5 className="mt-2 font-bold text-emerald-300">
              {isTi ? "ቀዳሞት ተረባሕቲ፦ ቅድሚ ዋጋታት ምውሳኹ ይገዝኡ" : "First Recipients: Spend at Old Prices"}
            </h5>
            <p className="mt-1 max-w-md text-xs text-zinc-300 sm:text-sm">
              {isTi
                ? "ዓበይቲ ባንክታትን ትካላትን ነቲ ሓድሽ ገንዘብ ብትሑት ወለድ ይረኽብዎ፤ ንብረትን ኣክስዮንን ቅድሚ ዋጋ ምውሳኹ ይገዝኡሉ!"
                : "Banks and elite corporations borrow the fresh money first, purchasing real estate and assets before prices rise."}
            </p>
          </div>
        )}
        {step === 3 && (
          <div className="flex flex-col items-center justify-center text-center p-4">
            <span className="text-4xl text-rose-400">🛒📉</span>
            <h5 className="mt-2 font-bold text-rose-300">
              {isTi ? "ናይ መወዳእታ ተቐበልቲ፦ ድሕሪ ዋጋታት ምውሳኹ ይበጽሖም" : "Last Recipients: Facing Higher Prices"}
            </h5>
            <p className="mt-1 max-w-md text-xs text-zinc-300 sm:text-sm">
              {isTi
                ? "እቲ ገንዘብ ናብ ተራ ሰራሕተኛ ክበጽሕ ከሎ፡ ዋጋታት ምግቢ፡ ገዛን ነዳድን ድሮ ወሲኹ ይጸንሖም!"
                : "By the time the new money reaches wage-earners, the cost of food, rent, and fuel has already skyrocketed."}
            </p>
          </div>
        )}
      </div>
    </VisualPanel>
  );
}

/* =========================================================================
   3.5 The 2008 Financial Crisis: Subprime, CDOs, and Bailouts
   ========================================================================= */
function CrisisBailout2008Graphic({ isTi }: { isTi: boolean }) {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0);

  return (
    <VisualPanel
      eyebrow={{ en: "Interactive 3.5", ti: "መስተጋብራዊ 3.5" }}
      title={{
        en: "The 2008 Collapse: Subprime, CDOs & Bailouts",
        ti: "ናይ 2008 ውድቀት፦ ሳብፕራይም፣ CDOsን ምድሓን ባንክታትን",
      }}
      isTi={isTi}
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          type="button"
          className={phase === 0 ? selectedButtonClass : buttonClass}
          onClick={() => setPhase(0)}
        >
          {isTi ? "1. ሳብፕራይም ልቓሕ 🏠" : "1. Subprime Loans"}
        </button>
        <button
          type="button"
          className={phase === 1 ? selectedButtonClass : buttonClass}
          onClick={() => setPhase(1)}
        >
          {isTi ? "2. ምዕሻግ CDO 📦" : "2. CDO Bundling"}
        </button>
        <button
          type="button"
          className={phase === 2 ? selectedButtonClass : buttonClass}
          onClick={() => setPhase(2)}
        >
          {isTi ? "3. ውድቀትን ስንባደን 💥" : "3. Default & Collapse"}
        </button>
        <button
          type="button"
          className={phase === 3 ? selectedButtonClass : buttonClass}
          onClick={() => setPhase(3)}
        >
          {isTi ? "4. ምድሓን ባንክታት 🖨️" : "4. Trillion$ Bailout"}
        </button>
      </div>

      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 p-5">
        {phase === 0 && (
          <div className="space-y-3 text-center">
            <span className="text-4xl">🏠💳</span>
            <h5 className="font-bold text-amber-200">
              {isTi ? "1. ሳብፕራይም ሞርጌጅ (Subprime Mortgages)" : "1. Subprime Mortgages"}
            </h5>
            <p className="mx-auto max-w-lg text-xs text-zinc-300 sm:text-sm">
              {isTi
                ? "ባንክታት ንኽመልስዎ እኹል ኣታዊ ወይ መረጋገጺ ንዘይብሎም ተለቃሕቲ ብዘይ ሓላፍነት ልቓሕ ገዛ ዓደላ።"
                : "Banks issued risky home loans (NINJA loans: No Income, No Job) to buyers who couldn't realistically repay once teaser interest rates jumped."}
            </p>
            <div className="inline-block rounded bg-amber-500/10 px-3 py-1 text-xs font-mono text-amber-300 border border-amber-500/30">
              {isTi ? "ዘይውሑስ ዕዳ ➔ ትሑት ጽሬት" : "Toxic Debt Created"}
            </div>
          </div>
        )}

        {phase === 1 && (
          <div className="space-y-3 text-center">
            <span className="text-4xl">📦🏷️</span>
            <h5 className="font-bold text-cyan-200">
              {isTi ? "2. ምዕሻግ CDO (Collateralized Debt Obligations)" : "2. CDOs & Wall Street Financial Alchemy"}
            </h5>
            <p className="mx-auto max-w-lg text-xs text-zinc-300 sm:text-sm">
              {isTi
                ? "ኢንቨስትመንት ባንክታት ነዞም ሓደገኛታት ልቓሓት ኣኪበን ናብ «CDO» ዝተሰምዩ ፓኬጃት ዓሸጋኦም። ናይ ክረዲት ደረጃ ወሃብቲ (Credit Agencies) ድማ ብሓሶት 'AAA' (ዝለዓለ ውሑስ) ዝብል ማሕተም ሃብኦም!"
                : "Investment banks bundled thousands of toxic subprime mortgages into complex instruments called CDOs, and rating agencies slapped fraudulent 'AAA' ratings on them as if they were safe as US treasuries."}
            </p>
            <div className="inline-block rounded bg-cyan-500/10 px-3 py-1 text-xs font-mono text-cyan-300 border border-cyan-500/30">
              {isTi ? "ሓደገኛ ዕዳ ከም ወርቂ ተመሲሉ ተሸጠ" : "Toxic debt disguised as 'AAA Safe'"}
            </div>
          </div>
        )}

        {phase === 2 && (
          <div className="space-y-3 text-center">
            <span className="text-4xl animate-pulse">📉💣</span>
            <h5 className="font-bold text-rose-300">
              {isTi ? "3. ውድቀት ሰንሰለት (CDS & Lehman Collapse)" : "3. Contagion, CDS & Lehman Collapse"}
            </h5>
            <p className="mx-auto max-w-lg text-xs text-zinc-300 sm:text-sm">
              {isTi
                ? "ተለቃሕቲ ምኽፋል ምስ ኣብዩ፡ ዋጋ CDO ናብ ባዶ ወደቐ። ዓበይቲ ባንክታት (ከም Lehman Brothers) ኣብ ሓደ ለይቲ ፈረሳ፤ ናይ ውሕስነት ትካላት (AIG) ድማ ብሰንኪ Credit Default Swaps (CDS) ተደምሰሳ።"
                : "Borrowers defaulted. CDOs turned worthless. Wall Street titans like Lehman Brothers went bankrupt overnight, while AIG collapsed under trillions in unbacked insurance bets (Credit Default Swaps)."}
            </p>
            <div className="inline-block rounded bg-rose-500/10 px-3 py-1 text-xs font-mono text-rose-300 border border-rose-500/30">
              {isTi ? "ዓለማዊ ልቓሕ ደው በለ" : "Global Interbank Lending Froze"}
            </div>
          </div>
        )}

        {phase === 3 && (
          <div className="space-y-3 text-center">
            <span className="text-4xl">🏛️🖨️</span>
            <h5 className="font-bold text-yellow-300">
              {isTi ? "4. ናይ ትሪልዮናት ዶላር ምድሓን (TARP & Quantitative Easing)" : "4. 'Too Big to Fail' Bailouts & QE"}
            </h5>
            <p className="mx-auto max-w-lg text-xs text-zinc-300 sm:text-sm">
              {isTi
                ? "ማእከላይ ባንክታትን መንግስትን ትሪልዮናት ሓድሽ ዶላር ብምሕታም ነተን ገበነኛታት ባንክታት ኣድሓንወን። ተራ ስድራቤታት ግና ገዛውተንን ዕቋረንን ስኢነን ጾር ተሰኪመን ተረፋ።"
                : "Central banks printed trillions to bail out the reckless banks ('Too Big to Fail'), while ordinary people suffered foreclosures, lost jobs, and inflation."}
            </p>
            <div className="mt-2 inline-block rounded border border-orange-500/40 bg-orange-500/15 px-3 py-1.5 text-xs font-mono font-bold text-orange-200">
              {isTi ? "💡 3 ጥሪ 2009፦ ሳቶሺ ናካሞቶ ቢትኮይን ፈጠረ!" : "💡 Jan 3, 2009: Satoshi Nakamoto mined the Bitcoin Genesis Block!"}
            </div>
          </div>
        )}
      </div>
    </VisualPanel>
  );
}

/* =========================================================================
   Main Chapter 3 Export
   ========================================================================= */
export function Chapter3InteractiveLesson({
  module,
  isTi,
}: {
  module: Chapter3Module;
  isTi: boolean;
}) {
  switch (module) {
    case "inflation_power":
      return <InflationPowerGraphic isTi={isTi} />;
    case "centralized_control":
      return <CentralizedControlGraphic isTi={isTi} />;
    case "cantillon_funnel":
      return <CantillonFunnelGraphic isTi={isTi} />;
    case "crisis_bailout_2008":
      return <CrisisBailout2008Graphic isTi={isTi} />;
  }
}
