import { cn } from "../../libs/utils";
import type { HomeStatusTone } from "../../data/cases";

interface StatusChipProps {
  tone: HomeStatusTone;
  children: string;
}

const tones: Record<HomeStatusTone, string> = {
  open: "bg-[#eef2ff] text-[#1d4ed8]",
  progress: "bg-[#fff7ed] text-[#c2410c]",
};

export function StatusChip({ tone, children }: StatusChipProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center justify-center rounded-pill px-[9px] py-1 text-[11.5px] font-extrabold whitespace-nowrap",
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}
