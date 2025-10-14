'use client';

import { useScramble } from 'use-scramble';
import { SCRAMBLE_CONFIG, SCRAMBLE_TRIGGERS } from '@/constants/scramble';

interface ScrambleTextProps {
  // Single text mode
  text?: string;
  // Multi-line heading mode
  line1?: string;
  line2?: string;
  line3?: string;
  line4?: string;
  // Common props
  className?: string;
  range?: [number, number];
  speed?: number;
  tick?: number;
  step?: number;
  scramble?: number;
  seed?: number;
  chance?: number;
  overdrive?: boolean;
  overflow?: boolean;
  // Behavior props
  trigger?: 'hover' | 'mount' | 'manual';
  cursor?: boolean;
  // Control whether to apply scramble effect
  applyScramble?: boolean;
}

export default function ScrambleText({
  text,
  line1,
  line2,
  line3,
  line4,
  className = '',
  range = SCRAMBLE_CONFIG.RANGE,
  speed = SCRAMBLE_CONFIG.SPEED,
  tick = SCRAMBLE_CONFIG.TICK,
  step = SCRAMBLE_CONFIG.STEP,
  scramble = SCRAMBLE_CONFIG.SCRAMBLE,
  seed = SCRAMBLE_CONFIG.SEED,
  chance = SCRAMBLE_CONFIG.CHANCE,
  overdrive = SCRAMBLE_CONFIG.OVERDRIVE,
  overflow = SCRAMBLE_CONFIG.OVERFLOW,
  trigger = SCRAMBLE_TRIGGERS.HOVER,
  cursor = true,
  applyScramble = false,
}: ScrambleTextProps) {
  // Always call all possible useScramble hooks unconditionally
  // React hooks rules require them to be called in the same order every time
  
  // Single text hook
  const scrambleHook = useScramble({
    text: text || '',
    range,
    speed,
    tick,
    step,
    scramble,
    seed,
    chance,
    overdrive,
    overflow,
    playOnMount: trigger === SCRAMBLE_TRIGGERS.MOUNT,
  });

  // Multi-line hooks
  const scramble1Hook = useScramble({
    text: line1 || '',
    range,
    speed,
    tick,
    step,
    scramble,
    seed,
    chance,
    overdrive,
    overflow,
    playOnMount: trigger === SCRAMBLE_TRIGGERS.MOUNT,
  });

  const scramble2Hook = useScramble({
    text: line2 || '',
    range,
    speed,
    tick,
    step,
    scramble,
    seed: seed + 1,
    chance,
    overdrive,
    overflow,
    playOnMount: trigger === SCRAMBLE_TRIGGERS.MOUNT,
  });

  const scramble3Hook = useScramble({
    text: line3 || '',
    range,
    speed,
    tick,
    step,
    scramble,
    seed: seed + 2,
    chance,
    overdrive,
    overflow,
    playOnMount: trigger === SCRAMBLE_TRIGGERS.MOUNT,
  });

  const scramble4Hook = useScramble({
    text: line4 || '',
    range,
    speed,
    tick,
    step,
    scramble,
    seed: seed + 3,
    chance,
    overdrive,
    overflow,
    playOnMount: trigger === SCRAMBLE_TRIGGERS.MOUNT,
  });

  // Single text mode
  if (text) {
    const handleMouseEnter = () => {
      if (applyScramble && trigger === SCRAMBLE_TRIGGERS.HOVER) {
        scrambleHook.replay();
      }
    };

    return (
      <span 
        ref={applyScramble ? scrambleHook.ref : undefined} 
        className={className}
        onMouseEnter={handleMouseEnter}
        style={{ cursor: applyScramble && cursor ? 'pointer' : 'default' }}
      >
        {text}
      </span>
    );
  }

  // Multi-line heading mode
  if (line1 || line2 || line3 || line4) {
    const handleMouseEnter = () => {
      if (applyScramble && trigger === SCRAMBLE_TRIGGERS.HOVER) {
        scramble1Hook.replay();
        scramble2Hook.replay();
        scramble3Hook.replay();
        scramble4Hook.replay();
      }
    };

    return (
      <div 
        className={className}
        onMouseEnter={handleMouseEnter}
        style={{ cursor: applyScramble && cursor ? 'pointer' : 'default' }}
      >
        {line1 && <div ref={applyScramble ? scramble1Hook.ref : undefined}>{line1}</div>}
        {line2 && <div ref={applyScramble ? scramble2Hook.ref : undefined}>{line2}</div>}
        {line3 && <div ref={applyScramble ? scramble3Hook.ref : undefined}>{line3}</div>}
        {line4 && <div ref={applyScramble ? scramble4Hook.ref : undefined}>{line4}</div>}
      </div>
    );
  }

  return null;
}