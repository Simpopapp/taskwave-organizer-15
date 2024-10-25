import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, Trophy, Target } from "lucide-react";
import { TaskType } from "@/types/task";
import { useState } from "react";

export default function Missions() {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [tasks] = useState<TaskType[]>([
    { id: "1", title: "Completar relatório diário", completed: false, week: 1 },
    { id: "2", title: "Revisar documentação", completed: false, week: 1 },
  ]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Missões Diárias</h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Trophy className="w-4 h-4" />
            Nível {level}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Star className="w-4 h-4" />
            {xp} XP
          </Badge>
        </div>
      </div>

      <Progress value={(xp % 100)} className="w-full" />

      <div className="grid gap-4 md:grid-cols-2">
        {tasks.map((task) => (
          <Card key={task.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-blue-500" />
              <div className="flex-1">
                <h3 className="font-medium">{task.title}</h3>
                <p className="text-sm text-gray-500">+50 XP</p>
              </div>
              <Badge variant={task.completed ? "default" : "outline"}>
                {task.completed ? "Completo" : "Em Progresso"}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}