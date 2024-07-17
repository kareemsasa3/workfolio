// src/components/SnakeGame.js
import React, { useState, useEffect, useRef } from 'react';
import './SnakeGame.css';

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const [speed, setSpeed] = useState(200);
  const [score, setScore] = useState(0);
  const gameBoardRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const moveSnake = () => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };
  
        if (head.x === food.x && head.y === food.y) {
          setFood({
            x: Math.floor(Math.random() * 20),
            y: Math.floor(Math.random() * 20),
          });
          setScore(score + 1);
        } else {
          newSnake.pop();
        }
  
        newSnake.unshift(head);
        return newSnake;
      });
    };
  
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [direction, speed, food, score]);

  useEffect(() => {
    const checkCollision = () => {
      const head = snake[0];
      for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
          alert('Game Over!');
          setSnake([{ x: 10, y: 10 }]);
          setDirection({ x: 0, y: 0 });
          setFood({ x: 15, y: 15 });
          setScore(0);
          setSpeed(0);
        }
      }
    };

    checkCollision();
  }, [snake]);

  return (
    <div ref={gameBoardRef} className="game-board">
      {snake.map((segment, index) => (
        <div
          key={index}
          className="snake-segment"
          style={{ left: `${segment.x * 20}px`, top: `${segment.y * 20}px` }}
        ></div>
      ))}
      <div
        className="food"
        style={{ left: `${food.x * 20}px`, top: `${food.y * 20}px` }}
      ></div>
      <p className="game-description">Use arrow keys to control the snake.</p>
      <p className="game-score">Score: {score}</p>
    </div>
  );
};

export default SnakeGame;
