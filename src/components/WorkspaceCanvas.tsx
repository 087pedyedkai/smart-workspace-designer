// src/components/WorkspaceCanvas.tsx
import React from 'react';
import { workspaceObjects } from '../data/workspaceObjects';

const WorkspaceCanvas: React.FC = () => {
  const objects = workspaceObjects;

  return (
    <main className="flex-1 bg-slate-100 p-6 flex flex-col h-full overflow-hidden">
      <div className="flex-1 bg-white border-2 border-slate-300 rounded-lg flex items-center justify-center shadow-inner relative overflow-hidden">
        {objects.length === 0 ? (
          <p className="text-slate-400 text-xl font-medium select-none">
            Workspace Canvas
          </p>
        ) : (
          objects.map((obj) => (
            <div
              key={obj.id}
              className="absolute bg-white border border-slate-200 rounded shadow-sm flex items-center justify-center cursor-default text-sm text-slate-700 font-medium select-none"
              style={{
                left: `${obj.x}px`,
                top: `${obj.y}px`,
                width: `${obj.width}px`,
                height: `${obj.height}px`,
              }}
            >
              {obj.type}
            </div>
          ))
        )}
      </div>
    </main>
  );
};

export default WorkspaceCanvas;