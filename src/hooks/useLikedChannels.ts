import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import type { ProgramType } from '../types/program';

export function useLikedChannels() {
  return useQuery<ProgramType[]>({
    queryKey: ['likedChannels'],
    queryFn: async () => {
      const { data, error } = await supabase.from('programs').select('*').eq('is_liked', true);

      if (error) {
        console.error('좋아요 채널 조회 실패:', error);
        throw error;
      }

      return data as ProgramType[];
    },
  });
}
