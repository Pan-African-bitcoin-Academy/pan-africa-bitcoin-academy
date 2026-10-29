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

/** Particles orbiting the ₿ symbol.
 *  frac = startAngle/360 — used as negative animation-delay to stagger
 *  each particle around the ring without JS animation. */
const PARTICLES: { r: number; size: number; dur: number; frac: number }[] = [
  { r: 82,  size: 5, dur: 3.6, frac: 0       },
  { r: 100, size: 3, dur: 5.0, frac: 0.0833  },
  { r: 78,  size: 6, dur: 4.0, frac: 0.2     },
  { r: 110, size: 3, dur: 5.5, frac: 0.3     },
  { r: 86,  size: 4, dur: 3.8, frac: 0.4     },
  { r: 96,  size: 5, dur: 4.5, frac: 0.5     },
  { r: 75,  size: 3, dur: 5.2, frac: 0.6     },
  { r: 106, size: 6, dur: 3.5, frac: 0.7     },
  { r: 83,  size: 3, dur: 4.8, frac: 0.8     },
  { r: 98,  size: 4, dur: 4.2, frac: 0.9     },
  { r: 116, size: 2, dur: 6.0, frac: 0.15    },
  { r: 92,  size: 2, dur: 5.8, frac: 0.45    },
  { r: 88,  size: 2, dur: 6.5, frac: 0.65    },
];

export function LanguageSwitchOverlay({ visible, from, to }: Props) {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);
  const [exiting, setExiting] = useState(false);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Only render in browser (portal needs document.body)
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    clearTimeout(exitTimer.current);
    if (visible) {
      setExiting(false);
      setShow(true);
    } else if (show) {
      // Play exit animation before unmounting
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
      <div
        className={`lang-ov-card ${exiting ? "lang-ov-card-exit" : "lang-ov-card-enter"}`}
      >
        {/* Orbiting particles */}
        <div className="lang-ov-particles" aria-hidden="true">
          {PARTICLES.map((p, i) => (
            <div
              key={i}
              className="lang-ov-arm"
              style={
                {
                  "--r":    `${p.r}px`,
                  "--size": `${p.size}px`,
                  "--dur":  `${p.dur}s`,
                  "--frac": p.frac.toFixed(4),
                } as React.CSSProperties
              }
            >
              <span className="lang-ov-dot" />
            </div>
          ))}
        </div>

        {/* Pulsing orange halo ring */}
        <div className="lang-ov-halo" aria-hidden="true" />

        {/* ₿ — 3-D coin flip */}
        <div className="lang-ov-btc-wrap" aria-hidden="true">
          <span className="lang-ov-btc">₿</span>
        </div>

        {/* ENG → TIG direction */}
        <div className="lang-ov-direction">
          <span className="lang-ov-lang">{LABEL[from]}</span>
          <span className="lang-ov-arrow">→</span>
          <span className="lang-ov-lang">{LABEL[to]}</span>
        </div>

        {/* Status message */}
        <p className="lang-ov-status">Switching language…</p>
      </div>
    </div>,
    document.body
  );
}
