import type { Variants } from "framer-motion";

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export const scaleOnHover: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export const parallaxY = (offset: number): Variants => ({
  hidden: { y: offset },
  visible: { y: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } },
});
