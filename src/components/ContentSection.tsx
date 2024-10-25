import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnalyzedContent } from "@/services/nlpService";
import { Calendar, Brain, CheckSquare } from "lucide-react";

interface ContentSectionProps {
  title: string;
  type: 'task' | 'mindset' | 'appointment';
  items: AnalyzedContent[];
}

export const ContentSection = ({ title, type, items }: ContentSectionProps) => {
  const getIcon = () => {
    switch (type) {
      case 'appointment':
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'mindset':
        return <Brain className="w-5 h-5 text-purple-500" />;
      case 'task':
        return <CheckSquare className="w-5 h-5 text-green-500" />;
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        {getIcon()}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <ScrollArea className="h-[200px]">
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <p className="text-sm text-gray-700">{item.content}</p>
              {item.metadata && (
                <div className="mt-2 text-xs text-gray-500">
                  {item.metadata.date && (
                    <p>Data: {item.metadata.date.toLocaleDateString()}</p>
                  )}
                  {item.metadata.client && <p>Cliente: {item.metadata.client}</p>}
                  {item.metadata.topic && <p>Tema: {item.metadata.topic}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};