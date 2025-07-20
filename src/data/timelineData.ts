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
}

export const timelineData: TimelineEvent[] = [
  // --- Era: Present & Future ---
  {
    id: 12,
    date: "Present",
    title: "Building Workfolio: A Terminal for My Timeline",
    description: `This portfolio is not just a website; it's a developer simulation. A living OS in the browser that reflects how I think and build. It's the culmination of everything I've learned—from failures to rebuilds—and my playground for pushing the limits of what a portfolio can be. This is my story, on my own terms.`,
    icon: faRocket,
    category: "milestone",
    era: "Present & Future",
  },
  // --- Era: Redemption Arc ---
  {
    id: 11,
    date: "2024 - Present",
    title: "Chat4AI: Engineering with Empathy",
    description: `I joined the Chat4AI / "First Then Next" project, an accessible AI platform for a nonprofit supporting individuals with disabilities. Building for neurodiverse users, caregivers, and low-bandwidth devices taught me that the highest form of engineering is empathy. Every line of code feels like it matters—because it does.`,
    icon: faHeartPulse,
    category: "career",
    era: "Redemption Arc",
  },
  {
    id: 10,
    date: "Early 2024",
    title: "Arachne: Engineering Credibility in Go",
    description: `To prove my skills for the Chat4AI role, I built Arachne: a scalable, production-ready web scraping service in Go with an async job API, Redis persistence, and full CI/CD. It was my way of saying, "You won't need to babysit me—I think in systems." It landed me the job.`,
    icon: faCode,
    category: "milestone",
    era: "Redemption Arc",
  },
  {
    id: 9,
    date: "2023 - Present",
    title: "Powerhub: Navigating Scale",
    description: `I joined Generate Capital to contribute to Powerhub, a complex, microservice-based platform for managing renewable energy assets. I had to learn to operate inside a living, breathing distributed system, where one service breaking could ripple across five others. It expanded my systems thinking in a huge way.`,
    icon: faBriefcase,
    category: "career",
    era: "Redemption Arc",
  },
  {
    id: 8,
    date: "2023 - Present",
    title: "Navitas: My First Real Battle",
    description: `My first consulting assignment was a nightmare cleanup job. I inherited a sprawling enterprise application drowning in technical debt. I rebuilt it piece by piece, reverse-engineering the system, creating a containerized dev environment with Docker, and writing Infrastructure as Code (Pulumi) for Azure. It wasn't just cleanup—it was redemption.`,
    icon: faBriefcase,
    category: "career",
    era: "Redemption Arc",
  },
  {
    id: 7,
    date: "2022-2023",
    title: "Rebuilding From The Ground Up",
    description: `With bills piling up, I took on any work I could. Tutoring programming on Varsity Tutors forced me to master fundamentals. A contract role at Outlier.ai training LLMs sharpened my analytical skills. Neither job was stable, but they did something more important—they reminded me that I could still learn, compete, and contribute.`,
    icon: faHardHat,
    category: "career",
    era: "The Rebuild",
  },
  // --- Era: The Fall ---
  {
    id: 6,
    date: "2022",
    title: "Rock Bottom",
    description: `After the layoff, I was drifting. A relationship crisis led to me leaving my brother's house with nowhere to go, living out of an Airbnb on a credit card. My father called me a disappointment. It broke me. Financially unstable, emotionally uncertain, and completely unsure of where I was going, I questioned everything.`,
    icon: faBolt,
    category: "personal",
    era: "The Fall",
  },
  {
    id: 5,
    date: "Mid 2022",
    title: "The Crash: A Casualty of a Market Correction",
    description: `After nearly a year of grinding at Capgemini, I was let go. The reason? Random selection. A casualty of the largest wave of tech layoffs in history. I was one of thousands fighting for survival in a saturated job pool. It was a gut punch.`,
    icon: faBolt,
    category: "career",
    era: "The Fall",
  },
  // --- Era: The Spark ---
  {
    id: 4,
    date: "2017-2021",
    title: "The First Wall: How to Learn?",
    description: `I hit a wall fast in my CS degree. The hand-holding was gone, and I started relying on shortcuts. I failed classes and questioned if I was built for this. The barrier wasn't talent; it was learning *how* to learn—a lesson I'm still living through today.`,
    icon: faGamepad,
    category: "education",
    era: "The Spark",
  },
  {
    id: 3,
    date: "High School & Pre-College",
    title: "The Spark: From Games to Code",
    description: `My love for tech started with games—Assassin's Creed, RuneScape, every console I could get my hands on. My older brother's friend, Mark, became my mentor. He showed me OverTheWire and walked me through it line-by-line, giving me a head start and inspiring me to major in Computer Science.`,
    icon: faGamepad,
    category: "education",
    era: "The Spark",
  },
  // --- Era: Prologue ---
  {
    id: 2,
    date: "Childhood",
    title: "A Nomad's Start: From Dubai to Texas",
    description: `I was born in Chicago, but my early memories are of deserts and skyscrapers in the UAE. After a stint in Jordan, a turning point came when I refused to attend an all-Arabic school. We moved to Texas, where everything—Slim Jims, Gatorade, cartoons with cereal—was new, electric, and pure joy.`,
    icon: faPlane,
    category: "personal",
    era: "Prologue",
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
