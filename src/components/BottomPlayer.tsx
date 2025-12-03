import { AiOutlineLoading } from 'react-icons/ai';
import {
  TbPlayerPauseFilled,
  TbPlayerPlayFilled,
  TbPlayerSkipBackFilled,
  TbPlayerSkipForwardFilled,
} from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { LIVE_STREAM_EPISODE, LIVE_STREAM_EPISODE_EN } from '../constants/liveEpisode';
import { usePlayer } from '../contexts/PlayerContext';
import { useIsEnglish } from '../hooks/useIsEnglish';
import ImageWithSkeleton from './ImageWithSkeleton';
import { timeStringToSeconds } from '../utils/timeUtils';

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
    activePlaylist,
    hasBeenActivated,
    togglePlayPause,
    handlePlayBarNext,
    handlePlayBarPrev,
  } = usePlayer();

  const { isEnglish } = useIsEnglish();
  const liveEpisode = isEnglish ? LIVE_STREAM_EPISODE_EN : LIVE_STREAM_EPISODE;

  const isOnAirEpisode = currentEpisodeData?.id === liveEpisode.id;

  const totalTime = currentEpisodeData?.duration;
  const totalTimeSeconds = totalTime ? timeStringToSeconds(totalTime) : 0;
  const progress =
    totalTimeSeconds > 0 ? (isLive ? 100 : (currentTime / totalTimeSeconds) * 100) : 0;
  const handlePlayerClick = () => {
    const targetId = currentEpisodeId !== null ? currentEpisodeId : id;

    if (isOnAirEpisode) {
      navigate(`/player/live`, {
        replace: false,
        state: { isOnAir: true, playlist: activePlaylist, title: 'Live P!ckle 🔴' },
      });

      return;
    }

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

  const imageUrl = isOnAirEpisode
    ? liveEpisode.img_url
    : currentEpisodeData?.img_url || currentEpisodeData?.programs?.img_url;

  return (
    <div
      className="w-full flex items-center justify-center gap-4 py-2 px-6 cursor-pointer bg-[#121317]"
      onClick={handlePlayerClick}
    >
      <div className="absolute top-0 left-0 w-full h-[4px] bg-gray-600">
        <div
          className="h-full bg-[#B76EEF] transition-width duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex max-w-screen-xl items-stretch justify-center w-full">
        {/* 컨트롤 버튼 */}
        <div className="flex items-center gap-2 mr-8 self-stretch" onClick={handleControlsClick}>
          <div
            className="h-full aspect-[3/2] flex items-center justify-center"
            onClick={() => !isOnAirEpisode && handlePlayBarPrev()}
          >
            <TbPlayerSkipBackFilled size={25} />
          </div>

          <button
            className="relative h-full aspect-[3/2] flex items-center justify-center disabled:cursor-not-allowed"
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

          <div
            className="h-full aspect-[3/2] flex items-center justify-center"
            onClick={() => !isOnAirEpisode && handlePlayBarNext()}
          >
            <TbPlayerSkipForwardFilled size={25} />
          </div>
        </div>

        {/* 에피소드 정보 */}
        <div className="flex flex-col flex-grow min-w-0 overflow-hidden text-right mr-4">
          <p className="text-base font-semibold truncate">
            {isOnAirEpisode
              ? liveEpisode.title
              : isLive
                ? currentEpisodeData?.programs?.title
                : currentEpisodeData?.title}
          </p>
          <p className="text-sm truncate">
            {currentEpisodeData?.programs?.title} {currentEpisodeData?.date}
          </p>
        </div>

        {/* 썸네일 */}
        <div className="flex-shrink-0">
          {imageUrl ? (
            <ImageWithSkeleton
              src={imageUrl}
              alt={title}
              className="w-12 h-12 rounded-lg object-cover"
              skeletonClassName="w-[224px] h-[224px]"
              baseColor="#222"
              highlightColor="#444"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-gray-400"></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BottomPlayer;
