import { useQuery } from '@tanstack/react-query';
import { FiRefreshCcw } from 'react-icons/fi';
import BannerBackground from '../assets/ai_pick_banner_background.png';
import BannerIcon from '../assets/ai_pick_banner_icon.png';
import PickleAIIcon from '../assets/ic_pickle_ai.png';
import ListViewItem from '../components/ListViewItem';
import { usePlayer } from '../contexts/PlayerContext';
import { supabase } from '../lib/supabaseClient';
import type { EpisodeType } from '../types/episode';

const EPISODE_COUNT = 5;

function AIPick() {
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

  return (
    <div className="pt-7 pr-20 flex flex-col gap-8">
      <div className="flex items-center gap-6">
        <img src={PickleAIIcon} className="w-14 h-14" />
        <div className="text-[#666666] bg-[#202026] px-10 py-4 rounded-full w-full cursor-pointer">
          픽클! 지금 시간대에 들을만한 팟캐스트 있을까?
        </div>
      </div>

      <div className="relative w-full cursor-pointer">
        <img
          src={BannerBackground}
          className="cursor-pointer w-full h-40 rounded-3xl object-cover"
        />

        <div className="absolute w-full top-6">
          <div className="flex justify-center items-center">
            <div className="flex items-center justify-between w-full max-w-[700px] px-10">
              <img src={BannerIcon} className="w-30 h-28" />

              <div className="text-white">
                <p className="font-normal text-2xl">픽클 AI가 조이님 취향을 잘 파악하도록</p>
                <p className="font-bold text-2xl">나의 팟캐스트 취향 설정하기</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <p className="text-base font-medium">최근 청취한 채널 유사한 채널 추천</p>

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[...Array(EPISODE_COUNT)].map((_, i) => (
              <div key={i} className="h-20 bg-[#2A2A2E] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
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
        )}

        <div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="bg-[#202026] w-full rounded-full flex justify-center items-center gap-6 py-5"
          >
            <div className={isFetching ? 'animate-spin' : ''}>
              <FiRefreshCcw size={20} color="#A1A1A1" />
            </div>
            <p className="text-xl text-[#A1A1A1] font-semibold">
              {isFetching ? '추천 불러오는 중...' : '다시 추천받기'}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AIPick;
