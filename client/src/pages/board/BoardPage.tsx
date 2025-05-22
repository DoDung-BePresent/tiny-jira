/**
 * Node modules
 */
import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';

/**
 * Types
 */
import type { Issue } from '@/types/issue';

/**
 * Components
 */
import { List } from './components/List';
import { Filter } from './components/Filter';
import { arrayMove } from '@dnd-kit/sortable';
import { Issue as IssueComponent } from './components/Issue';

type Project = {
  id: string;
  status: string;
  issues: Issue[];
};

const initialProjectsData: Project[] = [
  {
    id: 'project-1',
    status: 'backlog',
    issues: [
      {
        id: 'issue-1',
        title: 'This is an issue of type: Task.',
        type: 'task',
        priority: 'high',
        users: [
          {
            avatarUrl: 'https://i.ibb.co/6RJ5hq6/gaben.jpg',
            name: 'John',
          },
          {
            avatarUrl: 'https://i.ibb.co/6n0hLML/baby-yoda.jpg',
            name: 'Adam',
          },
          {
            avatarUrl: 'https://i.ibb.co/7JM1P2r/picke-rick.jpg',
            name: 'Tom',
          },
        ],
      },
      {
        id: 'issue-2',
        title:
          'Each issue has a single reporter but can have multiple assignees.',
        type: 'story',
        priority: 'medium',
        users: [
          {
            avatarUrl: 'https://i.ibb.co/6RJ5hq6/gaben.jpg',
            name: 'John',
          },
          {
            avatarUrl: 'https://i.ibb.co/7JM1P2r/picke-rick.jpg',
            name: 'Tom',
          },
        ],
      },
      {
        id: 'issue-3',
        title: 'You can use rich text with images in issue descriptions.',
        type: 'bug',
        priority: 'low',
        users: [
          {
            avatarUrl: 'https://i.ibb.co/7JM1P2r/picke-rick.jpg',
            name: 'Tom',
          },
        ],
      },
    ],
  },
  {
    id: 'project-2',
    status: 'selected for development',
    issues: [
      {
        id: 'issue-4',
        title: "Click on an issue to see what's behind it.",
        type: 'task',
        priority: 'low',
        users: [
          {
            avatarUrl: 'https://i.ibb.co/6RJ5hq6/gaben.jpg',
            name: 'John',
          },
        ],
      },
      {
        id: 'issue-5',
        title:
          'You can track how many hours were spent working on an issue, and how many hours remain.',
        type: 'task',
        priority: 'low',
        users: [],
      },
      {
        id: 'issue-6',
        title:
          'Try dragging issues to different columns to transition their status.',
        type: 'story',
        priority: 'low',
        users: [
          {
            avatarUrl: 'https://i.ibb.co/7JM1P2r/picke-rick.jpg',
            name: 'Tom',
          },
        ],
      },
    ],
  },
  {
    id: 'project-3',
    status: 'in process',
    issues: [
      {
        id: 'issue-7',
        title: 'Each issue can be assigned priority from lowest to highest.',
        type: 'task',
        priority: 'high',
        users: [],
      },
    ],
  },
  {
    id: 'project-4',
    status: 'done',
    issues: [
      {
        id: 'issue-8',
        title: 'Try leaving a comment on this issue.',
        type: 'task',
        priority: 'medium',
        users: [
          {
            avatarUrl: 'https://i.ibb.co/6RJ5hq6/gaben.jpg',
            name: 'John',
          },
        ],
      },
    ],
  },
];

export const BoardPage = () => {
  const [projects, setProjects] = useState<Project[]>(initialProjectsData);
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);

  // Lấy tất cả issue ids để truyền vào SortableContext
  const allIssueIds = projects.flatMap((p) => p.issues.map((i) => i.id));

  const findIssueById = (id: string) => {
    for (const project of projects) {
      const issue = project.issues.find((i) => i.id === id);
      if (issue) return { issue, projectId: project.id };
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { id } = event.active;
    const found = findIssueById(id as string);
    if (found) setActiveIssue(found.issue);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveIssue(null);
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Tìm project chứa active và over
    let sourceProjectId: string | null = null;
    let destProjectId: string | null = null;
    projects.forEach((project) => {
      if (project.issues.some((i) => i.id === activeId))
        sourceProjectId = project.id;
      if (project.issues.some((i) => i.id === overId))
        destProjectId = project.id;
    });

    if (!sourceProjectId || !destProjectId) return;

    setProjects((prev) => {
      let activeIssue: Issue | undefined;
      return prev
        .map((project) => {
          // Xóa khỏi project cũ
          if (project.id === sourceProjectId) {
            const idx = project.issues.findIndex((i) => i.id === activeId);
            if (idx !== -1) {
              activeIssue = project.issues[idx];
              const newIssues = [...project.issues];
              newIssues.splice(idx, 1);
              return { ...project, issues: newIssues };
            }
          }
          return project;
        })
        .map((project) => {
          // Thêm vào project mới
          if (project.id === destProjectId && activeIssue) {
            const idx = project.issues.findIndex((i) => i.id === overId);
            const newIssues = [...project.issues];
            newIssues.splice(idx, 0, activeIssue);
            return { ...project, issues: newIssues };
          }
          return project;
        });
    });
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <h1 className="mt-1 text-2xl font-medium text-[rgb(23,43,77)]">
        Kanban board
      </h1>
      <Filter />
      <div className="mt-6 flex gap-2">
        {projects.map((project) => (
          <List
            id={project.id}
            key={project.id}
            title={project.status}
            issues={project.issues}
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
