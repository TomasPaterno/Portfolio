"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations/variants";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { AnimatedBackground } from "@/components/sections/animated-background";

export function Hero() {
  const reduced = useReducedMotion();

  const content = (
    <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-center px-6 pt-24 pb-20">
      <p className="font-mono text-sm uppercase tracking-[0.2em] text-primary">
        Embedded · Robotics · Electronics
      </p>
      <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
        <span className="text-gradient-accent">{siteConfig.name}</span>
        <br />
        <span className="text-gradient">{siteConfig.title}</span>
      </h1>
      <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
        {siteConfig.description}
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Button asChild size="lg">
          <Link href="/projects">
            View projects
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/about">About me</Link>
        </Button>
      </div>
    </div>
  );

  if (reduced) {
    return (
      <section className="relative overflow-hidden">
        <AnimatedBackground />
        {content}
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden">
      <AnimatedBackground />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative"
      >
        <motion.div variants={staggerItem}>
          <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-center px-6 pt-24 pb-20">
            <motion.p
              variants={fadeInUp}
              className="font-mono text-sm uppercase tracking-[0.2em] text-primary"
            >
              Embedded · Robotics · Electronics
            </motion.p>
            <motion.h1
              variants={fadeInUp}
              className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
            >
              <span className="text-gradient-accent">{siteConfig.name}</span>
              <br />
              <span className="text-gradient">{siteConfig.title}</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
            >
              {siteConfig.description}
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/projects">
                  View projects
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/about">About me</Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
