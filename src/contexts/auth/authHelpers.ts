import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser } from '@/types/auth';
import { Toast } from '@/types/toast';

export const handleSession = async (
  session: Session,
  setUser: (user: AuthUser) => void,
  toast: Toast
) => {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profile) {
      setUser({
        id: session.user.id,
        email: session.user.email!,
        role: profile.role,
        name: session.user.user_metadata?.name || 'Usuário'
      });
    }
  } catch (err) {
    console.error('Error fetching profile:', err);
    toast({
      variant: "destructive",
      title: "Erro ao carregar perfil",
      description: "Por favor, tente novamente mais tarde."
    });
  }
};

export const handleLogin = async (
  email: string,
  password: string,
  toast: Toast
) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;

  toast({
    title: "Login realizado com sucesso!",
    description: "Bem-vindo de volta!"
  });
};

export const handleRegister = async (
  email: string,
  password: string,
  name: string,
  isGuest: boolean,
  setUser: (user: AuthUser) => void,
  toast: Toast
) => {
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role: isGuest ? 'guest' : 'member'
      }
    }
  });

  if (signUpError) throw signUpError;

  if (signUpData.user) {
    const userRole = isGuest ? 'guest' as const : 'member' as const;
    
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        role: userRole,
        allowed_email: true 
      })
      .eq('id', signUpData.user.id);

    if (profileError) throw profileError;

    setUser({
      id: signUpData.user.id,
      email: signUpData.user.email!,
      role: userRole,
      name
    });

    toast({
      title: "Registro realizado com sucesso!",
      description: isGuest ? "Bem-vindo! Você está conectado como convidado." : "Sua conta foi criada."
    });

    // Login automático após registro
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInError) throw signInError;
  }
};

export const handleLogout = async (
  setUser: (user: null) => void,
  toast: Toast
) => {
  const { error: signOutError } = await supabase.auth.signOut();
  if (signOutError) throw signOutError;
  setUser(null);
};