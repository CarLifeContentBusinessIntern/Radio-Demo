import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { PickleEpisode } from '../types/episode';
import ListViewItem from '../components/ListViewItem';

function RecentPage() {
  const [recentEpisodes, setRecentEpisodes] = useState<PickleEpisode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentData() {
      const { data, error } = await supabase
        .from('pickle_episodes')
        .select('*, pickle_podcasts(*)')
        .not('recent_order', 'is', null)
        .order('recent_order', { ascending: true });

      console.log('dd', data);

      if (error) {
        console.log('❌ Error fetching episodes data:', error.message);
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
        const subTitleText = item.pickle_podcasts?.title ?? '';
        const imgUrl = item.src ?? item.pickle_podcasts.img_url;

        return (
          <ListViewItem
            key={item.id}
            id={item.id}
            imgUrl={imgUrl}
            title={item.title}
            subTitle={subTitleText}
            // playTime={item.play_time}
            totalTime={item.total_time}
            date={item.uploadAt}
            hasAudio={!!item.audio_file}
            playlist={recentEpisodes}
            playlistType={'PickleEpisodeType'}
            isPickle={true}
            isRound={false}
          />
        );
      })}
    </div>
  );
}

export default RecentPage;
