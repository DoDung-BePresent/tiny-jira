/**
 * Node modules
 */
import React from 'react';
import type { LucideIcon } from 'lucide-react';

/**
 * Utils
 */
import { cn } from '@/utils/tailwind';

export const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'> & {
    icon?: LucideIcon;
  }
>(({ className, type, icon: Icon, ...props }, ref) => {
  return (
    <div
      className={cn(
        'flex w-fit items-center gap-2 rounded-sm border p-1 px-2 has-[input:focus]:outline-2 has-[input:focus]:outline-[#4c9aff]',
        className,
      )}
    >
      {Icon && <Icon className="text-muted-foreground size-4" />}
      <input type={type} ref={ref} {...props} className="w-full outline-0" />
    </div>
  );
});

Input.displayName = 'Input';
