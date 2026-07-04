import type { Node, Edge } from '@xyflow/react';

export interface CycleResult {
  hasDeadlock: boolean;
  cycleNodes: string[];
  safeNodes: string[];
}

export const detectDeadlock = (nodes: Node[], edges: Edge[]): CycleResult => {
  const adjList: Record<string, string[]> = {};
  
  // Initialize adjacency list
  nodes.forEach((n) => (adjList[n.id] = []));
  edges.forEach((e) => {
    if (adjList[e.source]) {
      adjList[e.source].push(e.target);
    }
  });

  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  let cycleNodes = new Set<string>();
  let hasDeadlock = false;

  const dfs = (node: string, path: string[]): boolean => {
    visited.add(node);
    recursionStack.add(node);
    path.push(node);

    for (const neighbor of adjList[node]) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor, [...path])) return true;
      } else if (recursionStack.has(neighbor)) {
        // Cycle detected
        hasDeadlock = true;
        const cycleStartIndex = path.indexOf(neighbor);
        const cycle = path.slice(cycleStartIndex);
        cycle.forEach((n) => cycleNodes.add(n));
        return true;
      }
    }

    recursionStack.delete(node);
    return false;
  };

  // Run DFS from all unvisited nodes
  for (const node of nodes) {
    if (!visited.has(node.id)) {
      dfs(node.id, []);
    }
  }

  const safeNodes = nodes
    .filter((n) => !cycleNodes.has(n.id))
    .map((n) => n.id);

  return {
    hasDeadlock,
    cycleNodes: Array.from(cycleNodes),
    safeNodes,
  };
};

// export default class deadLockDetection{}