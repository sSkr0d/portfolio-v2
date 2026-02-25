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
    title: "Full Stack Developer (Internship)",
    company: "Jabatan Perkhidmatan Komputer Negeri",
    location: "Kota Kinabalu, Sabah",
    startDate: "March 2025",
    endDate: "August 2025",
    description: "Developed a centralized web system for the Sabah State Government to manage official vehicle and driver bookings.",
    highlights: [
      "Led migration to Next.js and improved Core Web Vitals by 40%",
      "Mentored junior developers and established coding standards",
      "Shipped multiple product features used by 100k+ users",
    ],
    techStack: ["Next.js", "TypeScript", "React", "Node.js", "PostgreSQL"],
  },
];
