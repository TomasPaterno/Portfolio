"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { fadeInUp } from "@/lib/animations/variants";
import { viewportOnce } from "@/lib/animations/transitions";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type ScrollRevealProps = Omit<HTMLMotionProps<"div">, "children"> & {
  delay?: number;
  children?: React.ReactNode;
};

export function ScrollReveal({
  className,
  delay = 0,
  children,
  ...props
}: ScrollRevealProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeInUp}
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
