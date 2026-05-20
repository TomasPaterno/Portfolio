"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations/variants";
import { viewportOnce } from "@/lib/animations/transitions";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type StaggerChildrenProps = {
  className?: string;
  childClassName?: string;
  children: React.ReactNode;
};

export function StaggerChildren({
  className,
  childClassName,
  children,
}: StaggerChildrenProps) {
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
      variants={staggerContainer}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div
              key={i}
              className={cn(childClassName)}
              variants={staggerItem}
            >
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}
