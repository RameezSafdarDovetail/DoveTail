import { ui } from "../../libs/ui";
import { cn } from "../../libs/utils";
import { Link } from "react-router-dom";
import { paths } from "../../routes/paths";
import { useModal } from "../../hooks/useModal";
import { priorityCards } from "../../data/cases";

const quickCard =
  "relative flex w-full cursor-pointer flex-col items-center gap-1.5 rounded-lg border border-glass-card-border bg-glass-card px-3 pt-[18px] pb-4 no-underline shadow-card backdrop-blur-[16px] transition-colors duration-150 hover:bg-glass-hover";

export function QuickAccess() {
  const { openLogCase, openChangeRequest } = useModal();

  return (
    <div className="relative z-[3] mt-[-28px] grid grid-cols-4 items-stretch gap-3 px-10 pb-[22px] max-[980px]:grid-cols-2 max-[980px]:px-[18px] max-[640px]:grid-cols-1">
      <div className="grid min-h-[170px] grid-rows-2 gap-2.5 max-[640px]:min-h-0">
        <button
          type="button"
          className={cn(
            quickCard,
            "min-h-0 px-2.5 py-3 !bg-[rgba(232,244,255,0.96)] !border-[rgba(147,197,253,0.75)]"
          )}
          onClick={openLogCase}
        >
          <span className="absolute top-2.5 right-2.5 rounded-pill bg-red px-[5px] py-px text-[9.5px] font-bold text-white">
            New
          </span>
          <div className="mb-0.5 flex size-9 items-center justify-center rounded-[9px] bg-log-case-icon text-[17px] shadow-[inset_0_0_0_1px_rgba(26,86,219,0.08)]">
            +
          </div>
          <div className="text-center text-[12.5px] font-semibold text-text-1">
            Log Case
          </div>
        </button>
        <button
          type="button"
          className={cn(
            quickCard,
            "min-h-0 px-2.5 py-3 !bg-[rgba(236,253,245,0.96)] !border-[rgba(134,239,172,0.72)]"
          )}
          onClick={() => openChangeRequest()}
        >
          <span className="absolute top-2.5 right-2.5 rounded-pill bg-green px-[5px] py-px text-[9.5px] font-bold text-white">
            CR
          </span>
          <div className="mb-0.5 flex size-9 items-center justify-center rounded-[9px] bg-cr-icon text-[17px] text-green shadow-[inset_0_0_0_1px_rgba(26,86,219,0.08)]">
            ↻
          </div>
          <div className="text-center text-[12.5px] font-semibold text-text-1">
            Change Request
          </div>
        </button>
      </div>

      {priorityCards.map((card) => (
        <Link
          key={card.priority}
          className={cn(
            ui.glass,
            "flex min-h-[170px] cursor-pointer flex-col items-stretch justify-start gap-2.5 rounded-lg px-[22px] py-5 text-left no-underline transition-colors duration-150 hover:bg-glass-hover"
          )}
          to={`${paths.open}?priority=${card.priority}`}
        >
          <div className="mb-1 flex items-center gap-3">
            <div
              className={cn(
                "flex size-[38px] items-center justify-center rounded-[9px] border border-white/72 text-xs font-extrabold leading-none tracking-normal shadow-[inset_0_0_0_1px_rgba(26,86,219,0.05)]",
                card.iconClassName
              )}
            >
              {card.priority.toUpperCase()}
            </div>
            <span className="text-[12.5px] font-extrabold tracking-[0.06em] text-text-2 uppercase">
              {card.name}
            </span>
          </div>
          <div className="text-[15.5px] leading-[1.35] font-extrabold text-text-1">
            {card.title}
          </div>
          <div className="text-[13.5px] font-extrabold text-accent">
            {card.meta}
          </div>
          <div className="text-[12.5px] leading-[1.45] text-text-2">
            {card.rule}
          </div>
        </Link>
      ))}
    </div>
  );
}
