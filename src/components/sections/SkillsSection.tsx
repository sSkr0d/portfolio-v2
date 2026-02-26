"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { skills } from "@/lib/content";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";

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
  const [isDarkMode, setIsDarkMode] = useState(false);

  const animRef = useRef({ rotation: 0, progress: 0, inView: false, settle: 0, hoverGate: 0 });
  const [anim, setAnim] = useState({ rotation: 0, progress: 0, canStop: false });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event: MediaQueryListEvent) => {
      setIsDarkMode(event.matches);
    };

    setIsDarkMode(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

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

  const t = anim.progress;
  const canStop = anim.canStop;
  const finalRadius = 38;
  const currentRadius = lerp(8, finalRadius, t);
  const yScale = lerp(0.4, 1, t);
  const tilt = lerp(Math.PI / 4, 0, t);
  const introScale = lerp(0.3, 1, t);
  const introOpacity = Math.min(1, t * 2.5);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="scroll-mt-24 px-6 py-20 md:py-28"
    >
      <div className="mx-auto max-w-4xl">
        <motion.h2
          className="mb-12 text-3xl font-bold tracking-tight sm:text-4xl"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          Skills
        </motion.h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <Tabs defaultValue={skills[0]?.name ?? ""} className="w-full">
            <TabsList className="mb-6 flex h-auto flex-wrap gap-2 bg-muted/50 p-2">
              {skills.map((cat) => (
                <TabsTrigger
                  key={cat.name}
                  value={cat.name}
                  className="rounded-full px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {cat.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {skills.map((category) => {
              const count = category.items.length || 1;

              return (
                <TabsContent key={category.name} value={category.name} className="mt-0">
                  <div className="relative mx-auto aspect-square max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                    {category.items.map((skill, index) => {
                      const baseAngle = (2 * Math.PI * index) / count;
                      const angle = baseAngle + anim.rotation;

                      const rawX = currentRadius * Math.cos(angle);
                      const rawY = currentRadius * yScale * Math.sin(angle);

                      const x = rawX * Math.cos(tilt) - rawY * Math.sin(tilt);
                      const y = rawX * Math.sin(tilt) + rawY * Math.cos(tilt);

                      const topPos = 50 + y;
                      const leftPos = 50 + x;

                      const path = wanderPaths[index % wanderPaths.length];
                      const isHovered = hoveredIndex === index;
                      const shouldStop = isHovered && canStop;

                      const isBlack = skill.color.toLowerCase() === "#000000";
                      const glowColor = isBlack
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
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}
