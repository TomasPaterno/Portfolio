export const premiumTransition = {
  duration: 0.6,
  ease: [0.22, 1, 0.36, 1] as const,
};

export const springTransition = {
  type: "spring" as const,
  stiffness: 120,
  damping: 20,
};

export const viewportOnce = {
  once: true,
  margin: "-80px" as const,
  amount: 0.2 as const,
};
