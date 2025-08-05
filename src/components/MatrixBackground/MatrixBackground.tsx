import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { useLayoutContext } from "../../contexts/LayoutContext";
import "./MatrixBackground.css";

// Configuration object to manage the "magic numbers"
const CONFIG = {
  columnWidth: 20,
  fontSize: 16,
  characterSpacing: 20,
  speedRange: { min: 0.1, max: 0.4 },
  opacityRange: { min: 0.3, max: 0.8 },
  lengthRange: { min: 10, max: 30 },
  fadeRate: 0.1,
  resetOffset: 20,
  animationDuration: 0.5,
} as const;

interface MatrixColumn {
  x: number;
  y: number;
  speed: number;
  characters: string[];
  opacity: number;
  length: number;
}

const MatrixBackground = () => {
  const { theme } = useTheme();
  const { isAnimationPaused } = useLayoutContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const columnsRef = useRef<MatrixColumn[]>([]);

  // Matrix characters (numbers and some symbols)
  const matrixChars = "0123456789ABCDEF";

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Visibility API for performance optimization
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Initialize matrix columns
  const initializeColumns = useCallback((canvas: HTMLCanvasElement) => {
    const columns: MatrixColumn[] = [];
    const numColumns = Math.floor(canvas.width / CONFIG.columnWidth);

    for (let i = 0; i < numColumns; i++) {
      columns.push({
        x: i * CONFIG.columnWidth,
        y: Math.random() * canvas.height,
        speed:
          Math.random() * (CONFIG.speedRange.max - CONFIG.speedRange.min) +
          CONFIG.speedRange.min,
        characters: [],
        opacity:
          Math.random() * (CONFIG.opacityRange.max - CONFIG.opacityRange.min) +
          CONFIG.opacityRange.min,
        length:
          Math.floor(
            Math.random() * (CONFIG.lengthRange.max - CONFIG.lengthRange.min)
          ) + CONFIG.lengthRange.min,
      });

      // Generate random characters for this column
      for (let j = 0; j < columns[i].length; j++) {
        columns[i].characters.push(
          matrixChars[Math.floor(Math.random() * matrixChars.length)]
        );
      }
    }

    columnsRef.current = columns;
  }, []);

  // **FIX 1**: The single source of truth for drawing logic.
  // It reads `theme` directly, so it's always up-to-date.
  const drawAndUpdateMatrix = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const backgroundColor = theme === "light" ? "#f8f8f8" : "#0f0f0f";
    const charColor = theme === "light" ? "44, 44, 44" : "0, 255, 0";

    // Clear with theme-appropriate background
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const columns = columnsRef.current;

    columns.forEach((column) => {
      // Always update positions when this function is called
      column.y += column.speed;

      // Reset column if it goes off screen
      if (column.y > canvas.height + column.length * CONFIG.characterSpacing) {
        column.y = -column.length * CONFIG.characterSpacing;
        // Regenerate characters
        column.characters = [];
        for (let j = 0; j < column.length; j++) {
          column.characters.push(
            matrixChars[Math.floor(Math.random() * matrixChars.length)]
          );
        }
      }

      // Draw characters in this column
      context.font = `${CONFIG.fontSize}px 'Courier New', monospace`;
      context.textAlign = "center";

      column.characters.forEach((char, index) => {
        const charY = column.y - index * CONFIG.characterSpacing;

        // Skip if character is off screen
        if (
          charY < -CONFIG.characterSpacing ||
          charY > canvas.height + CONFIG.characterSpacing
        )
          return;

        // Calculate opacity based on position in column
        const charOpacity =
          Math.max(0, 1 - index * CONFIG.fadeRate) * column.opacity;

        // Use theme-appropriate color with opacity
        context.fillStyle = `rgba(${charColor}, ${charOpacity})`;
        context.fillText(char, column.x + CONFIG.columnWidth / 2, charY);
      });
    });
  }, [theme]); // This function *should* change when the theme changes.

  // **FIX 2**: The animation loop function.
  // It is now stable and does not depend on `theme`.
  const animate = useCallback(() => {
    drawAndUpdateMatrix();
    requestRef.current = requestAnimationFrame(animate);
  }, [drawAndUpdateMatrix]); // `animate` now only changes if `drawAndUpdateMatrix` changes.

  // Resize handler - This needs to draw a static frame
  const redrawStaticFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const backgroundColor = theme === "light" ? "#f8f8f8" : "#0f0f0f";
    const charColor = theme === "light" ? "44, 44, 44" : "0, 255, 0";

    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = `${CONFIG.fontSize}px 'Courier New', monospace`;
    context.textAlign = "center";

    columnsRef.current.forEach((column) => {
      column.characters.forEach((char, index) => {
        const charY = column.y - index * CONFIG.characterSpacing;
        if (charY < 0 || charY > canvas.height) return;

        const charOpacity =
          Math.max(0, 1 - index * CONFIG.fadeRate) * column.opacity;
        context.fillStyle = `rgba(${charColor}, ${charOpacity})`;
        context.fillText(char, column.x + CONFIG.columnWidth / 2, charY);
      });
    });
  }, [theme]);

  // Main setup effect
  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      initializeColumns(canvasRef.current);
      // Redraw a static frame on resize, especially important if paused
      redrawStaticFrame();
    };

    handleResize(); // Initial setup

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [prefersReducedMotion, initializeColumns, redrawStaticFrame]);

  // **FIX 3**: The animation control effect.
  // The `animate` dependency is now stable across theme changes.
  useEffect(() => {
    if (isAnimationPaused || !isVisible || prefersReducedMotion) {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    } else {
      if (!requestRef.current) {
        // When resuming, kick off the loop
        requestRef.current = requestAnimationFrame(animate);
      }
    }

    // This effect needs to re-evaluate when the theme changes to draw a new static frame
    if (isAnimationPaused) {
      redrawStaticFrame();
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    };
  }, [
    isAnimationPaused,
    isVisible,
    prefersReducedMotion,
    animate,
    redrawStaticFrame,
  ]);

  // Hide the canvas entirely for reduced motion users
  if (prefersReducedMotion) {
    return null;
  }

  return (
    <motion.canvas
      ref={canvasRef}
      className={`matrix-background ${
        isAnimationPaused ? "animation-paused" : ""
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: CONFIG.animationDuration }}
    />
  );
};

export default MatrixBackground;
