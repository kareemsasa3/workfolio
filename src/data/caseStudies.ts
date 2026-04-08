import { projectsData, type Project } from "./projects";

export interface CaseStudyDecision {
  title: string;
  rationale: string;
}

export interface CaseStudyHighlight {
  title: string;
  detail: string;
}

export interface CaseStudyLink {
  label: string;
  href: string;
  external?: boolean;
  unavailable?: boolean;
}

export interface CaseStudy {
  slug: string;
  projectId: string;
  title: string;
  shortDescription: string;
  problem: string;
  constraints: {
    technicalLimitations: string;
    environment: string;
    tradeoffs: string;
  };
  architecture: string[];
  keyTechnicalDecisions: CaseStudyDecision[];
  implementationHighlights: CaseStudyHighlight[];
  outcome: string[];
  links: CaseStudyLink[];
  focusAreas: string[];
}

export interface CaseStudyCard extends CaseStudy {
  project: Project;
}

export const caseStudiesData: CaseStudy[] = [
  {
    slug: "aether",
    projectId: "aether",
    title: "Aether",
    shortDescription:
      "Low-latency Linux audio infrastructure that publishes live acoustic state through shared memory for cross-process consumers.",
    problem:
      "Desktop audio tooling is usually built as isolated effects or visualizers. Aether treats live audio analysis as shared system state so multiple processes can react to the same stream without each opening their own capture path.",
    constraints: {
      technicalLimitations:
        "The capture path had to stay responsive under Python, avoid lock contention, and keep serialization overhead low enough for real-time consumers.",
      environment:
        "The system runs on Linux with PipeWire, systemd user services, and OpenRGB-controlled hardware on the same workstation.",
      tradeoffs:
        "The design favors bounded latency and a stable memory layout over richer RPC semantics. Consumers read snapshots instead of requesting custom views.",
    },
    architecture: [
      "A PipeWire capture service samples audio frames and normalizes them into a fixed analysis window.",
      "An FFT stage derives band energy and publishes the current acoustic snapshot into memory-mapped shared state.",
      "Consumer processes subscribe by reading the shared snapshot directly, including the LED renderer that translates frequency bands into hardware updates.",
      "systemd manages lifecycle so the publisher and consumers can restart independently without manual orchestration.",
    ],
    keyTechnicalDecisions: [
      {
        title: "Shared memory instead of sockets",
        rationale:
          "The system needed frequent state publication with minimal copying. Memory-mapped snapshots removed repeated serialization and reduced end-to-end latency.",
      },
      {
        title: "Single publisher, many passive readers",
        rationale:
          "Aether keeps the timing-sensitive write path centralized and makes consumers stateless readers. That isolates jitter and simplifies recovery.",
      },
      {
        title: "Fixed snapshot schema",
        rationale:
          "A stable binary layout makes cross-process reads predictable and keeps integration code small for downstream consumers.",
      },
      {
        title: "systemd user services for orchestration",
        rationale:
          "Audio infrastructure should start with the session, restart on failure, and stay decoupled from the terminal used to launch it.",
      },
    ],
    implementationHighlights: [
      {
        title: "FFT pipeline tuned for interactive feedback",
        detail:
          "The analyzer reduces raw audio into seven usable bands at roughly 23 updates per second, which was enough for visual response without saturating consumers.",
      },
      {
        title: "Lock-free reader model",
        detail:
          "Readers consume the latest published snapshot without negotiating with the producer, which keeps hardware effects and future clients simple.",
      },
      {
        title: "Hardware integration boundary",
        detail:
          "OpenRGB is treated as a downstream consumer rather than a core dependency, so the audio pipeline remains reusable beyond lighting control.",
      },
    ],
    outcome: [
      "Aether turned audio analysis into a reusable local systems primitive rather than a single-purpose effect.",
      "The architecture supports low-latency hardware synchronization and additional consumers without reworking the capture path.",
    ],
    links: [
      {
        label: "GitHub Repository",
        href: "https://github.com/kareemsasa3/aether",
        external: true,
      },
      { label: "Related: Erebus", href: "/case-studies/erebus" },
      { label: "Related: Arachne", href: "/case-studies/arachne" },
    ],
    focusAreas: ["Real-time systems", "IPC design", "Linux integration"],
  },
  {
    slug: "erebus",
    projectId: "erebus",
    title: "Erebus OS",
    shortDescription:
      "Event-driven Linux coordination layer that records system context, infers higher-level state, and makes troubleshooting replayable.",
    problem:
      "Operational debugging on a personal workstation is usually reactive and ephemeral. Erebus captures low-level events and inferred state so system behavior can be searched, replayed, and explained after the fact.",
    constraints: {
      technicalLimitations:
        "The platform had to ingest heterogeneous local signals, preserve ordering, and stay auditable without introducing opaque automation or high operational overhead.",
      environment:
        "The system targets a Linux desktop with systemd, D-Bus, Wayland session signals, and local SQLite storage.",
      tradeoffs:
        "Erebus favors append-only event history and explicit confidence scores over brittle single-state assumptions. That increases storage and modeling work, but keeps inference inspectable.",
    },
    architecture: [
      "Emitter processes collect focused slices of system activity such as GPU state, network changes, focus transitions, and session events.",
      "Events are written to an append-only store that acts as the canonical timeline for replay and debugging.",
      "A belief engine derives higher-level state from those events, assigning confidence rather than collapsing everything into binary conclusions.",
      "Search and inspection layers expose both raw history and inferred state so operational questions can be answered from evidence.",
    ],
    keyTechnicalDecisions: [
      {
        title: "Append-only event log",
        rationale:
          "Reconstructing system behavior requires a durable timeline. Immutable history makes replay and audit possible even when inference logic changes.",
      },
      {
        title: "Confidence-based belief engine",
        rationale:
          "Desktop state is often ambiguous. Confidence scores let the system reason under uncertainty without hiding that uncertainty from the operator.",
      },
      {
        title: "SQLite with local full-text search",
        rationale:
          "The workload is local-first and read-heavy. SQLite keeps deployment small while still supporting indexed investigation of historical context.",
      },
      {
        title: "Emitter isolation by domain",
        rationale:
          "Separate collectors make failures easier to contain and allow each integration point to evolve without destabilizing the full pipeline.",
      },
    ],
    implementationHighlights: [
      {
        title: "Cross-substrate session tracking",
        detail:
          "The system correlates activity that spans focus changes, locks, network transitions, and other state boundaries into a usable operational story.",
      },
      {
        title: "Replayable inference",
        detail:
          "Because the event history is preserved, newer inference logic can be tested against older timelines without losing the original evidence.",
      },
      {
        title: "Searchable operational context",
        detail:
          "FTS-backed queries make it possible to inspect incidents as sequences instead of isolated log lines.",
      },
    ],
    outcome: [
      "Erebus replaces ad hoc workstation debugging with a durable model of what happened and why the system believed it was happening.",
      "The project is still in active development, but the architecture already establishes a path for auditable local automation.",
    ],
    links: [
      {
        label: "GitHub Repository",
        href: "",
        unavailable: true,
      },
      { label: "Related: Aether", href: "/case-studies/aether" },
      { label: "Related: Arachne", href: "/case-studies/arachne" },
    ],
    focusAreas: ["Event modeling", "Inference systems", "Operational tooling"],
  },
  {
    slug: "arachne",
    projectId: "arachne",
    title: "Arachne",
    shortDescription:
      "Autonomous research platform that searches, scrapes, versions, indexes, and synthesizes web content through a Go and Next.js pipeline.",
    problem:
      "Manual web research does not scale when the source set is large, frequently changing, and spread across inconsistent page structures. Arachne turns collection and change tracking into a repeatable pipeline instead of a one-off browsing session.",
    constraints: {
      technicalLimitations:
        "The system had to deal with dynamic pages, unreliable source structure, bounded compute, and enough persistence to compare revisions over time.",
      environment:
        "The stack runs as containerized Go services with a Next.js frontend, Redis for coordination, SQLite FTS5 for search, and Chromedp for browser automation.",
      tradeoffs:
        "SQLite and local services were chosen over heavier distributed infrastructure. That keeps deployment simple, but constrains horizontal scaling and pushes more care into pipeline scheduling.",
    },
    architecture: [
      "Discovery starts with search and queue generation, which produces candidate URLs for the scrape layer.",
      "Scrape workers extract page content and persist versioned records so historical changes remain queryable.",
      "An indexing layer writes normalized content into SQLite FTS5 for retrieval across both current and historical documents.",
      "A Next.js interface exposes search, inspection, and synthesis workflows on top of the backend pipeline.",
    ],
    keyTechnicalDecisions: [
      {
        title: "Go for the pipeline core",
        rationale:
          "The collection pipeline is IO-heavy, concurrent, and long-running. Go provides a straightforward fit for workers, orchestration, and service boundaries.",
      },
      {
        title: "Separate frontend from ingestion services",
        rationale:
          "Collection and operator workflows move at different rates. Decoupling them keeps the UI responsive without constraining backend execution.",
      },
      {
        title: "SQLite FTS5 for retrieval",
        rationale:
          "The project needed strong local search with versioned content but not the operational cost of a larger search cluster.",
      },
      {
        title: "Redis for queueing and coordination",
        rationale:
          "Transient pipeline state belongs in a fast coordination layer rather than in the persistent content store.",
      },
      {
        title: "Containerized service boundaries",
        rationale:
          "Docker made it easier to run scraping, indexing, and frontend layers consistently while keeping each process role explicit.",
      },
    ],
    implementationHighlights: [
      {
        title: "Version-aware content store",
        detail:
          "Arachne keeps historical revisions so research outputs can cite not only what a page says now, but how it changed.",
      },
      {
        title: "Search-to-synthesis pipeline",
        detail:
          "The system connects discovery, extraction, indexing, and AI-assisted synthesis into one flow instead of making the user hand off data between tools.",
      },
      {
        title: "Operational visibility",
        detail:
          "Health checks and Prometheus metrics provide enough observability to treat the pipeline as a service rather than a script.",
      },
    ],
    outcome: [
      "Arachne makes research repeatable, searchable, and inspectable across time instead of tied to transient browser sessions.",
      "The architecture supports both direct retrieval and higher-level synthesis workflows on top of the same indexed corpus.",
    ],
    links: [
      {
        label: "GitHub Repository",
        href: "https://github.com/kareemsasa3/arachne",
        external: true,
      },
      { label: "Related: Erebus", href: "/case-studies/erebus" },
      { label: "Related: Aether", href: "/case-studies/aether" },
    ],
    focusAreas: ["Research automation", "Service design", "Search systems"],
  },
];

export const caseStudyBySlug = caseStudiesData.reduce<
  Record<string, CaseStudy>
>((accumulator, caseStudy) => {
  accumulator[caseStudy.slug] = caseStudy;
  return accumulator;
}, {});

export const caseStudyCards: CaseStudyCard[] = caseStudiesData.flatMap(
  (caseStudy) => {
  const project = projectsData.find(
    (entry) => entry.id === caseStudy.projectId
  );

    if (!project) {
      return [];
    }

    return [
      {
        ...caseStudy,
        project,
      },
    ];
  }
);
