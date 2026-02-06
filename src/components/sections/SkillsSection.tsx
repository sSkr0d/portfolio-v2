"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { skills } from "@/lib/content";
import { fadeInUp, staggerContainer, staggerItem, scaleOnHover, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function SkillsSection() {
  return (
    <section
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
            {skills.map((category) => (
              <TabsContent key={category.name} value={category.name} className="mt-0">
                <motion.div
                  className="grid gap-3 sm:grid-cols-2"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                >
                  {category.items.map((skill, i) => (
                    <motion.div key={skill} variants={staggerItem}>
                      <motion.div
                        variants={scaleOnHover}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Card className="cursor-default transition-colors hover:border-primary/30 hover:bg-muted/30">
                          <CardContent className="py-3 font-medium">
                            {skill}
                          </CardContent>
                        </Card>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}
