export interface TaskType {
  id: string;
  title: string;
  completed: boolean;
  week: number;
  xpReward?: number;
  priority?: number;
  dueDate?: Date;
  type?: 'daily' | 'weekly' | 'monthly';
}