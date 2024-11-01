import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { TaskList } from "@/components/TaskList";
import { WeeklyProgress } from "@/components/WeeklyProgress";
import { FileUploader } from "@/components/FileUploader";
import { DailyView } from "@/components/DailyView";
import { VoiceInput } from "@/components/VoiceInput";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskType } from "@/types/task";
import { MainNavigation } from "@/components/navigation/MainNavigation";
import { PremiumFeatures } from "@/components/PremiumFeatures";

export default function Index() {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [isPremium, setIsPremium] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  const { toast } = useToast();

  const parseTasksFromContent = (content: string): TaskType[] => {
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    const parsedTasks: TaskType[] = [];
    let weekNumber = 1;

    lines.forEach(line => {
      if (line.toLowerCase().match(/^(semana|week)\s*\d+/i)) {
        weekNumber = parseInt(line.match(/\d+/)?.[0] || "1");
        return;
      }

      if (line.trim().match(/^[-*]|:/)) {
        const taskTitle = line.replace(/^[-*]\s*/, '').trim();
        if (taskTitle) {
          parsedTasks.push({
            id: Math.random().toString(36).substr(2, 9),
            title: taskTitle,
            description: '',
            completed: false,
            week: weekNumber,
            priority: 'medium',
            dueDate: new Date(),
            status: 'pending',
            assigneeId: '',
            createdBy: '',
            createdAt: new Date(),
            updatedAt: new Date()
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

  const handleInteraction = () => {
    setInteractionCount(prev => {
      const newCount = prev + 1;
      if (newCount % 3 === 0) {
        setXp(prevXp => {
          const newXp = prevXp + 400;
          const newLevel = Math.floor(newXp / 1000) + 1;
          if (newLevel > level) {
            setLevel(newLevel);
            toast({
              title: "Nível Aumentado! 🎉",
              description: `Você alcançou o nível ${newLevel}!`,
            });
          }
          return newXp;
        });
      }
      return newCount;
    });
  };

  const handleTaskComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const completed = !task.completed;
        if (completed) {
          const points = 25;
          setXp(prevXp => {
            const newXp = prevXp + points;
            const newLevel = Math.floor(newXp / 1000) + 1;
            if (newLevel > level) {
              setLevel(newLevel);
              toast({
                title: "Nível Aumentado! 🎉",
                description: `Você alcançou o nível ${newLevel}!`,
                duration: 5000,
              });
            }
            return newXp;
          });
        }
        return { ...task, completed };
      }
      return task;
    }));
  };

  const currentWeekTasks = tasks.filter(task => task.week === currentWeek);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-purple-50/50 px-4 py-6 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-8">
        <MainNavigation />
        
        <PremiumFeatures
          isPremium={isPremium}
          userLevel={level}
          userXp={xp}
          onUpgradeToPremium={() => setIsPremium(true)}
        />

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="p-4 sm:p-6 border-blue-100 bg-white/80 backdrop-blur">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Assistente de Automação de Tarefas
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              Faça upload do seu arquivo de planejamento para gerar e gerenciar tarefas semanais automaticamente.
            </p>
            <div className="space-y-4 sm:space-y-6">
              <DailyView tasks={currentWeekTasks} week={currentWeek} />
              <WeeklyProgress 
                tasks={currentWeekTasks}
                week={currentWeek}
              />
              <TaskList 
                tasks={currentWeekTasks}
                onTaskComplete={handleTaskComplete}
              />
            </div>
          </Card>

          <div className="space-y-4 sm:space-y-6">
            <Card className="p-4 sm:p-6 border-blue-100 bg-white/80 backdrop-blur">
              <FileUploader onFileUpload={handleFileUpload} />
            </Card>

            <div className={cn(
              "p-4 sm:p-6 rounded-lg transition-all duration-300 relative",
              !isPremium && "opacity-75"
            )}>
              {!isPremium && (
                <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px] rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Crown className="w-8 h-8 sm:w-12 sm:h-12 mx-auto text-yellow-500 animate-pulse" />
                    <p className="text-xs sm:text-sm font-medium">Recurso Premium</p>
                  </div>
                </div>
              )}
              <VoiceInput 
                onTranscriptionComplete={() => handleInteraction()}
                onContentAnalyzed={() => handleInteraction()}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
