import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import type { EpisodeType } from '../types/episode';

export function useTenRecentEpisodes() {
  return useQuery<EpisodeType[]>({
    queryKey: ['tenRecentEpisodes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('episodes')
        .select('*, programs(*, broadcastings(*))')
        .not('listened_at', 'is', null)
        .filter('listened_duration', 'gt', '0')
        .order('listened_at', { ascending: false })
        .limit(10);
      if (error) throw error;
      return data as EpisodeType[];
    },
    refetchOnWindowFocus: true,
    refetchInterval: 30000,
  });
}
