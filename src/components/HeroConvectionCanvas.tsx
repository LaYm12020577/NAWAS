"use client";

import React, { useRef, useEffect } from 'react';

interface HeroConvectionCanvasProps {
  theme?: 'light' | 'dark';
}

export default function HeroConvectionCanvas({ theme = 'dark' }: HeroConvectionCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const mouse: { x: number | null; y: number | null; radius: number } = { 
      x: null, 
      y: null, 
      radius: 250 
    };

    // Determine particle color based on current theme representation
    const getColors = () => {
      if (theme === 'dark') {
        return {
          particle: 'rgba(250, 204, 21, 0.85)', // Brighter yellow for background atmosphere
          line: 'rgba(250, 204, 21,'
        };
      } else {
        return {
          particle: 'rgba(0, 32, 69, 0.85)', // Radiant deep #002045 navy for light atmosphere
          line: 'rgba(0, 32, 69,'
        };
      }
    };

    class Particle {
      x: number;
      y: number;
      directionX: number;
      directionY: number;
      size: number;
      pulseSpeed: number;
      pulsePhase: number;

      constructor(x: number, y: number, directionX: number, directionY: number, size: number) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.pulseSpeed = 0.02 + Math.random() * 0.03;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      draw() {
        if (!ctx) return;
        const colors = getColors();
        ctx.beginPath();
        
        // Soft pulse effect for interactive molecules
        this.pulsePhase += this.pulseSpeed;
        const radiusPulse = this.size + Math.sin(this.pulsePhase) * 0.5;
        
        ctx.arc(this.x, this.y, Math.max(0.4, radiusPulse), 0, Math.PI * 2, false);
        ctx.fillStyle = colors.particle;
        ctx.fill();
      }

      update() {
        if (!canvas) return;

        // Bounce horizontally
        if (this.x > canvas.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        // Warm air recirculation: when rising past top edge, wrap and start at bottom representing convective recycle currents
        if (this.y < 0) {
          this.y = canvas.height;
          this.x = Math.random() * canvas.width;
        } else if (this.y > canvas.height) {
          this.directionY = -Math.abs(this.directionY);
        }

        // Elegant mouse repulsion (simulate aerodynamic airflow deflection code)
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            
            this.x -= forceDirectionX * force * 4.8;
            this.y -= forceDirectionY * force * 4.8;
          }
        }

        this.x += this.directionX * 1.0;
        this.y += this.directionY * 1.0;
        this.draw();
      }
    }

    function init() {
      if (!canvas) return;
      particles = [];
      
      // Determine count scaling relative to screen space - balanced elegant density (slightly increased)
      const countFactor = (canvas.width > 768) ? 1.0 : 0.75;
      const numberOfParticles = Math.floor(((canvas.height * canvas.width) / 8000) * countFactor);
      
      for (let i = 0; i < numberOfParticles; i++) {
        const size = (Math.random() * 2.2) + 0.6;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        
        // Gentle upward currents representing convection model
        const directionX = (Math.random() * 0.4) - 0.2;
        const directionY = -0.15 - Math.random() * 0.35; // Constantly rising slightly
        
        particles.push(new Particle(x, y, directionX, directionY, size));
      }
    }

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!canvas || !parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      init();
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const connect = () => {
      if (!canvas || !ctx) return;
      const colors = getColors();
      let opacityValue = 1;
      
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
            + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
          
          const maxConnectDistance = (canvas.width > 768) ? 115 * 115 : 80 * 80;
          
          if (distance < maxConnectDistance) {
            opacityValue = 1 - (distance / maxConnectDistance);
            
            // Clean connection transparency for elegant visible bonds
            const lineOpacity = opacityValue * (theme === 'light' ? 0.15 : 0.28);
            
            ctx.strokeStyle = `${colors.line}${lineOpacity})`;
            ctx.lineWidth = 0.95;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      if (!canvas || !ctx) return;
      animationFrameId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
      }
      connect();
    };

    // Listen to mousemove relative to absolute parent container wrapper
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };

    const handleMouseOut = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseleave', handleMouseOut);
    }

    init();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseleave', handleMouseOut);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  // Render a completely absolute canvas that floats beautifully
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full block pointer-events-none z-0"
    />
  );
}
