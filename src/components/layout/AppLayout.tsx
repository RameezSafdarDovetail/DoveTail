import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Footer } from '../footer/Footer';
import { TopNav } from '../header/TopNav';
import { CaseCommentsModal } from '../popups/CaseCommentsModal';
import { ChangeRequestModal } from '../popups/ChangeRequestModal';
import { LogCaseModal } from '../popups/LogCaseModal';
import { Sidebar } from '../sidebar/Sidebar';
import { BrandBackground } from './BrandBackground';

export function AppLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return (
    <>
      <BrandBackground />
      <TopNav />
      <Sidebar />
      <main className="relative z-[1] mt-[var(--nav-h)] ml-[var(--sidebar-w)] min-h-[calc(100vh-var(--nav-h))] p-0 max-[980px]:ml-0">
        <Outlet />
      </main>
      <Footer />
      <LogCaseModal />
      <ChangeRequestModal />
      <CaseCommentsModal />
    </>
  );
}
