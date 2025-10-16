'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ScrambleText from './ScrambleText';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useRef, useEffect, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Vector class for gravity points
class Vector {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  static add(a: Vector, b: Vector): Vector {
    return new Vector(a.x + b.x, a.y + b.y);
  }

  static sub(a: Vector, b: Vector): Vector {
    return new Vector(a.x - b.x, a.y - b.y);
  }

  static scale(v: Vector, s: number): Vector {
    return v.clone().scale(s);
  }

  static random(): Vector {
    return new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1);
  }

  set(x: number | Vector, y?: number): Vector {
    if (typeof x === "object") {
      y = x.y;
      x = x.x;
    }
    this.x = x || 0;
    this.y = y || 0;
    return this;
  }

  add(v: Vector): Vector {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  sub(v: Vector): Vector {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  scale(s: number): Vector {
    this.x *= s;
    this.y *= s;
    return this;
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  lengthSq(): number {
    return this.x * this.x + this.y * this.y;
  }

  normalize(): Vector {
    const m = Math.sqrt(this.x * this.x + this.y * this.y);
    if (m) {
      this.x /= m;
      this.y /= m;
    }
    return this;
  }

  angle(): number {
    return Math.atan2(this.y, this.x);
  }

  angleTo(v: Vector): number {
    const dx = v.x - this.x;
    const dy = v.y - this.y;
    return Math.atan2(dy, dx);
  }

  distanceTo(v: Vector): number {
    const dx = v.x - this.x;
    const dy = v.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  distanceToSq(v: Vector): number {
    const dx = v.x - this.x;
    const dy = v.y - this.y;
    return dx * dx + dy * dy;
  }

  lerp(v: Vector, t: number): Vector {
    this.x += (v.x - this.x) * t;
    this.y += (v.y - this.y) * t;
    return this;
  }

  clone(): Vector {
    return new Vector(this.x, this.y);
  }

  toString(): string {
    return `(x:${this.x}, y:${this.y})`;
  }
}

// Gravity Point class
class GravityPoint extends Vector {
  radius: number;
  currentRadius: number;
  gravity: number = 0.05;
  isMouseOver: boolean = false;
  dragging: boolean = false;
  destroyed: boolean = false;
  _easeRadius: number = 0;
  _dragDistance: Vector | null = null;
  _collapsing: boolean = false;
  _speed: Vector = new Vector();
  _targets: {
    particles: Particle[];
    gravities: GravityPoint[];
  };

  static RADIUS_LIMIT = 65;
  static interferenceToPoint = true;

  constructor(x: number, y: number, radius: number, targets: { particles: Particle[]; gravities: GravityPoint[] }) {
    super(x, y);
    this.radius = radius;
    this.currentRadius = radius * 0.5;
    this._targets = targets;
  }

  hitTest(p: Vector): boolean {
    return this.distanceTo(p) < this.radius;
  }

  startDrag(dragStartPoint: Vector): void {
    this._dragDistance = Vector.sub(dragStartPoint, this);
    this.dragging = true;
  }

  drag(dragToPoint: Vector): void {
    if (this._dragDistance) {
      this.x = dragToPoint.x - this._dragDistance.x;
      this.y = dragToPoint.y - this._dragDistance.y;
    }
  }

  endDrag(): void {
    this._dragDistance = null;
    this.dragging = false;
  }

  addSpeed(d: Vector): void {
    this._speed = this._speed.add(d);
  }

  collapse(): void {
    this.currentRadius *= 1.75;
    this._collapsing = true;
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (this.destroyed) return;

    const particles = this._targets.particles;
    const gravities = this._targets.gravities;

    // Apply gravity to particles
    for (let i = 0; i < particles.length; i++) {
      particles[i].addSpeed(
        Vector.sub(this, particles[i]).normalize().scale(this.gravity)
      );
    }

    // Update radius
    this._easeRadius = (this._easeRadius + (this.radius - this.currentRadius) * 0.07) * 0.95;
    this.currentRadius += this._easeRadius;
    if (this.currentRadius < 0) this.currentRadius = 0;

    if (this._collapsing) {
      this.radius *= 0.75;
      if (this.currentRadius < 1) this.destroyed = true;
      this._draw(ctx);
      return;
    }

    // Handle gravity point interactions
    const area = this.radius * this.radius * Math.PI;
    for (let i = 0; i < gravities.length; i++) {
      const g = gravities[i];
      if (g === this || g.destroyed) continue;

      if (
        (this.currentRadius >= g.radius || this.dragging) &&
        this.distanceTo(g) < (this.currentRadius + g.radius) * 0.85
      ) {
        g.destroyed = true;
        this.gravity += g.gravity;

        const absorp = Vector.sub(g, this).scale((g.radius / this.radius) * 0.5);
        this.addSpeed(absorp);

        const garea = g.radius * g.radius * Math.PI;
        this.currentRadius = Math.sqrt((area + garea * 3) / Math.PI);
        this.radius = Math.sqrt((area + garea) / Math.PI);
      }

      g.addSpeed(Vector.sub(this, g).normalize().scale(this.gravity));
    }

    if (GravityPoint.interferenceToPoint && !this.dragging) {
      this.add(this._speed);
    }

    this._speed = new Vector();

    if (this.currentRadius > GravityPoint.RADIUS_LIMIT) {
      this.collapse();
    }

    this._draw(ctx);
  }

  _draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    // Outer glow
    const grd = ctx.createRadialGradient(
      this.x, this.y, this.radius,
      this.x, this.y, this.radius * 5
    );
    grd.addColorStop(0, "rgba(0, 0, 0, 0.1)");
    grd.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 5, 0, Math.PI * 2, false);
    ctx.fillStyle = grd;
    ctx.fill();

    // Inner core
    const r = Math.random() * this.currentRadius * 0.7 + this.currentRadius * 0.3;
    const grd2 = ctx.createRadialGradient(
      this.x, this.y, r,
      this.x, this.y, this.currentRadius
    );
    grd2.addColorStop(0, "rgba(0, 0, 0, 1)");
    grd2.addColorStop(1, Math.random() < 0.2 
      ? "rgba(0, 215, 107, 0.15)" 
      : "rgba(0, 215, 107, 0.75)");
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2, false);
    ctx.fillStyle = grd2;
    ctx.fill();

    ctx.restore();
  }
}

