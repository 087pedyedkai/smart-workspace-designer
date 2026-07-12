import React, { useEffect, useRef, useState } from 'react';
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
        style={{ width: deskSize.width, height: deskSize.height, maxWidth: '90%', maxHeight: '80%' }}
      >
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-[40%] w-[40%] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-green-300/30" />
          <div className="absolute left-1/2 top-1/2 h-[65%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-yellow-300/40 bg-yellow-300/25" />
          <div className="absolute inset-4 rounded-[1.5rem] border border-red-300/30 bg-red-300/20" />
        </div>
      </div>
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
          className={`flex items-center justify-center border-2 rounded-md select-none transition-shadow duration-150 ${
            selectedObject?.id === obj.id
              ? 'border-blue-500 bg-blue-50 shadow-lg z-40 ring-2 ring-blue-400 ring-offset-1'
              : 'border-slate-300 bg-slate-50 shadow-sm'
          } ${
            draggedObjectId === obj.id
              ? 'cursor-grabbing z-50'
              : 'cursor-grab hover:shadow-md'
          }`}
        >
          <span className="text-sm font-semibold text-slate-700 pointer-events-none capitalize">
            {obj.type}
          </span>
        </div>
      ))}
      <div className="absolute bottom-4 right-4 w-64 rounded-xl border border-slate-200 bg-white/95 p-3 shadow-sm">
        {objects.length === 0 ? (
          <p className="text-sm text-slate-600">Workspace is empty. Use the left panel to add objects.</p>
        ) : selectedObject ? (
          <>
            <h3 className="text-sm font-semibold text-slate-700">Selected object</h3>
            <dl className="mt-2 space-y-1 text-sm text-slate-600">
              <div className="flex items-center justify-between gap-2">
                <dt>Name</dt>
                <dd className="font-medium text-slate-700">{selectedObject.type}</dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt>X</dt>
                <dd className="font-medium text-slate-700">{Math.round(selectedObject.x)}</dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt>Y</dt>
                <dd className="font-medium text-slate-700">{Math.round(selectedObject.y)}</dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt>Width</dt>
                <dd className="font-medium text-slate-700">{Math.round(selectedObject.width)}</dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt>Height</dt>
                <dd className="font-medium text-slate-700">{Math.round(selectedObject.height)}</dd>
              </div>
            </dl>
          </>
        ) : (
          <p className="text-sm text-slate-600">No object selected.</p>
        )}
      </div>
    </div>
  );
}