import { useOSStore } from '../../../store/useOSStore';

export default function StatusBar() {
  const nodes = useOSStore(state => state.nodes);
  const edges = useOSStore(state => state.edges);
  const analysis = useOSStore(state => state.analysis);

  const stats = {
    processes: nodes.filter(n => n.type === 'process').length,
    resources: nodes.filter(n => n.type === 'resource').length,
    edges: edges.length,
    hasDeadlock: analysis.hasDeadlock,
  };

  return (
    <footer className="flex h-8 items-center justify-between border-t border-slate-200 bg-white px-4 text-xs font-medium text-slate-500">
      <div className="flex gap-6">
        <span>Processes: <strong className="text-slate-800">{stats.processes}</strong></span>
        <span>Resources: <strong className="text-slate-800">{stats.resources}</strong></span>
        <span>Edges: <strong className="text-slate-800">{stats.edges}</strong></span>
      </div>
      <div className="flex items-center gap-4">
        <span>
          State: {stats.hasDeadlock ? (
            <strong className="text-red-600">Deadlocked</strong>
          ) : (
            <strong className="text-green-600">Safe</strong>
          )}
        </span>
        <div className="h-4 w-px bg-slate-300" />
        <span>Canvas: 100%</span>
      </div>
    </footer>
  );
}