import { Handle, Position } from '@xyflow/react';

export const ProcessNode = ({ data }: { data: { label: string } }) => (
  <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-blue-600 bg-blue-100 text-blue-900 font-bold shadow-md transition-all">
    <Handle type="target" position={Position.Top} className="!bg-blue-600" />
    {data.label}
    <Handle type="source" position={Position.Bottom} className="!bg-blue-600" />
  </div>
);

export const ResourceNode = ({ data }: { data: { label: string } }) => (
  <div className="flex h-16 w-16 items-center justify-center rounded-md border-2 border-green-600 bg-green-100 text-green-900 font-bold shadow-md transition-all">
    <Handle type="target" position={Position.Top} className="!bg-green-600" />
    {data.label}
    <Handle type="source" position={Position.Bottom} className="!bg-green-600" />
  </div>
);

export const nodeTypes = {
  process: ProcessNode,
  resource: ResourceNode,
};