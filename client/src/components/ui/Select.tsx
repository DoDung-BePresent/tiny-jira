import { cn } from '@/utils/tailwind';
import { Check, ChevronDown } from 'lucide-react';
import React from 'react';

interface SelectContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  renderValue?: (value: string) => React.ReactNode;
}

const SelectContext = React.createContext<SelectContextType | undefined>(
  undefined,
);

const useSelect = () => {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error('Select components must be used within a Select');
  }
  return context;
};

interface SelectProps {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  className?: string;
  renderValue?: (value: string) => React.ReactNode;
}

const Select = ({
  children,
  value,
  onValueChange,
  defaultValue = '',
  className,
  renderValue,
}: SelectProps) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [open, setOpen] = React.useState(false);

  const currentValue = value !== undefined ? value : internalValue;

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      if (value === undefined) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
      setOpen(false);
    },
    [value, onValueChange],
  );

  return (
    <SelectContext.Provider
      value={{
        open,
        setOpen,
        value: currentValue,
        onValueChange: handleValueChange,
        renderValue,
        defaultValue,
      }}
    >
      <div className={cn('relative w-48', className)}>{children}</div>
    </SelectContext.Provider>
  );
};

interface SelectTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen } = useSelect();

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'flex h-9 w-full items-center justify-between rounded-sm border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50',
          className,
        )}
        onClick={() => setOpen(!open)}
        {...props}
      >
        {children}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
    );
  },
);
SelectTrigger.displayName = 'SelectTrigger';

interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string;
}

const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ className, placeholder, ...props }, ref) => {
    const { value, renderValue, defaultValue } = useSelect();

    const displayValue = React.useMemo(() => {
      if (!value) {
        return <span className="text-gray-500">{placeholder}</span>;
      }

      // Nếu có renderValue custom, sử dụng nó
      if (renderValue) {
        return renderValue(value || (defaultValue ?? ''));
      }

      // Mặc định hiển thị value thô
      return value;
    }, [value, renderValue, placeholder]);

    return (
      <span ref={ref} className={cn('block truncate', className)} {...props}>
        {displayValue}
      </span>
    );
  },
);
SelectValue.displayName = 'SelectValue';

// Select Content
interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen } = useSelect();
    const contentRef = React.useRef<HTMLDivElement>(null);

    // Close on click outside
    React.useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          contentRef.current &&
          !contentRef.current.contains(e.target as Node)
        ) {
          setOpen(false);
        }
      };

      if (open) {
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
          document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [open, setOpen]);

    // Close on escape
    React.useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setOpen(false);
      };

      if (open) {
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
      }
    }, [open, setOpen]);

    if (!open) return null;

    return (
      <div
        ref={contentRef}
        className={cn(
          'absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg',
          className,
        )}
        {...props}
      >
        <div className="p-1">{children}</div>
      </div>
    );
  },
);
SelectContent.displayName = 'SelectContent';

// Select Item
interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, value, ...props }, ref) => {
    const { value: selectedValue, onValueChange } = useSelect();
    const isSelected = selectedValue === value;

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm select-none hover:bg-gray-100',
          isSelected && 'bg-blue-50 text-blue-600',
          className,
        )}
        onClick={() => onValueChange?.(value)}
        {...props}
      >
        <div className="flex w-full items-center justify-between">
          <span>{children}</span>
          <div className="flex h-4 w-4 items-center justify-center">
            {isSelected && <Check className="h-3 w-3" />}
          </div>
        </div>
      </div>
    );
  },
);
SelectItem.displayName = 'SelectItem';

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
