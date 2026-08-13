import type { ReactNode } from 'react';
import { ui } from '../../libs/ui';

export function PageBody({ children }: { children: ReactNode }) {
  return <div className={ui.pageBody}>{children}</div>;
}
