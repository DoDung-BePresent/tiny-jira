/**
 * Node modules
 */
import { useEffect, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';

/**
 * Types
 */
import { IssueStatus, type Issue } from '@/types/issue';

/**
 * Components
 */
import { List } from './components/List';
import { Filter } from './components/Filter';
import { Issue as IssueComponent } from './components/Issue';
import { useQuery } from '@tanstack/react-query';
import { projectService } from '@/services/projectService';
import { arrayMove } from '@dnd-kit/sortable';

export const BoardPage = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);

  const { data: projects, isLoading } = useQuery({
    queryKey: ['auth-user'],
    queryFn: projectService.getProjects,
  });

  useEffect(() => {
    if (projects?.[0]?.issues) {
      setIssues(projects[0].issues);
    }
  }, [projects]);

  const handleDragStart = (event: DragStartEvent) => {
    const { id } = event.active;
    const issue = issues.find((i: Issue) => i.id === id);
    if (issue) setActiveIssue(issue);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveIssue(null);
    const { active, over } = event;
    if (!over) return;

    const activeIndex = issues.findIndex((i) => i.id === active.id);
    const overIndex = issues.findIndex((i) => i.id === over.id);

    if (activeIndex !== overIndex) {
      setIssues((pre) => arrayMove(pre, activeIndex, overIndex));
    }
  };

  if (isLoading) return <p>Loading</p>;
  if (!projects?.length) return <p>No projects found</p>;

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <h1 className="mt-1 text-2xl font-medium text-[rgb(23,43,77)]">
        Kanban board
      </h1>
      <Filter />
      <div className="mt-6 flex gap-2">
        {Object.values(IssueStatus).map((status) => (
          <List
            id={status}
            key={status}
            status={status}
            issues={issues.filter((i) => i.status === status)}
          />
        ))}
      </div>
      <DragOverlay>
        {activeIssue && (
          <IssueComponent
            {...activeIssue}
            className="rotate-3 shadow-[5px_10px_30px_0px_rgba(9,30,66,0.15)] hover:bg-white"
          />
        )}
      </DragOverlay>
    </DndContext>
  );
};
