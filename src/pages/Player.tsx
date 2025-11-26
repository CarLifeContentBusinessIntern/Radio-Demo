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
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import PlayList from '../components/player/PlayList';
import { usePlayer } from '../contexts/PlayerContext';
import { useZoom } from '../contexts/ZoomContext';
import type { EpisodeType } from '../types/episode';

function Player() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedZoom } = useZoom();
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

  // zoom에 따른 스케일 조정 (Player 페이지만)
  const scale = (value: number) => {
    // zoom이 클수록 크기를 줄임
    if (selectedZoom >= 1.8) return value * 0.65;
    if (selectedZoom >= 1.6) return value * 0.7;
    if (selectedZoom >= 1.4) return value * 0.8;
    if (selectedZoom >= 1.2) return value * 0.9;
    return value;
  };

  useEffect(() => {
    if (episodeId !== null && playlist) {
      const episodeToPlay = playlist.find((item: EpisodeType) => item.id === episodeId);
      const isPodcast = episodeToPlay?.type === 'podcast';
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
        <div
          className="relative z-10 flex flex-col justify-center items-center h-full"
          style={{ gap: `${scale(103)}px` }}
        >
          <div
            className="flex flex-row items-center justify-center w-[80%] max-w-[1025px]"
            style={{ gap: `${scale(52)}px` }}
          >
            <div className="flex-shrink-0">
              <Skeleton
                width={scale(224)}
                height={scale(224)}
                baseColor="#222"
                highlightColor="#444"
              />
            </div>
            <div className="flex flex-col flex-grow justify-between h-full">
              <div>
                <Skeleton height={scale(36)} width="90%" baseColor="#222" highlightColor="#444" />
                <Skeleton
                  height={scale(29)}
                  width="60%"
                  style={{ marginTop: `${scale(16)}px` }}
                  baseColor="#222"
                  highlightColor="#444"
                />
              </div>
              <Skeleton height={scale(24)} width="40%" baseColor="#222" highlightColor="#444" />
              <Skeleton height={scale(24)} width="40%" baseColor="#222" highlightColor="#444" />
            </div>
          </div>
          <div className="flex flex-col w-[80%] max-w-[1025px]" style={{ gap: `${scale(80)}px` }}>
            <Skeleton height={scale(60)} width="100%" baseColor="#222" highlightColor="#444" />
            <Skeleton height={scale(60)} width="100%" baseColor="#222" highlightColor="#444" />
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
    navigate(`/like/${currentEpisodeData.program_id}`, {
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
                <RiReplay15Fill size={scale(36)} />
              </button>
              <button onClick={() => handleSkip(15)}>
                <RiForward15Fill size={scale(36)} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between z-20" style={{ gap: `${scale(64)}px` }}>
            <button className={`text-gray-400 ${effectiveIsLive ? 'invisible' : ''}`}>
              <img
                src={speedIcon}
                style={{ width: `${scale(32)}px`, height: `${scale(32)}px` }}
                alt="speed"
              />
              <p style={{ fontSize: `${scale(12)}px` }}>1.0x</p>
            </button>

            <button onClick={handlePlayPrev}>
              <TbPlayerSkipBackFilled size={scale(30)} />
            </button>
            <button onClick={togglePlayPause} disabled={isLoading}>
              {isLoading ? (
                <AiOutlineLoading size={scale(30)} className="animate-spin" />
              ) : isPlaying ? (
                <TbPlayerPauseFilled size={scale(30)} />
              ) : (
                <TbPlayerPlayFilled size={scale(30)} />
              )}
            </button>
            <button onClick={handlePlayNext}>
              <TbPlayerSkipForwardFilled size={scale(30)} />
            </button>

            <button
              className={`text-gray-400 ${effectiveIsLive ? 'invisible' : ''} flex items-center justify-center ${isMoreBtn ? 'rounded-full bg-white' : ''}`}
              style={{ width: `${scale(48)}px`, height: `${scale(48)}px` }}
              onClick={() => setIsMoreBtn(!isMoreBtn)}
            >
              <IoEllipsisVertical size={scale(30)} color={isMoreBtn ? 'black' : 'white'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Player;
