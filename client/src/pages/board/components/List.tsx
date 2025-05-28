/**
 * Node modules
 */
import { useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

/**
 * Types
 */
import type { IssueStatus, Issue as IssueType } from '@/types/issue';

/**
 * Components
 */
import { Issue } from './Issue';
import { IssueStatusCopy } from '@/constants/issue';

export const List = ({
  id,
  status,
  issues,
}: {
  id: string;
  status: IssueStatus;
  issues: IssueType[];
}) => {
  // Sử dụng id của status làm id của droppable area
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: 'List',
      status,
    },
  });

  const issueIds = useMemo(() => issues.map((issue) => issue.id), [issues]);

  return (
    <div
      ref={setNodeRef}
      className="bg-muted min-w-[270px] flex-1 rounded-[3px] p-1 py-2 transition-colors duration-150"
    >
      <h1 className="text-accent-foreground mx-1 my-3 mt-1 text-xs uppercase">
        {IssueStatusCopy[status]}
      </h1>
      <div className="flex h-full flex-col gap-1">
        <SortableContext
          items={issueIds}
          strategy={verticalListSortingStrategy}
        >
          {issues.map((issue) => (
            <Issue key={issue.id} {...issue} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};
