"use client";

import { motion } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fadeInUp, staggerContainer, staggerItem, float, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

const name = "Your Name";
const tagline = "Building things for the web with passion and precision.";
const ctaLabel1 = "View projects";
const ctaLabel2 = "Get in touch";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center"
    >
      <motion.div
        className="absolute inset-0 -z-10 opacity-40"
        variants={float}
        initial="initial"
        animate="animate"
        aria-hidden
      >
        <div
          className={cn(
            "absolute left-1/2 top-1/3 size-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full",
            "bg-gradient-to-br from-[var(--gradient-accent-start)] to-[var(--gradient-accent-end)]",
            "blur-[120px]"
          )}
        />
      </motion.div>

      <motion.div
        className="flex max-w-3xl flex-col items-center gap-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <motion.div variants={staggerItem}>
          <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-xs">
            <Sparkles className="size-3.5" />
            Available for work
          </Badge>
        </motion.div>
        <motion.h1
          variants={staggerItem}
          className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Hi, I&apos;m{" "}
          <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
            {name}
          </span>
        </motion.h1>
        <motion.p
          variants={staggerItem}
          className="max-w-xl text-lg text-muted-foreground sm:text-xl"
        >
          {tagline}
        </motion.p>
        <motion.div
          variants={staggerItem}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <Button asChild size="lg" className="rounded-full px-6">
            <a href="#projects">{ctaLabel1}</a>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-6">
            <a href="#contact">{ctaLabel2}</a>
          </Button>
        </motion.div>
        <motion.a
          href="#about"
          variants={staggerItem}
          className="mt-8 flex flex-col items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Scroll to about section"
        >
          <ArrowDown className="size-5 animate-bounce" />
          <span className="text-xs">Scroll</span>
        </motion.a>
      </motion.div>
    </section>
  );
}
