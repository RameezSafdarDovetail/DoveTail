import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../libs/utils';

interface FilterPillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  showDot?: boolean;
  children: ReactNode;
}

export function FilterPill({
  active = false,
  showDot = false,
  className,
  children,
  type = 'button',
  ...props
}: FilterPillProps) {
  return (
    <button
      type={type}
      className={cn(
        'flex cursor-pointer items-center gap-1.5 rounded-[9px] border border-white/56 bg-glass-card px-3.5 py-2 font-sans text-[13px] font-medium text-text-2 transition-all duration-150 hover:border-accent-mid hover:text-text-1',
        active && 'border-accent-mid bg-accent-soft text-accent',
        className,
      )}
      {...props}
    >
      {showDot ? <span className="size-[5px] rounded-full bg-current" /> : null}
      {children}
    </button>
  );
}
