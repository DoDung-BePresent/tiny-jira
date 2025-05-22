import type { IssuePriority, IssueType } from '@/types/issue';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BookmarkIcon,
  CircleAlertIcon,
  SquareCheckIcon,
} from 'lucide-react';

export const IssueTypeIcon = ({ type }: { type: IssueType }) => {
  switch (type) {
    case 'task':
      return (
        <BookmarkIcon
          fill="rgb(101,186,67)"
          strokeOpacity={0}
          className="size-5"
        />
      );
    case 'bug':
      return (
        <CircleAlertIcon
          fill="rgb(228,77,66)"
          className="size-5 stroke-white"
        />
      );
    case 'story':
      return (
        <SquareCheckIcon
          fill="rgb(79,173,230)"
          className="size-5 stroke-white"
        />
      );
    default:
      return null;
  }
};

export const IssuePriorityIcon = ({
  priority,
}: {
  priority: IssuePriority;
}) => {
  switch (priority) {
    case 'low':
      return <ArrowDownIcon className="size-5 text-green-500" />;
    case 'medium':
      return <ArrowUpIcon className="size-5 text-orange-500" />;
    case 'high':
      return <ArrowUpIcon className="size-5 text-red-500" />;
    default:
      break;
  }
};
