import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { usePlayer } from '../contexts/PlayerContext';
import type { EpisodeType } from '../types/episode';
import { formatTimeString } from '../utils/timeUtils';
import ImageWithSkeleton from './ImageWithSkeleton';

type ListViewItemProps = {
  isLoading?: boolean;
  id?: number;
  imgUrl?: string;
  title?: string;
  subTitle?: string;
  playTime?: string;
  totalTime?: string;
  date?: string;
  hasAudio?: boolean;
  playlist?: EpisodeType[];
  playlistType?: string;
  isRound?: boolean;
  isPlayer?: boolean;
};

function ListViewItem({
  isLoading,
  id,
  imgUrl,
  title,
  subTitle,
  playTime,
  totalTime,
  date,
  hasAudio,
  playlist,
  isRound,
  isPlayer = false,
}: ListViewItemProps) {
  const navigate = useNavigate();
  const {
    hasBeenActivated,
    currentTime,
    duration,
    currentEpisodeData,
    currentEpisodeId,
    isLive,
    formatTime,
    setPlaylist,
  } = usePlayer();

  const progress = isLive ? 100 : duration > 0 ? (currentTime / duration) * 100 : 0;
  const isHourDisplay = duration >= 3600;
  const isPlayingEpisode = currentEpisodeId === id;
  const isPodcast = currentEpisodeData?.type === 'podcast';

  if (isLoading) {
    return (
      <div className="flex items-center justify-between gap-8 md:gap-14">
        <div className="flex-shrink-0">
          <Skeleton
            width={112}
            height={112}
            borderRadius="11px"
            baseColor="#444"
            highlightColor="gray"
          />
        </div>

        <div className="flex flex-col flex-grow min-w-0">
          <Skeleton
            height={28}
            width="80%"
            className="mb-2"
            baseColor="#444"
            highlightColor="gray"
          />
          <Skeleton height={24} width="50%" baseColor="#444" highlightColor="gray" />
        </div>

        <div className="hidden md:block">
          <Skeleton height={28} width={120} baseColor="#444" highlightColor="gray" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-between gap-8 md:gap-14 cursor-pointer"
      onClick={() => {
        setPlaylist(playlist ?? []);
        if (hasAudio) {
          if (isPodcast) {
            navigate(`/player/podcasts/${id}`, {
              replace: isPlayer ? true : false,
              state: {
                isLive: false,
                playlist: playlist,
              },
            });
          } else {
            navigate(`/player/${id}`, {
              replace: isPlayer ? true : false,
              state: { isLive: isLive, playlist: playlist },
            });
          }
        } else {
          toast.error(`콘텐츠 준비 중입니다`, { toastId: id });
        }
      }}
    >
      <div className="flex-shrink-0">
        {imgUrl ? (
          <ImageWithSkeleton
            src={imgUrl}
            alt={title}
            className={`w-28 h-28 ${isRound ? 'rounded-[11px]' : 'rounded-none'} object-cover`}
            skeletonClassName="rounded-[11px]"
          />
        ) : (
          <div
            className={`w-28 h-28 bg-gray-400 ${isRound ? 'rounded-[11px]' : 'rounded-none'}`}
          ></div>
        )}
      </div>

      <div className="flex flex-col flex-grow text-[28px] min-w-0">
        <div className="font-semibold truncate">{title}</div>
        <div className="flex gap-5">
          <div className="text-[#A6A6A9] truncate">
            {[subTitle, date, formatTimeString(isLive ? '' : totalTime)]
              .filter(Boolean)
              .join(' · ')}
          </div>
        </div>
        {hasBeenActivated && currentEpisodeId === id && (
          <div className="relative w-full h-[4px] bg-gray-600 mt-2">
            <div
              className="h-[4px] bg-[#B76EEF] transition-width duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      <div className="hidden md:block">
        {(!isPodcast || isPlayer) && isPlayingEpisode && !isLive && (
          <p className="text-[28px] text-[#A6A6A9] w-[240px] text-right">
            {playTime || formatTime(currentTime, isHourDisplay)}
            {totalTime ? ` / ${totalTime}` : ``}
          </p>
        )}
      </div>
    </div>
  );
}

export default ListViewItem;
