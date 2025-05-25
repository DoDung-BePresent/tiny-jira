import type { User } from './user';

export enum IssueType {
  TASK = 'TASK',
  BUG = 'BUG',
  STORY = 'STORY',
}

export enum IssuePriority {
  LOWEST = 'LOWEST',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  HIGHEST = 'HIGHEST',
}

export enum IssueStatus {
  BACKLOG = 'BACKLOG',
  SELECTED = 'SELECTED',
  INPROGRESS = 'INPROGRESS',
  DONE = 'DONE',
}

export type Issue = {
  id: string;
  title: string;
  type: IssueType;
  status: IssueStatus;
  priority: IssuePriority;
  listPosition: number;
  description?: string;
  estimate?: number;
  timeSpend?: number;
  projectId: number;
  reportedId: number;
  users: User[];
};
