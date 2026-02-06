"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown, Briefcase, Github, Linkedin, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CometCard } from "@/components/ui/comet-card";
import FlowingMenu from "@/components/FlowingMenu";
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  float,
  viewportOnce,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

const name = "Mohd Hafiz Jumahiddin";
const role = "Full Stack Developer";
const location = "Kota Kinabalu, Sabah";
const workStatus = "Freelance / Open to Work";
const onlineStatus = "Online";
const githubUrl = "https://github.com";
const linkedinUrl = "https://linkedin.com";

const flowingMenuItems = [
  {
    link: "#about",
    text: "About",
    image: "https://placehold.co/200x100/6366f1/fff?text=About",
  },
  {
    link: "#experience",
    text: "Experience",
    image: "https://placehold.co/200x100/8b5cf6/fff?text=Work",
  },
  {
    link: "#education",
    text: "Education",
    image: "https://placehold.co/200x100/7c3aed/fff?text=Edu",
  },
  {
    link: "#skills",
    text: "Skills",
    image: "https://placehold.co/200x100/6d28d9/fff?text=Skills",
  },
  {
    link: "#projects",
    text: "Projects",
    image: "https://placehold.co/200x100/5b21b6/fff?text=Projects",
  },
  {
    link: "#contact",
    text: "Contact",
    image: "https://placehold.co/200x100/4c1d95/fff?text=Contact",
  },
];

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center overflow-hidden px-6 py-24 lg:flex-row lg:items-stretch lg:justify-between lg:gap-12"
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
            "blur-[120px]",
          )}
        />
      </motion.div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 lg:flex-row lg:items-stretch lg:justify-between lg:gap-12">
        {/* Left: Comet Card (profile / Pokemon-style card) */}
        <motion.div
          className="flex shrink-0 flex-col items-center lg:items-start"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.div variants={staggerItem}>
            <CometCard className="w-[280px] max-w-[320px] sm:w-[300px]">
              <div className="relative overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-xl">
                <div className="p-4">
                  <div className="relative w-full overflow-hidden rounded-xl bg-muted min-h-[200px]">
                    <Image
                      src="/profilepic.png"
                      alt={`Profile photo of ${name}`}
                      className="object-cover object-center opacity-100"
                      fill
                      priority
                    />
                    {/* Decorative Elements */}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <div className="w-6 h-6 rounded-full bg-yellow-400/80 backdrop-blur-sm border border-white/20 flex items-center justify-center text-[10px] font-bold text-black shadow-lg">
                        ⚡
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 px-4 pb-4">
                  <h1 className="text-lg font-semibold leading-tight tracking-tight text-foreground sm:text-xl">
                    {name}
                  </h1>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                    {role}
                  </p>
                  <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="size-4 text-primary" />
                      <span>{location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="size-4 text-primary" />
                      <span>{workStatus}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                      <span>{onlineStatus}</span>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="justify-center gap-2 rounded-full"
                    >
                      <a
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="size-4" />
                        GitHub
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="justify-center gap-2 rounded-full"
                    >
                      <a
                        href={linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Linkedin className="size-4" />
                        LinkedIn
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </CometCard>
          </motion.div>
          <motion.div
            className="mt-6 flex flex-col items-center gap-2 lg:hidden"
            variants={staggerItem}
          >
            <Badge variant="secondary" className="text-xs">
              Available for work
            </Badge>
            <a
              href="#about"
              className="flex flex-col items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Scroll to about section"
            >
              <ArrowDown className="size-5 animate-bounce" />
              <span className="text-xs">Scroll</span>
            </a>
          </motion.div>
        </motion.div>

        {/* Right: Flowing Menu (desktop only) */}
        <div className="hidden min-h-[60vh] flex-1 overflow-hidden rounded-2xl border bg-muted/30 lg:flex lg:min-h-[70vh]">
          <FlowingMenu
            items={flowingMenuItems}
            textColor="hsl(var(--foreground))"
            bgColor="hsl(var(--muted))"
            marqueeBgColor="hsl(var(--primary))"
            marqueeTextColor="hsl(var(--primary-foreground))"
            borderColor="hsl(var(--border))"
            className="h-full w-full"
          />
        </div>
      </div>
    </section>
  );
}
