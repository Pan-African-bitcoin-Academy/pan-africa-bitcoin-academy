'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/styles';

type HeadingTag = 'h1' | 'h2' | 'h3';

interface AnimatedHeadingProps {
  as: HeadingTag;
  children: ReactNode;
  className?: string;
  /** Optional delay in ms before animation runs when in view */
  delay?: number;
  /** Whether to animate once and remain visible (default true) */
  once?: boolean;
}

export function AnimatedHeading({
  as: Tag,
  children,
  className = '',
  delay = 0,
  once = true,
}: AnimatedHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [inView, setInView] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const h = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setInView(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        // If element is intersecting or has already scrolled past the top of the viewport
        if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
          setInView(true);
          if (once) {
            obs.disconnect();
          }
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [prefersReducedMotion, once]);

  const show = inView || prefersReducedMotion;
  const animateClass = show && !prefersReducedMotion ? 'animate-heading-reveal' : 'animate-heading-initial';

  return (
    <Tag
      ref={ref}
      className={cn(animateClass, className)}
      style={show && !prefersReducedMotion && delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
