import { EPISODE_COUNT } from '../components/AIPick';
import { supabase } from '../lib/supabaseClient';
import type { EpisodeType } from '../types/episode';

export const fetchRandomEpisodes = async (): Promise<EpisodeType[]> => {
  const { data, error } = await supabase.rpc('get_random_episodes', { count: EPISODE_COUNT });

  if (error) throw error;
  return data;
};
