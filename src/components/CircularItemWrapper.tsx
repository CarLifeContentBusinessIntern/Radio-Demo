import { useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetchRecentEpisodePlaylist } from '../hooks/useFetchRecentEpisodePlaylist';
import type { EpisodeType } from '../types/episode';
import CircleViewItem from './CircleViewItem';
import CircularProgressBar from './CircularProgressBar';

interface CircularItemWrapperProps {
  episode: EpisodeType;
}

function CircularItemWrapper({ episode }: CircularItemWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [parentSize, setParentSize] = useState(0);
  const navigate = useNavigate();
  const { data: playlist } = useFetchRecentEpisodePlaylist(
    episode.origin_type,
    episode.program_id,
    episode.recent_series_id
  );

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

  const handleOnClick = () => {
    if (episode.type === 'podcast') {
      navigate(`/player/podcasts/${episode.id}`, {
        replace: false,
        state: {
          isLive: false,
          playlist: playlist,
          isPickle: true,
        },
      });
    } else {
      navigate(`/player/${episode.id}`, {
        state: { isLive: false, playlist: playlist },
      });
    }
  };

  return (
    <div ref={containerRef} className="relative w-full aspect-square ">
      {/* CircleViewItem 이미지 90% */}
      {/* <div className="w-full h-full"> */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                    w-[90%] h-[90%] "
      >
        <CircleViewItem
          img={episode.img_url || episode.programs?.img_url}
          onClick={handleOnClick}
          isRecentEpisode={true}
        />
      </div>

      {/* CircularProgressBar를 위에 덮기 */}
      {parentSize > 0 && (
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
          <CircularProgressBar size={parentSize} episode={episode} />
        </div>
      )}

      {/* 제목/부제목 */}
      <div style={{ top: parentSize }} className="absolute w-full ">
        <p className="text-base mb-1 px-1 font-semibold truncate  mt-4">{episode.title}</p>
        <p className="text-sm text-gray-400 px-1 truncate ">{episode.programs?.title}</p>
      </div>
    </div>
  );
}

export default CircularItemWrapper;
