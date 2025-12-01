import { useLayoutEffect, useRef, useState } from 'react';
import PickleLiveImage from '../assets/pickle_live.png';
import { useNavigate } from 'react-router-dom';
import CircleViewItem from './CircleViewItem';
import CircularProgressBar from './CircularProgressBar';
import { LIVE_STREAM_EPISODE } from '../pages/PickleLivePage';
function PickleLive() {
  const navigate = useNavigate();

  const containerRef = useRef<HTMLDivElement>(null);
  const [parentSize, setParentSize] = useState(0);
  // 부모 크기 계산
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        setParentSize(width);
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);
  return (
    <div className="flex flex-col h-full">
      <div className="text-lg mb-7 font-medium h-7 flex ">P!ckle On-Air 🔴</div>
      <div
        ref={containerRef}
        className="relative w-full aspect-square"
        onClick={() => navigate('/player/live', { state: { title: 'P!ckle On-Air 🔴' } })}
      >
        {/* CircleViewItem 이미지 90% */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                    w-[90%] h-[90%] "
        >
          <CircleViewItem img={PickleLiveImage} onClick={() => {}} isRecentEpisode={true} />
        </div>
        {/* CircularProgressBar를 위에 덮기 */}
        {parentSize > 0 && (
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
            <CircularProgressBar size={parentSize} isPickleLive={true} />
            <div className="absolute  h-[80%] right-[-9px] top-[10%] bottom-0 w-[2px] bg-[#666666]" />
          </div>
        )}
        {/* 제목/부제목 */}
        <div style={{ top: parentSize }} className="absolute w-full ">
          <p className="text-base mb-1 px-1 font-semibold truncate  mt-4">
            {LIVE_STREAM_EPISODE.title}
          </p>
          <p className="text-sm text-gray-400 px-1 truncate">{LIVE_STREAM_EPISODE.subtitle}</p>
        </div>
      </div>
    </div>
  );
}

export default PickleLive;
