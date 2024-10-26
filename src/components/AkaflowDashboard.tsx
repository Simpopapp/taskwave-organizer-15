import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, Star, Calendar, Users, CheckSquare, Trophy, Sparkles, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskList } from "./TaskList";
import { WeeklyProgress } from "./WeeklyProgress";
import { Button } from "./ui/button";
import { TaskType } from "@/types/task";
import { useTheme } from "next-themes";
import { PremiumFeatures } from "./PremiumFeatures";
import { CrystallizeDialog } from "./CrystallizeDialog";
import { VoiceInput } from "./VoiceInput";
import { useToast } from "@/hooks/use-toast";

const XP_PER_INTERACTION = 400;
const XP_FOR_LEVEL_UP = 1000;

export const AkaflowDashboard = () => {
  const [activeTab, setActiveTab] = useState("tasks");
  const { theme } = useTheme();
  const [isPremium, setIsPremium] = useState(false);
  const [userLevel, setUserLevel] = useState(1);
  const [userXp, setUserXp] = useState(0);
  const [interactionCount, setInteractionCount] = useState(0);
  const { toast } = useToast();

  const isDark = theme === "dark";

  useEffect(() => {
    if (interactionCount > 0 && interactionCount % 3 === 0) {
      const newXp = userXp + XP_PER_INTERACTION;
      const newLevel = Math.floor(newXp / XP_FOR_LEVEL_UP) + 1;
      
      setUserXp(newXp);
      
      if (newLevel > userLevel) {
        setUserLevel(newLevel);
        toast({
          title: "Nível Aumentado! 🎉",
          description: `Você alcançou o nível ${newLevel}!`,
          duration: 5000,
        });
      }
    }
  }, [interactionCount, userXp, userLevel]);

  const handleInteraction = () => {
    setInteractionCount(prev => prev + 1);
  };

  const handleIdeaCrystallized = (enhancedIdea: string) => {
    handleInteraction();
    toast({
      title: "Nova Ideia Cristalizada",
      description: "Sua ideia foi aprimorada e está pronta para implementação.",
    });
  };

  const glassStyle = cn(
    "backdrop-blur-md transition-all duration-300",
    isDark
      ? "bg-gray-900/40 text-white"
      : "bg-white/40 text-gray-900",
    "border border-opacity-20",
    isDark ? "border-white/10" : "border-black/10"
  );

  return (
    <div className={cn(
      "min-h-screen p-8 transition-colors duration-300",
      isDark
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
        : "bg-gradient-to-br from-gray-50 via-white to-gray-50"
    )}>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className={cn(
            "text-5xl font-bold bg-clip-text text-transparent",
            "bg-gradient-to-r",
            isDark
              ? "from-purple-400 via-blue-400 to-purple-400"
              : "from-purple-600 via-blue-600 to-purple-600"
          )}>
            AKAFLOW
            {isPremium && (
              <Badge className="ml-2 bg-gradient-to-r from-yellow-400 to-yellow-600 animate-pulse">
                AKALIBRE Premium
              </Badge>
            )}
          </h1>
          <p className="text-lg opacity-80">
            Eleve sua produtividade ao próximo nível
          </p>
        </div>

        <PremiumFeatures
          isPremium={isPremium}
          userLevel={userLevel}
          userXp={userXp}
          onUpgradeToPremium={() => setIsPremium(true)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={cn(
            "p-6 rounded-lg transition-all duration-300",
            glassStyle
          )}>
            <CrystallizeDialog 
              onIdeaCrystallized={handleIdeaCrystallized}
              className="w-full"
            />
          </div>

          <div className={cn(
            "p-6 rounded-lg transition-all duration-300 relative",
            glassStyle,
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
              onTranscriptionComplete={() => {}}
              onContentAnalyzed={() => {}}
            />
          </div>
        </div>

        <Card className={cn(glassStyle, "p-6")}>
          <Tabs defaultValue="tasks" className="space-y-6">
            <TabsList className="grid grid-cols-3 gap-4 bg-transparent">
              {[
                { id: "tasks", label: "Tarefas", icon: CheckSquare },
                { id: "appointments", label: "Compromissos", icon: Calendar },
                { id: "team", label: "Equipe", icon: Users },
              ].map(({ id, label, icon: Icon }) => (
                <TabsTrigger
                  key={id}
                  value={id}
                  onClick={handleInteraction}
                  className={cn(
                    "data-[state=active]:bg-primary/20",
                    "hover:bg-primary/10 transition-all",
                    "flex items-center gap-2 py-3"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="tasks" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Suas Tarefas</h2>
                <div className="flex gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Trophy className="w-4 h-4" />
                    Nível {userLevel}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    {userXp} XP
                  </Badge>
                </div>
              </div>
              <Progress value={(userXp % 100)} className="h-2" />
              <TaskList tasks={[]} onTaskComplete={() => {}} />
            </TabsContent>

            <TabsContent value="appointments" className="space-y-4">
              <h2 className="text-2xl font-semibold">Compromissos</h2>
              {/* Appointment content here */}
            </TabsContent>

            <TabsContent value="team" className="space-y-4">
              <h2 className="text-2xl font-semibold">Equipe</h2>
              {/* Team content here */}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};