"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import { SectionTitleLoop } from "@/components/SectionTitleLoop";
import { sectionTitles } from "@/lib/content/section-titles";
import { skills } from "@/lib/content";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";

/** Skills that use theme-based glow (white in dark mode, black in light) instead of brand color */
const BLACK_OR_NEAR_BLACK_HEX = ["#000000", "#0b0d0e"];
function isBlackBubble(hex: string) {
  return BLACK_OR_NEAR_BLACK_HEX.includes(hex.toLowerCase().trim());
}

const wanderPaths = [
  { x: [0, 3, -4, 5, -2, 1, 0], y: [0, -5, 2, -3, 6, -1, 0] },
  { x: [0, -3, 5, -2, 4, -4, 0], y: [0, 4, -6, 1, -4, 3, 0] },
  { x: [0, 4, -3, 2, -5, 3, 0], y: [0, -3, 5, -6, 2, -2, 0] },
  { x: [0, -5, 2, -3, 4, -1, 0], y: [0, 3, -4, 5, -2, 4, 0] },
  { x: [0, 2, -5, 3, -1, 4, 0], y: [0, -6, 3, -2, 5, -3, 0] },
  { x: [0, -2, 4, -5, 1, -3, 0], y: [0, 5, -3, 4, -5, 2, 0] },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const hoveredRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const animRef = useRef({ rotation: 0, progress: 0, inView: false, settle: 0, hoverGate: 0 });
  const [anim, setAnim] = useState({ rotation: 0, progress: 0, canStop: false });

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = mounted && resolvedTheme === "dark";

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        animRef.current.inView = entry.isIntersecting;
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    let rafId: number;
    let last = 0;

    const tick = (time: number) => {
      const dt = last ? time - last : 16;
      last = time;
      const r = animRef.current;

      // Progress animates 0 -> 1 over ~1500ms when in view, and 1 -> 0 over ~1500ms when out of view
      const direction = r.inView ? 1 : -1;
      const delta = (dt / 1500) * direction;
      r.progress = Math.max(0, Math.min(1, r.progress + delta));

      // While orbit is growing (progress < 1), keep rotation extremely fast and constant.
      // Once orbit has fully settled (progress === 1), start gradually slowing it down.
      const fastSpeed = 4.5; // rad/s during expansion (intentionally very fast)
      const minSpeed = 0.35; // rad/s when fully slowed

      if (r.inView && r.progress > 0.02) {
        if (r.progress < 1) {
          // Expanding phase: very fast rotation, no settling, no hover-stop allowed yet
          r.settle = 0;
          r.hoverGate = 0;
          r.rotation += fastSpeed * (dt / 1000);
        } else {
          // Expanded phase: gradually slow rotation down, then after it's fully settled,
          // open the hover gate 0.5s later.
          r.settle = Math.min(1, r.settle + dt / 1000); // ~1s to fully settle
          const rotationSpeed = lerp(fastSpeed, minSpeed, r.settle);

          const canStopRotation = r.hoverGate >= 1 && hoveredRef.current !== null;
          if (!canStopRotation) {
            r.rotation += rotationSpeed * (dt / 1000);
          }

          if (r.settle >= 1) {
            r.hoverGate = Math.min(1, r.hoverGate + dt / 500); // extra ~0.5s before hover can stop motion
          }
        }
      } else if (!r.inView) {
        // Reset settle and hover gate when leaving view so the intro restarts next time
        r.settle = 0;
        r.hoverGate = 0;
      }

      const canStopNow = r.hoverGate >= 1;

      setAnim((prev) => {
        if (
          Math.abs(prev.rotation - r.rotation) < 0.0001 &&
          Math.abs(prev.progress - r.progress) < 0.0001 &&
          prev.canStop === canStopNow
        ) {
          return prev;
        }
        return { rotation: r.rotation, progress: r.progress, canStop: canStopNow };
      });

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const handleHoverStart = (index: number) => {
    hoveredRef.current = index;
    setHoveredIndex(index);
  };

  const handleHoverEnd = (index: number) => {
    if (hoveredRef.current === index) {
      hoveredRef.current = null;
      setHoveredIndex(null);
    }
  };

  // Reset hover state when switching categories
  useEffect(() => {
    hoveredRef.current = null;
    setHoveredIndex(null);
  }, [activeIndex]);

  const t = anim.progress;
  const canStop = anim.canStop;
  const finalRadius = 38;
  const currentRadius = lerp(8, finalRadius, t);
  const yScale = lerp(0.4, 1, t);
  const tilt = lerp(Math.PI / 4, 0, t);
  const introScale = lerp(0.3, 1, t);
  const introOpacity = Math.min(1, t * 2.5);

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + skills.length) % skills.length);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % skills.length);
  };

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="scroll-mt-24 py-20 md:py-28"
    >
      <SectionTitleLoop config={sectionTitles.skills} className="-mx-6 mb-12" />
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <div className="w-full">
            <div className="relative mx-auto aspect-square max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
              {/* Center controls: skill type + arrows + dots */}
              <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
                <div className="pointer-events-auto flex flex-col items-center gap-2">
                  {/* Skill type label with optional line break */}
                  <div className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                    {(() => {
                      const name = skills[activeIndex]?.name ?? "";
                      const parts = name.split(" ");
                      if (parts.length <= 1) {
                        return <span className="block">{name}</span>;
                      }
                      const first = parts[0];
                      const rest = parts.slice(1).join(" ");
                      return (
                        <>
                          <span className="block">{first}</span>
                          <span className="block">{rest}</span>
                        </>
                      );
                    })()}
                  </div>

                  {/* Arrow • • • Arrow row */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={goPrev}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-background/80 text-muted-foreground shadow-sm transition-colors hover:border-primary/60 hover:text-primary cursor-default"
                      aria-label="Previous skill group"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>

                    <div className="flex items-center gap-1.5">
                      {skills.map((cat, idx) => (
                        <button
                          key={cat.name}
                          type="button"
                          onClick={() => setActiveIndex(idx)}
                          className={`h-1.5 w-3 rounded-full transition-all ${
                            idx === activeIndex
                              ? "bg-primary"
                              : "bg-muted-foreground/40 hover:bg-muted-foreground/70"
                          }`}
                          aria-label={`Go to ${cat.name}`}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={goNext}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-background/80 text-muted-foreground shadow-sm transition-colors hover:border-primary/60 hover:text-primary cursor-default"
                      aria-label="Next skill group"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {skills[activeIndex] && (
                  <motion.div
                    key={skills[activeIndex].name}
                    className="relative h-full w-full cursor-grab active:cursor-grabbing"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.15}
                    onDragEnd={(_, info) => {
                      if (info.offset.x > 60) {
                        goPrev();
                      } else if (info.offset.x < -60) {
                        goNext();
                      }
                    }}
                  >
                    {skills[activeIndex].items.map((skill, index) => {
                      const count = skills[activeIndex].items.length || 1;
                      const baseAngle = (2 * Math.PI * index) / count;
                      const angle = baseAngle + anim.rotation;

                      const rawX = currentRadius * Math.cos(angle);
                      const rawY = currentRadius * yScale * Math.sin(angle);

                      const x = rawX * Math.cos(tilt) - rawY * Math.sin(tilt);
                      const y = rawX * Math.sin(tilt) + rawY * Math.cos(tilt);

                      // Round positions so SSR and client compute identical strings (avoids hydration mismatch)
                      const topPos = Number((50 + y).toFixed(3));
                      const leftPos = Number((50 + x).toFixed(3));

                      const path = wanderPaths[index % wanderPaths.length];
                      const isHovered = hoveredIndex === index;
                      const shouldStop = isHovered && canStop;

                      const useThemeGlow = isBlackBubble(skill.color);
                      const glowColor = useThemeGlow
                        ? isDarkMode
                          ? "#ffffff"
                          : "#000000"
                        : skill.color;

                      const baseShadow = `0px 4px 15px ${glowColor}40, 0px 0px 20px ${glowColor}20`;
                      const hoverShadow = `0px 4px 22px ${glowColor}80, 0px 0px 40px ${glowColor}60`;

                      const Icon = skill.icon;

                      return (
                        <div
                          key={skill.label}
                          className="absolute"
                          style={{
                            top: `${topPos}%`,
                            left: `${leftPos}%`,
                            transform: `translate(-50%, -50%) scale(${introScale})`,
                            opacity: introOpacity,
                            willChange: "transform, opacity",
                          }}
                        >
                          <motion.div
                            className="flex flex-col items-center cursor-pointer"
                            animate={shouldStop ? { x: 0, y: 0 } : { x: path.x, y: path.y }}
                            transition={
                              shouldStop
                                ? {
                                    x: {
                                      type: "spring",
                                      stiffness: 140,
                                      damping: 18,
                                    },
                                    y: {
                                      type: "spring",
                                      stiffness: 140,
                                      damping: 18,
                                    },
                                  }
                                : {
                                    x: {
                                      duration: 6 + index * 1.2,
                                      repeat: Infinity,
                                      ease: "easeInOut",
                                    },
                                    y: {
                                      duration: 7 + index * 1.4,
                                      repeat: Infinity,
                                      ease: "easeInOut",
                                    },
                                  }
                            }
                            onHoverStart={() => handleHoverStart(index)}
                            onHoverEnd={() => handleHoverEnd(index)}
                            initial="rest"
                            whileHover="hover"
                          >
                            <motion.div
                              className="relative h-14 w-14 overflow-hidden rounded-full sm:h-16 sm:w-16 md:h-20 md:w-20"
                              style={{ background: skill.color }}
                              variants={{
                                rest: {
                                  scale: [1, 1.04, 1, 0.97, 1],
                                  boxShadow: baseShadow,
                                  transition: {
                                    scale: {
                                      duration: 4 + index * 0.5,
                                      repeat: Infinity,
                                      ease: "easeInOut",
                                    },
                                    boxShadow: { duration: 0.25, ease: "easeOut" },
                                  },
                                },
                                hover: {
                                  scale: 1.1,
                                  boxShadow: hoverShadow,
                                  transition: { duration: 0.15, ease: "easeOut" },
                                },
                              }}
                              aria-label={skill.label}
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

                              <div className="relative flex h-full w-full items-center justify-center">
                                <motion.div
                                  variants={{
                                    rest: {
                                      filter: `drop-shadow(0px 0px 0px ${glowColor}00) drop-shadow(0px 0px 0px ${glowColor}00)`,
                                      transition: { duration: 0.25, ease: "easeOut" },
                                    },
                                    hover: {
                                      filter: `drop-shadow(0px 0px 6px ${glowColor}80) drop-shadow(0px 0px 14px ${glowColor}70)`,
                                      transition: { duration: 0.15, ease: "easeOut" },
                                    },
                                  }}
                                >
                                  <Icon size={32} color="rgba(255,255,255,0.95)" />
                                </motion.div>
                              </div>
                            </motion.div>

                            <motion.span
                              className="mt-2 block text-center text-xs font-medium text-muted-foreground"
                              variants={{
                                rest: {
                                  color: "rgba(156, 163, 175, 1)",
                                  textShadow: `0px 0px 0px ${glowColor}00, 0px 0px 0px ${glowColor}00`,
                                  transition: { duration: 0.25, ease: "easeOut" },
                                },
                                hover: {
                                  color: glowColor,
                                  textShadow: `0px 0px 10px ${glowColor}70, 0px 0px 18px ${glowColor}60`,
                                  transition: { duration: 0.15, ease: "easeOut" },
                                },
                              }}
                            >
                              {skill.label}
                            </motion.span>
                          </motion.div>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
