import {
  IdentificationCardIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  HeadCircuitIcon,
  GithubLogoIcon,
  EnvelopeSimpleIcon,
} from "@phosphor-icons/react";
import type { ComponentType } from "react";

export interface SectionTitleConfig {
  title: string;
  Icon: ComponentType<{ size?: number; color?: string; weight?: "duotone" }>;
  iconColor: string;
  iconBgClass: string;
}

export const sectionTitles: Record<string, SectionTitleConfig> = {
  about: {
    title: "About me",
    Icon: IdentificationCardIcon,
    iconColor: "#6366f1",
    iconBgClass: "bg-indigo-100 dark:bg-indigo-200",
  },
  experience: {
    title: "Work experience",
    Icon: BriefcaseIcon,
    iconColor: "#8b5cf6",
    iconBgClass: "bg-violet-100 dark:bg-violet-200",
  },
  education: {
    title: "Education",
    Icon: GraduationCapIcon,
    iconColor: "#7c3aed",
    iconBgClass: "bg-purple-100 dark:bg-purple-200",
  },
  skills: {
    title: "Skills",
    Icon: HeadCircuitIcon,
    iconColor: "#06b6d4",
    iconBgClass: "bg-cyan-100 dark:bg-cyan-200",
  },
  projects: {
    title: "Projects",
    Icon: GithubLogoIcon,
    iconColor: "#5b21b6",
    iconBgClass: "bg-violet-100 dark:bg-violet-200",
  },
  contact: {
    title: "Contact",
    Icon: EnvelopeSimpleIcon,
    iconColor: "#4c1d95",
    iconBgClass: "bg-purple-100 dark:bg-purple-200",
  },
};
