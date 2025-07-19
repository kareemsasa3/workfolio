import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
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
  setSections: (sections: PageSection[]) => void;
  setActiveSection: (id: string) => void;
}

// Create the context with a default value
const LayoutContext = createContext<LayoutContextType>({
  mainContentAreaRef: { current: null },
  sections: [],
  activeSection: "",
  setSections: () => {},
  setActiveSection: () => {},
});

// Create the provider component
export const LayoutContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [activeSection, setActiveSection] = useState<string>("");
  const mainContentAreaRef = useRef<HTMLElement>(null);

  const value = {
    mainContentAreaRef,
    sections,
    activeSection,
    setSections,
    setActiveSection,
  };

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
};

// Create a custom hook for easy consumption
export const useLayoutContext = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error(
      "useLayoutContext must be used within a LayoutContextProvider"
    );
  }
  return context;
};

export default LayoutContext;
