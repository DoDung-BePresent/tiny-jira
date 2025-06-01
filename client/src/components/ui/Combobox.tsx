import { cn } from '@/utils/tailwind';
import { Check, ChevronDown } from 'lucide-react';
import React from 'react';

export interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const Combobox = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  className,
}: ComboboxProps) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [internalValue, setInternalValue] = React.useState('');

  const ref = React.useRef<HTMLDivElement>(null);

  const currentValue = value !== undefined ? value : internalValue;
  const isControlled = value !== undefined;

  const filtered = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase()),
  );

  const selected = options.find((option) => option.value === currentValue);

  // Close on outside click
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = (optionValue: string) => {
    if (isControlled) {
      onChange?.(optionValue);
    } else {
      setInternalValue(optionValue);
    }
    setOpen(false);
    setSearch('');
  };
  return (
    <div ref={ref} className={cn('relative w-full', className)}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <span className={selected ? '' : 'text-gray-500'}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          {/* Search */}
          <div className="border-b border-gray-100 p-2">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-2 py-1 text-sm focus:outline-none"
            />
          </div>

          {/* Options */}
          <div className="max-h-60 overflow-auto p-1">
            {filtered.length === 0 ? (
              <div className="px-2 py-2 text-sm text-gray-500">
                No results found
              </div>
            ) : (
              filtered.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className="flex cursor-pointer items-center rounded px-2 py-2 text-sm hover:bg-gray-100"
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {option.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
