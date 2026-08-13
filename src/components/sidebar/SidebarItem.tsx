import { NavLink } from "react-router-dom";
import { cn } from "../../libs/utils";

interface SidebarItemProps {
  to: string;
  icon: string;
  label: string;
  badge?: string;
  badgeTone?: "amber";
  end?: boolean;
}

export function SidebarItem({
  to,
  icon,
  label,
  // badge,
  // badgeTone,
  end,
}: SidebarItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "relative flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] font-medium text-[rgba(229,241,255,0.78)] no-underline transition-[background-color,color] duration-100 hover:bg-white/12 hover:text-white max-[980px]:min-w-max max-[980px]:px-2.5 max-[980px]:py-2",
          isActive && "bg-white/18 text-white"
        )
      }
    >
      <span className="flex size-[30px] shrink-0 items-center justify-center rounded-[7px] bg-white/12 text-[15px] transition-colors duration-100">
        {icon}
      </span>
      {label}
      {/* {badge ? (
        <span
          className={cn(
            'ml-auto min-w-[18px] rounded-pill px-1.5 py-px text-center text-[10.5px] font-bold text-white',
            badgeTone === 'amber' ? 'bg-amber' : 'bg-red',
          )}
        >
          {badge}
        </span>
      ) : null} */}
    </NavLink>
  );
}
