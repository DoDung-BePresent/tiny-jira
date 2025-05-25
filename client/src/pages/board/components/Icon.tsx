import { IssuePriority, IssueType } from '@/types/issue';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BookmarkIcon,
  CircleAlertIcon,
  SquareCheckIcon,
} from 'lucide-react';

export const IssueTypeIcon = ({ type }: { type: IssueType }) => {
  switch (type) {
    case IssueType.TASK:
      return (
        <BookmarkIcon
          fill="rgb(101,186,67)"
          strokeOpacity={0}
          className="size-5"
        />
      );
    case IssueType.BUG:
      return (
        <CircleAlertIcon
          fill="rgb(228,77,66)"
          className="size-5 stroke-white"
        />
      );
    case IssueType.STORY:
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
    case IssuePriority.LOW:
      return <ArrowDownIcon className="size-5 text-green-500" />;
    case IssuePriority.MEDIUM:
      return <ArrowUpIcon className="size-5 text-orange-500" />;
    case IssuePriority.HIGH:
      return <ArrowUpIcon className="size-5 text-red-500" />;
    default:
      break;
  }
};
