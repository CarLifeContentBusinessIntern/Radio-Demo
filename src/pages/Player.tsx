import React, { useEffect, useMemo, useRef, useState } from 'react';
import { IoEllipsisVertical } from 'react-icons/io5';
import { RiForward15Fill, RiReplay15Fill } from 'react-icons/ri';
import {
  TbPlayerPauseFilled,
  TbPlayerPlayFilled,
  TbPlayerSkipBackFilled,
  TbPlayerSkipForwardFilled,
} from 'react-icons/tb';
import Skeleton from 'react-loading-skeleton';
import { useLocation, useParams } from 'react-router-dom';
import speedIcon from '../assets/speedIcon.svg';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import ListViewItem from '../components/ListViewItem';
import Scrollbar from '../components/Scrollbar';
import { usePlayer } from '../contexts/PlayerContext';
import type { EpisodeType } from '../types/episode';
import { AiOutlineLoading } from 'react-icons/ai';

function Player() {
  const { id } = useParams();
  const location = useLocation();
  const playlist = location.state?.playlist;
  const playlistType = location.state?.playlistType;
  const liveStatus = location.state?.isLive;
  const contentRef = useRef<HTMLDivElement>(null);
  const [isMoreBtn, setIsMoreBtn] = useState(false);

  const {
    currentEpisodeId,
    currentEpisodeData,
    currentEpisodeType,
    currentTime,
    duration,
    isPlaying,
    isLive,
    isLoading,
    isPlaylsitOpen,
    togglePlayPause,
    handlePlayNext,
    handlePlayPrev,
    handleSeek,
    handleSkip,
    formatTime,
    playEpisode,
    setPlaylist,
  } = usePlayer();

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
      <div
        className={`bg-black fixed inset-0 z-10 pt-20 transition-opacity duration-300 ease-in-out
          ${isPlaylsitOpen ? 'opacity-100' : 'opacity-0 invisible'} flex justify-center`}
      >
        <div className="flex relative overflow-hidden w-full">
          <Scrollbar scrollableRef={contentRef} />

          <div
            ref={contentRef}
            className="relative h-[70%] overflow-y-auto scrollbar-hide pr-24 w-full"
          >
            <ul className="flex flex-col gap-1">
              {playlist.map((item: EpisodeType) => {
                const isActive = currentEpisodeId === item.id;
                const imageUrl = item.img_url || item.programs?.img_url;
                const subTitle = isLive
                  ? `${item.programs?.broadcastings?.title} ${item.programs?.broadcastings?.channel}`
                  : item.programs?.title;

                return (
                  <li key={item.id} className={`rounded-md cursor-pointer p-3 flex items-center`}>
                    <div className="w-full">
                      <ListViewItem
                        id={item.id}
                        imgUrl={imageUrl}
                        title={isLive ? item.programs?.title : item.title}
                        subTitle={subTitle}
                        playTime={isActive ? formatTime(currentTime, isHourDisplay) : ''}
                        totalTime={!isLive && isActive ? (item.duration ?? '') : ''}
                        date={isLive ? '' : item.date}
                        hasAudio={item.audio_file ? true : false}
                        playlist={playlist}
                        playlistType={playlistType}
                        isPlayer={true}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

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
              {currentEpisodeType === 'podcast'
                ? `${currentEpisodeData.programs?.title} · ${currentEpisodeData.date}`
                : `${currentEpisodeData.programs?.broadcastings?.title} ${
                    currentEpisodeData.programs?.broadcastings?.channel
                  }`}
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
