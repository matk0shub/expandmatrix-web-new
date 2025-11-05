'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { useTranslations } from 'next-intl';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { NormalizedPartner } from '@/types/partners';

interface PartnerBallContent {
  src: string;
  alt: string;
  scale?: number;
}

interface BallConfig {
  id: number;
  partnerId: string;
  content: PartnerBallContent;
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

const FIXED_TIMESTEP = 1 / 90;
const GRAVITY = 2200; // px / s^2
const AIR_DRAG = 0.05;
const RESTITUTION = 0.86;
const FLOOR_RESTITUTION = 0.74;
const WALL_RESTITUTION = 0.82;
const GROUND_FRICTION = 0.84;
const SURFACE_FRICTION = 0.18;

interface ClientsSectionProps {
  partners?: NormalizedPartner[];
}

export default function ClientsSection({ partners = [] }: ClientsSectionProps) {
  const t = useTranslations('sections.clients');
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const animationRef = useRef<number | undefined>(undefined);
  const ballElementsRef = useRef(new Map<number, HTMLDivElement>());
  const ballStateRef = useRef(new Map<number, BallState>());
  const draggedBallRef = useRef<DragState | null>(null);
  const dimensionsRef = useRef({ width: 0, height: 0 });
const greenPhysicsRef = useRef({ x: 0, y: 0, radius: 135 });
  const ballSizeRef = useRef(160);
  const physicsConfigRef = useRef({ maxVx: 900, maxVy: 1200 });

  const [isInViewport, setIsInViewport] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const partnerCount = Math.max(partners.length, 0);
  const [layout, setLayout] = useState(() => ({
    ballSize: 160,
    greenRadius: 180,
    topRatio: 0.45,
    sectionMinHeight: 720,
    ballCount: Math.max(partnerCount, 1),
  }));
  const clampValue = useCallback(
    (value: number, min: number, max: number) => Math.min(Math.max(value, min), max),
    []
  );

  const ballConfigs = useMemo<BallConfig[]>(() => {
    if (!partners.length) {
      return [];
    }

    return partners.map((partner, index) => ({
      id: index,
      partnerId: partner.id,
      content: {
        src: partner.logo.url,
        alt: partner.logo.alt ?? partner.name,
        scale: partner.scale,
      },
    }));
  }, [partners]);

  const computeResponsiveValues = useCallback(
    (width: number, height: number) => {
      const baseConfig = {
        ballScale: 0.2,
        ballMin: 80,
        ballMax: 150,
        greenScale: 0.28,
        greenMin: 120,
        greenMax: 200,
        topBase: 0.4,
        topSlope: 0.00005,
        topMin: 0.38,
        topMax: 0.48,
        sectionMultiplier: 1.02,
        viewportMultiplier: 0.68,
        sectionMin: 520,
        sectionMax: 820,
        horizontalPaddingScale: 0.12,
        horizontalPaddingMin: 36,
        horizontalPaddingMax: 132,
        verticalPaddingTopScale: 0.11,
        verticalPaddingTopMin: 34,
        verticalPaddingTopMax: 114,
        verticalPaddingBottomScale: 0.22,
        verticalPaddingBottomMin: 102,
        verticalPaddingBottomMax: 210,
        ballCount: 11,
        velocityHorizontalScale: 0.22,
        velocityHorizontalMin: 100,
        velocityHorizontalMax: 210,
        velocityVerticalScale: 0.19,
        velocityVerticalMin: 68,
        velocityVerticalMax: 140,
        maxVelocity: { x: 860, y: 1120 }
      };

      const largeConfig = {
        ballScale: 0.19,
        ballMin: 74,
        ballMax: 140,
        greenScale: 0.3,
        greenMin: 130,
        greenMax: 205,
        topBase: 0.41,
        topSlope: 0.00005,
        topMin: 0.39,
        topMax: 0.49,
        sectionMultiplier: 1.08,
        viewportMultiplier: 0.7,
        sectionMin: 540,
        sectionMax: 840,
        horizontalPaddingScale: 0.11,
        horizontalPaddingMin: 34,
        horizontalPaddingMax: 124,
        verticalPaddingTopScale: 0.1,
        verticalPaddingTopMin: 32,
        verticalPaddingTopMax: 110,
        verticalPaddingBottomScale: 0.2,
        verticalPaddingBottomMin: 100,
        verticalPaddingBottomMax: 200,
        ballCount: 10,
        velocityHorizontalScale: 0.2,
        velocityHorizontalMin: 92,
        velocityHorizontalMax: 190,
        velocityVerticalScale: 0.18,
        velocityVerticalMin: 62,
        velocityVerticalMax: 128,
        maxVelocity: { x: 780, y: 1040 }
      };

      const tabletConfig = {
        ballScale: 0.22,
        ballMin: 68,
        ballMax: 120,
        greenScale: 0.32,
        greenMin: 120,
        greenMax: 190,
        topBase: 0.43,
        topSlope: 0.00008,
        topMin: 0.4,
        topMax: 0.5,
        sectionMultiplier: 1.14,
        viewportMultiplier: 0.74,
        sectionMin: 520,
        sectionMax: 820,
        horizontalPaddingScale: 0.1,
        horizontalPaddingMin: 30,
        horizontalPaddingMax: 106,
        verticalPaddingTopScale: 0.095,
        verticalPaddingTopMin: 28,
        verticalPaddingTopMax: 104,
        verticalPaddingBottomScale: 0.19,
        verticalPaddingBottomMin: 92,
        verticalPaddingBottomMax: 190,
        ballCount: 8,
        velocityHorizontalScale: 0.18,
        velocityHorizontalMin: 86,
        velocityHorizontalMax: 164,
        velocityVerticalScale: 0.17,
        velocityVerticalMin: 56,
        velocityVerticalMax: 120,
        maxVelocity: { x: 700, y: 960 }
      };

      const mobileConfig = {
        ballScale: 0.16,
        ballMin: 38,
        ballMax: 68,
        greenScale: 0.18,
        greenMin: 64,
        greenMax: 104,
        topBase: 0.46,
        topSlope: 0.0001,
        topMin: 0.44,
        topMax: 0.54,
        sectionMultiplier: 1.18,
        viewportMultiplier: 0.72,
        sectionMin: 460,
        sectionMax: 680,
        horizontalPaddingScale: 0.08,
        horizontalPaddingMin: 20,
        horizontalPaddingMax: 70,
        verticalPaddingTopScale: 0.09,
        verticalPaddingTopMin: 24,
        verticalPaddingTopMax: 74,
        verticalPaddingBottomScale: 0.2,
        verticalPaddingBottomMin: 86,
        verticalPaddingBottomMax: 170,
        ballCount: 6,
        velocityHorizontalScale: 0.16,
        velocityHorizontalMin: 66,
        velocityHorizontalMax: 134,
        velocityVerticalScale: 0.16,
        velocityVerticalMin: 48,
        velocityVerticalMax: 106,
        maxVelocity: { x: 600, y: 820 }
      };

      let config = baseConfig;

      // Treat wider small devices as mobile to shrink the circle more aggressively
      if (width <= 600) {
        config = mobileConfig;
      } else if (width <= 834) {
        config = tabletConfig;
      } else if (width <= 1180) {
        config = largeConfig;
      }

      const partnerTotal = Math.max(ballConfigs.length, 1);
      const idealCount = Math.max(config.ballCount, 1);
      const densityRatio = partnerTotal / idealCount;
      const sizeFactor = clampValue(Math.sqrt(idealCount / partnerTotal), 0.65, 1.2);
      const velocityFactor = clampValue(Math.sqrt(densityRatio), 0.75, 1.28);

      const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : height;
      const sectionTargetHeight = Math.max(
        height,
        width * config.sectionMultiplier,
        viewportHeight * config.viewportMultiplier
      );
      const sectionMinHeight = Math.round(
        clampValue(sectionTargetHeight, config.sectionMin, config.sectionMax)
      );
      const effectiveHeight = Math.max(height, sectionMinHeight);

      const ballSize = Math.round(
        clampValue(
          width * config.ballScale * sizeFactor,
          config.ballMin * sizeFactor,
          config.ballMax * sizeFactor
        )
      );
      const greenRadius = clampValue(
        width * config.greenScale,
        config.greenMin,
        config.greenMax
      );
      const topRatio = clampValue(
        config.topBase + width * config.topSlope,
        config.topMin,
        config.topMax
      );

      const horizontalPadding = clampValue(
        width * config.horizontalPaddingScale,
        config.horizontalPaddingMin,
        config.horizontalPaddingMax
      );
      const verticalPaddingTop = clampValue(
        effectiveHeight * config.verticalPaddingTopScale,
        config.verticalPaddingTopMin,
        config.verticalPaddingTopMax
      );
      const verticalPaddingBottom = clampValue(
        effectiveHeight * config.verticalPaddingBottomScale,
        config.verticalPaddingBottomMin,
        config.verticalPaddingBottomMax
      );

      const horizontalVelocityRange = clampValue(
        width * config.velocityHorizontalScale * velocityFactor,
        config.velocityHorizontalMin * velocityFactor,
        config.velocityHorizontalMax * velocityFactor
      );
      const verticalVelocityRange = clampValue(
        effectiveHeight * config.velocityVerticalScale * velocityFactor,
        config.velocityVerticalMin * velocityFactor,
        config.velocityVerticalMax * velocityFactor
      );

      return {
        layout: {
          ballSize,
          greenRadius,
          topRatio,
          sectionMinHeight,
          ballCount: partnerTotal
        },
        padding: {
          horizontal: horizontalPadding,
          top: verticalPaddingTop,
          bottom: verticalPaddingBottom,
          height: effectiveHeight
        },
        velocity: {
          horizontal: horizontalVelocityRange,
          vertical: verticalVelocityRange
        },
        maxVelocity: {
          x: config.maxVelocity.x * velocityFactor,
          y: config.maxVelocity.y * velocityFactor
        }
      };
    },
    [ballConfigs.length, clampValue]
  );

  const computeCircleDiameter = useCallback(
    // Make the visible green circle ~2x larger than previous setting
    (baseRadius: number) => Math.round(clampValue(baseRadius * 2.4, 90, 380)),
    [clampValue],
  );

  const circleDiameter = computeCircleDiameter(layout.greenRadius);
  const circleTopPercent = clampValue(layout.topRatio * 100, 38, 54);
  const sectionMinHeightStyle = `max(${layout.sectionMinHeight}px, 70vh)`;
  const unifiedHeadingSize = clampValue(layout.greenRadius * 0.30, 20, 42);
  const primaryTextSize = unifiedHeadingSize;
  const monochromeFilter = 'none';
  const marqueeText = t('title');

  const baseBallStyle = useMemo<CSSProperties>(
    () => ({
      width: `${layout.ballSize}px`,
      height: `${layout.ballSize}px`,
      transform: 'translate3d(-9999px, -9999px, 0)',
      opacity: 0,
      borderRadius: '9999px',
      transition: prefersReducedMotion ? 'transform 0.3s ease' : 'none',
      border: '2px solid rgba(140, 148, 156, 0.6)',
      backgroundColor: '#333333',
      boxShadow: '0 24px 44px rgba(0, 0, 0, 0.5), 0 12px 24px rgba(0, 0, 0, 0.35)',
      overflow: 'hidden'
    }),
    [layout.ballSize, prefersReducedMotion]
  );

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

  const renderBallContent = useCallback(
    (ball: BallConfig) => {
      const scale = ball.content.scale ?? 0.56;
      const side = Math.max(layout.ballSize * scale, 32);

      return (
        <div
          className="relative flex items-center justify-center"
          style={{
            width: `${side}px`,
            height: `${side}px`,
          }}
        >
          <Image
            src={ball.content.src}
            alt={ball.content.alt}
            fill
            sizes={`${Math.round(side)}px`}
            className="object-contain"
            style={{
              filter: monochromeFilter,
            }}
            draggable={false}
          />
        </div>
      );
    },
    [layout.ballSize, monochromeFilter]
  );

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

    const { maxVx, maxVy } = physicsConfigRef.current;
    const balls = Array.from(ballStateRef.current.values());

    balls.forEach((ball) => {
      if (ball.isDragging) {
        return;
      }

      ball.vy += GRAVITY * dt;
      ball.vx *= 1 - AIR_DRAG * dt;
      ball.vy *= 1 - AIR_DRAG * dt;

      ball.vx = Math.max(Math.min(ball.vx, maxVx), -maxVx);
      ball.vy = Math.max(Math.min(ball.vy, maxVy), -maxVy);

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
    const width = rect.width;
    const height = rect.height;

    if (!width) {
      return;
    }

    const responsive = computeResponsiveValues(width, height);
    const { layout: layoutValues, padding, velocity, maxVelocity } = responsive;
    const effectiveHeight = padding.height;

    ballSizeRef.current = layoutValues.ballSize;
    dimensionsRef.current = { width, height: effectiveHeight };

    const displayDiameter = computeCircleDiameter(layoutValues.greenRadius);
    const displayRadius = displayDiameter / 2;

    greenPhysicsRef.current = {
      x: width / 2,
      y: effectiveHeight * layoutValues.topRatio,
      radius: displayRadius
    };

    physicsConfigRef.current = {
      maxVx: maxVelocity.x,
      maxVy: maxVelocity.y
    };

    setLayout((previous) => {
      if (
        previous.ballSize === layoutValues.ballSize &&
        previous.greenRadius === layoutValues.greenRadius &&
        previous.topRatio === layoutValues.topRatio &&
        previous.sectionMinHeight === layoutValues.sectionMinHeight &&
        previous.ballCount === layoutValues.ballCount
      ) {
        return previous;
      }
      return {
        ballSize: layoutValues.ballSize,
        greenRadius: layoutValues.greenRadius,
        topRatio: layoutValues.topRatio,
        sectionMinHeight: layoutValues.sectionMinHeight,
        ballCount: layoutValues.ballCount
      };
    });

    const newStates = new Map<number, BallState>();
    const activeBallConfigs = ballConfigs.slice(0, layoutValues.ballCount);

    const radius = layoutValues.ballSize / 2;
    const usableWidth = Math.max(width - padding.horizontal * 2, radius * 2);
    const usableHeight = Math.max(
      effectiveHeight - padding.top - padding.bottom,
      radius * 2
    );
    const vxRange = velocity.horizontal;
    const vyRange = velocity.vertical;

    const centerX = clampValue(
      padding.horizontal + usableWidth / 2,
      radius,
      Math.max(width - radius, radius)
    );
    const centerY = clampValue(
      padding.top + usableHeight / 2,
      radius,
      Math.max(effectiveHeight - radius, radius)
    );

    activeBallConfigs.forEach((config) => {
      const vx = (Math.random() - 0.5) * vxRange;
      const vy = Math.random() * -vyRange;

      newStates.set(config.id, {
        id: config.id,
        x: centerX,
        y: centerY,
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
        element.style.width = `${layoutValues.ballSize}px`;
        element.style.height = `${layoutValues.ballSize}px`;
        element.style.opacity = '1';
      }
    });

    ballConfigs.slice(layoutValues.ballCount).forEach((config) => {
      const element = ballElementsRef.current.get(config.id);
      if (element) {
        element.style.opacity = '0';
        element.style.transform = 'translate3d(-9999px, -9999px, 0)';
      }
    });

    ballStateRef.current = newStates;
    renderBalls();
  }, [ballConfigs, clampValue, computeCircleDiameter, computeResponsiveValues, renderBalls]);

  const handlePointerPosition = useCallback((event: PointerEvent | ReactPointerEvent<Element>) => {
    if (!containerRef.current) {
      return { x: 0, y: 0 };
    }

    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }, []);

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
    if (prefersReducedMotion) {
      return () => undefined;
    }

    const timer = setTimeout(() => {
      if (ballElementsRef.current.size > 0) {
        initializeBalls();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [initializeBalls, prefersReducedMotion]);

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
    if (!marqueeRef.current || prefersReducedMotion) {
      return;
    }

    const marquee = marqueeRef.current;
    const sequences = marquee.querySelectorAll<HTMLElement>('[data-marquee-sequence]');

    const computeWidths = () => {
      sequences.forEach((sequence) => {
        const items = Array.from(sequence.children) as HTMLElement[];
        if (items.length === 0) return;

        const loopContent = items.map((item) => item.textContent ?? '').join('');
        const baseText = loopContent || marqueeText;

        const buffer = document.createElement('span');
        buffer.style.visibility = 'hidden';
        buffer.style.whiteSpace = 'nowrap';
        buffer.style.position = 'absolute';
        buffer.textContent = `${baseText} ${baseText}`;
        marquee.appendChild(buffer);
        const measuredWidth = buffer.getBoundingClientRect().width;
        marquee.removeChild(buffer);

        sequence.style.setProperty('--segment-width', `${measuredWidth}px`);
      });

      const longest = Array.from(sequences).reduce((width, seq) => {
        const segmentWidth = parseFloat(seq.style.getPropertyValue('--segment-width') || '0');
        return Math.max(width, segmentWidth);
      }, 0);

      marquee.style.setProperty('--marquee-segment-width', `${longest}px`);
      const duration = Math.max(longest / 200, 9);
      marquee.style.setProperty('--marquee-duration', `${duration}s`);
    };

    const observer = new ResizeObserver(() => computeWidths());
    observer.observe(marquee);
    computeWidths();

    return () => observer.disconnect();
  }, [prefersReducedMotion, marqueeText]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const section = containerRef.current;
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
      className="relative w-full overflow-hidden bg-black py-24 md:py-40 lg:py-48"
      style={{ minHeight: sectionMinHeightStyle }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 left-0 w-[480px] h-full blur-3xl opacity-30"
          style={{
            background:
              'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(173, 216, 230, 0.12) 45%, transparent 100%)'
          }}
        />
        <div
          className="absolute bottom-[-25%] right-[-18%] w-[560px] h-[560px] rounded-full blur-3xl opacity-30"
          style={{
            background:
              'radial-gradient(circle, rgba(176, 196, 222, 0.28) 0%, rgba(176, 196, 222, 0.1) 48%, transparent 75%)'
          }}
        />
        <div
          className="absolute top-[28%] right-[12%] w-[320px] h-[320px] rounded-full blur-3xl opacity-20"
          style={{
            background:
              'radial-gradient(circle, rgba(224, 255, 255, 0.25) 0%, rgba(240, 248, 255, 0.05) 68%, transparent 100%)'
          }}
        />
        <div
          className="absolute top-[-18%] left-[22%] w-[260px] h-[260px] rounded-full blur-3xl opacity-24"
          style={{
            background:
              'radial-gradient(circle, rgba(255, 255, 255, 0.18) 0%, rgba(245, 245, 245, 0.04) 62%, transparent 100%)'
          }}
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
        {ballConfigs.slice(0, layout.ballCount).map((ball) => (
          <div
            key={ball.partnerId}
            ref={(element) => registerBall(ball.id, element)}
            className="absolute rounded-full cursor-grab active:cursor-grabbing select-none group"
            style={baseBallStyle}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: 'transparent'
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {renderBallContent(ball)}
            </div>
          </div>
        ))}
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div
          className="relative rounded-full overflow-hidden shadow-2xl"
          style={{
            width: `${circleDiameter}px`,
            height: `${circleDiameter}px`,
            background: 'linear-gradient(135deg, #00d76b, #00b85c)',
            position: 'absolute',
            left: '50%',
            top: `${circleTopPercent}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#00d76b] to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#00d76b] to-transparent z-10" />

          <div className="absolute inset-0 flex items-center overflow-hidden">
            <div
              ref={marqueeRef}
              className="marquee-track"
              style={{ '--marquee-font-size': `${primaryTextSize}px` } as CSSProperties}
            >
              <div className="marquee-sequence" data-marquee-sequence>
                <span>{marqueeText}</span>
                <span>{marqueeText}</span>
                <span>{marqueeText}</span>
                <span>{marqueeText}</span>
              </div>
              <div className="marquee-sequence" aria-hidden="true" data-marquee-sequence>
                <span>{marqueeText}</span>
                <span>{marqueeText}</span>
                <span>{marqueeText}</span>
                <span>{marqueeText}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
