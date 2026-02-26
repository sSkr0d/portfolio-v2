import type { IconType } from "react-icons";
import {
  FaCss3Alt,
  FaDocker,
  FaFigma,
  FaGitAlt,
  FaHtml5,
  FaLaravel,
  FaNodeJs,
  FaPhp,
  FaReact,
} from "react-icons/fa";
import {
  SiExpress,
  SiMysql,
  SiNextdotjs,
  SiPostman,
  SiRailway,
  SiTailwindcss,
  SiJavascript,
  SiTypescript,
  SiVercel,
} from "react-icons/si";

export type SkillItem = {
  label: string;
  color: string;
  icon: IconType;
};

export type SkillCategory = {
  name: string;
  items: SkillItem[];
};

export const skills: SkillCategory[] = [
  {
    name: "Languages",
    items: [
      {
        label: "TypeScript",
        color: "#3178C6",
        icon: SiTypescript,
      },
      {
        label: "JavaScript",
        color: "#F7DF1E",
        icon: SiJavascript,
      },
      {
        label: "PHP",
        color: "#777BB4",
        icon: FaPhp,
      },
      {
        label: "SQL",
        color: "#4479A1",
        icon: SiMysql,
      },
      {
        label: "HTML",
        color: "#E34F26",
        icon: FaHtml5,
      },
      {
        label: "CSS",
        color: "#1572B6",
        icon: FaCss3Alt,
      },
    ],
  },
  {
    name: "Frameworks & Libraries",
    items: [
      {
        label: "Laravel",
        color: "#FF2D20",
        icon: FaLaravel,
      },
      {
        label: "React",
        color: "#61DAFB",
        icon: FaReact,
      },
      {
        label: "Next.js",
        color: "#000000",
        icon: SiNextdotjs,
      },
      {
        label: "Node.js",
        color: "#3C873A",
        icon: FaNodeJs,
      },
      {
        label: "Express",
        color: "#000000",
        icon: SiExpress,
      },
      {
        label: "Tailwind CSS",
        color: "#38BDF8",
        icon: SiTailwindcss,
      },
    ],
  },
  {
    name: "Tools & Platforms",
    items: [
      {
        label: "Git",
        color: "#F1502F",
        icon: FaGitAlt,
      },
      {
        label: "Docker",
        color: "#2496ED",
        icon: FaDocker,
      },
      {
        label: "Railway",
        color: "#0B0D0E",
        icon: SiRailway,
      },
      {
        label: "Vercel",
        color: "#000000",
        icon: SiVercel,
      },
      {
        label: "Figma",
        color: "#F24E1E",
        icon: FaFigma,
      },
      {
        label: "Postman",
        color: "#FF6C37",
        icon: SiPostman,
      },
    ],
  },
];
