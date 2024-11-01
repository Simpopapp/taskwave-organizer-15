import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Card } from '@/components/ui/card';

export default function Register() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Registro</h1>
          <p className="text-gray-600">Crie sua conta para começar</p>
        </div>
        
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#2563eb',
                  brandAccent: '#1d4ed8',
                }
              }
            }
          }}
          view="sign_up"
          providers={[]}
          localization={{
            variables: {
              sign_up: {
                email_label: 'Email',
                password_label: 'Senha',
                button_label: 'Registrar',
                loading_button_label: 'Registrando...',
                social_provider_text: 'Registrar com {{provider}}',
                link_text: 'Já tem uma conta? Entre'
              }
            }
          }}
        />
      </Card>
    </div>
  );
}