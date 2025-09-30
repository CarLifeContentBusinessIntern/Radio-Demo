import { Outlet } from "react-router-dom";
import Scrollbar from "../components/ScrollBar";
import { useRef } from "react";

const ScrollbarLayout = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex h-screen">
      <Scrollbar scrollableRef={contentRef} />

      <div
        ref={contentRef}
        className="flex-grow h-full overflow-y-scroll overflow-x-hidden scrollbar-hide"
      >
        <Outlet />
      </div>
    </div>
  );
};

export default ScrollbarLayout;
