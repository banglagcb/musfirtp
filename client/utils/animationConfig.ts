import { Variants, Transition, Target } from 'framer-motion';

// Optimized animation configurations for better performance
export const ANIMATION_CONFIG = {
  // Reduced motion for accessibility and performance
  reducedMotion: {
    transition: { duration: 0.01 },
    initial: {},
    animate: {},
    exit: {},
  },
  
  // Fast transitions for better perceived performance
  fast: {
    duration: 0.2,
    ease: "easeOut",
  },
  
  // Standard transitions
  standard: {
    duration: 0.3,
    ease: "easeInOut",
  },
  
  // Smooth springs for interactive elements
  spring: {
    type: "spring" as const,
    stiffness: 300,
    damping: 25,
  },
  
  // Optimized stagger for lists
  stagger: {
    staggerChildren: 0.05, // Reduced from 0.1 for faster rendering
    delayChildren: 0.02,
  },
} as const;

// Optimized variants for common animations
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: ANIMATION_CONFIG.fast,
  },
};

export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: ANIMATION_CONFIG.fast,
  },
};

export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: ANIMATION_CONFIG.spring,
  },
};

export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -100,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: ANIMATION_CONFIG.standard,
  },
};

export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 100,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: ANIMATION_CONFIG.standard,
  },
};

// Staggered container for lists
export const staggeredContainer: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: ANIMATION_CONFIG.stagger,
  },
};

// Card animations optimized for dashboard
export const cardHover = {
  scale: 1.05,
  y: -5,
  transition: ANIMATION_CONFIG.spring,
};

export const cardTap = {
  scale: 0.98,
  transition: ANIMATION_CONFIG.fast,
};

// Modal animations
export const modalBackdrop: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: ANIMATION_CONFIG.fast,
  },
  exit: {
    opacity: 0,
    transition: ANIMATION_CONFIG.fast,
  },
};

export const modalContent: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: ANIMATION_CONFIG.spring,
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    transition: ANIMATION_CONFIG.fast,
  },
};

// Loading animations
export const spinner = {
  animate: {
    rotate: 360,
  },
  transition: {
    duration: 1,
    repeat: Infinity,
    ease: "linear",
  },
};

export const pulse = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

// Performance utilities
export function shouldReduceMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function getOptimizedVariants(variants: Variants): Variants {
  if (shouldReduceMotion()) {
    return ANIMATION_CONFIG.reducedMotion;
  }
  return variants;
}

// Layout animation optimizations
export const layoutTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 25,
  mass: 0.8,
};

// Viewport-based animations for performance
export const viewportConfig = {
  once: true, // Animate only once for better performance
  amount: 0.3, // Trigger when 30% visible
  margin: "0px 0px -50px 0px", // Trigger slightly before entering viewport
};

// Optimized page transitions
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    x: 100,
  },
  in: {
    opacity: 1,
    x: 0,
    transition: ANIMATION_CONFIG.standard,
  },
  out: {
    opacity: 0,
    x: -100,
    transition: ANIMATION_CONFIG.fast,
  },
};

// Floating animation for decorative elements
export const floating = {
  animate: {
    y: [0, -10, 0],
  },
  transition: {
    duration: 3,
    repeat: Infinity,
    repeatType: "reverse" as const,
    ease: "easeInOut",
  },
};

// Optimized hover animations for buttons
export const buttonHover = {
  scale: 1.02,
  transition: ANIMATION_CONFIG.fast,
};

export const buttonTap = {
  scale: 0.98,
  transition: {
    duration: 0.1,
    ease: "easeOut",
  },
};
