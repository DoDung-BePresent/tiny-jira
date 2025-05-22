/**
 * Utils
 */
import { cn } from '@/utils/tailwind';

export const Avatar = ({
  className,
  avatarUrl,
  name = '',
  size = 34,
}: {
  className?: string;
  avatarUrl?: string;
  name?: string;
  size?: number;
}) => {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        style={{
          width: size,
          height: size,
        }}
        className={cn(
          'rounded-full border-2 border-white bg-gray-200 object-cover',
          className,
        )}
      />
    );
  }

  return (
    <span
      style={{
        width: size,
        height: size,
        color: getColorFromName(name),
      }}
      className={cn(
        'inline-flex items-center justify-center rounded-full border-2 font-medium',
        className,
      )}
    >
      {name ? name?.charAt(0).toLocaleUpperCase() : 'U'}
    </span>
  );
};

const colors = [
  '#DA7657',
  '#6ADA57',
  '#5784DA',
  '#AA57DA',
  '#DA5757',
  '#DA5792',
  '#57DACA',
  '#57A5DA',
];

const getColorFromName = (name: string) =>
  colors[name.toLocaleLowerCase().charCodeAt(0) % colors.length];
