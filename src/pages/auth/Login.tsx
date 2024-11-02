import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [guestName, setGuestName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta ao AKAFLOW."
      });
      navigate('/');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: "Verifique suas credenciais e tente novamente."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      toast({
        variant: "destructive",
        title: "Nome obrigatório",
        description: "Por favor, insira seu nome para continuar como convidado."
      });
      return;
    }

    setIsLoading(true);
    const guestEmail = `guest_${Date.now()}@temporary.com`;
    const guestPassword = `Guest${Date.now()}!`;

    try {
      await register(guestEmail, guestPassword, guestName);
      toast({
        title: "Bem-vindo!",
        description: "Sua conta de convidado foi criada com sucesso."
      });
      navigate('/');
    } catch (error) {
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            AKAFLOW
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Gerencie suas tarefas e equipe de forma eficiente
          </p>
        </div>

        <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-t border-gray-100 dark:border-gray-800">
          {!showGuestForm ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Senha
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>

              <div className="relative my-4">
                <Separator />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white dark:bg-gray-900 px-2 text-sm text-gray-500">
                    ou
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setShowGuestForm(true)}
              >
                Continuar como Convidado
              </Button>

              <div className="text-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Não tem uma conta?{' '}
                </span>
                <Button
                  variant="link"
                  className="p-0 text-purple-600 dark:text-purple-400"
                  onClick={() => navigate('/auth/register')}
                >
                  Registre-se
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleGuestLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="guestName" className="text-sm font-medium">
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
                onClick={() => setShowGuestForm(false)}
              >
                Voltar
              </Button>
            </form>
          )}
        </Card>

        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Acesso por nível:</p>
          <div className="mt-2 space-x-2">
            <Badge variant="outline">Líder: Gerenciamento completo</Badge>
            <Badge variant="outline">Membro: Tarefas e colaboração</Badge>
            <Badge variant="outline">Convidado: Visualização limitada</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}