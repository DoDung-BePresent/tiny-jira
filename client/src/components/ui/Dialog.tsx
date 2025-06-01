import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/tailwind';

// Dialog Context
interface DialogContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextType | undefined>(
  undefined,
);

const useDialog = () => {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error('Dialog components must be used within a Dialog');
  }
  return context;
};

// Dialog Root Component
interface DialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
}

const Dialog = ({
  children,
  open,
  onOpenChange,
  defaultOpen = false,
}: DialogProps) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange],
  );

  return (
    <DialogContext.Provider value={{ open: isOpen, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
};

// Dialog Trigger
interface DialogTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ className, children, asChild = false, ...props }, ref) => {
    const { setOpen } = useDialog();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      setOpen(true);
      props.onClick?.(e);
    };

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        ...(typeof children.props === 'object' && children.props !== null
          ? children.props
          : {}),
        onClick: handleClick,
        ref,
      } as any);
    }

    return (
      <button ref={ref} className={className} onClick={handleClick} {...props}>
        {children}
      </button>
    );
  },
);
DialogTrigger.displayName = 'DialogTrigger';

interface DialogPortalProps {
  children: React.ReactNode;
  container?: HTMLElement;
}

const DialogPortal = ({ children, container }: DialogPortalProps) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  if (typeof window !== 'undefined') {
    const target = container || document.body;
    return (target as any).createPortal ? (
      (target as any).createPortal(children, target)
    ) : (
      <div>{children}</div>
    );
  }

  return null;
};

interface DialogOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const DialogOverlay = React.forwardRef<HTMLDivElement, DialogOverlayProps>(
  ({ className, children, ...props }, ref) => {
    const { open } = useDialog();

    if (!open) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'fixed inset-0 z-50 flex h-screen flex-col items-center justify-start overflow-y-auto bg-[rgba(9,30,66,0.54)] p-10',
          className,
        )}
        data-state={open ? 'open' : 'closed'}
        {...props}
      >
        {children}
      </div>
    );
  },
);
DialogOverlay.displayName = 'DialogOverlay';

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: PointerEvent) => void;
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  (
    { className, children, onEscapeKeyDown, onPointerDownOutside, ...props },
    ref,
  ) => {
    const { open, setOpen } = useDialog();

    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onEscapeKeyDown?.(e);
          if (!e.defaultPrevented) {
            setOpen(false);
          }
        }
      };

      if (open) {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
      }
    }, [open, onEscapeKeyDown, setOpen]);

    React.useEffect(() => {
      const handlePointerDown = (e: PointerEvent) => {
        const target = e.target as Element;
        const content = ref && 'current' in ref ? ref.current : null;

        if (content && !content.contains(target)) {
          onPointerDownOutside?.(e);
          if (!e.defaultPrevented) {
            setOpen(false);
          }
        }
      };

      if (open) {
        document.addEventListener('pointerdown', handlePointerDown);
        return () =>
          document.removeEventListener('pointerdown', handlePointerDown);
      }
    }, [open, onPointerDownOutside, setOpen, ref]);

    if (!open) return null;

    return (
      <DialogPortal>
        <DialogOverlay
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setOpen(false);
            }
          }}
        >
          <div
            ref={ref}
            className={cn(
              'grid h-fit w-full max-w-5xl border bg-white p-6 shadow-lg sm:rounded-sm',
              className,
            )}
            data-state={open ? 'open' : 'closed'}
            onClick={(e) => {
              e.stopPropagation();
            }}
            {...props}
          >
            {children}
          </div>
        </DialogOverlay>
      </DialogPortal>
    );
  },
);

DialogContent.displayName = 'DialogContent';

interface DialogCloseProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
  ({ className, children, asChild = false, ...props }, ref) => {
    const { setOpen } = useDialog();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      setOpen(false);
      props.onClick?.(e);
    };

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        ...(typeof children.props === 'object' && children.props !== null
          ? children.props
          : {}),
        onClick: handleClick,
        ref,
      } as any);
    }

    return (
      <button ref={ref} className={className} onClick={handleClick} {...props}>
        {children}
      </button>
    );
  },
);
DialogClose.displayName = 'DialogClose';

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogContent,
  DialogClose,
};
