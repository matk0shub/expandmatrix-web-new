'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import ScrambleText from './ScrambleText';

interface Ball {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  isDragging?: boolean;
  rotation?: number; // Add rotation for rolling effect
  isOnSurface?: boolean; // Track if ball is touching ground
  fallTime?: number; // Time spent falling for realistic acceleration
  icon?: string; // Icon for the ball
  onGround?: boolean; // contact flag for rotation calc
  onGreen?: boolean; // contact flag for rotation calc
}

export default function ClientsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const animationRef = useRef<number | null>(null);
  const textRef1 = useRef<HTMLHeadingElement>(null);
  const textRef2 = useRef<HTMLHeadingElement>(null);
  const greenBallRef = useRef<HTMLDivElement>(null);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [isInViewport, setIsInViewport] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [draggedBall, setDraggedBall] = useState<number | null>(null);

  // Initialize 3D balls with icons and improved physics
  const initializeBalls = useCallback(() => {
    if (!sectionRef.current) {
      return;
    }

    // Random icons for balls
    const ballIcons = [
      '💼', '🚀', '💡', '⚡', '🎯', '🌟', '🔥', '💎', '🎨', '🔧',
      '📊', '🎪', '🏆', '⚙️', '🎭', '🔮', '🎲', '🎪', '🎨', '🌟'
    ];

    const sectionRect = sectionRef.current.getBoundingClientRect();
    
    const newBalls: Ball[] = [];

    const ballSize = 180; // Všechny koule stejně velké (3x větší)
    
    for (let i = 0; i < 15; i++) {
      newBalls.push({
        id: i,
        x: Math.random() * (sectionRect.width - ballSize) + ballSize / 2,
        y: Math.random() * sectionRect.height + ballSize / 2,
        vx: (Math.random() - 0.5) * 0.2, // Reduced initial velocity for more control
        vy: (Math.random() - 0.5) * 0.2,
        size: ballSize,
        color: '#ffffff', // Pure white
        rotation: 0, // Initialize rotation
        isOnSurface: false, // Start off surfaces
        fallTime: 0, // Initialize fall time
        icon: ballIcons[i % ballIcons.length] // Assign random icon
      });
    }

    setBalls(newBalls);
  }, []);

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent, ballId: number) => {
    if (!sectionRef.current) return;
    
    e.preventDefault(); // Prevent text selection and other default behaviors
    
    setDraggedBall(ballId);
    
    // Stop the ball's velocity quando dragging starts
    setBalls(prevBalls => 
      prevBalls.map(ball => 
        ball.id === ballId 
          ? { ...ball, vx: 0, vy: 0, isDragging: true }
          : ball
      )
    );
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedBall === null || !sectionRef.current) return;
    
    e.preventDefault(); // Prevent text selection and other default behaviors
    
    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setBalls(prevBalls => 
      prevBalls.map(ball => 
        ball.id === draggedBall 
          ? { ...ball, x, y }
          : ball
      )
    );
  };

  const handleMouseUp = () => {
    if (draggedBall === null) return;
    
    setBalls(prevBalls => 
      prevBalls.map(ball => 
        ball.id === draggedBall 
          ? { ...ball, isDragging: false }
          : ball
      )
    );
    
    setDraggedBall(null);
  };

  // Simplified collision with green ball - no jittering
  const checkTextCollision = (ball: Ball, sectionRect: DOMRect) => {
    if (!greenBallRef.current) return ball;
    
    const greenBallRect = greenBallRef.current.getBoundingClientRect();
    const greenBallRadius = 200;
    const greenBallCenterX = greenBallRect.left - sectionRect.left + greenBallRadius;
    const greenBallCenterY = greenBallRect.top - sectionRect.top + greenBallRadius;
    
    const dx = ball.x - greenBallCenterX;
    const dy = ball.y - greenBallCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const collisionThreshold = ball.size / 2 + greenBallRadius;
    
    if (distance < collisionThreshold) {
      // Simple separation without complex physics
      const angle = Math.atan2(dy, dx);
      const overlap = collisionThreshold - distance;
      const separationX = Math.cos(angle) * overlap;
      const separationY = Math.sin(angle) * overlap;
      
      ball.x += separationX;
      ball.y += separationY;
      
      // Simple velocity reduction
      ball.vx *= 0.8;
      ball.vy *= 0.8;
    }
    
    return ball;
  };

  // Animation loop for 3D balls
  const animateBalls = useCallback(() => {
    if (!sectionRef.current) return;

    // Skip ball animation if reduced motion is preferred
    if (prefersReducedMotion) {
      animationRef.current = requestAnimationFrame(animateBalls);
      return;
    }

    setBalls(prevBalls => {
      const sectionRect = sectionRef.current!.getBoundingClientRect();
      
      return prevBalls.map(ball => {
        // Skip physics for dragged balls
        if (ball.isDragging) return ball;
        let newX = ball.x + ball.vx;
        let newY = ball.y + ball.vy;
        let newVx = ball.vx;
        let newVy = ball.vy;

        // Simplified wall collisions - realistic physics
        if (newX <= ball.size / 2 || newX >= sectionRect.width - ball.size / 2) {
          newVx = -newVx * 0.85; // Realistic bounce with energy loss
          newX = Math.max(ball.size / 2, Math.min(sectionRect.width - ball.size / 2, newX));
        }
        
        // Floor collision - realistic stopping
        if (newY >= sectionRect.height - ball.size / 2) {
          newVy = Math.max(0, newVy * 0.3); // Gradual stop, not instant
          newY = sectionRect.height - ball.size / 2;
          ball.isOnSurface = true;
        }

        // Simplified physics implementation
        
        // Check if ball is on ground
        const isTouchingGround = newY >= sectionRect.height - ball.size / 2 - 5;
        
        // Check contact with green ball
        let isTouchingGreenBall = false;
        if (greenBallRef.current) {
          const greenBallRect = greenBallRef.current.getBoundingClientRect();
          const greenBallRadius = 200;
          const greenBallCenterX = greenBallRect.left - sectionRect.left + greenBallRadius;
          const greenBallCenterY = greenBallRect.top - sectionRect.top + greenBallRadius;
          const dx = ball.x - greenBallCenterX;
          const dy = ball.y - greenBallCenterY;
          const distanceToGreen = Math.sqrt(dx * dx + dy * dy);
          const greenCollisionThreshold = ball.size / 2 + greenBallRadius;
          
          if (distanceToGreen < greenCollisionThreshold) {
            isTouchingGreenBall = true;
          }
        }
        
        // Simplified physics states
        if (isTouchingGround) {
          // Snap to ground and roll without slipping
          newY = sectionRect.height - ball.size / 2;
          newVy = 0;
          // Rolling friction
          newVx *= 0.96;
          ball.isOnSurface = true;
          ball.onGround = true;
          ball.onGreen = false;
        } else if (isTouchingGreenBall) {
          // Constrain to green ball surface and roll along tangent
          const gRect = greenBallRef.current!.getBoundingClientRect();
          const gR = 200;
          const cx = gRect.left - sectionRect.left + gR;
          const cy = gRect.top - sectionRect.top + gR;
          const bx = newX;
          const by = newY;

          const nx = bx - cx;
          const ny = by - cy;
          const dist = Math.max(1e-5, Math.hypot(nx, ny));
          const desired = gR + ball.size / 2;
          // Project position to exact surface radius
          const nHatX = nx / dist;
          const nHatY = ny / dist;
          newX = cx + nHatX * desired;
          newY = cy + nHatY * desired;

          // Decompose velocity into normal/tangent
          const tHatX = -nHatY;
          const tHatY = nHatX;
          const v_n = newVx * nHatX + newVy * nHatY;
          const v_t = newVx * tHatX + newVy * tHatY;

          // Kill inward normal, damp outward normal, keep tangential with slight friction
          const v_n_out = Math.max(0, v_n) * 0.3;
          const v_t_new = v_t * 0.985;

          newVx = nHatX * v_n_out + tHatX * v_t_new;
          newVy = nHatY * v_n_out + tHatY * v_t_new;

          ball.fallTime = 0;
          ball.onGround = false;
          ball.onGreen = true;
        } else {
          // Free fall
          ball.fallTime = (ball.fallTime || 0) + (1/60);
          ball.onGround = false;
          ball.onGreen = false;

          // Gravity
          const gravity = 0.5;
          newVy += gravity;

          // Terminal velocity
          const terminalVelocity = 8;
          newVy = Math.min(newVy, terminalVelocity);

          // Air drag
          newVx *= 0.995;

          // Rotation decay handled later
        }

        // Global clamps
        const maxVelocity = 10;
        newVx = Math.max(-maxVelocity, Math.min(maxVelocity, newVx));
        newVy = Math.max(-maxVelocity, Math.min(maxVelocity, newVy));

        // Apply physics
        const updatedBall = {
          ...ball,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          rotation: ball.rotation || 0,
          fallTime: ball.fallTime || 0
        };
        
        // Check collision with text ball
        return checkTextCollision(updatedBall, sectionRect);
      }).map(ball => {
        // Check collisions with other balls - improved to prevent jittering
        let newVx = ball.vx;
        let newVy = ball.vy;
        let newX = ball.x;
        let newY = ball.y;
        
        prevBalls.forEach(otherBall => {
          if (ball.id !== otherBall.id) {
            const dx = ball.x - otherBall.x;
            const dy = ball.y - otherBall.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = ball.size / 2 + otherBall.size / 2;
            
            if (distance < minDistance && distance > 0) {
              // Simple separation without jittering
              const angle = Math.atan2(dy, dx);
              const overlap = minDistance - distance;
              
              // Gentle separation - only move the current ball
              const separationX = Math.cos(angle) * overlap * 0.5;
              const separationY = Math.sin(angle) * overlap * 0.5;
              
              newX += separationX;
              newY += separationY;
              
              // Simple velocity reduction to prevent bouncing
              newVx *= 0.9;
              newVy *= 0.9;
            }
          }
        });
        
        // Calculate rotation from rolling kinematics
        const circumference = Math.PI * ball.size;
        let rotationDelta = 0;
        if (ball.onGround) {
          // No-slip: omega = v / R
          rotationDelta = (newVx * 180) / circumference;
        } else if (ball.onGreen && greenBallRef.current && sectionRef.current) {
          const gRect = greenBallRef.current.getBoundingClientRect();
          const sRect = sectionRef.current.getBoundingClientRect();
          const gR = 200;
          const cx = gRect.left - sRect.left + gR;
          const cy = gRect.top - sRect.top + gR;
          const nx = newX - cx;
          const ny = newY - cy;
          const nLen = Math.max(1e-5, Math.hypot(nx, ny));
          const tHatX = -ny / nLen;
          const tHatY = nx / nLen;
          const v_t = newVx * tHatX + newVy * tHatY; // signed tangential speed
          rotationDelta = (v_t * 180) / circumference;
        } else {
          rotationDelta = (ball.rotation || 0) * 0.0; // already decayed above
        }
        const newRotation = (ball.rotation || 0) + rotationDelta;

        return {
          ...ball,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          rotation: newRotation
        };
      });
    });

    animationRef.current = requestAnimationFrame(animateBalls);
  }, [prefersReducedMotion]);

  // Start animation with useCallback for stable reference
  const startAnimation = useCallback(() => {
    if (isInViewport && !prefersReducedMotion && balls.length > 0) {
      animationRef.current = requestAnimationFrame(animateBalls);
    }
  }, [isInViewport, prefersReducedMotion, balls.length, animateBalls]);

  // Stop animation
  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  // Viewport intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Prefers reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Initialize balls when component mounts
  useEffect(() => {
    // Delay initialization to ensure DOM is ready
    const timer = setTimeout(() => {
      initializeBalls();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [initializeBalls]);

  // Start/stop animation based on viewport and motion preferences
  useEffect(() => {
    if (isInViewport && !prefersReducedMotion && balls.length > 0) {
      startAnimation();
    } else {
      stopAnimation();
    }

    return () => {
      stopAnimation();
    };
  }, [isInViewport, prefersReducedMotion, balls.length, startAnimation, stopAnimation]);

  // Dual text animation with slower timing and immediate visibility (no fade effect)
  useEffect(() => {
    if (prefersReducedMotion || !textRef1.current || !textRef2.current || !sectionRef.current) return;

    const textElement1 = textRef1.current;
    const textElement2 = textRef2.current;
    const sectionElement = sectionRef.current;

    const handleScroll = () => {
      try {
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Check if section is in viewport with much smaller delay for immediate visibility
        const sectionTop = sectionElement.offsetTop;
        
        // Very small delay - animation starts almost immediately when section is visible
        const delay = windowHeight * 0.1; // Start animation when section is only 10% visible
        
        // Additional offset calculation for green ball positioned at 40% of section
        const sectionCenterOffset = sectionElement.offsetHeight * 0.1; // Adjust for 2/5 position
        
        if (sectionTop <= scrollTop + windowHeight - delay && sectionTop + sectionElement.offsetHeight >= scrollTop) {
          // Calculate how far we've scrolled through this section (with adjustment for 2/5 position)
          const sectionEntry = scrollTop + windowHeight - sectionTop - delay - sectionCenterOffset;
          const sectionHeight = sectionElement.offsetHeight;
          const sectionProgress = sectionEntry / sectionHeight; // Complete progress through section
          
          // Clamp progress to ensure full completion
          const clampedProgress = Math.min(1, Math.max(0, sectionProgress));
          
          // Animation parameters with slower movement but complete travel
          const textWidth = 500; // Increased for dual text
          const ballRadius = 200; // Half of 400px ball diameter
          const totalDistance = ballRadius + textWidth/2; // Complete distance from edge to center
          
          // Calculate positions for dual text animation - more offset final positions
          // Text 1: moves from right edge to offset left position
          const finalPosition1 = -80; // Much more to the left
          const scrollOffset1 = ballRadius + textWidth/2 - (clampedProgress * (totalDistance + Math.abs(finalPosition1)));
          
          // Text 2: moves from left edge to offset right position
          const finalPosition2 = 80; // Much more to the right
          const scrollOffset2 = -ballRadius - textWidth/2 + (clampedProgress * (totalDistance + Math.abs(finalPosition2)));
          
          // Apply transformed positions with smooth easing
          const easingProgress = 1 - Math.pow(1 - clampedProgress, 3); // Smooth cubic ease-out
          const finalOffset1 = scrollOffset1 * easingProgress;
          const finalOffset2 = scrollOffset2 * easingProgress;
          
          textElement1.style.transform = `translateX(${finalOffset1}px)`;
          textElement2.style.transform = `translateX(${finalOffset2}px)`;
          
          // Always keep text fully visible - no fade effect
          textElement1.style.opacity = '1';
          textElement2.style.opacity = '1';
        } else {
          // Reset text positions when section is not in view - start from edges
          const textWidth = 500;
          const ballRadius = 200;
          const initialPosition1 = ballRadius + textWidth/2; // Start from right edge
          const initialPosition2 = -ballRadius - textWidth/2; // Start from left edge
          
          textElement1.style.transform = `translateX(${initialPosition1}px)`;
          textElement2.style.transform = `translateX(${initialPosition2}px)`;
          // Keep text fully visible at all times
          textElement1.style.opacity = '1';
          textElement2.style.opacity = '1';
        }
      } catch (error) {
        console.warn('Letter carousel error:', error);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prefersReducedMotion]);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-black min-h-screen py-24 md:py-40 lg:py-48 -mt-20"
    >
      {/* Background Elements - Green gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large green gradient */}
        <div 
          className="absolute top-0 left-0 w-[500px] h-full blur-3xl opacity-30" 
          style={{ background: 'linear-gradient(135deg, rgba(0, 215, 107, 0.2) 0%, rgba(0, 184, 92, 0.1) 50%, transparent 100%)' }} 
        />
        
        {/* Blurry green spots */}
        <div 
          className="absolute bottom-1/4 left-1/3 w-[400px] h-[300px] blur-3xl opacity-20" 
          style={{ background: 'radial-gradient(circle, rgba(0, 215, 107, 0.2) 0%, rgba(0, 184, 92, 0.1) 50%, transparent 70%)' }} 
        />
        <div 
          className="absolute bottom-1/4 right-1/3 w-[350px] h-[250px] blur-3xl opacity-15" 
          style={{ background: 'radial-gradient(circle, rgba(0, 184, 92, 0.15) 0%, rgba(0, 215, 107, 0.05) 50%, transparent 70%)' }} 
        />
      </div>

      {/* 3D Balls Container */}
      <div 
        className="absolute inset-0 w-full h-full" 
        style={{ zIndex: 1, userSelect: 'none', WebkitUserSelect: 'none' }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {balls.length > 0 && balls.map((ball) => (
          <div
            key={ball.id}
            className="absolute rounded-full cursor-pointer select-none group"
            style={{
              left: ball.x - ball.size / 2,
              top: ball.y - ball.size / 2,
              width: ball.size,
              height: ball.size,
              background: `radial-gradient(40% 40% at 30% 25%, rgba(255,255,255,0.85) 0%, rgba(250,250,250,0.7) 40%, rgba(240,240,240,0.65) 70%, rgba(230,230,230,0.55) 100%),
                           radial-gradient(80% 80% at 70% 70%, rgba(255,255,255,0.25) 0%, rgba(245,245,245,0.15) 60%, rgba(235,235,235,0.08) 100%)`,
              boxShadow: `0 16px 48px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(0,0,0,0.08)`,
              transform: `perspective(1000px) rotateX(0deg) rotateY(0deg) rotateZ(${ball.rotation || 0}deg)`,
              transition: prefersReducedMotion ? 'all 0.3s ease' : 'transform 0.1s ease, box-shadow 0.3s ease',
              zIndex: ball.isDragging ? 10 : 1,
              border: '1px solid rgba(255, 255, 255, 0.18)'
            }}
            onMouseDown={(e) => handleMouseDown(e, ball.id)}
          >
            {/* Inner rim light */}
            <div className="absolute inset-0 rounded-full pointer-events-none" style={{ boxShadow: 'inset 0 0 32px rgba(255,255,255,0.25), inset 0 0 64px rgba(255,255,255,0.12)' }} />
            {/* Icon in the center */}
            <div 
              className="absolute inset-0 flex items-center justify-center text-6xl select-none pointer-events-none"
              style={{
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                filter: 'drop-shadow(0 0 8px rgba(0, 215, 107, 0.2))'
              }}
            >
              {ball.icon}
            </div>
            
            {/* Hover glow effect */}
            <div 
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'radial-gradient(circle, rgba(0, 215, 107, 0.1) 0%, transparent 70%)',
                boxShadow: '0 0 40px rgba(0, 215, 107, 0.3)'
              }}
            />
          </div>
        ))}
      </div>

      {/* Fixed Text Ball with dual animated content - positioned at 2/5 of section */}
      <div className="absolute inset-0 flex items-center z-10" style={{ pointerEvents: 'none' }}>
        <div 
          ref={greenBallRef}
          className="relative rounded-full overflow-hidden shadow-2xl flex items-center justify-center"
          style={{
            width: '400px',
            height: '400px',
            background: `
              linear-gradient(135deg, #00d76b, #00b85c)
            `,
            pointerEvents: 'none',
            userSelect: 'none',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            top: '40%' // Position at 2/5 of section height
          }}
        >
          {/* Mask gradients for smooth text fade at edges */}
          <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[#00d76b] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[#00d76b] to-transparent z-10 pointer-events-none"></div>
          
          {/* Dual text layers stacked vertically */}
          <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden">
            
            {/* Text 1: moves from right to center */}
            <div 
              ref={textRef1}
              className="text-white font-medium uppercase font-lato whitespace-nowrap flex text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl" 
              style={{ 
                letterSpacing: '0.1em',
                transform: prefersReducedMotion ? 'translateX(0px)' : 'translateX(0px)',
                opacity: '1', // Always fully visible
                fontWeight: '600',
                lineHeight: '1.1'
              }}
            >
              <ScrambleText text="NAŠI PARTNEŘI" applyScramble={false} />
            </div>
            
            {/* Text 2: moves from left to center (opposite direction) */}
            <div 
              ref={textRef2}
              className="text-white font-medium uppercase font-lato whitespace-nowrap flex text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl" 
              style={{ 
                letterSpacing: '0.1em',
                transform: prefersReducedMotion ? 'translateX(0px)' : 'translateX(0px)',
                opacity: '1', // Always fully visible
                fontWeight: '400',
                lineHeight: '1.1',
                marginTop: '-0.1em' // Slight overlap for visual cohesion
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