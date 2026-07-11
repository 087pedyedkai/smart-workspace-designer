import React, { useEffect, useRef, useState } from 'react';
import type { WorkspaceObject } from '../types/workspace';
import type { DeskBounds } from '../utils/workspaceAnalyzer';

interface WorkspaceCanvasProps {
  objects: WorkspaceObject[];
  setObjects: React.Dispatch<React.SetStateAction<WorkspaceObject[]>>;
  onDeskBoundsChange: (bounds: DeskBounds) => void;
}

export default function WorkspaceCanvas({ objects, setObjects, onDeskBoundsChange }: WorkspaceCanvasProps) {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const deskRef = useRef<HTMLDivElement | null>(null);
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
    const measureDesk = () => {
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      const deskRect = deskRef.current?.getBoundingClientRect();
      if (!canvasRect || !deskRect) return;

      onDeskBoundsChange({
        x: deskRect.left - canvasRect.left,
        y: deskRect.top - canvasRect.top,
        width: deskRect.width,
        height: deskRect.height,
      });
    };

    measureDesk();
    window.addEventListener('resize', measureDesk);

    return () => {
      window.removeEventListener('resize', measureDesk);
    };
  }, [onDeskBoundsChange]);

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
      <div
        ref={deskRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-amber-200 border border-amber-300 shadow-sm"
        style={{ width: 900, height: 500, maxWidth: '90%', maxHeight: '80%' }}
      />
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