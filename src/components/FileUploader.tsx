import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Lock, Mic } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { VoiceInput } from "./VoiceInput";
import { ContentOrganizerRef } from "./ContentOrganizer";
import { cn } from "@/lib/utils";
import { AnalyzedContent, analyzeContent } from '@/services/nlpService';
import { TaskType } from "@/types/task";
import { useContentManager } from '@/hooks/useContentManager';

interface FileUploaderProps {
  onFileUpload: (content: string) => void;
}

export const FileUploader = ({ onFileUpload }: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentOrganizerRef = useRef<ContentOrganizerRef>(null);
  const { addContent } = useContentManager();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      readFile(file);
    }
  };

  const handleVoiceTranscription = async (transcribedText: string) => {
    if (!isPremium) {
      toast({
        title: "Recurso Premium",
        description: "Faça upgrade para Premium para usar a entrada por voz!",
        variant: "destructive",
      });
      return;
    }
    await processContent(transcribedText);
  };

  const readFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      const lines = content.split('\n');
      
      for (const line of lines) {
        if (line.trim()) {
          await processContent(line.trim());
        }
      }
    };
    reader.readAsText(file);
  };

  const processContent = async (content: string) => {
    const analyzedContent = await analyzeContent(content);
    addContent(analyzedContent);
    
    toast({
      title: "Conteúdo Processado",
      description: `Novo ${analyzedContent.category} adicionado com sucesso!`
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      readFile(file);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-all",
            isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <Upload className="w-12 h-12 mx-auto text-gray-400" />
            <p className="text-gray-600">
              Arraste e solte seu arquivo de planejamento aqui, ou
            </p>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".txt,.md,.csv"
                onChange={handleFileInput}
              />
              <Button 
                variant="outline" 
                onClick={handleBrowseClick}
                className="mx-auto"
              >
                Procurar Arquivos
              </Button>
            </div>
          </div>
        </div>

        <div className={cn(
          "border-2 rounded-lg p-8 transition-all relative",
          !isPremium && "opacity-75 hover:opacity-100"
        )}>
          {!isPremium && (
            <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px] rounded-lg flex items-center justify-center">
              <Lock className="w-8 h-8 text-gray-500 animate-pulse" />
            </div>
          )}
          <VoiceInput 
            onTranscriptionComplete={handleVoiceTranscription}
            onContentAnalyzed={processContent}
          />
        </div>
      </div>
    </div>
  );
};