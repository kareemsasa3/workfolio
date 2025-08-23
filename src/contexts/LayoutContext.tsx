import React, {
  createContext,
  useState,
  ReactNode,
  useRef,
  useEffect,
} from "react";

// Define the shape of a section
export interface PageSection {
  id: string;
  label: string;
}

// Define the shape of the context data
interface LayoutContextType {
  mainContentAreaRef: React.RefObject<HTMLElement>;
  sections: PageSection[];
  activeSection: string;
  isAnimationPaused: boolean;
  matrixSpeed: number;
  setSections: (sections: PageSection[]) => void;
  setActiveSection: (id: string) => void;
  setIsAnimationPaused: (paused: boolean) => void;
  setMatrixSpeed: (speed: number) => void;
}

// Create the context with a default value
const LayoutContext = createContext<LayoutContextType>({
  mainContentAreaRef: { current: null },
  sections: [],
  activeSection: "",
  isAnimationPaused: false,
  matrixSpeed: 1,
  setSections: () => {},
  setActiveSection: () => {},
  setIsAnimationPaused: () => {},
  setMatrixSpeed: () => {},
});

// Create the provider component
export const LayoutContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [activeSection, setActiveSection] = useState<string>("");

  // Initialize animation pause state from localStorage
  const [isAnimationPaused, setIsAnimationPaused] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("workfolio-animation-paused");
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  // Matrix speed (multiplier) persisted in localStorage
  const [matrixSpeed, setMatrixSpeed] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("workfolio-matrix-speed");
      const parsed = saved ? parseFloat(saved) : 1;
      // Clamp between 0.5 and 2.0
      if (!isNaN(parsed)) {
        return Math.min(2, Math.max(0.5, parsed));
      }
    }
    return 1;
  });

  const mainContentAreaRef = useRef<HTMLElement>(null);

  // Save animation pause state to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "workfolio-animation-paused",
        JSON.stringify(isAnimationPaused)
      );
    }
  }, [isAnimationPaused]);

  // Persist matrix speed
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("workfolio-matrix-speed", String(matrixSpeed));
    }
  }, [matrixSpeed]);

  const value = {
    mainContentAreaRef,
    sections,
    activeSection,
    isAnimationPaused,
    matrixSpeed,
    setSections,
    setActiveSection,
    setIsAnimationPaused,
    setMatrixSpeed,
  };

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
};

export default LayoutContext;

// Re-export the useLayoutContext hook
// eslint-disable-next-line react-refresh/only-export-components
export { useLayoutContext } from "./useLayoutContext";
