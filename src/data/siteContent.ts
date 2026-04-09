// Site-wide copy and content strings
// Centralized for easy updates without touching components

export const heroContent = {
    title: "Kareem Sasa",
    subtitle: "Systems engineer building production software for Linux, backend, and infrastructure-heavy products.",
    description: "I design event-driven systems, platform tooling, and interfaces that make complex behavior observable and easier to operate. Recent work includes a replayable Linux coordination layer and a production-oriented autonomous research platform.",
    cta: "View Systems",
} as const;

export const featuredProjectIds = ["erebus", "arachne"] as const;

export const capabilitiesContent = {
    title: "How I Work",
    items: [
      {
        icon: "🧠",
        title: "Systems Architecture",
        description:
          "I design software around real operating conditions, failure boundaries, and long-term maintainability.",
      },
      {
        icon: "⚙️",
        title: "Event-Driven Design",
        description:
          "I model state from streams of system activity so behavior can be traced, replayed, and reasoned about later.",
      },
      {
        icon: "🔧",
        title: "Infrastructure Automation",
        description:
          "I build platform tooling and deployment workflows that reduce manual coordination and keep environments predictable.",
      },
      {
        icon: "📈",
        title: "Observability and Reliability",
        description:
          "I prioritize visibility, auditability, and operational clarity so production behavior is easier to understand under load.",
      },
    ],
} as const;

export const socialContent = {
    title: "Contact",
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
      {
        name: "Email",
        url: "mailto:kareemsasa3@gmail.com",
        icon: "✉️",
      },
    ],
} as const;
