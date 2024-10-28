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
  const { toast } = useToast();

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
        setUserXp(prevXp => {
          const newXp = prevXp + 400;
          const newLevel = Math.floor(newXp / 1000) + 1;
          if (newLevel > userLevel) {
            setUserLevel(newLevel);
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

  const currentWeekTasks = tasks.filter(task => task.week === currentWeek);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-purple-50/50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <MainNavigation />
        
        <PremiumFeatures
          isPremium={isPremium}
          userLevel={level}
          userXp={xp}
          onUpgradeToPremium={() => setIsPremium(true)}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-6 border-blue-100 bg-white/80 backdrop-blur">
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Assistente de Automação de Tarefas
            </h1>
            <p className="text-gray-600 mb-6">
              Faça upload do seu arquivo de planejamento para gerar e gerenciar tarefas semanais automaticamente.
            </p>
            <div className="space-y-6">
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

          <div className="space-y-6">
            <Card className="p-6 border-blue-100 bg-white/80 backdrop-blur">
              <FileUploader onFileUpload={handleFileUpload} />
            </Card>

            <div className={cn(
              "p-6 rounded-lg transition-all duration-300 relative",
              !isPremium && "opacity-75"
            )}>
              {!isPremium && (
                <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px] rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Crown className="w-12 h-12 mx-auto text-yellow-500 animate-pulse" />
                    <p className="text-sm font-medium">Recurso Premium</p>
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
