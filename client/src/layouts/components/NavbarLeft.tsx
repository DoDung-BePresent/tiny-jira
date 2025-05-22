/**
 * Components
 */
import { Logo } from '@/components/Logo';
import { MessageCircleQuestionIcon, PlusIcon, SearchIcon } from 'lucide-react';

export const NavbarLeft = () => {
  return (
    <aside className="sidebar-container group z-10">
      <Logo className="mx-4.5 block" />
      <div className="flex flex-1 flex-col justify-between">
        <div className="mt-5">
          <div className="sidebar-menu-item">
            <SearchIcon className="ml-[1px] size-5.5 shrink-0 stroke-[2.5] text-white/90" />
            <span className="sidebar-menu-item-span">SEARCH ISSUES</span>
          </div>
          <div className="sidebar-menu-item">
            <PlusIcon className="size-6 shrink-0 stroke-[2.5] text-white/90" />
            <span className="sidebar-menu-item-span">CREATE ISSUE</span>
          </div>
        </div>
        <div className="mt-auto flex items-center gap-4 p-2 px-5 hover:bg-white/12">
          <MessageCircleQuestionIcon className="size-6 shrink-0 stroke-[2.5] text-white/90" />
          <span className="sidebar-menu-item-span">ABOUT</span>
        </div>
      </div>
    </aside>
  );
};
