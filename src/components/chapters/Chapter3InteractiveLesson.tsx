"use client";

import { useState, type ReactNode } from "react";
import {
  Building2,
  Landmark,
  Users,
  Lock,
  TrendingDown,
  TrendingUp,
  Printer,
  Calculator,
  ShoppingBag,
  Home,
  Package,
  AlertOctagon,
  Flame,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

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
            <div className="flex items-center gap-1.5">
              <ShoppingBag className="h-4 w-4 text-orange-300 shrink-0" />
              <span>{scenario === "uganda" ? "40,000 UGX ➔ 4,000,000 UGX" : "1 Loaf = 100 Trillion ZWD"}</span>
            </div>
            <span className="font-mono text-zinc-400">{isTi ? "ፊያት ዝቕባበ" : "Fiat Inflation"}</span>
          </div>
        </div>
      </div>
    </VisualPanel>
  );
}

/* =========================================================================
   3.2 Centralized Control Pyramid Graphic + Money Supply vs Inflation + Calculator
   ========================================================================= */
function CentralizedControlGraphic({ isTi }: { isTi: boolean }) {
  const [activeTier, setActiveTier] = useState<"central" | "banks" | "citizens">("central");

  // Inflation calculator state
  const [calcPrice, setCalcPrice] = useState<number>(100);
  const [calcRate, setCalcRate] = useState<number>(10);
  const [calcYears, setCalcYears] = useState<number>(10);

  const futurePrice = calcPrice * Math.pow(1 + calcRate / 100, calcYears);
  const purchasingPower = (calcPrice / futurePrice) * 100;

  // Money supply vs inflation scenarios
  const printScenarios = [
    { label: isTi ? "2% ዝቕባበ" : "2% Inflation",  supply: 20, inflation: 20,  supplyColor: "bg-emerald-500", inflColor: "bg-emerald-400", eg: isTi ? "ምቹእ ቁጠባ" : "Healthy economy" },
    { label: isTi ? "10% ዝቕባበ" : "10% Inflation", supply: 45, inflation: 45,  supplyColor: "bg-yellow-500",  inflColor: "bg-yellow-400",  eg: isTi ? "ቀስ ብቀስ ምፍራስ" : "Gradual erosion" },
    { label: isTi ? "50% ዝቕባበ" : "50% Inflation", supply: 72, inflation: 72,  supplyColor: "bg-orange-500",  inflColor: "bg-orange-400",  eg: isTi ? "ቀውሲ ደረጃ" : "Crisis-level" },
    { label: isTi ? "500%+ ዝቕባበ" : "500%+ Inflation", supply: 100, inflation: 100, supplyColor: "bg-rose-600",   inflColor: "bg-rose-500",    eg: isTi ? "ሃይፐርኢንፍሌሽን — ዚምባብዌ" : "Hyperinflation — Zimbabwe" },
  ];

  return (
    <VisualPanel
      eyebrow={{ en: "Interactive 3.2", ti: "መስተጋብራዊ 3.2" }}
      title={{
        en: "The Centralized Control Pyramid",
        ti: "ናይ ማእከላይ ቁጽጽር ፒራሚድ",
      }}
      isTi={isTi}
    >
      {/* ── Pyramid tier cards ── */}
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
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-2.5">
            <Building2 className="h-6 w-6 text-red-300" />
          </div>
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
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5">
            <Landmark className="h-6 w-6 text-amber-300" />
          </div>
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
          <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-2.5">
            <Users className="h-6 w-6 text-cyan-300" />
          </div>
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
            <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
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
            <Lock className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
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
            <TrendingDown className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
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

      {/* ── Money Supply vs Inflation Chart ── */}
      <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/80 p-4">
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-orange-400">
          {isTi ? "ዝያዳ ሕትመት = ዝያዳ ዝቕባበ" : "More Printing = More Inflation"}
        </p>
        <p className="mb-4 text-[11px] text-zinc-400">
          {isTi
            ? "ቀረብ ገንዘብ ምስ ወሰኸ፡ ዋጋታት ብተመሳሳሊ ይወስኹ — ዜጋታት ዝሰርሑሉ ናይ ምግዛእ ዓቕሚ ይቀንስ"
            : "As money supply expands, prices rise proportionally — eroding what your earnings can actually buy"}
        </p>
        <div className="space-y-3">
          {printScenarios.map((s, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-zinc-200">{s.label}</span>
                <span className="text-zinc-500 italic">{s.eg}</span>
              </div>
              {/* Money supply bar */}
              <div className="flex items-center gap-2">
                <span className="w-20 shrink-0 text-right text-[10px] text-zinc-500 flex items-center justify-end gap-1">
                  <Printer className="h-3 w-3" />
                  <span>{isTi ? "ሕትመት" : "Supply"}</span>
                </span>
                <div className="flex-1 rounded-full bg-zinc-800 h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${s.supplyColor}`}
                    style={{ width: `${s.supply}%` }}
                  />
                </div>
              </div>
              {/* Inflation bar */}
              <div className="flex items-center gap-2">
                <span className="w-20 shrink-0 text-right text-[10px] text-zinc-500 flex items-center justify-end gap-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>{isTi ? "ዝቕባበ" : "Inflation"}</span>
                </span>
                <div className="flex-1 rounded-full bg-zinc-800 h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${s.inflColor} opacity-70`}
                    style={{ width: `${s.inflation}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-[11px] text-zinc-500 italic">
          {isTi
            ? "ቀረብ ገንዘብ ምስ ወሰኸ ዝቕባበ ብተመሳሳሊ ይወስኽ — ሕጊ ቁጠባ"
            : "Supply expands → prices expand. This is not coincidence — it is cause and effect."}
        </p>
      </div>

      {/* ── Inflation Calculator ── */}
      <div className="mt-6 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
        <div className="flex items-center gap-1.5 mb-1">
          <Calculator className="h-4 w-4 text-cyan-400" />
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            {isTi ? "ናይ ዝቕባበ ሕሳብ ማሽን" : "Inflation Calculator"}
          </p>
        </div>
        <p className="mb-4 text-[11px] text-zinc-400">
          {isTi
            ? "ሎሚ ዘሎ ዋጋ ኣእቱ — ብዝቕባበ ድሕሪ ዓመታት ክንደይ ከም ዝኸውን ርአ"
            : "Enter a price today — see what it will cost after years of inflation"}
        </p>

        {/* Inputs */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
              {isTi ? "ሎሚ ዋጋ ($)" : "Starting Price ($)"}
            </label>
            <input
              type="number"
              min={1}
              max={1000000}
              value={calcPrice}
              onChange={e => setCalcPrice(Math.max(1, Number(e.target.value)))}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
              {isTi ? "ዓመታዊ ዝቕባበ (%)" : "Annual Inflation Rate (%)"}
            </label>
            <input
              type="number"
              min={0.1}
              max={1000}
              step={0.1}
              value={calcRate}
              onChange={e => setCalcRate(Math.max(0.1, Number(e.target.value)))}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
              {isTi ? "ዓመታት" : "Years"}
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={calcYears}
              onChange={e => setCalcYears(Math.max(1, Number(e.target.value)))}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Formula shown */}
        <div className="mt-3 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-center font-mono text-xs text-zinc-400">
          {isTi
            ? `ዋጋ × (1 + ዝቕባበ%)^ዓመታት = ${calcPrice} × (1 + ${calcRate/100})^${calcYears}`
            : `Price × (1 + rate)^years = ${calcPrice} × (1 + ${calcRate/100})^${calcYears}`}
        </div>

        {/* Result */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-center">
            <p className="text-[11px] text-zinc-400">
              {isTi ? `ድሕሪ ${calcYears} ዓመት ዋጋ` : `Price after ${calcYears} years`}
            </p>
            <p className="mt-1 text-xl font-black text-rose-300">
              ${futurePrice.toFixed(2)}
            </p>
            <p className="text-[10px] text-zinc-500">
              {isTi ? `ካብ $${calcPrice} ወሲኹ` : `Up from $${calcPrice}`}
            </p>
          </div>
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-center">
            <p className="text-[11px] text-zinc-400">
              {isTi ? "ዝተረፈ ናይ ምግዛእ ዓቕሚ" : "Purchasing power remaining"}
            </p>
            <p className="mt-1 text-xl font-black text-emerald-300">
              {purchasingPower.toFixed(1)}%
            </p>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${Math.min(purchasingPower, 100)}%` }}
              />
            </div>
          </div>
        </div>
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
          className={`flex items-center gap-1.5 ${step === 1 ? selectedButtonClass : buttonClass}`}
          onClick={() => setStep(1)}
        >
          <Printer className="h-4 w-4 shrink-0" />
          <span>{isTi ? "1. ሕትመት" : "1. Newly Created Money"}</span>
        </button>
        <button
          type="button"
          className={`flex items-center gap-1.5 ${step === 2 ? selectedButtonClass : buttonClass}`}
          onClick={() => setStep(2)}
        >
          <Building2 className="h-4 w-4 shrink-0" />
          <span>{isTi ? "2. ባንክታትን ኤሊትን" : "2. Banks & Mega-Corps"}</span>
        </button>
        <button
          type="button"
          className={`flex items-center gap-1.5 ${step === 3 ? selectedButtonClass : buttonClass}`}
          onClick={() => setStep(3)}
        >
          <ShoppingBag className="h-4 w-4 shrink-0" />
          <span>{isTi ? "3. ተራ ሰራሕተኛታት" : "3. Ordinary Citizens"}</span>
        </button>
      </div>

      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
        {step === 1 && (
          <div className="flex flex-col items-center justify-center text-center p-4">
            <div className="rounded-2xl border border-zinc-700 bg-zinc-900/80 p-3 mb-2">
              <Printer className="h-10 w-10 text-zinc-300" />
            </div>
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
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 mb-2">
              <Building2 className="h-10 w-10 text-emerald-300" />
            </div>
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
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 mb-2">
              <ShoppingBag className="h-10 w-10 text-rose-300" />
            </div>
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
          className={`flex items-center justify-center gap-1.5 ${phase === 0 ? selectedButtonClass : buttonClass}`}
          onClick={() => setPhase(0)}
        >
          <Home className="h-4 w-4 shrink-0" />
          <span>{isTi ? "1. ሳብፕራይም" : "1. Subprime Loans"}</span>
        </button>
        <button
          type="button"
          className={`flex items-center justify-center gap-1.5 ${phase === 1 ? selectedButtonClass : buttonClass}`}
          onClick={() => setPhase(1)}
        >
          <Package className="h-4 w-4 shrink-0" />
          <span>{isTi ? "2. ምዕሻግ CDO" : "2. CDO Bundling"}</span>
        </button>
        <button
          type="button"
          className={`flex items-center justify-center gap-1.5 ${phase === 2 ? selectedButtonClass : buttonClass}`}
          onClick={() => setPhase(2)}
        >
          <AlertOctagon className="h-4 w-4 shrink-0" />
          <span>{isTi ? "3. ውድቀትን ስንባደን" : "3. Default & Crash"}</span>
        </button>
        <button
          type="button"
          className={`flex items-center justify-center gap-1.5 ${phase === 3 ? selectedButtonClass : buttonClass}`}
          onClick={() => setPhase(3)}
        >
          <Printer className="h-4 w-4 shrink-0" />
          <span>{isTi ? "4. ምድሓን ባንክታት" : "4. Trillion$ Bailout"}</span>
        </button>
      </div>

      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 p-5">
        {phase === 0 && (
          <div className="space-y-3 text-center">
            <div className="inline-block rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 mb-1">
              <Home className="h-8 w-8 text-amber-300 mx-auto" />
            </div>
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
          <div className="space-y-5">
            <h5 className="font-bold text-cyan-200 text-center text-sm sm:text-base">
              {isTi ? "2. ምዕሻግ CDO — ሞርጌጅ ናብ ደረጃታት ብምቅይያር" : "2. CDO Construction — How Mortgages Became 'Safe' Investments"}
            </h5>

            {/* Flow: Mortgages → Bundle → CDO → Tranches */}
            <div className="flex flex-col items-center gap-1">

              {/* Step 1: Mortgages */}
              <div className="w-full max-w-sm rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-center">
                <p className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                  {isTi ? "ደረጃ 1 — ሞርጌጅ (ልቓሕ ገዛ)" : "Step 1 — Subprime Mortgages"}
                </p>
                <p className="mt-1 text-xs text-zinc-300">
                  {isTi
                    ? "ሰባት ዘይክፈሉ ዝኽእሉ ልቓሕ ተዋህቦም (NINJA loans)"
                    : "Thousands of NINJA loans (No Income, No Job, No Assets) issued to unqualified buyers"}
                </p>
                <div className="mt-2 flex flex-wrap justify-center gap-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Home key={i} className="h-4 w-4 text-amber-400/80" />
                  ))}
                </div>
              </div>

              {/* Arrow */}
              <div className="flex flex-col items-center gap-0.5">
                <div className="h-6 w-0.5 bg-gradient-to-b from-amber-500/60 to-cyan-500/60" />
                <span className="text-xs font-bold text-zinc-400">
                  {isTi ? "ኣኺቦም →" : "Bundle →"}
                </span>
                <div className="h-6 w-0.5 bg-gradient-to-b from-cyan-500/60 to-zinc-500/60" />
              </div>

              {/* Step 2: CDO Box */}
              <div className="w-full max-w-sm rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-3 text-center">
                <p className="text-xs font-bold text-cyan-300 uppercase tracking-wide">
                  {isTi ? "ደረጃ 2 — CDO (Collateralized Debt Obligation)" : "Step 2 — CDO Instrument Created"}
                </p>
                <p className="mt-1 text-xs text-zinc-300">
                  {isTi
                    ? "ኩሎም ሓደገኛታት ሞርጌጅ ናብ ሓደ ዓቢ ፓኬጅ ተዋሃሃዱ — ሽዑ ናብ ደረጃታት (tranches) ተኸፈሉ"
                    : "All those risky mortgages pooled together into one complex financial product — then sliced into risk 'tranches'"}
                </p>
              </div>

              {/* Arrow */}
              <div className="flex flex-col items-center gap-0.5">
                <div className="h-6 w-0.5 bg-gradient-to-b from-cyan-500/60 to-green-500/40" />
                <span className="text-xs font-bold text-zinc-400">
                  {isTi ? "ደረጃታት →" : "Slice into tranches →"}
                </span>
                <div className="h-6 w-0.5 bg-gradient-to-b from-green-500/40 to-yellow-500/40" />
              </div>

              {/* Tranches */}
              <div className="w-full max-w-sm space-y-2">

                {/* AAA */}
                <div className="rounded-lg border border-emerald-500/50 bg-emerald-500/10 px-3 py-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-emerald-300">AAA</span>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-200">
                      {isTi ? "ዝለዓለ ደረጃ" : "TOP TRANCHE"}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-300">
                    {isTi
                      ? "\"ብጣዕሚ ውሑስ\" ተባሂሉ ተሸጠ — ናይ US ቦንድ ምስ ዝተመሳሰለ ደረጃ ተዋሃቦ። ኮሌጃትን ፔንሽን ፈንድታትን ዘሕዘናሉ ቦታ!"
                      : "\"Extremely safe\" — given same rating as US Treasury bonds. Pension funds & college endowments bought this believing it was rock-solid. REALITY: still backed by toxic mortgages."}
                  </p>
                </div>

                {/* AA */}
                <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 px-3 py-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-yellow-300">AA</span>
                    <span className="rounded-full bg-yellow-500/20 px-2 py-0.5 text-[10px] font-bold text-yellow-200">
                      {isTi ? "ካልኣይ ደረጃ" : "SENIOR TRANCHE"}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-300">
                    {isTi
                      ? "\"ቅቡል ውሑስ\" ተባሂሉ ተሸጠ — ብቕሉ ዋጋ ዘለዎ ብዝምስልዎ ሞዴል ደረጃ ተዋሃቦ። ሓደ ቁሩብ ሓደጋ ኣለዎ ተባህለ።"
                      : "\"High quality\" rating — slightly more risk admitted, but still investment grade. Banks kept large portions on their own books."}
                  </p>
                </div>

                {/* A */}
                <div className="rounded-lg border border-orange-500/50 bg-orange-500/10 px-3 py-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-orange-300">A</span>
                    <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-[10px] font-bold text-orange-200">
                      {isTi ? "ሳልሳይ ደረጃ" : "MEZZANINE TRANCHE"}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-300">
                    {isTi
                      ? "\"ሓደ ቁሩብ ሓደጋ ኣለዎ\" ተባሂሉ ዝለዓለ ወለድ ተዋሃቦ — ሃብታማት ተወፋርቲ ዝዓድዎ ቦታ።"
                      : "\"Moderate risk\" with higher yield — sold to hedge funds and aggressive investors seeking returns. Still fictitiously rated."}
                  </p>
                </div>

                {/* Equity / Toxic */}
                <div className="rounded-lg border border-rose-600/60 bg-rose-600/10 px-3 py-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-rose-400">BBB / Equity</span>
                    <span className="flex items-center gap-1 rounded-full bg-rose-600/20 px-2 py-0.5 text-[10px] font-bold text-rose-300">
                      <span>{isTi ? "ዝኸፈአ ደረጃ" : "TOXIC BOTTOM"}</span>
                      <Flame className="h-3 w-3 text-rose-400" />
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-300">
                    {isTi
                      ? "\"ዝለዓለ ሓደጋ\" ደረጃ — ፈለማ ዝጠፍእ ቦታ። ብዙሓት ካብ ዓበይቲ ባንክታት (Lehman, Bear Stearns) ንባዕሎም ሒዞሞ ነይሮም!"
                      : "\"High risk\" — first to absorb losses. Ironically, banks like Lehman & Bear Stearns kept this slice on their own balance sheets, hiding the true risk from investors."}
                  </p>
                </div>
              </div>

              {/* Fraud callout */}
              <div className="mt-2 w-full max-w-sm rounded-lg border border-rose-500/40 bg-rose-500/5 px-3 py-2 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-0.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                  <span className="text-[11px] font-bold text-rose-300 uppercase tracking-wide">
                    {isTi ? "ግጭት ረብሓ" : "Conflict of Interest"}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-300">
                  {isTi
                    ? "ናይ ክረዲት ደረጃ ወሃብቲ (Moody's, S&P, Fitch) ብዓበይቲ ባንክታት ዝተኸፈሉ ነይሮም — ስለዚ ሓሶት 'AAA' ደረጃ ሃቡ።"
                    : "Rating agencies (Moody's, S&P, Fitch) were PAID by the same banks whose products they rated — a catastrophic conflict of interest that enabled the fraud."}
                </p>
              </div>
            </div>
          </div>
        )}

        {phase === 2 && (
          <div className="space-y-3 text-center">
            <div className="inline-block rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 mb-1">
              <AlertOctagon className="h-8 w-8 text-rose-400 mx-auto" />
            </div>
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
            <div className="inline-block rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-3 mb-1">
              <Printer className="h-8 w-8 text-yellow-300 mx-auto" />
            </div>
            <h5 className="font-bold text-yellow-300">
              {isTi ? "4. ናይ ትሪልዮናት ዶላር ምድሓን (TARP & Quantitative Easing)" : "4. 'Too Big to Fail' Bailouts & QE"}
            </h5>
            <p className="mx-auto max-w-lg text-xs text-zinc-300 sm:text-sm">
              {isTi
                ? "ማእከላይ ባንክታትን መንግስትን ትሪልዮናት ሓድሽ ዶላር ብምሕታም ነተን ገበነኛታት ባንክታት ኣድሓንወን። ተራ ስድራቤታት ግና ገዛውተንን ዕቋረንን ስኢነን ጾር ተሰኪመን ተረፋ።"
                : "Central banks printed trillions to bail out the reckless banks ('Too Big to Fail'), while ordinary people suffered foreclosures, lost jobs, and inflation."}
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded border border-orange-500/40 bg-orange-500/15 px-3 py-1.5 text-xs font-mono font-bold text-orange-200">
              <Sparkles className="h-4 w-4 shrink-0 text-orange-300" />
              <span>
                {isTi ? "3 ጥሪ 2009፦ ሳቶሺ ናካሞቶ ቢትኮይን ፈጠረ!" : "Jan 3, 2009: Satoshi Nakamoto mined the Bitcoin Genesis Block!"}
              </span>
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
