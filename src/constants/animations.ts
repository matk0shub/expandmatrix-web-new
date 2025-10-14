/**
 * Animation constants and configurations
 * Centralized place for all animation-related settings
 */

export const ANIMATION_DURATION = {
  FAST: 0.3,
  NORMAL: 0.6,
  SLOW: 0.8,
  VERY_SLOW: 1.2,
} as const;

export const ANIMATION_EASING = {
  EASE_OUT: 'power3.out',
  EASE_IN: 'power3.in',
  EASE_IN_OUT: 'power3.inOut',
  LINEAR: 'linear',
  BOUNCE: 'bounce.out',
} as const;

export const ANIMATION_DELAYS = {
  STAGGER_SMALL: 0.1,
  STAGGER_MEDIUM: 0.2,
  STAGGER_LARGE: 0.3,
} as const;

export const INTERSECTION_THRESHOLD = {
  EARLY: 0.1,
  NORMAL: 0.3,
  LATE: 0.5,
} as const;

export const COMMON_ANIMATIONS = {
  FADE_IN_UP: {
    from: { opacity: 0, y: 50 },
    to: { opacity: 1, y: 0 },
  },
  FADE_IN_LEFT: {
    from: { opacity: 0, x: -50 },
    to: { opacity: 1, x: 0 },
  },
  FADE_IN_RIGHT: {
    from: { opacity: 0, x: 50 },
    to: { opacity: 1, x: 0 },
  },
  SCALE_IN: {
    from: { opacity: 0, scale: 0.8 },
    to: { opacity: 1, scale: 1 },
  },
} as const;
