"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { type SiteLanguage } from "@/contexts/LanguageContext";

type Props = {
  visible: boolean;
  from: SiteLanguage;
  to: SiteLanguage;
};

const LABEL: Record<SiteLanguage, string> = { en: "ENG", ti: "TIG" };

export function LanguageSwitchOverlay({ visible, from, to }: Props) {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);
  const [exiting, setExiting] = useState(false);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    clearTimeout(exitTimer.current);
    if (visible) {
      setExiting(false);
      setShow(true);
    } else if (show) {
      setExiting(true);
      exitTimer.current = setTimeout(() => {
        setShow(false);
        setExiting(false);
      }, 420);
    }
    return () => clearTimeout(exitTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!mounted || !show) return null;

  return createPortal(
    <div
      className={`lang-ov-backdrop ${exiting ? "lang-ov-bg-exit" : "lang-ov-bg-enter"}`}
      aria-live="assertive"
      aria-busy={visible}
      role="status"
    >
      <div className={`lang-ov-card ${exiting ? "lang-ov-card-exit" : "lang-ov-card-enter"}`}>
        {/* Pulsing orange halo ring */}
        <div className="lang-ov-halo" aria-hidden="true" />

        {/* ₿ — 3-D coin flip + glow */}
        <div className="lang-ov-btc-wrap" aria-hidden="true">
          <span className="lang-ov-btc">₿</span>
        </div>

        {/* ENG → TIG direction */}
        <div className="lang-ov-direction">
          <span className="lang-ov-lang">{LABEL[from]}</span>
          <span className="lang-ov-arrow">→</span>
          <span className="lang-ov-lang">{LABEL[to]}</span>
        </div>
      </div>
    </div>,
    document.body
  );
}
