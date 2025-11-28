import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import type { RecentSeriesProgramType } from '../types/recent';

export default function useFetchRecentSeriesProgram() {
  return useQuery<RecentSeriesProgramType[]>({
    queryKey: ['recentSeriesProgram'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_recent_series_program');
      if (error) throw error;
      return data;
    },
    refetchOnWindowFocus: true,
    refetchInterval: 30000,
  });
}
