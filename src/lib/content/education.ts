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
    degree: "B.S. Computer Science",
    institution: "State University",
    location: "City, State",
    startDate: "2014",
    endDate: "2018",
    description: "Focus on software engineering and systems.",
    achievements: [
      "Dean's List, 6 semesters",
      "Senior project: real-time chat application",
      "Teaching assistant for Data Structures",
    ],
    focus: ["Algorithms", "Web Development", "Databases"],
  },
  {
    id: "2",
    degree: "Certification",
    institution: "Online Platform",
    startDate: "2019",
    endDate: "2019",
    achievements: ["Cloud Architecture", "System Design"],
    focus: ["AWS", "Distributed Systems"],
  },
];
