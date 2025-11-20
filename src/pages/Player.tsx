import React, { useEffect, useMemo, useState } from 'react';
import { IoEllipsisVertical } from 'react-icons/io5';
import { RiForward15Fill, RiReplay15Fill } from 'react-icons/ri';
import {
  TbPlayerPauseFilled,
  TbPlayerPlayFilled,
  TbPlayerSkipBackFilled,
  TbPlayerSkipForwardFilled,
} from 'react-icons/tb';
import Skeleton from 'react-loading-skeleton';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import speedIcon from '../assets/speedIcon.svg';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import { usePlayer } from '../contexts/PlayerContext';
import type { EpisodeType } from '../types/episode';
import { AiOutlineLoading } from 'react-icons/ai';
import PlayList from '../components/player/PlayList';
import { useFetchChannel } from '../hooks/useFetchChannel';

function Player() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const playlist = location.state?.playlist;
  const playlistType = location.state?.playlistType;
  const liveStatus = location.state?.isLive;
  const [isMoreBtn, setIsMoreBtn] = useState(false);
  const {
    currentEpisodeData,
    currentEpisodeType,
    currentTime,
    duration,
    isPlaying,
    isLive,
    isLoading,
    isPlaylistOpen,
    isOpenChannelList,
    togglePlayPause,
    toggleChannelList,
    handlePlayNext,
    handlePlayPrev,
    handleSeek,
    handleSkip,
    formatTime,
    playEpisode,
    setPlaylist,
  } = usePlayer();
  const {
    data: channelEpisodeData,
    isLoading: isChannelDataLoading,
    error,
  } = useFetchChannel(currentEpisodeData?.program_id ?? 0);

  const episodeId = id ? parseInt(id, 10) : null;

  useEffect(() => {
    if (episodeId !== null && playlist) {
      const episodeToPlay = playlist.find((item: EpisodeType) => item.id === episodeId);
      const isPodcast = episodeToPlay?.type === 'podcast';
      playEpisode(episodeId, liveStatus, isPodcast);
      setPlaylist(playlist);
    }
  }, [episodeId, playEpisode, playlist, isLive, setPlaylist, liveStatus]);

  const progressPercent = isLive ? 100 : duration > 0 ? (currentTime / duration) * 100 : 0;
  const playedColor = '#B76EEF';
  const unplayedColor = '#ffffff';
  const sliderStyle = useMemo(
    () => ({
      background: `linear-gradient(to right, ${playedColor} ${progressPercent}%, ${unplayedColor} ${progressPercent}%)`,
    }),
    [progressPercent, playedColor, unplayedColor]
  );

  if (!currentEpisodeData || !playlist) {
    return (
      <div className="relative h-full overflow-hidden">
        <div className="relative z-10 flex flex-col justify-center items-center h-full gap-[103px]">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-[52px] w-[80%] max-w-[1025px] max-h-56">
            <div className="flex-shrink-0">
              <Skeleton width={224} height={224} baseColor="#222" highlightColor="#444" />
            </div>

            <div className="flex flex-col flex-grow justify-between h-full w-full md:w-auto">
              <div>
                <Skeleton height={'2.25rem'} width="90%" baseColor="#222" highlightColor="#444" />
                <Skeleton
                  height={'1.8rem'}
                  width="60%"
                  className="mt-4"
                  baseColor="#222"
                  highlightColor="#444"
                />
              </div>
              <Skeleton height={'1.5rem'} width="40%" baseColor="#222" highlightColor="#444" />
              <Skeleton height={'1.5rem'} width="40%" baseColor="#222" highlightColor="#444" />
            </div>
          </div>

          <div className="flex flex-col gap-20 w-[80%] max-w-[1025px]">
            <Skeleton height={60} width="100%" baseColor="#222" highlightColor="#444" />
            <Skeleton height={60} width="100%" baseColor="#222" highlightColor="#444" />
          </div>
        </div>
      </div>
    );
  }

  const onHandleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSeek(Number(e.target.value));
  };

  const imgUrl = currentEpisodeData.img_url || currentEpisodeData.programs?.img_url;

  const isHourDisplay = duration >= 3600;

  const handleToggleChannelList = (title: string) => {
    if (!isChannelDataLoading && !error) {
      toggleChannelList();
      navigate(location.pathname, {
        replace: true,
        state: {
          ...location.state,
          title: title,
          program_id: currentEpisodeData.program_id,
        },
      });
    }
  };

  return (
    <div className="relative h-full overflow-hidden">
      {/* 플레이어 배경 */}
      {imgUrl && (
        <div
          className="fixed inset-0 -z-10 bg-contain bg-no-repeat rounded-lg"
          style={{
            backgroundImage: `url('${imgUrl}')`,
          }}
        >
          <div
            className="absolute inset-0 backdrop-blur-lg"
            style={{
              background:
                'radial-gradient(ellipse 35% 60% at 5% 50%, rgba(255, 255, 255, 0.15) 10%, black 100%)',
            }}
          />
        </div>
      )}

      {/* 확장 버튼 배경 */}
      <div
        className={`bg-black/70 fixed inset-0 z-20
          transition-opacity duration-300 ease-in-out
          ${isMoreBtn ? 'opacity-100' : 'opacity-0 invisible'}
        `}
      />

      {/* 에피소드 목록 */}
      <PlayList
        playlist={playlist}
        isOpenList={isPlaylistOpen}
        isHourDisplay={isHourDisplay}
        playlistType={playlistType}
      />

      {/* 채널 에피소드 목록 */}
      <PlayList
        playlist={channelEpisodeData}
        isOpenList={isOpenChannelList}
        isHourDisplay={isHourDisplay}
        playlistType={playlistType}
        onClose={toggleChannelList}
      />

      {/* 플레이 화면 */}
      <div className="relative flex flex-col justify-center items-center h-full gap-[103px]">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-[52px] w-[80%] max-w-[1025px] max-h-[260px]">
          <div className="flex-shrink-0">
            {imgUrl ? (
              <ImageWithSkeleton
                src={imgUrl}
                alt={currentEpisodeData.title}
                className="w-40 h-40 md:w-60 md:h-60 object-cover"
                skeletonClassName="w-[224px] h-[224px]"
                baseColor="#222"
                highlightColor="#444"
              />
            ) : (
              <div className="w-40 h-40 md:w-60 md:h-60 bg-gray-400"></div>
            )}
          </div>

          <div className="flex flex-col flex-grow justify-between h-full text-center md:text-left">
            <p className="text-2xl md:text-[45px] line-clamp-2 leading-snug">
              {isLive ? currentEpisodeData.programs?.title : currentEpisodeData.title}
            </p>
            <p className="text-xl md:text-[38px] text-[#A6A6A9]">
              {currentEpisodeType === 'podcast' ? (
                <>
                  <button
                    onClick={() =>
                      handleToggleChannelList(currentEpisodeData.programs?.title ?? '')
                    }
                  >
                    {currentEpisodeData.programs?.title}
                  </button>
                  · {currentEpisodeData.date}
                </>
              ) : (
                <>
                  {currentEpisodeData.programs?.broadcastings?.title}
                  <button
                    onClick={() =>
                      handleToggleChannelList(
                        currentEpisodeData.programs?.broadcastings?.channel ?? ''
                      )
                    }
                  >
                    {currentEpisodeData.programs?.broadcastings?.channel}
                  </button>
                </>
              )}
            </p>
            <p className={`text-lg md:text-[32px] text-[#A6A6A9] ${isLoading ? 'invisible' : ''}`}>
              {isLive
                ? 'LIVE'
                : `${formatTime(currentTime, isHourDisplay)} / ${formatTime(duration, isHourDisplay)}`}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-16 w-[80%] max-w-[1025px]">
          <div className="flex flex-col items-center gap-5">
            <input
              type="range"
              min="0"
              max={duration}
              value={isLive ? duration : currentTime}
              onChange={onHandleSeek}
              disabled={isLive || isLoading}
              className={`custom-slider w-full h-1 rounded-lg appearance-none cursor-pointer range-sm bg-slate-600 ${isLive ? 'invisible' : ''}`}
              style={sliderStyle}
            />

            <div
              className={`flex justify-between w-[60%] max-w-[300px] transition-all duration-300 ease-in-out ${isLive ? 'invisible' : ''} ${isMoreBtn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 invisible'} z-20 mt-8`}
            >
              <button onClick={() => handleSkip(-15)}>
                <RiReplay15Fill size={36} />
              </button>
              <button onClick={() => handleSkip(15)}>
                <RiForward15Fill size={36} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-16 z-20">
            <button className={`text-gray-400 ${isLive ? 'invisible' : ''}`}>
              <img src={speedIcon} />
              <p className="text-[12px]">1.0x</p>
            </button>

            <button onClick={handlePlayPrev}>
              <TbPlayerSkipBackFilled size={30} />
            </button>
            <button onClick={togglePlayPause} disabled={isLoading}>
              {isLoading ? (
                <AiOutlineLoading size={30} className="animate-spin" />
              ) : isPlaying ? (
                <TbPlayerPauseFilled size={30} />
              ) : (
                <TbPlayerPlayFilled size={30} />
              )}
            </button>
            <button onClick={handlePlayNext}>
              <TbPlayerSkipForwardFilled size={30} />
            </button>

            <button
              className={`text-gray-400 ${isLive ? 'invisible' : ''} w-12 h-12 flex items-center justify-center ${isMoreBtn ? 'rounded-full bg-white' : ''}`}
              onClick={() => setIsMoreBtn(!isMoreBtn)}
            >
              <IoEllipsisVertical size={30} color={isMoreBtn ? 'black' : 'white'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Player;
