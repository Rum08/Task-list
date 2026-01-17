
export type TaskView = 'hàng ngày' | 'hàng tuần' | 'hàng tháng';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'thấp' | 'trung bình' | 'cao';
  status: 'cần làm' | 'hoàn thành';
  view: TaskView;
  deadline?: number; // Timestamp
  createdAt: number;
}

export type ErrorCategory = 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Logic' | 'Khác';

export interface ErrorLog {
  id: string;
  error: string;
  category: ErrorCategory;
  symptoms: string;
  solution: string;
  createdAt: number;
}

export interface ScratchNote {
  id: string;
  content: string;
  createdAt: number;
}

export type AppView = 'dashboard' | 'tasks' | 'errors' | 'scratchpad';
