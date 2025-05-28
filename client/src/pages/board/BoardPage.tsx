/**
 * Node modules
 */
import { useCallback, useEffect, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
  useSensors,
  PointerSensor,
  useSensor,
  KeyboardSensor,
} from '@dnd-kit/core';
import { throttle } from 'lodash';

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
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

export const BoardPage = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);
  const [isAfter, setIsAfter] = useState(false);

  const { data: projects, isLoading } = useQuery({
    queryKey: ['auth-user'],
    queryFn: projectService.getProjects,
  });

  useEffect(() => {
    if (projects?.[0]?.issues) {
      setIssues(projects[0].issues);
    }
  }, [projects]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { id } = event.active;
    const issue = issues.find((i: Issue) => i.id === id);
    if (issue) setActiveIssue(issue);
  };

  const handleDragOver = useCallback(
    throttle((event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeId = active.id;
      const overId = over.id;

      if (activeId === overId) return;

      const isActiveIssue = active.data.current?.type === 'Issue';
      const isOverIssue = over.data.current?.type === 'Issue';

      if (isActiveIssue && isOverIssue) {
        const activeIssueStatus = active.data.current?.status;
        const overIssueStatus = over.data.current?.status;

        if (activeIssueStatus === overIssueStatus) {
          setIssues((prev) => {
            const activeIndex = prev.findIndex((i) => i.id === activeId);
            const overIndex = prev.findIndex((i) => i.id === overId);

            const newIssues = [...prev];
            const activeIssue = { ...newIssues[activeIndex] };
            activeIssue.status = newIssues[overIndex].status;
            newIssues[activeIndex] = activeIssue;
            return arrayMove(prev, activeIndex, overIndex);
          });
        } else {
          setIssues((prev) => {
            const activeIndex = prev.findIndex((i) => i.id === activeId);

            const newIssues = [...prev];
            const activeIssue = { ...newIssues[activeIndex] };
            activeIssue.status = overIssueStatus;
            newIssues[activeIndex] = activeIssue;
            return newIssues;
          });
        }
      }

      const isOverList = over.data.current?.type === 'List';
      const overListStatus = over.data.current?.status;

      if (isOverList && isActiveIssue) {
        setIssues((prev) => {
          const activeIndex = prev.findIndex((i) => i.id === activeId);
          const newIssues = [...prev];
          const activeIssue = { ...newIssues[activeIndex] };
          activeIssue.status = overListStatus;
          newIssues[activeIndex] = activeIssue;
          return newIssues;
        });
      }
    }, 100),
    [],
  );

  const handleDragEnd = (event: DragEndEvent) => {
    // const { active, over } = event;
    setActiveIssue(null);
  };

  if (isLoading) return <p>Loading</p>;
  if (!projects?.length) return <p>No projects found</p>;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
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
