import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Scrollbar from "../components/ScrollBar";
import { useRef } from "react";

interface LayoutProps {
  type: string;
}

function Layout({ type }: LayoutProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <Header type={type} />

      <div className="flex flex-1 overflow-y-hidden">
        <Scrollbar scrollableRef={contentRef} />

        <main
          ref={contentRef}
          className="flex-1 h-full overflow-y-auto overflow-x-hidden scrollbar-hide"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
