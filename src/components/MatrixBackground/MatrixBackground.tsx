import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import "./MatrixBackground.css";

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
    const columnWidth = 20;
    const numColumns = Math.floor(canvas.width / columnWidth);

    for (let i = 0; i < numColumns; i++) {
      columns.push({
        x: i * columnWidth,
        y: Math.random() * canvas.height,
        speed: Math.random() * 0.3 + 0.1,
        characters: [],
        opacity: Math.random() * 0.5 + 0.3,
        length: Math.floor(Math.random() * 20) + 10,
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
      // Clear with dark gray background
      context.fillStyle = theme === "light" ? "#1f1f1f" : "#0f0f0f";
      context.fillRect(0, 0, canvas.width, canvas.height);

      const columns = columnsRef.current;

      columns.forEach((column) => {
        // Update position
        column.y += column.speed;

        // Reset column if it goes off screen
        if (column.y > canvas.height + column.length * 20) {
          column.y = -column.length * 20;
          // Regenerate characters
          column.characters = [];
          for (let j = 0; j < column.length; j++) {
            column.characters.push(
              matrixChars[Math.floor(Math.random() * matrixChars.length)]
            );
          }
        }

        // Draw characters in this column
        context.font = "16px 'Courier New', monospace";
        context.textAlign = "center";

        column.characters.forEach((char, index) => {
          const charY = column.y - index * 20;

          // Skip if character is off screen
          if (charY < -20 || charY > canvas.height + 20) return;

          // Calculate opacity based on position in column
          const charOpacity = Math.max(0, 1 - index * 0.1) * column.opacity;

          // Matrix green color
          context.fillStyle = `rgba(0, 255, 0, ${charOpacity})`;
          context.fillText(char, column.x + 10, charY);
        });
      });
    },
    [theme]
  );

  // Main animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context || !isVisible) {
      requestRef.current = requestAnimationFrame(animate);
      return;
    }

    drawMatrix(context, canvas);
    requestRef.current = requestAnimationFrame(animate);
  }, [drawMatrix, isVisible]);

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
      className="bionic-canvas"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    />
  );
};

export default MatrixBackground;
