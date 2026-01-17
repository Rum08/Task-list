
import React, { useState } from 'react';
import { Task, TaskView } from '../types';

interface TaskBoardProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'status'>) => void;
  onToggleStatus: (id: string, status: 'cần làm' | 'hoàn thành') => void;
  onDelete: (id: string) => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, onAddTask, onToggleStatus, onDelete }) => {
  const [activeTab, setActiveTab] = useState<TaskView>('hàng ngày');
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<'thấp' | 'trung bình' | 'cao'>('trung bình');
  const [newDeadline, setNewDeadline] = useState('');

  const filtered = tasks.filter(t => t.view === activeTab);

  const tabs: TaskView[] = ['hàng ngày', 'hàng tuần', 'hàng tháng'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight capitalize">Kế hoạch {activeTab}</h2>
          <p className="text-slate-500 font-medium text-lg mt-1">Lập lộ trình chi tiết cho mục tiêu của bạn.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center gap-3"
        >
          <span className="text-2xl">+</span> Thêm công việc mới
        </button>
      </div>

      <div className="flex items-center space-x-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm w-fit">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all capitalize ${
              activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[12px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100">
                <th className="px-10 py-6 w-20">Trạng thái</th>
                <th className="px-6 py-6">Nội dung công việc</th>
                <th className="px-6 py-6 w-36">Độ ưu tiên</th>
                <th className="px-6 py-6 w-56 text-center">Hạn chót</th>
                <th className="px-10 py-6 w-24 text-right">Tác vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? filtered.map((task) => (
                <tr key={task.id} className={`group hover:bg-indigo-50/30 transition-all duration-300 ${task.status === 'hoàn thành' ? 'bg-slate-50/50' : ''}`}>
                  <td className="px-10 py-7">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        checked={task.status === 'hoàn thành'} 
                        onChange={e => onToggleStatus(task.id, e.target.checked ? 'hoàn thành' : 'cần làm')}
                        className="peer appearance-none w-7 h-7 rounded-lg border-2 border-slate-200 text-indigo-600 focus:ring-indigo-500 cursor-pointer checked:bg-indigo-600 checked:border-indigo-600 transition-all shadow-sm"
                      />
                      <span className="absolute text-white font-bold opacity-0 peer-checked:opacity-100 pointer-events-none text-sm">✓</span>
                    </div>
                  </td>
                  <td className="px-6 py-7">
                    <div className="max-w-xl">
                      <p className={`text-xl font-extrabold tracking-tight mb-1.5 transition-all ${
                        task.status === 'hoàn thành' ? 'line-through text-slate-400 decoration-2' : 'text-slate-900 group-hover:text-indigo-700'
                      }`}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className={`text-sm font-medium leading-relaxed ${task.status === 'hoàn thành' ? 'text-slate-300' : 'text-slate-500'}`}>
                          {task.description}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-7">
                    <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest border shadow-sm ${
                      task.priority === 'cao' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                      task.priority === 'trung bình' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                      'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-7 text-center">
                    {task.deadline ? (
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-[13px] font-bold px-3 py-1 rounded-lg border ${
                          Date.now() > task.deadline ? 'text-rose-600 bg-rose-50 border-rose-100' : 'text-slate-700 bg-slate-50 border-slate-200'
                        }`}>
                          {new Date(task.deadline).toLocaleString('vi-VN', { 
                            day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
                          })}
                        </span>
                        {Date.now() > task.deadline && task.status !== 'hoàn thành' && (
                          <span className="text-[10px] text-rose-500 font-black uppercase tracking-tighter">Trễ hạn</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-300 font-black text-xs">KHÔNG CÓ</span>
                    )}
                  </td>
                  <td className="px-10 py-7 text-right">
                    <button 
                      onClick={() => onDelete(task.id)}
                      className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      title="Xóa công việc"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center grayscale opacity-30 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <p className="text-slate-400 font-black uppercase tracking-widest text-sm">Danh sách đang trống...</p>
                    <p className="text-slate-400 text-xs mt-2">Hãy bắt đầu bằng việc thêm một nhiệm vụ mới.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-[3rem] p-12 border border-slate-200 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] animate-in zoom-in-95 duration-200">
            <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Kế hoạch mới</h3>
            <p className="text-slate-500 font-medium mb-10 capitalize">Dành cho mục tiêu {activeTab}</p>
            
            <div className="space-y-8">
              <div className="space-y-2.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Nội dung chính</label>
                <input 
                  autoFocus
                  className="w-full bg-slate-50 px-7 py-5 rounded-2xl border border-slate-200 text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-lg transition-all"
                  placeholder="Bạn định làm gì hôm nay?"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Mô tả thêm</label>
                <textarea 
                  className="w-full bg-slate-50 px-7 py-5 rounded-2xl border border-slate-200 text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 h-32 font-medium leading-relaxed transition-all"
                  placeholder="Thêm các bước thực hiện hoặc ghi chú..."
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Độ ưu tiên</label>
                  <select 
                    className="w-full bg-slate-50 px-6 py-4 rounded-2xl border border-slate-200 text-slate-900 outline-none focus:border-indigo-500 font-black text-sm cursor-pointer"
                    value={newPriority}
                    onChange={e => setNewPriority(e.target.value as any)}
                  >
                    <option value="thấp">🟢 Thấp</option>
                    <option value="trung bình">🟡 Trung bình</option>
                    <option value="cao">🔴 Cao</option>
                  </select>
                </div>
                <div className="space-y-2.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Hạn chót</label>
                  <input 
                    type="datetime-local"
                    className="w-full bg-slate-50 px-6 py-4 rounded-2xl border border-slate-200 text-slate-900 outline-none focus:border-indigo-500 font-bold text-sm color-scheme-light"
                    value={newDeadline}
                    onChange={e => setNewDeadline(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-6 pt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 py-5 text-slate-400 font-black tracking-widest hover:text-slate-900 transition-colors">HỦY BỎ</button>
                <button 
                  onClick={() => {
                    if (!newTitle) return;
                    onAddTask({ 
                      title: newTitle, 
                      description: newDesc, 
                      priority: newPriority, 
                      view: activeTab,
                      deadline: newDeadline ? new Date(newDeadline).getTime() : undefined
                    });
                    setNewTitle(''); setNewDesc(''); setNewDeadline(''); setShowModal(false);
                  }}
                  className="flex-[2] py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`
        .color-scheme-light {
          color-scheme: light;
        }
      `}</style>
    </div>
  );
};

export default TaskBoard;
