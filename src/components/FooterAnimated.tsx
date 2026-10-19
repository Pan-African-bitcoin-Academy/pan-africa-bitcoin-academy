'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

export function FooterAnimated({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.01, rootMargin: '50px 0px 0px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={inView ? 'footer-animate-wrapper footer-inview' : 'footer-animate-wrapper'}
    >
      {children}
    </div>
  );
}
