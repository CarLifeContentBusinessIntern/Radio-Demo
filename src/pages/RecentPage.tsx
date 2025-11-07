import { useEffect, useState } from 'react';
import ListViewItem from '../components/ListViewItem';
import { supabase } from '../lib/supabaseClient';
import type { EpisodeType, SeriesEpisodesType } from '../types/episode';
import { useVersion } from '../contexts/VersionContext';

function RecentPage() {
  const [recentEpisodes, setRecentEpisodes] = useState<EpisodeType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { isRadioVersion } = useVersion();

  useEffect(() => {
    async function fetchRecentData() {
      const { data, error } = await supabase
        .from('series_episodes')
        .select('*, episodes(*, programs(*, broadcastings(*)))')
        .eq('series_id', 21)
        .order('order', { ascending: true });

      if (error) {
        console.log('❌ 최근 청취 조회 실패 :', error);
        setIsLoading(false);
        return;
      }

      const allEpisodes: EpisodeType[] = data
        .map((item: SeriesEpisodesType) => item.episodes)
        .filter((episode): episode is EpisodeType => episode !== null && episode !== undefined);

      const finalEpisodes = isRadioVersion
        ? allEpisodes
        : allEpisodes.filter((episode) => episode.type === 'podcast');

      setRecentEpisodes(finalEpisodes);

      setIsLoading(false);
    }

    fetchRecentData();
  }, [isRadioVersion]);

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
            isRound={item.type === 'radio'}
          />
        );
      })}
    </div>
  );
}

export default RecentPage;
