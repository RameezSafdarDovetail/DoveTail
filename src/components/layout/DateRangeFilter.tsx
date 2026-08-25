import { cn } from "../../libs/utils";
import { Calendar } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { isInvalidCreatedOnRange } from "../../apis/cases";

const dateControlClassName =
  "w-full rounded-[9px] border border-[#d9dce3] bg-white px-3 py-2 font-sans text-[13.5px] text-text-1 outline-none transition-[border-color,box-shadow] duration-150 focus:border-accent-mid focus:shadow-[0_0_0_3px_rgba(26,86,219,0.07)] disabled:cursor-not-allowed disabled:opacity-50";

interface DateRangeFilterProps {
  start: string;
  end: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  onClear: () => void;
  disabled?: boolean;
  className?: string;
}

function formatDateLabel(value: string) {
  if (!value) return "";
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function DateRangeFilter({
  start,
  end,
  onStartChange,
  onEndChange,
  onClear,
  disabled = false,
  className,
}: DateRangeFilterProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const hasRange = Boolean(start || end);
  const invalid = isInvalidCreatedOnRange(start, end);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const buttonLabel = hasRange
    ? [formatDateLabel(start), formatDateLabel(end)].filter(Boolean).join(" – ")
    : "Search by Date";

  return (
    <div ref={rootRef} className={cn("relative max-[640px]:w-full", className)}>
      <button
        type="button"
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex cursor-pointer items-center gap-1.5 rounded-[9px] border border-white/56 bg-glass-card px-3.5 py-2 font-sans text-[13px] font-medium text-text-2 transition-all duration-150 hover:border-accent-mid hover:text-text-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 max-[640px]:w-full max-[640px]:justify-center",
          (open || hasRange) && "border-accent-mid bg-accent-soft text-accent"
        )}
      >
        <Calendar size={14} strokeWidth={1.8} className="shrink-0" />
        <span className="truncate">{buttonLabel}</span>
        <span className="text-[11px] opacity-70">▾</span>
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="Filter by date range"
          className="absolute top-[calc(100%+6px)] left-0 z-30 w-[min(320px,calc(100vw-2rem))] rounded-[12px] border border-white/70 bg-white/98 p-3.5 shadow-card backdrop-blur-[16px] max-[640px]:left-0 max-[640px]:right-0 max-[640px]:w-full"
        >
          <div className="grid gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold tracking-[0.05em] text-text-3 uppercase">
                Start date
              </span>
              <input
                type="date"
                value={start}
                disabled={disabled}
                onChange={(event) => onStartChange(event.target.value)}
                className={dateControlClassName}
                aria-invalid={invalid}
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold tracking-[0.05em] text-text-3 uppercase">
                End date
              </span>
              <input
                type="date"
                value={end}
                disabled={disabled}
                onChange={(event) => onEndChange(event.target.value)}
                className={dateControlClassName}
                aria-invalid={invalid}
              />
            </label>

            {invalid ? (
              <span className="text-[12px] font-semibold text-red">
                End date must be on or after the start date.
              </span>
            ) : null}

            <div className="flex items-center justify-between gap-2 pt-0.5">
              <button
                type="button"
                disabled={disabled || !hasRange}
                onClick={() => {
                  onClear();
                }}
                className="cursor-pointer rounded-[9px] border border-[#d9dce3] bg-white px-3 py-1.5 font-sans text-[12.5px] font-medium text-text-2 transition-[border-color,color] duration-150 hover:border-accent-mid hover:text-text-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="cursor-pointer rounded-[9px] bg-btn-primary px-3 py-1.5 font-sans text-[12.5px] font-semibold text-white transition-opacity duration-150 hover:opacity-90"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
