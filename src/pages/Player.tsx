import React, { useEffect, useMemo, useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
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
import PlayList from '../components/player/PlayList';
import { usePlayer } from '../contexts/PlayerContext';
import type { EpisodeType } from '../types/episode';

function Player() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const playlist = location.state?.playlist;
  const playlistType = location.state?.playlistType;
  const liveStatus = location.state?.isLive;
  const originType = location.state?.originType;
  const recentSeriesId = location.state?.recentSeriesId;
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
    togglePlayPause,
    handlePlayNext,
    handlePlayPrev,
    handleSeek,
    handleSkip,
    formatTime,
    playEpisode,
    setPlaylist,
    closePlaylist,
  } = usePlayer();

  const effectiveIsLive = isLive || liveStatus;
  const episodeId = id ? parseInt(id, 10) : null;

  useEffect(() => {
    if (episodeId !== null && playlist) {
      const episodeToPlay = playlist.find((item: EpisodeType) => item.id === episodeId);
      const isPodcast = episodeToPlay?.type !== 'radio';
      const isLiveEpisode = liveStatus ?? false;

      playEpisode(episodeId, isLiveEpisode, isPodcast, originType, recentSeriesId);
      setPlaylist(playlist);
    }
  }, [
    episodeId,
    playEpisode,
    playlist,
    isLive,
    setPlaylist,
    liveStatus,
    originType,
    recentSeriesId,
  ]);

  useEffect(() => {
    return () => {
      if (isPlaylistOpen && closePlaylist) {
        closePlaylist();
      }
    };
  }, [isPlaylistOpen, closePlaylist]);

  const progressPercent = effectiveIsLive ? 100 : duration > 0 ? (currentTime / duration) * 100 : 0;
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
          <div className="flex flex-row items-center justify-center w-[80%] max-w-[1025px] gap-[52px]">
            <div className="flex-shrink-0">
              <Skeleton width={224} height={224} baseColor="#222" highlightColor="#444" />
            </div>
            <div className="flex flex-col flex-grow justify-between h-full">
              <div>
                <Skeleton height={36} width="90%" baseColor="#222" highlightColor="#444" />
                <Skeleton
                  height={29}
                  width="60%"
                  style={{ marginTop: `16px` }}
                  baseColor="#222"
                  highlightColor="#444"
                />
              </div>
              <Skeleton height={24} width="40%" baseColor="#222" highlightColor="#444" />
              <Skeleton height={24} width="40%" baseColor="#222" highlightColor="#444" />
            </div>
          </div>
          <div className="flex flex-col w-[80%] max-w-[1025px]" style={{ gap: `80px` }}>
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
    navigate(`/channel-detail/${currentEpisodeData.program_id}`, {
      replace: true,
      state: { ...location.state, title: title, program_id: currentEpisodeData.program_id },
    });
  };

  return (
    <div className="relative overflow-hidden flex justify-center items-center h-full pb-5">
      {imgUrl && (
        <div
          className="fixed inset-0 -z-10 bg-contain bg-no-repeat rounded-lg"
          style={{ backgroundImage: `url('${imgUrl}')` }}
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

      <div
        className={`bg-black/70 fixed inset-0 z-20 transition-opacity duration-300 ease-in-out ${isMoreBtn ? 'opacity-100' : 'opacity-0 invisible'}`}
      />

      <PlayList
        playlist={playlist}
        isOpenList={isPlaylistOpen}
        isHourDisplay={isHourDisplay}
        playlistType={playlistType}
        originType={originType}
        recentSeriesId={recentSeriesId}
      />

      <div className="relative flex flex-col justify-center items-center h-full gap-12 w-1/2">
        <div className="flex flex-row items-center justify-center gap-12 max-h-[260px] w-full">
          <div className="flex-shrink-0 w-40 h-40">
            {imgUrl ? (
              <img
                src={imgUrl}
                alt={currentEpisodeData.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-400"></div>
            )}
          </div>

          <div className="flex flex-col flex-grow justify-between h-full text-left">
            <p className="line-clamp-2 leading-snug text-2xl">
              {isLive ? currentEpisodeData.programs?.title : currentEpisodeData.title}
            </p>
            <p className="text-[#A6A6A9] text-lg">
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
            <p className={`text-[#A6A6A9] text-lg ${isLoading ? 'invisible' : ''}`}>
              {effectiveIsLive
                ? 'LIVE'
                : `${formatTime(currentTime, isHourDisplay)} / ${formatTime(duration, isHourDisplay)}`}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5 w-full ">
          <div className="flex flex-col items-center gap-5">
            <input
              type="range"
              min="0"
              max={duration}
              value={effectiveIsLive ? duration : currentTime}
              onChange={onHandleSeek}
              disabled={effectiveIsLive || isLoading}
              className={`custom-slider w-full h-1 rounded-lg appearance-none range-sm bg-slate-600 ${isLoading ? 'invisible' : ''} ${effectiveIsLive ? 'cursor-default' : 'cursor-pointer'}`}
              style={sliderStyle}
            />

            <div
              className={`flex justify-between w-[30%] max-w-[280px] transition-all duration-300 ease-in-out ${effectiveIsLive ? 'invisible' : ''} ${isMoreBtn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 invisible'} z-20`}
            >
              <button onClick={() => handleSkip(-15)}>
                <RiReplay15Fill size={36} />
              </button>
              <button onClick={() => handleSkip(15)}>
                <RiForward15Fill size={36} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between z-20 gap-16">
            <button className={`text-gray-400 ${effectiveIsLive ? 'invisible' : ''}`}>
              <img src={speedIcon} className="w-8 h-8" alt="speed" />
              <p className="text-xs">1.0x</p>
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
              className={`w-12 h-12 text-gray-400 ${effectiveIsLive ? 'invisible' : ''} flex items-center justify-center ${isMoreBtn ? 'rounded-full bg-white' : ''}`}
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
