import { ui } from "../../libs/ui";
import { cn } from "../../libs/utils";
import type { ReactNode } from "react";

interface TableCardProps {
  columnsClassName: string;
  headers: string[];
  centerHeaders?: string[];
  /** Keep every column at full width and scroll the table horizontally. */
  scrollable?: boolean;
  minWidthClassName?: string;
  children: ReactNode;
}

export function TableCard({
  columnsClassName,
  headers,
  centerHeaders = [],
  scrollable = false,
  minWidthClassName,
  children,
}: TableCardProps) {
  const trackWidth = scrollable
    ? minWidthClassName
    : "max-[640px]:min-w-[720px]";

  return (
    <div className={cn(ui.glass, "overflow-hidden rounded-default")}>
      <div className={scrollable ? "overflow-x-auto" : "max-[640px]:overflow-x-auto"}>
        <div
          className={cn(
            "grid items-center border-b border-border bg-[#fafbfc] px-5 py-[11px]",
            trackWidth,
            columnsClassName
          )}
        >
          {headers.map((header) => (
            <span
              key={header}
              className={cn(
                "min-w-0 text-[11px] font-bold tracking-[0.06em] text-text-3 uppercase",
                scrollable && "overflow-hidden whitespace-nowrap",
                (header === "Actions" || centerHeaders.includes(header)) &&
                  (scrollable
                    ? "text-center"
                    : "justify-self-center text-center")
              )}
            >
              {header}
            </span>
          ))}
        </div>
        <div className={cn(ui.tableScrollBody, trackWidth)}>{children}</div>
      </div>
    </div>
  );
}

interface TableRowProps {
  columnsClassName: string;
  muted?: boolean;
  children: ReactNode;
  onClick?: () => void;
}

export function TableRow({
  columnsClassName,
  muted = false,
  children,
  onClick,
}: TableRowProps) {
  return (
    <div
      className={cn(
        "grid cursor-pointer items-center border-b border-border-soft px-5 py-3.5 transition-colors duration-100 last:border-b-0 animate-row-in hover:bg-glass-hover max-[640px]:min-w-[720px] [&:nth-child(2)]:[animation-delay:0.04s] [&:nth-child(3)]:[animation-delay:0.08s] [&:nth-child(4)]:[animation-delay:0.12s] [&:nth-child(5)]:[animation-delay:0.15s] [&:nth-child(6)]:[animation-delay:0.18s]",
        muted && "opacity-55 hover:bg-[#fafafa] hover:opacity-75",
        columnsClassName
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
