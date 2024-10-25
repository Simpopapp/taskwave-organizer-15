import { useState } from 'react';
import { ContentSection } from './ContentSection';
import { AnalyzedContent } from '@/services/nlpService';

export const ContentOrganizer = () => {
  const [tasks, setTasks] = useState<AnalyzedContent[]>([]);
  const [mindsets, setMindsets] = useState<AnalyzedContent[]>([]);
  const [appointments, setAppointments] = useState<AnalyzedContent[]>([]);

  const addContent = (content: AnalyzedContent) => {
    switch (content.category) {
      case 'task':
        setTasks(prev => [...prev, content]);
        break;
      case 'mindset':
        setMindsets(prev => [...prev, content]);
        break;
      case 'appointment':
        setAppointments(prev => [...prev, content]);
        break;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ContentSection
        title="Tarefas"
        type="task"
        items={tasks}
      />
      <ContentSection
        title="Mindset"
        type="mindset"
        items={mindsets}
      />
      <ContentSection
        title="Compromissos"
        type="appointment"
        items={appointments}
      />
    </div>
  );
};