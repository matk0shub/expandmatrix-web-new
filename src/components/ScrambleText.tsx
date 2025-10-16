'use client';

import { useEffect, useMemo } from 'react';
import { useScramble } from 'use-scramble';
import { SCRAMBLE_CONFIG, SCRAMBLE_TRIGGERS } from '@/constants/scramble';

type Trigger = 'hover' | 'mount' | 'manual';

type ScrambleBaseProps = {
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
  trigger?: Trigger;
  cursor?: boolean;
  applyScramble?: boolean;
};

interface SingleLineProps extends ScrambleBaseProps {
  text: string;
}

interface MultiLineProps extends ScrambleBaseProps {
  line1?: string;
  line2?: string;
  line3?: string;
  line4?: string;
}

interface ScrambleTextProps extends ScrambleBaseProps {
  text?: string;
  line1?: string;
  line2?: string;
  line3?: string;
  line4?: string;
}

type IdleHandle = number | undefined;

type IdleCallback = () => void;

type CancelIdle = () => void;

const scheduleIdle = (callback: IdleCallback): CancelIdle => {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const globalWindow = window as Window & typeof globalThis & {
    requestIdleCallback?: (fn: IdleCallback, options?: { timeout?: number }) => IdleHandle;
    cancelIdleCallback?: (handle: IdleHandle) => void;
  };

  if (globalWindow.requestIdleCallback) {
    const idleHandle = globalWindow.requestIdleCallback(callback, { timeout: 2000 });
    return () => {
      if (idleHandle && globalWindow.cancelIdleCallback) {
        globalWindow.cancelIdleCallback(idleHandle);
      }
    };
  }

  const timeout = globalWindow.setTimeout(callback, 0);
  return () => globalWindow.clearTimeout(timeout);
};

const buildScrambleOptions = (
  text: string,
  {
    range = SCRAMBLE_CONFIG.RANGE,
    speed = SCRAMBLE_CONFIG.SPEED,
    tick = SCRAMBLE_CONFIG.TICK,
    step = SCRAMBLE_CONFIG.STEP,
    scramble = SCRAMBLE_CONFIG.SCRAMBLE,
    seed = SCRAMBLE_CONFIG.SEED,
    chance = SCRAMBLE_CONFIG.CHANCE,
    overdrive = SCRAMBLE_CONFIG.OVERDRIVE,
    overflow = SCRAMBLE_CONFIG.OVERFLOW,
  }: ScrambleBaseProps
) => ({
  text,
  range,
  speed,
  tick,
  step,
  scramble,
  seed,
  chance,
  overdrive,
  overflow,
  playOnMount: false,
});

function SingleLineScramble({
  text,
  className = '',
  range,
  speed,
  tick,
  step,
  scramble,
  seed,
  chance,
  overdrive,
  overflow,
  trigger = SCRAMBLE_TRIGGERS.HOVER,
  cursor = true,
}: SingleLineProps) {
  const options = useMemo(
    () => buildScrambleOptions(text, { range, speed, tick, step, scramble, seed, chance, overdrive, overflow }),
    [chance, overdrive, overflow, range, scramble, seed, speed, step, text, tick]
  );

  const scrambleHook = useScramble(options);

  useEffect(() => {
    if (trigger !== SCRAMBLE_TRIGGERS.MOUNT) {
      return undefined;
    }

    return scheduleIdle(() => scrambleHook.replay());
  }, [scrambleHook, trigger]);

  const handleMouseEnter = () => {
    if (trigger === SCRAMBLE_TRIGGERS.HOVER) {
      scrambleHook.replay();
    }
  };

  return (
    <span
      ref={scrambleHook.ref}
      className={className}
      onMouseEnter={handleMouseEnter}
      style={{ cursor: cursor ? 'pointer' : 'default' }}
    >
      {text}
    </span>
  );
}

function MultiLineScramble({
  line1,
  line2,
  line3,
  line4,
  className = '',
  range,
  speed,
  tick,
  step,
  scramble,
  seed = SCRAMBLE_CONFIG.SEED,
  chance,
  overdrive,
  overflow,
  trigger = SCRAMBLE_TRIGGERS.HOVER,
  cursor = true,
}: MultiLineProps) {
  const options1 = useMemo(
    () => buildScrambleOptions(line1 ?? '', { range, speed, tick, step, scramble, seed, chance, overdrive, overflow }),
    [chance, line1, overdrive, overflow, range, scramble, seed, speed, step, tick]
  );
  const options2 = useMemo(
    () => buildScrambleOptions(line2 ?? '', { range, speed, tick, step, scramble, seed: (seed ?? 0) + 1, chance, overdrive, overflow }),
    [chance, line2, overdrive, overflow, range, scramble, seed, speed, step, tick]
  );
  const options3 = useMemo(
    () => buildScrambleOptions(line3 ?? '', { range, speed, tick, step, scramble, seed: (seed ?? 0) + 2, chance, overdrive, overflow }),
    [chance, line3, overdrive, overflow, range, scramble, seed, speed, step, tick]
  );
  const options4 = useMemo(
    () => buildScrambleOptions(line4 ?? '', { range, speed, tick, step, scramble, seed: (seed ?? 0) + 3, chance, overdrive, overflow }),
    [chance, line4, overdrive, overflow, range, scramble, seed, speed, step, tick]
  );

  const scramble1 = useScramble(options1);
  const scramble2 = useScramble(options2);
  const scramble3 = useScramble(options3);
  const scramble4 = useScramble(options4);

  useEffect(() => {
    if (trigger !== SCRAMBLE_TRIGGERS.MOUNT) {
      return undefined;
    }

    return scheduleIdle(() => {
      if (line1) scramble1.replay();
      if (line2) scramble2.replay();
      if (line3) scramble3.replay();
      if (line4) scramble4.replay();
    });
  }, [line1, line2, line3, line4, scramble1, scramble2, scramble3, scramble4, trigger]);

  const handleMouseEnter = () => {
    if (trigger === SCRAMBLE_TRIGGERS.HOVER) {
      if (line1) scramble1.replay();
      if (line2) scramble2.replay();
      if (line3) scramble3.replay();
      if (line4) scramble4.replay();
    }
  };

  return (
    <div
      className={className}
      onMouseEnter={handleMouseEnter}
      style={{ cursor: cursor ? 'pointer' : 'default' }}
    >
      {line1 && <div ref={scramble1.ref}>{line1}</div>}
      {line2 && <div ref={scramble2.ref}>{line2}</div>}
      {line3 && <div ref={scramble3.ref}>{line3}</div>}
      {line4 && <div ref={scramble4.ref}>{line4}</div>}
    </div>
  );
}

export default function ScrambleText(props: ScrambleTextProps) {
  const {
    text,
    line1,
    line2,
    line3,
    line4,
    className = '',
    cursor = true,
    applyScramble = false,
  } = props;

  if (typeof text === 'string') {
    if (applyScramble) {
      return <SingleLineScramble {...(props as SingleLineProps)} text={text} />;
    }

    return <span className={className}>{text}</span>;
  }

  if (line1 || line2 || line3 || line4) {
    if (applyScramble) {
      return <MultiLineScramble {...(props as MultiLineProps)} />;
    }

    return (
      <div className={className} style={{ cursor: cursor ? 'pointer' : 'default' }}>
        {line1 && <div>{line1}</div>}
        {line2 && <div>{line2}</div>}
        {line3 && <div>{line3}</div>}
        {line4 && <div>{line4}</div>}
      </div>
    );
  }

  return null;
}
