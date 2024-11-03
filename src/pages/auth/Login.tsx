import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LoginForm } from './components/LoginForm';
import { GuestForm } from './components/GuestForm';

export default function Login() {
  const [showGuestForm, setShowGuestForm] = useState(false);

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
            <>
              <LoginForm />
              <div className="relative my-4">
                <Separator />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white dark:bg-gray-900 px-2 text-sm text-gray-500">
                    ou
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowGuestForm(true)}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Continuar como Convidado
              </button>
            </>
          ) : (
            <GuestForm onBack={() => setShowGuestForm(false)} />
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