import { ReactFlowProvider } from '@xyflow/react';
import Toolbar from '../components/Canvas/Layout/toolBar';
import Sidebar from '../components/Canvas/Layout/sideBar';
import RightPanel from '../components/Canvas/Layout/rightPanel';
import StatusBar from '../components/Canvas/Layout/statusBar';
import SimulatorCanvas from '../components/Canvas/SimulatorCanvas';

export default function DeadlockSimulator() {
  return (
    <div className="flex h-screen w-screen flex-col bg-slate-50 text-slate-900 overflow-hidden font-sans">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="relative flex-1">
          <ReactFlowProvider>
            <SimulatorCanvas />
          </ReactFlowProvider>
        </main>
        <RightPanel />
      </div>
      <StatusBar />
    </div>
  );
}