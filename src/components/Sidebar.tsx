import React from 'react';

const Sidebar: React.FC = () => {
  const objects = [
    'Monitor',
    'Laptop',
    'Keyboard',
    'Mouse',
    'Chair',
    'Desk Lamp',
    'Speaker'
  ];

  return (
    <aside className="w-[240px] bg-slate-50 border-r border-slate-200 h-full flex flex-col shrink-0 overflow-y-auto">
      <div className="p-4 border-b border-slate-200">
        <h2 className="font-semibold text-slate-700">Objects</h2>
      </div>
      <ul className="p-4 flex flex-col gap-3">
        {objects.map((obj) => (
          <li 
            key={obj} 
            className="p-3 bg-white border border-slate-300 rounded shadow-sm text-sm text-slate-700 hover:border-blue-400 cursor-default"
          >
            {obj}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;