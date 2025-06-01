/**
 * Node modules
 */
import { useSortable } from '@dnd-kit/sortable';

/**
 * Types
 */
import type { Issue as IssueType } from '@/types/issue';

/**
 * Icons
 */
import { IssuePriorityIcon, IssueTypeIcon } from './Icon';

/**
 * Components
 */
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/utils/tailwind';
import { CSS } from '@dnd-kit/utilities';

export const Issue = ({
  title,
  type,
  priority,
  id,
  className,
  users,
  status,
  listPosition,
}: IssueType & {
  className?: string;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({
    id,
    data: {
      type: 'Issue',
      status,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const handleClick = (e: React.MouseEvent) => {
    // Chỉ handle click khi không đang drag
    if (isDragging) {
      e.preventDefault();
      return;
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      onClick={handleClick}
      className={cn(
        'hover:bg-muted rounded-xs bg-white p-2 shadow-[0px_1px_2px_0px_rgba(9,30,66,0.25)] select-none hover:cursor-grab',
        isDragging && 'invisible',
        isOver && 'border-b-2 border-blue-300',
        className,
      )}
    >
      {import.meta.env.VITE_NODE_ENV === 'development' && (
        <div className="">{`INDEX: ${listPosition}`}</div>
      )}
      <h1 className="text-[15px] text-[#172b4d]">{title}</h1>
      <div className="mt-3 flex items-center gap-1">
        <IssueTypeIcon type={type} />
        <IssuePriorityIcon priority={priority} />
        <div className="flex flex-1 items-center justify-end -space-x-2">
          {users.map((user) => (
            <Avatar
              key={user.id}
              avatarUrl={user.avatarUrl}
              name={user.name}
              size={28}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
