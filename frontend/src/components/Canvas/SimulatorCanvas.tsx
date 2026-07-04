import { useCallback, useRef } from 'react';
import { ReactFlow, Background, Controls, MiniMap, Panel, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useOSStore } from '../../store/useOSStore';
import { nodeTypes } from './Nodes';

export default function SimulatorCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, analysis, addNode } = useOSStore();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow') as 'process' | 'resource';
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNode(type, position);
    },
    [screenToFlowPosition, addNode]
  );

  return (
    <div className="h-full w-full bg-slate-50" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        fitView
      >
        <Background gap={16} color="#e2e8f0" />
        <Controls />
        <MiniMap zoomable pannable />

        <Panel position="top-center">
          {analysis.hasDeadlock && analysis.cycleNodes.length > 0 ? (
            <div className="rounded-md bg-red-500 px-6 py-2 text-white font-bold shadow-lg animate-pulse">
              DEADLOCK DETECTED
            </div>
          ) : nodes.length > 0 ? (
            <div className="rounded-md bg-green-500 px-6 py-2 text-white font-bold shadow-lg">
              SAFE STATE
            </div>
          ) : null}
        </Panel>
      </ReactFlow>
    </div>
  );
}
