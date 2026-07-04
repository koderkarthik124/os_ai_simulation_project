import { 
  MousePointer2, ArrowRight, Trash2, Undo, Redo, 
  RotateCcw, Play, Download, Upload 
} from 'lucide-react';
import { useOSStore } from '../../../store/useOSStore';

export default function Toolbar() {
  const { resetCanvas, analyzeGraph } = useOSStore();

  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white font-bold">
          OS
        </div>
        <span className="text-lg font-semibold text-slate-800">Deadlock Simulator</span>
      </div>

      <div className="flex items-center gap-1 border-x border-slate-200 px-4">
        <ToolButton icon={<MousePointer2 size={18} />} label="Select" active />
        <ToolButton icon={<ArrowRight size={18} className="text-blue-600" />} label="Request Edge" />
        <ToolButton icon={<ArrowRight size={18} className="text-orange-500" />} label="Allocation Edge" />
        <div className="mx-2 h-6 w-px bg-slate-200" />
        <ToolButton icon={<Trash2 size={18} />} label="Delete" />
        <ToolButton icon={<Undo size={18} />} label="Undo" />
        <ToolButton icon={<Redo size={18} />} label="Redo" />
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={resetCanvas}
          className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <RotateCcw size={16} /> Reset
        </button>
        <button className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
          <Download size={16} /> Export
        </button>
        <button className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
          <Upload size={16} /> Import
        </button>
        <button 
          onClick={analyzeGraph}
          className="ml-2 flex items-center gap-2 rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          <Play size={16} /> Analyze
        </button>
      </div>
    </header>
  );
}

function ToolButton({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button 
      title={label}
      className={`p-2 rounded-md transition-colors ${active ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-100'}`}
    >
      {icon}
    </button>
  );
}