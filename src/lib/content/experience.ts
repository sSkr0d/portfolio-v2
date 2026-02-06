export type ExperienceEntry = {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  description: string;
  highlights: string[];
  techStack: string[];
};

export const experience: ExperienceEntry[] = [
  {
    id: "1",
    title: "Senior Software Engineer",
    company: "Tech Company",
    location: "Remote",
    startDate: "2022",
    endDate: "Present",
    description: "Building scalable web applications and leading frontend initiatives.",
    highlights: [
      "Led migration to Next.js and improved Core Web Vitals by 40%",
      "Mentored junior developers and established coding standards",
      "Shipped multiple product features used by 100k+ users",
    ],
    techStack: ["Next.js", "TypeScript", "React", "Node.js", "PostgreSQL"],
  },
  {
    id: "2",
    title: "Software Engineer",
    company: "Startup Inc",
    location: "San Francisco, CA",
    startDate: "2020",
    endDate: "2022",
    description: "Full-stack development with focus on user experience and performance.",
    highlights: [
      "Built real-time collaboration features with WebSockets",
      "Designed and implemented REST and GraphQL APIs",
      "Collaborated with design team on component library",
    ],
    techStack: ["React", "Node.js", "GraphQL", "MongoDB", "AWS"],
  },
  {
    id: "3",
    title: "Junior Developer",
    company: "Agency Co",
    location: "New York, NY",
    startDate: "2018",
    endDate: "2020",
    description: "Developed client websites and internal tools.",
    highlights: [
      "Delivered 15+ client projects on time",
      "Improved build pipeline and reduced deploy time",
      "Introduced automated testing for critical flows",
    ],
    techStack: ["JavaScript", "React", "PHP", "WordPress", "MySQL"],
  },
];
