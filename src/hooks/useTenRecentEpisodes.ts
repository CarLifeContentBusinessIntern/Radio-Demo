import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import type { EpisodeType } from '../types/episode';

export function useTenRecentEpisodes() {
  return useQuery<EpisodeType[]>({
    queryKey: ['tenRecentEpisodes'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_ten_recent_episodes');
      if (error) throw error;
      return data;
    },
    refetchOnWindowFocus: true,
    refetchInterval: 30000,
  });
}
