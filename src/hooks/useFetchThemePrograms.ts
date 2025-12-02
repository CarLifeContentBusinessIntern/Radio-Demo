import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import type { ThemeProgramType } from '../types/theme';

export function useFetchThemePrograms(id: string | undefined) {
  return useQuery<ThemeProgramType[]>({
    queryKey: ['themePrograms', id],
    queryFn: async () => {
      if (!id) {
        return [];
      }

      const { data, error } = await supabase
        .from('themes_programs')
        .select('*, programs(*, broadcastings(*))')
        .eq('theme_id', id);

      if (error) {
        console.error('Supabase 연결 실패:', error);
        throw error;
      }

      return data as ThemeProgramType[];
    },
  });
}
