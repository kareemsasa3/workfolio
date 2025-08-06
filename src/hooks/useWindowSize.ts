import { useState, useEffect, useMemo } from "react";
import { debounce } from "../utils";

interface WindowSize {
  width: number;
  height: number;
}

export const useWindowSize = (debounceMs = 100): WindowSize => {
  const [size, setSize] = useState<WindowSize>(() => ({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  }));

  // Memoize the debounced function to ensure it's stable across renders
  const debouncedSetSize = useMemo(
    () =>
      debounce((width: number, height: number) => {
        setSize({ width, height });
      }, debounceMs),
    [debounceMs]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      debouncedSetSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      debouncedSetSize.cancel(); // Now this will work correctly
    };
  }, [debouncedSetSize]);

  return size;
};
