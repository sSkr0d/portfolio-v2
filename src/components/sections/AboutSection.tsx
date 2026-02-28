"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionTitleLoop } from "@/components/SectionTitleLoop";
import { sectionTitles } from "@/lib/content/section-titles";
import { fadeInUp, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";
import CircularText from "@/components/CircularText";

const about = {
  paragraph:
    "I'm a full-stack web developer and UI/UX designer based in Kota Kinabalu. I build fast, accessible web apps with TypeScript, React/Next.js, Tailwind and Node, and I've developed systems using Laravel and MySQL for government projects. I enjoy solving messy problems, simplifying user journeys, and collaborating with teams to ship reliable software.",
  highlights: [
    "Full-stack web development",
    "UI/UX design",
    "Problem solving",
    "Collaboration",
  ],
  interests: ["Laravel", "MySQL", "React", "TypeScript", "Tailwind", "UI/UX"],
};

export function AboutSection() {
  return (
    <section
      id="about"
      className="scroll-mt-24 py-20 md:py-28"
    >
      <SectionTitleLoop config={sectionTitles.about} className="-mx-6 mb-10" />
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <div className="shrink-0">
            <CircularText
              text="MOHD HAFIZ JUMAHIDDIN ✦ "
              onHover="speedUp"
              spinDuration={20}
            >
              <Avatar className="size-44 md:size-44 overflow-hidden rounded-full bg-muted">
                <AvatarImage
                  src="/profilepic.png"
                  alt="Profile photo of Mohd Hafiz Jumahiddin"
                  className="h-full w-full object-cover object-center"
                />
                <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                  {sectionTitles.about.title.split(" ").map((w) => w[0]).join("")}
                </AvatarFallback>
              </Avatar>
            </CircularText>
          </div>
          <Card className="flex-1 overflow-hidden transition-shadow hover:shadow-md">
            <CardContent>
              <div className="space-y-4">
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
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
