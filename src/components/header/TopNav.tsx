import { Bell, Search } from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { topNavLinks } from '../../data/navigation';
import { useAuth } from '../../hooks/useAuth';
import { paths } from '../../routes/paths';
import { cn } from '../../libs/utils';

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

const supportPaths: string[] = [paths.open, paths.quotes, paths.all, paths.closed];

export function TopNav() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate(paths.login, { replace: true });
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-[200] flex h-[var(--nav-h)] items-center gap-4 border-b border-nav-border-glass bg-nav-glass px-6 shadow-nav backdrop-blur-[18px] max-[980px]:gap-2 max-[980px]:px-3.5">
      <NavLink
        className="mr-2 flex items-center gap-[9px] font-display text-[17px] font-extrabold tracking-[-0.4px] text-white no-underline"
        to={paths.home}
      >
        <div className="flex size-7 items-center justify-center rounded-lg bg-accent">
          <svg className="size-3.5" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="5" stroke="#fff" strokeWidth="1.8" />
            <path d="M4.5 7h5M7 4.5v5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        Dovetail
      </NavLink>
      <div className="h-[22px] w-px bg-white/18" />
      <nav className="flex gap-0.5 max-[980px]:hidden">
        {topNavLinks.map((link) => {
          const active = link.match === 'home' ? pathname === paths.home : supportPaths.includes(pathname);
          return (
            <NavLink
              key={link.label}
              className={cn(
                'rounded-md px-[11px] py-[5px] text-[13.5px] font-medium text-nav-link no-underline transition-[color,background-color] duration-150 hover:bg-white/12 hover:text-white',
                active && 'bg-white/12 text-white',
              )}
              to={link.to}
            >
              {link.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="ml-auto flex items-center gap-2.5">
        <div className="flex cursor-pointer items-center gap-[7px] rounded-lg border border-white/18 bg-white/12 px-3 py-1.5 text-[13px] text-[rgba(229,241,255,0.78)] transition-[border-color,background-color] duration-150 hover:border-white/34 hover:bg-white/18 max-[980px]:hidden [&_svg]:opacity-50">
          <Search size={13} strokeWidth={1.6} />
          Search…
        </div>
        <div className="relative flex size-8 cursor-pointer items-center justify-center rounded-lg border border-white/18 bg-white/12 text-[rgba(229,241,255,0.78)] transition-[border-color,background-color] duration-150 hover:border-white/34 hover:bg-white/18">
          <Bell size={15} strokeWidth={1.5} />
          <span className="absolute top-1.5 right-1.5 size-[7px] rounded-full border-[1.5px] border-white bg-red" />
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="cursor-pointer rounded-md border-0 bg-transparent px-2 py-[5px] text-[12.5px] font-semibold text-nav-link hover:text-white"
        >
          Logout
        </button>
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-[11.5px] font-semibold text-white">
          {getInitials(user?.Name ?? '')}
        </div>
      </div>
    </nav>
  );
}
