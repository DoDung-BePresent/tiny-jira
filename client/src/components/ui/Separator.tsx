/**
 * Utils
 */
import { cn } from '@/utils/tailwind';

export const Separator = ({
  orientation = 'horizontal',
  className,
}: {
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'bg-[rgb(193,199,208)]',
        {
          'h-[1px] w-full': orientation === 'horizontal',
          'h-full w-[1px]': orientation === 'vertical',
        },
        className,
      )}
    />
  );
};