// Particle class
class Particle extends Vector {
  radius: number;
  _latest: Vector;
  _speed: Vector;

  constructor(x: number, y: number, radius: number) {
    super(x, y);
    this.radius = radius;
    this._latest = new Vector();
    this._speed = new Vector();
  }

  addSpeed(d: Vector): void {
    this._speed.add(d);
  }

  update(): void {
    if (this._speed.length() > 12) {
      this._speed.normalize().scale(12);
    }
    this._latest.set(this);
    this.add(this._speed);
  }
}

export default function ProcessSection() {
  const t = useTranslations('sections.process');
  const prefersReducedMotion = useReducedMotion();
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  // Canvas background refs
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bufferCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const mouseRef = useRef<Vector>(new Vector());

  const steps = [
    { key: 'meeting', number: '01' },
    { key: 'contract', number: '02' },
    { key: 'access', number: '03' },
    { key: 'implementation', number: '04' },
    { key: 'optimization', number: '05' }
  ];

  const cardBaseClass = 'process-card w-[720px] h-[580px] backdrop-blur-xl rounded-[3rem] shadow-2xl border border-white/10';
  
  // Modern card variants with glassmorphism effect
  const cardVariants = [
    'bg-gradient-to-br from-slate-800/80 to-slate-700/80 shadow-blue-500/20',
    'bg-gradient-to-br from-slate-800/80 to-slate-700/80 shadow-blue-400/20',
    'bg-gradient-to-br from-slate-800/80 to-slate-700/80 shadow-blue-300/20',
    'bg-gradient-to-br from-slate-800/80 to-slate-700/80 shadow-blue-200/20',
    'bg-gradient-to-br from-slate-800/80 to-slate-700/80 shadow-blue-100/20'
  ];

  // Random rotations and positions for scattered look
  const cardRotations = useMemo(() => [
    'rotate-[-3deg]',
    'rotate-[2deg]',
    'rotate-[-1.5deg]',
    'rotate-[2.5deg]',
    'rotate-[-2deg]'
  ], []);

  // Random X offsets for scattered positioning
  const cardOffsets = useMemo(() => [
    'translate-x-[-20px]',
    'translate-x-[30px]',
    'translate-x-[-15px]',
    'translate-x-[25px]',
    'translate-x-[-10px]'
  ], []);

  // Gravity Points Canvas System
  const initGravityCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const bufferCanvas = bufferCanvasRef.current;
    const container = sectionRef.current;
    if (!canvas || !bufferCanvas || !container) return;

    const ctx = canvas.getContext('2d');
    const bufferCtx = bufferCanvas.getContext('2d');
    if (!ctx || !bufferCtx) return;

    let screenWidth = 0;
    let screenHeight = 0;
    let grad: CanvasGradient;

    // Configuration
    const BACKGROUND_COLOR = "rgba(0, 0, 0, 0.8)";
    const PARTICLE_RADIUS = 1;
    const G_POINT_RADIUS = 10;
    const PARTICLE_NUM = 160; // slightly increased density

    const resize = () => {
      const rect = container.getBoundingClientRect();
      screenWidth = canvas.width = bufferCanvas.width = rect.width;
      screenHeight = canvas.height = bufferCanvas.height = rect.height;
      
      const cx = canvas.width * 0.5;
      const cy = canvas.height * 0.5;
      grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.sqrt(cx * cx + cy * cy));
      grad.addColorStop(0, "rgba(0, 0, 0, 0)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0.35)");
    };

    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    const particles: Particle[] = [];
    const addParticle = (num: number) => {
      for (let i = 0; i < num; i++) {
        const p = new Particle(
          Math.floor(Math.random() * (screenWidth - PARTICLE_RADIUS * 2)) + 1 + PARTICLE_RADIUS,
          Math.floor(Math.random() * (screenHeight - PARTICLE_RADIUS * 2)) + 1 + PARTICLE_RADIUS,
          PARTICLE_RADIUS
        );
        p.addSpeed(Vector.random());
        particles.push(p);
      }
    };

    // Initialize gravity points
    const gravities: GravityPoint[] = [];
    const addGravityPoint = (x: number, y: number) => {
      const newGravity = new GravityPoint(x, y, G_POINT_RADIUS, {
        particles: particles,
        gravities: gravities
      });
      gravities.push(newGravity);
      console.log('Added gravity point at:', x, y, 'Total gravities:', gravities.length);
    };

    // Add initial particles
    addParticle(PARTICLE_NUM);

    // Helper to add some gravity points near edges + a couple random
    const seedInitialGravityPoints = () => {
      const margin = 40; // px from the edges
      // Edge seeds
      addGravityPoint(margin, screenHeight * 0.25);
      addGravityPoint(screenWidth - margin, screenHeight * 0.35);
      addGravityPoint(screenWidth * 0.5, margin);
      addGravityPoint(screenWidth * 0.5, screenHeight - margin);
      // A couple random seeds
      for (let i = 0; i < 2; i++) {
        addGravityPoint(
          Math.random() * (screenWidth - margin * 2) + margin,
          Math.random() * (screenHeight - margin * 2) + margin
        );
      }
    };

    // Seed gravity points after a short delay to ensure canvas sizes are ready
    setTimeout(seedInitialGravityPoints, 100);

    // Mouse event handlers
    const mouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.set(e.clientX - rect.left, e.clientY - rect.top);

      let hit = false;
      for (let i = gravities.length - 1; i >= 0; i--) {
        const g = gravities[i];
        if ((!hit && g.hitTest(mouseRef.current)) || g.dragging) {
          g.isMouseOver = hit = true;
        } else {
          g.isMouseOver = false;
        }
      }

      container.style.cursor = hit ? "pointer" : "default";
    };

    const mouseDown = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mousePos = new Vector(e.clientX - rect.left, e.clientY - rect.top);
      console.log('Mouse down at:', mousePos.x, mousePos.y);

      for (let i = gravities.length - 1; i >= 0; i--) {
        if (gravities[i].isMouseOver) {
          console.log('Starting drag on gravity point');
          gravities[i].startDrag(mousePos);
          return;
        }
      }
      console.log('Creating new gravity point');
      addGravityPoint(mousePos.x, mousePos.y);
    };

    const mouseUp = () => {
      for (let i = 0; i < gravities.length; i++) {
        if (gravities[i].dragging) {
          gravities[i].endDrag();
          break;
        }
      }
    };

    const doubleClick = () => {
      for (let i = gravities.length - 1; i >= 0; i--) {
        if (gravities[i].isMouseOver) {
          gravities[i].collapse();
          break;
        }
      }
    };

    // Add event listeners on the whole section container
    container.addEventListener('mousemove', mouseMove);
    container.addEventListener('mousedown', mouseDown);
    container.addEventListener('mouseup', mouseUp);
    container.addEventListener('dblclick', doubleClick);

    // Animation loop
    const loop = () => {
      // Clear main canvas
      ctx.save();
      ctx.fillStyle = BACKGROUND_COLOR;
      ctx.fillRect(0, 0, screenWidth, screenHeight);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, screenWidth, screenHeight);
      ctx.restore();

      // Update and render gravity points
      for (let i = 0; i < gravities.length; i++) {
        const g = gravities[i];
        if (g.dragging) g.drag(mouseRef.current);
        g.render(ctx);
        if (g.destroyed) {
          gravities.splice(i, 1);
          i--;
        }
      }

      // Clear buffer with fade effect
      bufferCtx.save();
      bufferCtx.globalCompositeOperation = "destination-out";
      bufferCtx.globalAlpha = 0.35;
      bufferCtx.fillRect(0, 0, screenWidth, screenHeight);
      bufferCtx.restore();

      // Draw particles to buffer
      bufferCtx.save();
      bufferCtx.fillStyle = bufferCtx.strokeStyle = "#fff";
      bufferCtx.lineCap = bufferCtx.lineJoin = "round";
      bufferCtx.lineWidth = PARTICLE_RADIUS * 2;
      
      // Draw particle trails
      bufferCtx.beginPath();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.update();
        bufferCtx.moveTo(p.x, p.y);
        bufferCtx.lineTo(p._latest.x, p._latest.y);
      }
      bufferCtx.stroke();

      // Draw particle dots
      bufferCtx.beginPath();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        bufferCtx.moveTo(p.x, p.y);
        bufferCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
      }
      bufferCtx.fill();
      bufferCtx.restore();

      // Draw buffer to main canvas
      ctx.drawImage(bufferCanvas, 0, 0);

      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
      container.removeEventListener('mousemove', mouseMove);
      container.removeEventListener('mousedown', mouseDown);
      container.removeEventListener('mouseup', mouseUp);
      container.removeEventListener('dblclick', doubleClick);
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    return initGravityCanvas();
  }, [prefersReducedMotion, initGravityCanvas]);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const container = cardsContainerRef.current;
    if (!container) {
      return;
    }

    const ctx = gsap.context(() => {
      const cardWrappers = gsap.utils.toArray<HTMLElement>(
        container.querySelectorAll('.process-card-wrapper')
      );

      if (cardWrappers.length === 0) {
        return;
      }

      const cards = cardWrappers.map((wrapper) =>
        wrapper.querySelector<HTMLElement>('.process-card')
      );

      const existingCards = cards.filter((card): card is HTMLElement => Boolean(card));

      if (existingCards.length === 0) {
        return;
      }

      gsap.set(existingCards, { opacity: 1, yPercent: 0 });

      // Distance (in px) that keeps a card pinned before the next one takes over
      const stickDistance = 100;
      const lastCardTrigger = ScrollTrigger.create({
        trigger: cardWrappers[cardWrappers.length - 1],
        start: 'bottom bottom',
      });

      cardWrappers.forEach((wrapper, index) => {
        const card = cards[index];
        if (!card) {
          return;
        }

        ScrollTrigger.create({
          trigger: wrapper,
          start: 'center center',
          end: () => (lastCardTrigger.start || 0) + stickDistance,
          pin: true,
          pinSpacing: false,
          toggleActions: 'restart none none reverse',
          onEnter: () => {
            gsap.to(card, { 
              yPercent: 0, 
              rotation: cardRotations[index].replace('rotate-[', '').replace(']', '').replace('deg', ''),
              x: cardOffsets[index].replace('translate-x-[', '').replace(']', '').replace('px', ''),
              duration: 0.8, 
              ease: "power2.out",
              overwrite: 'auto' 
            });
          },
          onEnterBack: () => {
            gsap.to(card, { 
              yPercent: 0, 
              rotation: cardRotations[index].replace('rotate-[', '').replace(']', '').replace('deg', ''),
              x: cardOffsets[index].replace('translate-x-[', '').replace(']', '').replace('px', ''),
              duration: 0.8, 
              ease: "power2.out",
              overwrite: 'auto' 
            });
          },
        });
      });

      ScrollTrigger.refresh();
    }, container);

    return () => ctx.revert();
  }, [prefersReducedMotion, cardRotations, cardOffsets]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-black py-24 md:py-40 lg:py-48"
      id="process"
    >
      {/* Canvas background - behind content; events are attached to the section */}
      {!prefersReducedMotion && (
        <>
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full z-0 pointer-events-none"
            aria-hidden="true"
          />
          <canvas
            ref={bufferCanvasRef}
            className="absolute inset-0 w-full h-full z-0 pointer-events-none"
            aria-hidden="true"
            style={{ display: 'none' }}
          />
        </>
      )}

      {/* Foreground content */}
      <div className="relative z-10">

        {/* Container with same max-width as Hero */}
        <div className="w-full max-w-[1780px] mx-auto relative px-6 md:px-12 xl:px-0">
            {/* Top Section - Title and Description */}
            <div className="mb-20 lg:mb-32">
              {/* Main Title */}
              <div className="relative inline-block mb-8">
                <h1 
                  className="heading-main" 
                >
                  <div className="leading-tight">
                    <ScrambleText text="PROCES" applyScramble={false} />
                  </div>
                  <div className="leading-tight">
                    <ScrambleText text="SPOLUPRÁCE" applyScramble={false} />
                  </div>
                </h1>
              </div>
            </div>

            {/* Content Section - Description and CTA */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ 
                opacity: 1, 
                x: 0,
                transition: { duration: prefersReducedMotion ? 0 : 1, ease: "easeOut" }
              }}
              viewport={{ once: true }}
              className="flex justify-end mr-8 md:mr-16 lg:mr-24"
            >
              <div className="max-w-2xl text-left">
                {/* Description text */}
                <p className="text-white/90 text-xl md:text-2xl lg:text-3xl leading-relaxed font-lato text-left mb-8">
                  <ScrambleText text={t('description')} applyScramble={false} />
                </p>
                
                {/* CTA Button - Similar to Hero */}
                <div className="flex justify-start pointer-events-auto">
                  <motion.button
                    data-cal-namespace="strategy"
                    data-cal-link="team/em-core/strategy"
                    data-cal-origin="https://meet.expandmatrix.com"
                    data-cal-config='{"layout":"month_view"}'
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }}
                    whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
                    className="group relative inline-flex items-center gap-3 px-7 md:px-9 py-4 md:py-5 bg-gradient-to-r from-[#00d76b] to-[#00b85c] text-white font-semibold rounded-full hover:from-[#00e673] hover:to-[#00d76b] transition-all duration-300 transform hover:scale-105 hover:shadow-2xl text-base md:text-lg cursor-pointer font-lato" 
                  >
                    <span className="uppercase tracking-wide">
                      <ScrambleText text={t('cta')} applyScramble={false} />
                    </span>
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                    
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00d76b]/20 to-[#00b85c]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
      </div>

      {/* Layered process steps */}
      <section className="relative w-full overflow-hidden bg-transparent py-32 md:py-48 lg:py-64">
        <div
          ref={cardsContainerRef}
          className={`relative w-full ${prefersReducedMotion ? 'space-y-16' : ''}`}
        >
          {steps.map((step, index) => (
            <section
              key={step.key}
              className={`process-card-wrapper ${
                prefersReducedMotion ? 'relative' : 'flex min-h-screen items-center justify-center'
              }`}
            >
              <div
                className={`${cardBaseClass} ${cardVariants[index]} ${cardRotations[index]} ${cardOffsets[index]} transform-gpu transition-all duration-500 hover:scale-105 hover:rotate-0`}
              >
                <div className="p-16 h-full flex flex-col justify-between relative">
                  {/* Subtle inner glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-[3rem] pointer-events-none" />
                  
                  <div className="relative z-10">
                    {/* Step number with modern styling */}
                    <div className="inline-flex items-center gap-4 mb-8">
                      <div className="text-white/60 text-sm font-mono font-bold tracking-[0.2em] uppercase">
                        {step.number}
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent max-w-[120px]" />
                    </div>
                    
                    {/* Title with better spacing */}
                    <div className="text-white text-6xl font-bold font-lato mb-12 leading-[0.9] tracking-tight">
                      <ScrambleText text={t(`steps.${step.key}`)} applyScramble={false} />
                    </div>
                    
                    {/* Description with improved typography */}
                    <div className="text-white/80 text-xl leading-relaxed font-lato max-w-[500px]">
                      <ScrambleText text={t(`stepDescriptions.${step.key}`)} applyScramble={false} />
                    </div>
                  </div>

                  {/* Modern corner accent */}
                  <div className="absolute bottom-8 right-8 w-24 h-24 pointer-events-none">
                    <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-white/10 to-transparent rounded-full blur-xl" />
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </section>
    </section>
  );
}
