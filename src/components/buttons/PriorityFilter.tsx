import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../libs/utils';

interface PriorityFilterProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  tone?: 'p1' | 'p2' | 'p3';
  children: ReactNode;
}

export function PriorityFilter({
  active = false,
  className,
  children,
  type = 'button',
  ...props
}: PriorityFilterProps) {
  return (
    <button
      type={type}
      className={cn(
        'cursor-pointer rounded-lg border px-3 py-[7px] font-sans text-[12.5px] font-bold',
        active
          ? 'border-[#1a56db] bg-[#1a56db] text-white'
          : 'border-border bg-white text-text-2',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
