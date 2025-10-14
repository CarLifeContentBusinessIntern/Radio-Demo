import { Outlet } from 'react-router-dom';
import { useRef } from 'react';
import Scrollbar from '../components/Scrollbar';

const ScrollbarLayout = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex h-full">
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
