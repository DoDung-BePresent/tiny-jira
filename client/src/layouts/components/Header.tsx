import { Breadcrumb } from '@/components/ui/Breadcrumb';

export const Header = () => {
  return (
    <div>
      <Breadcrumb items={['Projects', 'singularity 5', 'Kanban Board']} />
    </div>
  );
};
