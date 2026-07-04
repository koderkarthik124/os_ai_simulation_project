import { create } from 'zustand';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import type {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from '@xyflow/react';
import { detectDeadlock } from '../algorithms/deadLockDetection';
import type { CycleResult } from '../algorithms/deadLockDetection';

export interface OSState {
  nodes: Node[];
  edges: Edge[];
  analysis: CycleResult;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (type: 'process' | 'resource', position: { x: number; y: number }) => void;
  analyzeGraph: () => void;
  resetCanvas: () => void;
  getStats: () => { processes: number; resources: number; edges: number; hasDeadlock: boolean };
}

const initialAnalysis: CycleResult = { hasDeadlock: false, cycleNodes: [], safeNodes: [] };

export const useOSStore = create<OSState>((set, get) => ({
  nodes: [],
  edges: [],
  analysis: initialAnalysis,
  
  onNodesChange: (changes: NodeChange[]) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
    get().analyzeGraph();
  },
  
  onEdgesChange: (changes: EdgeChange[]) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
    get().analyzeGraph();
  },
  
  onConnect: (connection: Connection) => {
    const { nodes, edges } = get();
    const sourceNode = nodes.find(n => n.id === connection.source);
    const targetNode = nodes.find(n => n.id === connection.target);

    // Rule: Reject P->P or R->R
    if (sourceNode?.type === targetNode?.type) return;

    const isRequest = sourceNode?.type === 'process';
    
    const newEdge: Edge = {
      ...connection,
      id: `e${connection.source}-${connection.target}`,
      type: 'straight',
      animated: true,
      style: { 
        stroke: isRequest ? '#3b82f6' : '#f97316', // Blue for Request, Orange for Allocation
        strokeWidth: 2 
      }, 
    };
    
    set({ edges: addEdge(newEdge, edges) });
    get().analyzeGraph();
  },

  addNode: (type, position) => {
    const { nodes } = get();
    const id = `${type.charAt(0).toUpperCase()}${nodes.filter(n => n.type === type).length + 1}`;
    
    const newNode: Node = {
      id,
      type,
      position,
      data: { label: id },
    };
    
    set({ nodes: [...nodes, newNode] });
  },

  analyzeGraph: () => {
    const { nodes, edges } = get();
    const result = detectDeadlock(nodes, edges);
    
    // Update node styles based on analysis
    const updatedNodes = nodes.map(node => ({
      ...node,
      style: {
        ...node.style,
        boxShadow: result.cycleNodes.includes(node.id) 
          ? '0 0 15px 5px rgba(239, 68, 68, 0.6)' // Red glow for deadlock
          : result.hasDeadlock ? 'none' : '0 0 10px 2px rgba(34, 197, 94, 0.4)' // Green glow if safe
      }
    }));

    set({ analysis: result, nodes: updatedNodes });
  },

  resetCanvas: () => {
    set({ nodes: [], edges: [], analysis: initialAnalysis });
  },

  getStats: () => {
    const { nodes, edges, analysis } = get();
    return {
      processes: nodes.filter(n => n.type === 'process').length,
      resources: nodes.filter(n => n.type === 'resource').length,
      edges: edges.length,
      hasDeadlock: analysis.hasDeadlock
    };
  },
}));