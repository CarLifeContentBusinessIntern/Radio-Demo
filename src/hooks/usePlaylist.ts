import { useEffect, useState } from 'react';
import type { EpisodeType } from '../types/episode';
import { supabase } from '../lib/supabaseClient';

export function usePlaylist(id: number, table: string) {
  const [data, setData] = useState<EpisodeType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPlaylistData() {
      setIsLoading(true);

      const column = table === 'series_episodes' ? 'series_id' : 'theme_id';
      const { data, error } = await supabase
        .from(table)
        .select('*, episodes(*, programs(*, broadcastings(*)))')
        .eq(column, id)
        .order('order', { ascending: true });

      if (error) {
        console.log('❌ 플레이리스트 조회 실패 : ', error);
      } else {
        setData(data.episodes);
      }
      setIsLoading(false);
    }

    fetchPlaylistData();
  }, [id, table]);

  return { data, isLoading };
}
