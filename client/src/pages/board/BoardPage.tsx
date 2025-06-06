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
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

/**
 * Types
 */
import {
  IssueStatus,
  type Issue,
  type UpdateIssuePayload,
} from '@/types/issue';

/**
 * Components
 */
import { List } from './components/List';
import { Filter } from './components/Filter';
import { IssueDetail } from './components/IssueDetail';
import { Issue as IssueComponent } from './components/Issue';
import { Dialog, DialogContent } from '@/components/ui/Dialog';

/**
 * Services
 */
import { projectService } from '@/services/projectService';
import { issueService } from '@/services/issueService';

/**
 * Utils
 */
import { calculateNewPosition } from '@/utils/issue';

/**
 * Hooks
 */
import { useToast } from '@/hooks/useToast';
import { Combobox } from '@/components/ui/Combobox';

export const BoardPage = () => {
  const { toast } = useToast();
  const { issueId } = useParams<{ issueId: string }>();
  const navigate = useNavigate();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: projectService.getProjects,
  });

  const updateIssueMutation = useMutation({
    mutationFn: (data: UpdateIssuePayload) => issueService.updateIssue(data),
    onSuccess: () => {
      toast.success({
        title: 'Successfully!',
        description: 'Save issue successfully!',
      });
    },
    onError: (error) => {
      console.error('Failed to update issue:', error);
    },
  });

  useEffect(() => {
    if (projects?.[0]?.issues) {
      setIssues(
        projects[0].issues.sort((a, b) => a.listPosition - b.listPosition),
      );
    }
  }, [projects]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { id } = event.active;
    const issue = issues.find((i: Issue) => i.id === id);
    if (issue) setActiveIssue(issue);
  };

  /**
   * Hạn chế:
   * 1. Hàm bị cập nhật lại listPosition mỗi khi click vào issue, dù không có sự thay đổi về vị trí!
   * 2. Hàm khi hover over 1 column thì ghi nhận vào column đó nhưng kéo quá khỏi column đó vẫn còn ghi nhận!
   */
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

  /**
   * Truong hop nhan 1 lan nhung ham handleDragEnd van chay
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active } = event;
    setActiveIssue(null);

    if (!active) return;

    const activeId = active.id;

    const activeIssue = issues.find((issue) => issue.id === activeId);

    if (!activeIssue) return;

    const issuesInColumn = issues.filter(
      (i) => i.status === activeIssue?.status,
    );

    const droppedIndex = issuesInColumn.findIndex(
      (i) => i.id === activeIssue?.id,
    );

    const newPosition = calculateNewPosition(issuesInColumn, droppedIndex);

    updateIssueMutation.mutate({
      issueId: activeId as number,
      data: {
        status: activeIssue?.status!,
        listPosition: newPosition,
      },
    });
  };

  const handleCloseIssueDialog = () => {
    navigate('/project/board');
  };

  if (isLoading) return <p>Loading</p>;
  if (!projects?.length) return <p>No projects found</p>;

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <h1 className="mt-1 text-2xl font-medium text-[rgb(23,43,77)]">
          Kanban board
        </h1>
        <Combobox
          options={[
            { value: '1', label: 'Option 1' },
            { value: '2', label: 'Option 2' },
          ]}
          // value={selected}
          // onChange={setSelected}
          placeholder="Select something..."
        />
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
      {/* Issue Detail Dialog */}
      <Dialog open={!!issueId} onOpenChange={handleCloseIssueDialog}>
        <DialogContent>
          {issueId && (
            <IssueDetail issueId={issueId} onClose={handleCloseIssueDialog} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
