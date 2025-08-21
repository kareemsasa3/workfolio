import React from "react";

type TreeNode = {
  id: number | string;
  x: number;
  y: number;
};

type TreeEdge = {
  from: number | string;
  to: number | string;
};

interface TreeProps {
  nodes: TreeNode[];
  edges: TreeEdge[];
  width?: number;
  height?: number;
  activeNodeId?: number | string;
}

const NODE_RADIUS = 16;

const Tree: React.FC<TreeProps> = ({
  nodes,
  edges,
  width = 800,
  height = 400,
  activeNodeId,
}) => {
  const idToNode = React.useMemo(() => {
    const map = new Map<number | string, TreeNode>();
    for (const node of nodes) map.set(node.id, node);
    return map;
  }, [nodes]);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <g fill="none" stroke="currentColor" strokeOpacity={0.3} strokeWidth={2}>
        {edges.map((e, idx) => {
          const from = idToNode.get(e.from);
          const to = idToNode.get(e.to);
          if (!from || !to) return null;
          return <line key={idx} x1={from.x} y1={from.y} x2={to.x} y2={to.y} />;
        })}
      </g>
      <g>
        {nodes.map((n) => {
          const isActive = activeNodeId === n.id;
          return (
            <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
              <circle
                r={NODE_RADIUS}
                fill={isActive ? "#0b1020" : "#1f2937"}
                stroke={isActive ? "#f59e0b" : "#94a3b8"}
                strokeWidth={isActive ? 3 : 2}
              />
              <text
                x={0}
                y={5}
                textAnchor="middle"
                fontSize={12}
                fill={isActive ? "#fde68a" : "#e5e7eb"}
              >
                {n.id}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
};

export default Tree;
