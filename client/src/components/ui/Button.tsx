/**
 * Node modules
 */
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Utils
 */
import { cn } from '@/utils/tailwind';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xs text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        ghost: 'hover:bg-accent text-accent-foreground',
      },
      size: {
        default: 'h-8 px-3 py-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> & VariantProps<typeof buttonVariants>
>(({ className, variant, size, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      {...props}
      className={cn(buttonVariants({ variant, size, className }))}
    >
      {children}
    </button>
  );
});
