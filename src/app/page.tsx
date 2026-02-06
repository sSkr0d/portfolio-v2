import {
  HeroSection,
  AboutSection,
  ExperienceSection,
  EducationSection,
  SkillsSection,
  ProjectsSection,
  FooterSection,
} from "@/components/sections";

export default function Home() {
  return (
    <div id="main" className="min-h-screen" role="main">
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <EducationSection />
      <SkillsSection />
      <ProjectsSection />
      <FooterSection />
    </div>
  );
}
