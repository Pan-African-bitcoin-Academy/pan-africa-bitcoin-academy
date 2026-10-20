'use client';

import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glowColor: string;
  pulsePhase: number;
  pulseSpeed: number;
}

interface Connection {
  from: number;
  to: number;
  dist: number;
}

interface TransactionParticle {
  fromIdx: number;
  toIdx: number;
  progress: number;
  speed: number;
  size: number;
  color: string;
}

export function ChaptersNetworkBackground({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = 0;
    let height = 0;
    let isReducedMotion = false;
    let isVisible = true;

    // Check system prefers-reduced-motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    isReducedMotion = motionQuery.matches;

    const handleMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotion = e.matches;
      if (isReducedMotion) {
        cancelAnimationFrame(animationId);
        renderStaticFrame();
      } else {
        lastTime = performance.now();
        animationId = requestAnimationFrame(animate);
      }
    };

    if (motionQuery.addEventListener) {
      motionQuery.addEventListener('change', handleMotionChange);
    } else {
      motionQuery.addListener(handleMotionChange);
    }

    const BITCOIN_ORANGE = '#F97602';
    const CYAN_ACCENT = '#06B6D4';

    let nodes: Node[] = [];
    let connections: Connection[] = [];
    let particles: TransactionParticle[] = [];

    const initNetwork = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width || window.innerWidth || 1200;
      height = rect.height || window.innerHeight || 800;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const isMobile = width < 640;
      const isTablet = width >= 640 && width < 1024;
      const nodeCount = isMobile ? 28 : isTablet ? 45 : 65;

      nodes = [];
      for (let i = 0; i < nodeCount; i++) {
        const rand = Math.random();
        const isOrange = rand < 0.72;
        const isCyan = !isOrange && rand < 0.94;

        const color = isOrange ? BITCOIN_ORANGE : isCyan ? CYAN_ACCENT : '#f8fafc';
        const glowColor = isOrange
          ? 'rgba(249, 118, 2, 0.5)'
          : isCyan
            ? 'rgba(6, 182, 212, 0.45)'
            : 'rgba(255, 255, 255, 0.35)';

        const speed = isMobile ? 0.12 : 0.16;
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          radius: isMobile ? 2.5 + Math.random() * 1.5 : 3 + Math.random() * 2,
          color,
          glowColor,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.02,
        });
      }

      rebuildConnections();

      particles = [];
      const particleCount = isMobile ? 6 : isTablet ? 12 : 18;
      for (let k = 0; k < particleCount; k++) {
        spawnInitialParticle();
      }
    };

    // Builds a guaranteed interconnected mesh network
    const rebuildConnections = () => {
      connections = [];
      const maxDist = width < 640 ? 170 : width < 1024 ? 220 : 260;
      const maxDistSq = maxDist * maxDist;

      const connectionSet = new Set<string>();

      // Ensure every node connects to its nearest 2-3 neighbors
      for (let i = 0; i < nodes.length; i++) {
        const neighbors: { index: number; distSq: number }[] = [];

        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            neighbors.push({ index: j, distSq });
          }
        }

        // Sort by distance and connect closest 2 neighbors
        neighbors.sort((a, b) => a.distSq - b.distSq);
        const toConnect = neighbors.slice(0, 3);

        for (const neighbor of toConnect) {
          const key = i < neighbor.index ? `${i}-${neighbor.index}` : `${neighbor.index}-${i}`;
          if (!connectionSet.has(key)) {
            connectionSet.add(key);
            connections.push({
              from: i,
              to: neighbor.index,
              dist: Math.sqrt(neighbor.distSq),
            });
          }
        }
      }
    };

    const spawnInitialParticle = () => {
      if (connections.length === 0) return;
      const conn = connections[Math.floor(Math.random() * connections.length)];
      const forward = Math.random() > 0.5;
      const from = forward ? conn.from : conn.to;
      const to = forward ? conn.to : conn.from;

      particles.push({
        fromIdx: from,
        toIdx: to,
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.004,
        size: Math.random() > 0.35 ? 2.5 : 3.5,
        color: Math.random() > 0.25 ? BITCOIN_ORANGE : CYAN_ACCENT,
      });
    };

    const spawnParticle = () => {
      if (connections.length === 0) return;
      const conn = connections[Math.floor(Math.random() * connections.length)];
      const forward = Math.random() > 0.5;
      const from = forward ? conn.from : conn.to;
      const to = forward ? conn.to : conn.from;

      particles.push({
        fromIdx: from,
        toIdx: to,
        progress: 0,
        speed: 0.003 + Math.random() * 0.004,
        size: Math.random() > 0.35 ? 2.5 : 3.5,
        color: Math.random() > 0.25 ? BITCOIN_ORANGE : CYAN_ACCENT,
      });
    };

    const renderStaticFrame = () => {
      ctx.clearRect(0, 0, width, height);
      rebuildConnections();

      const maxDist = width < 640 ? 170 : width < 1024 ? 220 : 260;

      // Draw connection lines
      for (const conn of connections) {
        const n1 = nodes[conn.from];
        const n2 = nodes[conn.to];
        if (!n1 || !n2) continue;

        const factor = Math.max(0, 1 - conn.dist / maxDist);
        const alpha = 0.15 + factor * 0.25;

        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.strokeStyle = n1.color === CYAN_ACCENT || n2.color === CYAN_ACCENT
          ? `rgba(6, 182, 212, ${alpha})`
          : `rgba(249, 118, 2, ${alpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Draw nodes
      for (const node of nodes) {
        // Outer glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = node.glowColor;
        ctx.fill();

        // Node center
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();
      }

      // Draw stationary Bitcoin ₿ markers on sample connections
      const sampleConns = connections.slice(0, 6);
      for (const conn of sampleConns) {
        const n1 = nodes[conn.from];
        const n2 = nodes[conn.to];
        if (!n1 || !n2) continue;
        const midX = (n1.x + n2.x) / 2;
        const midY = (n1.y + n2.y) / 2;

        ctx.save();
        ctx.font = 'bold 11px sans-serif';
        ctx.fillStyle = BITCOIN_ORANGE;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = BITCOIN_ORANGE;
        ctx.shadowBlur = 6;
        ctx.fillText('₿', midX, midY);
        ctx.restore();
      }
    };

    let lastTime = performance.now();

    const animate = (time: number) => {
      if (isReducedMotion || !isVisible) return;

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // 1. Move nodes smoothly
      const margin = 30;
      for (const node of nodes) {
        node.x += node.vx * (dt * 60);
        node.y += node.vy * (dt * 60);

        if (node.x < -margin) node.x = width + margin;
        else if (node.x > width + margin) node.x = -margin;

        if (node.y < -margin) node.y = height + margin;
        else if (node.y > height + margin) node.y = -margin;

        node.pulsePhase = (node.pulsePhase + node.pulseSpeed) % (Math.PI * 2);
      }

      // 2. Refresh interconnected mesh
      rebuildConnections();

      // 3. Draw interconnected network lines (clear, fine, luminous)
      const maxDist = width < 640 ? 170 : width < 1024 ? 220 : 260;
      for (const conn of connections) {
        const n1 = nodes[conn.from];
        const n2 = nodes[conn.to];
        if (!n1 || !n2) continue;

        const factor = Math.max(0, 1 - conn.dist / maxDist);
        const alpha = 0.12 + factor * 0.28;

        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);

        if (n1.color === CYAN_ACCENT || n2.color === CYAN_ACCENT) {
          ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
        } else {
          ctx.strokeStyle = `rgba(249, 118, 2, ${alpha})`;
        }
        ctx.lineWidth = 1.25;
        ctx.stroke();
      }

      // 4. Update & draw transaction particles moving along connection lines
      const isMobile = width < 640;
      const maxParticles = isMobile ? 8 : 20;

      if (particles.length < maxParticles && Math.random() < 0.08) {
        spawnParticle();
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.progress += p.speed * (dt * 60);

        if (p.progress >= 1) {
          particles.splice(i, 1);
          continue;
        }

        const nFrom = nodes[p.fromIdx];
        const nTo = nodes[p.toIdx];
        if (!nFrom || !nTo) {
          particles.splice(i, 1);
          continue;
        }

        const curX = nFrom.x + (nTo.x - nFrom.x) * p.progress;
        const curY = nFrom.y + (nTo.y - nFrom.y) * p.progress;

        // Fading stream trail
        const trailLen = 0.22;
        const trailStartX = nFrom.x + (nTo.x - nFrom.x) * Math.max(0, p.progress - trailLen);
        const trailStartY = nFrom.y + (nTo.y - nFrom.y) * Math.max(0, p.progress - trailLen);

        const trailGrad = ctx.createLinearGradient(trailStartX, trailStartY, curX, curY);
        trailGrad.addColorStop(0, 'transparent');
        trailGrad.addColorStop(1, p.color === BITCOIN_ORANGE ? 'rgba(249, 118, 2, 0.45)' : 'rgba(6, 182, 212, 0.45)');

        ctx.beginPath();
        ctx.moveTo(trailStartX, trailStartY);
        ctx.lineTo(curX, curY);
        ctx.strokeStyle = trailGrad;
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.stroke();

        // 1. Glowing circular badge for Bitcoin transaction
        const badgeRadius = isMobile ? 6.5 : 8;
        ctx.beginPath();
        ctx.arc(curX, curY, badgeRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#070b14';
        ctx.fill();

        ctx.lineWidth = 1.2;
        ctx.strokeStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // 2. Bold glowing Bitcoin "₿" symbol
        ctx.save();
        ctx.font = `bold ${isMobile ? 9 : 11}px sans-serif`;
        ctx.fillStyle = p.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fillText('₿', curX, curY + 0.5);
        ctx.restore();
      }

      // 5. Draw living nodes with breathing pulses
      for (const node of nodes) {
        const pulse = Math.sin(node.pulsePhase);
        const dynamicRadius = node.radius + pulse * 0.8;

        // Outer soft halo
        ctx.beginPath();
        ctx.arc(node.x, node.y, dynamicRadius * 2.4, 0, Math.PI * 2);
        ctx.fillStyle = node.glowColor;
        ctx.fill();

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, dynamicRadius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Core highlight
        ctx.beginPath();
        ctx.arc(node.x - dynamicRadius * 0.25, node.y - dynamicRadius * 0.25, dynamicRadius * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible && !isReducedMotion) {
        lastTime = performance.now();
        cancelAnimationFrame(animationId);
        animationId = requestAnimationFrame(animate);
      }
    };

    const handleResize = () => {
      initNetwork();
      if (isReducedMotion) {
        renderStaticFrame();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('resize', handleResize);

    initNetwork();
    if (isReducedMotion) {
      renderStaticFrame();
    } else {
      animationId = requestAnimationFrame(animate);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
      if (motionQuery.removeEventListener) {
        motionQuery.removeEventListener('change', handleMotionChange);
      } else {
        motionQuery.removeListener(handleMotionChange);
      }
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#070b14] ${className}`}
      aria-hidden="true"
    >
      {/* 1. Deep ambient radial glows behind the canvas */}
      <div
        className="absolute -top-40 left-1/4 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-orange-500/15 via-orange-500/5 to-transparent blur-3xl opacity-75"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 right-[-100px] h-[650px] w-[650px] rounded-full bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-cyan-500/12 via-cyan-500/4 to-transparent blur-3xl opacity-70"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[-100px] left-1/3 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent blur-3xl opacity-60"
        aria-hidden="true"
      />

      {/* 2. Canvas layer: clearly visible, crisp interconnected network lines and transaction nodes */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full block" />
    </div>
  );
}
