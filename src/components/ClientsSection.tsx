'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import ScrambleText from './ScrambleText';

interface BallConfig {
  id: number;
  icon: string;
  size: number;
}

interface BallState {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
  angle: number;
  angularVelocity: number;
  isDragging: boolean;
}

interface DragState {
  id: number;
  lastX: number;
  lastY: number;
  lastTime: number;
}

const FIXED_TIMESTEP = 1 / 120;
const GRAVITY = 2200; // px / s^2
const AIR_DRAG = 0.05;
const RESTITUTION = 0.86;
const FLOOR_RESTITUTION = 0.74;
const WALL_RESTITUTION = 0.82;
const GROUND_FRICTION = 0.84;
const SURFACE_FRICTION = 0.18;

export default function ClientsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef1 = useRef<HTMLDivElement>(null);
  const textRef2 = useRef<HTMLDivElement>(null);

  const animationRef = useRef<number | undefined>(undefined);
  const ballElementsRef = useRef(new Map<number, HTMLDivElement>());
  const ballStateRef = useRef(new Map<number, BallState>());
  const draggedBallRef = useRef<DragState | null>(null);
  const dimensionsRef = useRef({ width: 0, height: 0 });
  const greenPhysicsRef = useRef({ x: 0, y: 0, radius: 180 });

  const [isInViewport, setIsInViewport] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const ballConfigs = useMemo<BallConfig[]>(() => {
    const icons = ['💼', '🚀', '💡', '⚡', '🎯', '🌟', '🔥', '💎', '🎨', '🔧', '📊', '🎪'];

    return icons.map((icon, index) => {
      const size = 160; // Všechny koule mají stejnou větší velikost
      return {
        id: index,
        icon,
        size
      };
    });
  }, []);

  const registerBall = useCallback((id: number, element: HTMLDivElement | null) => {
    if (!element) {
      ballElementsRef.current.delete(id);
      return;
    }

    element.style.willChange = 'transform';
    ballElementsRef.current.set(id, element);
  }, []);

  const renderBalls = useCallback(() => {
    const states = ballStateRef.current;
    states.forEach((ball, id) => {
      const element = ballElementsRef.current.get(id);
      if (!element) {
        return;
      }

      element.style.transform = `translate3d(${ball.x - ball.radius}px, ${ball.y - ball.radius}px, 0) rotate(${ball.angle}rad)`;
    });
  }, []);

  // Resolve circle-circle collisions with impulse response and tangential friction.
  const resolveBallCollision = useCallback((a: BallState, b: BallState) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const distance = Math.hypot(dx, dy);
    const minDistance = a.radius + b.radius;

    if (distance === 0 || distance >= minDistance) {
      return;
    }

    const nx = dx / distance;
    const ny = dy / distance;
    const penetration = minDistance - distance;

    const inverseMassA = 1 / a.mass;
    const inverseMassB = 1 / b.mass;
    const totalInverseMass = inverseMassA + inverseMassB;

    const correctionFactor = (penetration / totalInverseMass) * 0.8;
    const correctionX = correctionFactor * nx;
    const correctionY = correctionFactor * ny;

    a.x -= correctionX * inverseMassA;
    a.y -= correctionY * inverseMassA;
    b.x += correctionX * inverseMassB;
    b.y += correctionY * inverseMassB;

    const relativeVx = b.vx - a.vx;
    const relativeVy = b.vy - a.vy;
    const velocityAlongNormal = relativeVx * nx + relativeVy * ny;

    if (velocityAlongNormal > 0) {
      return;
    }

    const impulseMagnitude = (-(1 + RESTITUTION) * velocityAlongNormal) / totalInverseMass;
    const impulseX = impulseMagnitude * nx;
    const impulseY = impulseMagnitude * ny;

    a.vx -= impulseX * inverseMassA;
    a.vy -= impulseY * inverseMassA;
    b.vx += impulseX * inverseMassB;
    b.vy += impulseY * inverseMassB;

    const tangentX = relativeVx - velocityAlongNormal * nx;
    const tangentY = relativeVy - velocityAlongNormal * ny;
    const tangentLength = Math.hypot(tangentX, tangentY);

    if (tangentLength > 0.0001) {
      const tx = tangentX / tangentLength;
      const ty = tangentY / tangentLength;
      const frictionImpulse = SURFACE_FRICTION * impulseMagnitude;
      const fx = frictionImpulse * tx;
      const fy = frictionImpulse * ty;

      a.vx -= fx * inverseMassA;
      a.vy -= fy * inverseMassA;
      b.vx += fx * inverseMassB;
      b.vy += fy * inverseMassB;
    }

    const tangentNormalX = -ny;
    const tangentNormalY = nx;
    const tangentialSpeedA = a.vx * tangentNormalX + a.vy * tangentNormalY;
    const tangentialSpeedB = b.vx * tangentNormalX + b.vy * tangentNormalY;
    a.angularVelocity = tangentialSpeedA / a.radius;
    b.angularVelocity = tangentialSpeedB / b.radius;
  }, []);

  const resolveGreenCollision = useCallback((ball: BallState) => {
    const { x, y, radius } = greenPhysicsRef.current;
    const dx = ball.x - x;
    const dy = ball.y - y;
    const distance = Math.hypot(dx, dy);
    const minDistance = radius + ball.radius;

    if (distance === 0 || distance >= minDistance) {
      return;
    }

    const nx = dx / distance;
    const ny = dy / distance;
    const penetration = minDistance - distance;

    ball.x += nx * penetration;
    ball.y += ny * penetration;

    const velocityAlongNormal = ball.vx * nx + ball.vy * ny;

    if (velocityAlongNormal < 0) {
      ball.vx -= (1 + RESTITUTION) * velocityAlongNormal * nx;
      ball.vy -= (1 + RESTITUTION) * velocityAlongNormal * ny;
    }

    const tangentX = -ny;
    const tangentY = nx;
    const tangentialSpeed = ball.vx * tangentX + ball.vy * tangentY;

    ball.vx -= tangentialSpeed * tangentX * SURFACE_FRICTION;
    ball.vy -= tangentialSpeed * tangentY * SURFACE_FRICTION;
    ball.angularVelocity = tangentialSpeed / ball.radius;
  }, []);

  // Integrate motion, apply forces, and resolve all collisions for a single time step.
  const updatePhysics = useCallback((dt: number) => {
    const { width, height } = dimensionsRef.current;
    if (!width || !height) {
      return;
    }

    const balls = Array.from(ballStateRef.current.values());

    balls.forEach((ball) => {
      if (ball.isDragging) {
        return;
      }

      ball.vy += GRAVITY * dt;
      ball.vx *= 1 - AIR_DRAG * dt;
      ball.vy *= 1 - AIR_DRAG * dt;

      ball.vx = Math.max(Math.min(ball.vx, 900), -900);
      ball.vy = Math.max(Math.min(ball.vy, 1200), -1200);

      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;

      if (ball.x - ball.radius < 0) {
        ball.x = ball.radius;
        ball.vx = Math.abs(ball.vx) * WALL_RESTITUTION;
      } else if (ball.x + ball.radius > width) {
        ball.x = width - ball.radius;
        ball.vx = -Math.abs(ball.vx) * WALL_RESTITUTION;
      }

      if (ball.y + ball.radius > height) {
        ball.y = height - ball.radius;
        if (Math.abs(ball.vy) < 20) {
          ball.vy = 0;
        } else {
          ball.vy = -Math.abs(ball.vy) * FLOOR_RESTITUTION;
        }
        ball.vx *= GROUND_FRICTION;
        ball.angularVelocity = ball.vx / ball.radius;
      } else if (ball.y - ball.radius < 0) {
        ball.y = ball.radius;
        ball.vy = Math.abs(ball.vy) * RESTITUTION * 0.6;
      }
    });

    for (let i = 0; i < balls.length; i += 1) {
      for (let j = i + 1; j < balls.length; j += 1) {
        resolveBallCollision(balls[i], balls[j]);
      }
    }

    balls.forEach(resolveGreenCollision);

    balls.forEach((ball) => {
      if (!ball.isDragging) {
        ball.angle += ball.angularVelocity * dt;
        ball.angularVelocity *= 0.985;
      }
    });
  }, [resolveBallCollision, resolveGreenCollision]);

  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }
  }, []);

  // Fixed-step integrator keeps the simulation stable regardless of frame rate.
  const startAnimation = useCallback(() => {
    if (prefersReducedMotion || !isInViewport || animationRef.current) {
      return;
    }

    let lastTime = performance.now();
    let accumulator = 0;

    const loop = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      accumulator += delta;

      while (accumulator >= FIXED_TIMESTEP) {
        updatePhysics(FIXED_TIMESTEP);
        accumulator -= FIXED_TIMESTEP;
      }

      renderBalls();
      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame((time) => {
      lastTime = time;
      loop(time);
    });
  }, [isInViewport, prefersReducedMotion, renderBalls, updatePhysics]);

  // Measure the container and seed every ball with deterministic yet varied initial state.
  const initializeBalls = useCallback(() => {
    if (!containerRef.current) {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    dimensionsRef.current = { width: rect.width, height: rect.height };

    const green = {
      width: 360,
      height: 360,
      topRatio: 0.45
    } as const;

    greenPhysicsRef.current = {
      x: rect.width / 2,
      y: rect.height * green.topRatio,
      radius: green.width / 2
    };

    const newStates = new Map<number, BallState>();

    ballConfigs.forEach((config) => {
      const radius = config.size / 2;
      const x = Math.min(
        Math.max(radius, rect.width * 0.15 + Math.random() * rect.width * 0.7),
        rect.width - radius
      );
      const y = Math.min(
        Math.max(radius, rect.height * 0.1 + Math.random() * rect.height * 0.25),
        rect.height - radius * 1.5
      );
      const vx = (Math.random() - 0.5) * 220;
      const vy = Math.random() * -120;

      newStates.set(config.id, {
        id: config.id,
        x,
        y,
        vx,
        vy,
        radius,
        mass: radius * radius,
        angle: 0,
        angularVelocity: 0,
        isDragging: false
      });

      const element = ballElementsRef.current.get(config.id);
      if (element) {
        element.style.width = `${config.size}px`;
        element.style.height = `${config.size}px`;
        element.style.opacity = '1';
      }
    });

    ballStateRef.current = newStates;
    renderBalls();
  }, [ballConfigs, renderBalls]);

  const handlePointerPosition = useCallback(
    (event: PointerEvent | ReactPointerEvent<Element>) => {
      if (!containerRef.current) {
        return { x: 0, y: 0 };
      }

      const rect = containerRef.current.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
    },
    []
  );

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!isInViewport) {
        return;
      }

      const { x, y } = handlePointerPosition(event);
      const balls = Array.from(ballStateRef.current.values());

      for (let i = balls.length - 1; i >= 0; i -= 1) {
        const ball = balls[i];
        const dx = x - ball.x;
        const dy = y - ball.y;
        if (Math.hypot(dx, dy) <= ball.radius) {
          event.preventDefault();
          ball.isDragging = true;
          ball.vx = 0;
          ball.vy = 0;
          draggedBallRef.current = {
            id: ball.id,
            lastX: x,
            lastY: y,
            lastTime: event.timeStamp
          };
          break;
        }
      }
    },
    [handlePointerPosition, isInViewport]
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const dragState = draggedBallRef.current;
      if (!dragState) {
        return;
      }

      const ball = ballStateRef.current.get(dragState.id);
      if (!ball) {
        return;
      }

      const { x, y } = handlePointerPosition(event);
      const dt = Math.max((event.timeStamp - dragState.lastTime) / 1000, 0.001);

      ball.x = x;
      ball.y = y;
      ball.vx = (x - dragState.lastX) / dt;
      ball.vy = (y - dragState.lastY) / dt;

      dragState.lastX = x;
      dragState.lastY = y;
      dragState.lastTime = event.timeStamp;

      renderBalls();
    },
    [handlePointerPosition, renderBalls]
  );

  const handlePointerUp = useCallback(() => {
    const dragState = draggedBallRef.current;
    if (!dragState) {
      return;
    }

    const ball = ballStateRef.current.get(dragState.id);
    if (ball) {
      ball.isDragging = false;
    }

    draggedBallRef.current = null;
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // Wait for elements to be registered before initializing
    const timer = setTimeout(() => {
      if (ballElementsRef.current.size > 0) {
        initializeBalls();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [initializeBalls]);

  useEffect(() => {
    if (prefersReducedMotion || !isInViewport) {
      stopAnimation();
      return () => undefined;
    }

    startAnimation();
    return () => stopAnimation();
  }, [isInViewport, prefersReducedMotion, startAnimation, stopAnimation]);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const handleResize = () => {
      stopAnimation();
      initializeBalls();
      startAnimation();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initializeBalls, prefersReducedMotion, startAnimation, stopAnimation]);

  useEffect(() => {
    if (prefersReducedMotion || !textRef1.current || !textRef2.current || !sectionRef.current) {
      return;
    }

    const textElement1 = textRef1.current;
    const textElement2 = textRef2.current;
    const sectionElement = sectionRef.current;

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const sectionTop = sectionElement.offsetTop;
      const sectionHeight = sectionElement.offsetHeight;
      const delay = windowHeight * 0.08;

      if (sectionTop <= scrollTop + windowHeight - delay && sectionTop + sectionHeight >= scrollTop) {
        const progress = Math.min(
          1,
          Math.max(
            0,
            (scrollTop + windowHeight - sectionTop - delay - sectionHeight * 0.08) /
              sectionHeight
          )
        );

        const easing = 1 - Math.pow(1 - progress, 3);
        const textWidth = 460;
        const ballRadius = greenPhysicsRef.current.radius;
        const distance = ballRadius + textWidth / 2;

        const offset1 = distance - easing * (distance + 90);
        const offset2 = -distance + easing * (distance + 90);

        textElement1.style.transform = `translateX(${offset1}px)`;
        textElement2.style.transform = `translateX(${offset2}px)`;
      } else {
        const textWidth = 460;
        const ballRadius = greenPhysicsRef.current.radius;
        textElement1.style.transform = `translateX(${ballRadius + textWidth / 2}px)`;
        textElement2.style.transform = `translateX(${-(ballRadius + textWidth / 2)}px)`;
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prefersReducedMotion]);

  useEffect(() => {
    const section = containerRef.current;
    if (!section) {
      return;
    }

    const handlePointerCancel = () => handlePointerUp();

    section.addEventListener('pointerup', handlePointerCancel);
    section.addEventListener('pointercancel', handlePointerCancel);

    return () => {
      section.removeEventListener('pointerup', handlePointerCancel);
      section.removeEventListener('pointercancel', handlePointerCancel);
    };
  }, [handlePointerUp]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-black min-h-[90vh] py-24 md:py-32"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 left-0 w-[480px] h-full blur-3xl opacity-30"
          style={{ background: 'linear-gradient(135deg, rgba(0, 215, 107, 0.22) 0%, rgba(0, 184, 92, 0.12) 55%, transparent 100%)' }}
        />
        <div
          className="absolute bottom-[-25%] right-[-18%] w-[560px] h-[560px] rounded-full blur-3xl opacity-35"
          style={{ background: 'radial-gradient(circle, rgba(0, 215, 107, 0.22) 0%, rgba(0, 215, 107, 0.08) 45%, transparent 70%)' }}
        />
        <div
          className="absolute top-[28%] right-[12%] w-[320px] h-[320px] rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(0, 215, 107, 0.18) 0%, transparent 65%)' }}
        />
        <div
          className="absolute top-[-18%] left-[22%] w-[260px] h-[260px] rounded-full blur-3xl opacity-28"
          style={{ background: 'radial-gradient(circle, rgba(0, 215, 107, 0.14) 0%, transparent 60%)' }}
        />
      </div>

      <div
        ref={containerRef}
        className="absolute inset-0"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{ touchAction: 'none', userSelect: 'none' }}
      >
        {ballConfigs.map((ball) => (
          <div
            key={ball.id}
            ref={(element) => registerBall(ball.id, element)}
            className="absolute rounded-full cursor-grab select-none group"
            style={{
              width: ball.size,
              height: ball.size,
              transform: 'translate3d(-9999px, -9999px, 0)',
              opacity: 0,
              transition: prefersReducedMotion ? 'transform 0.3s ease' : 'none',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              background:
                'radial-gradient(40% 40% at 30% 25%, rgba(255,255,255,0.88) 0%, rgba(250,250,250,0.72) 45%, rgba(240,240,240,0.62) 70%, rgba(232,232,232,0.52) 100%),' +
                'radial-gradient(80% 80% at 70% 70%, rgba(255,255,255,0.25) 0%, rgba(245,245,245,0.16) 60%, rgba(235,235,235,0.08) 100%)',
              boxShadow: '0 18px 44px rgba(0,0,0,0.18), 0 8px 22px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(0,0,0,0.08)'
            }}
          >
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ boxShadow: 'inset 0 0 32px rgba(255,255,255,0.24), inset 0 0 64px rgba(255,255,255,0.12)' }}
            />
            <div
              className="absolute inset-0 flex items-center justify-center text-5xl md:text-6xl select-none pointer-events-none"
              style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.25)', filter: 'drop-shadow(0 0 8px rgba(0, 215, 107, 0.2))' }}
            >
              {ball.icon}
            </div>
            <div
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(0, 215, 107, 0.12) 0%, transparent 70%)', boxShadow: '0 0 36px rgba(0, 215, 107, 0.28)' }}
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div
          className="relative rounded-full overflow-hidden shadow-2xl flex items-center justify-center"
          style={{
            width: '360px',
            height: '360px',
            background: 'linear-gradient(135deg, #00d76b, #00b85c)',
            position: 'absolute',
            left: '50%',
            top: '45%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[#00d76b] to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[#00d76b] to-transparent z-10" />

          <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden">
            <div
              ref={textRef1}
              className="text-white font-medium uppercase font-lato whitespace-nowrap text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
              style={{
                letterSpacing: '0.1em',
                transform: 'translateX(0px)',
                fontWeight: 600,
                lineHeight: 1.1
              }}
            >
              <ScrambleText text="NAŠI PARTNEŘI" applyScramble={false} />
            </div>
            <div
              ref={textRef2}
              className="text-white font-medium uppercase font-lato whitespace-nowrap text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
              style={{
                letterSpacing: '0.1em',
                transform: 'translateX(0px)',
                fontWeight: 400,
                lineHeight: 1.1,
                marginTop: '-0.1em'
              }}
            >
              <ScrambleText text="NAŠI PARTNEŘI" applyScramble={false} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
