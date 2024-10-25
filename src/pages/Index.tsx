import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { TaskList } from "@/components/TaskList";
import { WeeklyProgress } from "@/components/WeeklyProgress";
import { FileUploader } from "@/components/FileUploader";
import { DailyView } from "@/components/DailyView";
import { TaskType } from "@/types/task";
import { MainNavigation } from "@/components/navigation/MainNavigation";

const Index = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const { toast } = useToast();
  const [currentWeek, setCurrentWeek] = useState(1);
  const [userLevel, setUserLevel] = useState(1);
  const [userXp, setUserXp] = useState(0);

  const parseTasksFromContent = (content: string): TaskType[] => {
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    const parsedTasks: TaskType[] = [];
    let currentWeek = 1;

    lines.forEach(line => {
      // Check if line starts with "Semana" or "Week"
      if (line.toLowerCase().match(/^(semana|week)\s*\d+/i)) {
        currentWeek = parseInt(line.match(/\d+/)?.[0] || "1");
        return;
      }

      // Check if line is a task (starts with "-", "*", or contains ":")
      if (line.trim().match(/^[-*]|:/)) {
        const taskTitle = line.replace(/^[-*]\s*/, '').trim();
        if (taskTitle) {
          parsedTasks.push({
            id: Math.random().toString(36).substr(2, 9),
            title: taskTitle,
            completed: false,
            week: currentWeek
          });
        }
      }
    });

    return parsedTasks;
  };

  const handleFileUpload = (content: string) => {
    const parsedTasks = parseTasksFromContent(content);
    setTasks(parsedTasks);
    
    toast({
      title: "Tasks Loaded",
      description: `Successfully loaded ${parsedTasks.length} tasks from file.`
    });
  };

  const handleTaskComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const completed = !task.completed;
        if (completed) {
          addExperiencePoints(25, "Tarefa concluída");
        }
        return { ...task, completed };
      }
      return task;
    }));
  };

  const addExperiencePoints = (points: number, action: string) => {
    setUserXp(prev => {
      const newXp = prev + points;
      const newLevel = Math.floor(newXp / 1000) + 1;
      
      if (newLevel > userLevel) {
        toast({
          title: "Nível Aumentado! 🎉",
          description: `Você alcançou o nível ${newLevel}!`,
          duration: 5000,
        });
        setUserLevel(newLevel);
      }
      
      return newXp;
    });
  };

  const handleWeekChange = (week: number) => {
    setCurrentWeek(week);
  };

  const availableWeeks = Array.from(
    new Set(tasks.map(task => task.week))
  ).sort((a, b) => a - b);

  const currentWeekTasks = tasks.filter(task => task.week === currentWeek);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-purple-50/50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <MainNavigation />
        
        <Card className="p-6 border-blue-100 bg-white/80 backdrop-blur">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            Assistente de Automação de Tarefas
          </h1>
          <p className="text-gray-600 mb-6">
            Faça upload do seu arquivo de planejamento para gerar e gerenciar tarefas semanais automaticamente.
          </p>
          <FileUploader onFileUpload={handleFileUpload} />
        </Card>

        {availableWeeks.length > 0 && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {availableWeeks.map(week => (
              <Button
                key={week}
                variant={currentWeek === week ? "default" : "outline"}
                onClick={() => handleWeekChange(week)}
                className={currentWeek === week 
                  ? "bg-blue-600 hover:bg-blue-700" 
                  : "border-blue-200 text-blue-700 hover:bg-blue-50"}
              >
                Semana {week}
              </Button>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <DailyView tasks={currentWeekTasks} week={currentWeek} />
          </div>

          <div className="space-y-8">
            <Card className="p-6 border-blue-100 bg-white/80 backdrop-blur">
              <h2 className="text-xl font-semibold mb-4 text-blue-900">
                Progresso Semanal
              </h2>
              <WeeklyProgress 
                tasks={currentWeekTasks}
                week={currentWeek}
              />
            </Card>

            <Card className="p-6 border-blue-100 bg-white/80 backdrop-blur">
              <h2 className="text-xl font-semibold mb-4 text-blue-900">
                Tarefas da Semana
              </h2>
              <TaskList 
                tasks={currentWeekTasks}
                onTaskComplete={handleTaskComplete}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
