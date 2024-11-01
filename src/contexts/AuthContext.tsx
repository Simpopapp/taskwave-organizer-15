import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AuthContextType, AuthUser } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Implement Supabase auth state listener
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // TODO: Implement Supabase auth.signIn
      const mockUser: AuthUser = {
        id: '1',
        email,
        role: 'member',
        name: 'John Doe'
      };
      setUser(mockUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      // TODO: Implement Supabase auth.signUp
      const isGuest = email.startsWith('guest_');
      const mockUser: AuthUser = {
        id: Date.now().toString(),
        email,
        role: isGuest ? 'guest' : 'member',
        name
      };
      setUser(mockUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      // TODO: Implement Supabase auth.signOut
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer logout');
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
      error,
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