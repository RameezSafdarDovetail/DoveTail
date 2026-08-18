import { cn } from '../../libs/utils';

type BadgeTone = 'open' | 'pending' | 'closed' | 'resolved' | 'approved' | 'awaiting' | 'rejected' | 'cancelled';

interface BadgeProps {
  tone: BadgeTone;
  children: string;
  withDot?: boolean;
}

const tones: Record<BadgeTone, string> = {
  open: 'bg-green-bg text-green',
  pending: 'bg-amber-bg text-amber',
  closed: 'bg-slate-bg text-slate',
  resolved: 'bg-green-bg text-green',
  approved: 'bg-green-bg text-green',
  awaiting: 'bg-accent-soft text-accent',
  rejected: 'bg-red-bg text-red',
  cancelled: 'bg-amber-bg text-amber',
};

const dots: Record<BadgeTone, string> = {
  open: 'bg-green',
  pending: 'bg-amber',
  closed: 'bg-slate',
  resolved: 'bg-green',
  approved: 'bg-green',
  awaiting: 'bg-accent',
  rejected: 'bg-red',
  cancelled: 'bg-amber',
};

export function Badge({ tone, children, withDot = false }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center gap-[5px] rounded-pill px-2.5 py-[3px] text-[11.5px] font-semibold whitespace-nowrap', tones[tone])}>
      {withDot ? <span className={cn('size-[5px] shrink-0 rounded-full', dots[tone])} /> : null}
      {children}
    </span>
  );
}
