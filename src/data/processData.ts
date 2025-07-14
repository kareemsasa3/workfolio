import { ProcessInfo } from "../types/terminal";

// Base process definitions for the portfolio application
const baseProcesses: Array<{
  name: string;
  baseCpu: number;
  baseMemory: number;
  state: "R" | "S" | "D" | "Z" | "T";
  command: string;
  user: string;
  priority: number;
  nice: number;
  threads: number;
}> = [
  {
    name: "MatrixBackground",
    baseCpu: 15,
    baseMemory: 45,
    state: "R" as const,
    command: "/usr/bin/matrix-background --theme=dark --intensity=medium",
    user: "portfolio",
    priority: 10,
    nice: 0,
    threads: 2,
  },
  {
    name: "Dock",
    baseCpu: 8,
    baseMemory: 25,
    state: "S" as const,
    command: "/usr/bin/dock --position=bottom-right --magnification=40",
    user: "portfolio",
    priority: 15,
    nice: 0,
    threads: 1,
  },
  {
    name: "Terminal",
    baseCpu: 12,
    baseMemory: 35,
    state: "R" as const,
    command: "/usr/bin/terminal --theme=matrix --font=monospace",
    user: "portfolio",
    priority: 20,
    nice: 0,
    threads: 3,
  },
  {
    name: "ReactApp",
    baseCpu: 25,
    baseMemory: 120,
    state: "R" as const,
    command: "/usr/bin/react-app --port=3000 --hot-reload=true",
    user: "portfolio",
    priority: 5,
    nice: 0,
    threads: 8,
  },
  {
    name: "TypeScript",
    baseCpu: 18,
    baseMemory: 85,
    state: "S" as const,
    command: "/usr/bin/tsc --watch --project=tsconfig.json",
    user: "portfolio",
    priority: 12,
    nice: 0,
    threads: 4,
  },
  {
    name: "ViteDevServer",
    baseCpu: 22,
    baseMemory: 95,
    state: "R" as const,
    command: "/usr/bin/vite --host --port=5173 --mode=development",
    user: "portfolio",
    priority: 8,
    nice: 0,
    threads: 6,
  },
  {
    name: "FramerMotion",
    baseCpu: 10,
    baseMemory: 30,
    state: "S" as const,
    command: "/usr/bin/framer-motion --optimize=performance",
    user: "portfolio",
    priority: 18,
    nice: 0,
    threads: 2,
  },
  {
    name: "ThemeContext",
    baseCpu: 3,
    baseMemory: 15,
    state: "S" as const,
    command: "/usr/bin/theme-context --provider=global",
    user: "portfolio",
    priority: 25,
    nice: 0,
    threads: 1,
  },
  {
    name: "Router",
    baseCpu: 5,
    baseMemory: 20,
    state: "R" as const,
    command: "/usr/bin/router --history=browser --basename=/",
    user: "portfolio",
    priority: 22,
    nice: 0,
    threads: 2,
  },
  {
    name: "LocalStorage",
    baseCpu: 2,
    baseMemory: 8,
    state: "S" as const,
    command: "/usr/bin/local-storage --sync=auto --encrypt=false",
    user: "portfolio",
    priority: 30,
    nice: 0,
    threads: 1,
  },
  {
    name: "EventLoop",
    baseCpu: 35,
    baseMemory: 5,
    state: "R" as const,
    command: "/usr/bin/event-loop --priority=high --queue-size=1000",
    user: "portfolio",
    priority: 1,
    nice: -10,
    threads: 12,
  },
  {
    name: "GarbageCollector",
    baseCpu: 8,
    baseMemory: 12,
    state: "D" as const,
    command: "/usr/bin/gc --mode=generational --threshold=100",
    user: "portfolio",
    priority: 35,
    nice: 10,
    threads: 1,
  },
  {
    name: "WebSocket",
    baseCpu: 6,
    baseMemory: 18,
    state: "S" as const,
    command: "/usr/bin/websocket --protocol=ws --keepalive=30",
    user: "portfolio",
    priority: 16,
    nice: 0,
    threads: 2,
  },
  {
    name: "CanvasRenderer",
    baseCpu: 20,
    baseMemory: 40,
    state: "R" as const,
    command: "/usr/bin/canvas-renderer --fps=60 --vsync=true",
    user: "portfolio",
    priority: 14,
    nice: 0,
    threads: 3,
  },
  {
    name: "AudioContext",
    baseCpu: 4,
    baseMemory: 22,
    state: "S" as const,
    command: "/usr/bin/audio-context --sample-rate=44100 --latency=low",
    user: "portfolio",
    priority: 28,
    nice: 0,
    threads: 1,
  },
];

