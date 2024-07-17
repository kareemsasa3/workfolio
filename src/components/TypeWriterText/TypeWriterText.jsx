// src/components/TypewriterText/TypewriterText.jsx
import React, { useState, useEffect } from 'react';

const TypewriterText = ({ text, delay = 0 }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let currentText = '';
    let index = 0;

    const startTyping = () => {
      const timer = setInterval(() => {
        if (index < text.length) {
          currentText += text[index];
          setDisplayText(currentText);
          index++;
        } else {
          clearInterval(timer);
        }
      }, 100); // Adjust the delay (in milliseconds) between each letter
    };

    const delayTimer = setTimeout(startTyping, delay);

    return () => {
      clearTimeout(delayTimer);
    };
  }, [text, delay]);

  return (
    <div>
      {displayText}
    </div>
  );
};

export default TypewriterText;
