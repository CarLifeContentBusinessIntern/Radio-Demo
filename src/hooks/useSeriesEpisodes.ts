import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import type { SeriesEpisodesType } from '../types/episode';

export function useSeriesEpisodes(id: string | undefined) {
  return useQuery<SeriesEpisodesType[]>({
    queryKey: ['episodes', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('series_episodes')
        .select('*, episodes(*, programs(*, broadcastings(*)))')
        .eq('series_id', id);

      if (error) throw error;
      return data as SeriesEpisodesType[];
    },
    enabled: !!id,
  });
}
