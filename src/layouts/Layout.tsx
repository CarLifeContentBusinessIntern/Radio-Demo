import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Scrollbar from '../components/Scrollbar';
import type { HeaderType } from '../types';

interface LayoutProps {
  type: HeaderType;
  title?: string;
  scrollbar: boolean;
  paddingX: boolean;
  paddingB: boolean;
  isPlayer?: boolean;
}

function Layout({ type, title, scrollbar, paddingX, paddingB, isPlayer }: LayoutProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  const mainContent = (
    <main
      ref={contentRef}
      className={`flex-1 h-full overflow-y-auto overflow-x-hidden scrollbar-hide ${
        paddingB ? 'pb-[126px]' : ''
      } ${paddingX ? 'px-[33px]' : ''} `}
    >
      <Outlet />
    </main>
  );

  useEffect(() => {
    contentRef.current?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex flex-col h-screen text-white">
      <Header type={type} title={title} isPlayer={isPlayer} />

      {scrollbar ? (
        <div className="flex flex-1 overflow-y-hidden">
          <Scrollbar scrollableRef={contentRef} />
          {mainContent}
        </div>
      ) : (
        mainContent
      )}
    </div>
  );
}

export default Layout;
