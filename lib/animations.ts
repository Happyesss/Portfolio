import { EASINGS } from './constants';

// ─── Framer Motion Variants ───────────────────────────────────────────────

export const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASINGS.smooth },
  },
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASINGS.smooth },
  },
};

export const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: EASINGS.smooth },
  },
};

export const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: EASINGS.smooth },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: EASINGS.spring },
  },
};

export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren, delayChildren },
  },
});

export const slideReveal = {
  hidden: { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
  visible: {
    clipPath: 'inset(0 0% 0 0)',
    opacity: 1,
    transition: { duration: 0.9, ease: EASINGS.cinematic },
  },
};

export const letterReveal = {
  hidden: { y: '100%', opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: EASINGS.smooth },
  },
};

export const glassCardHover = {
  rest: {
    scale: 1,
    rotateX: 0,
    rotateY: 0,
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  },
  hover: {
    scale: 1.02,
    boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(79,172,254,0.15)',
    transition: { duration: 0.4, ease: EASINGS.smooth },
  },
};

export const orbFloat = {
  animate: {
    y: [0, -15, 0],
    x: [0, 8, -8, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const shimmerVariant = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

export const counterVariant = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: EASINGS.spring,
    },
  }),
};

export const pageTransition = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.02 },
  transition: { duration: 0.5, ease: EASINGS.cinematic },
};

// ─── GSAP Configs ─────────────────────────────────────────────────────────

export const gsapSectionReveal = {
  duration: 1.2,
  ease: 'power4.out',
  y: 60,
  opacity: 0,
};

export const gsapTextSplit = {
  duration: 0.8,
  ease: 'power3.out',
  stagger: 0.04,
};
