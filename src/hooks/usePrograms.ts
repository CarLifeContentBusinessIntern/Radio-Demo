import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import type { ProgramType } from '../types/program';

export function usePrograms(id: string | undefined, type: string | undefined) {
  return useQuery<ProgramType[]>({
    queryKey: ['programs', id, type],
    queryFn: async () => {
      if (!id || !type) {
        return [];
      }

      const filterColumn = type === 'channel' ? 'broadcasting_id' : 'category_id';
      const filterProgramsOrder = type === 'channel' ? 'order_broadcasting' : 'order_category';

      const { data, error } = await supabase
        .from('programs')
        .select('*, broadcastings(*), episodes(*)')
        .order(filterProgramsOrder, { ascending: true })
        .eq(filterColumn, id);

      if (error) {
        console.error('Supabase 연결 실패:', error);
        throw error;
      }

      return data as ProgramType[];
    },
  });
}
