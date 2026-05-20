"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type ParallaxProps = {
  className?: string;
  offset?: number;
  children: React.ReactNode;
};

export function Parallax({ className, offset = 40, children }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  if (reduced) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}
