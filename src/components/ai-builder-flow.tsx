import React, { useCallback, useState, useEffect } from 'react'
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  NodeProps,
  Handle,
  Position,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Download, FileText, Settings, CheckCircle, Bot, FolderOpen, Code, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

// Custom Node Components
const PromptNode = ({ data }: NodeProps) => {
  const [inputValue, setInputValue] = useState('')
  
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 min-w-[280px] shadow-2xl">
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-green-500 border-2 border-green-400" />
      
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-green-400" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-100">Prompt Your Idea</h3>
      </div>
      
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Describe your AI agent..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
        />
        <p className="text-xs text-zinc-500">Enter your requirements and let AI build your custom agent</p>
      </div>
    </div>
  )
}

const GeneratingNode = ({ data }: NodeProps) => {
  const [rotation, setRotation] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => prev + 2)
    }, 16)
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 min-w-[280px] shadow-2xl">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-green-500 border-2 border-green-400" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-green-500 border-2 border-green-400" />
      
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center">
          <Settings 
            className="w-5 h-5 text-green-400" 
            style={{ transform: `rotate(${rotation}deg)` }}
          />
        </div>
        <h3 className="text-lg font-semibold text-zinc-100">Generating Your Custom AI Agent</h3>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-zinc-400">Analyzing requirements...</span>
        </div>
        <div className="w-full bg-zinc-800 rounded-full h-2">
          <div className="bg-gradient-to-r from-green-600 to-green-400 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
        </div>
      </div>
    </div>
  )
}

const FilesNode = ({ data }: NodeProps) => {
  const files = [
    { name: '.env', icon: FileText, description: 'Environment variables' },
    { name: '.logic', icon: Code, description: 'Agent logic & behavior' },
    { name: '.demo', icon: Bot, description: 'Demo & examples' }
  ]
  
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 min-w-[280px] shadow-2xl">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-green-500 border-2 border-green-400" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-green-500 border-2 border-green-400" />
      
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center">
          <Download className="w-5 h-5 text-green-400" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-100">Get Files</h3>
      </div>
      
      <div className="space-y-2">
        {files.map((file, index) => (
          <div key={index} className="flex items-center gap-3 p-2 bg-zinc-800 rounded-lg hover:bg-zinc-750 transition-colors cursor-pointer group">
            <file.icon className="w-4 h-4 text-zinc-400 group-hover:text-green-400 transition-colors" />
            <div className="flex-1">
              <div className="text-sm font-medium text-zinc-200">{file.name}</div>
              <div className="text-xs text-zinc-500">{file.description}</div>
            </div>
            <Download className="w-4 h-4 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </div>
  )
}

const ImportNode = ({ data }: NodeProps) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 min-w-[280px] shadow-2xl">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-green-500 border-2 border-green-400" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-green-500 border-2 border-green-400" />
      
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center">
          <FolderOpen className="w-5 h-5 text-green-400" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-100">Import Files in Your Project</h3>
      </div>
      
      <div className="space-y-2">
        <div className="bg-zinc-800 rounded-lg p-3 font-mono text-xs">
          <div className="text-zinc-500 mb-2">📁 my-ai-project/</div>
          <div className="ml-4 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span className="text-zinc-300">.env</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span className="text-zinc-300">.logic</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span className="text-zinc-300">.demo</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-zinc-500">Files successfully imported to your project</p>
      </div>
    </div>
  )
}

const ReadyNode = ({ data }: NodeProps) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 min-w-[280px] shadow-2xl">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-green-500 border-2 border-green-400" />
      
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
          <CheckCircle className="w-5 h-5 text-green-400" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-100">Your Custom AI Agent is Ready</h3>
      </div>
      
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-green-500/25">
          <Bot className="w-8 h-8 text-white" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-sm font-medium text-green-400">Agent Deployed Successfully</span>
          </div>
          <p className="text-xs text-zinc-500">Your AI agent is now live and ready to use</p>
        </div>
      </div>
    </div>
  )
}

// Node types
const nodeTypes = {
  prompt: PromptNode,
  generating: GeneratingNode,
  files: FilesNode,
  import: ImportNode,
  ready: ReadyNode,
}

// Initial nodes
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'prompt',
    position: { x: 0, y: 200 },
    data: { label: 'Prompt Your Idea' },
  },
  {
    id: '2',
    type: 'generating',
    position: { x: 350, y: 200 },
    data: { label: 'Generating' },
  },
  {
    id: '3',
    type: 'files',
    position: { x: 700, y: 200 },
    data: { label: 'Get Files' },
  },
  {
    id: '4',
    type: 'import',
    position: { x: 1050, y: 200 },
    data: { label: 'Import Files' },
  },
  {
    id: '5',
    type: 'ready',
    position: { x: 1400, y: 200 },
    data: { label: 'Ready' },
  },
]

// Initial edges
const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    style: { stroke: '#22c55e', strokeWidth: 2 },
    animated: true,
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    style: { stroke: '#22c55e', strokeWidth: 2 },
    animated: true,
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    style: { stroke: '#22c55e', strokeWidth: 2 },
    animated: true,
  },
  {
    id: 'e4-5',
    source: '4',
    target: '5',
    style: { stroke: '#22c55e', strokeWidth: 2 },
    animated: true,
  },
]

export default function AIBuilderFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      {/* Center-faded dots background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)'
        }}
      />
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-transparent"
        proOptions={{ hideAttribution: true }}
      >
        <Controls 
          className="bg-zinc-900 border border-zinc-800 [&>button]:bg-zinc-800 [&>button]:border-zinc-700 [&>button]:text-zinc-300 [&>button:hover]:bg-zinc-700"
        />
      </ReactFlow>
    </div>
  )
}
