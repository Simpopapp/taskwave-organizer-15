import { Progress } from "@/components/ui/progress";
import { TaskType } from "@/types/task";

interface WeeklyProgressProps {
  tasks: TaskType[];
  week: number;
}

export const WeeklyProgress = ({ tasks, week }: WeeklyProgressProps) => {
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Week {week}</span>
        <span className="text-sm text-gray-500">
          {completedTasks} of {totalTasks} tasks completed
        </span>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="text-sm text-gray-500 text-right">
        {Math.round(progress)}% complete
      </div>
    </div>
  );
};