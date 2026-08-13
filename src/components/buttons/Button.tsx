import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../libs/utils';

type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  compact?: boolean;
  children: ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'btn-primary inline-flex shrink-0 items-center gap-1.5 rounded-[9px] bg-btn-primary px-[18px] py-[9px] font-sans text-[13.5px] font-semibold text-white shadow-btn transition-[opacity,transform] duration-150 hover:-translate-y-px hover:opacity-85',
  secondary:
    'btn-secondary inline-flex items-center gap-1.5 rounded-[9px] border border-white/56 bg-glass-card px-4 py-[9px] font-sans text-[13.5px] font-medium text-text-2 transition-[border-color,color] duration-150 hover:border-accent-mid hover:text-text-1',
};

export function Button({
  variant = 'primary',
  compact = false,
  className,
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(variants[variant], compact && 'px-3 py-[7px] text-[12.5px]', className)}
      {...props}
    >
      {children}
    </button>
  );
}
