/**
 * Scramble text effect configuration
 * Centralized settings for all scramble animations
 */

export const SCRAMBLE_CONFIG = {
  RANGE: [48, 90] as [number, number], // 0-9 (48-57) and A-Z (65-90)
  SPEED: 0.4,
  TICK: 1,
  STEP: 5,
  SCRAMBLE: 2,
  SEED: 10,
  CHANCE: 1,
  OVERDRIVE: false,
  OVERFLOW: true,
} as const;

export const SCRAMBLE_TRIGGERS = {
  HOVER: 'hover',
  MOUNT: 'mount',
  MANUAL: 'manual',
} as const;
