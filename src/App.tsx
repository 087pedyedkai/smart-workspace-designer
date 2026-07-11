import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import WorkspaceCanvas from './components/WorkspaceCanvas';
import AnalysisPanel from './components/AnalysisPanel';

const App: React.FC = () => {
  return (
    <div className="flex flex-col h-screen w-full bg-slate-100 overflow-hidden font-sans">
      <Header />
      <div className="flex flex-1 w-full overflow-hidden">
        <Sidebar />
        <WorkspaceCanvas />
        <AnalysisPanel />
      </div>
    </div>
  );
};

export default App;