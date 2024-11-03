import React, { useState, useEffect, createContext, useContext } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AuthUser, AuthContextType, UserRole } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

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
          role: profile.role as UserRole,
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

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta!"
      });
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, isGuest = false) => {
    setLoading(true);
    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: isGuest ? 'guest' as UserRole : 'member' as UserRole
          }
        }
      });

      if (signUpError) throw signUpError;

      if (signUpData.user) {
        const userRole = isGuest ? 'guest' as UserRole : 'member' as UserRole;
        
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
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro no registro",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
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