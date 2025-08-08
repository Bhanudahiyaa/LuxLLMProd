import React, { useCallback, useState, useEffect } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  NodeProps,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  Download,
  FileText,
  Settings,
  CheckCircle,
  Bot,
  FolderOpen,
  Code,
  Sparkles,
  Lock,
  Unlock,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Custom Node Components
const PromptNode = ({ data }: NodeProps) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 sm:p-6 min-w-[180px] sm:min-w-[280px] shadow-2xl">
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-green-500 border-2 border-green-400"
      />

      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="w-6 h-6 sm:w-10 sm:h-10 bg-zinc-800 rounded-lg flex items-center justify-center">
          <Sparkles className="w-3 h-3 sm:w-5 sm:h-5 text-green-400" />
        </div>
        <h3 className="text-xs sm:text-lg font-semibold text-zinc-100 leading-tight">
          Prompt Your Idea
        </h3>
      </div>

      <div className="space-y-2 sm:space-y-3">
        <input
          type="text"
          placeholder="Describe your AI agent..."
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 sm:px-4 sm:py-3 text-xs sm:text-base text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
        />
        <p className="text-xs text-zinc-500 hidden sm:block">
          Enter your requirements and let AI build your Custom Agent
        </p>
      </div>
    </div>
  );
};

const GeneratingNode = ({ data }: NodeProps) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => prev + 2);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 sm:p-6 min-w-[180px] sm:min-w-[280px] shadow-2xl">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-green-500 border-2 border-green-400"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-green-500 border-2 border-green-400"
      />

      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="w-6 h-6 sm:w-10 sm:h-10 bg-zinc-800 rounded-lg flex items-center justify-center">
          <Settings
            className="w-3 h-3 sm:w-5 sm:h-5 text-green-400"
            style={{ transform: `rotate(${rotation}deg)` }}
          />
        </div>
        <h3 className="text-xs sm:text-lg font-semibold text-zinc-100 leading-tight">
          Generating Your AI Agent
        </h3>
      </div>

      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs sm:text-sm text-zinc-400">
            Analyzing requirements...
          </span>
        </div>
        <div className="w-full bg-zinc-800 rounded-full h-1.5 sm:h-2">
          <div
            className="bg-gradient-to-r from-green-600 to-green-400 h-1.5 sm:h-2 rounded-full animate-pulse"
            style={{ width: "75%" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const FilesNode = ({ data }: NodeProps) => {
  const files = [
    { name: ".env", icon: FileText, description: "Environment variables" },
    { name: ".logic", icon: Code, description: "Agent logic & behavior" },
    { name: ".demo", icon: Bot, description: "Demo & examples" },
  ];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 sm:p-6 min-w-[180px] sm:min-w-[280px] shadow-2xl">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-green-500 border-2 border-green-400"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-green-500 border-2 border-green-400"
      />

      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="w-6 h-6 sm:w-10 sm:h-10 bg-zinc-800 rounded-lg flex items-center justify-center">
          <Download className="w-3 h-3 sm:w-5 sm:h-5 text-green-400" />
        </div>
        <h3 className="text-xs sm:text-lg font-semibold text-zinc-100 leading-tight">
          Get Files
        </h3>
      </div>

      <div className="space-y-1 sm:space-y-2">
        {files.map((file, index) => (
          <div
            key={index}
            className="flex items-center gap-1.5 sm:gap-3 p-1 sm:p-2 bg-zinc-800 rounded-lg hover:bg-zinc-750 transition-colors cursor-pointer group"
          >
            <file.icon className="w-3 h-3 sm:w-4 sm:h-4 text-zinc-400 group-hover:text-green-400 transition-colors flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs sm:text-sm font-medium text-zinc-200 truncate">
                {file.name}
              </div>
              <div className="text-xs text-zinc-500 hidden sm:block truncate">
                {file.description}
              </div>
            </div>
            <Download className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};

const ImportNode = ({ data }: NodeProps) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 sm:p-6 min-w-[180px] sm:min-w-[280px] shadow-2xl">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-green-500 border-2 border-green-400"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-green-500 border-2 border-green-400"
      />

      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="w-6 h-6 sm:w-10 sm:h-10 bg-zinc-800 rounded-lg flex items-center justify-center">
          <FolderOpen className="w-3 h-3 sm:w-5 sm:h-5 text-green-400" />
        </div>
        <h3 className="text-xs sm:text-lg font-semibold text-zinc-100 leading-tight">
          Import Files in Your Project
        </h3>
      </div>

      <div className="space-y-2">
        <div className="bg-zinc-800 rounded-lg p-2 sm:p-3 font-mono text-xs">
          <div className="text-zinc-500 mb-1 sm:mb-2">📁 my-ai-project/</div>
          <div className="ml-2 sm:ml-4 space-y-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-green-400 text-xs">✓</span>
              <span className="text-zinc-300 text-xs">.env</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-green-400 text-xs">✓</span>
              <span className="text-zinc-300 text-xs">.logic</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-green-400 text-xs">✓</span>
              <span className="text-zinc-300 text-xs">.demo</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-zinc-500 hidden sm:block">
          Files successfully imported to your project
        </p>
      </div>
    </div>
  );
};

const ReadyNode = ({ data }: NodeProps) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 sm:p-6 min-w-[180px] sm:min-w-[280px] shadow-2xl">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-green-500 border-2 border-green-400"
      />

      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="w-6 h-6 sm:w-10 sm:h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
          <CheckCircle className="w-3 h-3 sm:w-5 sm:h-5 text-green-400" />
        </div>
        <h3 className="text-xs sm:text-lg font-semibold text-zinc-100 leading-tight">
          Your Custom AI Agent is Ready
        </h3>
      </div>

      <div className="text-center space-y-2 sm:space-y-4">
        <div className="w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-green-500/25">
          <Bot className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
        </div>
        <div className="space-y-1 sm:space-y-2">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
            <CheckCircle className="w-3 h-3 sm:w-5 sm:h-5 text-green-400" />
            <span className="text-xs sm:text-sm font-medium text-green-400">
              Agent Deployed Successfully
            </span>
          </div>
          <p className="text-xs text-zinc-500 hidden sm:block">
            Your AI agent is now live and ready to use
          </p>
        </div>
      </div>
    </div>
  );
};

// Node types
const nodeTypes = {
  prompt: PromptNode,
  generating: GeneratingNode,
  files: FilesNode,
  import: ImportNode,
  ready: ReadyNode,
};

// Initial nodes with responsive spacing
const getInitialNodes = (): Node[] => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const spacing = isMobile ? 200 : 450;

  return [
    {
      id: "1",
      type: "prompt",
      position: { x: 50, y: 200 },
      data: { label: "Prompt Your Idea" },
      draggable: false,
    },
    {
      id: "2",
      type: "generating",
      position: { x: 50 + spacing, y: 200 },
      data: { label: "Generating" },
      draggable: false,
    },
    {
      id: "3",
      type: "files",
      position: { x: 50 + spacing * 2, y: 200 },
      data: { label: "Get Files" },
      draggable: false,
    },
    {
      id: "4",
      type: "import",
      position: { x: 50 + spacing * 3, y: 200 },
      data: { label: "Import Files" },
      draggable: false,
    },
    {
      id: "5",
      type: "ready",
      position: { x: 50 + spacing * 4, y: 200 },
      data: { label: "Ready" },
      draggable: false,
    },
  ];
};

