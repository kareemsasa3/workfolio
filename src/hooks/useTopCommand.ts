import { useReducer, useEffect, useCallback } from "react";
import { TopState, TopAction, ProcessInfo } from "../types/terminal";

// Helper function to generate process list for top command
const generateProcessList = (): ProcessInfo[] => {
  return [
    {
      pid: 1,
      name: "systemd",
      cpu: 0.5,
      memory: 1024,
      virtualMemory: 2048,
      state: "S" as const,
      startTime: "Jan 01 00:00:00",
      command: "/usr/lib/systemd/systemd",
      user: "root",
      priority: 0,
      nice: 0,
      threads: 1,
      lastUpdate: Date.now(),
    },
    {
      pid: 2,
      name: "kthreadd",
      cpu: 0.0,
      memory: 0,
      virtualMemory: 0,
      state: "S" as const,
      startTime: "Jan 01 00:00:00",
      command: "[kthreadd]",
      user: "root",
      priority: 0,
      nice: 0,
      threads: 1,
      lastUpdate: Date.now(),
    },
    {
      pid: 3,
      name: "ksoftirqd/0",
      cpu: 0.0,
      memory: 0,
      virtualMemory: 0,
      state: "S" as const,
      startTime: "Jan 01 00:00:00",
      command: "[ksoftirqd/0]",
      user: "root",
      priority: 0,
      nice: 0,
      threads: 1,
      lastUpdate: Date.now(),
    },
    {
      pid: 4,
      name: "kworker/0:0",
      cpu: 0.0,
      memory: 0,
      virtualMemory: 0,
      state: "S" as const,
      startTime: "Jan 01 00:00:00",
      command: "[kworker/0:0]",
      user: "root",
      priority: 0,
      nice: 0,
      threads: 1,
      lastUpdate: Date.now(),
    },
    {
      pid: 5,
      name: "kworker/0:0H",
      cpu: 0.0,
      memory: 0,
      virtualMemory: 0,
      state: "S" as const,
      startTime: "Jan 01 00:00:00",
      command: "[kworker/0:0H]",
      user: "root",
      priority: 0,
      nice: 0,
      threads: 1,
      lastUpdate: Date.now(),
    },
  ];
};

// Top command reducer
const topReducer = (state: TopState, action: TopAction): TopState => {
  switch (action.type) {
    case "SHOW_TOP_COMMAND":
      return {
        ...state,
        isTopCommand: true,
        topProcesses: generateProcessList(),
        topSelectedPid: null,
      };

    case "HIDE_TOP_COMMAND":
      return {
        ...state,
        isTopCommand: false,
        topProcesses: [],
        topSelectedPid: null,
      };

    case "UPDATE_TOP_PROCESSES":
      return {
        ...state,
        topProcesses: action.payload,
      };

    case "SET_TOP_SORT":
      return {
        ...state,
        topSortBy: action.payload.field,
        topSortOrder: action.payload.order,
      };

    case "SET_TOP_REFRESH_RATE":
      return {
        ...state,
        topRefreshRate: action.payload,
      };

    case "SET_TOP_SELECTED_PID":
      return {
        ...state,
        topSelectedPid: action.payload,
      };

    case "KILL_TOP_PROCESS":
      return {
        ...state,
        topProcesses: state.topProcesses.filter(
          (process) => process.pid !== action.payload
        ),
      };

    default:
      return state;
  }
};

// Initial top state
const getInitialTopState = (): TopState => ({
  isTopCommand: false,
  topProcesses: [],
  topSortBy: "cpu",
  topSortOrder: "desc",
  topRefreshRate: 1000,
  topSelectedPid: null,
});

export const useTopCommand = () => {
  const [topState, dispatch] = useReducer(topReducer, getInitialTopState());

  // Effect for updating processes when top command is active
  useEffect(() => {
    if (!topState.isTopCommand) return;

    const interval = setInterval(() => {
      const updatedProcesses = generateProcessList().map((process) => ({
        ...process,
        cpu: Math.random() * 100,
        memory: Math.floor(Math.random() * 2048),
        lastUpdate: Date.now(),
      }));

      dispatch({ type: "UPDATE_TOP_PROCESSES", payload: updatedProcesses });
    }, topState.topRefreshRate);

    return () => clearInterval(interval);
  }, [topState.isTopCommand, topState.topRefreshRate]);

  // Action creators
  const showTopCommand = useCallback(() => {
    dispatch({ type: "SHOW_TOP_COMMAND" });
  }, []);

  const hideTopCommand = useCallback(() => {
    dispatch({ type: "HIDE_TOP_COMMAND" });
  }, []);

  const killTopProcess = useCallback((pid: number) => {
    dispatch({ type: "KILL_TOP_PROCESS", payload: pid });
  }, []);

  const setTopSort = useCallback(
    (field: "cpu" | "memory" | "pid" | "name", order: "asc" | "desc") => {
      dispatch({ type: "SET_TOP_SORT", payload: { field, order } });
    },
    []
  );

  const setTopRefreshRate = useCallback((rate: number) => {
    dispatch({ type: "SET_TOP_REFRESH_RATE", payload: rate });
  }, []);

  const setTopSelectedPid = useCallback((pid: number | null) => {
    dispatch({ type: "SET_TOP_SELECTED_PID", payload: pid });
  }, []);

  return {
    topState,
    showTopCommand,
    hideTopCommand,
    killTopProcess,
    setTopSort,
    setTopRefreshRate,
    setTopSelectedPid,
  };
};
