export type ContentCategory = 'task' | 'mindset' | 'appointment';

export interface AnalyzedContent {
  category: ContentCategory;
  content: string;
  metadata?: {
    date?: Date;
    priority?: number;
    type?: 'daily' | 'weekly' | 'monthly';
    location?: string;
    participants?: string[];
    xpReward?: number;
  };
}

export const analyzeContent = async (text: string): Promise<AnalyzedContent> => {
  const lowercaseText = text.toLowerCase();
  
  // Detect appointments
  if (lowercaseText.includes('reunião') || 
      lowercaseText.includes('encontro') || 
      lowercaseText.includes('às') ||
      lowercaseText.includes('agendado')) {
    return {
      category: 'appointment',
      content: text,
      metadata: {
        date: extractDate(text),
        type: 'daily',
        location: extractLocation(text),
        participants: extractParticipants(text)
      }
    };
  } 
  // Detect tasks/missions
  else if (lowercaseText.includes('tarefa') || 
           lowercaseText.includes('fazer') || 
           lowercaseText.includes('completar') ||
           lowercaseText.includes('missão')) {
    return {
      category: 'task',
      content: text,
      metadata: {
        priority: calculatePriority(text),
        type: determineTaskType(text),
        xpReward: calculateXPReward(text)
      }
    };
  }
  // Default to mindset/team content
  else {
    return {
      category: 'mindset',
      content: text
    };
  }
};

function extractDate(text: string): Date {
  // Simple date extraction - could be enhanced with a date parsing library
  const today = new Date();
  const timeMatch = text.match(/(\d{1,2}):(\d{2})/);
  if (timeMatch) {
    today.setHours(parseInt(timeMatch[1]), parseInt(timeMatch[2]));
  }
  return today;
}

function extractLocation(text: string): string {
  if (text.toLowerCase().includes('online')) return 'online';
  if (text.toLowerCase().includes('sala')) return 'presencial';
  return 'não especificado';
}

function extractParticipants(text: string): string[] {
  // Simple participant extraction - could be enhanced
  const participants = text.match(/com (.*?)(?=\.|$)/i);
  if (participants) {
    return participants[1].split(/[,e]+/).map(p => p.trim());
  }
  return [];
}

function calculatePriority(text: string): number {
  let priority = 1;
  if (text.toLowerCase().includes('urgente')) priority += 2;
  if (text.toLowerCase().includes('importante')) priority += 1;
  return Math.min(priority, 3);
}

function determineTaskType(text: string): 'daily' | 'weekly' | 'monthly' {
  if (text.toLowerCase().includes('semana')) return 'weekly';
  if (text.toLowerCase().includes('mês')) return 'monthly';
  return 'daily';
}

function calculateXPReward(text: string): number {
  let xp = 50; // Base XP
  const priority = calculatePriority(text);
  xp *= priority;
  if (text.length > 100) xp += 25; // Bonus for detailed tasks
  return xp;
}