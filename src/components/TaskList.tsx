import { Checkbox } from "@/components/ui/checkbox";
import { TaskType } from "@/types/task";

interface TaskListProps {
  tasks: TaskType[];
  onTaskComplete: (taskId: string) => void;
}

export const TaskList = ({ tasks, onTaskComplete }: TaskListProps) => {
  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No tasks for this week</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50"
          >
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => onTaskComplete(task.id)}
            />
            <span className={task.completed ? "line-through text-gray-500" : ""}>
              {task.title}
            </span>
          </div>
        ))
      )}
    </div>
  );
};