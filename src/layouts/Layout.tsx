import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Scrollbar from '../components/Scrollbar';
import type { HeaderType } from '../types';
import { useVersion } from '../contexts/VersionContext';

interface LayoutProps {
  defaultType?: HeaderType;
  defaultTitle?: string;
  scrollbar: boolean;
  paddingX: boolean;
  paddingB: boolean;
  isPlayer?: boolean;
}

function Layout({
  defaultTitle,
  defaultType,
  scrollbar,
  paddingX,
  paddingB,
  isPlayer,
}: LayoutProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { pathname, state } = useLocation();
  const type = state?.type || defaultType;
  const title = state?.title || defaultTitle;
  const { isLiveVersion } = useVersion();
  const scrollKey = `scroll-${pathname}-${type ?? 'default'}-${isLiveVersion}`;

  // 스크롤 위치 실시간 저장
  useEffect(() => {
    let timeout: number;
    const handleScroll = () => {
      if (contentRef.current) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          sessionStorage.setItem(scrollKey, String(contentRef.current!.scrollTop));
        }, 100); // 100ms 정도 기다렸다가 저장
      }
    };

    const content = contentRef.current;
    content?.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timeout);
      content?.removeEventListener('scroll', handleScroll);
    };
  }, [scrollKey]);

  // 렌더링 완료 후 복원된 스크롤 위치로 이동
  useEffect(() => {
    const saved = sessionStorage.getItem(scrollKey);
    setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.scrollTo(0, saved ? Number(saved) : 0);
      }
    }, 200); // 기다려 DOM 렌더링 후 scrollTo
  }, [pathname, scrollKey]);

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
