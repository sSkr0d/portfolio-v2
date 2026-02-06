"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { projects } from "@/lib/content";
import { fadeInUp, staggerContainer, staggerItem, scaleOnHover, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="scroll-mt-24 px-6 py-20 md:py-28"
    >
      <div className="mx-auto max-w-5xl">
        <motion.h2
          className="mb-12 text-3xl font-bold tracking-tight sm:text-4xl"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          Projects
        </motion.h2>
        <motion.div
          className="grid gap-6 sm:grid-cols-2"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {projects.map((project) => (
            <motion.div key={project.id} variants={staggerItem}>
              <motion.div
                variants={scaleOnHover}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                <Card
                  className={cn(
                    "group h-full overflow-hidden transition-all",
                    "hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                  )}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold">{project.name}</h3>
                      {project.role && (
                        <Badge variant="secondary" className="shrink-0 text-xs">
                          {project.role}
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {project.description}
                    </p>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-1.5 pb-2">
                    {project.techStack.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </CardContent>
                  <CardFooter className="flex flex-wrap gap-2 border-t pt-4">
                    {project.githubUrl && (
                      <Button variant="ghost" size="sm" asChild>
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="View source on GitHub"
                        >
                          <Github className="size-4" />
                          Code
                        </a>
                      </Button>
                    )}
                    {project.liveUrl && (
                      <Button variant="ghost" size="sm" asChild>
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="View live site"
                        >
                          <ExternalLink className="size-4" />
                          Live
                        </a>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
