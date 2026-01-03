
import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  targetX?: number;
  targetY?: number;
  life: number;
}

export interface FireworkHandle {
  launch: (x: number) => void;
}

const FireworkCanvas = forwardRef<FireworkHandle>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  const colors = ['#ff0055', '#00ff88', '#0099ff', '#ffaa00', '#cc00ff', '#ffffff'];

  useImperativeHandle(ref, () => ({
    launch: (startX: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const targetY = canvas.height * 0.3;
      const targetX = startX;
      
      // Create explosion particles for "ACCEPT"
      createExplosion(targetX, targetY);
    }
  }));

  const createExplosion = (x: number, y: number) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 300;
    canvas.height = 100;
    ctx.font = 'bold 60px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ACCEPT', 150, 50);

    const imageData = ctx.getImageData(0, 0, 300, 100).data;
    const newParticles: Particle[] = [];
    const color = colors[Math.floor(Math.random() * colors.length)];

    for (let i = 0; i < 300; i += 6) {
      for (let j = 0; j < 100; j += 6) {
        const index = (j * 300 + i) * 4;
        if (imageData[index + 3] > 128) {
          newParticles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            targetX: x + (i - 150) * 1.5,
            targetY: y + (j - 50) * 1.5,
            alpha: 1,
            color: color,
            life: 100 + Math.random() * 50
          });
        }
      }
    }
    particlesRef.current.push(...newParticles);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        if (p.targetX !== undefined && p.targetY !== undefined) {
            // Move towards target for "ACCEPT" shape
            p.x += (p.targetX - p.x) * 0.1;
            p.y += (p.targetY - p.y) * 0.1;
            p.vx *= 0.9;
            p.vy *= 0.9;
        } else {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.05; // Gravity
        }

        p.life--;
        p.alpha = p.life / 100;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
      }

      animationRef.current = requestAnimationFrame(update);
    };

    update();
    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />;
});

export default FireworkCanvas;
