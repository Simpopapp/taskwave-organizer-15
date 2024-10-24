import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { TaskList } from "@/components/TaskList";
import { WeeklyProgress } from "@/components/WeeklyProgress";
import { FileUploader } from "@/components/FileUploader";
import { TaskType } from "@/types/task";

const Index = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const { toast } = useToast();
  const [currentWeek, setCurrentWeek] = useState(1);

  const handleFileUpload = (content: string) => {
    // Simple parser for demonstration
    const parsedTasks = content.split('\n')
      .filter(line => line.trim().length > 0)
      .map((line, index) => ({
        id: index.toString(),
        title: line,
        completed: false,
        week: Math.floor(index / 3) + 1
      }));
    
    setTasks(parsedTasks);
    toast({
      title: "Tasks Loaded",
      description: `Successfully loaded ${parsedTasks.length} tasks from file.`
    });
  };

  const handleTaskComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="p-6">
          <h1 className="text-3xl font-bold mb-4">Task Automation Assistant</h1>
          <p className="text-gray-600 mb-6">
            Upload your project plan text file to automatically generate and manage weekly tasks.
          </p>
          <FileUploader onFileUpload={handleFileUpload} />
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Current Week Progress</h2>
            <WeeklyProgress 
              tasks={tasks.filter(task => task.week === currentWeek)}
              week={currentWeek}
            />
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Weekly Tasks</h2>
            <TaskList 
              tasks={tasks.filter(task => task.week === currentWeek)}
              onTaskComplete={handleTaskComplete}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;