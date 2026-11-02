"use client";

import { useState, type ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

type Chapter1Module =
  | "barter"
  | "functions"
  | "properties"
  | "comparison"
  | "trust"
  | "everyday"
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
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-300">
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
                ? "ቅኑዕ መልሲ።"
                : "That's right."
              : isTi
                ? "እዚ ኣይኮነን። "
                : "Not quite. "}
            {text(explanation, isTi)}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function Chapter1InteractiveLesson({
  module,
  isTi,
}: {
  module: Chapter1Module;
  isTi: boolean;
}) {
  switch (module) {
    case "barter":
      return <BarterSimulation isTi={isTi} />;
    case "functions":
      return <MoneyFunctions isTi={isTi} />;
    case "properties":
      return <MoneyProperties isTi={isTi} />;
    case "comparison":
      return <MonetaryComparison isTi={isTi} />;
    case "trust":
      return <TrustSimulation isTi={isTi} />;
    case "everyday":
      return <EverydayMoney isTi={isTi} />;
    case "assessment":
      return <FinalAssessment isTi={isTi} />;
  }
}

type Good = "bananas" | "shoes" | "bread" | "maize" | "salt";

const goodLabels: Record<Good, Localized> = {
  bananas: { en: "Bananas", ti: "ባናና" },
  shoes: { en: "Shoes", ti: "ጫማ" },
  bread: { en: "Bread", ti: "ባኒ" },
  maize: { en: "Maize", ti: "ቆሎ" },
  salt: { en: "Salt", ti: "ጨው" },
};

const traders: { name: Localized; has: Good; wants: Good }[] = [
  {
    name: { en: "Baker", ti: "ሰራሕ ባኒ" },
    has: "bread",
    wants: "shoes",
  },
  {
    name: { en: "Shoemaker", ti: "ሰራሕ ጫማ" },
    has: "shoes",
    wants: "bananas",
  },
  {
    name: { en: "Salt seller", ti: "ሸያጢ ጨው" },
    has: "salt",
    wants: "maize",
  },
];

