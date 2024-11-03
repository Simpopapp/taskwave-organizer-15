import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, AuthUser } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Session } from '@supabase/supabase-js';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        handleSession(session);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        handleSession(session);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSession = async (session: Session) => {
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

  const register = async (email: string, password: string, name: string, isGuest = false) => {
    try {
      setLoading(true);
      
      // Primeiro, verifica se o email já existe
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        throw new Error('Este email já está em uso');
      }

      // Tenta criar o usuário
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
        
        // Atualiza o perfil
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
    } catch (err) {
      console.error('Registration error:', err);
      toast({
        variant: "destructive",
        title: "Erro no registro",
        description: err instanceof Error ? err.message : 'Erro ao registrar usuário'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;

      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta!"
      });
    } catch (err) {
      console.error('Login error:', err);
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: err instanceof Error ? err.message : 'Credenciais inválidas'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      setUser(null);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: err instanceof Error ? err.message : 'Erro ao fazer logout'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const canEditUser = (userId: string) => {
    return user?.role === 'leader' || user?.id === userId;
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      canEditUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};