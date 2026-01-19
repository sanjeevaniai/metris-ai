import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
  pulsePhase: number;
}

interface Shard {
  x: number;
  y: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  opacity: number;
  speed: number;
}

interface Orb {
  x: number;
  y: number;
  radius: number;
  hue: number;
  opacity: number;
  pulseSpeed: number;
  phase: number;
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    let shards: Shard[] = [];
    let orbs: Orb[] = [];
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initParticles = () => {
      particles = [];
      const count = Math.floor((canvas.width * canvas.height) / 15000);
      
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2.5 + 0.5,
          opacity: Math.random() * 0.6 + 0.2,
          hue: Math.random() > 0.5 ? 168 : 188, // SANJEEVANI teal to cyan
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    const initShards = () => {
      shards = [];
      const count = Math.floor((canvas.width * canvas.height) / 60000);
      
      for (let i = 0; i < count; i++) {
        shards.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.015,
          size: Math.random() * 40 + 15,
          opacity: Math.random() * 0.12 + 0.03,
          speed: Math.random() * 0.3 + 0.15,
        });
      }
    };

    const initOrbs = () => {
      orbs = [];
      // Create 3-5 large floating orbs
      const count = Math.floor(Math.random() * 3) + 3;
      
      for (let i = 0; i < count; i++) {
        orbs.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 200 + 100,
          hue: Math.random() > 0.5 ? 168 : 188, // SANJEEVANI teal to cyan
          opacity: Math.random() * 0.08 + 0.04,
          pulseSpeed: Math.random() * 0.002 + 0.001,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    const drawOrb = (o: Orb, time: number) => {
      const pulse = Math.sin(time * o.pulseSpeed + o.phase) * 0.3 + 0.7;
      const currentRadius = o.radius * pulse;
      const currentOpacity = o.opacity * pulse;
      
      const gradient = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, currentRadius);
      gradient.addColorStop(0, `hsla(${o.hue}, 70%, 50%, ${currentOpacity})`);
      gradient.addColorStop(0.4, `hsla(${o.hue}, 70%, 50%, ${currentOpacity * 0.4})`);
      gradient.addColorStop(1, `hsla(${o.hue}, 70%, 50%, 0)`);
      
      ctx.beginPath();
      ctx.arc(o.x, o.y, currentRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    };

    const drawParticle = (p: Particle, time: number) => {
      const pulse = Math.sin(time * 0.003 + p.pulsePhase) * 0.3 + 0.7;
      const size = p.size * pulse;
      const opacity = p.opacity * pulse;
      
      // Draw glow
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 3);
      gradient.addColorStop(0, `hsla(${p.hue}, 80%, 60%, ${opacity})`);
      gradient.addColorStop(0.5, `hsla(${p.hue}, 70%, 50%, ${opacity * 0.3})`);
      gradient.addColorStop(1, `hsla(${p.hue}, 70%, 50%, 0)`);
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, size * 3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Draw core
      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${opacity})`;
      ctx.fill();
    };

    const drawShard = (s: Shard) => {
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rotation);
      
      ctx.beginPath();
      ctx.moveTo(0, -s.size / 2);
      ctx.lineTo(s.size / 3, s.size / 2);
      ctx.lineTo(-s.size / 3, s.size / 2);
      ctx.closePath();
      
      const gradient = ctx.createLinearGradient(0, -s.size / 2, 0, s.size / 2);
      gradient.addColorStop(0, `hsla(168, 76%, 55%, ${s.opacity})`);
      gradient.addColorStop(1, `hsla(188, 86%, 55%, ${s.opacity * 0.3})`);
      
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.restore();
    };

    const drawConnections = () => {
      const maxDist = 120;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.2;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `hsla(178, 78%, 50%, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    };

    const drawDiagonalBeams = (time: number) => {
      // Animated diagonal gradient beams
      const beamCount = 3;
      for (let i = 0; i < beamCount; i++) {
        const offset = (time * 0.0001 + i / beamCount) % 1;
        const x = canvas.width * offset * 1.5 - canvas.width * 0.25;
        
        const gradient = ctx.createLinearGradient(
          x, 0,
          x + canvas.width * 0.3, canvas.height
        );
        gradient.addColorStop(0, 'hsla(168, 76%, 50%, 0)');
        gradient.addColorStop(0.5, 'hsla(178, 78%, 50%, 0.04)');
        gradient.addColorStop(1, 'hsla(188, 86%, 53%, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    const update = () => {
      time++;
      
      // Update particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      // Update shards
      shards.forEach((s) => {
        s.y += s.speed;
        s.rotation += s.rotationSpeed;
        
        if (s.y > canvas.height + s.size) {
          s.y = -s.size;
          s.x = Math.random() * canvas.width;
        }
      });

      // Slowly move orbs
      orbs.forEach((o) => {
        o.x += Math.sin(time * 0.001 + o.phase) * 0.3;
        o.y += Math.cos(time * 0.0008 + o.phase) * 0.2;
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw animated diagonal beams
      drawDiagonalBeams(time);
      
      // Draw orbs first (background glow)
      orbs.forEach((o) => drawOrb(o, time));
      
      // Draw shards
      shards.forEach(drawShard);
      
      // Draw connections
      drawConnections();
      
      // Draw particles
      particles.forEach((p) => drawParticle(p, time));
    };

    const animate = () => {
      update();
      draw();
      animationId = requestAnimationFrame(animate);
    };

    resize();
    initParticles();
    initShards();
    initOrbs();
    animate();

    window.addEventListener('resize', () => {
      resize();
      initParticles();
      initShards();
      initOrbs();
    });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.8 }}
    />
  );
}