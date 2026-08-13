import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../libs/utils';

interface TabPillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children: ReactNode;
}

export function TabPill({ active = false, className, children, type = 'button', ...props }: TabPillProps) {
  return (
    <button
      type={type}
      className={cn(
        'cursor-pointer rounded-pill border-0 px-4 py-[7px] font-sans text-[13px] font-medium transition-all duration-150',
        active ? 'bg-text-1 text-white' : 'bg-glass-card text-text-2 hover:bg-border',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
