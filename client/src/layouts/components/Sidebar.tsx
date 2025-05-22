/**
 * Node modules
 */
import {
  AlignStartHorizontalIcon,
  ChartBarIcon,
  DatabaseIcon,
  FileTextIcon,
  PackageIcon,
  SettingsIcon,
  TruckIcon,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Components
 */
import { Separator } from '@/components/ui/Separator';
import { ProjectAvatar } from '@/components/ProjectAvatar';

/**
 * Types
 */
import type { SideBarItemType } from '@/types/layout';

/**
 * Utils
 */
import { cn } from '@/utils/tailwind';

const mainNav: Record<'implemented' | 'notImplemented', SideBarItemType[]> = {
  implemented: [
    {
      icon: AlignStartHorizontalIcon,
      label: 'Kanban Board',
      url: '/project/board',
    },
    {
      icon: SettingsIcon,
      label: 'Project Settings',
      url: '/project/settings',
    },
  ],
  notImplemented: [
    {
      icon: TruckIcon,
      label: 'Releases',
      url: '/releases',
    },
    {
      icon: DatabaseIcon,
      label: 'Issues and filters',
      url: 'issues-and-filters',
    },
    {
      icon: FileTextIcon,
      label: 'Pages',
      url: 'pages',
    },
    {
      icon: ChartBarIcon,
      label: 'Reports',
      url: 'reports',
    },
    {
      icon: PackageIcon,
      label: 'Components',
      url: 'components',
    },
  ],
};

export const Sidebar = ({ className }: { className: string }) => {
  return (
    <div className={cn('bg-muted w-60 border border-r p-4', className)}>
      <div className="flex items-center gap-2.5 p-1">
        <ProjectAvatar />
        <div className="">
          <span className="block text-sm font-medium text-[#42526e]">
            singularity 1.0
          </span>
          <span className="text-muted-foreground block text-xs">
            Software project
          </span>
        </div>
      </div>
      <div className="mt-7">
        {mainNav.implemented.map((nav) => (
          <SidebarItem
            key={nav.url}
            icon={nav.icon}
            label={nav.label}
            url={nav.url}
            isImplemented={true}
          />
        ))}
        <Separator className="my-2" />
        {mainNav.notImplemented.map((nav) => (
          <SidebarItem
            key={nav.url}
            icon={nav.icon}
            label={nav.label}
            url={nav.url}
            isImplemented={false}
          />
        ))}
      </div>
    </div>
  );
};

const SidebarItem = ({
  icon: Icon,
  label,
  url,
  isImplemented,
}: SideBarItemType & {
  isImplemented: boolean;
}) => {
  const { pathname } = useLocation();
  const isActive = url === pathname;
  return (
    <Link
      onClick={(e) => {
        if (!isImplemented) {
          e.preventDefault();
        }
      }}
      to={url}
      className={cn(
        'group relative flex items-center gap-3 rounded-sm p-3 py-2.5 text-[#172b4d] hover:bg-[rgb(235,236,240)]',
        {
          'text-primary/85 bg-[rgb(235,236,240)]': isActive,
          'cursor-not-allowed': !isImplemented,
        },
      )}
    >
      <Icon className="size-5.5 stroke-[1.7px]" />
      <span className="text-sm">{label}</span>
      <span
        className={cn(
          'absolute left-10 rounded-sm bg-[#dfe1e6] p-2 py-1 text-xs font-medium uppercase opacity-0',
          {
            'group-hover:opacity-100': !isImplemented,
          },
        )}
      >
        Not Implemented
      </span>
    </Link>
  );
};
