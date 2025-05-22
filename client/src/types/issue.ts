export type IssueType = "task" | "bug" | "story"

export type IssuePriority = "low" | "medium" | "high"

export type Issue = {
  id: string;
  title: string;
  type: IssueType;
  priority: IssuePriority;
  users: {
    avatarUrl: string;
    name: string
  }[]
}