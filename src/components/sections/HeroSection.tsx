"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, Briefcase, Github, Linkedin, MapPin } from "lucide-react";
import {
  IdentificationCardIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  HeadCircuitIcon,
  GithubLogoIcon,
  EnvelopeSimpleIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { CometCard } from "@/components/ui/comet-card";
import { AnimatedCardReveal } from "@/components/AnimatedCardReveal";
import FlowingMenu from "@/components/FlowingMenu";

const name = "Mohd Hafiz Jumahiddin";
const role = "Full Stack Developer";
const location = "Kota Kinabalu, Sabah";
const workStatus = "Freelance / Open to Work";
const onlineStatus = "Online";
const githubUrl = "https://github.com";
const linkedinUrl = "https://linkedin.com";

const flowingMenuItems = [
  { link: "#about", text: "About" },
  { link: "#experience", text: "Experience" },
  { link: "#education", text: "Education" },
  { link: "#skills", text: "Skills" },
  { link: "#projects", text: "Projects" },
  { link: "#contact", text: "Contact" },
];

const mobileBubbles = [
  { text: "About", link: "#about", Icon: IdentificationCardIcon, color: "#6366f1" },
  { text: "Experience", link: "#experience", Icon: BriefcaseIcon, color: "#8b5cf6" },
  { text: "Education", link: "#education", Icon: GraduationCapIcon, color: "#7c3aed" },
  { text: "Skills", link: "#skills", Icon: HeadCircuitIcon, color: "#06b6d4" },
  { text: "Projects", link: "#projects", Icon: GithubLogoIcon, color: "#5b21b6" },
  { text: "Contact", link: "#contact", Icon: EnvelopeSimpleIcon, color: "#4c1d95" },
];

const orbitPositions: React.CSSProperties[] = [
  { top: -60, left: "15%" },
  { top: -76, left: "50%" },
  { top: -60, left: "85%" },
  { bottom: -60, left: "15%" },
  { bottom: -76, left: "50%" },
  { bottom: -60, left: "85%" },
];

const wanderPaths = [
  { x: [0, 3, -4, 5, -2, 1, 0], y: [0, -5, 2, -3, 6, -1, 0] },
  { x: [0, -3, 5, -2, 4, -4, 0], y: [0, 4, -6, 1, -4, 3, 0] },
  { x: [0, 4, -3, 2, -5, 3, 0], y: [0, -3, 5, -6, 2, -2, 0] },
  { x: [0, -5, 2, -3, 4, -1, 0], y: [0, 3, -4, 5, -2, 4, 0] },
  { x: [0, 2, -5, 3, -1, 4, 0], y: [0, -6, 3, -2, 5, -3, 0] },
  { x: [0, -2, 4, -5, 1, -3, 0], y: [0, 5, -3, 4, -5, 2, 0] },
];

export function HeroSection() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [menuHeight, setMenuHeight] = useState<number | null>(null);
  const [cardAnimDone, setCardAnimDone] = useState(false);

  const handleCardAnimComplete = useCallback(() => {
    setCardAnimDone(true);
  }, []);

  useEffect(() => {
    if (!cardRef.current) return;

    const updateHeight = () => {
      if (!cardRef.current) return;
      setMenuHeight(cardRef.current.offsetHeight);
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(cardRef.current);
    window.addEventListener("resize", updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-visible px-6 py-12 lg:flex-row lg:items-center lg:justify-center lg:gap-12"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 lg:flex-row lg:items-stretch lg:justify-between lg:gap-12">
        {/* Left: Comet Card (profile / Pokemon-style card) */}
        <div className="flex shrink-0 flex-col items-center lg:items-start">
          <div ref={cardRef}>
            <div className="relative">
              <AnimatedCardReveal onComplete={handleCardAnimComplete}>
              <CometCard className="relative z-10 w-[280px] max-w-[320px] sm:w-[300px]">
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
              </AnimatedCardReveal>

              {cardAnimDone && mobileBubbles.map((bubble, i) => (
                <motion.a
                  key={bubble.text}
                  href={bubble.link}
                  className="absolute lg:hidden"
                  style={{ ...orbitPositions[i], x: "-50%" }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.15 + i * 0.08,
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                  aria-label={`Navigate to ${bubble.text}`}
                >
                  <motion.div
                    className="relative w-12 h-12 rounded-full overflow-hidden"
                    style={{
                      background: bubble.color,
                      boxShadow: `0 4px 15px ${bubble.color}50, 0 0 20px ${bubble.color}30`,
                    }}
                    animate={{
                      ...wanderPaths[i],
                      scale: [1, 1.04, 1, 0.97, 1],
                    }}
                    transition={{
                      x: { duration: 6 + i * 1.2, repeat: Infinity, ease: "easeInOut" },
                      y: { duration: 7 + i * 1.4, repeat: Infinity, ease: "easeInOut" },
                      scale: { duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut" },
                    }}
                  >
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background:
                          "radial-gradient(circle at 65% 65%, rgba(0,0,0,0.35) 0%, transparent 70%)",
                      }}
                    />
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background:
                          "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.1) 35%, transparent 55%)",
                      }}
                    />
                    <div
                      className="absolute inset-0.5 rounded-full"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 45%)",
                      }}
                    />
                    <div className="relative z-10 flex items-center justify-center w-full h-full">
                      <bubble.Icon
                        size={22}
                        color="rgba(255,255,255,0.9)"
                        weight="duotone"
                      />
                    </div>
                  </motion.div>
                </motion.a>
              ))}
            </div>
          </div>
          {cardAnimDone && (
            <motion.div
              className="mt-24 flex flex-col items-center gap-2 lg:hidden"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <a
                href="#about"
                className="flex flex-col items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Scroll to about section"
              >
                <ArrowDown className="size-5 animate-bounce" />
                <span className="text-xs">Scroll</span>
              </a>
            </motion.div>
          )}
        </div>

        {/* Right: Flowing Menu (desktop only) */}
        <div
          className="hidden flex-1 overflow-hidden lg:flex lg:min-h-0"
          style={menuHeight ? { height: menuHeight } : undefined}
        >
          <FlowingMenu items={flowingMenuItems} className="h-full w-full" />
        </div>
      </div>
    </section>
  );
}
