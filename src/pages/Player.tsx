import React, { useEffect, useRef, useState } from 'react';
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
import ListViewItem from '../components/ListViewItem';
import Scrollbar from '../components/Scrollbar';
import { usePlayer } from '../contexts/PlayerContext';
import type { Episode } from '../types/episode';
import type { RadioType } from '../types/radio';
import type { ThemeType } from '../types/theme';

function Player() {
  const { id } = useParams();
  const [isMoreBtn, setIsMoreBtn] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const playlist = location.state?.playlist;
  const isMix = location.state?.isMix;

  const [finalPlaylist, setFinalPlaylist] = useState<Episode[]>([]);

  const {
    currentEpisodeId,
    currentEpisodeData,
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    handleSeek,
    handleSkip,
    formatTime,
    playEpisode,
    isLive,
    isPlaylsitOpen,
    togglePlaylist,
  } = usePlayer();

  const episodeId = id ? parseInt(id, 10) : null;

  useEffect(() => {
    if (episodeId !== null) {
      playEpisode(episodeId, false);
    }
  }, [episodeId, playEpisode]);

  useEffect(() => {
    if (isMix && playlist) {
      const theme = playlist as ThemeType;
      const episodeIds = theme.episode_ids || [];
      const allEpisodesMap = new Map<number, Episode>();

      theme.radio_themes?.forEach((rt) => {
        rt.radios.episodes.forEach((episode) => {
          const episodeWithRadio = {
            ...episode,
            radios: rt.radios,
          };
          allEpisodesMap.set(episode.id, episodeWithRadio);
        });
      });

      const processedEpisodes = episodeIds
        .map((id) => allEpisodesMap.get(id))
        .filter(Boolean) as Episode[];

      setFinalPlaylist(processedEpisodes);
    } else if (!isMix && playlist) {
      const radio = playlist as RadioType;
      setFinalPlaylist(radio.episodes || []);
    }
  }, [playlist, isMix]);

  if (!currentEpisodeData || finalPlaylist.length === 0) {
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

  return (
    <div className="relative h-full overflow-hidden">
      {/* 플레이어 배경 */}
      {currentEpisodeData.radios.img_url && (
        <div
          className="fixed inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: `url('${currentEpisodeData.radios.img_url}')` }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
        </div>
      )}

      {/* 확장 버튼 배경 */}
      <div
        className={`bg-black/60 fixed inset-0 z-20 mt-20
          transition-opacity duration-300 ease-in-out
          ${isMoreBtn ? 'opacity-100' : 'opacity-0 invisible'}
        `}
      />

      {/* 에피소드 목록 */}
      <div
        className={`bg-black fixed inset-0 z-10 mt-20 transition-opacity duration-300 ease-in-out
          ${isPlaylsitOpen ? 'opacity-100' : 'opacity-0 invisible'} flex justify-center`}
      >
        <div className="flex relative overflow-hidden w-full">
          <Scrollbar scrollableRef={contentRef} />

          <div
            ref={contentRef}
            className="relative h-[70%] overflow-y-auto scrollbar-hide pr-24 w-full"
          >
            <ul className="flex flex-col gap-1">
              {finalPlaylist.map((item: Episode) => {
                const isActive = currentEpisodeId === item.id;
                return (
                  <li
                    key={item.id}
                    className={`rounded-md cursor-pointer p-3 flex items-center`}
                    onClick={() => {
                      playEpisode(item.id);
                      togglePlaylist();
                    }}
                  >
                    <div className="w-full">
                      <ListViewItem
                        key={item.id}
                        id={item.id}
                        imgUrl={isMix ? item.radios.img_url : (playlist as RadioType).img_url}
                        title={item.title}
                        subTitle={isMix ? item.radios.title : (playlist as RadioType).title}
                        playTime={isActive ? formatTime(currentTime) : ''}
                        totalTime={isActive ? item.total_time : ''}
                        date={item.date}
                        hasAudio={item.audio_file ? true : false}
                        playlist={playlist}
                        isMix={isMix}
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
            {currentEpisodeData.radios.img_url ? (
              <img
                src={currentEpisodeData.radios.img_url}
                alt={currentEpisodeData.title}
                className="w-40 h-40 md:w-60 md:h-60 object-cover"
              />
            ) : (
              <div className="w-40 h-40 md:w-60 md:h-60 bg-gray-400"></div>
            )}
          </div>

          <div className="flex flex-col flex-grow justify-between h-full text-center md:text-left">
            <p className="text-2xl md:text-[45px] line-clamp-2 leading-snug">
              {currentEpisodeData.title}
            </p>
            <p className="text-xl md:text-[38px] text-[#A6A6A9]">
              {`${currentEpisodeData.radios?.channels?.broadcasting} ${currentEpisodeData.radios?.channels?.channel}`}
            </p>
            <p className="text-lg md:text-[32px] text-[#A6A6A9]">
              {isLive ? 'LIVE' : `${formatTime(currentTime)} / ${formatTime(duration)}`}
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
              disabled={isLive}
              className="w-full h-1 bg-white rounded-lg appearance-none cursor-pointer range-sm"
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

            <button>
              <TbPlayerSkipBackFilled size={30} />
            </button>
            <button onClick={togglePlayPause}>
              {isPlaying ? <TbPlayerPauseFilled size={30} /> : <TbPlayerPlayFilled size={30} />}
            </button>
            <button>
              <TbPlayerSkipForwardFilled size={30} />
            </button>

            <button
              className={`text-gray-400 ${isLive ? 'invisible' : ''}`}
              onClick={() => setIsMoreBtn(!isMoreBtn)}
            >
              <IoEllipsisVertical size={30} color="white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Player;
