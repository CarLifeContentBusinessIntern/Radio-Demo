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
    togglePlayPause,
    currentEpisodeId,
    currentEpisodeData,
    currentTime,
    duration,
    hasBeenActivated,
    isLive,
    handlePlayNext,
    handlePlayPrev,
    activePlaylist,
  } = usePlayer();

  const progress = duration > 0 ? (isLive ? 100 : (currentTime / duration) * 100) : 0;

  const handlePlayerClick = () => {
    const targetId = currentEpisodeId !== null ? currentEpisodeId : id;
    navigate(`/player/${targetId}`, {
      state: { isLive: isLive, playlist: activePlaylist, mixType: 'timeMix' },
    });
  };

  const handleControlsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!hasBeenActivated) return null;

  return (
    <div
      className="relative w-full max-w-[1027px] h-[126px] flex items-center gap-[15px] py-[15px] px-[23px] cursor-pointer bg-[#121317]"
      onClick={handlePlayerClick}
    >
      <div
        className="absolute top-0 left-0 h-[4px] bg-[#B76EEF] transition-width duration-100 ease-linear"
        style={{ width: `${progress}%` }}
      />

      <div className="flex-shrink-0">
        {currentEpisodeData?.radios.img_url ? (
          <img
            src={currentEpisodeData?.radios.img_url}
            alt={title}
            className="w-24 h-24 rounded-[11px] object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-md bg-gray-400"></div>
        )}
      </div>

      <div className="flex flex-col flex-grow min-w-0 overflow-hidden">
        <p className="font-semibold truncate text-[32px]">{currentEpisodeData?.title}</p>
        <p className="text-[28px] truncate">
          {`${currentEpisodeData?.radios?.channels?.broadcasting} ${currentEpisodeData?.radios?.channels?.channel}`}
        </p>
      </div>

      <div className="flex gap-x-16 lg:gap-x-[105px] mr-10" onClick={handleControlsClick}>
        <TbPlayerSkipBackFilled size={30} onClick={handlePlayPrev} />

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

        <TbPlayerSkipForwardFilled size={30} onClick={handlePlayNext} />
      </div>
    </div>
  );
}

export default BottomPlayer;
