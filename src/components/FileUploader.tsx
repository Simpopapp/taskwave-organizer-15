import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Upload, Lock, Mic, Star } from "lucide-react";
import { useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { VoiceInput } from "./VoiceInput";
import { cn } from "@/lib/utils";

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
          <VoiceInput onTranscriptionComplete={handleVoiceTranscription} />
        </div>
      </div>

      <div className="flex flex-col items-center space-y-4 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
        <div className="flex items-center gap-2">
          {isPremium ? (
            <>
              <Star className="w-6 h-6 text-yellow-500 animate-pulse" />
              <h3 className="text-lg font-semibold bg-gradient-to-r from-yellow-500 to-yellow-700 text-transparent bg-clip-text">
                AKALIBRE Premium
              </h3>
              <Star className="w-6 h-6 text-yellow-500 animate-pulse" />
            </>
          ) : (
            <>
              <Crown className="w-6 h-6 text-yellow-500" />
              <h3 className="text-lg font-semibold">AKALIBRE Premium</h3>
            </>
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full my-4">
          {[
            { title: "Análise Avançada", locked: !isPremium },
            { title: "Temas Exclusivos", locked: !isPremium },
            { title: "Entrada por Voz", locked: !isPremium },
            { title: "Priorização IA", locked: !isPremium },
            { title: "Templates Pro", locked: !isPremium },
            { title: "Colaboração", locked: !isPremium },
            { title: "Relatórios", locked: !isPremium },
            { title: "Suporte 24/7", locked: !isPremium },
          ].map((feature, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center justify-center p-3 bg-white rounded-lg shadow-sm relative transition-all duration-300",
                feature.locked && "hover:scale-105"
              )}
            >
              {feature.locked && (
                <Lock className="w-4 h-4 absolute top-2 right-2 text-gray-400" />
              )}
              <span className={feature.locked ? "text-gray-400" : "text-gray-700"}>
                {feature.title}
              </span>
            </div>
          ))}
        </div>

        <Button
          onClick={upgradeToPremium}
          disabled={isPremium}
          className={cn(
            "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700",
            "transition-all duration-300 hover:scale-105"
          )}
        >
          {isPremium ? (
            <span className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Premium Ativo
            </span>
          ) : (
            "Upgrade para Premium"
          )}
        </Button>

        <div className="flex flex-wrap gap-2 justify-center">
          <Badge variant="secondary">Nível {userLevel}</Badge>
          <Badge variant="outline">{userXp}/1000 XP</Badge>
          <Badge className={cn(
            "transition-all duration-300",
            isPremium ? "bg-gradient-to-r from-yellow-500 to-yellow-700" : "bg-gradient-to-r from-purple-500 to-blue-500"
          )}>
            {isPremium ? "Premium" : "Iniciante"}
          </Badge>
        </div>
      </div>
    </div>
  );
};