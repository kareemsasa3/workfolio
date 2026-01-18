// Configuration constants for better type safety and maintainability
export const COMPLEXITY_LEVELS = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
] as const;
export const STATUSES = ["Live", "Development", "Completed"] as const;
export const CATEGORIES = [
  "Systems Infrastructure",
  "Backend Systems",
  "Full-Stack Web App",
  "Portfolio",
] as const;

// Complexity order for sorting
export const complexityOrder: Record<
  (typeof COMPLEXITY_LEVELS)[number],
  number
> = {
  Expert: 4,
  Advanced: 3,
  Intermediate: 2,
  Beginner: 1,
};

export interface Project {
  id: string;
  category: (typeof CATEGORIES)[number];
  date: string;
  title: string;
  description: string;
  techStack: string[];
  features: string[];
  complexity: (typeof COMPLEXITY_LEVELS)[number];
  status: (typeof STATUSES)[number];
  url: string;
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
  highlights: string[];
}

export const projectsData: Project[] = [
  {
    id: "erebus",
    category: "Systems Infrastructure",
    date: "2025",
    title: "Erebus OS",
    description:
      "Event-driven coordination layer for Linux that transforms reactive troubleshooting into proactive system understanding. A system that remembers what you know and acts accordingly.",
    techStack: ["Python", "SQLite", "systemd", "FTS5", "Wayland", "D-Bus"],
    features: [
      "Real-time system emitters (GPU, network, window focus, screen lock)",
      "Belief engine with confidence-based inference",
      "Session tracking across substrate boundaries",
      "Full-text search over system event history",
      "Append-only audit log with replay determinism",
    ],
    complexity: "Expert",
    status: "Development",
    url: "#",
    highlights: [
      "Systems that understand themselves",
      "Epistemic discipline in software",
      "Currently at v0.6.3",
    ],
  },
  {
    id: "aether",
    category: "Systems Infrastructure",
    date: "2024",
    title: "Aether",
    description:
      "Real-time audio attention infrastructure for Linux. A high-performance daemon that publishes live acoustic state to lock-free shared memory using optimistic concurrency control.",
    techStack: ["Python", "PipeWire", "Shared Memory", "OpenRGB", "systemd"],
    features: [
      "Lock-free IPC via memory-mapped files",
      "7-band FFT analysis at ~23Hz",
      "~92ms end-to-end latency",
      "300+ LED hardware sync via OpenRGB",
      "15+ visualization styles",
    ],
    complexity: "Expert",
    status: "Completed",
    url: "https://github.com/kareemsasa3/aether",
    githubUrl: "https://github.com/kareemsasa3/aether",
    highlights: [
      "Lock-free concurrent design",
      "Ignorance as design philosophy",
      "Reddit recognition for architecture",
    ],
  },
  {
    id: "arachne",
    category: "Backend Systems",
    date: "2025",
    title: "Arachne",
    description:
      "Autonomous web research platform that searches, scrapes, indexes, and synthesizes web content. Continuously detects changes, keeps version history, and offers full-text search across collected documents.",
    techStack: ["Go", "Next.js", "SQLite FTS5", "Redis", "Docker", "Chromedp"],
    features: [
      "Search → scrape → index → AI synthesis pipeline",
      "Change detection and version history",
      "Full-text search powered by SQLite FTS5",
      "Microservices architecture with submodules",
      "Prometheus metrics and health monitoring",
    ],
    complexity: "Expert",
    status: "Completed",
    url: "https://github.com/kareemsasa3/arachne",
    githubUrl: "https://github.com/kareemsasa3/arachne",
    highlights: [
      "Autonomous research workflows",
      "Content-addressable storage",
      "Production-grade Go + Next.js",
    ],
  },
  {
    id: "workfolio",
    category: "Portfolio",
    date: "2024",
    title: "Workfolio",
    description:
      "Interactive developer portfolio with terminal interface and virtual file system. The site you're looking at right now.",
    techStack: ["React 18", "TypeScript", "Vite", "Framer Motion"],
    features: [
      "Terminal emulator with virtual filesystem",
      "Parallax scrolling and animations",
      "Lazy loading with minimum display time",
      "Responsive design with theme support",
    ],
    complexity: "Advanced",
    status: "Live",
    url: "https://github.com/kareemsasa3/workfolio",
    githubUrl: "https://github.com/kareemsasa3/workfolio",
    highlights: [
      "Creative developer experience",
      "Modern React patterns",
      "This site",
    ],
  },
];