import type { Issue } from './issue';
import type { User } from './user';

export const CategoryType = {
  SOFTWARE: 'SOFTWARE',
  MARKETING: 'MARKETING',
  BUSINESS: 'BUSINESS',
};

export type Project = {
  id: number;
  name: string;
  url?: string;
  description?: string;
  users: User[];
  issues: Issue[];
  category: keyof typeof CategoryType;
};
