export type EducationEntry = {
  id: string;
  degree: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate: string;
  description?: string;
  achievements: string[];
  focus?: string[];
};

export const education: EducationEntry[] = [
  {
    id: "1",
    degree: "Bachelor of Computer Science (Hons) (Software Engineering)",
    institution: "Universiti Malaysia Sabah",
    location: "Kota Kinabalu, Sabah",
    startDate: "September 2021",
    endDate: "November 2025",
    description: "Focus on computer programming, software engineering principles, system analysis and design, and software evolution.",
    achievements: [
      "Dean's List, 4 semesters",
      "Final Year Project: Student Housing Portal",
    ],
    focus: ["Computer Programming", "Software Engineering Principles", "System Analysis and Design", "Software Evolution"],
  },
  {
    id: "2",
    degree: "Foundation in Information Technology",
    institution: "Universiti Malaysia Sabah",
    location: "Kota Kinabalu, Sabah",
    startDate: "August 2020",
    endDate: "July 2021",
    description: "Focus on the fundamentals of programming, mathematics, databases, and multimedia.",
    achievements: [
      "Dean's List, 2 semesters",
      "Final Year Project: KoUMS Inventory System",
    ],
    focus: ["Programming", "Mathematics", "Databases", "Multimedia"],
  },
];
