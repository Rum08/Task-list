
import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems: { id: AppView; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Tổng quan', icon: '📊' },
    { id: 'tasks', label: 'Kế hoạch', icon: '📋' },
    { id: 'errors', label: 'Xử lý lỗi', icon: '🛠️' },
    { id: 'scratchpad', label: 'Ghi chú', icon: '✍️' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col z-50">
      <div className="p-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center font-black text-xl text-white italic">R</div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Rum</h1>
        </div>
        <p className="text-[11px] text-slate-400 mt-2 uppercase tracking-widest font-bold">Workspace Pro</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center space-x-3 px-5 py-3.5 rounded-xl transition-all duration-200 group relative ${
              currentView === item.id 
                ? 'bg-indigo-50 text-indigo-700 font-bold' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="tracking-tight">{item.label}</span>
            {currentView === item.id && <div className="absolute right-4 w-1.5 h-1.5 bg-indigo-600 rounded-full" />}
          </button>
        ))}
      </nav>

      <div className="p-6">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">DEV</div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">Developer</p>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <p className="text-[10px] text-slate-500 font-bold uppercase">Trực tuyến</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
