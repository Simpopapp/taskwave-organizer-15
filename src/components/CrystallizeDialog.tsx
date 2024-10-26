import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CrystallizeDialogProps {
  onIdeaCrystallized: (idea: string) => void;
  className?: string;
}

export const CrystallizeDialog = ({ onIdeaCrystallized, className }: CrystallizeDialogProps) => {
  const [idea, setIdea] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const crystallizeIdea = async () => {
    if (!idea.trim()) {
      toast({
        title: "Ops!",
        description: "Por favor, compartilhe sua ideia primeiro.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Simulated AI processing - replace with actual AI integration
      const enhancedIdea = await new Promise<string>((resolve) => {
        setTimeout(() => {
          const improvements = [
            "Considere também o impacto a longo prazo",
            "Integre métricas de acompanhamento",
            "Adicione elementos de gamificação",
            "Estabeleça marcos claros",
          ];
          const enhancement = improvements[Math.floor(Math.random() * improvements.length)];
          resolve(`${idea}\n\nSugestões de melhoria:\n${enhancement}`);
        }, 1500);
      });

      onIdeaCrystallized(enhancedIdea);
      toast({
        title: "Ideia Cristalizada! ✨",
        description: "Sua ideia foi aprimorada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao processar",
        description: "Não foi possível cristalizar sua ideia no momento.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "group relative overflow-hidden bg-background hover:bg-background/80",
            "border-2 border-purple-500/20 hover:border-purple-500/40",
            "transition-all duration-300",
            className
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
          Cristalizar Ideia
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-lg border-purple-500/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            Cristalize sua Ideia
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Compartilhe sua ideia e deixe nossa IA ajudar a aprimorá-la com sugestões inteligentes.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <Textarea
            placeholder="Descreva sua ideia aqui..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            className="min-h-[120px] resize-none border-purple-500/20 focus:border-purple-500/40"
          />
          <Button
            onClick={crystallizeIdea}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Cristalizando...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Cristalizar
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};