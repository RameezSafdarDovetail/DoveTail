import { cn } from '../../libs/utils';
import type { CasePriority } from '../../data/cases';

interface PriorityBadgeProps {
  priority: CasePriority;
  children: string;
}

const tones: Record<CasePriority, string> = {
  p1: 'bg-red-bg text-red',
  p2: 'bg-amber-bg text-amber',
  p3: 'bg-green-bg text-green',
};

export function PriorityBadge({ priority, children }: PriorityBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center justify-center rounded-pill px-[9px] py-1 text-[11.5px] font-extrabold whitespace-nowrap',
        tones[priority],
      )}
    >
      {children}
    </span>
  );
}
