export type ContentCategory = 'task' | 'mindset' | 'appointment';

export interface AnalyzedContent {
  category: ContentCategory;
  content: string;
  metadata?: {
    date?: Date;
    client?: string;
    topic?: string;
  };
}

export const analyzeContent = async (text: string): Promise<AnalyzedContent> => {
  // Mock implementation - replace with actual Dialogflow API integration
  const lowercaseText = text.toLowerCase();
  
  if (lowercaseText.includes('reunião') || lowercaseText.includes('encontro')) {
    return {
      category: 'appointment',
      content: text,
      metadata: {
        date: new Date(),
        client: 'Cliente Exemplo',
        topic: 'Tema da Reunião'
      }
    };
  } else if (lowercaseText.includes('lembrar') || lowercaseText.includes('mindset')) {
    return {
      category: 'mindset',
      content: text
    };
  } else {
    return {
      category: 'task',
      content: text
    };
  }
};