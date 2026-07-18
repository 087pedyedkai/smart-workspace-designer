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

  // แก้ไข deskSizes ให้ตรงตาม SPEC (cm)
  const deskSizes = {
    small: { width: 120, height: 60 },
    medium: { width: 140, height: 70 },
    large: { width: 160, height: 80 },
  };

  const handleAddObject = (type: string) => {
    setObjects((prevObjects) => {
      if (prevObjects.some((obj) => obj.type === type)) return prevObjects;

      // แก้ไข sizeMap เป็นขนาด cm โดยประมาณ
      const sizeMap: Record<string, { width: number; height: number }> = {
        Monitor: { width: 60, height: 20 },
        Laptop: { width: 35, height: 25 },
        Keyboard: { width: 45, height: 15 },
        Mouse: { width: 10, height: 15 },
        Chair: { width: 60, height: 60 },
        'Desk Lamp': { width: 15, height: 15 },
        Speaker: { width: 10, height: 15 },
      };

      const size = sizeMap[type] ?? { width: 20, height: 20 };
      const selectedDesk = deskSizes[deskSize];
      
      // จัดให้อยู่กลางจอ (หน่วยเป็น cm)
      const x = Math.max(0, Math.round(selectedDesk.width / 2 - size.width / 2) + 20); // +20 เพื่อขยับจากขอบ
      const y = Math.max(0, Math.round(selectedDesk.height / 2 - size.height / 2) + 20);

      const newObject: WorkspaceObject = {
        id: `obj-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type, x, y, width: size.width, height: size.height,
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
              ขนาดโต๊ะ:
            </label>
            <select
              id="desk-size"
              value={deskSize}
              onChange={(e) => setDeskSize(e.target.value as 'small' | 'medium' | 'large')}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="small">120 × 60 cm</option>
              <option value="medium">140 × 70 cm</option>
              <option value="large">160 × 80 cm</option>
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