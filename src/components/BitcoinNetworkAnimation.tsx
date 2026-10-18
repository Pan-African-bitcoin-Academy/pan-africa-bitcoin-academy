'use client';

import { useEffect, useRef } from 'react';

interface ChainBlock {
  x: number;
  y: number;
  width: number;
  height: number;
  hash: string;
  chainIndex: number;
  pulsePhase: number;
}

interface BlockchainChain {
  blocks: ChainBlock[];
  vx: number;
  vy: number;
  angle: number;
  blockSpacing: number;
}

interface NetworkNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isBitcoinCore: boolean;
  pulsePhase: number;
}

export function BitcoinNetworkAnimation({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = 0;
    let height = 0;

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = canvas.width = rect.width || window.innerWidth || 1000;
      height = canvas.height = rect.height || window.innerHeight || 800;
    };

    resize();
    window.addEventListener('resize', resize);

    // --- 1. BLOCKCHAIN CHAINS AT DIFFERENT HEIGHTS AND DIRECTIONS ---
    const createChain = (
      originX: number,
      originY: number,
      count: number,
      vx: number,
      vy: number,
      angle: number,
      blockW: number,
      blockH: number,
      spacing: number
    ): BlockchainChain => {
      const blocks: ChainBlock[] = [];
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      for (let i = 0; i < count; i++) {
        const offset = i * (blockW + spacing);
        blocks.push({
          x: originX + offset * cosA,
          y: originY + offset * sinA,
          width: blockW,
          height: blockH,
          hash: Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0'),
          chainIndex: i,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }

      return { blocks, vx, vy, angle, blockSpacing: spacing };
    };

    const chains: BlockchainChain[] = [
      createChain(-120, height * 0.16, 6, 0.55, 0.08, 0.05, 58, 38, 30),
      createChain(width + 120, height * 0.38, 7, -0.65, -0.05, -0.04, 54, 35, 28),
      createChain(-150, height * 0.65, 8, 0.6, 0.06, 0.07, 60, 40, 32),
      createChain(width + 80, height * 0.88, 6, -0.52, 0.04, -0.05, 56, 36, 30),
    ];

    // --- 2. PEER-TO-PEER NETWORK NODES & BITCOIN CORE VALIDATORS ---
    const nodeCount = 28;
    const nodes: NetworkNode[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const isBitcoinCore = i % 3 === 0;
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: isBitcoinCore ? 20 : 6,
        isBitcoinCore,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // =========================================================================
      // RELATION LINK: VALIDATION BEAMS FROM BITCOIN CORE HUBS TO PASSING BLOCKS
      // =========================================================================
      // When a blockchain block comes within range of a Bitcoin Core Hub validator,
      // a dynamic, glowing verification beam locks on and streams verification pulses!
      const validationRange = 220;

      for (const node of nodes) {
        if (!node.isBitcoinCore) continue;

        for (const chain of chains) {
          for (const block of chain.blocks) {
            const dx = block.x - node.x;
            const dy = block.y - node.y;
            const dist = Math.hypot(dx, dy);

            if (dist < validationRange) {
              const strength = (1 - dist / validationRange);

              // 1. Dynamic Electric Mining/Validation Laser Beam
              ctx.beginPath();
              const laserGrad = ctx.createLinearGradient(node.x, node.y, block.x, block.y);
              laserGrad.addColorStop(0, `rgba(249, 115, 22, ${strength * 0.95})`);
              laserGrad.addColorStop(0.5, `rgba(251, 191, 36, ${strength * 0.9})`);
              laserGrad.addColorStop(1, `rgba(34, 211, 238, ${strength * 0.95})`);

              ctx.strokeStyle = laserGrad;
              ctx.lineWidth = 1.6 + strength * 1.8;
              ctx.setLineDash([4, 3]);
              ctx.lineDashOffset = -frame * 0.8;
              ctx.shadowColor = '#f97316';
              ctx.shadowBlur = 10;
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(block.x, block.y);
              ctx.stroke();
              ctx.setLineDash([]);
              ctx.shadowBlur = 0;

              // 2. High-speed cryptographic proof particle streaming into the block
              const laserPacketT = ((frame * 0.035 + block.chainIndex * 0.25) % 1);
              const lpx = node.x + dx * laserPacketT;
              const lpy = node.y + dy * laserPacketT;
              ctx.beginPath();
              ctx.arc(lpx, lpy, 3.5, 0, Math.PI * 2);
              ctx.fillStyle = '#fef08a';
              ctx.shadowColor = '#fbbf24';
              ctx.shadowBlur = 12;
              ctx.fill();
              ctx.shadowBlur = 0;

              // 3. Consensus resonance glow on the block while being verified
              ctx.save();
              ctx.translate(block.x, block.y);
              ctx.beginPath();
              ctx.arc(0, 0, block.width * 0.55, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(34, 211, 238, ${strength * 0.6})`;
              ctx.lineWidth = 1.5;
              ctx.shadowColor = '#22d3ee';
              ctx.shadowBlur = 8;
              ctx.stroke();
              ctx.restore();
            }
          }
        }
      }

      // ==========================================
      // A. PEER-TO-PEER NETWORK & ACTIVE PACKETS
      // ==========================================
      const maxDist = 180;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.65;
            ctx.beginPath();
            const grad = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
            grad.addColorStop(0, `rgba(249, 115, 22, ${alpha})`);
            grad.addColorStop(0.5, `rgba(251, 146, 60, ${alpha * 1.2})`);
            grad.addColorStop(1, `rgba(34, 211, 238, ${alpha})`);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.8;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();

            // Active transaction pulses traveling along the network links
            const pulseT = ((frame * 0.018 + (i * 3 + j * 7) * 0.1) % 1);
            const px = nodes[i].x + (nodes[j].x - nodes[i].x) * pulseT;
            const py = nodes[i].y + (nodes[j].y - nodes[i].y) * pulseT;
            ctx.beginPath();
            ctx.arc(px, py, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#f97316';
            ctx.shadowColor = '#f97316';
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      // ==========================================
      // B. BITCOIN CORE HUB NODES & PEER NODES
      // ==========================================
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        node.pulsePhase += 0.035;

        // Bounce/wrap around borders
        if (node.x < -40) node.x = width + 40;
        if (node.x > width + 40) node.x = -40;
        if (node.y < -40) node.y = height + 40;
        if (node.y > height + 40) node.y = -40;

        if (node.isBitcoinCore) {
          // Circular Bitcoin Hub with double glowing aura & ₿ symbol
          const pulse = Math.sin(node.pulsePhase) * 3;
          const currentR = node.radius + pulse;

          ctx.save();
          ctx.translate(node.x, node.y);

          // Outer glowing radar pulse ring
          ctx.beginPath();
          ctx.arc(0, 0, currentR * 1.6, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(249, 115, 22, 0.4)';
          ctx.lineWidth = 1.4;
          ctx.stroke();

          // Hub body
          ctx.beginPath();
          ctx.arc(0, 0, currentR, 0, Math.PI * 2);
          ctx.fillStyle = '#0a0a0c';
          ctx.strokeStyle = '#f97316';
          ctx.lineWidth = 2.5;
          ctx.shadowColor = '#f97316';
          ctx.shadowBlur = 18;
          ctx.fill();
          ctx.stroke();

          // Center Bitcoin "₿"
          ctx.font = 'bold 20px monospace, system-ui';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#fb923c';
          ctx.shadowColor = '#ea580c';
          ctx.shadowBlur = 10;
          ctx.fillText('₿', 0, 1);

          ctx.restore();
        } else {
          // Standard cyan validator node
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
          ctx.fillStyle = '#22d3ee';
          ctx.shadowColor = '#22d3ee';
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // ==========================================
      // C. BLOCKCHAIN CHAINS (LINKED BLOCKS WITH ₿)
      // ==========================================
      for (const chain of chains) {
        let minX = Infinity;
        let maxX = -Infinity;

        // Move all blocks along chain velocity
        for (const b of chain.blocks) {
          b.x += chain.vx;
          b.y += chain.vy;
          b.pulsePhase += 0.03;
          if (b.x < minX) minX = b.x;
          if (b.x > maxX) maxX = b.x;
        }

        const totalChainSpan = maxX - minX + 240;

        // Wrap moving Right: when passed width + 100, wrap to left
        if (chain.vx > 0 && minX > width + 100) {
          for (const b of chain.blocks) {
            b.x -= totalChainSpan + width;
          }
        }
        // Wrap moving Left: when passed -100, wrap to right
        if (chain.vx < 0 && maxX < -100) {
          for (const b of chain.blocks) {
            b.x += totalChainSpan + width;
          }
        }

        // 1. Draw heavy cryptographic link cables between blocks
        for (let i = 0; i < chain.blocks.length - 1; i++) {
          const b1 = chain.blocks[i];
          const b2 = chain.blocks[i + 1];

          // Chain connector lines
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(249, 115, 22, 0.85)';
          ctx.lineWidth = 3;
          ctx.shadowColor = 'rgba(249, 115, 22, 0.9)';
          ctx.shadowBlur = 8;
          ctx.moveTo(b1.x, b1.y);
          ctx.lineTo(b2.x, b2.y);
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Glowing cryptographic hash connector link dot
          const midX = (b1.x + b2.x) / 2;
          const midY = (b1.y + b2.y) / 2;
          ctx.beginPath();
          ctx.arc(midX, midY, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = '#22d3ee';
          ctx.shadowColor = '#22d3ee';
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // 2. Draw each Block in the Chain
        for (const b of chain.blocks) {
          ctx.save();
          ctx.translate(b.x, b.y);
          ctx.rotate(chain.angle);

          const rx = -b.width / 2;
          const ry = -b.height / 2;

          // Outer block glow
          ctx.shadowColor = 'rgba(249, 115, 22, 0.8)';
          ctx.shadowBlur = 14;

          // Solid dark block container
          ctx.fillStyle = '#09090b';
          ctx.strokeStyle = '#f97316';
          ctx.lineWidth = 2;

          ctx.beginPath();
          ctx.roundRect(rx, ry, b.width, b.height, 6);
          ctx.fill();
          ctx.stroke();

          // Block header stripe
          ctx.fillStyle = 'rgba(249, 115, 22, 0.25)';
          ctx.fillRect(rx + 2, ry + 2, b.width - 4, 10);

          // Block number text (e.g. #0, #1...)
          ctx.font = 'bold 8px monospace';
          ctx.fillStyle = '#38bdf8';
          ctx.textAlign = 'left';
          ctx.fillText(`#${b.chainIndex}`, rx + 5, ry + 9);

          // Prominent Bitcoin "₿" in block
          ctx.font = 'bold 15px monospace, system-ui';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#f97316';
          ctx.shadowColor = '#f97316';
          ctx.shadowBlur = 8;
          ctx.fillText('₿', 0, 5);

          ctx.restore();
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

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
