import { Link } from 'react-router-dom';
import { cn } from '../../libs/utils';
import { ui } from '../../libs/ui';

interface StatCardProps {
  label: string;
  value: string;
  delta: string;
  tone: 'up' | 'down' | 'neutral';
  to: string;
  ariaLabel: string;
}

const deltaTone = {
  up: 'text-green',
  down: 'text-red',
  neutral: 'text-text-3',
};

export function StatCard({ label, value, delta, tone, to, ariaLabel }: StatCardProps) {
  return (
    <Link
      className={cn(
        ui.glass,
        'block cursor-pointer rounded-default px-5 py-[18px] text-inherit no-underline transition-[transform,box-shadow,border-color,background-color] duration-150 hover:-translate-y-0.5 hover:border-[rgba(147,197,253,0.95)] hover:bg-white/97 hover:shadow-stat-hover focus-visible:border-[rgba(147,197,253,0.95)] focus-visible:bg-white/97 focus-visible:shadow-[0_0_0_3px_rgba(147,197,253,0.42),0_22px_46px_rgba(2,17,58,0.24)] focus-visible:outline-none',
      )}
      to={to}
      aria-label={ariaLabel}
    >
      <div className="mb-2 text-xs font-medium text-text-3">{label}</div>
      <div className="font-display text-[28px] font-extrabold tracking-[-0.5px] text-text-1">{value}</div>
      <div className={cn('mt-1 flex items-center gap-[3px] text-[11.5px]', deltaTone[tone])}>{delta}</div>
    </Link>
  );
}
