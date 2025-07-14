// Configuration constants for better type safety and maintainability
export const COMPLEXITY_LEVELS = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
] as const;
export const STATUSES = ["Live", "Development", "Completed"] as const;
export const CATEGORIES = [
  "Backend Systems",
  "Full-Stack Web App",
  "Automation & AI",
  "Portfolio",
  "E-Commerce",
  "Freelance",
  "Healthcare",
  "AI/ML",
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
  category: string;
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
    id: "arachne",
    category: "Backend Systems",
    date: "2024",
    title: "Arachne",
    description:
      "Production-ready web scraping service with asynchronous job processing, persistent state management, and automated CI/CD pipeline.",
    techStack: [
      "Go",
      "Redis",
      "Docker",
      "Chromedp",
      "GoQuery",
      "GitHub Actions",
    ],
    features: [
      "Asynchronous API with job queuing",
      "92.5% success rate against 40+ real-world sites",
      "Circuit breakers and exponential backoff",
      "Fully containerized with Docker Compose",
      "Automated CI/CD pipeline",
      "Prometheus metrics and health monitoring",
    ],
    complexity: "Expert",
    status: "Live",
    url: "https://github.com/kareemsasa3/arachne",
    githubUrl: "https://github.com/kareemsasa3/arachne",
    highlights: [
      "Production-grade Go service",
      "Scalable worker model",
      "Comprehensive testing suite",
      "Enterprise-level architecture",
    ],
  },
  {
    id: "digital-garage",
    category: "Full-Stack Web App",
    date: "2024",
    title: "Digital Garage (BuildSync)",
    description:
      "Complete car management platform for automotive enthusiasts with build journals, cost tracking, and real-time authentication.",
    techStack: [
      "Next.js 15",
      "TypeScript",
      "Supabase",
      "Prisma",
      "Tailwind CSS",
      "PostgreSQL",
    ],
    features: [
      "User authentication with Supabase",
      "Car management with unique slugs",
      "Build journal system with timeline",
      "Cost tracking and modification history",
      "Responsive design with dark theme",
      "Real-time updates and form validation",
    ],
    complexity: "Advanced",
    status: "Development",
    url: "https://github.com/kareemsasa3/digital-garage",
    githubUrl: "https://github.com/kareemsasa3/digital-garage",
    highlights: [
      "Modern Next.js App Router",
      "Type-safe database operations",
      "Server actions for API endpoints",
      "Comprehensive form validation",
    ],
  },
  {
    id: "popmart-bot",
    category: "Automation & AI",
    date: "2024",
    title: "Pop Mart Bot",
    description:
      "Sophisticated e-commerce monitoring bot with state management, Slack integration, and advanced retry logic for automated purchasing.",
    techStack: [
      "Python",
      "Playwright",
      "Redis",
      "Docker",
      "Slack API",
      "Pytest",
    ],
    features: [
      "State management with persistent storage",
      "Slack integration with interactive commands",
      "Retry logic and error recovery",
      "Real-time notifications and monitoring",
      "Docker deployment with health checks",
      "Multi-service architecture",
    ],
    complexity: "Expert",
    status: "Live",
    url: "https://github.com/kareemsasa3/popmart-bot",
    githubUrl: "https://github.com/kareemsasa3/popmart-bot",
    highlights: [
      "Production automation system",
      "Advanced state persistence",
      "Slack slash commands",
      "Integration with Arachne service",
    ],
  },
  {
    id: "workfolio",
    category: "Portfolio",
    date: "2024",
    title: "Workfolio",
    description:
      "Interactive portfolio website showcasing technical skills and projects with modern animations and responsive design.",
    techStack: ["React 18", "TypeScript", "Vite", "Framer Motion", "Three.js"],
    features: [
      "Interactive portfolio with animations",
      "Multiple pages and navigation",
      "3D graphics with Three.js",
      "Responsive design",
      "TypeScript for type safety",
      "Modern build system with Vite",
    ],
    complexity: "Advanced",
    status: "Live",
    url: "https://kareemsasadev.netlify.app",
    githubUrl: "https://github.com/kareemsasa3/workfolio",
    liveUrl: "https://kareemsasadev.netlify.app",
    highlights: [
      "Modern React architecture",
      "Interactive animations",
      "3D graphics integration",
      "Responsive design",
    ],
  },
  {
    id: "curated-collectibles",
    category: "E-Commerce",
    date: "2024",
    title: "Curated Collectibles",
    description:
      "React-based e-commerce platform for collectible items with modern UI and shopping cart functionality.",
    techStack: ["React", "JavaScript", "CSS3", "HTML5"],
    features: [
      "Product catalog and filtering",
      "Shopping cart functionality",
      "Responsive design",
      "Modern UI components",
    ],
    complexity: "Intermediate",
    status: "Completed",
    url: "https://github.com/kareemsasa3/react-ecommerce",
    githubUrl: "https://github.com/kareemsasa3/react-ecommerce",
    highlights: [
      "E-commerce functionality",
      "React component architecture",
      "Responsive design",
    ],
  },
  {
    id: "king-of-diamonds",
    category: "Freelance",
    date: "2023",
    title: "King of Diamonds",
    description:
      "Freelance project demonstrating client work and business application development.",
    techStack: ["React", "JavaScript", "CSS3"],
    features: [
      "Client project delivery",
      "Business requirements implementation",
      "Custom UI components",
    ],
    complexity: "Intermediate",
    status: "Completed",
    url: "https://github.com/kareemsasa3/KingOfDiamonds",
    githubUrl: "https://github.com/kareemsasa3/KingOfDiamonds",
    highlights: [
      "Client project experience",
      "Business application development",
      "Requirements gathering",
    ],
  },
  {
    id: "face-mask-detector",
    category: "AI/ML",
    date: "2022",
    title: "Face Mask Detector",
    description:
      "Computer vision project for detecting face masks using machine learning and image processing.",
    techStack: ["Python", "OpenCV", "TensorFlow", "Machine Learning"],
    features: [
      "Real-time face detection",
      "Mask classification",
      "Computer vision algorithms",
      "Machine learning model",
    ],
    complexity: "Advanced",
    status: "Completed",
    url: "https://github.com/kareemsasa3/face-mask-detector",
    githubUrl: "https://github.com/kareemsasa3/face-mask-detector",
    highlights: [
      "Computer vision expertise",
      "Machine learning implementation",
      "Real-time processing",
    ],
  },
  {
    id: "patient-management",
    category: "Healthcare",
    date: "2022",
    title: "Patient Management System",
    description:
      "Healthcare management system with HIPAA compliance and patient data handling.",
    techStack: [".NET", "C#", "SQL Server", "HIPAA Compliance"],
    features: [
      "Patient data management",
      "HIPAA compliance features",
      "Database design",
      "Security implementation",
    ],
    complexity: "Advanced",
    status: "Completed",
    url: "https://github.com/kareemsasa3/patient-management-system",
    githubUrl: "https://github.com/kareemsasa3/patient-management-system",
    highlights: [
      "Healthcare domain expertise",
      "HIPAA compliance knowledge",
      "Enterprise security",
    ],
  },
];
