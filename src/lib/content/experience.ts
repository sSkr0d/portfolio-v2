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
      "Developed the system using Laravel, React, Tailwind, and MySQL, completed the development phase within 5 months.",
      "Integrated 3 open-source map APIs (OpenStreetMap, Nominatim, ORS) to enable route generation.",
      "Created system documentation and prepared a comprehensive user manual following government standards.",
      "Spearheaded project handover to department staff for code refactoring, penetration testing, and deployment."
    ],
    techStack: ["Laravel", "React", "Tailwind", "MySQL"],
  },
];
