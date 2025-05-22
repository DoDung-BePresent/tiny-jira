/**
 * Node modules
 */
import { SearchIcon } from 'lucide-react';

/**
 * Components
 */
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Separator } from '@/components/ui/Separator';

export const Filter = () => {
  return (
    <div className="mt-7 flex items-center gap-4">
      <Input className="bg-muted" icon={SearchIcon} />
      <div className="flex items-center -space-x-1.5">
        <Avatar
          avatarUrl="https://i.ibb.co/6RJ5hq6/gaben.jpg"
          className="transition-[translate] duration-150 hover:-translate-y-2"
        />
        <Avatar
          avatarUrl="https://i.ibb.co/6n0hLML/baby-yoda.jpg"
          className="transition-[translate] duration-150 hover:-translate-y-2"
        />
        <Avatar
          avatarUrl="https://i.ibb.co/7JM1P2r/picke-rick.jpg"
          className="transition-[translate] duration-150 hover:-translate-y-2"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost">Only My Issues</Button>
        <Button variant="ghost">Recently Updated</Button>
        <Separator orientation="vertical" className="h-8 w-[0.5px]" />
        <Button variant="ghost">Clear All</Button>
      </div>
    </div>
  );
};