// Initial edges
const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    style: { stroke: "#22c55e", strokeWidth: 2 },
    animated: true,
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    style: { stroke: "#22c55e", strokeWidth: 2 },
    animated: true,
  },
  {
    id: "e3-4",
    source: "3",
    target: "4",
    style: { stroke: "#22c55e", strokeWidth: 2 },
    animated: true,
  },
  {
    id: "e4-5",
    source: "4",
    target: "5",
    style: { stroke: "#22c55e", strokeWidth: 2 },
    animated: true,
  },
];

export default function AIBuilderFlow() {
  const [isLocked, setIsLocked] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState(getInitialNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Check screen size and update mobile state
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const onConnect = useCallback(
    (params: Connection) => setEdges(eds => addEdge(params, eds)),
    [setEdges]
  );

  const toggleLock = () => {
    setIsLocked(!isLocked);
    // Update draggable property of existing nodes without changing positions
    setNodes(nds =>
      nds.map(node => ({
        ...node,
        draggable: isLocked, // Will be opposite of current state
      }))
    );
  };

  // Get responsive viewport settings
  const getViewportSettings = () => {
    if (isMobile) {
      return {
        translateExtent: [
          [-50, -100],
          [1200, 600],
        ] as [[number, number], [number, number]],
        nodeExtent: [
          [-25, 0],
          [1150, 500],
        ] as [[number, number], [number, number]],
        fitViewOptions: {
          padding: 0.05,
          minZoom: 0.4,
          maxZoom: 1.0,
        },
        minZoom: 0.3,
        maxZoom: 1.2,
      };
    } else {
      return {
        translateExtent: [
          [-200, -100],
          [2400, 600],
        ] as [[number, number], [number, number]],
        nodeExtent: [
          [-100, 0],
          [2300, 500],
        ] as [[number, number], [number, number]],
        fitViewOptions: {
          padding: 0.1,
          minZoom: 0.5,
          maxZoom: 1.2,
        },
        minZoom: 0.3,
        maxZoom: 1.5,
      };
    }
  };

  const viewportSettings = getViewportSettings();

  return (
    <div className="w-full h-full relative bg-background text-foreground rounded-2xl overflow-hidden">
      {/* Faded dot background supporting light and dark modes */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle, rgba(0,0,0,0.4) 1.2px, transparent 1.8px),
            radial-gradient(circle, rgba(255,255,255,0.35) 1.2px, transparent 1.8px)
          `,
          backgroundSize: "18px 18px",
          backgroundPosition: "center",
          maskImage:
            "radial-gradient(ellipse at center, black 0%, transparent 40%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 0%, transparent 40%)",
          mixBlendMode: "difference",
        }}
      ></div>

      {/* Custom Lock/Unlock Button */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
        <button
          onClick={toggleLock}
          className={cn(
            "flex items-center gap-1.5 text-thin sm:gap-2 px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg border transition-all duration-200",
            isLocked
              ? "bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              : "bg-green-500/20 border-green-500 text-green-400 hover:bg-green-500/30"
          )}
        >
          {isLocked ? (
            <>
              <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-thin">Locked</span>
            </>
          ) : (
            <>
              <Unlock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-medium">Unlocked</span>
            </>
          )}
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitViewOptions={viewportSettings.fitViewOptions}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        panOnScroll={false}
        panOnDrag={false}
        fitView={true}
        translateExtent={[
          [0, 0],
          [2000, 1000],
        ]}
        nodeExtent={[
          [0, 0],
          [2000, 1000],
        ]}
        minZoom={viewportSettings.minZoom}
        maxZoom={viewportSettings.maxZoom}
        className="bg-transparent"
        proOptions={{ hideAttribution: true }}
        nodesDraggable={!isLocked}
        nodesConnectable={!isLocked}
        elementsSelectable={!isLocked}
        preventScrolling={false}
      />
    </div>
  );
}
