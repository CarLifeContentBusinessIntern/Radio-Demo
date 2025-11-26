import React, { useRef, useState, useLayoutEffect } from 'react';
import CircularProgressBar from './CircularProgressBar';
import CircleViewItem from './CircleViewItem';
import type { EpisodeType } from '../types/episode';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../contexts/PlayerContext';

interface CircularItemWrapperProps {
  episode: EpisodeType;
}

function CircularItemWrapper({ episode }: CircularItemWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [parentSize, setParentSize] = useState(0);
  const navigate = useNavigate();

  const { activePlaylist } = usePlayer();

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
          playlist: activePlaylist,
          isPickle: true,
        },
      });
    } else {
      navigate(`/player/${episode.id}`, {
        state: { isLive: false, playlist: activePlaylist },
      });
    }
  };

  return (
    <div ref={containerRef} className="relative w-full aspect-square">
      {/* CircleViewItem 이미지 100% */}
      <div className="w-full h-full">
        <CircleViewItem
          title={episode.title}
          //   subTitle={episode.subTitle}
          img={episode.programs?.img_url || episode.img_url}
          onClick={handleOnClick}
        />
      </div>

      {/* CircularProgressBar를 위에 덮기 */}
      {parentSize > 0 && (
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
          <CircularProgressBar size={parentSize} episode={episode} />
        </div>
      )}
    </div>
  );
}

export default CircularItemWrapper;
