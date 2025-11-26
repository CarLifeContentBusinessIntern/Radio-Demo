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
  originType: 'program' | 'series';
  recentSeriesId: number;
  onClose?: () => void;
}

function PlayList({
  playlist,
  isOpenList,
  playlistType,
  onClose,
  originType,
  recentSeriesId,
}: PlayListProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { isLive, playedDurations } = usePlayer();

  return (
    <div
      className={`bg-black fixed inset-0 z-30 pt-16 transition-opacity duration-300 ease-in-out
          ${isOpenList ? 'opacity-100' : 'opacity-0 invisible'} flex justify-center`}
    >
      <div className="flex relative overflow-hidden w-full h-[90%]">
        <Scrollbar scrollableRef={contentRef} />

        <div ref={contentRef} className="relative overflow-y-auto scrollbar-hide pr-20 w-full">
          <ul className="flex flex-col">
            {playlist.map((item: EpisodeType) => {
              const imageUrl = item.img_url || item.programs?.img_url;
              const subTitle = isLive
                ? `${item.programs?.broadcastings?.title} ${item.programs?.broadcastings?.channel}`
                : item.programs?.title;
              const uniqueKey = `${item.id || 'program'}_${item.programs?.id || 'no-id'}`;

              return (
                <li
                  key={uniqueKey}
                  className={`rounded-md cursor-pointer p-1 flex items-center`}
                  onClick={onClose}
                >
                  <div className="w-full">
                    <ListViewItem
                      id={item.id}
                      imgUrl={imageUrl}
                      title={isLive ? item.programs?.title : item.title}
                      subTitle={subTitle}
                      totalTime={!isLive ? (item.duration ?? '') : ''}
                      date={isLive ? '' : item.date}
                      hasAudio={item.audio_file ? true : false}
                      playlist={playlist}
                      playlistType={playlistType}
                      isPlayer={true}
                      originType={originType}
                      recentSeriesId={recentSeriesId}
                      listenedDuration={playedDurations[item.id] ?? item.listened_duration}
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
