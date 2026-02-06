"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fadeInUp, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

const about = {
  heading: "About me",
  paragraph:
    "I'm a software engineer who loves turning ideas into fast, accessible, and delightful products. I focus on frontend and full-stack development, with a soft spot for clean APIs and great DX.",
  highlights: [
    "Frontend & full-stack development",
    "User experience and accessibility",
    "Open source and side projects",
  ],
  interests: ["Web", "TypeScript", "UI/UX", "APIs", "Learning"],
};

export function AboutSection() {
  return (
    <section
      id="about"
      className="scroll-mt-24 px-6 py-20 md:py-28"
    >
      <div className="mx-auto max-w-4xl">
        <motion.h2
          className="mb-10 text-3xl font-bold tracking-tight sm:text-4xl"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {about.heading}
        </motion.h2>
        <motion.div
          className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <Avatar className="size-24 shrink-0 md:size-32">
            <AvatarFallback className="bg-primary/20 text-primary text-2xl">
              {about.heading.split(" ").map((w) => w[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              {about.paragraph}
            </p>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              {about.highlights.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2 pt-2">
              {about.interests.map((interest) => (
                <Badge
                  key={interest}
                  variant="outline"
                  className="rounded-full px-3 py-1"
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
