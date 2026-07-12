//App.tsx
import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import WorkspaceCanvas from './components/WorkspaceCanvas';
import AnalysisPanel from './components/AnalysisPanel';
import { workspaceObjects as defaultWorkspaceObjects } from './data/workspaceObjects';
import { analyzeWorkspace } from './utils/workspaceAnalyzer';
import type { DeskBounds } from './utils/workspaceAnalyzer';
import type { WorkspaceObject } from './types/workspace';

const defaultAnalysis = {
  workspaceScore: 100,
  ergonomicScore: 100,
  comfortScore: 100,
  suggestions: [] as string[],
};

const App: React.FC = () => {
  const [objects, setObjects] = useState(defaultWorkspaceObjects);
  const [deskBounds, setDeskBounds] = useState<DeskBounds | null>(null);
  const [deskSize, setDeskSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const analysis = deskBounds ? analyzeWorkspace(objects, deskBounds) : defaultAnalysis;
  const selectedObject = objects.find((obj) => obj.id === selectedObjectId) ?? null;

  const deskSizes = {
    small: { width: 700, height: 400 },
    medium: { width: 900, height: 500 },
    large: { width: 1100, height: 600 },
  };

  const handleAddObject = (type: string) => {
    setObjects((prevObjects) => {
      if (prevObjects.some((obj) => obj.type === type)) {
        return prevObjects;
      }

      const sizeMap: Record<string, { width: number; height: number }> = {
        Monitor: { width: 240, height: 120 },
        Laptop: { width: 180, height: 120 },
        Keyboard: { width: 300, height: 80 },
        Mouse: { width: 70, height: 90 },
        Chair: { width: 160, height: 160 },
        'Desk Lamp': { width: 90, height: 90 },
        Speaker: { width: 90, height: 120 },
      };

      const size = sizeMap[type] ?? { width: 120, height: 120 };
      const selectedDesk = deskSizes[deskSize];
      const x = Math.max(20, Math.round(selectedDesk.width / 2 - size.width / 2));
      const y = Math.max(20, Math.round(selectedDesk.height / 2 - size.height / 2));

      const newObject: WorkspaceObject = {
        id: `obj-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type,
        x,
        y,
        width: size.width,
        height: size.height,
      };

      return [...prevObjects, newObject];
    });
  };

  const handleRemoveObject = (type: string) => {
    setObjects((prevObjects) => prevObjects.filter((obj) => obj.type !== type));
  };

  useEffect(() => {
    if (selectedObjectId && !objects.some((obj) => obj.id === selectedObjectId)) {
      setSelectedObjectId(null);
    }
  }, [objects, selectedObjectId]);

  return (
    <div className="flex flex-col h-screen w-full bg-slate-100 overflow-hidden font-sans">
      <Header />
      <div className="flex flex-1 w-full overflow-hidden">
        <Sidebar
          objects={objects}
          onAddObject={handleAddObject}
          onRemoveObject={handleRemoveObject}
        />
        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-end border-b border-slate-200 bg-white px-4 py-2">
            <label className="mr-2 text-sm font-medium text-slate-600" htmlFor="desk-size">
              Desk size:
            </label>
            <select
              id="desk-size"
              value={deskSize}
              onChange={(e) => setDeskSize(e.target.value as 'small' | 'medium' | 'large')}
              className="rounded border border-slate-300 bg-white px-2 py-1 text-sm text-slate-700"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          <WorkspaceCanvas
            objects={objects}
            selectedObject={selectedObject}
            onSelectObject={setSelectedObjectId}
            setObjects={setObjects}
            onDeskBoundsChange={setDeskBounds}
            deskSize={deskSizes[deskSize]}
          />
        </div>
        <AnalysisPanel analysis={analysis} />
      </div>
    </div>
  );
};

export default App;