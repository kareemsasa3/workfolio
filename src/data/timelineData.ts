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
    id: 13,
    date: "Present",
    title: "Building Workfolio: A Terminal for My Timeline",
    description: `This portfolio is not just a website; it's a developer simulation. A living OS in the browser that reflects how I think and build. It's the culmination of everything I've learned—from failures to rebuilds—and my playground for pushing the limits of what a portfolio can be. This is my story, on my own terms.`,
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
    id: 12,
    date: "June 2025 - Present",
    title: "Engineering with Empathy",
    description: `I joined an accessible AI platform for a nonprofit supporting individuals with disabilities. Building for neurodiverse users, caregivers, and low-bandwidth devices taught me that the highest form of engineering is empathy. Every line of code feels like it matters—because it does.`,
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
    description: `To prove my skills for the Chat4AI role, I built Arachne: a scalable, production-ready web scraping service in Go with an async job API, Redis persistence, and full CI/CD. It was my way of saying, "You won't need to babysit me—I think in systems." It landed me the job.`,
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
    description: `I contributed to a complex, microservice-based platform for managing renewable energy assets. I had to learn to operate inside a living, breathing distributed system, where one service breaking could ripple across five others. It expanded my systems thinking in a huge way.`,
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
    description: `My first consulting assignment was a nightmare cleanup job. I inherited a sprawling enterprise application drowning in technical debt. I rebuilt it piece by piece, reverse-engineering the system, creating a containerized dev environment with Docker, and writing Infrastructure as Code (Pulumi) for Azure. It wasn't just cleanup—it was redemption.`,
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
    description: `With bills piling up, I took on any work I could. Tutoring programming forced me to master fundamentals. A contract role training LLMs sharpened my analytical skills. Neither job was stable, but they did something more important—they reminded me that I could still learn, compete, and contribute.`,
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
    description: `After the layoff, I was drifting. It broke me. Financially unstable, emotionally uncertain, and completely unsure of where I was going, I questioned everything.`,
    icon: faBolt,
    category: "personal",
    era: "The Fall",
  },
  {
    id: 6,
    date: "10/2022",
    title: "The Crash: A Casualty of a Market Correction",
    description: `After nearly a year of grinding at my first role out of college, I was let go. The reason? Random selection. A casualty of the largest wave of tech layoffs in history. I was one of thousands fighting for survival in a saturated job pool. It was a gut punch.`,
    icon: faBolt,
    category: "career",
    era: "The Fall",
  },
  // --- Era: The Spark ---
  {
    id: 5,
    date: "2017-2021",
    title: "The First Wall: How to Learn?",
    description: `I hit a wall fast in my CS degree. The hand-holding was gone, and I started relying on shortcuts. I failed classes and questioned if I was built for this. The barrier wasn't talent; it was learning *how* to learn—a lesson I'm still living through today.`,
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
    description: `I was born in Chicago, but my early memories are of deserts and skyscrapers in the UAE. After a stint in Jordan, a turning point came when I refused to attend an all-Arabic school. We moved to Texas, where everything—Slim Jims, Gatorade, cartoons with cereal—was new, electric, and pure joy.`,
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
    title: "Kareem (كريم): Noble, Generous, Honorable",
    description: `In a Palestinian context, my name is more than its beautiful Arabic meaning. It's a quiet emblem of dignity under pressure, cultural pride, and hope for a kinder, freer future. It's a reminder of moral richness, not just material wealth—honoring community, tradition, and dignity in resistance.`,
    icon: faBook,
    category: "personal",
    era: "Prologue",
  },
];
