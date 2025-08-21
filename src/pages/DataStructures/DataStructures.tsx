import { motion } from "framer-motion";
import React, { useMemo, useRef, useState } from "react";
import Tree from "../../components/DataStructureVisualizer/Tree";
import { bstInsertSteps, BstNode, InsertStep } from "../../algorithms/bst";
import "./DataStructures.css";

type PositionedNode = { id: number; x: number; y: number };

function layoutBst(
  root: BstNode<number> | null,
  width: number,
  levelHeight = 100
) {
  const nodes: PositionedNode[] = [];
  const edges: { from: number; to: number }[] = [];
  const marginX = 40;
  let xCursor = marginX;

  function inorder(node: BstNode<number> | null, depth: number) {
    if (!node) return;
    inorder(node.left, depth + 1);
    const x = xCursor;
    const y = 40 + depth * levelHeight;
    nodes.push({ id: node.key, x, y });
    xCursor += Math.max((width - marginX * 2) / (nodes.length + 1), 80);
    inorder(node.right, depth + 1);
  }

  function collectEdges(node: BstNode<number> | null) {
    if (!node) return;
    if (node.left) edges.push({ from: node.key, to: node.left.key });
    if (node.right) edges.push({ from: node.key, to: node.right.key });
    collectEdges(node.left);
    collectEdges(node.right);
  }

  inorder(root, 0);
  collectEdges(root);
  return { nodes, edges };
}

const DataStructures = () => {
  const [root, setRoot] = useState<BstNode<number> | null>(null);
  const [inputVal, setInputVal] = useState<string>("");
  const [activeAt, setActiveAt] = useState<number | undefined>(undefined);
  const [isPlaying, setIsPlaying] = useState(false);
  const stepIterRef = useRef<Generator<
    InsertStep<number>,
    BstNode<number>
  > | null>(null);
  const rafRef = useRef<number | null>(null);
  const speedMsRef = useRef<number>(600);
  const lastTickRef = useRef<number>(0);

  const width = 900;
  const height = 500;

  const { nodes, edges } = useMemo(() => layoutBst(root, width), [root]);

  function addKeySteps(key: number) {
    stepIterRef.current = bstInsertSteps(root, key, (a, b) => a - b);
  }

  function stepOnce(now?: number) {
    if (!stepIterRef.current) return;
    const res = stepIterRef.current.next();
    if (!res.done) {
      const step = res.value as InsertStep<number>;
      if (
        step.type === "compare" ||
        step.type === "descend-left" ||
        step.type === "descend-right"
      ) {
        setActiveAt(step.at);
      } else if (step.type === "insert") {
        setActiveAt(step.at);
      }
    } else {
      setRoot(res.value || root);
      stepIterRef.current = null;
      setIsPlaying(false);
      setActiveAt(undefined);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    }
  }

  function tick(now: number) {
    if (!lastTickRef.current) lastTickRef.current = now;
    const elapsed = now - lastTickRef.current;
    if (elapsed >= speedMsRef.current) {
      stepOnce(now);
      lastTickRef.current = now;
    }
    if (isPlaying && stepIterRef.current) {
      rafRef.current = requestAnimationFrame(tick);
    }
  }

  function handlePlay() {
    if (!stepIterRef.current) return;
    if (!isPlaying) {
      setIsPlaying(true);
      lastTickRef.current = 0;
      rafRef.current = requestAnimationFrame(tick);
    }
  }

  function handlePause() {
    setIsPlaying(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }

  function handleStep() {
    stepOnce();
  }

  function handleInsert() {
    const value = parseInt(inputVal, 10);
    if (Number.isNaN(value)) return;
    addKeySteps(value);
    setIsPlaying(true);
    lastTickRef.current = 0;
    rafRef.current = requestAnimationFrame(tick);
  }

  return (
    <motion.div
      className="page-content data-structures-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <header className="ds-header">
        <h1>Data Structure Visualizer</h1>
        <p>BST insert visualization (MVP)</p>
      </header>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <input
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Enter number (e.g., 7)"
          inputMode="numeric"
          style={{ padding: 8, borderRadius: 8 }}
        />
        <button onClick={handleInsert} style={{ padding: "8px 12px" }}>
          Insert
        </button>
        <button
          onClick={handlePlay}
          disabled={isPlaying || !stepIterRef.current}
          style={{ padding: "8px 12px" }}
        >
          Play
        </button>
        <button
          onClick={handlePause}
          disabled={!isPlaying}
          style={{ padding: "8px 12px" }}
        >
          Pause
        </button>
        <button
          onClick={handleStep}
          disabled={!stepIterRef.current}
          style={{ padding: "8px 12px" }}
        >
          Step
        </button>
        <label
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginLeft: 8,
          }}
        >
          Speed
          <input
            type="range"
            min={100}
            max={1500}
            defaultValue={speedMsRef.current}
            onChange={(e) =>
              (speedMsRef.current = parseInt(e.target.value, 10))
            }
          />
        </label>
      </div>

      <section className="ds-canvas">
        <Tree
          nodes={nodes}
          edges={edges}
          width={width}
          height={height}
          activeNodeId={activeAt}
        />
      </section>
    </motion.div>
  );
};

export default DataStructures;
