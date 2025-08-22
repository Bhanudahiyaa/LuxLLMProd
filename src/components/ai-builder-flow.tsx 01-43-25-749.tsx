"use client";

import React, { useCallback, useMemo } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Node,
  addEdge,
  Connection,
  Edge,
  useEdgesState,
  useNodesState,
  MiniMap,
} from "reactflow";

import "reactflow/dist/style.css";

// Importing custom node components
import PromptNode from "./nodes/PromptNode";
import GeneratingNode from "./nodes/GeneratingNode";
import FilesNode from "./nodes/FilesNode";
import ImportNode from "./nodes/ImportNode";
import ReadyNode from "./nodes/ReadyNode";

// Initial nodes
const initialNodes: Node[] = [
  {
    id: "1",
    type: "promptNode",
    position: { x: 0, y: 50 },
    data: {
      label: "Prompt your idea",
    },
  },
  {
    id: "2",
    type: "generatingNode",
    position: { x: 250, y: 50 },
    data: {
      label: "Generating your custom AI agent",
    },
  },
  {
    id: "3",
    type: "filesNode",
    position: { x: 500, y: 50 },
    data: {
      label: "Get Files (.env, .logic etc)",
    },
  },
  {
    id: "4",
    type: "importNode",
    position: { x: 750, y: 50 },
    data: {
      label: "Import to your codebase",
    },
  },
  {
    id: "5",
    type: "readyNode",
    position: { x: 1000, y: 50 },
    data: {
      label: "Ready!",
    },
  },
];

// Initial edges
const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e2-3", source: "2", target: "3", animated: true },
  { id: "e3-4", source: "3", target: "4", animated: true },
  { id: "e4-5", source: "4", target: "5", animated: true },
];

const nodeTypes = {
  promptNode: PromptNode,
  generatingNode: GeneratingNode,
  filesNode: FilesNode,
  importNode: ImportNode,
  readyNode: ReadyNode,
};

const viewportSettings = {
  translateExtent: [
    [-200, -200],
    [1500, 800],
  ], // Fixed typing error
  nodeExtent: [
    [-200, -200],
    [1500, 800],
  ],
};

const AiBuilderFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: Connection) => setEdges(eds => addEdge(connection, eds)),
    [setEdges]
  );

  return (
    <div className="h-[500px] w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        nodeTypes={nodeTypes}
        {...viewportSettings} // Apply translateExtent & nodeExtent here
      >
        <MiniMap />
        <Controls />
        <Background variant={"dots" as BackgroundVariant} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default AiBuilderFlow;
