
import React, { useState } from 'react';
import { ScratchNote } from '../types';

interface ScratchpadProps {
  notes: ScratchNote[];
  onAdd: (content: string) => void;
  onDelete: (id: string) => void;
}

const Scratchpad: React.FC<ScratchpadProps> = ({ notes, onAdd, onDelete }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onAdd(content);
    setContent('');
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-8">
      <header className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Nháp ý tưởng</h2>
        <p className="text-slate-500 mt-1 font-medium italic">Ghi lại nhanh chóng, tra cứu tức thì.</p>
      </header>

      <form onSubmit={handleSubmit} className="relative group">
        <textarea 
          className="w-full bg-white p-10 rounded-[2.5rem] border border-slate-200 text-slate-800 outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 min-h-[180px] text-lg font-medium leading-relaxed placeholder:text-slate-300 shadow-sm transition-all"
          placeholder="Bạn đang nghĩ gì?..."
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <button 
          type="submit"
          className="absolute bottom-10 right-10 bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95 transition-all"
        >
          Lưu lại
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map(note => (
          <div key={note.id} className="bg-white p-8 rounded-[2rem] border border-slate-200 hover:border-indigo-200 transition-all group relative">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(note.createdAt).toLocaleString('vi-VN')}</span>
              <button 
                onClick={() => onDelete(note.id)} 
                className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-all p-1"
              >
                ✕
              </button>
            </div>
            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed font-medium">{note.content}</p>
          </div>
        ))}
        {notes.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-400 font-medium italic border-2 border-dashed border-slate-200 rounded-[2rem]">
            Vùng trống cho những ý tưởng vĩ đại...
          </div>
        )}
      </div>
    </div>
  );
};

export default Scratchpad;
