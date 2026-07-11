import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import WorkspaceCanvas from './components/WorkspaceCanvas';
import AnalysisPanel from './components/AnalysisPanel';
import { workspaceObjects as defaultWorkspaceObjects } from './data/workspaceObjects';
import { analyzeWorkspace } from './utils/workspaceAnalyzer';
import type { DeskBounds } from './utils/workspaceAnalyzer';

const defaultAnalysis = {
  workspaceScore: 100,
  ergonomicScore: 100,
  comfortScore: 100,
  suggestions: [] as string[],
};

const App: React.FC = () => {
  const [objects, setObjects] = useState(defaultWorkspaceObjects);
  const [deskBounds, setDeskBounds] = useState<DeskBounds | null>(null);
  const analysis = deskBounds ? analyzeWorkspace(objects, deskBounds) : defaultAnalysis;

  return (
    <div className="flex flex-col h-screen w-full bg-slate-100 overflow-hidden font-sans">
      <Header />
      <div className="flex flex-1 w-full overflow-hidden">
        <Sidebar />
        <WorkspaceCanvas objects={objects} setObjects={setObjects} onDeskBoundsChange={setDeskBounds} />
        <AnalysisPanel analysis={analysis} />
      </div>
    </div>
  );
};

export default App;