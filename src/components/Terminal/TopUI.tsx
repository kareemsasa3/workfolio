import React, { useEffect, useRef, useState } from "react";
import { ProcessInfo } from "../../types/terminal";
import "./TopUI.css";

interface TopUIProps {
  processes: ProcessInfo[];
  onExit: () => void;
  onSort: (
    field: "cpu" | "memory" | "pid" | "name",
    order: "asc" | "desc"
  ) => void;
  onKillProcess: (pid: number) => void;
  onSelectProcess: (pid: number | null) => void;
  selectedPid: number | null;
  sortBy: "cpu" | "memory" | "pid" | "name";
  sortOrder: "asc" | "desc";
  refreshRate: number;
}

const TopUI: React.FC<TopUIProps> = ({
  processes,
  onExit,
  onSort,
  onKillProcess,
  onSelectProcess,
  selectedPid,
  sortBy,
  sortOrder,
  refreshRate,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [uptime, setUptime] = useState(0);
  const [systemLoad, setSystemLoad] = useState({
    load1: 0,
    load5: 0,
    load15: 0,
  });
  const [memoryInfo, setMemoryInfo] = useState({
    total: 0,
    used: 0,
    free: 0,
    cached: 0,
  });
  const [cpuInfo, setCpuInfo] = useState({
    user: 0,
    system: 0,
    idle: 0,
    iowait: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // Update time and system info
  useEffect(() => {
    const updateSystemInfo = () => {
      setCurrentTime(new Date());

      // Simulate uptime (in seconds)
      const baseUptime = 86400 + Math.floor(Math.random() * 3600); // ~24 hours + random
      setUptime(baseUptime + (Math.floor(Date.now() / 1000) % 3600));

      // Simulate system load
      const baseLoad = 0.5 + Math.random() * 2;
      setSystemLoad({
        load1: baseLoad + Math.random() * 0.5,
        load5: baseLoad + Math.random() * 0.3,
        load15: baseLoad + Math.random() * 0.2,
      });

      // Simulate memory info
      const totalMem = 16384; // 16GB
      const usedMem = 8000 + Math.random() * 4000;
      setMemoryInfo({
        total: totalMem,
        used: Math.floor(usedMem),
        free: Math.floor(totalMem - usedMem),
        cached: Math.floor(Math.random() * 2000),
      });

      // Simulate CPU info
      const totalCpu = 100;
      const userCpu = 20 + Math.random() * 30;
      const systemCpu = 10 + Math.random() * 20;
      const iowaitCpu = Math.random() * 10;
      setCpuInfo({
        user: Math.floor(userCpu),
        system: Math.floor(systemCpu),
        idle: Math.floor(totalCpu - userCpu - systemCpu - iowaitCpu),
        iowait: Math.floor(iowaitCpu),
      });
    };

    updateSystemInfo();
    const interval = setInterval(updateSystemInfo, refreshRate);
    return () => clearInterval(interval);
  }, [refreshRate]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "q":
          onExit();
          break;
        case "k":
          if (selectedPid) {
            onKillProcess(selectedPid);
          }
          break;
        case "arrowup":
          e.preventDefault();
          if (processes.length > 0) {
            const currentIndex = processes.findIndex(
              (p) => p.pid === selectedPid
            );
            const newIndex =
              currentIndex > 0 ? currentIndex - 1 : processes.length - 1;
            onSelectProcess(processes[newIndex].pid);
          }
          break;
        case "arrowdown":
          e.preventDefault();
          if (processes.length > 0) {
            const currentIndex = processes.findIndex(
              (p) => p.pid === selectedPid
            );
            const newIndex =
              currentIndex < processes.length - 1 ? currentIndex + 1 : 0;
            onSelectProcess(processes[newIndex].pid);
          }
          break;
        case "1":
          onSort(
            "cpu",
            sortBy === "cpu" && sortOrder === "desc" ? "asc" : "desc"
          );
          break;
        case "2":
          onSort(
            "memory",
            sortBy === "memory" && sortOrder === "desc" ? "asc" : "desc"
          );
          break;
        case "3":
          onSort(
            "pid",
            sortBy === "pid" && sortOrder === "desc" ? "asc" : "desc"
          );
          break;
        case "4":
          onSort(
            "name",
            sortBy === "name" && sortOrder === "desc" ? "asc" : "desc"
          );
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    onExit,
    onKillProcess,
    onSelectProcess,
    onSort,
    selectedPid,
    processes,
    sortBy,
    sortOrder,
  ]);

  // Auto-select first process if none selected
  useEffect(() => {
    if (processes.length > 0 && selectedPid === null) {
      onSelectProcess(processes[0].pid);
    }
  }, [processes, selectedPid, onSelectProcess]);

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const formatMemory = (mb: number) => {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)}G`;
    }
    return `${mb}M`;
  };

  const getSortIndicator = (field: "cpu" | "memory" | "pid" | "name") => {
    if (sortBy !== field) return "";
    return sortOrder === "desc" ? " ▼" : " ▲";
  };

  return (
    <div className="top-overlay">
      <div className="top-container" ref={containerRef}>
        {/* Header */}
        <div className="top-header">
          <div className="top-title">System Monitor - Portfolio OS</div>
          <div className="top-controls">
            <span className="top-control">q: quit</span>
            <span className="top-control">k: kill</span>
            <span className="top-control">↑↓: select</span>
            <span className="top-control">1-4: sort</span>
          </div>
        </div>

        {/* System Info */}
        <div className="top-system-info">
          <div className="top-uptime">
            up {formatUptime(uptime)}, {processes.length} processes
          </div>
          <div className="top-load">
            load average: {systemLoad.load1.toFixed(2)},{" "}
            {systemLoad.load5.toFixed(2)}, {systemLoad.load15.toFixed(2)}
          </div>
          <div className="top-time">{currentTime.toLocaleTimeString()}</div>
        </div>

        {/* CPU and Memory Summary */}
        <div className="top-summary">
          <div className="top-cpu-summary">
            <span className="top-label">CPU:</span>
            <span className="top-cpu-user">{cpuInfo.user}% user</span>
            <span className="top-cpu-system">{cpuInfo.system}% system</span>
            <span className="top-cpu-idle">{cpuInfo.idle}% idle</span>
            <span className="top-cpu-iowait">{cpuInfo.iowait}% iowait</span>
          </div>
          <div className="top-memory-summary">
            <span className="top-label">Memory:</span>
            <span className="top-memory-total">
              {formatMemory(memoryInfo.total)} total
            </span>
            <span className="top-memory-used">
              {formatMemory(memoryInfo.used)} used
            </span>
            <span className="top-memory-free">
              {formatMemory(memoryInfo.free)} free
            </span>
            <span className="top-memory-cached">
              {formatMemory(memoryInfo.cached)} cached
            </span>
          </div>
        </div>

        {/* Process Table Header */}
        <div className="top-table-header">
          <div
            className="top-col-pid"
            onClick={() =>
              onSort(
                "pid",
                sortBy === "pid" && sortOrder === "desc" ? "asc" : "desc"
              )
            }
          >
            PID{getSortIndicator("pid")}
          </div>
          <div
            className="top-col-name"
            onClick={() =>
              onSort(
                "name",
                sortBy === "name" && sortOrder === "desc" ? "asc" : "desc"
              )
            }
          >
            COMMAND{getSortIndicator("name")}
          </div>
          <div
            className="top-col-cpu"
            onClick={() =>
              onSort(
                "cpu",
                sortBy === "cpu" && sortOrder === "desc" ? "asc" : "desc"
              )
            }
          >
            %CPU{getSortIndicator("cpu")}
          </div>
          <div
            className="top-col-memory"
            onClick={() =>
              onSort(
                "memory",
                sortBy === "memory" && sortOrder === "desc" ? "asc" : "desc"
              )
            }
          >
            %MEM{getSortIndicator("memory")}
          </div>
          <div className="top-col-vsz">VSZ</div>
          <div className="top-col-rss">RSS</div>
          <div className="top-col-state">STATE</div>
          <div className="top-col-time">TIME</div>
        </div>

        {/* Process Table */}
        <div className="top-table-body">
          {processes.map((process) => (
            <div
              key={process.pid}
              className={`top-process-row ${
                selectedPid === process.pid ? "selected" : ""
              }`}
              onClick={() => onSelectProcess(process.pid)}
            >
              <div className="top-col-pid">{process.pid}</div>
              <div className="top-col-name">{process.name}</div>
              <div className="top-col-cpu">{process.cpu.toFixed(1)}</div>
              <div className="top-col-memory">
                {((process.memory / memoryInfo.total) * 100).toFixed(1)}
              </div>
              <div className="top-col-vsz">
                {formatMemory(process.virtualMemory)}
              </div>
              <div className="top-col-rss">{formatMemory(process.memory)}</div>
              <div className="top-col-state">{process.state}</div>
              <div className="top-col-time">{process.startTime}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="top-footer">
          <div className="top-info">
            Press <kbd>q</kbd> to quit, <kbd>k</kbd> to kill selected process
          </div>
          <div className="top-refresh">Refresh: {refreshRate / 1000}s</div>
        </div>
      </div>
    </div>
  );
};

export default TopUI;
