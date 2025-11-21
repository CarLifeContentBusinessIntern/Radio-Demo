import { useRef } from 'react';
import type { EpisodeType } from '../../types/episode';
import ListViewItem from '../ListViewItem';
import Scrollbar from '../Scrollbar';
import { usePlayer } from '../../contexts/PlayerContext';

interface PlayListProps {
  playlist: EpisodeType[];
  isOpenList: boolean;
  isHourDisplay: boolean;
  playlistType: string;
  onClose?: () => void;
}

function PlayList({ playlist, isOpenList, isHourDisplay, playlistType, onClose }: PlayListProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { currentEpisodeId, currentTime, isLive, formatTime } = usePlayer();

  return (
    <div
      className={`bg-black fixed inset-0 z-10 pt-20 transition-opacity duration-300 ease-in-out
          ${isOpenList ? 'opacity-100' : 'opacity-0 invisible'} flex justify-center`}
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
                <li
                  key={item.id || item.programs?.id}
                  className={`rounded-md cursor-pointer p-3 flex items-center`}
                  onClick={onClose}
                >
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
  );
}

export default PlayList;
