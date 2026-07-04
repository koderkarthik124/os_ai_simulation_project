import { Circle, Square } from 'lucide-react';

export default function Sidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: 'process' | 'resource') => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 border-r border-slate-200 bg-white p-4 flex flex-col gap-6">
      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Nodes</h3>
        <div className="flex flex-col gap-3">
          <div 
            className="flex cursor-grab items-center gap-3 rounded-md border border-slate-200 p-3 hover:border-blue-400 hover:bg-blue-50 transition-colors active:cursor-grabbing"
            draggable
            onDragStart={(e) => onDragStart(e, 'process')}
          >
            <Circle className="text-blue-500 fill-blue-100" size={24} />
            <div>
              <p className="text-sm font-medium text-slate-700">Process Node</p>
              <p className="text-xs text-slate-400">Drag to add (P)</p>
            </div>
          </div>

          <div 
            className="flex cursor-grab items-center gap-3 rounded-md border border-slate-200 p-3 hover:border-green-400 hover:bg-green-50 transition-colors active:cursor-grabbing"
            draggable
            onDragStart={(e) => onDragStart(e, 'resource')}
          >
            <Square className="text-green-600 fill-green-100" size={24} />
            <div>
              <p className="text-sm font-medium text-slate-700">Resource Node</p>
              <p className="text-xs text-slate-400">Drag to add (R)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto border-t border-slate-200 pt-4">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Auto Generate</h3>
        <div className="flex gap-2 mb-2">
          <input type="number" placeholder="Procs" className="w-full rounded-md border border-slate-300 p-1.5 text-sm" min={1} max={10} />
          <input type="number" placeholder="Res" className="w-full rounded-md border border-slate-300 p-1.5 text-sm" min={1} max={10} />
        </div>
        <button className="w-full rounded-md bg-slate-800 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors">
          Generate Graph
        </button>
      </div>
    </aside>
  );
}