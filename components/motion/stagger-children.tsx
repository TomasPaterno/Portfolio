"use client";

import { Children, isValidElement, type ReactNode } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations/variants";
import { viewportOnce } from "@/lib/animations/transitions";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type StaggerChildrenProps = {
  className?: string;
  childClassName?: string;
  children: ReactNode;
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
      {Children.map(children, (child, i) => (
        <motion.div
          key={isValidElement(child) ? (child.key ?? i) : i}
          className={cn(childClassName)}
          variants={staggerItem}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
