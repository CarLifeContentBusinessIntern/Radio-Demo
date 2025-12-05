import { supabase } from '../lib/supabaseClient';
import type { EpisodeType } from '../types/episode';

interface FetchRandomEpisodesParams {
  count?: number;
  reset?: boolean;
  language?: string;
}

export const fetchRandomEpisodes = async ({
  count = 5,
  reset = false,
  language,
}: FetchRandomEpisodesParams): Promise<EpisodeType[]> => {
  const { data, error } = await supabase.rpc('get_random_episodes', {
    count,
    reset,
    language,
  });

  if (error) throw error;
  return data;
};
