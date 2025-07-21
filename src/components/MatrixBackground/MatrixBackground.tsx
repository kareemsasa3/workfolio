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

  // Theme-specific colors
  const getThemeColors = useCallback(() => {
    if (theme === "light") {
      return {
        background: "#f8f8f8", // Very light background
        characters: "#2c2c2c", // Dark characters for light mode
        glow: "rgba(44, 44, 44, 0.1)", // Subtle dark glow
      };
    } else {
      return {
        background: "#0f0f0f", // Dark background
        characters: "#00ff00", // Classic Matrix green
        glow: "rgba(0, 255, 0, 0.1)", // Green glow
      };
    }
  }, [theme]);

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

  // Draw matrix effect
  const drawMatrix = useCallback(
    (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      const colors = getThemeColors();

      // Clear with theme-appropriate background
      context.fillStyle = colors.background;
      context.fillRect(0, 0, canvas.width, canvas.height);

      const columns = columnsRef.current;

      columns.forEach((column) => {
        // Update position
        column.y += column.speed;

        // Reset column if it goes off screen
        if (
          column.y >
          canvas.height + column.length * CONFIG.characterSpacing
        ) {
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
          const colorWithOpacity =
            theme === "light"
              ? `rgba(44, 44, 44, ${charOpacity})`
              : `rgba(0, 255, 0, ${charOpacity})`;
          context.fillStyle = colorWithOpacity;
          context.fillText(char, column.x + CONFIG.columnWidth / 2, charY);
        });
      });
    },
    [getThemeColors, theme]
  );

  // Main animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context || !isVisible || isAnimationPaused) {
      requestRef.current = requestAnimationFrame(animate);
      return;
    }

    drawMatrix(context, canvas);
    requestRef.current = requestAnimationFrame(animate);
  }, [drawMatrix, isVisible, isAnimationPaused]);

  // Resize handler
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initializeColumns(canvas);
  }, [initializeColumns]);

  // Main effect for canvas setup and animation
  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Set canvas size and create initial columns
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initializeColumns(canvas);

    // Start animation
    animate();

    // Add resize listener
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [prefersReducedMotion, initializeColumns, animate, resizeCanvas]);

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
