import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
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
    setIsLoading(true);

    const trimmedName = guestName.trim();
    if (!trimmedName) {
      toast({
        variant: "destructive",
        title: "Nome obrigatório",
        description: "Por favor, insira seu nome para continuar como convidado."
      });
      setIsLoading(false);
      return;
    }

    try {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const guestEmail = `guest_${timestamp}_${randomString}@guest.akaflow.app`;
      const guestPassword = `Guest${timestamp}${randomString}!`;

      await register(guestEmail, guestPassword, trimmedName, true);
      navigate('/');
    } catch (error: any) {
      console.error('Guest registration error:', error);
      toast({
        variant: "destructive",
        title: "Erro ao criar conta de convidado",
        description: "Por favor, tente novamente mais tarde."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleGuestLogin} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="guestName" className="text-sm font-medium text-gray-700">
          Seu Nome
        </label>
        <Input
          id="guestName"
          type="text"
          placeholder="Como devemos te chamar?"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          required
          className="w-full"
        />
      </div>

      <div className="space-y-2">
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
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>
    </form>
  );
}