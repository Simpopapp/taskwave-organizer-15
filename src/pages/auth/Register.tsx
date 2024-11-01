import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(email, password, name);
      toast({
        title: "Registro realizado com sucesso!",
        description: "Sua conta foi criada.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Erro ao registrar",
        description: error instanceof Error ? error.message : "Tente novamente mais tarde",
        variant: "destructive",
      });
    }
  };

  const handleGuestAccess = async () => {
    const guestName = prompt("Digite seu nome para continuar como convidado:");
    if (!guestName) return;
    
    try {
      await register(
        `guest_${Date.now()}@temp.com`,
        Math.random().toString(36).slice(-8),
        guestName
      );
      toast({
        title: "Bem-vindo!",
        description: "Você entrou como convidado.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Erro ao entrar como convidado",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Registro</h1>
          <p className="text-gray-600">Crie sua conta para começar</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nome
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Registrar
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              ou
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={handleGuestAccess}
        >
          Entrar como Convidado
        </Button>

        <p className="text-center text-sm">
          Já tem uma conta?{" "}
          <Button variant="link" onClick={() => navigate("/auth/login")}>
            Faça login
          </Button>
        </p>
      </Card>
    </div>
  );
}