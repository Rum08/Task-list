
import React, { useState, useEffect } from 'react';
import { AppView, Task, ErrorLog, ScratchNote } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TaskBoard from './components/TaskBoard';
import ErrorLogs from './components/ErrorLogs';
import Scratchpad from './components/Scratchpad';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [scratchNotes, setScratchNotes] = useState<ScratchNote[]>([]);

  useEffect(() => {
    const savedTasks = localStorage.getItem('rum_v2_tasks');
    const savedErrors = localStorage.getItem('rum_v2_errors');
    const savedScratch = localStorage.getItem('rum_v2_scratch');
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedErrors) setErrors(JSON.parse(savedErrors));
    if (savedScratch) setScratchNotes(JSON.parse(savedScratch));
  }, []);

  useEffect(() => {
    localStorage.setItem('rum_v2_tasks', JSON.stringify(tasks));
    localStorage.setItem('rum_v2_errors', JSON.stringify(errors));
    localStorage.setItem('rum_v2_scratch', JSON.stringify(scratchNotes));
  }, [tasks, errors, scratchNotes]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'status'>) => {
    setTasks(prev => [{ ...task, id: crypto.randomUUID(), createdAt: Date.now(), status: 'cần làm' }, ...prev]);
  };

  const addError = (log: Omit<ErrorLog, 'id' | 'createdAt'>) => {
    setErrors(prev => [{ ...log, id: crypto.randomUUID(), createdAt: Date.now() }, ...prev]);
  };

  const addScratch = (content: string) => {
    setScratchNotes(prev => [{ id: crypto.randomUUID(), content, createdAt: Date.now() }, ...prev]);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      
      <main className="flex-1 p-4 md:p-8 ml-0 lg:ml-72 overflow-auto">
        <div className="max-w-6xl mx-auto pb-20">
          {currentView === 'dashboard' && <Dashboard tasks={tasks} errors={errors} onSetView={setCurrentView} />}
          {currentView === 'tasks' && (
            <TaskBoard 
              tasks={tasks} 
              onAddTask={addTask} 
              onToggleStatus={(id, status) => setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t))}
              onDelete={id => setTasks(prev => prev.filter(t => t.id !== id))}
            />
          )}
          {currentView === 'errors' && (
            <ErrorLogs 
              logs={errors} 
              onAddLog={addError} 
              onDelete={id => setErrors(prev => prev.filter(e => e.id !== id))}
            />
          )}
          {currentView === 'scratchpad' && (
            <Scratchpad 
              notes={scratchNotes} 
              onAdd={addScratch} 
              onDelete={id => setScratchNotes(prev => prev.filter(n => n.id !== id))} 
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
