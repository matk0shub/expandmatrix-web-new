'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export default function TeamSectionBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const spots = container.querySelectorAll('.glow-spot');

    // Animate each spot with unique GSAP animations
    spots.forEach((spot, index) => {
      const element = spot as HTMLElement;
      
      // Different animation patterns for each spot
      switch (index % 8) {
        case 0:
          // Floating with scale and rotation
          gsap.to(element, {
            y: -50,
            x: 30,
            scale: 1.2,
            rotation: 15,
            duration: 8 + index,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true,
          });
          break;
        case 1:
          // Pulsing glow effect
          gsap.to(element, {
            scale: 1.3,
            opacity: 0.8,
            duration: 4 + index * 0.5,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true,
          });
          break;
        case 2:
          // Spiral movement
          gsap.to(element, {
            rotation: 360,
            x: 100,
            y: -100,
            duration: 12 + index,
            ease: "none",
            repeat: -1,
          });
          break;
        case 3:
          // Wave motion
          gsap.to(element, {
            y: -80,
            duration: 6 + index * 0.3,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
          gsap.to(element, {
            x: 60,
            duration: 8 + index * 0.4,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true,
          });
          break;
        case 4:
          // Zigzag pattern
          gsap.to(element, {
            x: 80,
            y: -40,
            duration: 5 + index * 0.2,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true,
          });
          break;
        case 5:
          // Breathing with color change
          gsap.to(element, {
            scale: 1.4,
            duration: 7 + index * 0.3,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true,
          });
          break;
        case 6:
          // Complex orbit
          gsap.to(element, {
            rotation: 180,
            x: 120,
            y: -120,
            scale: 1.1,
            duration: 15 + index,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true,
          });
          break;
        case 7:
          // Fast pulsing
          gsap.to(element, {
            scale: 1.5,
            opacity: 0.9,
            duration: 2 + index * 0.1,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true,
          });
          break;
      }
    });

    return () => {
      gsap.killTweensOf(spots);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative lg:sticky lg:top-0 lg:h-screen w-full overflow-hidden pointer-events-none z-[1]">
      {/* Base matte black background */}
      <div className="absolute inset-0 bg-black" />
      
      {/* BRIGHT GLOWING SPOTS - Much more visible and vibrant */}
      
      {/* Spot 1 - Massive bright center glow */}
      <div 
        className="glow-spot absolute top-[20%] left-[15%] w-[900px] h-[700px] blur-3xl opacity-60" 
        style={{ 
          background: 'radial-gradient(ellipse 60% 40%, rgba(0, 255, 120, 0.8) 0%, rgba(0, 215, 107, 0.6) 30%, rgba(0, 184, 92, 0.4) 60%, transparent 80%)',
          boxShadow: '0 0 200px rgba(0, 255, 120, 0.3)'
        }} 
      />
      
      {/* Spot 2 - Large bright right side */}
      <div 
        className="glow-spot absolute top-[10%] right-[5%] w-[800px] h-[600px] blur-3xl opacity-55" 
        style={{ 
          background: 'radial-gradient(ellipse 50% 60%, rgba(0, 215, 107, 0.7) 0%, rgba(0, 255, 120, 0.5) 40%, rgba(0, 184, 92, 0.3) 70%, transparent 85%)',
          boxShadow: '0 0 150px rgba(0, 215, 107, 0.4)'
        }} 
      />
      
      {/* Spot 3 - Large bright bottom left */}
      <div 
        className="glow-spot absolute bottom-[5%] left-[5%] w-[850px] h-[650px] blur-3xl opacity-50" 
        style={{ 
          background: 'radial-gradient(ellipse 70% 30%, rgba(0, 255, 120, 0.6) 0%, rgba(0, 215, 107, 0.4) 50%, rgba(0, 184, 92, 0.2) 70%, transparent 80%)',
          boxShadow: '0 0 180px rgba(0, 255, 120, 0.3)'
        }} 
      />
      
      {/* Spot 4 - Medium bright top left */}
      <div 
        className="glow-spot absolute top-[5%] left-[40%] w-[500px] h-[500px] blur-3xl opacity-45" 
        style={{ 
          background: 'radial-gradient(circle, rgba(0, 184, 92, 0.6) 0%, rgba(0, 255, 120, 0.4) 40%, rgba(0, 215, 107, 0.2) 70%, transparent 85%)',
          boxShadow: '0 0 120px rgba(0, 184, 92, 0.4)'
        }} 
      />
      
      {/* Spot 5 - Medium bright center right */}
      <div 
        className="glow-spot absolute top-[50%] right-[20%] w-[550px] h-[450px] blur-3xl opacity-42" 
        style={{ 
          background: 'radial-gradient(ellipse 40% 80%, rgba(0, 215, 107, 0.5) 0%, rgba(0, 255, 120, 0.3) 50%, rgba(0, 184, 92, 0.15) 75%, transparent 85%)',
          boxShadow: '0 0 100px rgba(0, 215, 107, 0.3)'
        }} 
      />
      
      {/* Spot 6 - Medium bright bottom center */}
      <div 
        className="glow-spot absolute bottom-[15%] left-[50%] w-[480px] h-[480px] blur-3xl opacity-40" 
        style={{ 
          background: 'radial-gradient(circle, rgba(0, 184, 92, 0.5) 0%, rgba(0, 215, 107, 0.3) 50%, rgba(0, 255, 120, 0.15) 70%, transparent 80%)',
          boxShadow: '0 0 110px rgba(0, 184, 92, 0.3)'
        }} 
      />
      
      {/* Spot 7 - Small bright top right */}
      <div 
        className="glow-spot absolute top-[15%] right-[30%] w-[350px] h-[350px] blur-3xl opacity-38" 
        style={{ 
          background: 'radial-gradient(circle, rgba(0, 255, 120, 0.4) 0%, rgba(0, 215, 107, 0.2) 50%, transparent 70%)',
          boxShadow: '0 0 80px rgba(0, 255, 120, 0.3)'
        }} 
      />
      
      {/* Spot 8 - Small bright center left */}
      <div 
        className="glow-spot absolute top-[35%] left-[25%] w-[400px] h-[400px] blur-3xl opacity-35" 
        style={{ 
          background: 'radial-gradient(ellipse 60% 40%, rgba(0, 184, 92, 0.4) 0%, rgba(0, 255, 120, 0.2) 50%, transparent 70%)',
          boxShadow: '0 0 90px rgba(0, 184, 92, 0.3)'
        }} 
      />
      
      {/* Spot 9 - Small bright bottom right */}
      <div 
        className="glow-spot absolute bottom-[25%] right-[15%] w-[380px] h-[380px] blur-3xl opacity-33" 
        style={{ 
          background: 'radial-gradient(circle, rgba(0, 215, 107, 0.4) 0%, rgba(0, 255, 120, 0.2) 40%, rgba(0, 184, 92, 0.1) 70%, transparent 80%)',
          boxShadow: '0 0 85px rgba(0, 215, 107, 0.3)'
        }} 
      />
      
      {/* Spot 10 - Small bright top center */}
      <div 
        className="glow-spot absolute top-[8%] left-[60%] w-[320px] h-[320px] blur-3xl opacity-30" 
        style={{ 
          background: 'radial-gradient(ellipse 50% 70%, rgba(0, 184, 92, 0.35) 0%, rgba(0, 255, 120, 0.15) 50%, transparent 70%)',
          boxShadow: '0 0 70px rgba(0, 184, 92, 0.3)'
        }} 
      />
      
      {/* Spot 11 - Medium bright accent */}
      <div 
        className="glow-spot absolute top-[25%] right-[45%] w-[280px] h-[280px] blur-3xl opacity-32" 
        style={{ 
          background: 'radial-gradient(circle, rgba(0, 255, 120, 0.35) 0%, rgba(0, 215, 107, 0.15) 50%, transparent 70%)',
          boxShadow: '0 0 60px rgba(0, 255, 120, 0.3)'
        }} 
      />
      
      {/* Spot 12 - Medium bright accent */}
      <div 
        className="glow-spot absolute bottom-[40%] left-[15%] w-[260px] h-[260px] blur-3xl opacity-28" 
        style={{ 
          background: 'radial-gradient(ellipse 70% 30%, rgba(0, 184, 92, 0.3) 0%, rgba(0, 255, 120, 0.1) 50%, transparent 70%)',
          boxShadow: '0 0 55px rgba(0, 184, 92, 0.3)'
        }} 
      />
      
      {/* Spot 13 - Medium bright accent */}
      <div 
        className="glow-spot absolute top-[60%] right-[5%] w-[300px] h-[300px] blur-3xl opacity-26" 
        style={{ 
          background: 'radial-gradient(circle, rgba(0, 215, 107, 0.3) 0%, rgba(0, 255, 120, 0.1) 50%, transparent 70%)',
          boxShadow: '0 0 65px rgba(0, 215, 107, 0.3)'
        }} 
      />
      
      {/* Spot 14 - Medium bright accent */}
      <div 
        className="glow-spot absolute bottom-[8%] right-[40%] w-[240px] h-[240px] blur-3xl opacity-24" 
        style={{ 
          background: 'radial-gradient(ellipse 40% 60%, rgba(0, 184, 92, 0.25) 0%, rgba(0, 255, 120, 0.08) 50%, transparent 70%)',
          boxShadow: '0 0 50px rgba(0, 184, 92, 0.3)'
        }} 
      />
      
      {/* Spot 15 - Medium bright accent */}
      <div 
        className="glow-spot absolute top-[45%] left-[5%] w-[220px] h-[220px] blur-3xl opacity-22" 
        style={{ 
          background: 'radial-gradient(circle, rgba(0, 255, 120, 0.25) 0%, rgba(0, 215, 107, 0.1) 50%, transparent 70%)',
          boxShadow: '0 0 45px rgba(0, 255, 120, 0.3)'
        }} 
      />
      
      {/* EXTRA BRIGHT ATMOSPHERIC SPOTS - Background depth */}
      {/* Spot 16 - Huge bright background glow */}
      <div 
        className="glow-spot absolute top-[30%] left-[30%] w-[1200px] h-[1000px] blur-3xl opacity-25" 
        style={{ 
          background: 'radial-gradient(ellipse 80% 50%, rgba(0, 184, 92, 0.2) 0%, rgba(0, 255, 120, 0.1) 40%, rgba(0, 215, 107, 0.05) 60%, transparent 70%)',
          boxShadow: '0 0 300px rgba(0, 184, 92, 0.2)'
        }} 
      />
      
      {/* Spot 17 - Huge bright background glow */}
      <div 
        className="glow-spot absolute bottom-[20%] right-[10%] w-[1100px] h-[900px] blur-3xl opacity-23" 
        style={{ 
          background: 'radial-gradient(ellipse 60% 80%, rgba(0, 215, 107, 0.18) 0%, rgba(0, 255, 120, 0.08) 50%, rgba(0, 184, 92, 0.03) 70%, transparent 80%)',
          boxShadow: '0 0 250px rgba(0, 215, 107, 0.2)'
        }} 
      />
      
      {/* ADDITIONAL BRIGHT DYNAMIC SPOTS - More variety and movement */}
      {/* Spot 18 - Very bright pulsing glow */}
      <div 
        className="glow-spot absolute top-[40%] right-[35%] w-[420px] h-[420px] blur-3xl opacity-48" 
        style={{ 
          background: 'radial-gradient(circle, rgba(0, 255, 120, 0.6) 0%, rgba(0, 215, 107, 0.4) 40%, rgba(0, 184, 92, 0.2) 70%, transparent 85%)',
          boxShadow: '0 0 140px rgba(0, 255, 120, 0.4)'
        }} 
      />
      
      {/* Spot 19 - Bright wave motion */}
      <div 
        className="glow-spot absolute bottom-[35%] left-[20%] w-[360px] h-[360px] blur-3xl opacity-40" 
        style={{ 
          background: 'radial-gradient(ellipse 50% 60%, rgba(0, 184, 92, 0.5) 0%, rgba(0, 255, 120, 0.3) 40%, rgba(0, 215, 107, 0.15) 70%, transparent 80%)',
          boxShadow: '0 0 120px rgba(0, 184, 92, 0.4)'
        }} 
      />
      
      {/* Spot 20 - Bright spiral movement */}
      <div 
        className="glow-spot absolute top-[70%] left-[60%] w-[300px] h-[300px] blur-3xl opacity-36" 
        style={{ 
          background: 'radial-gradient(circle, rgba(0, 215, 107, 0.4) 0%, rgba(0, 255, 120, 0.2) 50%, transparent 70%)',
          boxShadow: '0 0 100px rgba(0, 215, 107, 0.3)'
        }} 
      />
      
      {/* Spot 21 - Bright zigzag pattern */}
      <div 
        className="glow-spot absolute top-[12%] left-[70%] w-[280px] h-[280px] blur-3xl opacity-34" 
        style={{ 
          background: 'radial-gradient(ellipse 60% 40%, rgba(0, 184, 92, 0.35) 0%, rgba(0, 255, 120, 0.15) 50%, transparent 70%)',
          boxShadow: '0 0 90px rgba(0, 184, 92, 0.3)'
        }} 
      />
      
      {/* Spot 22 - Bright gentle sway */}
      <div 
        className="glow-spot absolute bottom-[12%] left-[40%] w-[340px] h-[340px] blur-3xl opacity-32" 
        style={{ 
          background: 'radial-gradient(circle, rgba(0, 255, 120, 0.3) 0%, rgba(0, 215, 107, 0.15) 50%, rgba(0, 184, 92, 0.08) 70%, transparent 80%)',
          boxShadow: '0 0 110px rgba(0, 255, 120, 0.3)'
        }} 
      />
      
      {/* Spot 23 - Very bright expand and contract */}
      <div 
        className="glow-spot absolute top-[55%] right-[25%] w-[240px] h-[240px] blur-3xl opacity-44" 
        style={{ 
          background: 'radial-gradient(ellipse 70% 30%, rgba(0, 184, 92, 0.4) 0%, rgba(0, 255, 120, 0.2) 50%, transparent 70%)',
          boxShadow: '0 0 80px rgba(0, 184, 92, 0.4)'
        }} 
      />
      
      {/* Spot 24 - Bright complex movement */}
      <div 
        className="glow-spot absolute bottom-[50%] right-[50%] w-[320px] h-[320px] blur-3xl opacity-38" 
        style={{ 
          background: 'radial-gradient(circle, rgba(0, 215, 107, 0.35) 0%, rgba(0, 255, 120, 0.2) 40%, rgba(0, 184, 92, 0.1) 70%, transparent 80%)',
          boxShadow: '0 0 95px rgba(0, 215, 107, 0.3)'
        }} 
      />
      
      {/* Spot 25 - Bright fast rotation */}
      <div 
        className="glow-spot absolute top-[30%] left-[50%] w-[200px] h-[200px] blur-3xl opacity-30" 
        style={{ 
          background: 'radial-gradient(ellipse 40% 70%, rgba(0, 184, 92, 0.3) 0%, rgba(0, 255, 120, 0.15) 50%, transparent 70%)',
          boxShadow: '0 0 60px rgba(0, 184, 92, 0.3)'
        }} 
      />
      
      {/* Spot 26 - Bright vertical drift with rotation */}
      <div 
        className="glow-spot absolute bottom-[30%] left-[70%] w-[260px] h-[260px] blur-3xl opacity-28" 
          style={{
          background: 'radial-gradient(circle, rgba(0, 255, 120, 0.25) 0%, rgba(0, 215, 107, 0.12) 50%, transparent 70%)',
          boxShadow: '0 0 70px rgba(0, 255, 120, 0.3)'
          }}
        />
      
      {/* Spot 27 - Bright horizontal drift with breathing */}
        <div
        className="glow-spot absolute top-[18%] left-[35%] w-[180px] h-[180px] blur-3xl opacity-26" 
          style={{
          background: 'radial-gradient(ellipse 60% 50%, rgba(0, 184, 92, 0.25) 0%, rgba(0, 255, 120, 0.1) 50%, transparent 70%)',
          boxShadow: '0 0 50px rgba(0, 184, 92, 0.3)'
          }}
        />
      
      {/* Spot 28 - Bright multi-directional movement */}
        <div
        className="glow-spot absolute bottom-[18%] right-[30%] w-[160px] h-[160px] blur-3xl opacity-24" 
          style={{
          background: 'radial-gradient(circle, rgba(0, 215, 107, 0.2) 0%, rgba(0, 255, 120, 0.08) 50%, transparent 70%)',
          boxShadow: '0 0 40px rgba(0, 215, 107, 0.3)'
          }}
        />
      </div>
  );
}

