'use client';

import { useEffect, useRef } from 'react';

interface StaticHub {
  xPct: number;
  yPct: number;
  radius: number;
  pulsePhase: number;
  label: string;
}

interface PeerConnection {
  from: number;
  to: number;
  color: string;
}

interface MovingPacket {
  fromIdx: number;
  toIdx: number;
  progress: number;
  speed: number;
  size: number;
  type: 'tx' | 'block';
  color: string;
}

export function BitcoinP2PNetworkAnimation({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = 0;
    let height = 0;

    // Respect prefers-reduced-motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) return;

    const resize = () => {
      if (!canvas) return;
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

    // Static ₿ Bitcoin Nodes pinned in viewport percentage coordinates
    const staticHubs: StaticHub[] = [
      // Top section (Hero area)
      { xPct: 0.12, yPct: 0.16, radius: 28, pulsePhase: 0, label: 'Validator A' },
      { xPct: 0.88, yPct: 0.18, radius: 30, pulsePhase: 1.5, label: 'Validator B' },
      { xPct: 0.50, yPct: 0.28, radius: 26, pulsePhase: 2.8, label: 'Core Relay' },

      // Mid-upper section
      { xPct: 0.22, yPct: 0.44, radius: 27, pulsePhase: 0.9, label: 'Node C' },
      { xPct: 0.78, yPct: 0.46, radius: 29, pulsePhase: 2.1, label: 'Node D' },

      // Mid-lower section
      { xPct: 0.15, yPct: 0.68, radius: 28, pulsePhase: 1.2, label: 'Validator E' },
      { xPct: 0.85, yPct: 0.70, radius: 30, pulsePhase: 0.4, label: 'Validator F' },
      { xPct: 0.50, yPct: 0.62, radius: 25, pulsePhase: 2.4, label: 'Relay 02' },

      // Bottom section
      { xPct: 0.28, yPct: 0.88, radius: 27, pulsePhase: 1.8, label: 'Genesis Node' },
      { xPct: 0.72, yPct: 0.90, radius: 28, pulsePhase: 3.0, label: 'Node G' },
    ];

    // Peer connections connecting all ₿ nodes in a shared mesh
    const connections: PeerConnection[] = [
      { from: 0, to: 1, color: '#f97316' },
      { from: 0, to: 2, color: '#06b6d4' },
      { from: 1, to: 2, color: '#f97316' },
      { from: 0, to: 3, color: '#06b6d4' },
      { from: 1, to: 4, color: '#f97316' },
      { from: 2, to: 3, color: '#10b981' },
      { from: 2, to: 4, color: '#10b981' },
      { from: 3, to: 4, color: '#06b6d4' },
      { from: 3, to: 5, color: '#06b6d4' },
      { from: 4, to: 6, color: '#f97316' },
      { from: 3, to: 7, color: '#10b981' },
      { from: 4, to: 7, color: '#10b981' },
      { from: 5, to: 7, color: '#f97316' },
      { from: 6, to: 7, color: '#06b6d4' },
      { from: 5, to: 8, color: '#06b6d4' },
      { from: 6, to: 9, color: '#f97316' },
      { from: 7, to: 8, color: '#10b981' },
      { from: 7, to: 9, color: '#10b981' },
      { from: 8, to: 9, color: '#f97316' },
    ];

    // Moving data packets sharing blocks and transactions between ₿ hubs
    const packets: MovingPacket[] = [];
    const MAX_PACKETS = 26;

    const spawnPacket = () => {
      const conn = connections[Math.floor(Math.random() * connections.length)];
      const forward = Math.random() > 0.5;
      const fromIdx = forward ? conn.from : conn.to;
      const toIdx = forward ? conn.to : conn.from;
      const isBlock = Math.random() > 0.6;

      packets.push({
        fromIdx,
        toIdx,
        progress: 0,
        speed: 0.005 + Math.random() * 0.006,
        size: isBlock ? 6 : 4,
        type: isBlock ? 'block' : 'tx',
        color: isBlock ? '#f97316' : Math.random() > 0.5 ? '#06b6d4' : '#10b981',
      });
    };

    // Initialize packets at varying progress
    for (let i = 0; i < 18; i++) {
      const conn = connections[Math.floor(Math.random() * connections.length)];
      const forward = Math.random() > 0.5;
      const isBlock = Math.random() > 0.6;
      packets.push({
        fromIdx: forward ? conn.from : conn.to,
        toIdx: forward ? conn.to : conn.from,
        progress: Math.random(),
        speed: 0.005 + Math.random() * 0.006,
        size: isBlock ? 6 : 4,
        type: isBlock ? 'block' : 'tx',
        color: isBlock ? '#f97316' : Math.random() > 0.5 ? '#06b6d4' : '#10b981',
      });
    }

    let lastTime = performance.now();

    const animate = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // --- 1. DRAW P2P MESH CONNECTIONS ---
      for (const conn of connections) {
        const h1 = staticHubs[conn.from];
        const h2 = staticHubs[conn.to];
        if (!h1 || !h2) continue;

        const x1 = h1.xPct * width;
        const y1 = h1.yPct * height;
        const x2 = h2.xPct * width;
        const y2 = h2.yPct * height;

        // Base network link line
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Glowing active peer link gradient
        const linkGrad = ctx.createLinearGradient(x1, y1, x2, y2);
        linkGrad.addColorStop(0, `${conn.color}35`);
        linkGrad.addColorStop(0.5, `${conn.color}80`);
        linkGrad.addColorStop(1, `${conn.color}35`);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = linkGrad;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // --- 2. UPDATE & DRAW MOVING DATA PACKETS (SHARING ALONG PEER LINKS) ---
      if (packets.length < MAX_PACKETS && Math.random() < 0.12) {
        spawnPacket();
      }

      for (let i = packets.length - 1; i >= 0; i--) {
        const pkt = packets[i];
        pkt.progress += pkt.speed * (dt * 60);

        if (pkt.progress >= 1) {
          // Packet arrived at destination ₿ node -> trigger node pulse
          const dest = staticHubs[pkt.toIdx];
          if (dest) {
            dest.pulsePhase = Math.PI;
          }
          packets.splice(i, 1);
          continue;
        }

        const hFrom = staticHubs[pkt.fromIdx];
        const hTo = staticHubs[pkt.toIdx];
        if (!hFrom || !hTo) continue;

        const x1 = hFrom.xPct * width;
        const y1 = hFrom.yPct * height;
        const x2 = hTo.xPct * width;
        const y2 = hTo.yPct * height;

        const curX = x1 + (x2 - x1) * pkt.progress;
        const curY = y1 + (y2 - y1) * pkt.progress;

        // Streaming trail effect
        const trailLen = 0.08;
        const trailStartX = x1 + (x2 - x1) * Math.max(0, pkt.progress - trailLen);
        const trailStartY = y1 + (y2 - y1) * Math.max(0, pkt.progress - trailLen);

        const trailGrad = ctx.createLinearGradient(trailStartX, trailStartY, curX, curY);
        trailGrad.addColorStop(0, 'transparent');
        trailGrad.addColorStop(1, pkt.color);

        ctx.beginPath();
        ctx.moveTo(trailStartX, trailStartY);
        ctx.lineTo(curX, curY);
        ctx.strokeStyle = trailGrad;
        ctx.lineWidth = pkt.size;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Glowing packet head
        ctx.beginPath();
        ctx.arc(curX, curY, pkt.size * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = pkt.color;
        ctx.shadowColor = pkt.color;
        ctx.shadowBlur = 14;
        ctx.fill();
        ctx.shadowBlur = 0;

        // White hot center
        ctx.beginPath();
        ctx.arc(curX, curY, pkt.size * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }

      // --- 3. DRAW STATIC BITCOIN (₿) NODES ---
      for (const hub of staticHubs) {
        const cx = hub.xPct * width;
        const cy = hub.yPct * height;

        hub.pulsePhase = (hub.pulsePhase + 0.025) % (Math.PI * 2);
        const pulse = Math.sin(hub.pulsePhase);
        const dynamicRadius = hub.radius + pulse * 1.5;

        // Outer radar ping
        ctx.beginPath();
        ctx.arc(cx, cy, dynamicRadius * 1.7 + pulse * 4, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(249, 115, 22, ${0.15 + Math.max(0, pulse) * 0.25})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Middle cyan/orange glow ring
        ctx.beginPath();
        ctx.arc(cx, cy, dynamicRadius * 1.3, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(6, 182, 212, ${0.3 + Math.max(0, pulse) * 0.35})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Node dark body
        const grad = ctx.createRadialGradient(cx - 3, cy - 3, 2, cx, cy, dynamicRadius);
        grad.addColorStop(0, '#1e293b');
        grad.addColorStop(0.7, '#0f172a');
        grad.addColorStop(1, '#020617');

        ctx.beginPath();
        ctx.arc(cx, cy, dynamicRadius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.shadowColor = '#f97316';
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Node orange rim
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#f97316';
        ctx.stroke();

        // Inner ring
        ctx.beginPath();
        ctx.arc(cx, cy, dynamicRadius * 0.75, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Centered Bold ₿ Emblem
        ctx.save();
        ctx.font = `bold ${Math.round(hub.radius * 1.15)}px sans-serif`;
        ctx.fillStyle = '#f97316';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = '#f97316';
        ctx.shadowBlur = 12;
        ctx.fillText('₿', cx, cy + 1);
        ctx.restore();
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
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
