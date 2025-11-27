import {
  TbPlayerPauseFilled,
  TbPlayerPlayFilled,
  TbPlayerSkipBackFilled,
  TbPlayerSkipForwardFilled,
} from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../contexts/PlayerContext';
import { AiOutlineLoading } from 'react-icons/ai';
import ImageWithSkeleton from './ImageWithSkeleton';

type BottomPlayerProps = {
  id: number;
  imgUrl?: string;
  title: string;
};

function BottomPlayer({ id, title }: BottomPlayerProps) {
  const navigate = useNavigate();
  const {
    isPlaying,
    isLive,
    isLoading,
    currentEpisodeId,
    currentEpisodeData,
    currentEpisodeType,
    currentTime,
    duration,
    activePlaylist,
    hasBeenActivated,
    togglePlayPause,
    handlePlayBarNext,
    handlePlayBarPrev,
  } = usePlayer();

  const progress = duration > 0 ? (isLive ? 100 : (currentTime / duration) * 100) : 0;

  const handlePlayerClick = () => {
    const targetId = currentEpisodeId !== null ? currentEpisodeId : id;
    if (currentEpisodeType === 'podcast') {
      navigate(`/player/podcasts/${id}`, {
        replace: false,
        state: {
          isLive: false,
          playlist: activePlaylist,
          playlistType: 'PickleEpisodeType',
          originType: currentEpisodeData?.origin_type,
          recentSeriesId: currentEpisodeData?.recent_series_id,
          isPickle: true,
        },
      });
    } else if (isLive) {
      navigate(`/player/${targetId}/live`, {
        state: { isLive: true, playlist: activePlaylist, playlistType: 'EpisodeType' },
      });
    } else {
      navigate(`/player/${targetId}`, {
        state: {
          isLive: isLive,
          playlist: activePlaylist,
          playlistType: 'EpisodeType',
          originType: currentEpisodeData?.origin_type,
          recentSeriesId: currentEpisodeData?.recent_series_id,
        },
      });
    }
  };

  const handleControlsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!hasBeenActivated) return null;

  const imageUrl = currentEpisodeData?.img_url || currentEpisodeData?.programs?.img_url;

  return (
    <div
      className="relative w-full h-24 flex items-center gap-4 py-4 px-6 cursor-pointer bg-[#121317]"
      onClick={handlePlayerClick}
    >
      <div className="absolute top-0 left-0 w-full h-[4px] bg-gray-600">
        <div
          className="h-full bg-[#B76EEF] transition-width duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-shrink-0">
        {imageUrl ? (
          <ImageWithSkeleton
            src={imageUrl}
            alt={title}
            className="w-16 h-16 rounded-lg object-cover"
            skeletonClassName="w-[224px] h-[224px]"
            baseColor="#222"
            highlightColor="#444"
          />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-gray-400"></div>
        )}
      </div>

      <div className="flex flex-col flex-grow min-w-0 overflow-hidden">
        <p className="text-lg font-semibold truncate">
          {isLive ? currentEpisodeData?.programs?.title : currentEpisodeData?.title}
        </p>
        <p className="text-base truncate">
          {currentEpisodeData?.programs?.title} {currentEpisodeData?.date}
        </p>
      </div>

      <div className="flex w-full justify-between max-w-60 mr-4" onClick={handleControlsClick}>
        <TbPlayerSkipBackFilled size={25} onClick={handlePlayBarPrev} />

        <button
          className="relative w-6 h-6 disabled:cursor-not-allowed"
          onClick={togglePlayPause}
          disabled={isLoading}
        >
          {isLoading ? (
            <AiOutlineLoading size={25} className="animate-spin" />
          ) : isPlaying ? (
            <TbPlayerPauseFilled size={25} />
          ) : (
            <TbPlayerPlayFilled size={25} />
          )}
        </button>

        <TbPlayerSkipForwardFilled size={25} onClick={handlePlayBarNext} />
      </div>
    </div>
  );
}

export default BottomPlayer;
