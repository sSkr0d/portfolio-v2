"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { experience } from "@/lib/content";
import { fadeInUp, staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function ExperienceSection() {
  return (
    <section
      id="experience"
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
          Work experience
        </motion.h2>
        <motion.div
          className="space-y-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {experience.map((entry, index) => (
            <motion.div key={entry.id} variants={staggerItem}>
              <Card className={cn("overflow-hidden transition-shadow hover:shadow-md")}>
                <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{entry.title}</h3>
                    <p className="text-muted-foreground">
                      {entry.company}
                      {entry.location && ` · ${entry.location}`}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {entry.startDate} – {entry.endDate}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {entry.techStack.slice(0, 4).map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground text-sm">{entry.description}</p>
                  <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    {entry.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
