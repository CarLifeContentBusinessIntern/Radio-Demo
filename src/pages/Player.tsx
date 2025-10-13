import React, { useEffect } from 'react';
import { IoEllipsisVertical } from 'react-icons/io5';
import { RiForward15Fill, RiReplay15Fill } from 'react-icons/ri';
import {
  TbPlayerPauseFilled,
  TbPlayerPlayFilled,
  TbPlayerSkipBackFilled,
  TbPlayerSkipForwardFilled,
} from 'react-icons/tb';
import { useParams } from 'react-router-dom';
import speedIcon from '../assets/speedIcon.svg';
import { usePlayer } from '../contexts/PlayerContext';
import { mockEpisodeData } from '../mock/mockEpisodeData';

function Player() {
  const { id } = useParams();
  const {
    currentEpisodeId,
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    handleSeek,
    handleSkip,
    formatTime,
    playEpisode,
    hasBeenActivated,
  } = usePlayer();

  const episodeId = id ? parseInt(id, 10) : null;
  const episodeData =
    episodeId !== null ? mockEpisodeData.find((item) => item.id === episodeId) : undefined;

  useEffect(() => {
    if (episodeId !== null && episodeId === currentEpisodeId && !hasBeenActivated) {
      playEpisode(episodeId);
    } else if (episodeId !== null && episodeId !== currentEpisodeId) {
      playEpisode(episodeId);
    }
  }, [episodeId, currentEpisodeId, playEpisode, hasBeenActivated]);

  if (!episodeData) return null;

  const onHandleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSeek(Number(e.target.value));
  };

  return (
    <div className="relative h-full overflow-hidden">
      {episodeData.imgUrl && (
        <div
          className="fixed inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: `url('${episodeData.imgUrl}')` }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
        </div>
      )}

      <div className="relative z-10 flex flex-col justify-center items-center h-full gap-[103px]">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-[52px] w-[80%] max-w-[1025px] max-h-56">
          <div className="flex-shrink-0">
            {episodeData.imgUrl ? (
              <img
                src={episodeData.imgUrl}
                alt={episodeData.title}
                className="w-40 h-40 md:w-56 md:h-56 object-cover"
              />
            ) : (
              <div className="w-40 h-40 md:w-56 md:h-56 bg-gray-400"></div>
            )}
          </div>

          <div className="flex flex-col flex-grow justify-between h-full text-center md:text-left">
            <p className="text-2xl md:text-5xl line-clamp-2">{episodeData.title}</p>
            <p className="text-xl md:text-4xl text-[#A6A6A9]">{episodeData.channel}</p>
            <p className="text-lg md:text-3xl text-[#A6A6A9]">
              {formatTime(currentTime)} / {formatTime(duration)}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-20 w-[80%] max-w-[1025px]">
          <div className="flex flex-col items-center gap-5">
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={onHandleSeek}
              className="w-full h-1 bg-white rounded-lg appearance-none cursor-pointer range-sm"
            />

            <div className="flex justify-between w-[60%] max-w-[507px]">
              <button onClick={() => handleSkip(-15)}>
                <RiReplay15Fill size={30} />
              </button>
              <button onClick={() => handleSkip(15)}>
                <RiForward15Fill size={30} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-16">
            <button>
              <img src={speedIcon} />
              <p className="text-[12px]">1.0x</p>
            </button>
            <button>
              <TbPlayerSkipBackFilled size={30} />
            </button>
            <button onClick={togglePlayPause}>
              {isPlaying ? <TbPlayerPauseFilled size={30} /> : <TbPlayerPlayFilled size={30} />}
            </button>
            <button>
              <TbPlayerSkipForwardFilled size={30} />
            </button>
            <button className="text-gray-400">
              <IoEllipsisVertical size={30} color="white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Player;
