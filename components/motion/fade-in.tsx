"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { fadeIn } from "@/lib/animations/variants";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type FadeInProps = Omit<HTMLMotionProps<"div">, "children"> & {
  delay?: number;
  children?: React.ReactNode;
};

export function FadeIn({ className, delay = 0, children, ...props }: FadeInProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={fadeIn}
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
