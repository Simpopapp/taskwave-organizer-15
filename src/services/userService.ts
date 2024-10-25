import { User, Group, UserRole } from '@/types/user';

// Mock database
let users: User[] = [];
let groups: Group[] = [];

export const createUser = async (
  name: string,
  email: string,
  role: UserRole,
  groupId?: string
): Promise<User> => {
  const userId = Math.random().toString(36).substr(2, 9);
  
  // If user is a leader, create a new group
  let userGroupId = groupId;
  if (role === 'leader') {
    const group: Group = {
      id: Math.random().toString(36).substr(2, 9),
      name: `${name}'s Group`,
      leaderId: userId,
      members: [userId]
    };
    groups.push(group);
    userGroupId = group.id;
  }

  const user: User = {
    id: userId,
    name,
    email,
    role,
    groupId: userGroupId!
  };

  users.push(user);
  return user;
};

export const getGroupUsers = async (groupId: string): Promise<User[]> => {
  return users.filter(user => user.groupId === groupId);
};

export const updateUser = async (userId: string, updates: Partial<User>): Promise<User> => {
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) throw new Error('User not found');
  
  users[userIndex] = { ...users[userIndex], ...updates };
  return users[userIndex];
};

export const getGroup = async (groupId: string): Promise<Group | null> => {
  return groups.find(g => g.id === groupId) || null;
};