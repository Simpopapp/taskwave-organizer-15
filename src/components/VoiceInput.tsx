import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { transcribeAudio } from '@/services/speechService';
import { analyzeContent } from '@/services/nlpService';

interface VoiceInputProps {
  onTranscriptionComplete: (text: string) => void;
  onContentAnalyzed: (analyzedContent: any) => void;
}

export const VoiceInput = ({ onTranscriptionComplete, onContentAnalyzed }: VoiceInputProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const mediaRecorder = React.useRef<MediaRecorder | null>(null);
  const audioChunks = React.useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        setIsProcessing(true);
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        
        try {
          const transcription = await transcribeAudio(audioBlob);
          onTranscriptionComplete(transcription.text);
          
          const analyzedContent = await analyzeContent(transcription.text);
          onContentAnalyzed(analyzedContent);
          
          toast({
            title: "Conteúdo processado",
            description: "Seu áudio foi transcrito e categorizado com sucesso!",
          });
        } catch (error) {
          toast({
            title: "Erro no processamento",
            description: "Não foi possível processar o áudio.",
            variant: "destructive",
          });
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      toast({
        title: "Gravação iniciada",
        description: "Fale o conteúdo que deseja processar.",
      });
    } catch (error) {
      toast({
        title: "Erro de acesso",
        description: "Não foi possível acessar o microfone.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-lg font-semibold">Entrada por Voz</h3>
      <Button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isProcessing}
        variant={isRecording ? "destructive" : "default"}
        className="w-full"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processando...
          </>
        ) : isRecording ? (
          <>
            <MicOff className="w-4 h-4 mr-2" />
            Parar Gravação
          </>
        ) : (
          <>
            <Mic className="w-4 h-4 mr-2" />
            Iniciar Gravação
          </>
        )}
      </Button>
    </div>
  );
};