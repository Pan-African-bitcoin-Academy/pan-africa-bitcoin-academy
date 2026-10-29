"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeftRight, ChevronDown } from "lucide-react";
import { useLanguage, type SiteLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitchOverlay } from "./LanguageSwitchOverlay";

const OPTIONS: { value: SiteLanguage; short: string; label: string }[] = [
  { value: "en", short: "EN", label: "English" },
  { value: "ti", short: "TIG", label: "ትግርኛ · Tigrinya" },
];

type LanguageSwitcherProps = {
  className?: string;
  /** Slightly smaller for mobile drawer */
  compact?: boolean;
};

export function LanguageSwitcher({
  className = "",
  compact = false,
}: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [transitionFrom, setTransitionFrom] = useState<SiteLanguage>("en");
  const [transitionTo, setTransitionTo] = useState<SiteLanguage>("ti");
  const translatingRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => clearTimeout(translatingRef.current);
  }, []);

  const current = OPTIONS.find((o) => o.value === language) ?? OPTIONS[0];

  const handleLanguageSelect = (lang: SiteLanguage) => {
    setOpen(false);
    if (lang === language) return;
    // Capture transition direction before switching
    setTransitionFrom(language);
    setTransitionTo(lang);
    setIsTranslating(true);
    setLanguage(lang);
    clearTimeout(translatingRef.current);
    // Keep overlay visible long enough for the animation to feel satisfying
    translatingRef.current = setTimeout(() => setIsTranslating(false), 1400);
  };

  return (
    <>
      {/* Full-screen ₿ overlay during language switch */}
      <LanguageSwitchOverlay
        visible={isTranslating}
        from={transitionFrom}
        to={transitionTo}
      />

      <div className={`relative ${className}`} ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`flex items-center rounded-full border text-zinc-300 transition hover:border-cyan-400/35 hover:bg-cyan-400/10 hover:text-cyan-200 ${
            compact
              ? "gap-1.5 border-cyan-400/25 bg-cyan-400/5 px-2.5 py-2 text-sm"
              : "gap-1 border-cyan-400/20 bg-transparent px-2 py-1.5 text-sm leading-none"
          } ${isTranslating ? "border-cyan-400/50 bg-cyan-400/10" : ""}`}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label="Select language"
        >
          {/* Icon spins briefly when switching */}
          <ArrowLeftRight
            className={`shrink-0 text-cyan-300/90 ${compact ? "h-5 w-5" : "h-3.5 w-3.5"} ${
              isTranslating ? "lang-switching-icon" : ""
            }`}
          />
          {/* key forces re-mount → triggers fade-in animation */}
          <span
            key={language}
            className="font-medium tabular-nums lang-label-enter"
          >
            {current.short}
          </span>
          <ChevronDown
            className={`shrink-0 text-zinc-400 transition ${open ? "rotate-180" : ""} ${compact ? "h-4 w-4" : "h-3 w-3"}`}
          />
        </button>

        {open && (
          <div
            className="absolute right-0 top-full z-[60] mt-1.5 min-w-[11rem] rounded-lg border border-cyan-400/20 bg-zinc-950/98 py-1 shadow-xl backdrop-blur-xl"
            role="listbox"
          >
            {OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={language === opt.value}
                onClick={() => handleLanguageSelect(opt.value)}
                className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm transition hover:bg-cyan-400/10 ${
                  language === opt.value
                    ? "text-cyan-200 font-semibold"
                    : "text-zinc-300"
                }`}
              >
                <span>{opt.label}</span>
                <span className="text-xs font-medium text-zinc-500 tabular-nums">
                  {opt.short}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
