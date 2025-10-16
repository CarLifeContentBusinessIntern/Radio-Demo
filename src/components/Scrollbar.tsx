import { useCallback, useEffect, useRef, useState } from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

interface ScrollbarProps {
  scrollableRef: React.RefObject<HTMLDivElement | null>;
}

function Scrollbar({ scrollableRef }: ScrollbarProps) {
  const [thumbHeight, setThumbHeight] = useState(20);
  const [thumbTop, setThumbTop] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startScrollTop = useRef(0);

  const handleScroll = useCallback(() => {
    if (!scrollableRef.current || !trackRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollableRef.current;
    const trackHeight = trackRef.current.clientHeight;

    if (scrollHeight <= clientHeight) {
      setThumbHeight(trackHeight);
      setThumbTop(0);
      return;
    }

    const newThumbHeight = Math.max((clientHeight / scrollHeight) * trackHeight, 20);
    setThumbHeight(newThumbHeight);

    const scrollPercentage = scrollTop / (scrollHeight - clientHeight);
    const newThumbTop = scrollPercentage * (trackHeight - newThumbHeight);
    setThumbTop(newThumbTop);
  }, [scrollableRef]);

  useEffect(() => {
    const scrollableElement = scrollableRef.current;

    if (scrollableElement) {
      handleScroll();
      scrollableElement.addEventListener('scroll', handleScroll);

      const resizeObserver = new ResizeObserver(handleScroll);
      resizeObserver.observe(scrollableElement);

      const mutationObserver = new MutationObserver(handleScroll);
      mutationObserver.observe(scrollableElement, { childList: true, subtree: true });

      return () => {
        scrollableElement.removeEventListener('scroll', handleScroll);
        resizeObserver.unobserve(scrollableElement);
        mutationObserver.disconnect();
      };
    }
  }, [scrollableRef, handleScroll]);

  const handleArrowClick = (direction: 'up' | 'down') => {
    if (!scrollableRef.current) return;
    const scrollAmount = 100;
    scrollableRef.current.scrollBy({
      top: direction === 'up' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    isDragging.current = true;
    startY.current = e.clientY;
    startScrollTop.current = scrollableRef.current?.scrollTop ?? 0;
  };

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging.current || !scrollableRef.current || !trackRef.current) return;
      const deltaY = e.clientY - startY.current;
      const { scrollHeight, clientHeight } = scrollableRef.current;
      const trackHeight = trackRef.current.clientHeight;

      const currentThumbHeight = Math.max((clientHeight / scrollHeight) * trackHeight, 20);

      const scrollableDist = scrollHeight - clientHeight;
      const trackDist = trackHeight - currentThumbHeight;

      const scrollDelta = (deltaY / trackDist) * scrollableDist;
      scrollableRef.current.scrollTop = startScrollTop.current + scrollDelta;
    },
    [scrollableRef]
  );

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  return (
    <div className="w-[111px] h-[80%] max-h-[560px] flex flex-col items-center justify-between py-8 shrink-0">
      <button onClick={() => handleArrowClick('up')}>
        <FaChevronUp size={30} />
      </button>

      <div ref={trackRef} className="relative w-2 h-full my-4">
        <div
          className="absolute w-full bg-white rounded-full cursor-pointer"
          style={{ height: `${thumbHeight}px`, top: `${thumbTop}px` }}
          onMouseDown={onMouseDown}
        />
      </div>

      <button onClick={() => handleArrowClick('down')}>
        <FaChevronDown size={30} />
      </button>
    </div>
  );
}

export default Scrollbar;
