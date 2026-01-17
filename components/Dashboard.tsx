
import React, { useState } from 'react';
import { Task, ErrorLog, AppView } from '../types';
import { analyzeProductivity } from '../services/geminiService';

interface DashboardProps {
  tasks: Task[];
  errors: ErrorLog[];
  onSetView: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, errors, onSetView }) => {
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pending = tasks.filter(t => t.status === 'cần làm');
  const upcomingDeadlines = pending
    .filter(t => t.deadline)
    .sort((a, b) => (a.deadline || 0) - (b.deadline || 0))
    .slice(0, 3);
  
  const errorCount = errors.length;

  const handleAnalyze = async () => {
    setLoading(true);
    const report = await analyzeProductivity(tasks);
    setAiReport(report);
    setLoading(false);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-100/50">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Hệ thống đã sẵn sàng</span>
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Bắt đầu ngay.</h2>
          <p className="text-slate-500 text-xl mt-3 font-medium italic">"Mọi thành tựu vĩ đại đều được chia nhỏ thành các bước hàng ngày."</p>
        </div>
        <button 
          onClick={handleAnalyze}
          disabled={loading}
          className="group relative flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:scale-105 transition-all disabled:opacity-50 overflow-hidden"
        >
          <span className="relative z-10">{loading ? 'Đang phân tích...' : '✨ Trợ lý AI Phân tích'}</span>
          <div className="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </header>

      {aiReport && (
        <div className="p-10 rounded-[3rem] bg-indigo-600/[0.03] border border-indigo-100 shadow-sm animate-in slide-in-from-top-4">
          <h3 className="text-indigo-600 font-black uppercase text-[11px] tracking-[0.3em] mb-6 flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" /> Báo cáo hiệu quả từ Gemini AI
          </h3>
          <div className="prose prose-slate max-w-none text-slate-700 whitespace-pre-wrap leading-relaxed font-semibold text-lg">
            {aiReport}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatsBox label="Đang thực hiện" value={pending.length} color="text-indigo-600" />
        <StatsBox label="Lỗi kỹ thuật" value={errorCount} color="text-rose-600" />
        <StatsBox label="Đã hoàn tất" value={tasks.filter(t => t.status === 'hoàn thành').length} color="text-emerald-600" />
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-100/50 overflow-hidden">
        <div className="p-10 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-4">
            <span className="text-3xl">🔥</span> Ưu tiên khẩn cấp
          </h3>
          <button onClick={() => onSetView('tasks')} className="text-indigo-600 font-black text-sm hover:underline tracking-widest uppercase">Xem board</button>
        </div>
        <div className="p-6 space-y-3">
          {upcomingDeadlines.length > 0 ? upcomingDeadlines.map(task => (
            <div key={task.id} className="p-6 rounded-[2rem] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 flex items-center justify-between group">
              <div className="flex items-center gap-6">
                <div className={`w-3 h-3 rounded-full ${task.priority === 'cao' ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-slate-200'}`} />
                <div>
                  <p className="font-extrabold text-xl text-slate-800 group-hover:text-indigo-600 transition-colors">{task.title}</p>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{task.view}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-amber-600 bg-amber-50 px-5 py-2 rounded-xl border border-amber-100 inline-block shadow-sm">
                  {new Date(task.deadline!).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          )) : (
            <div className="p-20 text-center text-slate-400 font-black uppercase tracking-widest text-sm italic">Không có deadline khẩn cấp.</div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatsBox: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col items-center text-center transition-all hover:shadow-lg">
    <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[11px] mb-4">{label}</p>
    <p className={`text-8xl font-black tracking-tighter ${color}`}>{value}</p>
  </div>
);

export default Dashboard;
