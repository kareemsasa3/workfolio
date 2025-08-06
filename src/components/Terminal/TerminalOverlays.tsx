import React from "react";
import ManPageUI from "./ManPageUI";
import TopUI from "./TopUI";
import { ScrapeResults, ScrapedData } from "../ScrapeResults";
import { manPages } from "../../data/manPages";
import { ProcessInfo } from "../../types/terminal";

interface TerminalOverlaysProps {
  // Man page overlay
  isManPage: boolean;
  currentManPage: string | null;
  manPageScrollPosition: number;
  onHideManPage: () => void;
  onSetManPageScroll: (position: number) => void;

  // Top command overlay
  isTopCommand: boolean;
  topProcesses: ProcessInfo[];
  topSortBy: "cpu" | "memory" | "pid" | "name";
  topSortOrder: "asc" | "desc";
  topRefreshRate: number;
  topSelectedPid: number | null;
  onHideTopCommand: () => void;
  onSetTopSort: (
    sortBy: "cpu" | "memory" | "pid" | "name",
    sortOrder: "asc" | "desc"
  ) => void;
  onKillTopProcess: (pid: number) => void;
  onSetTopSelectedPid: (pid: number | null) => void;

  // Scrape results overlay
  showScrapeResults: boolean;
  scrapeResults: ScrapedData[];
  onHideScrapeResults: () => void;
}

const TerminalOverlays: React.FC<TerminalOverlaysProps> = ({
  // Man page props
  isManPage,
  currentManPage,
  manPageScrollPosition,
  onHideManPage,
  onSetManPageScroll,

  // Top command props
  isTopCommand,
  topProcesses,
  topSortBy,
  topSortOrder,
  topRefreshRate,
  topSelectedPid,
  onHideTopCommand,
  onSetTopSort,
  onKillTopProcess,
  onSetTopSelectedPid,

  // Scrape results props
  showScrapeResults,
  scrapeResults,
  onHideScrapeResults,
}) => {
  return (
    <>
      {/* Man Page Overlay */}
      {isManPage && currentManPage && manPages[currentManPage] && (
        <ManPageUI
          manPage={manPages[currentManPage]}
          onExit={onHideManPage}
          onScroll={onSetManPageScroll}
          scrollPosition={manPageScrollPosition}
        />
      )}

      {/* Top Command Overlay */}
      {isTopCommand && (
        <TopUI
          processes={topProcesses}
          onExit={onHideTopCommand}
          onSort={onSetTopSort}
          onKillProcess={onKillTopProcess}
          onSelectProcess={onSetTopSelectedPid}
          selectedPid={topSelectedPid}
          sortBy={topSortBy}
          sortOrder={topSortOrder}
          refreshRate={topRefreshRate}
        />
      )}

      {/* Scrape Results Modal */}
      {showScrapeResults && scrapeResults.length > 0 && (
        <ScrapeResults results={scrapeResults} onClose={onHideScrapeResults} />
      )}
    </>
  );
};

export default TerminalOverlays;
