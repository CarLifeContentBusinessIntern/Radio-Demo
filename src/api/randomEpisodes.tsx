import { supabase } from '../lib/supabaseClient';
import type { EpisodeType } from '../types/episode';

interface FetchRandomEpisodesParams {
  count?: number;
  reset?: boolean;
}

export const fetchRandomEpisodes = async ({
  count = 5,
  reset = false,
}: FetchRandomEpisodesParams): Promise<EpisodeType[]> => {
  const { data, error } = await supabase.rpc('get_random_episodes', { count, reset });

  if (error) throw error;
  return data;
};
