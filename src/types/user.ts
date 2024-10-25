export type UserRole = 'leader' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  groupId: string;
}

export interface Group {
  id: string;
  name: string;
  leaderId: string;
  members: string[]; // Array of user IDs
}