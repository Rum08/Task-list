
import React, { useState } from 'react';
import { ErrorLog, ErrorCategory } from '../types';
import { suggestSolution } from '../services/geminiService';

interface ErrorLogsProps {
  logs: ErrorLog[];
  onAddLog: (log: Omit<ErrorLog, 'id' | 'createdAt'>) => void;
  onDelete: (id: string) => void;
}

const ErrorLogs: React.FC<ErrorLogsProps> = ({ logs, onAddLog, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [category, setCategory] = useState<ErrorCategory>('Frontend');
  const [symptoms, setSymptoms] = useState('');
  const [solution, setSolution] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAI = async () => {
    if (!error || !symptoms) return alert("Vui lòng điền tên lỗi và bối cảnh.");
    setLoading(true);
    const suggestion = await suggestSolution(error, symptoms, category);
    setSolution(prev => prev + (prev ? '\n\n' : '') + "--- GỢI Ý CỦA AI ---\n" + suggestion);
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-8">
      <div className="flex justify-between items-center bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Nhật ký lỗi</h2>
          <p className="text-slate-500 font-medium">Lưu giữ các sự cố để tránh lặp lại.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-rose-600 text-white rounded-xl font-bold shadow-lg shadow-rose-100 hover:bg-rose-700 transition-all"
        >
          Ghi nhận sự cố
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {logs.map(log => (
          <div key={log.id} className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-black">!</div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 tracking-tight">{log.error}</h4>
                    <span className="text-[10px] font-black uppercase text-slate-400 mt-1 block tracking-widest">{log.category} • {new Date(log.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <button onClick={() => onDelete(log.id)} className="text-slate-300 hover:text-rose-600 transition-colors">✕</button>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Triệu chứng</h5>
                  <p className="text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm leading-relaxed">{log.symptoms}</p>
                </div>
                <div className="space-y-3">
                  <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Cách khắc phục</h5>
                  <div className="text-slate-700 bg-indigo-50/30 p-4 rounded-xl border border-indigo-100 text-sm whitespace-pre-wrap leading-relaxed">
                    {log.solution}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="py-20 text-center bg-white rounded-[2rem] border border-slate-200 border-dashed">
            <p className="text-slate-400 font-medium italic">Chưa có bản ghi sự cố nào.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2rem] p-10 border border-slate-200 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900">Báo cáo Incident</h3>
              <button 
                onClick={handleAI} 
                disabled={loading}
                className="px-5 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-black uppercase hover:bg-indigo-100 transition-all disabled:opacity-50"
              >
                {loading ? 'Đang suy nghĩ...' : '✨ Gemini gợi ý'}
              </button>
            </div>
            <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
              <input 
                className="w-full bg-slate-50 px-6 py-4 rounded-xl border border-slate-200 text-slate-900 outline-none focus:ring-2 focus:ring-rose-500 font-bold" 
                placeholder="Tên lỗi..." 
                value={error} 
                onChange={e => setError(e.target.value)} 
              />
              <div className="flex flex-wrap gap-2">
                {(['Frontend', 'Backend', 'Database', 'DevOps', 'Logic', 'Khác'] as ErrorCategory[]).map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setCategory(cat)} 
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${category === cat ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <textarea 
                className="w-full bg-slate-50 px-6 py-4 rounded-xl border border-slate-200 text-slate-900 outline-none h-28" 
                placeholder="Xảy ra như thế nào?" 
                value={symptoms} 
                onChange={e => setSymptoms(e.target.value)} 
              />
              <textarea 
                className="w-full bg-slate-50 px-6 py-4 rounded-xl border border-slate-200 text-slate-900 outline-none h-40 font-mono text-sm" 
                placeholder="Ghi chú cách sửa hoặc dán code gợi ý tại đây..." 
                value={solution} 
                onChange={e => setSolution(e.target.value)} 
              />
              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowModal(false)} className="flex-1 py-4 text-slate-500 font-bold">Hủy</button>
                <button 
                  onClick={() => { onAddLog({ error, category, symptoms, solution }); setShowModal(false); }} 
                  className="flex-[2] py-4 bg-slate-900 text-white font-bold rounded-xl"
                >
                  Lưu vào nhật ký
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorLogs;
