"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionTitleLoop } from "@/components/SectionTitleLoop";
import { sectionTitles } from "@/lib/content/section-titles";
import { education } from "@/lib/content";
import { fadeInUp, staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";

export function EducationSection() {
  return (
    <section
      id="education"
      className="scroll-mt-24 py-20 md:py-28"
    >
      <SectionTitleLoop config={sectionTitles.education} className="-mx-6 mb-12" />
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          className="space-y-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {education.map((entry) => (
            <motion.div key={entry.id} variants={staggerItem}>
              <Card className="overflow-hidden transition-shadow hover:shadow-md">
                <CardContent>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{entry.degree}</h3>
                      <p className="text-muted-foreground">
                        {entry.institution}
                        {entry.location && ` · ${entry.location}`}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {entry.startDate} – {entry.endDate}
                      </p>
                    </div>
                    {entry.focus && entry.focus.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {entry.focus.map((f) => (
                          <Badge key={f} variant="outline" className="text-xs">
                            {f}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  {entry.description && (
                    <p className="mt-3 text-sm text-muted-foreground">
                      {entry.description}
                    </p>
                  )}
                  <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    {entry.achievements.map((a, i) => (
                      <li key={i}>{a}</li>
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
