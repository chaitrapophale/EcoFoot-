import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

export const AmbientEnv: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const [butterflies, setButterflies] = useState<Array<{ id: number; x: number; y: number; scale: number; angle: number }>>([]);
  const [birds, setBirds] = useState<Array<{ id: number; x: number; y: number; targetY: number; speed: number; progress: number }>>([]);

  // Generate pollen / leaf particles on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const maxParticles = 60;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    // Create particles
    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle(canvas.width, canvas.height, true));
    }

    function createParticle(w: number, h: number, randomY = false): Particle {
      const isLeaf = Math.random() > 0.7;
      return {
        x: Math.random() * w,
        y: randomY ? Math.random() * h : h + 10,
        size: isLeaf ? Math.random() * 4 + 4 : Math.random() * 2 + 1,
        speedX: Math.random() * 0.6 - 0.3 + 0.1, // slight drift to the right
        speedY: -(Math.random() * 0.8 + 0.3),    // float upwards
        opacity: Math.random() * 0.5 + 0.2,
        color: isLeaf 
          ? (Math.random() > 0.5 ? '#10b981' : '#047857') // green leaf shades
          : '#fbbf24' // gold pollen
      };
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        // Apply wind/drift
        p.y += p.speedY;
        p.x += p.speedX;

        // Mouse avoidance/deflection
        if (mouseRef.current.active) {
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const force = (120 - dist) / 120;
            const angle = Math.atan2(dy, dx);
            p.x += Math.cos(angle) * force * 3;
            p.y += Math.sin(angle) * force * 3;
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;

        if (p.size > 3) {
          // Draw leaf shape
          ctx.ellipse(p.x, p.y, p.size, p.size / 2, Math.PI / 4, 0, Math.PI * 2);
        } else {
          // Draw pollen circle
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        }
        ctx.fill();

        // Recycle particles that float off-screen
        if (p.y < -10 || p.x < -10 || p.x > canvas.width + 10) {
          Object.assign(p, createParticle(canvas.width, canvas.height, false));
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Periodic butterfly movements
  useEffect(() => {
    // Generate initial butterflies
    const initialButterflies = Array.from({ length: 4 }).map((_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight * 0.8 + 100,
      scale: Math.random() * 0.3 + 0.7,
      angle: Math.random() * Math.PI * 2
    }));
    setButterflies(initialButterflies);

    const interval = setInterval(() => {
      setButterflies((prev) =>
        prev.map((b) => {
          // Float to a new nearby target position
          const dx = Math.sin(Date.now() * 0.001 + b.id) * 30;
          const dy = Math.cos(Date.now() * 0.0007 + b.id) * 20 - 5; // general upward tendency
          let nx = b.x + dx;
          let ny = b.y + dy;

          // Wrap boundaries
          if (nx < -50) nx = window.innerWidth + 50;
          if (nx > window.innerWidth + 50) nx = -50;
          if (ny < -50) ny = window.innerHeight * 0.8;
          if (ny > window.innerHeight) ny = 100;

          return {
            ...b,
            x: nx,
            y: ny,
            angle: Math.atan2(dy, dx)
          };
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Random swooping birds
  useEffect(() => {
    const triggerBird = () => {
      const id = Date.now();
      const startLeft = Math.random() > 0.5;
      const x = startLeft ? -100 : window.innerWidth + 100;
      const y = Math.random() * 150 + 50;
      const targetY = y + (Math.random() * 100 - 50);
      const speed = Math.random() * 0.002 + 0.001; // progress speed

      setBirds((prev) => [...prev, { id, x, y, targetY, speed, progress: startLeft ? 0 : 1 }]);
    };

    // Spawn bird every 15-25 seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.4) triggerBird();
    }, 20000);

    // Initial check/trigger
    triggerBird();

    const animInterval = setInterval(() => {
      setBirds((prev) =>
        prev
          .map((bird) => {
            const isMovingRight = bird.speed > 0;
            const progress = isMovingRight 
              ? bird.progress + bird.speed 
              : bird.progress - bird.speed;
            
            const currentX = progress * (window.innerWidth + 200) - 100;
            // Arc logic for swooping
            const currentY = bird.y + Math.sin(progress * Math.PI) * (bird.targetY - bird.y);

            return { ...bird, progress, x: currentX, y: currentY };
          })
          // Remove birds that complete their journey
          .filter((bird) => bird.progress >= 0 && bird.progress <= 1)
      );
    }, 30);

    return () => {
      clearInterval(interval);
      clearInterval(animInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Immersive Day/Night/Sky Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060c08] via-[#09150e] to-[#0c1811] transition-all duration-1000" />

      {/* Sunlight filtering down overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent opacity-60 animate-pulse-slow pointer-events-none" />

      {/* Cloud Layer 1 - High altitude, slow */}
      <div className="absolute top-[10%] left-0 w-[400px] h-[100px] opacity-10 bg-gradient-to-r from-transparent via-emerald-800 to-transparent blur-2xl animate-cloud-slow" />
      <div className="absolute top-[15%] left-[40%] w-[300px] h-[80px] opacity-15 bg-gradient-to-r from-transparent via-emerald-700 to-transparent blur-3xl animate-cloud-medium" />

      {/* River Graphics - Bottom flowing water */}
      <div className="absolute bottom-0 right-0 left-0 w-full h-[60px] opacity-20 pointer-events-none">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 74">
          <defs>
            <linearGradient id="river-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#047857" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#059669" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <path
            d="M0,32 C240,70 480,10 720,40 C960,70 1200,20 1440,50 L1440,74 L0,74 Z"
            fill="url(#river-grad)"
            className="transition-all duration-500"
          />
          {/* Animated river reflections */}
          <path
            d="M10,34 Q240,65 480,22 T960,45 T1430,48"
            stroke="#a7f3d0"
            strokeWidth="1.5"
            strokeDasharray="20 180"
            fill="none"
            strokeLinecap="round"
            className="animate-[dash_8s_linear_infinite]"
            style={{
              animation: 'river-flow 12s linear infinite'
            }}
          />
        </svg>
      </div>

      <style>{`
        @keyframes river-flow {
          0% { stroke-dashoffset: 400; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>

      {/* Floating Canvas Particles (Pollen, leaves) */}
      <canvas ref={canvasRef} className="absolute inset-0 block" />

      {/* Ambient Butterflies */}
      {butterflies.map((b) => (
        <div
          key={b.id}
          className="absolute transition-transform duration-100 pointer-events-none"
          style={{
            left: b.x,
            top: b.y,
            transform: `translate(-50%, -50%) scale(${b.scale}) rotate(${b.angle}rad)`
          }}
        >
          {/* Butterfly wings SVG */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-emerald-400">
            <path
              d="M12 10C11.5 5 7 2 4 4C2 6 2 10 7 11C4 13 2 17 4 19C7 21 11.5 17 12 12C12.5 17 17 21 20 19C22 17 22 13 17 11C22 10 22 6 20 4C17 2 12.5 5 12 10Z"
              fill="currentColor"
              fillOpacity="0.4"
              stroke="currentColor"
              strokeWidth="1"
              className="animate-[wing-flap_0.2s_ease-in-out_infinite]"
            />
            <circle cx="12" cy="11" r="1" fill="#fff" />
          </svg>
        </div>
      ))}

      {/* Swooping Birds */}
      {birds.map((bird) => (
        <div
          key={bird.id}
          className="absolute transition-transform duration-100 pointer-events-none"
          style={{
            left: bird.x,
            top: bird.y,
            transform: `translate(-50%, -50%) scale(0.6) scaleX(${bird.speed > 0 ? 1 : -1})`
          }}
        >
          {/* Bird SVG shape */}
          <svg width="40" height="30" viewBox="0 0 40 30" fill="none" className="text-emerald-950">
            <path
              d="M0,15 C8,10 16,0 20,10 C24,0 32,10 40,15 C30,17 25,25 20,15 C15,25 10,17 0,15 Z"
              fill="currentColor"
              stroke="#0f1f15"
              strokeWidth="1"
              className="animate-[bird-flap_0.4s_ease-in-out_infinite]"
            />
          </svg>
        </div>
      ))}

      <style>{`
        @keyframes wing-flap {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(0.2); }
        }
        @keyframes bird-flap {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.4) translateY(2px); }
        }
      `}</style>
    </div>
  );
};
