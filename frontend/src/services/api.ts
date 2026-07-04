import type { Node, Edge } from '@xyflow/react';

const API_BASE = 'http://localhost:8000/api';

export async function fetchAIEvaluation(nodes: Node[], edges: Edge[]) {
  const cleanNodes = nodes.map(n => ({ id: n.id, type: n.type || 'process', data: n.data }));
  const cleanEdges = edges.map(e => ({ id: e.id, source: e.source, target: e.target }));

  const response = await fetch(`${API_BASE}/analyze-deadlock`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nodes: cleanNodes, edges: cleanEdges }),
  });

  if (!response.ok) {
    throw new Error('Could not contact the analysis engine server.');
  }
  return response.json();
}