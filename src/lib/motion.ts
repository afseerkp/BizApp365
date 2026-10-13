import type { Transition, Variants } from 'framer-motion';

/** Shared motion tokens — every animation on the site pulls from here. */
export const ease = {
  out: [0.22, 1, 0.36, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
};

export const duration = {
  fast: 0.25,
  base: 0.5,
  slow: 0.8,
  slower: 1.2,
};

export const stagger = {
  tight: 0.04,
  base: 0.08,
  loose: 0.14,
};

export const spring: Transition = { type: 'spring', stiffness: 260, damping: 26, mass: 0.8 };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: ease.out } },
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: duration.base, ease: ease.out } },
};

export const staggerContainer = (step = stagger.base, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: step, delayChildren } },
});

export const viewportOnce = { once: true, margin: '-80px' } as const;
