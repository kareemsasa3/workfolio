// Site-wide copy and content strings
// Centralized for easy updates without touching components

export const heroContent = {
    title: "Kareem Sasa",
    subtitle: "Systems engineer. I build software that understands itself—and why.",
    description: "I build software with self-awareness baked in—systems that understand what's happening, why it matters, and how to adapt. My current focus is Erebus, an event-driven coordination layer for Linux that helps systems evolve with purpose.",
    cta: "View My Work",
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
        title: "Systems That Understand Themselves",
        description:
          "I build software with self-awareness at its core—event-driven architectures that surface what's happening, track confidence in their own state, and adapt based on evidence rather than assumptions.",
      },
      {
        icon: "⚙️",
        title: "Backend & Infrastructure",
        description:
          "Production services in Go and Python. Event fabrics, belief engines, and coordination layers. SQLite with FTS5 for fast, searchable history. systemd integration for reliable operation.",
      },
      {
        icon: "🎨",
        title: "Frontend & Experience",
        description:
          "Modern interfaces with React, TypeScript, and Next.js. Clean component architecture, smooth animations, and responsive design. The same attention to clarity I bring to backend systems.",
      },
      {
        icon: "🔧",
        title: "Infrastructure & Tooling",
        description:
          "Docker, Linux, Nginx, Wayland. Real-time audio with PipeWire and lock-free IPC. I build tools that fit into existing ecosystems rather than replacing them.",
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
