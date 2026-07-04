import { useState } from 'react';
import { useOSStore } from '../../../store/useOSStore';
import { fetchAIEvaluation } from '../../../services/api';
import { Settings, BarChart3, Sparkles, Loader2 } from 'lucide-react';

type TabType = 'properties' | 'analysis' | 'ai-tutor';

export default function RightPanel() {
  const [activeTab, setActiveTab] = useState<TabType>('analysis');
  const [aiText, setAiText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const { nodes, edges, analysis } = useOSStore();

  const handleAskAI = async () => {
    setIsLoading(true);
    setAiText('');
    try {
      const data = await fetchAIEvaluation(nodes, edges);
      setAiText(data.explanation);
    } catch (err) {
      setAiText('⚠️ Error: Could not connect to the local server. Make sure FastAPI is running on port 8000.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside className="w-80 border-l border-slate-200 bg-white flex flex-col h-full shadow-sm">
      {/* Tab Switcher Headers */}
      <div className="flex border-b border-slate-200 bg-slate-50">
        <TabButton active={activeTab === 'properties'} onClick={() => setActiveTab('properties')} icon={<Settings size={14} />} label="Props" />
        <TabButton active={activeTab === 'analysis'} onClick={() => setActiveTab('analysis')} icon={<BarChart3 size={14} />} label="Analysis" />
        <TabButton active={activeTab === 'ai-tutor'} onClick={() => setActiveTab('ai-tutor')} icon={<Sparkles size={14} />} label="AI Tutor" />
      </div>

      {/* Tab Viewport Contents */}
      <div className="flex-1 p-4 overflow-y-auto text-sm">
        {activeTab === 'properties' && (
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-700">Inspector Properties</h4>
            <p className="text-xs text-slate-400">Click any individual node on the canvas to configure its properties here.</p>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-700">State Matrix Breakdown</h4>
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Deadlocked:</span>
                <span className={`font-bold ${analysis.hasDeadlock ? 'text-red-600' : 'text-green-600'}`}>
                  {analysis.hasDeadlock ? 'YES' : 'NO'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cycle Length:</span>
                <span className="font-semibold text-slate-800">{analysis.cycleNodes.length} nodes</span>
              </div>
            </div>

            {analysis.hasDeadlock && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-800 rounded-lg text-xs space-y-1">
                <p className="font-bold">Nodes Stuck in Dependency Chain:</p>
                <p className="font-mono bg-white p-1.5 rounded border border-red-200 text-slate-700">
                  {analysis.cycleNodes.join(' ➔ ')}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'ai-tutor' && (
          <div className="space-y-4 h-full flex flex-col">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-700">AI Teaching Assistant</h4>
              <button
                onClick={handleAskAI}
                disabled={isLoading}
                className="flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium px-2.5 py-1 rounded transition-colors shadow-sm"
              >
                {isLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                Explain
              </button>
            </div>

            <div className="flex-1 border border-slate-100 bg-slate-50 rounded-lg p-3 overflow-y-auto text-xs whitespace-pre-wrap leading-relaxed text-slate-600">
              {aiText ? aiText : "Draw a graph on the canvas and click 'Explain' to unlock complete tailored breakdown mechanisms."}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

interface TabBtnProps { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; }
function TabButton({ active, onClick, icon, label }: TabBtnProps) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold border-b-2 transition-all ${
        active 
          ? 'border-blue-600 text-blue-600 bg-white' 
          : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}