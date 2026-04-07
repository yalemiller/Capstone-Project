/**
 * Reusable animation variants for Motion components
 * Standardizes animations across the application
 */

import { ANIMATION_DURATION, ANIMATION_DELAYS } from '../constants';

// ============================================
// FADE ANIMATIONS
// ============================================

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const fadeInWithDelay = (delay: number = ANIMATION_DELAYS.short) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: ANIMATION_DURATION.normal, delay },
});

// ============================================
// SLIDE ANIMATIONS
// ============================================

export const slideInFromLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: ANIMATION_DURATION.normal },
};

export const slideInFromRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: ANIMATION_DURATION.normal },
};

export const slideInFromBottom = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: ANIMATION_DURATION.normal },
};

// ============================================
// SCALE ANIMATIONS
// ============================================

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: ANIMATION_DURATION.slow },
};

export const popIn = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.5 },
  transition: { duration: ANIMATION_DURATION.normal, ease: 'easeOut' },
};

// ============================================
// CONTINUOUS ANIMATIONS
// ============================================

export const bobbingAnimation = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    y: [0, -10, 0],
  },
  transition: {
    opacity: { delay: ANIMATION_DELAYS.initial, duration: ANIMATION_DURATION.normal },
    y: {
      delay: ANIMATION_DELAYS.afterInitial,
      duration: ANIMATION_DURATION.bob,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// ============================================
// SCENE 3 SPECIFIC ANIMATIONS
// ============================================

export const foodBlockAnimation = {
  initial: { opacity: 0, y: 50, scale: 0.5 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: ANIMATION_DURATION.normal, ease: 'easeOut' },
};

export const errorFlashAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 0.3 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

export const gradientTransition = {
  transition: { duration: ANIMATION_DURATION.transition, ease: 'easeInOut' },
};

// ============================================
// SCENE 2 SPECIFIC ANIMATIONS
// ============================================

export const headlineAnimation = (delay: number = ANIMATION_DELAYS.medium) => ({
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: ANIMATION_DURATION.normal, delay },
});

export const personAnimation = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: ANIMATION_DURATION.slow, delay: ANIMATION_DELAYS.short },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Create a staggered animation for multiple children
 */
export const staggerChildren = (delayBetween: number = 0.1) => ({
  animate: {
    transition: {
      staggerChildren: delayBetween,
    },
  },
});

/**
 * Create a custom fade in with configurable parameters
 */
export const customFadeIn = (
  duration: number = ANIMATION_DURATION.normal,
  delay: number = 0
) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration, delay },
});
