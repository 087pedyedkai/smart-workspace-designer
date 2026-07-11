import React from 'react';

const WorkspaceCanvas: React.FC = () => {
  return (
    <main className="flex-1 bg-slate-100 p-6 flex flex-col h-full overflow-hidden">
      <div className="flex-1 bg-white border-2 border-slate-300 rounded-lg flex items-center justify-center shadow-inner relative">
        <p className="text-slate-400 text-xl font-medium select-none">
          Workspace Canvas
        </p>
      </div>
    </main>
  );
};

export default WorkspaceCanvas;