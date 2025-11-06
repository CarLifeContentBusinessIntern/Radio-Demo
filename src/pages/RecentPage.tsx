import { useEffect, useState } from 'react';
import ListViewItem from '../components/ListViewItem';
import { supabase } from '../lib/supabaseClient';
import type { EpisodeType } from '../types/episode';

function RecentPage() {
  const [recentEpisodes, setRecentEpisodes] = useState<EpisodeType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentData() {
      const { data, error } = await supabase
        .from('episodes')
        .select('*, programs(*)')
        .not('order_recent', 'is', null)
        .order('order_recent', { ascending: true });

      if (error) {
        console.log('❌ 최근 청취 조회 실패 :', error);
      }

      setRecentEpisodes(data ?? []);
      setIsLoading(false);
    }

    fetchRecentData();
  }, []);

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
    <div className="flex flex-col gap-y-1">
      {recentEpisodes?.map((item) => {
        const subTitleText = item.programs?.title ?? '';
        const imgUrl = item.img_url ?? item.programs?.broadcastings?.img_url;

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
            playlistType={'PickleEpisodeType'}
            isRound={false}
          />
        );
      })}
    </div>
  );
}

export default RecentPage;
