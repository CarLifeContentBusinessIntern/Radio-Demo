import Skeleton from 'react-loading-skeleton';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { usePlayer } from '../contexts/PlayerContext';
import type { EpisodeType } from '../types/episode';
import { formatRemainingTime, formatTimeString, timeStringToSeconds } from '../utils/timeUtils';
import ImageWithSkeleton from './ImageWithSkeleton';
import { useTranslation } from 'react-i18next';

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
  recentSeriesId?: number | null;
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
  const { t } = useTranslation();

  const location = useLocation();
  const isLive = location.state?.isLive ?? false;
  const isRecentPage = location.pathname === '/episodes/recent';
  const isAIPickPage = location.pathname === '/ai-pick';

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
      className="flex items-center gap-8 cursor-pointer"
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
          toast.error(t('toast.no-contents'), { toastId: id });
        }
      }}
    >
      {/* 썸네일 이미지 */}
      <div className="flex-shrink-0 w-[92px] h-[92px]">
        {imgUrl ? (
          <ImageWithSkeleton
            src={imgUrl}
            alt={title}
            className={`w-full h-full ${isRound ? 'rounded-[10px]' : 'rounded-none'} object-cover`}
            skeletonClassName="rounded-[10px]"
          />
        ) : (
          <div
            className={`w-full h-full bg-gray-400 ${isRound ? 'rounded-[10px]' : 'rounded-none'}`}
          ></div>
        )}
      </div>

      {/* 에피소드 내용 */}
      <div className="flex-1 min-w-0 text-lg">
        <div className="font-semibold truncate">{title}</div>
        <div className="flex gap-5">
          <div className="text-[#A6A6A9] truncate">
            {[subTitle, date, formatTimeString(isLive ? '' : totalTime)]
              .filter(Boolean)
              .join(' · ')}
          </div>
        </div>

        {/* 프로그래스바 */}
        <div className="w-full h-[2px] mt-2">
          {!isRecentPage && !isAIPickPage && (lastPlayedTime > 0 || isPlayingEpisode) && (
            <div className="w-full h-[2px] bg-gray-600">
              <div
                className={`h-[2px] transition-width duration-100 ease-linear ${
                  currentEpisodeId === id ? 'bg-[#B76EEF]' : 'bg-[#888888]'
                }`}
                style={{
                  width: `${Math.min(progressPercent, 100)}%`,
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* 남은 시간 */}
      {(() => {
        const remainingSeconds = totalTimeSeconds - Math.floor(lastPlayedTime);
        const shouldShowRemainingTime =
          !isLive && remainingSeconds > 0 && (isPlayingEpisode || lastPlayedTime > 0);

        return (
          !isRecentPage &&
          !isAIPickPage &&
          shouldShowRemainingTime && (
            <p className="flex-shrink-0 w-20 text-right text-lg text-[#A6A6A9]">
              - {formatRemainingTime(lastPlayedTime, totalTimeSeconds)}
            </p>
          )
        );
      })()}
    </div>
  );
}

export default ListViewItem;
