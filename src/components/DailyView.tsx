import { Card } from "@/components/ui/card";
import { TaskType } from "@/types/task";
import { Calendar, Clock, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DailyViewProps {
  tasks: TaskType[];
  week: number;
}

export const DailyView = ({ tasks, week }: DailyViewProps) => {
  const today = new Date();
  const formattedDate = format(today, "EEEE, d 'de' MMMM", { locale: ptBR });

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-blue-900 capitalize">
          {formattedDate}
        </h2>
      </div>

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Nenhuma tarefa para hoje
          </p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-4 rounded-lg bg-white shadow-sm border border-blue-100 hover:border-blue-200 transition-colors"
            >
              {task.completed ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <Clock className="h-5 w-5 text-blue-500" />
              )}
              <span
                className={`flex-1 ${
                  task.completed
                    ? "text-gray-500 line-through"
                    : "text-gray-700"
                }`}
              >
                {task.title}
              </span>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};