export interface TaskType {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  week: number;
  xpReward?: number;
  priority: 'low' | 'medium' | 'high';
  dueDate: Date;
  status: 'pending' | 'in_progress' | 'completed';
  assigneeId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export const createDefaultTask = (partial: Partial<TaskType>): TaskType => ({
  id: Math.random().toString(36).substr(2, 9),
  title: '',
  description: '',
  completed: false,
  week: 1,
  xpReward: 10,
  priority: 'medium',
  dueDate: new Date(),
  status: 'pending',
  assigneeId: '',
  createdBy: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...partial
});