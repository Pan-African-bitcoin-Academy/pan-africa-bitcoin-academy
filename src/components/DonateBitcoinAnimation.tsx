'use client';

import { useEffect, useRef } from 'react';

interface FallingSat {
  x: number;
  y: number;
  speed: number;
  size: number;
  opacity: number;
  symbol: '₿' | '⚡' | '▣';
  color: string;
  rotation: number;
  rotationSpeed: number;
  trail: { x: number; y: number; alpha: number }[];
}

interface RipplePulse {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

interface HashLine {
  x: number;
  y: number;
  text: string;
  speed: number;
  opacity: number;
  color: string;
}

const BTC_ORANGE = '#f97316';
const CYAN = '#22d3ee';
const GOLD = '#fbbf24';

const HASH_CHARS = '0123456789abcdef';
const SYMBOLS: Array<'₿' | '⚡' | '▣'> = ['₿', '⚡', '▣'];

function randomHex(len: number) {
  let s = '';
  for (let i = 0; i < len; i++) s += HASH_CHARS[Math.floor(Math.random() * HASH_CHARS.length)];
  return s;
}

export function DonateBitcoinAnimation({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let isVisible = true;

    // ─── Prefers reduced motion ───────────────────────────────────────────────
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) return;

    // ─── Resize ───────────────────────────────────────────────────────────────
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width || window.innerWidth || 1200;
      height = rect.height || window.innerHeight || 800;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    // ─── Falling sats ─────────────────────────────────────────────────────────
    const isMobile = () => width < 640;
    const satCount = () => (isMobile() ? 18 : 38);

    const makeSat = (startAtTop = false): FallingSat => {
      const colorPick = Math.random();
      const color = colorPick < 0.55 ? BTC_ORANGE : colorPick < 0.8 ? CYAN : GOLD;
      return {
        x: Math.random() * width,
        y: startAtTop ? -(Math.random() * height) : Math.random() * height,
        speed: 0.4 + Math.random() * 1.1,
        size: isMobile() ? 10 + Math.random() * 8 : 13 + Math.random() * 12,
        opacity: 0.15 + Math.random() * 0.55,
        symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        color,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
        trail: [],
      };
    };

    const sats: FallingSat[] = Array.from({ length: satCount() }, () => makeSat(true));

    // ─── Ripple pulses (spawn occasionally) ───────────────────────────────────
    const ripples: RipplePulse[] = [];

    const spawnRipple = () => {
      ripples.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0,
        maxRadius: 60 + Math.random() * 80,
        alpha: 0.7,
        color: Math.random() > 0.5 ? BTC_ORANGE : CYAN,
      });
    };

    let rippleTimer = 0;

    // ─── Scrolling hash lines (matrix-style, very faint) ─────────────────────
    const colCount = Math.floor(width / 24);
    const hashLines: HashLine[] = Array.from({ length: colCount }, (_, i) => ({
      x: i * 24 + 12,
      y: Math.random() * height,
      text: randomHex(1),
      speed: 0.3 + Math.random() * 0.6,
      opacity: 0.04 + Math.random() * 0.06,
      color: Math.random() > 0.6 ? BTC_ORANGE : CYAN,
    }));

    // ─── Animation loop ───────────────────────────────────────────────────────
    let lastTime = performance.now();

    const animate = (time: number) => {
      if (!isVisible) { animId = requestAnimationFrame(animate); return; }

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // 1. Faint hash rain (matrix-style hex digits falling)
      ctx.font = '11px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (const col of hashLines) {
        col.y += col.speed * dt * 60;
        if (col.y > height + 20) {
          col.y = -20;
          col.text = randomHex(1);
        }
        // Randomly refresh character
        if (Math.random() < 0.02) col.text = randomHex(1);

        ctx.fillStyle = col.color === BTC_ORANGE
          ? `rgba(249,115,22,${col.opacity})`
          : `rgba(34,211,238,${col.opacity})`;
        ctx.fillText(col.text, col.x, col.y);
      }

      // 2. Ripple pulses
      rippleTimer += dt;
      if (rippleTimer > 1.8) {
        spawnRipple();
        rippleTimer = 0;
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 60 * dt;
        r.alpha -= 1.2 * dt;

        if (r.alpha <= 0) { ripples.splice(i, 1); continue; }

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        const alpha = Math.max(0, r.alpha);
        ctx.strokeStyle = r.color === BTC_ORANGE
          ? `rgba(249,115,22,${alpha * 0.5})`
          : `rgba(34,211,238,${alpha * 0.5})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // 3. Falling Bitcoin / Lightning / Block symbols
      for (let i = 0; i < sats.length; i++) {
        const s = sats[i];
        s.y += s.speed * dt * 60;
        s.rotation += s.rotationSpeed;

        // Store trail
        s.trail.push({ x: s.x, y: s.y, alpha: s.opacity * 0.4 });
        if (s.trail.length > 8) s.trail.shift();

        // Recycle when off-screen
        if (s.y > height + s.size * 2) {
          sats[i] = makeSat(false);
          sats[i].y = -s.size * 2;
          continue;
        }

        // Draw faint trail
        for (let t = 0; t < s.trail.length; t++) {
          const pt = s.trail[t];
          const tAlpha = pt.alpha * (t / s.trail.length);
          ctx.save();
          ctx.translate(pt.x, pt.y);
          ctx.font = `bold ${s.size * 0.7}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const rgb = s.color === BTC_ORANGE ? '249,115,22'
            : s.color === CYAN ? '34,211,238'
            : '251,191,36';
          ctx.fillStyle = `rgba(${rgb},${tAlpha})`;
          ctx.fillText(s.symbol, 0, 0);
          ctx.restore();
        }

        // Draw main symbol
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);
        ctx.font = `bold ${s.size}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 14;
        ctx.globalAlpha = s.opacity;
        ctx.fillText(s.symbol, 0, 0);
        ctx.restore();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    const handleVisibility = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
    />
  );
}
