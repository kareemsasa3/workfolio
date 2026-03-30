// Site-wide copy and content strings
// Centralized for easy updates without touching components

export const heroContent = {
    title: "Kareem Sasa",
    subtitle: "Systems engineer building production software across backend, infrastructure, and product experience.",
    description: "I design and ship systems that make behavior visible, decisions traceable, and complex software easier to operate. My recent work spans consulting on business-critical platforms and building systems-focused products like Erebus, an event-driven coordination layer for Linux.",
    cta: "View Projects",
} as const;

// In siteContent.ts
export const featuredProjectIds = ["erebus", "arachne", "aether"] as const;

export const skillCategories = [
    "Systems & Backend",
    "Frontend", 
    "Infrastructure",
    "Data & Storage",
] as const;
  
export const skills = [
    // Systems & Backend
    { name: "Python", icon: "🐍", category: "Systems & Backend" },
    { name: "Go", icon: "🐹", category: "Systems & Backend" },
    { name: "systemd", icon: "⚙️", category: "Systems & Backend" },
    { name: "D-Bus", icon: "🔌", category: "Systems & Backend" },
    { name: "PipeWire", icon: "🔊", category: "Systems & Backend" },
    { name: "IPC/Shared Memory", icon: "🧠", category: "Systems & Backend" },

    // Frontend
    { name: "React", icon: "⚛️", category: "Frontend" },
    { name: "TypeScript", icon: "📘", category: "Frontend" },
    { name: "Next.js", icon: "▲", category: "Frontend" },
    { name: "Vite", icon: "⚡", category: "Frontend" },
    { name: "Framer Motion", icon: "✨", category: "Frontend" },

    // Infrastructure
    { name: "Docker", icon: "🐳", category: "Infrastructure" },
    { name: "Linux", icon: "🐧", category: "Infrastructure" },
    { name: "Nginx", icon: "🌐", category: "Infrastructure" },
    { name: "Wayland", icon: "🖥️", category: "Infrastructure" },

    // Data & Storage
    { name: "SQLite", icon: "🗃️", category: "Data & Storage" },
    { name: "FTS5", icon: "🔍", category: "Data & Storage" },
    { name: "Redis", icon: "🔴", category: "Data & Storage" },
] as const;

export const aboutContent = {
    title: "What I Do",
    items: [
      {
        icon: "🧠",
        title: "System Design For Real Operating Conditions",
        description:
          "I build systems that expose state clearly, preserve operational context, and make production behavior easier to reason about when complexity increases.",
      },
      {
        icon: "⚙️",
        title: "Backend & Infrastructure",
        description:
          "I work in Go and Python on backend services, platform tooling, and infrastructure concerns including observability, process supervision, search, and operational reliability.",
      },
      {
        icon: "🎨",
        title: "Frontend That Clarifies Complex Systems",
        description:
          "I use React, TypeScript, and Next.js to turn dense workflows into interfaces that are understandable, maintainable, and credible for real users.",
      },
      {
        icon: "🔧",
        title: "Tooling That Fits Existing Environments",
        description:
          "I build with Docker, Linux, Nginx, Wayland, PipeWire, and IPC primitives, with a bias toward tools that integrate cleanly into the environments teams already run.",
      },
    ],
} as const;

export const socialContent = {
    title: "Connect With Me",
    links: [
      {
        name: "GitHub",
        url: "https://github.com/kareemsasa3",
        icon: "🐙",
      },
      {
        name: "LinkedIn",
        url: "https://linkedin.com/in/kareem-sasa",
        icon: "💼",
      },
    ],
} as const;
