import { useRef, useEffect } from "react";
import "./BionicBackground.css";

interface Node {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  color: string;
}

const BionicBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createNodes();
    };

    const getRandomColor = () => {
      return Math.random() > 0.5 ? "#FF0000" : "#FFFFFF"; // Red or White
    };

    const createNodes = () => {
      if (!canvas) return;
      const nodeCount = 20;
      nodesRef.current = [];
      for (let i = 0; i < nodeCount; i++) {
        nodesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          dx: (Math.random() - 0.5) * 0.5,
          dy: (Math.random() - 0.5) * 0.5,
          radius: 2 + Math.random() * 3,
          color: getRandomColor(),
        });
      }
    };

    const drawNodes = () => {
      if (!canvas || !context) return;

      context.clearRect(0, 0, canvas.width, canvas.height);

      nodesRef.current.forEach((node) => {
        context.beginPath();
        context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        context.fillStyle = node.color;
        context.fill();

        node.x += node.dx;
        node.y += node.dy;

        if (node.x < 0 || node.x > canvas.width) node.dx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.dy *= -1;
      });

      drawConnections();
      requestRef.current = requestAnimationFrame(drawNodes);
    };

    const drawConnections = () => {
      if (!context) return;

      const maxDistance = 100;
      nodesRef.current.forEach((node1, index) => {
        for (let i = index + 1; i < nodesRef.current.length; i++) {
          const node2 = nodesRef.current[i];
          const distance = getDistance(node1, node2);
          if (distance < maxDistance) {
            context.beginPath();
            context.moveTo(node1.x, node1.y);
            context.lineTo(node2.x, node2.y);
            context.strokeStyle = `rgba(255, 255, 255, ${
              1 - distance / maxDistance
            })`;
            context.stroke();
          }
        }
      });
    };

    const getDistance = (node1: Node, node2: Node) => {
      const dx = node1.x - node2.x;
      const dy = node1.y - node2.y;
      return Math.sqrt(dx * dx + dy * dy);
    };

    window.addEventListener("resize", resizeCanvas);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createNodes();
    drawNodes();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="bionic-canvas" />;
};

export default BionicBackground;
