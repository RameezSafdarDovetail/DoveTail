import { paths } from '../routes/paths';

export interface NavItem {
  id: string;
  label: string;
  to: string;
  icon: string;
  badge?: string;
  badgeTone?: 'amber';
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const topNavLinks = [
  { label: 'Home', to: paths.home, match: 'home' as const },
  { label: 'My Support', to: paths.open, match: 'support' as const },
];

export const sidebarSections: NavSection[] = [
  {
    label: 'Overview',
    items: [{ id: 'home', label: 'Dashboard', to: paths.home, icon: '🏠' }],
  },
  {
    label: 'My Support',
    items: [
      { id: 'open', label: 'Open Cases', to: paths.open, icon: '📋', badge: '4' },
      { id: 'quotes', label: 'My Quotes', to: paths.quotes, icon: '📄', badge: '2', badgeTone: 'amber' },
      { id: 'all', label: 'All My Cases', to: paths.all, icon: '📁' },
      { id: 'closed', label: 'Closed Cases', to: paths.closed, icon: '✅' },
    ],
  },
];
