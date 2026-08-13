interface PillProps {
  children: string;
}

export function Pill({ children }: PillProps) {
  return (
    <span className="inline-flex items-center rounded-pill bg-bg px-[9px] py-0.5 text-[11px] font-semibold text-text-2">
      {children}
    </span>
  );
}
