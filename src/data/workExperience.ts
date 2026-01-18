export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  dates: string;
  description: string[];
  techStack: string[];
  location?: string;
  highlights?: string[];
  projects?: string[];
  type: "Full-Time" | "Consulting" | "Freelance" | "Tutoring";
}

export const workExperienceData: WorkExperience[] = [
  {
    id: "resolute-consulting",
    type: "Consulting",
    company: "Resolute Consulting Group",
    role: "Lead Software Consultant",
    dates: "Oct 2024 - Present",
    location: "Remote",
    description: [
      "Help organizations evolve business-critical systems by making complexity visible, decisions traceable, and production behavior predictable",
      "Take ownership of systems where feature velocity has outpaced architectural structure",
      "Stabilize frontend behavior by replacing ad-hoc state with explicit models",
      "Consolidate and modernize backend services into maintainable domain models",
    ],
    techStack: [
      "ASP.NET Core",
      "React",
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "Azure",
      "Kubernetes",
      "Docker",
      "Pulumi",
    ],
    highlights: [
      "Systems modernization",
      "Platform stabilization",
      "Production reliability",
      "Architecture clarity",
    ],
    projects: [
      "Insurance Platform: Led architecture stabilization, replacing tightly coupled UI state with explicit models and consolidating backend into coherent ASP.NET Core API",
      "Renewable Energy Platform: Reverse-engineered 15+ microservice system across 18 repos, clarified environment parity and reduced onboarding friction",
      "Energy Forecasting: Replaced manual forecasting workflows with structured Oracle pipeline for financial reporting",
      "Mining Finance: Modernized spreadsheet-driven processes into auditable data structures",
    ],
  },
  {
    id: "capgemini",
    type: "Consulting",
    company: "Capgemini",
    role: "Full Stack Developer",
    dates: "2021 - 2022",
    location: "Remote",
    description: [
      "Developed enterprise applications for global clients",
      "Built web applications using modern frameworks",
      "Collaborated with international teams across time zones",
      "Participated in agile development methodologies",
    ],
    techStack: [
      "React",
      "Angular",
      "TypeScript",
      "Java",
      "Spring Boot",
      "Node.js",
      "PostgreSQL",
      "AWS",
      "Docker",
      "Git",
    ],
    highlights: [
      "Enterprise development",
      "Global collaboration",
      "Agile methodology",
    ],
  },
  {
    id: "varsity-tutors",
    type: "Tutoring",
    company: "Varsity Tutors",
    role: "Programming Tutor",
    dates: "Oct 2023 - Oct 2024",
    location: "Remote",
    description: [
      "Provide personalized programming instruction to students of all skill levels",
      "Teach Python, JavaScript, React, and data structures/algorithms",
      "Help students prepare for technical interviews",
      "Adapt teaching methods to individual learning styles",
    ],
    techStack: [
      "Python",
      "JavaScript",
      "React",
      "TypeScript",
      "Data Structures",
      "Algorithms",
    ],
    highlights: [
      "Technical interview prep",
      "Personalized instruction",
      "Fundamentals teaching",
    ],
  },
  {
    id: "outlier-ai",
    type: "Consulting",
    company: "Outlier AI",
    role: "AI Training Specialist",
    dates: "2022 - 2023",
    location: "Remote",
    description: [
      "Evaluated AI model responses for reasoning quality and accuracy",
      "Identified flaws in multi-step reasoning chains",
      "Provided corrections and feedback to improve model behavior",
    ],
    techStack: ["AI/ML", "Reasoning Analysis", "Quality Evaluation"],
    highlights: [
      "AI response evaluation",
      "Reasoning chain analysis",
      "Model feedback",
    ],
  }
];