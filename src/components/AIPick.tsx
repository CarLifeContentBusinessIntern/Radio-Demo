import { useQuery } from '@tanstack/react-query';
import { FiRefreshCcw } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import PickleAIIcon from '../assets/ic_pickle_ai.png';
import ListViewItem from '../components/ListViewItem';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import { usePlayer } from '../contexts/PlayerContext';
import { supabase } from '../lib/supabaseClient';
import type { EpisodeType } from '../types/episode';
import { fetchRandomEpisodes } from '../api/randomEpisodes';
import { useNavigate } from 'react-router-dom';
import { useVersion } from '../contexts/VersionContext';

const EPISODE_COUNT = 5;

interface AIPickProps {
  bannerContent: React.ReactNode;
  sectionTitleKey: string;
  moodPrefix?: string;
}

function AIPick({ bannerContent, sectionTitleKey, moodPrefix = '' }: AIPickProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAIVoiceSearchVersion } = useVersion();

  const fetchPlaylist = async (id: number): Promise<EpisodeType[]> => {
    const { data, error } = await supabase
      .from('episodes')
      .select('*, programs(*, broadcastings(*))')
      .eq('program_id', id);

    if (error) throw error;
    return data;
  };

  const {
    data: episodes,
    refetch,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ['random-episodes', moodPrefix],
    queryFn: fetchRandomEpisodes,
    refetchOnWindowFocus: false,
  });

  const programIds = episodes?.map((ep) => ep.program_id) || [];
  const uniqueProgramIds = [...new Set(programIds)];

  const { data: playlistsMap } = useQuery({
    queryKey: ['playlists', uniqueProgramIds],
    queryFn: async () => {
      const playlists = await Promise.all(uniqueProgramIds.map((id) => fetchPlaylist(id)));
      return uniqueProgramIds.reduce<Record<number, EpisodeType[]>>((acc, id, idx) => {
        acc[id] = playlists[idx];
        return acc;
      }, {});
    },
    enabled: uniqueProgramIds.length > 0,
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
      {isAIVoiceSearchVersion && (
        <div
          className="flex items-center gap-6 cursor-pointer"
          onClick={() => navigate('/ai-pick/voice-search', { state: { title: 'P!ckle AI' } })}
        >
          <div>
            <ImageWithSkeleton
              src={PickleAIIcon}
              alt="Pickle AI"
              className="w-14 h-14"
              skeletonClassName="rounded-full"
              baseColor="#2A2A2E"
              highlightColor="#3A3A3E"
            />
          </div>
          <div className="text-[#666666] bg-[#202026] px-10 py-4 rounded-full w-full cursor-pointer">
            {t('placeholder.voice-search')}
          </div>
        </div>
      )}

      {bannerContent}

      <div className="flex flex-col gap-6">
        <p className="text-base font-medium">
          {moodPrefix} {t(sectionTitleKey)}
        </p>

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
              playlist={playlistsMap?.[ep.program_id] || []}
              isPlayer={false}
              totalTime={ep.duration}
              listenedDuration={playedDurations[ep.id] ?? ep.listened_duration}
              originType="program"
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
              {isFetching ? t('button.loading-recomend') : t('button.re-recomend')}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AIPick;
export { EPISODE_COUNT };
