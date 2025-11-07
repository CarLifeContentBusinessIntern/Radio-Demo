import {
  TbPlayerPauseFilled,
  TbPlayerPlayFilled,
  TbPlayerSkipBackFilled,
  TbPlayerSkipForwardFilled,
} from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../contexts/PlayerContext';

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
          isPickle: true,
        },
      });
    } else {
      navigate(`/player/${targetId}`, {
        state: { isLive: isLive, playlist: activePlaylist, playlistType: 'EpisodeType' },
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
      className="relative w-full max-w-[1027px] h-[126px] flex items-center gap-[15px] py-[15px] px-[23px] cursor-pointer bg-[#121317]"
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
          <img src={imageUrl} alt={title} className="w-24 h-24 rounded-[11px] object-cover" />
        ) : (
          <div className="w-24 h-24 rounded-md bg-gray-400"></div>
        )}
      </div>

      <div className="flex flex-col flex-grow min-w-0 overflow-hidden">
        <p className="font-semibold truncate text-[32px]">
          {isLive ? currentEpisodeData?.programs?.title : currentEpisodeData?.title}
        </p>
        <p className="text-[28px] truncate">
          {currentEpisodeType === 'podcast'
            ? `${currentEpisodeData?.programs?.title} ${currentEpisodeData?.date}`
            : `${currentEpisodeData?.programs?.broadcastings?.title} ${currentEpisodeData?.programs?.broadcastings?.channel}`}
        </p>
      </div>

      <div className="flex gap-x-16 lg:gap-x-[105px] mr-10" onClick={handleControlsClick}>
        <TbPlayerSkipBackFilled size={30} onClick={handlePlayBarPrev} />

        <div className="relative w-6 h-6" onClick={togglePlayPause}>
          <TbPlayerPlayFilled
            size={30}
            className={`absolute left-0 top-0 transition-all duration-300 ease-in-out ${
              isPlaying ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'
            }`}
          />
          <TbPlayerPauseFilled
            size={30}
            className={`absolute left-0 top-0 transition-all duration-300 ease-in-out ${
              isPlaying ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
            }`}
          />
        </div>

        <TbPlayerSkipForwardFilled size={30} onClick={handlePlayBarNext} />
      </div>
    </div>
  );
}

export default BottomPlayer;
