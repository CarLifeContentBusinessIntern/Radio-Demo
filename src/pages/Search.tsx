import { useQuery } from '@tanstack/react-query';
import Skeleton from 'react-loading-skeleton';
import ListViewItem from '../components/ListViewItem';
import { usePlayer } from '../contexts/PlayerContext';
import { supabase } from '../lib/supabaseClient';
import type { EpisodeType } from '../types/episode';
import { useTranslation } from 'react-i18next';

function Search() {
  const { playedDurations } = usePlayer();
  const { t } = useTranslation();

  const MAX_SEARCH_RESULTS = 4;

  const fetchRandomData = async (): Promise<EpisodeType[]> => {
    const { data, error } = await supabase.rpc('get_random_episodes', {
      count: 8,
      reset: false,
    });

    if (error) throw error;
    return data;
  };

  const { data: allData, isLoading } = useQuery<EpisodeType[]>({
    queryKey: ['random-data-search'],
    queryFn: fetchRandomData,
    refetchOnWindowFocus: false,
  });

  const renderLoadingSkeleton = (count: number, isRound: boolean) => (
    <div className="flex flex-col gap-y-1">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-2 h-16">
          <Skeleton
            circle={isRound}
            width={48}
            height={48}
            baseColor="#2A2A2E"
            highlightColor="#3A3A40"
            className="rounded-lg"
          />
          <div className="flex flex-col flex-grow gap-2">
            <div className="h-4 w-full bg-[#2A2A2E] animate-pulse" />
            <div className="h-3 w-1/2 bg-[#2A2A2E] animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-8 mr-20 mt-5">
      <div className="flex flex-col gap-3">
        <p className="text-lg">{t('sections.channel')}</p>

        {isLoading ? (
          renderLoadingSkeleton(MAX_SEARCH_RESULTS, true)
        ) : (
          <div className="flex flex-col gap-y-1">
            {allData?.slice(0, MAX_SEARCH_RESULTS).map((ep) => (
              <ListViewItem
                key={ep.id}
                id={ep.programs?.id}
                imgUrl={ep.programs?.img_url || ep.img_url}
                title={ep.programs?.title}
                subTitle={ep.programs?.subtitle || '채널'}
                isRound={true}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-5">
        <p className="text-lg">{t('sections.episode')}</p>

        {isLoading ? (
          renderLoadingSkeleton(MAX_SEARCH_RESULTS, true)
        ) : (
          <div className="flex flex-col gap-y-1">
            {allData?.slice(MAX_SEARCH_RESULTS, allData.length).map((ep) => (
              <ListViewItem
                key={ep.id}
                id={ep.id}
                imgUrl={ep.img_url || ep.programs?.img_url}
                title={ep.title}
                subTitle={ep.programs?.title}
                date={ep.date}
                hasAudio={ep.audio_file ? true : false}
                playlist={[ep]}
                totalTime={ep.duration}
                listenedDuration={playedDurations[ep.id] ?? ep.listened_duration}
                isRound={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
