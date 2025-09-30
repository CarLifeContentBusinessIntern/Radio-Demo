import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Scrollbar from "../components/Scrollbar";
import { useEffect, useRef } from "react";
import type { HeaderType } from "../types";

interface LayoutProps {
  type: HeaderType;
  title?: string;
}

function Layout({ type, title }: LayoutProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    contentRef.current?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <Header type={type} title={title} />

      <div className="flex flex-1 overflow-y-hidden">
        <Scrollbar scrollableRef={contentRef} />

        <main
          ref={contentRef}
          className="flex-1 h-full overflow-y-auto overflow-x-hidden scrollbar-hide pb-[126px] px-[33px]"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
