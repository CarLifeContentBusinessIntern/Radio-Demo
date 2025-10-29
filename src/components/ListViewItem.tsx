import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../contexts/PlayerContext';
import type { RadioType } from '../types/radio';
import type { Episode, PickleEpisode } from '../types/episode';
import { toast } from 'react-toastify';
import ImageWithSkeleton from './ImageWithSkeleton';
import { formatTimeString } from '../utils/timeUtils';

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
  playlist?: RadioType | Episode[] | PickleEpisode[];
  playlistType?: string;
  isPickle?: boolean;
  isRound?: boolean;
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
  playlistType,
  isPickle,
  isRound,
}: ListViewItemProps) {
  const navigate = useNavigate();
  const { hasBeenActivated, currentTime, duration, currentEpisodeId, isPlaying } = usePlayer();

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

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
      onClick={() =>
        hasAudio
          ? isPickle
            ? navigate(`/player/podcasts/${id}`, {
                replace: true,
                state: {
                  isLive: false,
                  playlist: playlist,
                  playlistType: playlistType,
                  isPickle: true,
                },
              })
            : navigate(`/player/${id}`, {
                replace: true,
                state: { isLive: false, playlist: playlist, playlistType: playlistType },
              })
          : toast.error(`콘텐츠 준비 중입니다`, { toastId: id })
      }
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
            {[subTitle, date, formatTimeString(totalTime)].filter(Boolean).join(' · ')}
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
        {(!isPickle || isPlaying) && (
          <p className="text-[28px] text-[#A6A6A9] w-[200px] text-right">
            {playTime}
            {totalTime ? ` / ${totalTime}` : ``}
          </p>
        )}
      </div>
    </div>
  );
}

export default ListViewItem;
