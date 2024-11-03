import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GuestFormProps {
  onBack: () => void;
}

export function GuestForm({ onBack }: GuestFormProps) {
  const [guestName, setGuestName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();

  const handleGuestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName?.trim()) {
      toast({
        variant: "destructive",
        title: "Nome obrigatório",
        description: "Por favor, insira seu nome para continuar como convidado."
      });
      return;
    }

    setIsLoading(true);
    try {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const guestEmail = `guest_${timestamp}_${randomString}@guest.akaflow.app`;
      const guestPassword = `Guest${timestamp}${randomString}!`;

      await register(guestEmail, guestPassword, guestName, true);
      navigate('/');
    } catch (error: any) {
      console.error('Guest registration error:', error);
      let errorMessage = 'Por favor, tente novamente mais tarde.';
      
      if (error?.message?.includes('email_address_not_authorized')) {
        errorMessage = 'Erro na configuração do sistema. Por favor, contate o administrador.';
      }
      
      toast({
        variant: "destructive",
        title: "Erro ao criar conta de convidado",
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleGuestLogin} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="guestName" className="text-sm font-medium">
          Seu Nome
        </label>
        <Input
          id="guestName"
          type="text"
          placeholder="Como devemos te chamar?"
          value={guestName || ''}
          onChange={(e) => setGuestName(e.target.value)}
          required
          className="w-full"
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Criando conta...
          </>
        ) : (
          'Continuar como Convidado'
        )}
      </Button>

      <Button
        type="button"
        variant="ghost"
        className="w-full"
        onClick={onBack}
        disabled={isLoading}
      >
        Voltar
      </Button>
    </form>
  );
}