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
  setSections: (sections: PageSection[]) => void;
  setActiveSection: (id: string) => void;
  setIsAnimationPaused: (paused: boolean) => void;
}

// Create the context with a default value
const LayoutContext = createContext<LayoutContextType>({
  mainContentAreaRef: { current: null },
  sections: [],
  activeSection: "",
  isAnimationPaused: false,
  setSections: () => {},
  setActiveSection: () => {},
  setIsAnimationPaused: () => {},
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

  const value = {
    mainContentAreaRef,
    sections,
    activeSection,
    isAnimationPaused,
    setSections,
    setActiveSection,
    setIsAnimationPaused,
  };

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
};

export default LayoutContext;

// Re-export the useLayoutContext hook
// eslint-disable-next-line react-refresh/only-export-components
export { useLayoutContext } from "./useLayoutContext";
