import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, Group } from '@/types/user';

interface AuthContextType {
  currentUser: User | null;
  currentGroup: Group | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  canEditUser: (userId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);

  const login = async (email: string, password: string) => {
    // Mock login - replace with actual authentication
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email: email,
      role: 'leader',
      groupId: 'group1'
    };

    const mockGroup: Group = {
      id: 'group1',
      name: 'Team Alpha',
      leaderId: '1',
      members: ['1', '2', '3']
    };

    setCurrentUser(mockUser);
    setCurrentGroup(mockGroup);
  };

  const logout = useCallback(() => {
    setCurrentUser(null);
    setCurrentGroup(null);
  }, []);

  const canEditUser = useCallback((userId: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'leader') return true;
    return currentUser.id === userId;
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{
      currentUser,
      currentGroup,
      login,
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