export type SkillCategory = {
  name: string;
  items: string[];
};

export const skills: SkillCategory[] = [
  {
    name: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "SQL", "HTML", "CSS"],
  },
  {
    name: "Frameworks & Libraries",
    items: ["React", "Next.js", "Node.js", "Express", "Tailwind CSS"],
  },
  {
    name: "Tools & Platforms",
    items: ["Git", "Docker", "AWS", "Vercel", "Figma", "Postman"],
  },
  {
    name: "Concepts",
    items: ["REST APIs", "GraphQL", "Responsive Design", "Accessibility", "Testing"],
  },
];
