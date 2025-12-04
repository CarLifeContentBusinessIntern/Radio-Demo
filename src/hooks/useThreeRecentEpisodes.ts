import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import type { EpisodeType } from '../types/episode';

export function useThreeRecentEpisodes() {
  return useQuery<EpisodeType[]>({
    queryKey: ['threeRecentEpisodes'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_three_recent_episodes');
      if (error) throw error;
      return data as EpisodeType[];
    },
    refetchOnMount: 'always', // 페이지 들어올 때마다 항상 refetch
    staleTime: 0, // 캐시를 항상 stale로 간주
  });
}
