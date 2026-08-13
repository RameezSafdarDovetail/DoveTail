import { Fragment } from "react";
import { paths } from "../../routes/paths";
import { SidebarItem } from "./SidebarItem";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface SidebarNavItem {
  id: string;
  label: string;
  to: string;
  icon: string;
  badge?: string;
  badgeTone?: "amber";
}

interface SidebarNavSection {
  label: string;
  items: SidebarNavItem[];
}

const sidebarSections: SidebarNavSection[] = [
  {
    label: "Overview",
    items: [{ id: "home", label: "Dashboard", to: paths.home, icon: "🏠" }],
  },
  {
    label: "My Support",
    items: [
      { id: "open", label: "Open Cases", to: paths.open, icon: "📋", badge: "4" },
      {
        id: "quotes",
        label: "My Quotes",
        to: paths.quotes,
        icon: "📄",
        badge: "2",
        badgeTone: "amber",
      },
      { id: "all", label: "All My Cases", to: paths.all, icon: "📁" },
      { id: "closed", label: "Closed Cases", to: paths.closed, icon: "✅" },
    ],
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate(paths.login, { replace: true });
  }

  return (
    <aside className="fixed top-[var(--nav-h)] bottom-0 left-0 z-[100] flex w-[var(--sidebar-w)] flex-col gap-1 overflow-y-auto border-r border-sidebar-border-glass bg-sidebar-glass px-3 pt-5 pb-6 shadow-sidebar backdrop-blur-[18px] max-[980px]:sticky max-[980px]:top-[var(--nav-h)] max-[980px]:h-auto max-[980px]:max-h-none max-[980px]:w-full max-[980px]:flex-row max-[980px]:gap-2 max-[980px]:overflow-x-auto max-[980px]:px-3 max-[980px]:py-2.5">
      {sidebarSections.map((section, index) => (
        <Fragment key={section.label}>
          <span
            className="px-2.5 pt-2.5 pb-1 text-[10.5px] font-bold tracking-[0.07em] text-nav-muted uppercase max-[980px]:hidden"
            style={index > 0 ? { marginTop: 8 } : undefined}
          >
            {section.label}
          </span>
          {section.items.map((item) => (
            <SidebarItem
              key={item.id}
              to={item.to}
              icon={item.icon}
              label={item.label}
              badge={item.badge}
              badgeTone={item.badgeTone}
              end={item.to === paths.home}
            />
          ))}
        </Fragment>
      ))}

      <div className="flex-1 max-[980px]:hidden" />
      <div className="mt-2 flex items-center gap-2.5 border-t border-white/16 pt-3.5 pl-1.5 max-[980px]:hidden">
        <div className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white">
          {getInitials(user?.Name ?? "")}
        </div>
        <div className="min-w-0 flex-1 text-[12.5px]">
          <div className="truncate font-semibold text-white">{user?.Name}</div>
          <div className="mt-px truncate text-[11.5px] text-nav-muted">
            {user?.Email}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-1.5 cursor-pointer border-0 bg-transparent p-0 text-left text-[11.5px] font-semibold text-nav-link hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
