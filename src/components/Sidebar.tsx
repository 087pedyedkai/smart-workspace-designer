//Sidebar.tsx
import React from 'react';
import { workspaceObjects } from '../data/workspaceObjects';
import type { WorkspaceObject } from '../types/workspace';

interface SidebarProps {
  objects: WorkspaceObject[];
  onAddObject: (type: string) => void;
  onRemoveObject: (type: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ objects, onAddObject, onRemoveObject }) => {
  const hasObject = (type: string) => objects.some((obj) => obj.type === type);

  return (
    <aside className="w-[240px] bg-slate-50 border-r border-slate-200 h-full flex flex-col shrink-0 overflow-y-auto">
      <div className="p-4 border-b border-slate-200">
        <h2 className="font-semibold text-slate-700">Objects</h2>
      </div>
      <ul className="p-4 flex flex-col gap-3">
        {workspaceObjects.map((obj) => {
          const exists = hasObject(obj.type);

          return (
            <li key={obj.id}>
              <div className="flex items-center gap-2 rounded border border-slate-300 bg-white p-3 shadow-sm">
                <span className="flex-1 text-sm text-slate-700">{obj.type}</span>
                <button
                  type="button"
                  onClick={() => (exists ? onRemoveObject(obj.type) : onAddObject(obj.type))}
                  className={`rounded px-2 py-1 text-xs font-medium transition ${
                    exists
                      ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  }`}
                >
                  {exists ? 'Remove' : 'Add'}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;