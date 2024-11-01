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