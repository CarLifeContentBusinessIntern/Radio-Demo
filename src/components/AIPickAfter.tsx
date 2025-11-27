import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import type { EpisodeType } from '../types/episode';
import { usePlayer } from '../contexts/PlayerContext';
import Skeleton from 'react-loading-skeleton';
import { FiRefreshCcw } from 'react-icons/fi';
import ListViewItem from './ListViewItem';
import ImageWithSkeleton from './ImageWithSkeleton';
import BannerBackground from '../assets/ai_pick_banner_background_after.png';
import BannerIcon from '../assets/ai_pick_banner_dailymix_after.png';
import PickleAIIcon from '../assets/ic_pickle_ai.png';
import { useTranslation } from 'react-i18next';
import { MdOutlinePlayCircle } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const EPISODE_COUNT = 5;

function AIPickAfter() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const fetchRandomEpisodes = async (): Promise<EpisodeType[]> => {
    const { data, error } = await supabase.rpc('get_random_episodes', { count: EPISODE_COUNT });

    if (error) throw error;
    return data;
  };

  const {
    data: episodes,
    refetch,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ['random-episodes'],
    queryFn: fetchRandomEpisodes,
    refetchOnWindowFocus: false,
  });

  const { playedDurations } = usePlayer();

  if (isLoading) {
    return (
      <div className="pt-7 pr-20 flex flex-col gap-8">
        {/* AI 아이콘 + 검색창 스켈레톤 */}
        <div className="flex items-center gap-6">
          <Skeleton circle width={56} height={56} baseColor="#2A2A2E" highlightColor="#3A3A3E" />
          <Skeleton
            height={56}
            borderRadius={9999}
            containerClassName="flex-1"
            baseColor="#202026"
            highlightColor="#2A2A2E"
          />
        </div>

        {/* 배너 스켈레톤 */}
        <Skeleton height={160} borderRadius={24} baseColor="#2A2A2E" highlightColor="#3A3A3E" />

        {/* 추천 섹션 스켈레톤 */}
        <div className="flex flex-col gap-6">
          <Skeleton width={256} height={24} baseColor="#2A2A2E" highlightColor="#3A3A3E" />

          <div className="flex flex-col gap-3">
            {Array.from({ length: EPISODE_COUNT }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-[#1A1A1E] rounded-xl">
                <Skeleton
                  circle
                  width={64}
                  height={64}
                  baseColor="#2A2A2E"
                  highlightColor="#3A3A3E"
                />
                <div className="flex-1 flex flex-col gap-2">
                  <Skeleton width="75%" height={16} baseColor="#2A2A2E" highlightColor="#3A3A3E" />
                  <Skeleton width="50%" height={12} baseColor="#2A2A2E" highlightColor="#3A3A3E" />
                  <Skeleton width="25%" height={12} baseColor="#2A2A2E" highlightColor="#3A3A3E" />
                </div>
                <Skeleton
                  circle
                  width={40}
                  height={40}
                  baseColor="#2A2A2E"
                  highlightColor="#3A3A3E"
                />
              </div>
            ))}
          </div>

          {/* 다시 추천받기 버튼 스켈레톤 */}
          <Skeleton height={64} borderRadius={9999} baseColor="#202026" highlightColor="#2A2A2E" />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-7 pr-20 flex flex-col gap-8">
      <div className="flex items-center gap-6">
        <ImageWithSkeleton
          src={PickleAIIcon}
          alt="Pickle AI"
          className="w-14 h-14"
          skeletonClassName="rounded-full"
          baseColor="#2A2A2E"
          highlightColor="#3A3A3E"
        />
        <div className="text-[#666666] bg-[#202026] px-10 py-4 rounded-full w-full cursor-pointer">
          {t('placeholder.voice-search')}
        </div>
      </div>

      <div
        className="relative w-full overflow-hidden"
        // onClick={() => navigate('/setting/preference')}
      >
        <img
          src={BannerBackground}
          className="cursor-pointer w-full h-40 rounded-3xl object-cover"
        />

        <div className="absolute w-full -top-8">
          <div className="flex justify-center items-center">
            <div className="flex items-center justify-between w-full max-w-[800px] px-4">
              <img src={BannerIcon} className="w-1/2 max-w-[360px] h-[230px]" />

              <div className="text-white gap-y1">
                <p className="font-bold text-2xl">{t('ai-pick.banner-after-1')}</p>
                <p className="font-medium text-lg my-2">
                  {t('ai-pick.banner-after-2-start')}
                  <span className="text-[#3D7D6D]">{t('ai-pick.banner-after-2-highlight')}</span>
                  {t('ai-pick.banner-after-2-end')}
                </p>
                <button
                  className="font-bold text-base bg-[#202020]/30 px-5 py-3 rounded-full flex items-center gap-3 cursor-pointer"
                  onClick={() => {
                    navigate(`/player/${episodes?.[0].id}`, {
                      state: { isLive: false, playlist: episodes },
                    });
                  }}
                >
                  <MdOutlinePlayCircle size={20} />
                  <p>{t('ai-pick.banner-after-3')}</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <p className="text-base font-medium">{t('sections.ai-pick-after-recomend')}</p>

        <div className="flex flex-col gap-3">
          {episodes?.map((ep) => (
            <ListViewItem
              key={ep.id}
              id={ep.id}
              imgUrl={ep.img_url || ep.programs?.img_url}
              title={ep.title}
              subTitle={ep.programs?.title}
              date={ep.date}
              hasAudio={!!ep.audio_file}
              isRound={true}
              playlist={episodes}
              isPlayer={false}
              totalTime={ep.duration}
              listenedDuration={playedDurations[ep.id] ?? ep.listened_duration}
            />
          ))}
        </div>

        <div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="bg-[#202026] w-full rounded-full flex justify-center items-center gap-6 py-5 hover:bg-[#2A2A2E] transition-colors disabled:opacity-50"
          >
            <div className={isFetching ? 'animate-spin' : ''}>
              <FiRefreshCcw size={20} color="#A1A1A1" />
            </div>
            <p className="text-xl text-[#A1A1A1] font-semibold">
              {isFetching ? '추천 불러오는 중...' : t('button.re-recomend')}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AIPickAfter;
