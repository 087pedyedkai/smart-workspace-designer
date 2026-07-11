import React, { useEffect, useRef, useState } from 'react';
import type { WorkspaceObject } from '../types/workspace';
import { workspaceObjects as defaultWorkspaceObjects } from '../data/workspaceObjects';

export default function WorkspaceCanvas() {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [objects, setObjects] = useState<WorkspaceObject[]>(defaultWorkspaceObjects);
  const [draggedObjectId, setDraggedObjectId] = useState<string | null>(null);
  const [dragOffsetX, setDragOffsetX] = useState<number>(0);
  const [dragOffsetY, setDragOffsetY] = useState<number>(0);

  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, obj: WorkspaceObject) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDraggedObjectId(obj.id);
    setDragOffsetX(e.clientX - rect.left - obj.x);
    setDragOffsetY(e.clientY - rect.top - obj.y);
  };

  useEffect(() => {
    if (!draggedObjectId) return;

    const handleWindowMouseMove = (e: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      setObjects((prevObjects) =>
        prevObjects.map((obj) => {
          if (obj.id !== draggedObjectId) return obj;

          const rawX = e.clientX - rect.left - dragOffsetX;
          const rawY = e.clientY - rect.top - dragOffsetY;
          const maxX = Math.max(rect.width - obj.width, 0);
          const maxY = Math.max(rect.height - obj.height, 0);

          return {
            ...obj,
            x: clamp(rawX, 0, maxX),
            y: clamp(rawY, 0, maxY),
          };
        })
      );
    };

    const handleWindowMouseUp = () => {
      setDraggedObjectId(null);
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [draggedObjectId, dragOffsetX, dragOffsetY]);

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full bg-white border-2 border-slate-200 rounded-xl shadow-md p-4 overflow-hidden"
    >
      {objects.map((obj) => (
        <div
          key={obj.id}
          onMouseDown={(e) => handleMouseDown(e, obj)}
          style={{
            position: 'absolute',
            left: obj.x,
            top: obj.y,
            width: obj.width,
            height: obj.height,
          }}
          className={`flex items-center justify-center border-2 border-slate-300 bg-slate-50 shadow-sm rounded-md select-none transition-shadow duration-150 ${
            draggedObjectId === obj.id
              ? 'cursor-grabbing shadow-lg z-50 ring-2 ring-blue-400 ring-offset-1'
              : 'cursor-grab hover:shadow-md'
          }`}
        >
          <span className="text-sm font-semibold text-slate-700 pointer-events-none capitalize">
            {obj.type}
          </span>
        </div>
      ))}
    </div>
  );
}