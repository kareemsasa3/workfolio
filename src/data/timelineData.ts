import {
  faBook,
  faPlane,
  faGamepad,
  faBolt,
  faHardHat,
  faBriefcase,
  faHeartPulse,
  faCode,
  faRocket,
  faBirthdayCake,
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  description: string;
  icon: IconDefinition;
  category: "personal" | "career" | "milestone" | "education";
  era: string; // The group this event belongs to
  image?: string | { dark: string; light: string }; // Optional image URL for flip card, or theme-specific images
}

export const timelineData: TimelineEvent[] = [
  // --- Era: Present & Future ---
  {
    id: 15,
    date: "2025 - Present",
    title: "Erebus: Systems That Understand Themselves",
    description: `My current focus is Erebus OS, an event-driven coordination layer for Linux. This project represents my belief that systems should not only respond to events but understand them, adapt in real-time, and proactively surface insights that inform decision-making. Currently at v0.6.3, it’s evolved with belief engines, session tracking, and real-time emitters.`,
    icon: faRocket,
    category: "milestone",
    era: "Present & Future",
  },
  {
    id: 14,
    date: "Present",
    title: "Expanding Workfolio: A Developer Simulation",
    description: `A dynamic OS in the browser that encapsulates how I think, build, and innovate. It serves as a living reflection of my journey, from early challenges to moments of rebuilding, and is a platform for pushing the boundaries of what a portfolio can represent.`,
    icon: faRocket,
    category: "milestone",
    era: "Present & Future",
    image: {
      dark: "https://images.unsplash.com/photo-1641545423876-3d7dc842132c?q=80&w=1843&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      light:
        "https://images.unsplash.com/photo-1741795990534-9e5050558172?q=80&w=2532&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  },
  // --- Era: Redemption Arc ---
  {
    id: 13,
    date: "Dec 2025",
    title: "Aether: Sound as Infrastructure",
    description: `I created Aether, a real-time audio visualization engine designed with lock-free IPC and zero-copy shared memory for efficient data flow. It broadcasts acoustic state without blocking the analysis pipeline, enabling seamless integration across processes. This project, which gained recognition online, reinforced my belief that the most effective systems are those that operate autonomously without needing to know who’s consuming the data.`,
    icon: faCode,
    category: "milestone",
    era: "Redemption Arc",
  },
  {
    id: 12,
    date: "06/2025",
    title: "Engineering with Empathy",
    description: `I contributed to an accessible AI platform for a nonprofit that supported individuals with disabilities. Working on solutions for neurodiverse users and low-bandwidth devices taught me the importance of empathy in engineering. While my role was brief, the lessons I learned have had a lasting impact on my approach to problem-solving.`,
    icon: faHeartPulse,
    category: "career",
    era: "Redemption Arc",
    image:
      "https://images.unsplash.com/photo-1674027444485-cec3da58eef4?q=80&w=2532&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 11,
    date: "06/2025",
    title: "Arachne: Engineering Credibility in Go",
    description: `To prove my skills for a role, I built Arachne, a scalable, production-ready web scraping service in Go with an async job API, Redis persistence, and full CI/CD. It was my way of saying, "You won't need to babysit me, I think in systems."`,
    icon: faCode,
    category: "milestone",
    era: "Redemption Arc",
    image: {
      dark: "https://images.unsplash.com/photo-1567210590635-06998f86961e?q=80&w=2148&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      light:
        "https://images.unsplash.com/photo-1708501308603-08d27fe02545?q=80&w=1325&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  },
  {
    id: 10,
    date: "03/2025",
    title: "Navigating Scale",
    description: `I worked on a microservice-based platform for managing renewable energy assets, which required me to adapt to the complexities of distributed systems. In this environment, even a small failure in one service could cascade through others. This experience greatly expanded my systems thinking and solidified my understanding of scalable architectures.`,
    icon: faBriefcase,
    category: "career",
    era: "Redemption Arc",
    image:
      "https://plus.unsplash.com/premium_photo-1716603741447-7fcd7ddeba39?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 9,
    date: "10/2024",
    title: "My First Real Battle",
    description: `My first consulting assignment was a significant challenge. I inherited an enterprise application burdened by technical debt, and I methodically rebuilt it from the ground up. By reverse-engineering the system, creating a containerized development environment with Docker, and implementing Infrastructure as Code (Pulumi) for Azure, I turned a chaotic environment into a streamlined, maintainable solution. It wasn’t just about cleanup—it was an opportunity to prove my ability to transform and optimize complex systems.`,
    icon: faBriefcase,
    category: "career",
    era: "Redemption Arc",
    image: {
      dark: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      light:
        "https://plus.unsplash.com/premium_photo-1678743133487-d501f3b0696b?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  },
  {
    id: 8,
    date: "2023-2024",
    title: "Rebuilding From The Ground Up",
    description: `During a difficult period, I took on diverse roles to stay afloat, from tutoring programming to a contract position training LLMs. These experiences were far from stable, but they reignited my passion for learning and problem-solving. They taught me to adapt, sharpened my analytical skills, and reminded me that I still had the ability to compete and make meaningful contributions, no matter the circumstances.`,
    icon: faHardHat,
    category: "career",
    era: "The Rebuild",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop",
  },
  // --- Era: The Fall ---
  {
    id: 7,
    date: "2023",
    title: "Rock Bottom",
    description: `2023 was a turning point where I found myself facing unexpected challenges that tested my resilience. Financially uncertain and emotionally drained, I was forced to reevaluate everything, ultimately discovering new ways to navigate and rebuild my path.`,
    icon: faBolt,
    category: "personal",
    era: "The Fall",
  },
  {
    id: 6,
    date: "10/2022",
    title: "The Crash: A Market Correction Challenge",
    description: `After nearly a year of hard work in my first role, I faced a sudden shift in my career. It was a challenging moment, but it helped me develop resilience and reframe my approach to career planning. During this time, I learned that the journey isn't always linear, and the most valuable lessons often come from adversity.`,
    icon: faBolt,
    category: "career",
    era: "The Fall",
  },
  // --- Era: The Spark ---
  {
    id: 5,
    date: "2017-2021",
    title: "The First Wall: How to Learn?",
    description: `During my CS degree, I quickly encountered my first major challenge. Without the structure I was used to, I turned to shortcuts and struggled to keep up. I failed courses and doubted my ability to succeed in this field. The real barrier, I realized, wasn’t a lack of talent—it was learning how to learn effectively. This experience was a turning point, and the lessons I gained from it continue to shape my approach to problem-solving today.`,
    icon: faGamepad,
    category: "education",
    era: "The Spark",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop",
  },
  {
    id: 4,
    date: "2017",
    title: "The Spark: From Games to Code",
    description: `My love for tech started with gaming—Assassin's Creed, RuneScape, every console I could get my hands on. A close friend and mentor of mine showed me OverTheWire and walked me through it line-by-line, giving me a head start and inspiring me to major in Computer Science.`,
    icon: faGamepad,
    category: "education",
    era: "The Spark",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop",
  },
  // --- Era: Prologue ---
  {
    id: 3,
    date: "2000-2008",
    title: "A Nomad's Start: From Dubai to Texas",
    description: `My early memories are of deserts and skyscrapers in the UAE. After a stint in Jordan, a turning point came when I refused to attend an all-Arabic school. We moved to Texas, where everything—Slim Jims, Gatorade, cartoons with cereal—was new, electric, and pure joy.`,
    icon: faPlane,
    category: "personal",
    era: "Prologue",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop",
  },
  {
    id: 2,
    date: "07/12/1999",
    title: "Birth: The Beginning",
    description: `I was born in Chicago, Illinois, marking the beginning of my journey. My name, Kareem (كريم), meaning "noble, generous, honorable" in Arabic, would become a cornerstone of my identity and values.`,
    icon: faBirthdayCake,
    category: "personal",
    era: "Prologue",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
  },
  {
    id: 1,
    date: "What's in a Name?",
    title: "كريم (Noble, Generous, Honorable)",
    description: `My name, Kareem (كريم), carries deep significance, especially within the Palestinian context. It represents more than just its beautiful Arabic meaning of "noble, generous, honorable." It is a symbol of dignity in the face of adversity, a source of cultural pride, and a constant reminder of the values of community, tradition, and hope for a better future.`,
    icon: faBook,
    category: "personal",
    era: "Prologue",
  },
];
