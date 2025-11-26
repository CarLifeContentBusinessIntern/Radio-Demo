import Skeleton from 'react-loading-skeleton';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { usePlayer } from '../contexts/PlayerContext';
import type { EpisodeType } from '../types/episode';
import { formatRemainingTime, formatTimeString, timeStringToSeconds } from '../utils/timeUtils';
import ImageWithSkeleton from './ImageWithSkeleton';

type ListViewItemProps = {
  isLoading?: boolean;
  id?: number;
  imgUrl?: string;
  title?: string;
  subTitle?: string;
  totalTime?: string;
  date?: string;
  hasAudio?: boolean;
  playlist?: EpisodeType[];
  playlistType?: string;
  isRound?: boolean;
  isPlayer?: boolean;
  originType?: 'program' | 'series';
  recentSeriesId?: number;
  listenedDuration?: number;
};

function ListViewItem({
  isLoading,
  id,
  imgUrl,
  title,
  subTitle,
  totalTime,
  date,
  hasAudio,
  playlist,
  isRound,
  isPlayer = false,
  originType,
  recentSeriesId,
  listenedDuration,
}: ListViewItemProps) {
  const navigate = useNavigate();
  const {
    currentTime,
    currentEpisodeData,
    currentEpisodeId,
    setPlaylist,
    saveCurrentEpisodeProgress,
  } = usePlayer();

  const location = useLocation();
  const isLive = location.state?.isLive ?? false;

  const isPlayingEpisode = currentEpisodeId === id;
  const isPodcast = currentEpisodeData?.type === 'podcast';

  // 재생 중인 에피소드는 현재 재생 시간, 그렇지 않은 에피소드는 저장된 재생 시간 사용
  const lastPlayedTime = isPlayingEpisode ? currentTime : listenedDuration || 0;

  const totalTimeSeconds = timeStringToSeconds(totalTime || '');
  const progressPercent = isLive
    ? 100
    : totalTimeSeconds > 0
      ? (lastPlayedTime / totalTimeSeconds) * 100
      : 0;

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
      className="flex items-center justify-between gap-8 cursor-pointer"
      onClick={() => {
        // 기존 재생 중인 에피소드 저장
        saveCurrentEpisodeProgress();

        setPlaylist(playlist ?? []);
        if (hasAudio) {
          if (isPodcast) {
            navigate(`/player/podcasts/${id}`, {
              replace: isPlayer ? true : false,
              state: {
                isLive: false,
                playlist: playlist,
                originType,
                recentSeriesId: recentSeriesId,
              },
            });
          } else if (isLive) {
            navigate(`/player/${id}/live`, {
              replace: isPlayer ? true : false,
              state: { isLive: true, playlist: playlist },
            });
          } else {
            navigate(`/player/${id}`, {
              replace: isPlayer ? true : false,
              state: {
                isLive: false,
                playlist: playlist,
                originType,
                recentSeriesId: recentSeriesId,
              },
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
            className={`w-24 h-24 ${isRound ? 'rounded-[11px]' : 'rounded-none'} object-cover`}
            skeletonClassName="rounded-[11px]"
          />
        ) : (
          <div
            className={`w-24 h-24 bg-gray-400 ${isRound ? 'rounded-[11px]' : 'rounded-none'}`}
          ></div>
        )}
      </div>

      <div className="flex flex-col flex-grow text-lg min-w-0">
        <div className="font-semibold truncate">{title}</div>
        <div className="flex gap-5">
          <div className="text-[#A6A6A9] truncate">
            {[subTitle, date, formatTimeString(isLive ? '' : totalTime)]
              .filter(Boolean)
              .join(' · ')}
          </div>
        </div>
        {(lastPlayedTime > 0 || isPlayingEpisode) && (
          <div className="relative w-full h-[4px] bg-gray-600 mt-2">
            <div
              className={`h-1 transition-width duration-100 ease-linear ${
                currentEpisodeId === id ? 'bg-[#B76EEF]' : 'bg-[#888888]'
              }`}
              style={{
                width: `${Math.min(progressPercent, 100)}%`,
              }}
            />
          </div>
        )}
      </div>
      <div className="hidden md:block">
        {
          // (!isPodcast || isPlayer) &&
          !isLive &&
            (isPlayingEpisode
              ? Math.max(0, totalTimeSeconds - Math.floor(lastPlayedTime)) > 0 && (
                  <p className="w-fit whitespace-nowrap text-lg text-[#A6A6A9] text-right">
                    - {formatRemainingTime(currentTime, totalTimeSeconds)}
                  </p>
                )
              : lastPlayedTime > 0 &&
                Math.max(0, totalTimeSeconds - Math.floor(lastPlayedTime)) > 0 && (
                  <p className="w-fit whitespace-nowrap text-lg text-[#A6A6A9] text-right">
                    - {formatRemainingTime(lastPlayedTime, totalTimeSeconds)}
                  </p>
                ))
        }
      </div>
    </div>
  );
}

export default ListViewItem;
