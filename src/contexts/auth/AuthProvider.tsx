import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { AuthUser } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Session } from '@supabase/supabase-js';
import { handleSession, handleLogin, handleRegister, handleLogout } from './authHelpers';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        handleSession(session, setUser, toast);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        handleSession(session, setUser, toast);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await handleLogin(email, password, toast);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, isGuest = false) => {
    setLoading(true);
    try {
      await handleRegister(email, password, name, isGuest, setUser, toast);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await handleLogout(setUser, toast);
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