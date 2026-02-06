export type ProjectEntry = {
  id: string;
  name: string;
  description: string;
  role?: string;
  techStack: string[];
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
};

export const projects: ProjectEntry[] = [
  {
    id: "1",
    name: "Portfolio Website",
    description: "Personal portfolio built with Next.js, shadcn/ui, and Framer Motion. Features smooth scroll, section components, and a playful design system.",
    role: "Solo",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "Framer Motion"],
    tags: ["Frontend", "Portfolio"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
  },
  {
    id: "2",
    name: "E-commerce Dashboard",
    description: "Admin dashboard for managing products, orders, and analytics. Real-time updates and role-based access.",
    role: "Lead",
    techStack: ["React", "Node.js", "PostgreSQL", "Redis", "Stripe"],
    tags: ["Full-stack", "Dashboard"],
    githubUrl: "https://github.com",
  },
  {
    id: "3",
    name: "Task Manager App",
    description: "Collaborative task management with drag-and-drop, comments, and due dates. Offline support with sync.",
    role: "Full-stack",
    techStack: ["Next.js", "Prisma", "tRPC", "Tailwind CSS"],
    tags: ["Productivity", "Real-time"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
  },
  {
    id: "4",
    name: "API Gateway",
    description: "Internal API gateway with rate limiting, caching, and request logging. Serves 10M+ requests/month.",
    role: "Backend",
    techStack: ["Node.js", "Redis", "Kafka", "Docker"],
    tags: ["Infrastructure", "API"],
    githubUrl: "https://github.com",
  },
];
