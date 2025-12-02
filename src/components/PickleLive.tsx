import { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import PickleLiveImage from '../assets/pickle_live.png';
import { LIVE_STREAM_EPISODE, LIVE_STREAM_EPISODE_EN } from '../constants/liveEpisode';
import { useIsEnglish } from '../hooks/useIsEnglish';
import CircleViewItem from './CircleViewItem';
import CircularProgressBar from './CircularProgressBar';

function PickleLive() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isEnglish } = useIsEnglish();
  const liveEpisode = isEnglish ? LIVE_STREAM_EPISODE_EN : LIVE_STREAM_EPISODE;

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
      <div className="text-lg mb-5 font-medium h-7 flex ">{t('sections.on-air')}</div>
      <div
        ref={containerRef}
        className="relative w-full aspect-square" // 이 div가 이미지/프로그레스바의 컨테이너가 됨
        onClick={() => navigate('/player/live', { state: { title: t('sections.on-air') } })}
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
        {/* 제목/부제목 div는 이미지 컨테이너 안에 없으므로 여기선 제거 */}
      </div>

      {/* *변경: 제목/부제목을 이미지 컨테이너 div 바깥, flex-col 흐름에 맞게 배치* */}
      {/* 이제 이 div는 containerRef (이미지 컨테이너)의 형제 요소가 됩니다. */}
      <div className="w-full mt-4">
        <p className="text-base mb-1 px-1 font-semibold truncate">{liveEpisode.title}</p>
        <p className="text-sm text-gray-400 px-1 truncate">{liveEpisode.subtitle}</p>
      </div>
    </div>
  );
}

export default PickleLive;
