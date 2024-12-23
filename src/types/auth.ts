export type UserRole = 'guest' | 'member' | 'leader';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, isGuest?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  canEditUser: (userId: string) => boolean;
}