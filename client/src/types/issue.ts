import type { User } from './user';

export const IssueType = {
  TASK: 'TASK',
  BUG: 'BUG',
  STORY: 'STORY',
};

export const IssuePriority = {
  LOWEST: 'LOWEST',
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  HIGHEST: 'HIGHEST',
};

export const IssueStatus = {
  BACKLOG: 'BACKLOG',
  SELECTED: 'SELECTED',
  INPROGRESS: 'INPROGRESS',
  DONE: 'DONE',
};

export type Issue = {
  id: number;
  title: string;
  type: keyof typeof IssueType;
  status: keyof typeof IssueStatus;
  priority: keyof typeof IssuePriority;
  listPosition: number;
  description?: string;
  estimate?: number;
  timeSpend?: number;
  projectId: number;
  reportedId: number;
  users: User[];
};

export type UpdateIssuePayload = {
  issueId: number;
  data: {
    status: keyof typeof IssueStatus;
    listPosition: number;
  };
};
