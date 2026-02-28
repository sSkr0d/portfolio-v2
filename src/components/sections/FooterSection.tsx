"use client";

import { Github, Linkedin, Mail, MapPin } from "lucide-react";
import { SectionTitleLoop } from "@/components/SectionTitleLoop";
import { sectionTitles } from "@/lib/content/section-titles";
import { cn } from "@/lib/utils";

const currentYear = new Date().getFullYear();
const location = "Your City, Country";
const email = "hello@example.com";
const githubUrl = "https://github.com/sSkr0d";
const linkedinUrl = "https://linkedin.com/in/hafizjbi";

export function FooterSection() {
  return (
    <footer
      id="contact"
      className="scroll-mt-24 border-t bg-muted/30 py-12 md:py-16"
    >

      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 text-center">
        <div className="flex flex-wrap items-center justify-center gap-6">
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Email"
          >
            <Mail className="size-5" />
            <span className="text-sm">{email}</span>
          </a>
          <span className="flex items-center gap-2 text-muted-foreground text-sm">
            <MapPin className="size-4" aria-hidden />
            {location}
          </span>
        </div>
        <div className="flex gap-4">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="GitHub"
          >
            <Github className="size-5" />
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="LinkedIn"
          >
            <Linkedin className="size-5" />
          </a>
        </div>
        <p className="text-muted-foreground text-sm">
          © {currentYear} Portfolio. Built with Next.js, shadcn/ui & Framer Motion.
        </p>
      </div>
    </footer>
  );
}
