import { cn } from '../../libs/utils';
import type { SlaTone } from '../../data/cases';

interface SlaChipProps {
  tone: SlaTone;
  children: string;
}

const tones: Record<SlaTone, string> = {
  risk: 'bg-red-bg text-red',
  watch: 'bg-amber-bg text-amber',
  ok: 'bg-green-bg text-green',
};

export function SlaChip({ tone, children }: SlaChipProps) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center justify-center rounded-pill px-[9px] py-1 text-[11.5px] font-extrabold whitespace-nowrap',
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}
