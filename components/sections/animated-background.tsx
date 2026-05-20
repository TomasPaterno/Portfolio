"use client";

import { motion } from "framer-motion";
import { Parallax } from "@/components/motion/parallax";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function AnimatedBackground() {
  const reduced = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.18),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_50%,hsl(var(--primary)/0.08),transparent_50%)]" />
      <Parallax offset={24} className="absolute inset-0">
        <div className="grid-fade absolute inset-0 opacity-40" />
      </Parallax>
      {!reduced && (
        <motion.div
          className="absolute -left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]"
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      {!reduced && (
        <motion.div
          className="absolute -right-1/4 bottom-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]"
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}
