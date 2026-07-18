//Sidebar.tsx
// import React from 'react';
import type { WorkspaceObject } from '../types/workspace';

interface SidebarProps {
  objects: WorkspaceObject[];
  onAddObject: (type: string) => void;
  onRemoveObject: (type: string) => void;
}

const availableObjects = [
  'Monitor',
  'Laptop',
  'Keyboard',
  'Mouse',
  'Chair',
  'Desk Lamp',
  'Speaker',
];

const getThaiLabel = (type: string) => {
  const labels: Record<string, string> = {
    Monitor: 'จอมอนิเตอร์',
    Laptop: 'แล็ปท็อป',
    Keyboard: 'คีย์บอร์ด',
    Mouse: 'เมาส์',
    Chair: 'เก้าอี้',
    'Desk Lamp': 'โคมไฟ',
    Speaker: 'ลำโพง',
  };

  return labels[type] ?? type;
};

export default function Sidebar({ objects, onAddObject, onRemoveObject }: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-slate-200 h-full flex flex-col shadow-sm z-10">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <h2 className="text-lg font-bold text-slate-800">อุปกรณ์ในพื้นที่ทำงาน</h2>
        <p className="text-xs text-slate-500 mt-1">
          เพิ่มอุปกรณ์เพื่อสร้างพื้นที่ทำงาน
          จำกัดหนึ่งชิ้นต่อประเภท
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {availableObjects.map((type) => {
          // เช็กว่า object ชนิดนี้ถูกเพิ่มลงไปบนโต๊ะหรือยัง
          const isAdded = objects.some((obj) => obj.type === type);
          
          return (
            <div
              key={type}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                isAdded 
                  ? 'border-blue-200 bg-blue-50' 
                  : 'border-slate-200 bg-slate-50 hover:border-slate-300'
              }`}
            >
              <span className={`text-sm font-medium ${isAdded ? 'text-blue-800' : 'text-slate-700'}`}>
                {getThaiLabel(type)}
              </span>
              
              {isAdded ? (
                <button
                  onClick={() => onRemoveObject(type)}
                  className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-white border border-red-200 rounded-md hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm"
                >
                  ลบ
                </button>
              ) : (
                <button
                  onClick={() => onAddObject(type)}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                >
                  เพิ่ม
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}