// Generate realistic process variations
const generateProcessVariation = (
  baseProcess: (typeof baseProcesses)[0],
  pid: number
): ProcessInfo => {
  const now = Date.now();
  const timeVariation = Math.sin(now / 10000 + pid) * 0.3 + 1; // Time-based variation
  const randomVariation = 0.8 + Math.random() * 0.4; // Random variation

  const variation = timeVariation * randomVariation;

  // Generate start time (random time within last 24 hours)
  const startTimeOffset = Math.floor(Math.random() * 86400); // 24 hours in seconds
  const startTime = new Date(now - startTimeOffset * 1000);
  const startTimeStr = `${startTime
    .getHours()
    .toString()
    .padStart(2, "0")}:${startTime.getMinutes().toString().padStart(2, "0")}`;

  // Calculate CPU and memory with realistic variations
  const cpu = Math.max(0.1, Math.min(100, baseProcess.baseCpu * variation));
  const memory = Math.max(1, Math.floor(baseProcess.baseMemory * variation));
  const virtualMemory = Math.floor(memory * (1.2 + Math.random() * 0.6)); // Virtual memory is usually larger

  // Occasionally change process state
  const stateVariation = Math.random();
  let state = baseProcess.state;
  if (stateVariation < 0.05) {
    state = "S"; // Occasionally sleeping
  } else if (stateVariation < 0.08) {
    state = "D"; // Occasionally in uninterruptible sleep
  } else if (stateVariation < 0.09) {
    state = "T" as const; // Very rarely stopped
  }

  return {
    pid,
    name: baseProcess.name,
    cpu,
    memory,
    virtualMemory,
    state,
    startTime: startTimeStr,
    command: baseProcess.command,
    user: baseProcess.user,
    priority: baseProcess.priority,
    nice: baseProcess.nice,
    threads: baseProcess.threads,
    lastUpdate: now,
  };
};

// Generate a complete process list
export const generateProcessList = (): ProcessInfo[] => {
  const processes: ProcessInfo[] = [];
  let pid = 1000; // Start with realistic PID range

  baseProcesses.forEach((baseProcess) => {
    processes.push(generateProcessVariation(baseProcess, pid++));
  });

  // Add some additional system processes
  const systemProcesses = [
    {
      name: "systemd",
      baseCpu: 1,
      baseMemory: 5,
      state: "S" as const,
      command: "/usr/lib/systemd/systemd",
      user: "root",
      priority: 40,
      nice: 0,
      threads: 1,
    },
    {
      name: "kthreadd",
      baseCpu: 0,
      baseMemory: 0,
      state: "S" as const,
      command: "[kthreadd]",
      user: "root",
      priority: 50,
      nice: 0,
      threads: 1,
    },
    {
      name: "ksoftirqd",
      baseCpu: 0,
      baseMemory: 0,
      state: "S" as const,
      command: "[ksoftirqd/0]",
      user: "root",
      priority: 45,
      nice: 0,
      threads: 1,
    },
    {
      name: "migration",
      baseCpu: 0,
      baseMemory: 0,
      state: "S" as const,
      command: "[migration/0]",
      user: "root",
      priority: 50,
      nice: 0,
      threads: 1,
    },
    {
      name: "watchdog",
      baseCpu: 0,
      baseMemory: 0,
      state: "S" as const,
      command: "[watchdog/0]",
      user: "root",
      priority: 50,
      nice: 0,
      threads: 1,
    },
  ];

  systemProcesses.forEach((sysProcess) => {
    processes.push(generateProcessVariation(sysProcess, pid++));
  });

  return processes;
};

// Update existing processes with new variations
export const updateProcessList = (
  existingProcesses: ProcessInfo[]
): ProcessInfo[] => {
  return existingProcesses.map((process) => {
    const baseProcess = baseProcesses.find((p) => p.name === process.name) || {
      name: process.name,
      baseCpu: process.cpu,
      baseMemory: process.memory,
      state: process.state,
      command: process.command,
      user: process.user,
      priority: process.priority,
      nice: process.nice,
      threads: process.threads,
    };

    return generateProcessVariation(baseProcess, process.pid);
  });
};
