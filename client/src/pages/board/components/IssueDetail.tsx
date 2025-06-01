/**
 * Node modules
 */
import { useQuery } from '@tanstack/react-query';
import { TrashIcon, X } from 'lucide-react';

/**
 * Types
 */
import { IssueStatus, type Issue } from '@/types/issue';

/**
 * Components
 */
import { Avatar } from '@/components/ui/Avatar';
import { IssuePriorityIcon, IssueTypeIcon } from './Icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { IssueStatusCopy } from '@/constants/issue';

interface IssueDetailProps {
  issueId: string;
  onClose: () => void;
}

export const IssueDetail = ({ issueId, onClose }: IssueDetailProps) => {
  // Temporary - get issue from existing data
  // Later you can create a separate API call for single issue
  const { data: projects } = useQuery({
    queryKey: ['projects'],
  });

  const issue = projects?.[0]?.issues?.find(
    (i: Issue) => i.id.toString() === issueId,
  );

  if (!issue) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p>Issue not found</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IssueTypeIcon type={issue.type} />
          <span className="text-sm text-gray-600">
            {issue.type}-{issue.id}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-muted-foreground flex size-8 items-center justify-center rounded-sm p-1 hover:bg-gray-100">
            <TrashIcon size={20} />
          </button>
          <button
            onClick={onClose}
            className="text-muted-foreground flex size-8 items-center justify-center rounded-sm p-1 hover:bg-gray-100"
          >
            <X />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6 grid grid-cols-3 gap-5">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Title */}
          <div>
            <h1 className="text-2xl font-medium text-[#172b4d]">
              {issue.title}
            </h1>
          </div>

          {/* Description */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-[#5e6c84]">
              Description
            </h3>
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: issue.description || 'No description provided.',
              }}
            />
          </div>

          {/* Comments Section */}
          <div>
            <h3 className="mb-4 text-sm font-medium text-[#5e6c84]">
              Comments
            </h3>
            <div className="space-y-4">
              {/* Add comment form */}
              <div className="flex gap-3">
                <Avatar size={32} name="Current User" />
                <div className="flex-1">
                  <textarea
                    placeholder="Add a comment..."
                    className="w-full rounded border p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    rows={3}
                  />
                  <div className="mt-2 flex gap-2">
                    <button className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">
                      Save
                    </button>
                    <button className="rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div>
            <label className="block text-xs font-medium text-[#5e6c84] uppercase">
              Status
            </label>
            <div className="mt-1">
              <Select
                defaultValue={issue?.status}
                className="w-64"
                renderValue={(value) => <span>{IssueStatusCopy[value]}</span>}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(IssueStatus).map((status) => (
                    <SelectItem value={status}>
                      {IssueStatusCopy[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Assignees */}
          <div>
            <label className="block text-xs font-medium text-[#5e6c84] uppercase">
              Assignees
            </label>
            <div className="mt-2 flex gap-2">
              {issue.users.map((user) => (
                <Avatar
                  key={user.id}
                  avatarUrl={user.avatarUrl}
                  name={user.name}
                  size={32}
                />
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-medium text-[#5e6c84] uppercase">
              Priority
            </label>
            <div className="mt-1 flex items-center gap-2">
              <IssuePriorityIcon priority={issue.priority} />
              <span className="text-sm">{issue.priority}</span>
            </div>
          </div>

          {/* Time Tracking */}
          {(issue.estimate || issue.timeSpend) && (
            <div>
              <label className="block text-xs font-medium text-[#5e6c84] uppercase">
                Time Tracking
              </label>
              <div className="mt-2 space-y-1 text-sm">
                {issue.estimate && <div>Estimated: {issue.estimate}h</div>}
                {issue.timeSpend && <div>Time spent: {issue.timeSpend}h</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
