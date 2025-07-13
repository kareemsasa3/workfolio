// src/components/TypewriterText/TypewriterText.jsx
import React, { useState, useEffect, useRef } from "react";
import "./TypeWriterText.css";

interface TypeWriterTextProps {
  text: string;
  delay?: number;
  speed?: number;
}

const TypeWriterText: React.FC<TypeWriterTextProps> = ({
  text,
  delay = 0,
  speed = 100,
}) => {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Clear any existing timers
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setIsTyping(false);
    setDisplayText("");

    const startTyping = () => {
      setIsTyping(true);
      setDisplayText("");
      let currentIndex = 0;

      intervalRef.current = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setIsTyping(false);
        }
      }, speed);
    };

    // Start typing after delay
    if (delay > 0) {
      timeoutRef.current = setTimeout(startTyping, delay);
    } else {
      startTyping();
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [text, delay, speed]);

  return (
    <div className="typewriter-text">
      {displayText}
      {isTyping && <span className="cursor">|</span>}
    </div>
  );
};

export default TypeWriterText;