function BarterSimulation({ isTi }: { isTi: boolean }) {
  const [holding, setHolding] = useState<Good>("bananas");
  const [message, setMessage] = useState<Localized | null>(null);
  const [tradeCount, setTradeCount] = useState(0);

  const attemptTrade = (trader: (typeof traders)[number]) => {
    if (trader.wants !== holding) {
      setMessage({
        en: `${text(trader.name, isTi)} has ${text(goodLabels[trader.has], isTi)} but wants ${text(goodLabels[trader.wants], isTi)}. You have ${text(goodLabels[holding], isTi)}, so this trade cannot happen yet.`,
        ti: `${text(trader.name, isTi)}  ${text(goodLabels[trader.has], isTi)} ኣለዎ፣ ${text(goodLabels[trader.wants], isTi)} ግን ይደሊ። ንስኻ ${text(goodLabels[holding], isTi)} ኣለካ፣ ስለዚ እቲ ምልውዋጥ ገና ኣይከኣልን።`,
      });
      return;
    }

    setHolding(trader.has);
    setTradeCount((count) => count + 1);
    setMessage({
      en: `Trade successful: you exchanged ${text(goodLabels[holding], isTi)} for ${text(goodLabels[trader.has], isTi)}. You now have ${text(goodLabels[trader.has], isTi)}.`,
      ti: `ምልውዋጥ ተሳሊጡ፦ ${text(goodLabels[holding], isTi)} ብ${text(goodLabels[trader.has], isTi)} ቀይርካ። ሕጂ ${text(goodLabels[trader.has], isTi)} ኣለካ።`,
    });
  };

  const completed = holding === "bread";

  return (
    <LessonPanel
      eyebrow={{ en: "Explore 01 · Barter", ti: "ምርምር 01 · ባርተር" }}
      title={{ en: "Can you trade your way to bread?", ti: "ክሳብ ባኒ ብምልውዋጥ ክትበጽሕ ትኽእል?" }}
      description={{
        en: "You have bananas and want bread. Choose a trader and offer what you currently hold. A direct barter succeeds only when each side wants what the other offers.",
        ti: "ባናና ኣለካ፣ ባኒ ድማ ትደሊ። ነቲ እትሕዞ ዘለኻ ነገር ኣቕርብ። ቀጥታዊ ምልውዋጥ ክልቲኦም ወገናት ነቲ እቲ ካልእ ዘቕርቦ ምስ ዝደልዩ ጥራይ ይሳለጥ።",
      }}
      isTi={isTi}
    >
      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className={`${cardClass} flex flex-col justify-between`}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              {isTi ? "ኣብ ኢድካ ዘሎ" : "You currently have"}
            </p>
            <p className="mt-2 text-2xl font-bold text-orange-200">
              {text(goodLabels[holding], isTi)}
            </p>
            <p className="mt-1 text-sm text-zinc-300">
              {isTi ? "ዝደልዮ፦ ባኒ" : "You want: Bread"}
            </p>
          </div>
          <svg
            aria-hidden="true"
            viewBox="0 0 320 74"
            className="mt-6 h-16 w-full"
          >
            <path d="M8 37h270" stroke="#52525b" strokeWidth="2" strokeDasharray="5 6" />
            <path d="m268 27 12 10-12 10" fill="none" stroke="#f97602" strokeWidth="3" />
            <circle cx="22" cy="37" r="13" fill="#f97602" />
            <circle cx="294" cy="37" r="13" fill={completed ? "#34d399" : "#27272a"} />
            <text x="22" y="41" textAnchor="middle" fill="#18181b" fontSize="11" fontWeight="700">1</text>
            <text x="294" y="41" textAnchor="middle" fill="#f4f4f5" fontSize="11" fontWeight="700">2</text>
          </svg>
          <p className="mt-2 text-xs text-zinc-400">
            {isTi ? "ምልውዋጥ ዝተፈጸመ፦" : "Trades completed:"} {tradeCount}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {traders.map((trader) => {
            const canTrade = trader.wants === holding;
            return (
              <article key={text(trader.name, isTi)} className={`${cardClass} flex flex-col`}>
                <h4 className="font-bold text-zinc-100">{text(trader.name, isTi)}</h4>
                <dl className="mt-3 space-y-2 text-sm">
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-zinc-500">{isTi ? "ዘለዎ" : "Has"}</dt>
                    <dd className="text-zinc-200">{text(goodLabels[trader.has], isTi)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-zinc-500">{isTi ? "ዝደልዮ" : "Wants"}</dt>
                    <dd className="text-zinc-200">{text(goodLabels[trader.wants], isTi)}</dd>
                  </div>
                </dl>
                <button
                  type="button"
                  className={`${canTrade ? selectedButtonClass : buttonClass} mt-auto w-full`}
                  onClick={() => attemptTrade(trader)}
                >
                  {isTi ? "ምልውዋጥ ፈትን" : "Try this trade"}
                </button>
              </article>
            );
          })}
        </div>
      </div>

      {message ? (
        <p className="mt-4 rounded-lg border border-cyan-400/20 bg-cyan-500/5 p-3 text-sm text-cyan-100" role="status">
          {text(message, isTi)}
        </p>
      ) : null}
      {completed ? (
        <div className="mt-4 rounded-xl border border-emerald-400/30 bg-emerald-500/5 p-4">
          <p className="font-semibold text-emerald-200">
            {isTi ? "ባኒ ረኺብካ!" : "You got the bread!"}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-zinc-300">
            {isTi
              ? "ቅድሚ ባኒ ምርካብካ ክልተ ዝሰማማዕ ሸረኽቲ ረኺብካ። ገንዘብ ኣብ መንጎ ክልተ ሸረኽቲ ብቐጥታ ክትራኸብ ኣየድልየካን፤ ምስ ዝተፈላለዩ ሰባት ብተመሳሳሊ መለክዒ ክትሸይጥን ክትገዝእን የኽእለካ።"
              : "You had to find two compatible traders before getting bread. Money can remove the need to match directly with each seller: you can sell to one person and later use the same commonly accepted medium with another."}
          </p>
        </div>
      ) : null}
      <KnowledgeCheck
        isTi={isTi}
        question={{ en: "The baker wants shoes, while you have bananas. What must happen for a direct barter with the baker?", ti: "ሰራሕ ባኒ ጫማ ይደሊ፣ ንስኻ ግን ባናና ኣለካ። ቀጥታዊ ምልውዋጥ ንምፍጻም እንታይ ክኸውን ኣለዎ?" }}
        choices={[
          { label: { en: "You first find shoes the baker wants", ti: "መጀመርታ እቲ ሰራሕ ባኒ ዝደልዮ ጫማ ትረክብ" }, correct: true },
          { label: { en: "The baker must accept any good", ti: "እቲ ሰራሕ ባኒ ዝኾነ ኣቕሓ ክቕበል ኣለዎ" }, correct: false },
          { label: { en: "The number of traders does not matter", ti: "ብዝሒ ነጋዶ ኣገዳሲ ኣይኮነን" }, correct: false },
        ]}
        explanation={{ en: "The direct swap needs the baker to want what you offer; an intermediate trade may be needed first.", ti: "እቲ ቀጥታዊ ምልውዋጥ ሰራሕ ባኒ ነቲ እተቕርቦ ክደሊ ይጠልብ፤ ቅድሚኡ መእተዊ ምልውዋጥ ከድሊ ይኽእል።" }}
      />
      <button
        type="button"
        className={`${buttonClass} mt-4`}
        onClick={() => {
          setHolding("bananas");
          setMessage(null);
          setTradeCount(0);
        }}
      >
        {isTi ? "እንደገና ጀምር" : "Restart simulation"}
      </button>
    </LessonPanel>
  );
}

type MoneyFunction = "exchange" | "store" | "account";

const functionTabs: { id: MoneyFunction; label: Localized }[] = [
  { id: "exchange", label: { en: "Medium of exchange", ti: "ማእከላይ መለዋወጢ" } },
  { id: "store", label: { en: "Store of value", ti: "መዕቆሪ ሃብቲ" } },
  { id: "account", label: { en: "Unit of account", ti: "መለክዒ ሕሳብ" } },
];

function MoneyFunctions({ isTi }: { isTi: boolean }) {
  const [active, setActive] = useState<MoneyFunction>("exchange");
  const [priceRise, setPriceRise] = useState(0);
  const basketsNow = 50 / 10;
  const basketsLater = basketsNow / (1 + priceRise / 100);
  const purchasingPower = 100 / (1 + priceRise / 100);

  return (
    <LessonPanel
      eyebrow={{ en: "Explore 02 · Functions", ti: "ምርምር 02 · ተግባራት" }}
      title={{ en: "Three jobs money can do", ti: "ገንዘብ ዝፍጽሞም ሰለስተ ተግባራት" }}
      description={{
        en: "A thing may serve one monetary function well and another less well. Explore each function and decide what it helps people do.",
        ti: "ሓደ ነገር ሓደ ተግባር ገንዘብ ብጽቡቕ ክፍጽም እንከሎ ካልእ ድማ ብውሑድ ክፍጽም ይኽእል። ነፍሲ ወከፍ ተግባር መርምር።",
      }}
      isTi={isTi}
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label={isTi ? "ተግባራት ገንዘብ" : "Functions of money"}>
        {functionTabs.map((tab) => (
          <button
            type="button"
            key={tab.id}
            aria-pressed={active === tab.id}
            className={active === tab.id ? selectedButtonClass : buttonClass}
            onClick={() => setActive(tab.id)}
          >
            {text(tab.label, isTi)}
          </button>
        ))}
      </div>

      {active === "exchange" ? (
        <div className="mt-4">
          <div className={`${cardClass} grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center`}>
            <div className="rounded-lg border border-zinc-700 p-3 text-center">
              <p className="text-xs uppercase tracking-wide text-zinc-500">{isTi ? "ሸጣይ" : "You sell"}</p>
              <p className="mt-1 font-semibold text-zinc-100">{isTi ? "ቆሎ" : "Maize"}</p>
            </div>
            <span aria-hidden="true" className="text-center text-xl text-orange-300">→</span>
            <div className="rounded-lg border border-orange-400/30 bg-orange-500/5 p-3 text-center">
              <p className="text-xs uppercase tracking-wide text-orange-200">{isTi ? "ተጠቒምካ" : "You receive"}</p>
              <p className="mt-1 font-semibold text-zinc-100">Nakfa</p>
            </div>
            <span aria-hidden="true" className="text-center text-xl text-orange-300">→</span>
            <div className="rounded-lg border border-zinc-700 p-3 text-center">
              <p className="text-xs uppercase tracking-wide text-zinc-500">{isTi ? "ድሒርካ ትገዝእ" : "You later buy"}</p>
              <p className="mt-1 font-semibold text-zinc-100">{isTi ? "ኣየርታይም" : "Airtime"}</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-zinc-300">
            {isTi
              ? "ኣብ ኤርትራ፡ ኣብ ዕዳጋ ዝሸጥካዮ ፍርያት ብናቕፋ ክትቅይሮ፣ ድሒርካ ኣየርታይም ክትገዝእ ትኽእል። ኣብ ሓደ ምስ ዝሸጥካሉ ሰብ ኣየርታይም ክህሉ ኣየድልየካን።"
              : "For example, in Eritrea you could sell produce for Nakfa and later buy airtime. The person who buys your produce does not need to be the airtime seller."}
          </p>
          <KnowledgeCheck
            key="exchange"
            isTi={isTi}
            question={{ en: "Which function is at work when Nakfa bridges two separate trades?", ti: "ናቕፋ ኣብ መንጎ ክልተ ዝተፈላለዩ ንግዲ እንታይ ተግባር ይፍጽም?" }}
            choices={[
              { label: { en: "Medium of exchange", ti: "ማእከላይ መለዋወጢ" }, correct: true },
              { label: { en: "Unit of account", ti: "መለክዒ ሕሳብ" }, correct: false },
              { label: { en: "Durability", ti: "ጽንዓት" }, correct: false },
            ]}
            explanation={{ en: "The money is used to pay for goods and services between separate trades.", ti: "ገንዘብ ኣብ መንጎ ዝተፈላለዩ ንግዲ ንኣቕሑን ኣገልግሎትን ንምኽፋል ይጥቀመሉ።" }}
          />
        </div>
      ) : null}

      {active === "store" ? (
        <div className="mt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className={cardClass}>
              <label htmlFor="chapter1-price-rise" className="font-semibold text-zinc-100">
                {isTi ? "ለውጢ ዋጋታት ኣብዚ ምሳሌ" : "Change the price level in this example"}
              </label>
              <p className="mt-1 text-sm text-zinc-400">
                {isTi ? "ዋጋታት እቲ ምሳሌ ክንደይ ይዓብዩ?" : "How much do the example prices rise?"}
              </p>
              <input
                id="chapter1-price-rise"
                type="range"
                min="0"
                max="200"
                step="10"
                value={priceRise}
                onChange={(event) => setPriceRise(Number(event.target.value))}
                className="mt-5 w-full accent-[#F97602]"
                aria-valuetext={`${priceRise}%`}
              />
              <div className="mt-1 flex justify-between text-xs text-zinc-500">
                <span>0%</span><span>+100%</span><span>+200%</span>
              </div>
              <p className="mt-3 text-sm text-zinc-300">
                {isTi ? "ምሳሌ እዩ እምበር ግምት ወይ ትንበያ ኣይኮነን።" : "Illustrative values only; not a forecast."}
              </p>
            </div>
            <div className={`${cardClass} flex flex-col justify-center`}>
              <p className="text-xs uppercase tracking-wide text-zinc-500">
                {isTi ? "ውሱን ሃብቲ" : "Fixed savings"}
              </p>
              <p className="mt-1 text-2xl font-bold text-orange-200">50 Nakfa</p>
              <p className="mt-3 text-sm text-zinc-300">
                {isTi ? "እቲ ምሳሌ ሓደ መሶብ ምግቢ 10 ናቕፋ ከም ዝኾነ ይግምት።" : "Assume one example food basket costs 10 Nakfa today."}
              </p>
              <div className="mt-4">
                <div className="flex justify-between gap-2 text-xs text-zinc-400">
                  <span>{isTi ? "ሎሚ፦ 5 መሶብ" : `Today: ${basketsNow.toFixed(1)} baskets`}</span>
                  <span>{isTi ? `ድሒሩ፦ ${basketsLater.toFixed(1)} መሶብ` : `Later: ${basketsLater.toFixed(1)} baskets`}</span>
                </div>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-zinc-800" aria-label={isTi ? "ናይ ምግዛእ ዓቕሚ" : "Purchasing power"}>
                  <div className="h-full rounded-full bg-orange-400 transition-[width]" style={{ width: `${purchasingPower}%` }} />
                </div>
                <p className="mt-2 text-sm text-zinc-300">
                  {isTi ? "ኣብዚ ምሳሌ ናይ ምግዛእ ዓቕሚ ለውጢ፦" : "Purchasing power in this example:"} {purchasingPower.toFixed(0)}%
                </p>
              </div>
            </div>
          </div>
          <KnowledgeCheck
            key="store"
            isTi={isTi}
            question={{ en: "If the same savings buy fewer baskets later, what changed?", ti: "ተመሳሳሊ ሃብቲ ድሒሩ ውሑድ መሶብ እንተገዚኡ፡ እንታይ ተለዊጡ?" }}
            choices={[
              { label: { en: "Its purchasing power fell in this example", ti: "ኣብዚ ምሳሌ ናይ ምግዛእ ዓቕሙ ኣንቆልቊሉ" }, correct: true },
              { label: { en: "The amount of money automatically increased", ti: "መጠን ገንዘብ ብኣውቶማቲክ ወሲኹ" }, correct: false },
              { label: { en: "The money became a unit of account", ti: "ገንዘብ መለክዒ ሕሳብ ኮይኑ" }, correct: false },
            ]}
            explanation={{ en: "The balance stayed fixed while the example price level rose, so it buys fewer baskets.", ti: "እቲ ሃብቲ ከይተለወጠ ዋጋታት ስለ ዝወሰኹ፡ ውሑድ መሶብ ይገዝእ።" }}
          />
        </div>
      ) : null}

      {active === "account" ? (
        <div className="mt-4">
          <div className={cardClass}>
            <h4 className="font-semibold text-zinc-100">
              {isTi ? "ንግዲ ምስ ሓደ መለክዒ ዋጋ" : "Prices with a shared measuring unit"}
            </h4>
            <p className="mt-1 text-sm text-zinc-400">
              {isTi ? "ኣብዚ ምሳሌ ዘለዉ ዋጋታት ጥራይ ንመምሃሪ ዝተመርጹ እዮም።" : "These example prices are illustrative, not market quotes."}
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {[
                { item: isTi ? "እንጀራ" : "Food", price: "Nakfa 4,000" },
                { item: isTi ? "ትራንስፖርት" : "Transport", price: "Nakfa 2,500" },
                { item: isTi ? "ኣየርታይም" : "Airtime", price: "Nakfa 1,000" },
              ].map((price) => (
                <div key={price.item} className="flex items-center justify-between gap-2 rounded-lg border border-zinc-800 px-3 py-2">
                  <span className="text-zinc-200">{price.item}</span>
                  <span className="font-mono text-sm text-orange-200">{price.price}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-zinc-300">
              {isTi
                ? "ሓደ መለክዒ ዋጋ ኣቕሑ ከተወዳድርን በጀት ከተውጽእን የኽእለካ።"
                : "A shared unit lets people compare prices and plan a budget without converting each item into quantities of other goods."}
            </p>
          </div>
          <KnowledgeCheck
            key="account"
            isTi={isTi}
            question={{ en: "What function is used when a family compares food and transport prices in Nakfa?", ti: "ስድራ ዋጋ ምግብን ትራንስፖርትን ብናቕፋ እንተኣወዳደረት እንታይ ተግባር ትጥቀም?" }}
            choices={[
              { label: { en: "Unit of account", ti: "መለክዒ ሕሳብ" }, correct: true },
              { label: { en: "Medium of exchange", ti: "ማእከላይ መለዋወጢ" }, correct: false },
              { label: { en: "Scarcity", ti: "ዋሕዲ" }, correct: false },
            ]}
            explanation={{ en: "The shared unit makes different prices directly comparable.", ti: "እቲ ሓባራዊ መለክዒ ዝተፈላለዩ ዋጋታት ቀጥታ ከተወዳድር የኽእለካ።" }}
          />
        </div>
      ) : null}
    </LessonPanel>
  );
}

type MoneyAsset = "gold" | "paper" | "salt" | "maize" | "bitcoin";
type Property = "durability" | "portability" | "divisibility" | "recognizability" | "scarcity";

const assets: { id: MoneyAsset; label: Localized }[] = [
  { id: "gold", label: { en: "Gold", ti: "ወርቂ" } },
  { id: "paper", label: { en: "Paper currency", ti: "ወረቐት ገንዘብ" } },
  { id: "salt", label: { en: "Salt", ti: "ጨው" } },
  { id: "maize", label: { en: "Maize", ti: "ቆሎ" } },
  { id: "bitcoin", label: { en: "Bitcoin", ti: "ቢትኮይን" } },
];

const properties: { id: Property; label: Localized }[] = [
  { id: "durability", label: { en: "Durability", ti: "ጽንዓት" } },
  { id: "portability", label: { en: "Portability", ti: "ተንቀሳቓሲነት" } },
  { id: "divisibility", label: { en: "Divisibility", ti: "ምክፍፋል" } },
  { id: "recognizability", label: { en: "Recognizability", ti: "ምልላይ" } },
  { id: "scarcity", label: { en: "Scarcity", ti: "ዋሕዲ" } },
];

const propertyNotes: Record<MoneyAsset, Record<Property, Localized>> = {
  gold: {
    durability: { en: "Resists corrosion and can last for generations; storage, theft, and loss still matter.", ti: "ንዘመናት ክጸንሕ ይኽእል፤ ምዕቃብ፣ ስርቂን ምጥፋእን ግን ኣገዳሲ እዩ።" },
    portability: { en: "Compact relative to many goods, but moving large values can be heavy and costly.", ti: "ኣብ ኣንጻር ብዙሓት ኣቕሑ ውሑድ ቦታ ይሕዝ፤ ብዙሕ ዋጋ ምንቅስቓስ ግን ከቢድን ክቡርን እዩ።" },
    divisibility: { en: "Can be weighed or refined into smaller units, but making small payments may require equipment and incur costs.", ti: "ብመዛኒ ወይ ብምጽራይ ኣብ ንኣሽቱ መጠን ይክፈል፤ ንንኣሽቱ ክፍሊታት ግን መሳርሒን ወጻኢን የድሊ።" },
    recognizability: { en: "Appearance alone cannot prove purity; weighing and testing may be needed.", ti: "ቅርጺ ጥራይ ንጽህና ወርቂ ኣየረጋግጽን፤ ምዛንን ምምርማርን ከድሊ ይኽእል።" },
    scarcity: { en: "Difficult and costly to mine, though new deposits and mining technology can increase supply.", ti: "ንምዕዳኑ ጻዕሪን ወጻኢን የድሊ፤ ሓደስቲ ዕደናታትን ቴክኖሎጂን ግን ቀረብ ከዕብዩ ይኽእሉ።" },
  },
  paper: {
    durability: { en: "Physical notes can tear, get wet, or wear out; electronic balances depend on service and records.", ti: "ወረቐት ክቅደድ፣ ክጥልቅይ ወይ ክበላሾ ይኽእል፤ ኤሌክትሮኒካዊ ሕሳብ ኣብ ኣገልግሎትን መዝገብን ይምርኮስ።" },
    portability: { en: "Notes are easy for ordinary payments, while large cash amounts can be cumbersome; digital transfers need infrastructure.", ti: "ወረቐት ንልሙድ ክፍሊት ቀሊል እዩ፤ ብዙሕ ጥረ ገንዘብ ግን ከቢድ እዩ፤ ዲጂታላዊ ምስግጋር መሰረተ-ልምዓት የድሊ።" },
    divisibility: { en: "Denominations and electronic payments support different amounts, subject to available change and payment services.", ti: "ዝተፈላለዩ ዓይነት ባጤራታትን ኤሌክትሮኒካዊ ክፍሊትን ዝተፈላለየ መጠን የኽእሉ፤ ትርፊ ገንዘብን ኣገልግሎትን ግን ክህሉ ኣለዎ።" },
    recognizability: { en: "Security features help identify genuine notes, but forgery and verification remain concerns.", ti: "ናይ ድሕነት መለለዪታት ሓቀኛ ባጤራ ንምፍላጥ ይሕግዙ፤ ምጥርጣር ሓሶትን ምርግጋጽን ግን ይቕጽል።" },
    scarcity: { en: "There is no single fixed supply rule for all currencies; monetary and banking systems can expand money supply.", ti: "ንኹሉ ባጤራ ዝምልከት ሓደ ቀዋሚ ሕጊ ቀረብ የለን፤ ስርዓታት ባንክን ገንዘብን ቀረብ ከስፍሑ ይኽእሉ።" },
  },
  salt: {
    durability: { en: "Can last when kept dry and clean, but moisture and contamination reduce quality.", ti: "ኣብ ደረቕን ጽሩይን ቦታ ክጸንሕ ይኽእል፤ ጠሊን ብከላን ግን ጽሬቱ ይቕንስ።" },
    portability: { en: "Portable in small quantities; bulky for larger values.", ti: "ንንኣሽቱ መጠን ምስካሙ ቀሊል እዩ፤ ንዓበይቲ ዋጋታት ግን ብዙሕ ቦታ ይሕዝ።" },
    divisibility: { en: "Easy to portion, but consistent quality and measures are important.", ti: "ኣብ ክፋላት ምክፋሉ ቀሊል እዩ፤ ጽሬትን መዛንን ግን ክሰማምዑ ኣለዎም።" },
    recognizability: { en: "People may recognize salt, but quality, purity, and measure can be hard to verify.", ti: "ሰባት ጨው ክፈልጡ ይኽእሉ፤ ጽሬት፣ ንጽህናን መጠንን ግን ንምርግጋጽ ከቢድ ክኸውን ይኽእል።" },
    scarcity: { en: "Its availability varies by location and season; local abundance can limit its usefulness as money.", ti: "ምርካቡ ብቦታን ወቕትን ይፈላለ፤ ኣብ ከባቢ ብዙሕ ምስ ዝርከብ ከም ገንዘብ ጥቕሙ ክድረት ይኽእል።" },
  },
  maize: {
    durability: { en: "Can spoil or attract pests unless stored carefully, so it is less durable than many materials.", ti: "ብጥንቃቐ እንተዘይተዓቂቡ ክበላሾ ወይ ባልዕ ክስሕብ ይኽእል፤ ስለዚ ካብ ብዙሓት ንብረታት ውሑድ ጽንዓት ኣለዎ።" },
    portability: { en: "Easy in small quantities, but heavy and bulky when moving substantial value.", ti: "ንንኣሽቱ መጠን ምስካሙ ቀሊል እዩ፤ ብዙሕ ዋጋ ንምንቅስቓስ ግን ከቢድን ብዙሕ ቦታ ዝሕዝን እዩ።" },
    divisibility: { en: "Can be measured into portions, though consistent measures and quality matter.", ti: "ኣብ ክፋላት ብመዛኒ ክክፈል ይኽእል፤ መዛንን ጽሬትን ግን ኣገዳሲ እዩ።" },
    recognizability: { en: "The crop is familiar, but grade, moisture, and quality may require inspection.", ti: "እቲ እኽሊ ዝፍለጥ እዩ፤ ደረጃ፣ ጠሊን ጽሬትን ግን ምርመራ ከድልዮም ይኽእል።" },
    scarcity: { en: "Supply changes with harvests, weather, and storage; scarcity can be seasonal and local.", ti: "ቀረብ ብቀውዒ፣ ክሊማን ምዕቃብን ይለዋወጥ፤ ዋሕዲ ከባብያዊን ወቕታዊን ክኸውን ይኽእል።" },
  },
  bitcoin: {
    durability: { en: "No physical wear, but continued access depends on network infrastructure, compatible software, key management, and backups.", ti: "ኣካላዊ ብልሽት የብሉን፤ ምቕጻል ምጥቃሙ ግን ኣብ መርበብ፣ ሶፍትዌር፣ ምሕደራ ቁልፊን ባክኣፕን ይምርኮስ።" },
    portability: { en: "Can be transferred digitally across distance, subject to device access, connectivity, fees, and custody.", ti: "ብዲጂታል ኣብ ርሕቀት ክስገር ይኽእል፤ መሳርሒ፣ ኢንተርነት፣ ክፍሊትን ምሕደራ ቁልፊን ግን ይጽልዉዎ።" },
    divisibility: { en: "One BTC is divisible into 100 million satoshis on the base unit scale; minimum practical amounts depend on the transaction system.", ti: "ሓደ BTC ኣብ መሰረታዊ መለክዒ ናብ 100 ሚልዮን ሳቶሺ ይክፈል፤ ተግባራዊ ዝተሓተ መጠን ኣብ ስርዓት ትራንዛክሽን ይምርኮስ።" },
    recognizability: { en: "A running Bitcoin node can check protocol rules and transactions; checking does require suitable software and understanding.", ti: "ዝሰርሕ ቢትኮይን ኖድ ሕግታት ፕሮቶኮልን ትራንዛክሽንን ከረጋግጽ ይኽእል፤ ምርግጋጽ ግን ሶፍትዌርን ምርዳእን የድሊ።" },
    scarcity: { en: "Current consensus rules define a maximum supply of 21 million BTC; changing those rules would require participant acceptance.", ti: "ኣብዚ እዋን ዘለዉ ሕግታት ስምምዕ ፕሮቶኮል ዝለዓለ ቀረብ 21 ሚልዮን BTC ይገልጹ፤ ምቕያር እዞም ሕግታት ምስምማዕ ተሳተፍቲ የድሊ።" },
  },
};

function MoneyProperties({ isTi }: { isTi: boolean }) {
  const [asset, setAsset] = useState<MoneyAsset>("gold");
  const [property, setProperty] = useState<Property>("durability");

  return (
    <LessonPanel
      eyebrow={{ en: "Experiment 03 · Properties", ti: "ፈተነ 03 · ባህርያት" }}
      title={{ en: "What makes something useful as money?", ti: "ሓደ ነገር ከም ገንዘብ ጠቓሚ ዝገብሮ እንታይ እዩ?" }}
      description={{
        en: "Choose an item and inspect its trade-offs. These are qualities to compare, not a pass/fail checklist: usefulness depends on the community, technology, and situation.",
        ti: "ኣቕሓ ምረጽካ ንዘለዎ ምትዕርራይ መርምር። እዚኦም ንምውድዳር ዝሕግዙ ባህርያት እዮም እምበር ፈተና ሓለፈ/ወደቐ ኣይኮኑን።",
      }}
      isTi={isTi}
    >
      <div className="flex flex-wrap gap-2" aria-label={isTi ? "ኣቕሑ ምረጽ" : "Select an item"}>
        {assets.map((item) => (
          <button
            type="button"
            key={item.id}
            aria-pressed={asset === item.id}
            className={asset === item.id ? selectedButtonClass : buttonClass}
            onClick={() => setAsset(item.id)}
          >
            {text(item.label, isTi)}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
        <div className={cardClass}>
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            {isTi ? "ኣብ ዝኾነ ኩነታት ኣስተውዕል" : "Consider the context"}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {properties.map((item) => (
              <button
                type="button"
                key={item.id}
                aria-pressed={property === item.id}
                className={property === item.id ? selectedButtonClass : buttonClass}
                onClick={() => setProperty(item.id)}
              >
                {text(item.label, isTi)}
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-zinc-300">
            {text(propertyNotes[asset][property], isTi)}
          </p>
        </div>
        <div className={cardClass}>
          <h4 className="font-semibold text-zinc-100">
            {isTi ? "እዚ ኣቕሓ ዝህቦ ምትዕርራይ" : "The trade-off to notice"}
          </h4>
          <p className="mt-2 text-sm leading-relaxed text-zinc-300">
            {asset === "bitcoin"
              ? isTi
                ? "ዲጂታላዊ ምንቅስቓስን ምክፍፋልን ምስ መሰረተ-ልምዓትን ምሕደራ ቁልፊን ዝተኣሳሰሩ እዮም።"
                : "Digital portability and fine divisibility come with dependence on infrastructure and careful key custody."
              : asset === "gold"
                ? isTi
                  ? "ኣካላዊ ጽንዓትን ዋሕድን ምስ ምርግጋጽ፣ ምስካምን ምክፍፋልን ይተዓራረዩ።"
                  : "Physical durability and scarcity trade off against verification, portability, and convenient small payments."
                : asset === "paper"
                  ? isTi
                    ? "ምቹእነት ወረቐት ምስ ናይ ወረቐት ጽንዓትን ምሕደራ ቀረብን ይተዓራረይ።"
                    : "Convenient notes and electronic accounts trade off against physical wear and issuer/system dependence."
                  : isTi
                    ? "ኣብ ከባቢ ቀሊል ምርካቡን ንግዚኡ ጠቓሚ ምዃኑን ምስ ምዕቃብን ምንቅስቓስን ይተዓራረይ።"
                    : "Local usefulness and availability trade off against storage, spoilage, and moving larger values."}
          </p>
          <p className="mt-3 rounded-lg border border-orange-400/20 bg-orange-500/5 p-3 text-sm text-orange-100">
            {isTi
              ? "ኣብ ዝተፈላለየ ሕብረተሰብ፣ ግዜን ቴክኖሎጂን እቲ ሚዛን ክቕይሩ ይኽእሉ።"
              : "A property can matter more or less depending on the community, period, and available technology."}
          </p>
        </div>
      </div>
      <KnowledgeCheck
        isTi={isTi}
        question={{ en: "A store of maize is easy to divide but can spoil in poor storage. What does this tell you?", ti: "ቆሎ ብቐሊሉ ይክፈል፣ ኣብ ዘይጽቡቕ ምዕቃብ ግን ክበላሾ ይኽእል። እዚ እንታይ ይነግረካ?" }}
        choices={[
          { label: { en: "Money-like properties involve trade-offs", ti: "ባህርያት ገንዘብ ምትዕርራይ ኣለዎም" }, correct: true },
          { label: { en: "Divisibility guarantees durability", ti: "ምክፍፋል ጽንዓት የረጋግጽ" }, correct: false },
          { label: { en: "Every community values properties equally", ti: "ኩሉ ሕብረተሰብ ንባህርያት ብማዕረ ይግምት" }, correct: false },
        ]}
        explanation={{ en: "One useful property does not remove other weaknesses; context affects usefulness.", ti: "ሓደ ጠቓሚ ባህሪ ካልእ ድኽመት ኣየጥፍእን፤ ኩነታት ጥቕሚ ይጸልው።" }}
      />
    </LessonPanel>
  );
}

type CompareProperty = "scarcity" | "durability" | "portability" | "divisibility" | "verifiability" | "acceptance";

const compareProperties: { id: CompareProperty; label: Localized }[] = [
  { id: "scarcity", label: { en: "Scarcity", ti: "ዋሕዲ" } },
  { id: "durability", label: { en: "Durability", ti: "ጽንዓት" } },
  { id: "portability", label: { en: "Portability", ti: "ተንቀሳቓሲነት" } },
  { id: "divisibility", label: { en: "Divisibility", ti: "ምክፍፋል" } },
  { id: "verifiability", label: { en: "Verifiability", ti: "ምርግጋጽ" } },
  { id: "acceptance", label: { en: "Acceptance", ti: "ተቐባልነት" } },
];

const comparison: Record<CompareProperty, Record<"bitcoin" | "gold" | "fiat", Localized>> = {
  scarcity: {
    bitcoin: { en: "Current consensus rules cap issuance at a maximum of 21 million BTC. Changing those rules would require participants to adopt the change.", ti: "ሕግታት ስምምዕ ኣብዚ እዋን ቀረብ ክሳብ 21 ሚልዮን BTC ይድርት። ምቕያር ሕጊ ምስምማዕ ተሳተፍቲ የድሊ።" },
    gold: { en: "Extraction is difficult and costly; discoveries, prices, and technology can change the amount mined.", ti: "ምዕዳን ከቢድን ክቡርን እዩ፤ ሓደስቲ ዕደናታት፣ ዋጋን ቴክኖሎጂን ዝዕደን መጠን ክቕይሩ ይኽእሉ።" },
    fiat: { en: "No universal fixed cap applies to all fiat currencies; central-bank policy and banking systems affect supply.", ti: "ንኹሉ ፊያት ባጤራ ዝምልከት ሓደ ዓለምለኻዊ ቀዋሚ ገደብ የለን፤ ፖሊሲ ማእከላይ ባንክን ስርዓት ባንክን ቀረብ ይጸልዉ።" },
  },
  durability: {
    bitcoin: { en: "Digital units do not physically wear out, but access depends on network infrastructure, software, key management, and backups.", ti: "ዲጂታላዊ ኣሃዱታት ኣካላዊ ኣይበላሸዉን፤ ምጥቃሞም ግን ኣብ መርበብ፣ ሶፍትዌር፣ ቁልፊን ባክኣፕን ይምርኮስ።" },
    gold: { en: "Physical gold resists corrosion, but can be lost, stolen, or damaged.", ti: "ኣካላዊ ወርቂ ንምብስባስ ይጻወር፤ ግን ክጠፍእ፣ ክስረቕ ወይ ክጉዳእ ይኽእል።" },
    fiat: { en: "Banknotes wear out; electronic balances rely on maintained records, institutions, and payment infrastructure.", ti: "ባጤራታት ይበላሸዉ፤ ኤሌክትሮኒካዊ ሕሳብ ኣብ መዝገብ፣ ትካላትን መሰረተ-ልምዓትን ይምርኮስ።" },
  },
  portability: {
    bitcoin: { en: "Can be transferred digitally over distance, subject to connectivity, devices, fees, and custody arrangements.", ti: "ብዲጂታል ኣብ ርሕቀት ክስገር ይኽእል፤ ኢንተርነት፣ መሳርሒ፣ ክፍሊትን ምሕደራን ግን ይጽልዉዎ።" },
    gold: { en: "Small quantities are manageable; large values are heavy and need secure transport and storage.", ti: "ንንኣሽቱ መጠን ምስካሙ ይከኣል፤ ዓበይቲ ዋጋታት ግን ከበድቲ እዮም፣ ድሕነት ምስግጋርን ምዕቃብን የድልዮም።" },
    fiat: { en: "Cash works for many nearby payments; carrying large amounts is cumbersome. Digital payments depend on services and connectivity.", ti: "ጥረ ገንዘብ ንብዙሕ ኣብ ቀረባ ዘሎ ክፍሊት ይጠቅም፤ ብዙሕ ምስካም ግን ከቢድ እዩ። ዲጂታላዊ ክፍሊት ኣገልግሎትን ኢንተርነትን የድሊ።" },
  },
  divisibility: {
    bitcoin: { en: "One BTC is divisible into 100 million satoshis; practical minimums depend on the transaction layer and fees.", ti: "ሓደ BTC ናብ 100 ሚልዮን ሳቶሺ ይክፈል፤ ተግባራዊ ዝተሓተ መጠን ኣብ ቀጸላ ትራንዛክሽንን ክፍሊትን ይምርኮስ።" },
    gold: { en: "It can be weighed and refined, but precision, costs, and handling make tiny payments less convenient.", ti: "ብመዛኒ ክክፈልን ክጸርይን ይኽእል፤ ትኽክለኛነት፣ ወጻኢን ምሕደራን ንንኣሽቱ ክፍሊት ዘይምቹእ ይገብሮ።" },
    fiat: { en: "Notes have denominations and accounts can record small amounts; available cash and payment services matter.", ti: "ባጤራታት ዝተፈላለዩ መጠናት ኣለዎም፣ ሕሳብ ድማ ንኣሽቱ መጠን ክመዝግብ ይኽእል፤ ጥረ ገንዘብን ኣገልግሎት ክፍሊትን የገድስ።" },
  },
  verifiability: {
    bitcoin: { en: "A person running a node can verify transactions and rules; using a wallet or public explorer alone involves trusting that tool.", ti: "ኖድ ዘስርሕ ሰብ ትራንዛክሽንን ሕግታትን ከረጋግጽ ይኽእል፤ ዋለት ወይ ህዝባዊ ኤክስፕሎረር ጥራይ ምጥቃም ኣብቲ መሳርሒ ምእማን የጠቓልል።" },
    gold: { en: "Weight and purity can be tested, but reliable verification may need tools, expertise, or an assayer.", ti: "ክብደትን ንጽህናን ክምርመር ይኽእል፤ ዘተኣማምን ምርግጋጽ ግን መሳርሒ፣ ሞያዊ ፍልጠት ወይ መርማሪ የድሊ።" },
    fiat: { en: "Notes have security features; account balances depend on a provider's records and controls.", ti: "ባጤራታት መለለዪ ድሕነት ኣለዎም፤ ሕሳብ ባንክ ግን ኣብ መዝገብን ቁጽጽርን ኣቕራቢ ይምርኮስ።" },
  },
  acceptance: {
    bitcoin: { en: "Some people and businesses accept it voluntarily; legal status and everyday use vary by jurisdiction and setting.", ti: "ገለ ሰባትን ትካላትን ብፍቓዶም ይቕበልዎ፤ ሕጋዊ ደረጃን ልሙድ ኣጠቓቕማን ግን ብሃገርን ኩነታትን ይፈላለ።" },
    gold: { en: "Buyers, dealers, and communities may accept it, but acceptance and valuation are not universal.", ti: "ገዛእቲ፣ ነጋዶን ማሕበረሰባትን ክቕበልዎ ይኽእሉ፤ ተቐባልነትን ግምት ዋጋን ግን ዓለምለኻዊ ኣይኮነን።" },
    fiat: { en: "Many currencies have legal-tender rules in their jurisdictions, but legal status is distinct from a merchant's willingness or ability to accept a payment method.", ti: "ብዙሓት ባጤራታት ኣብ ሃገረን ሕጋዊ ባጤራ ዝብል ሕጊ ኣለወን፤ ሕጋዊ ደረጃ ግን ካብ ኣቕራቢ ክፍሊት ክቕበል ዘለዎ ፍቓድ ወይ ዓቕሚ ዝተፈለየ እዩ።" },
  },
};

function MonetaryComparison({ isTi }: { isTi: boolean }) {
  const [property, setProperty] = useState<CompareProperty>("scarcity");
  const forms: { id: "bitcoin" | "gold" | "fiat"; label: Localized }[] = [
    { id: "bitcoin", label: { en: "Bitcoin", ti: "ቢትኮይን" } },
    { id: "gold", label: { en: "Gold", ti: "ወርቂ" } },
    { id: "fiat", label: { en: "Fiat currency", ti: "ፊያት ባጤራ" } },
  ];

  return (
    <LessonPanel
      eyebrow={{ en: "Compare 04 · Monetary forms", ti: "ኣወዳድር 04 · ዓይነታት ገንዘብ" }}
      title={{ en: "Compare trade-offs, not winners", ti: "ምትዕርራይ ኣወዳድር፣ ኣሸነፍቲ ኣይኮነን" }}
      description={{
        en: "Select a property to compare Bitcoin, gold, and fiat currency. Each description includes limits and dependencies; no form performs identically in every place or situation.",
        ti: "ንቢትኮይን፣ ወርቅን ፊያት ባጤራን ንምውድዳር ባህሪ ምረጽ። ነፍሲ ወከፍ መግለጺ ገደብን ምርኮሳን ይጠቅስ።",
      }}
      isTi={isTi}
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label={isTi ? "ባህሪ ንምውድዳር ምረጽ" : "Choose a property to compare"}>
        {compareProperties.map((item) => (
          <button
            type="button"
            key={item.id}
            aria-pressed={property === item.id}
            className={property === item.id ? selectedButtonClass : buttonClass}
            onClick={() => setProperty(item.id)}
          >
            {text(item.label, isTi)}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {forms.map((form) => (
          <article key={form.id} className={`${cardClass} border-t-2 border-t-orange-500/60`}>
            <h4 className="font-bold text-zinc-100">{text(form.label, isTi)}</h4>
            <p className="mt-2 text-sm leading-relaxed text-zinc-300">
              {text(comparison[property][form.id], isTi)}
            </p>
          </article>
        ))}
      </div>
      <p className="mt-4 text-xs leading-relaxed text-zinc-400">
        {isTi
          ? "እዞም መግለጺታት ንመምሃሪ ዝተዳለዉ ሓፈሻዊ ነጥብታት እዮም፤ ፖሊሲ፣ ቴክኖሎጂ፣ ሕጊን ኣብ ቦታኻ ዘሎ ኣጠቓቕማን ክፈላለ ይኽእል።"
          : "These are general teaching points, not universal rankings. Policy, technology, law, and local practice can differ."}
      </p>
      <KnowledgeCheck
        isTi={isTi}
        question={{ en: "A currency is legal tender in a country, but a shop does not accept a particular payment channel. What is true?", ti: "ባጤራ ኣብ ሓደ ሃገር ሕጋዊ ባጤራ እዩ፣ ድኳን ግን ሓደ ኣገባብ ክፍሊት ኣይቅበልን። ኣየናይ ሓቂ እዩ?" }}
        choices={[
          { label: { en: "Legal-tender status and willingness to accept a payment are distinct", ti: "ሕጋዊ ደረጃን ክፍሊት ናይ ምቕባል ፍቓድን ዝተፈላለዩ እዮም" }, correct: true },
          { label: { en: "Legal tender means every payment method must work everywhere", ti: "ሕጋዊ ባጤራ ማለት ኩሉ ኣገባብ ኣብ ኩሉ ቦታ ክሰርሕ ኣለዎ ማለት እዩ" }, correct: false },
          { label: { en: "The currency has no monetary function", ti: "እቲ ባጤራ ተግባር ገንዘብ የብሉን" }, correct: false },
        ]}
        explanation={{ en: "Legal status does not mean every merchant accepts every payment method in every setting.", ti: "ሕጋዊ ደረጃ ማለት ኩሉ ነጋዳይ ኣብ ኩሉ ኩነታት ኩሉ ኣገባብ ይቕበል ማለት ኣይኮነን።" }}
      />
    </LessonPanel>
  );
}

type ExchangeAlternative = "cash" | "barter" | "credit" | "bitcoin";

function TrustSimulation({ isTi }: { isTi: boolean }) {
  const [confidence, setConfidence] = useState(80);
  const [priceRise, setPriceRise] = useState(20);
  const [alternative, setAlternative] = useState<ExchangeAlternative>("cash");
  const acceptingTraders = Math.round((confidence / 100) * 5);
  const alternatives: { id: ExchangeAlternative; label: Localized; note: Localized }[] = [
    { id: "cash", label: { en: "Cash", ti: "ጥረ ገንዘብ" }, note: { en: "People accept it when they expect others to accept it and trust the rules and issuer.", ti: "ሰባት ካልኦት ክቕበልዎ እዮም ኢሎም ምስ ዝኣምኑ ይቕበልዎ።" } },
    { id: "barter", label: { en: "Barter", ti: "ባርተር" }, note: { en: "Can work for a direct match, but both sides need compatible goods and wants.", ti: "ቀጥታዊ ምልውዋጥ ይከኣል፤ ክልቲኦም ወገናት ዝሰማማዕ ኣቕሓን ድሌትን ግን የድሊ።" } },
    { id: "credit", label: { en: "Credit", ti: "ልቓሕ" }, note: { en: "A promise to pay later depends on trust in the borrower, lender, and enforcement arrangements.", ti: "ድሒርካ ክትከፍል ዝብል ተስፋ ኣብ ተለቃሒ፣ ኣለቃሒን ኣፈጻጽማን ምእማን ይምርኮስ።" } },
    { id: "bitcoin", label: { en: "Bitcoin", ti: "ቢትኮይን" }, note: { en: "Rules and transactions can be checked with suitable software; acceptance, connectivity, and key custody still matter.", ti: "ሕግታትን ትራንዛክሽንን ብሶፍትዌር ክምርመሩ ይኽእሉ፤ ተቐባልነት፣ ኢንተርነትን ምሕደራ ቁልፊን ግን ኣገዳሲ እዩ።" } },
  ];

  return (
    <LessonPanel
      eyebrow={{ en: "Investigate 05 · Trust", ti: "መርምር 05 · እምነት" }}
      title={{ en: "Trust changes what people are willing to accept", ti: "እምነት ሰባት ክቕበልዎ ዝደልዩ ይጸልው" }}
      description={{
        en: "Adjust confidence in this simplified scenario. The acceptance indicator and price-level control are separate on purpose: confidence can affect willingness to trade, but it does not mechanically set purchasing power.",
        ti: "ኣብዚ ቀሊል ምሳሌ እምነት ቀይር። መለክዒ ተቐባልነትን ዋጋን ብፍላይ ተፈላልዮም ኣለዉ፤ እምነት ፍቓድ ምልውዋጥ ክጸልው ይኽእል፣ ብቐጥታ ናይ ምግዛእ ዓቕሚ ግን ኣይውስንን።",
      }}
      isTi={isTi}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div className={cardClass}>
          <label htmlFor="chapter1-confidence" className="font-semibold text-zinc-100">
            {isTi ? "እምነት ኣብ እቲ ባጤራ" : "Confidence in this currency"}
          </label>
          <input
            id="chapter1-confidence"
            type="range"
            min="0"
            max="100"
            step="10"
            value={confidence}
            onChange={(event) => setConfidence(Number(event.target.value))}
            className="mt-4 w-full accent-[#F97602]"
            aria-valuetext={`${confidence}%`}
          />
          <div className="flex justify-between text-xs text-zinc-500"><span>0%</span><span>100%</span></div>
          <div className="mt-4 flex gap-2" aria-label={isTi ? "ኣብነታዊ ሸረኽቲ" : "Illustrative traders"}>
            {Array.from({ length: 5 }, (_, index) => (
              <div
                key={index}
                className={`flex h-11 flex-1 items-center justify-center rounded-lg border text-xs font-semibold ${index < acceptingTraders ? "border-emerald-400/50 bg-emerald-500/10 text-emerald-200" : "border-zinc-700 bg-zinc-900 text-zinc-500"}`}
                aria-label={index < acceptingTraders ? (isTi ? "ዝቕበል" : "Willing to accept") : (isTi ? "ዘይቕበል" : "Not accepting in this scenario")}
              >
                {index < acceptingTraders ? (isTi ? "ይቕበል" : "Accepts") : (isTi ? "ይጽበ" : "Waits")}
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            {isTi ? "ምሳሌ ጥራይ፦ እዚ ቁጽሪ ተጽእኖ እምነት የርኢ እምበር ናይ ገለ ዕዳጋ ግምት ኣይኮነን።" : "Illustrative only: this index shows a possible effect, not a prediction about a real market."}
          </p>
        </div>
        <div className={cardClass}>
          <label htmlFor="chapter1-trust-prices" className="font-semibold text-zinc-100">
            {isTi ? "ኣብቲ ምሳሌ ዋጋ መሶብ ምግቢ" : "Example food-basket price"}
          </label>
          <input
            id="chapter1-trust-prices"
            type="range"
            min="0"
            max="200"
            step="10"
            value={priceRise}
            onChange={(event) => setPriceRise(Number(event.target.value))}
            className="mt-4 w-full accent-[#F97602]"
            aria-valuetext={`${priceRise}%`}
          />
          <p className="mt-2 text-sm text-zinc-300">
            {isTi ? "ምሳሌ ዋጋ ካብ 10 ናቕፋ ናብ" : "Illustrative basket price: 10 Nakfa →"}{" "}
            Nakfa {(10 * (1 + priceRise / 100)).toLocaleString()}
          </p>
          <p className="mt-3 text-sm text-zinc-300">
            {isTi ? "ናይ ምግዛእ ዓቕሚ ብናይ ኣቕሑ ዋጋን መጠን ገንዘብን ይምልከት። እምነት ብዘይ ተወሳኺ ሓበሬታ ኣብ ባዕሉ ኣይውስኖን።" : "Purchasing power depends on prices and the amount held. Confidence alone does not determine it."}
          </p>
        </div>
      </div>
      <div className="mt-4">
        <h4 className="font-semibold text-zinc-100">{isTi ? "እምነት ኣብ እንታይ እዩ?" : "What kind of trust is involved?"}</h4>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {[
            { en: "Institutional trust: confidence in rules, courts, or public institutions.", ti: "እምነት ትካል፦ ኣብ ሕግታት፣ ቤት ፍርዲ ወይ ህዝባዊ ትካላት ዘሎ እምነት።" },
            { en: "Issuer trust: confidence in the organization responsible for a currency or claim.", ti: "እምነት ኣውጻኢ፦ ኣብ እቲ ባጤራ ወይ ጠለብ ዘውጽእ ትካል ዘሎ እምነት።" },
            { en: "Counterparty confidence: expecting other people to accept the payment or honor a promise.", ti: "እምነት ኣብ ተጻራሪ ወገን፦ ካልኦት ክፍሊት ክቕበሉ ወይ ተስፋ ክፍጽሙ ምጽባይ።" },
            { en: "Verification: checking a payment or claim rather than relying only on another person's word.", ti: "ምርግጋጽ፦ ኣብ ቃል ካልእ ሰብ ጥራይ ከይተመርኮስካ ክፍሊት ወይ ጠለብ ምምርማር።" },
          ].map((note) => (
            <p key={note.en} className={`${cardClass} text-sm leading-relaxed text-zinc-300`}>{isTi ? note.ti : note.en}</p>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <h4 className="font-semibold text-zinc-100">{isTi ? "ኣማራጺ መንገዲ ምልውዋጥ ምረጽ" : "Explore an alternative exchange method"}</h4>
        <div className="mt-2 flex flex-wrap gap-2">
          {alternatives.map((item) => (
            <button type="button" key={item.id} aria-pressed={alternative === item.id} className={alternative === item.id ? selectedButtonClass : buttonClass} onClick={() => setAlternative(item.id)}>
              {text(item.label, isTi)}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-zinc-300" role="status">
          {text(alternatives.find((item) => item.id === alternative)!.note, isTi)}
        </p>
      </div>
      <KnowledgeCheck
        isTi={isTi}
        question={{ en: "A transaction can be verified, but a trader declines it. Which distinction matters?", ti: "ትራንዛክሽን ክረጋገጽ ይኽእል፣ ነጋዳይ ግን ይነጽጎ። ኣየናይ ፍልልይ ኣገዳሲ እዩ?" }}
        choices={[
          { label: { en: "Verification is different from willingness to accept", ti: "ምርግጋጽ ካብ ፍቓድ ምቕባል ዝተፈለየ እዩ" }, correct: true },
          { label: { en: "Verification automatically creates trust in everyone", ti: "ምርግጋጽ ኣብ ኩሉ ሰብ እምነት ብኣውቶማቲክ ይፈጥር" }, correct: false },
          { label: { en: "Declining a payment changes the protocol rules", ti: "ክፍሊት ምንጻግ ሕግታት ፕሮቶኮል ይቕይር" }, correct: false },
        ]}
        explanation={{ en: "Verification can provide evidence about a payment, while acceptance depends on the other participant and circumstances.", ti: "ምርግጋጽ ብዛዕባ ክፍሊት መርትዖ ይህብ፤ ተቐባልነት ግን ኣብ ካልእ ተሳታፊን ኩነታትን ይምርኮስ።" }}
      />
    </LessonPanel>
  );
}

type EverydayCase = {
  id: string;
  title: Localized;
  description: Localized;
  correct: MoneyFunction;
  explanation: Localized;
};

const everydayCases: EverydayCase[] = [
  {
    id: "airtime",
    title: { en: "Buying airtime", ti: "ኣየርታይም ምግዛእ" },
    description: { en: "You pay Nakfa through a shop or payment service and receive airtime.", ti: "ብናቕፋ ብድኳን ወይ ኣገልግሎት ክፍሊት ከፊልካ ኣየርታይም ትቕበል።" },
    correct: "exchange",
    explanation: { en: "Money is the means used to complete the purchase.", ti: "ገንዘብ ነቲ ግዝኣት ንምፍጻም ዝጥቀመሉ መንገዲ እዩ።" },
  },
  {
    id: "transport",
    title: { en: "Paying for transport", ti: "ክፍሊት ትራንስፖርት" },
    description: { en: "You compare a shared taxi fare with the cost of walking or another route, all in Nakfa.", ti: "ክፍሊት ታክሲ ምስ ካልእ መንገዲ ብናቕፋ ተወዳድር።" },
    correct: "account",
    explanation: { en: "A common unit helps compare different costs before choosing.", ti: "ሓደ ሓባራዊ መለክዒ ቅድሚ ምምራጽ ዝተፈላለዩ ወጻኢታት ከተወዳድር ይሕግዘካ።" },
  },
  {
    id: "food",
    title: { en: "Purchasing food", ti: "ምግቢ ምግዛእ" },
    description: { en: "You sell produce for cash at a market, then use that money to buy food from a different seller.", ti: "ኣብ ዕዳጋ ፍርያትካ ብጥረ ገንዘብ ሸይጥካ፣ ካብ ካልእ ሸያጢ ምግቢ ትገዝእ።" },
    correct: "exchange",
    explanation: { en: "The money bridges two separate trades with different people.", ti: "ገንዘብ ኣብ መንጎ ክልተ ንግዲ ምስ ዝተፈላለዩ ሰባት ድልድል ይኸውን።" },
  },
  {
    id: "remittance",
    title: { en: "Receiving a remittance", ti: "ገንዘብ ካብ ወጻኢ ምቕባል" },
    description: { en: "A family member sends money that you can use to pay a bill or buy supplies.", ti: "ኣባል ስድራ ገንዘብ ይሰደልካ፣ ንሕሳብ ወይ ኣቕሑ ክትከፍለሉ ትኽእል።" },
    correct: "exchange",
    explanation: { en: "The received funds can be exchanged for goods and services; fees and access depend on the provider.", ti: "እቲ ዝመጸ ገንዘብ ምስ ኣቕሑን ኣገልግሎትን ክቀየር ይኽእል፤ ክፍሊትን ተበጻሕነትን ኣብ ኣቕራቢ ይምርኮስ።" },
  },
  {
    id: "saving",
    title: { en: "Saving for school costs", ti: "ንወጻኢ ትምህርቲ ዝተዓቀበ ሃብቲ" },
    description: { en: "You set aside some income now to help meet a known expense next term.", ti: "ንዝመጽእ ተርም ንዝህሉ ወጻኢ ካብ ኣታዊኻ ሓደ ክፋል ሎሚ ትዕቅብ።" },
    correct: "store",
    explanation: { en: "You are using money to carry purchasing power toward a future expense, though prices and risks can change.", ti: "ንዝመጽእ ወጻኢ ናይ ምግዛእ ዓቕሚ ክትዕቅብ ትፍትን፤ ዋጋን ስግኣታትን ግን ክለዋወጡ ይኽእሉ።" },
  },
];

function EverydayMoney({ isTi }: { isTi: boolean }) {
  const [selectedCase, setSelectedCase] = useState(everydayCases[0]);
  const [answer, setAnswer] = useState<MoneyFunction | null>(null);
  const [checked, setChecked] = useState(false);

  return (
    <LessonPanel
      eyebrow={{ en: "Apply 06 · Everyday money", ti: "ተግባር 06 · ገንዘብ ኣብ መዓልታዊ ህይወት" }}
      title={{ en: "Spot money's function in everyday life", ti: "ተግባር ገንዘብ ኣብ መዓልታዊ ህይወት ፍለጥ" }}
      description={{
        en: "Choose an East African everyday scenario. The same payment can serve more than one function, but focus on the role described in each prompt.",
        ti: "ኣብ ምስራቕ ኣፍሪቃ ዘሎ መዓልታዊ ኩነታት ምረጽ። ሓደ ክፍሊት ካብ ሓደ ንላዕሊ ተግባር ክፍጽም ይኽእል፤ ኣብቲ ሕቶ ዝተገልጸ ተግባር ግን ኣተኩር።",
      }}
      isTi={isTi}
    >
      <div className="flex flex-wrap gap-2">
        {everydayCases.map((item) => (
          <button
            type="button"
            key={item.id}
            aria-pressed={selectedCase.id === item.id}
            className={selectedCase.id === item.id ? selectedButtonClass : buttonClass}
            onClick={() => {
              setSelectedCase(item);
              setAnswer(null);
              setChecked(false);
            }}
          >
            {text(item.title, isTi)}
          </button>
        ))}
      </div>
      <div className={`${cardClass} mt-4`}>
        <p className="font-semibold text-zinc-100">{text(selectedCase.title, isTi)}</p>
        <p className="mt-2 text-sm leading-relaxed text-zinc-300">{text(selectedCase.description, isTi)}</p>
        <p className="mt-4 font-medium text-zinc-100">
          {isTi ? "እቲ ኣብዚ ዝተገልጸ ቀንዲ ተግባር እንታይ እዩ?" : "Which function is emphasized in this scenario?"}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {functionTabs.map((tab) => (
            <button type="button" key={tab.id} aria-pressed={answer === tab.id} className={answer === tab.id ? selectedButtonClass : buttonClass} onClick={() => { setAnswer(tab.id); setChecked(false); }}>
              {text(tab.label, isTi)}
            </button>
          ))}
        </div>
        <button type="button" className="mt-4 rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-zinc-950 hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300 disabled:opacity-50" disabled={!answer} onClick={() => setChecked(true)}>
          {isTi ? "መልሲ ኣረጋግጽ" : "Check answer"}
        </button>
        {checked && answer ? (
          <p className={`mt-3 text-sm ${answer === selectedCase.correct ? "text-emerald-300" : "text-amber-200"}`} role="status">
            {answer === selectedCase.correct ? (isTi ? "ቅኑዕ። " : "Correct. ") : (isTi ? "እንደገና ሕሰብ። " : "Consider the main role described. ")}
            {text(selectedCase.explanation, isTi)}
          </p>
        ) : null}
      </div>
    </LessonPanel>
  );
}

type AssessmentQuestion = {
  topic: Localized;
  prompt: Localized;
  options: { label: Localized; correct: boolean }[];
  explanation: Localized;
};

const assessmentQuestions: AssessmentQuestion[] = [
  {
    topic: { en: "Barter and wants", ti: "ባርተርን ድሌታትን" },
    prompt: { en: "A farmer has maize and wants a tool. The toolmaker wants shoes, not maize. What is the main barter difficulty?", ti: "ሓረስታይ ቆሎ ኣለዎ፣ መሳርሒ ይደሊ። ሰራሕ መሳርሒ ግን ቆሎ ዘይኮነ ጫማ ይደሊ። ቀንዲ ጸገም ባርተር እንታይ እዩ?" },
    options: [
      { label: { en: "Their wants do not match at the same time", ti: "ድሌቶም ኣብ ተመሳሳሊ ግዜ ኣይሰማማዕን" }, correct: true },
      { label: { en: "The farmer cannot compare prices", ti: "ሓረስታይ ዋጋ ከወዳድር ኣይክእልን" }, correct: false },
      { label: { en: "Maize cannot be divided", ti: "ቆሎ ክክፈል ኣይክእልን" }, correct: false },
    ],
    explanation: { en: "A direct swap needs each side to want what the other offers; money can reduce that matching requirement.", ti: "ቀጥታዊ ምልውዋጥ ነፍሲ ወከፍ ወገን ነቲ እቲ ካልእ ዘቕርቦ ክደሊ ይጠልብ፤ ገንዘብ ነዚ ግጥም ክቕንሶ ይኽእል።" },
  },
  {
    topic: { en: "Functions of money", ti: "ተግባራት ገንዘብ" },
    prompt: { en: "A shop lists the prices of bread, soap, and transport in the same currency. Which function helps compare them?", ti: "ድኳን ዋጋ ባኒ፣ ሳሙናን ትራንስፖርትን ብሓደ ባጤራ ይጽሕፍ። ንምውድዳር እንታይ ተግባር ይሕግዝ?" },
    options: [
      { label: { en: "Store of value", ti: "መዕቆሪ ሃብቲ" }, correct: false },
      { label: { en: "Unit of account", ti: "መለክዒ ሕሳብ" }, correct: true },
      { label: { en: "Portability", ti: "ተንቀሳቓሲነት" }, correct: false },
    ],
    explanation: { en: "A unit of account expresses prices in a common measure.", ti: "መለክዒ ሕሳብ ዋጋታት ብሓደ ሓባራዊ መለክዒ ይገልጽ።" },
  },
  {
    topic: { en: "Purchasing power", ti: "ናይ ምግዛእ ዓቕሚ" },
    prompt: { en: "Your savings balance is unchanged, but the prices of the items you need rise. What might happen to its store-of-value function?", ti: "መጠን ሃብትኻ ኣይተለወጠን፣ ዋጋ እቶም ዘድልዩኻ ኣቕሑ ግን ወሲኹ። ናይ መዕቆሪ ሃብቲ ተግባሩ እንታይ ክኸውን ይኽእል?" },
    options: [
      { label: { en: "It may buy less than before", ti: "ካብ ቅድሚ ሕጂ ውሑድ ክገዝእ ይኽእል" }, correct: true },
      { label: { en: "It must buy exactly the same amount", ti: "ብግድን ተመሳሳሊ መጠን ክገዝእ ኣለዎ" }, correct: false },
      { label: { en: "It becomes more divisible", ti: "ዝያዳ ዝምቀል ይኸውን" }, correct: false },
    ],
    explanation: { en: "A fixed nominal balance can lose purchasing power when relevant prices rise; the example does not predict future prices.", ti: "ዋጋታት ምስ ዝውስኹ፡ ዘይተለወጠ ሕሳብ ናይ ምግዛእ ዓቕሙ ክቕንስ ይኽእል፤ እቲ ምሳሌ ግን ዋጋ ኣይትነብይን።" },
  },
  {
    topic: { en: "Properties and trade-offs", ti: "ባህርያትን ምትዕርራይን" },
    prompt: { en: "A community has abundant salt locally, but it is hard to keep dry and transport in large quantities. What is the best conclusion?", ti: "ኣብ ሓደ ማሕበረሰብ ጨው ብዙሕ ይርከብ፣ ግን ኣብ ደረቕ ቦታ ምዕቃቡን ብብዙሕ መጠን ምስጋሩን ከቢድ እዩ። ዝበለጸ ድምዳመ እንታይ እዩ?" },
    options: [
      { label: { en: "It has context-dependent strengths and weaknesses", ti: "ኣብ ኩነታት ዝምርኮስ ጽንዓትን ድኽመትን ኣለዎ" }, correct: true },
      { label: { en: "It can never function as money", ti: "ፈጺሙ ከም ገንዘብ ክሰርሕ ኣይክእልን" }, correct: false },
      { label: { en: "Local abundance guarantees stable value", ti: "ኣብ ከባቢ ብዙሕ ምህላዉ ቀዋሚ ዋጋ የረጋግጽ" }, correct: false },
    ],
    explanation: { en: "Money-like qualities are trade-offs; local supply and storage conditions affect usefulness.", ti: "ባህርያት ገንዘብ ምትዕርራይ ኣለዎም፤ ከባብያዊ ቀረብን ኩነታት ምዕቃብን ጥቕሚ ይጸልዉ።" },
  },
  {
    topic: { en: "Gold, fiat, and Bitcoin", ti: "ወርቂ፣ ፊያትን ቢትኮይንን" },
    prompt: { en: "Which statement about Bitcoin's supply is the most precise?", ti: "ብዛዕባ ቀረብ ቢትኮይን ኣየናይ መግለጺ ዝያዳ ትኽክለኛ እዩ?" },
    options: [
      { label: { en: "Current consensus rules define a maximum supply of 21 million BTC", ti: "ሕግታት ስምምዕ ሕጂ ዝለዓለ ቀረብ 21 ሚልዮን BTC ይገልጹ" }, correct: true },
      { label: { en: "Every merchant must accept Bitcoin", ti: "ኩሉ ነጋዳይ ቢትኮይን ክቕበል ኣለዎ" }, correct: false },
      { label: { en: "Gold supply cannot increase", ti: "ቀረብ ወርቂ ክውስኽ ኣይክእልን" }, correct: false },
    ],
    explanation: { en: "The cap is encoded in current consensus rules; gold can be newly mined, and Bitcoin acceptance is not universal.", ti: "እቲ ገደብ ኣብ ሕግታት ስምምዕ ሕጂ ተጻሒፉ ኣሎ፤ ወርቂ ሓድሽ ክዕደን ይኽእል፣ ቢትኮይን ድማ ብኹሉ ኣይቅበልን።" },
  },
  {
    topic: { en: "Trust and exchange", ti: "እምነትን ምልውዋጥን" },
    prompt: { en: "A payment can be checked against public protocol rules, but the seller does not accept that payment method. What does this show?", ti: "ክፍሊት ብህዝባዊ ሕግታት ፕሮቶኮል ክምርመር ይከኣል፣ ሸያጢ ግን ነቲ ኣገባብ ክፍሊት ኣይቅበሎን። እዚ እንታይ የርኢ?" },
    options: [
      { label: { en: "Verification and acceptance are different issues", ti: "ምርግጋጽን ተቐባልነትን ዝተፈላለዩ ነገራት እዮም" }, correct: true },
      { label: { en: "Verification guarantees purchasing power", ti: "ምርግጋጽ ናይ ምግዛእ ዓቕሚ የረጋግጽ" }, correct: false },
      { label: { en: "All money depends on one issuer", ti: "ኩሉ ገንዘብ ኣብ ሓደ ኣውጻኢ ይምርኮስ" }, correct: false },
    ],
    explanation: { en: "A payment may be verifiable while people remain unwilling or unable to accept it.", ti: "ክፍሊት ክረጋገጽ ይኽእል፣ ሰባት ግን ክቕበልዎ ዘይደልዩ ወይ ዘይክእሉ ክኾኑ ይኽእሉ።" },
  },
];

function FinalAssessment({ isTi }: { isTi: boolean }) {
  const { isAuthenticated, profile, sessionEmail } = useAuth();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [responses, setResponses] = useState<boolean[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const current = assessmentQuestions[index];
  const score = responses.filter(Boolean).length;
  const topicsToReview = assessmentQuestions
    .filter((_, questionIndex) => responses[questionIndex] === false)
    .map((question) => text(question.topic, isTi));

  const saveCompletion = async () => {
    const email = profile?.email ?? sessionEmail;
    if (!isAuthenticated || !email) {
      setSaveError(isTi ? "ንኽፍጽምካ ዝተዓቀበ ምዕባለ ንምርካብ ተመዝገብ።" : "Sign in to save this assessment to your chapter progress.");
      return;
    }

    setSaving(true);
    setSaveError(null);
    try {
      const response = await fetch("/api/chapters/mark-completed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          chapterNumber: 1,
          chapterSlug: "the-nature-of-money",
        }),
      });
      const data: { error?: string; success?: boolean } = await response.json();
      if (!response.ok || data.success !== true) {
        throw new Error(data.error || (isTi ? "ምዕቃብ ኣይተሳለጠን።" : "Could not save your chapter progress."));
      }
      setSaved(true);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : (isTi ? "ምዕባለ ኣይተዓቀበን።" : "Could not save your progress."));
    } finally {
      setSaving(false);
    }
  };

  const startOver = () => {
    setIndex(0);
    setSelected(null);
    setResponses([]);
    setShowFeedback(false);
    setFinished(false);
    setSaved(false);
    setSaveError(null);
  };

  return (
    <LessonPanel
      eyebrow={{ en: "Reflect 07 · Final assessment", ti: "ኣስተንትን 07 · መወዳእታ ገምጋም" }}
      title={{ en: "Show how you would reason through it", ti: "ብኸመይ ከም እትሓስብ ኣርኢ" }}
      description={{
        en: "Six short scenarios check understanding, not memorized definitions. Each answer includes an explanation; your results highlight topics to revisit.",
        ti: "ሽዱሽተ ሓጸርቲ ኩነታት ምርዳእ ይምርምሩ እምበር ትርጉማት ምዝካር ኣይኮኑን። ነፍሲ ወከፍ መልሲ መብርሂ ኣለዎ።",
      }}
      isTi={isTi}
    >
      {!finished ? (
        <>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-orange-200">
              {isTi ? `ሕቶ ${index + 1} ካብ ${assessmentQuestions.length}` : `Question ${index + 1} of ${assessmentQuestions.length}`}
            </p>
            <div className="h-2 w-32 overflow-hidden rounded-full bg-zinc-800" aria-label={isTi ? "ምዕባለ ገምጋም" : "Assessment progress"}>
              <div className="h-full rounded-full bg-orange-400" style={{ width: `${((index + 1) / assessmentQuestions.length) * 100}%` }} />
            </div>
          </div>
          <div className={`${cardClass} mt-3`}>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{text(current.topic, isTi)}</p>
            <h4 className="mt-2 font-semibold leading-relaxed text-zinc-100">{text(current.prompt, isTi)}</h4>
            <div className="mt-4 grid gap-2">
              {current.options.map((option, optionIndex) => {
                const isSelected = selected === optionIndex;
                const feedbackClass = showFeedback
                  ? option.correct
                    ? "border-emerald-400/60 bg-emerald-500/10 text-emerald-100"
                    : isSelected
                      ? "border-rose-400/60 bg-rose-500/10 text-rose-100"
                      : "border-zinc-800 bg-black/20 text-zinc-400"
                  : isSelected
                    ? "border-orange-400/70 bg-orange-500/15 text-orange-100"
                    : "border-zinc-700 bg-zinc-900 text-zinc-200";
                return (
                  <button
                    type="button"
                    key={text(option.label, isTi)}
                    disabled={showFeedback}
                    aria-pressed={isSelected}
                    className={`rounded-lg border px-3 py-3 text-left text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 disabled:cursor-default ${feedbackClass}`}
                    onClick={() => setSelected(optionIndex)}
                  >
                    {text(option.label, isTi)}
                  </button>
                );
              })}
            </div>
            {showFeedback && selected !== null ? (
              <p className={`mt-4 text-sm leading-relaxed ${current.options[selected].correct ? "text-emerald-200" : "text-amber-200"}`} role="status">
                {current.options[selected].correct ? (isTi ? "ቅኑዕ መልሲ። " : "Correct. ") : (isTi ? "ቅኑዕ መልሲ፦ " : "The best answer: ")}
                {text(current.explanation, isTi)}
              </p>
            ) : null}
          </div>
          {!showFeedback ? (
            <button
              type="button"
              className="mt-4 rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-zinc-950 hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300 disabled:opacity-50"
              disabled={selected === null}
              onClick={() => {
                if (selected === null) return;
                const isCorrect = current.options[selected].correct;
                setResponses((previous) => [...previous.slice(0, index), isCorrect]);
                setShowFeedback(true);
              }}
            >
              {isTi ? "መልሲ ኣረጋግጽ" : "Check answer"}
            </button>
          ) : (
            <button
              type="button"
              className="mt-4 rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-zinc-950 hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300"
              onClick={() => {
                if (index + 1 < assessmentQuestions.length) {
                  setIndex((previous) => previous + 1);
                  setSelected(null);
                  setShowFeedback(false);
                  return;
                }
                setFinished(true);
                void saveCompletion();
              }}
            >
              {index + 1 < assessmentQuestions.length
                ? isTi ? "ቀጻሊ ሕቶ" : "Next question"
                : isTi ? "ውጽኢት ርአ" : "See results"}
            </button>
          )}
        </>
      ) : (
        <div className="rounded-xl border border-orange-400/25 bg-orange-500/5 p-4 sm:p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-200">
            {isTi ? "ውጽኢት ገምጋም" : "Assessment result"}
          </p>
          <p className="mt-2 text-3xl font-bold text-zinc-50">
            {score} / {assessmentQuestions.length}
          </p>
          <p className="mt-1 text-sm text-zinc-300">
            {isTi ? "ትኽክለኛ መልሲ ብምሃብካ ነፍሲ ወከፍ ነጥቢ ተረኺቡ።" : "One point for each scenario you answered correctly."}
          </p>
          <div className="mt-4 border-t border-zinc-800 pt-4">
            <h4 className="font-semibold text-zinc-100">{isTi ? "ነዞም ኣርእስቲ እንደገና ርአ" : "Topics to revisit"}</h4>
            {topicsToReview.length ? (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-100">
                {topicsToReview.map((topic) => <li key={topic}>{topic}</li>)}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-emerald-200">{isTi ? "ኩሉ ኣርእስቲ ብትኽክል መሊስካ!" : "You answered every scenario correctly."}</p>
            )}
          </div>
          <div className="mt-4 border-t border-zinc-800 pt-4">
            <p className="text-sm text-zinc-300" role="status">
              {saving
                ? isTi ? "ምዕባለኻ ይዕቀብ ኣሎ…" : "Saving your chapter progress…"
                : saved
                  ? isTi ? "ገምጋምካ ተዛዚሙ፤ ምዕባለ ምዕራፍ 1 ተዓቂቡ።" : "Assessment complete; Chapter 1 progress has been saved."
                  : saveError}
            </p>
            {saveError && !saved ? (
              <button type="button" className={`${buttonClass} mt-3`} disabled={saving} onClick={() => void saveCompletion()}>
                {isTi ? "ምዕባለ ኣቐምጥ" : "Save progress"}
              </button>
            ) : null}
          </div>
          <button type="button" className={`${buttonClass} mt-4`} onClick={startOver}>
            {isTi ? "ገምጋም እንደገና ጀምር" : "Retake assessment"}
          </button>
        </div>
      )}
    </LessonPanel>
  );
}
