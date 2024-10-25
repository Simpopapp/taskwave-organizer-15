import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Lock, Mic } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { VoiceInput } from "./VoiceInput";
import ContentOrganizer, { ContentOrganizerRef } from "./ContentOrganizer";
import { cn } from "@/lib/utils";
import { AnalyzedContent } from '@/services/nlpService';
import { PremiumFeatures } from './PremiumFeatures';

interface FileUploaderProps {
  onFileUpload: (content: string) => void;
}

export const FileUploader = ({ onFileUpload }: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  const [userXp, setUserXp] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentOrganizerRef = useRef<ContentOrganizerRef>(null);

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

  const handleContentAnalyzed = (analyzedContent: AnalyzedContent) => {
    if (contentOrganizerRef.current) {
      contentOrganizerRef.current.addContent(analyzedContent);
    }
    trackInteraction("Conteúdo processado");
  };

  const handleVoiceTranscription = (transcribedText: string) => {
    if (!isPremium) {
      toast({
        title: "Recurso Premium",
        description: "Faça upgrade para Premium para usar a entrada por voz!",
        variant: "destructive",
      });
      return;
    }
    onFileUpload(transcribedText);
    trackInteraction("Texto transcrito por voz");
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      readFile(file);
    }
  };

  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileUpload(content);
      trackInteraction("Arquivo carregado");
    };
    reader.readAsText(file);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const trackInteraction = (action: string) => {
    setInteractionCount(prev => {
      const newCount = prev + 1;
      if (newCount % 3 === 0) {
        addExperiencePoints(400, "Interação completada");
      }
      return newCount;
    });
  };

  const addExperiencePoints = (points: number, action: string) => {
    setUserXp(prev => {
      const newXp = prev + points;
      const newLevel = Math.floor(newXp / 1000) + 1;
      
      if (newLevel > userLevel) {
        toast({
          title: "Nível Aumentado! 🎉",
          description: `Você alcançou o nível ${newLevel}!`,
          duration: 5000,
        });
        setUserLevel(newLevel);
      }
      return newXp;
    });
  };

  const upgradeToPremium = () => {
    setIsPremium(true);
    toast({
      title: "Bem-vindo ao AKALIBRE Premium! 👑",
      description: "Você desbloqueou recursos exclusivos!",
      duration: 5000,
    });
    addExperiencePoints(500, "Upgrade para Premium");
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
            onTranscriptionComplete={onFileUpload}
            onContentAnalyzed={handleContentAnalyzed}
          />
        </div>
      </div>

      <ContentOrganizer ref={contentOrganizerRef} />

      <PremiumFeatures
        isPremium={isPremium}
        userLevel={userLevel}
        userXp={userXp}
        onUpgradeToPremium={upgradeToPremium}
      />
    </div>
  );
};