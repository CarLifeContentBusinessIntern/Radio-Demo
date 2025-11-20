import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import ListViewItem from '../components/ListViewItem';
import { useVersion } from '../contexts/VersionContext';
import { supabase } from '../lib/supabaseClient';
import type { EpisodeType, SeriesEpisodesType } from '../types/episode';

function RecentPage() {
  // const [recentEpisodes, setRecentEpisodes] = useState<EpisodeType[]>([]);
  // const [isLoading, setIsLoading] = useState(true);

  const { isRadioVersion } = useVersion();

  const { data: allEpisodes = [], isLoading } = useQuery<EpisodeType[]>({
    queryKey: ['allEpisodes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('series_episodes')
        .select('*, episodes(*, programs(*, broadcastings(*)))')
        .eq('series_id', 21)
        .order('order', { ascending: true });

      if (error) {
        console.log('❌ 최근 청취 조회 실패 :', error);
        throw error;
      }

      const episodes: EpisodeType[] = data
        .map((item: SeriesEpisodesType) => item.episodes)
        .filter((episode): episode is EpisodeType => episode != null && episode !== undefined);

      return episodes;
    },
  });

  const recentEpisodes = useMemo(() => {
    return isRadioVersion
      ? allEpisodes
      : allEpisodes.filter((episode) => episode.type === 'podcast');
  }, [allEpisodes, isRadioVersion]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-y-1">
        {Array.from({ length: 8 }).map((_, index) => (
          <ListViewItem isLoading={true} key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-1 pr-11 pt-7">
      {recentEpisodes?.map((item) => {
        const subTitleText = item.programs?.title;
        const imgUrl = item.img_url ?? item.programs?.img_url;

        return (
          <ListViewItem
            key={item.id}
            id={item.id}
            imgUrl={imgUrl}
            title={item.title}
            subTitle={subTitleText}
            totalTime={item.duration}
            date={item.date}
            hasAudio={!!item.audio_file}
            playlist={recentEpisodes}
            isRound={true}
          />
        );
      })}
    </div>
  );
}

export default RecentPage;
