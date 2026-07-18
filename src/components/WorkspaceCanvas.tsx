import { useEffect, useRef, useState } from 'react';
import type { WorkspaceObject } from '../types/workspace';
import type { DeskBounds } from '../utils/workspaceAnalyzer';

interface WorkspaceCanvasProps {
  objects: WorkspaceObject[];
  selectedObject: WorkspaceObject | null;
  onSelectObject: (id: string | null) => void;
  setObjects: React.Dispatch<React.SetStateAction<WorkspaceObject[]>>;
  onDeskBoundsChange: (bounds: DeskBounds) => void;
  deskSize: { width: number; height: number };
}

const SCALE = 5; 

const getIcon = (type: string) => {
  const icons: Record<string, string> = {
    Monitor: '🖥️', Laptop: '💻', Keyboard: '⌨️', Mouse: '🖱️',
    Chair: '🪑', 'Desk Lamp': '💡', Speaker: '🔊'
  };
  return icons[type] || '📦';
};

export default function WorkspaceCanvas({ objects, selectedObject, onSelectObject, setObjects, onDeskBoundsChange, deskSize }: WorkspaceCanvasProps) {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const deskRef = useRef<HTMLDivElement | null>(null);
  const [draggedObjectId, setDraggedObjectId] = useState<string | null>(null);
  const [dragOffsetX, setDragOffsetX] = useState<number>(0);
  const [dragOffsetY, setDragOffsetY] = useState<number>(0);

  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, obj: WorkspaceObject) => {
    e.preventDefault();
    onSelectObject(obj.id);
    
    const rect = deskRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDraggedObjectId(obj.id);
    setDragOffsetX(e.clientX - rect.left - (obj.x * SCALE));
    setDragOffsetY(e.clientY - rect.top - (obj.y * SCALE));
  };

  useEffect(() => {
    const measureDesk = () => {
      onDeskBoundsChange({
        x: 0,
        y: 0,
        width: deskSize.width,
        height: deskSize.height,
      });
    };

    const timer = setTimeout(measureDesk, 50);
    window.addEventListener('resize', measureDesk);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', measureDesk);
    };
  }, [onDeskBoundsChange, deskSize]);

  useEffect(() => {
    if (!draggedObjectId) return;

    const handleWindowMouseMove = (e: MouseEvent) => {
      const rect = deskRef.current?.getBoundingClientRect();
      if (!rect) return; // ไม่ต้องอิงขนาด Canvas อีกต่อไป

      setObjects((prevObjects) =>
        prevObjects.map((obj) => {
          if (obj.id !== draggedObjectId) return obj;

          const rawX = (e.clientX - rect.left - dragOffsetX) / SCALE;
          const rawY = (e.clientY - rect.top - dragOffsetY) / SCALE;
          
          // 🛠️ FIX 1: ปลดล็อคระยะการลาก ให้ลากออกนอกโต๊ะได้อย่างอิสระ
          // กำหนดให้ลากออกไปด้านข้างได้ 100cm และด้านล่างเผื่อให้ดึงเก้าอี้ออกได้ถึง 150cm
          const minX = -100;
          const minY = -100;
          const maxX = deskSize.width + 100;
          const maxY = deskSize.height + 150;

          return { ...obj, x: clamp(rawX, minX, maxX), y: clamp(rawY, minY, maxY) };
        })
      );
    };

    const handleWindowMouseUp = () => setDraggedObjectId(null);

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [draggedObjectId, dragOffsetX, dragOffsetY, setObjects, deskSize]);

  const xTicks = Array.from({ length: Math.floor(deskSize.width / 20) + 1 }).map((_, i) => i * 20);
  const yTicks = Array.from({ length: Math.floor(deskSize.height / 20) + 1 }).map((_, i) => i * 20);

  return (
    <div ref={canvasRef} className="relative w-full h-full bg-slate-50 border-t border-slate-200 overflow-hidden">
      
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: deskSize.width * SCALE, height: deskSize.height * SCALE }}
      >
        <div className="absolute -top-8 left-0 w-full h-8 border-b border-slate-300">
          {xTicks.map((tick) => (
            <div key={`x-${tick}`} className="absolute h-2 border-l border-slate-400 bottom-0" style={{ left: tick * SCALE }}>
              <span className="absolute bottom-3 -translate-x-1/2 text-[10px] font-medium text-slate-500">{tick}</span>
            </div>
          ))}
        </div>

        <div className="absolute top-0 -left-10 h-full w-10 border-r border-slate-300">
          {yTicks.map((tick) => (
            <div key={`y-${tick}`} className="absolute w-2 border-t border-slate-400 right-0" style={{ top: tick * SCALE }}>
              <span className="absolute right-4 -translate-y-1/2 text-[10px] font-medium text-slate-500">{tick}</span>
            </div>
          ))}
        </div>

        <div
          ref={deskRef}
          className="absolute inset-0 rounded-lg bg-gradient-to-br from-amber-700 via-amber-600 to-amber-800 border-2 border-amber-900 shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
        />

        {objects.map((obj) => {
          const isChair = obj.type === 'Chair';

          return (
            <div
              key={obj.id}
              onMouseDown={(e) => handleMouseDown(e, obj)}
              style={{
                position: 'absolute',
                left: obj.x * SCALE,
                top: obj.y * SCALE,
                width: obj.width * SCALE,
                height: obj.height * SCALE,
              }}
              className={`flex flex-col items-center justify-center border-2 rounded-md select-none transition duration-150 ${
                selectedObject?.id === obj.id
                  ? 'border-blue-500 bg-blue-100/90 shadow-xl z-40 ring-4 ring-blue-500/20'
                  : isChair
                    ? 'border-transparent bg-transparent z-10' /* 🛠️ FIX 2: ปลดกล่องสีขาวออก ให้เก้าอี้โปร่งใส */
                    : 'border-slate-300 bg-slate-100/90 shadow-md hover:bg-white hover:border-slate-400 backdrop-blur-sm z-20'
              } ${draggedObjectId === obj.id ? 'cursor-grabbing z-50 scale-105' : 'cursor-grab'}`}
            >
              {/* ขยายไอคอนเก้าอี้ให้ใหญ่สมจริงขึ้น */}
              <span className={`${isChair ? 'text-[70px] drop-shadow-xl' : 'text-2xl drop-shadow-sm'} pointer-events-none`}>
                {getIcon(obj.type)}
              </span>
              <span className="text-[10px] font-bold text-slate-800 pointer-events-none leading-tight mt-1 px-1.5 py-0.5 bg-white/80 rounded shadow-sm">
                {obj.type}
              </span>
              
              {selectedObject?.id === obj.id && (
                <span className="text-[9px] font-semibold text-blue-800 pointer-events-none mt-0.5 px-1 bg-blue-200/90 rounded">
                  {obj.width} × {obj.height} cm
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}