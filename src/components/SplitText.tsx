'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: 'chars' | 'words' | 'chars words' | 'words chars';
  from?: { opacity?: number; y?: number; x?: number };
  to?: { opacity?: number; y?: number; x?: number };
  threshold?: number;
  rootMargin?: string;
  textAlign?: 'left' | 'center' | 'right';
  tag?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3';
  onLetterAnimationComplete?: () => void;
  showCallback?: boolean;
}

export function SplitText({
  text,
  className = '',
  delay = 50,
  duration = 1.25,
  ease = 'cubic-bezier(0.25, 1, 0.5, 1)',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '0px',
  textAlign = 'center',
  tag: Tag = 'p',
  onLetterAnimationComplete,
}: SplitTextProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const items = useMemo(() => {
    if (!text) return [];
    if (splitType.includes('words') && !splitType.includes('chars')) {
      return text.split(/(\s+)/).filter(Boolean);
    }
    return text.split('').map((char) => (char === ' ' ? '\u00A0' : char));
  }, [text, splitType]);

  const style: React.CSSProperties = {
    textAlign,
    display: 'inline-block',
    lineHeight: 1.15,
  };

  return (
    <Tag
      ref={containerRef as any}
      style={style}
      className={`split-parent ${className}`.trim()}
    >
      {items.map((item, index) => {
        const itemDelay = (index * delay) / 1000;
        return (
          <span
            key={index}
            style={{
              display: 'inline-block',
              whiteSpace: splitType.includes('words') ? 'pre' : undefined,
              opacity: isVisible ? (to.opacity ?? 1) : (from.opacity ?? 0),
              transform: isVisible
                ? `translate3d(${to.x ?? 0}px, ${to.y ?? 0}px, 0)`
                : `translate3d(${from.x ?? 0}px, ${from.y ?? 40}px, 0)`,
              transition: `opacity ${duration}s ${ease} ${itemDelay}s, transform ${duration}s ${ease} ${itemDelay}s`,
              willChange: 'transform, opacity',
            }}
            onTransitionEnd={
              index === items.length - 1 ? onLetterAnimationComplete : undefined
            }
          >
            {item}
          </span>
        );
      })}
    </Tag>
  );
}

export default SplitText;
