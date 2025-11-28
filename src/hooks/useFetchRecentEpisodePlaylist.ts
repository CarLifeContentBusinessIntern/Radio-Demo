import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import type { EpisodeType } from '../types/episode';

export function useFetchRecentEpisodePlaylist(
  originType?: 'program' | 'series' | null,
  programId?: number,
  seriesId?: number
) {
  return useQuery<EpisodeType[]>({
    queryKey: ['recent_episode_playlist', originType, programId, seriesId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_recent_episode_playlist', {
        ep_origin_type: originType,
        ep_program_id: programId ?? null,
        ep_series_id: seriesId ?? null,
      });
      if (error) throw error;
      return data as EpisodeType[];
    },
  });
}
