import { useState } from 'react';
import { AnalyzedContent } from '@/services/nlpService';
import { TaskType } from '@/types/task';

export const useContentManager = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [teamPosts, setTeamPosts] = useState<any[]>([]);

  const getCurrentWeek = (): number => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24 * 7));
  };

  const addContent = (content: AnalyzedContent) => {
    switch (content.category) {
      case 'task':
        const newTask: TaskType = {
          id: Date.now().toString(),
          title: content.content,
          description: '',
          completed: false,
          week: getCurrentWeek(),
          xpReward: content.metadata?.xpReward || 50,
          priority: content.metadata?.priority as 'low' | 'medium' | 'high' || 'medium',
          dueDate: new Date(),
          status: 'pending',
          assigneeId: '',
          createdBy: '',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setTasks(prev => [...prev, newTask]);
        break;
      
      case 'appointment':
        const newAppointment = {
          title: content.content,
          date: content.metadata?.date || new Date(),
          type: content.metadata?.location || 'não especificado',
          participants: content.metadata?.participants || []
        };
        setAppointments(prev => [...prev, newAppointment]);
        break;
      
      case 'mindset':
        const newPost = {
          id: Date.now().toString(),
          content: content.content,
          author: { name: 'Sistema', avatar: '' },
          timestamp: new Date()
        };
        setTeamPosts(prev => [...prev, newPost]);
        break;
    }
  };

  return {
    tasks,
    appointments,
    teamPosts,
    addContent,
  };
};