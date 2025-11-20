import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import type { SectionItemType } from '../types/section';

export function useSection(sectionId: number) {
  const {
    data = [],
    isLoading,
    error,
  } = useQuery<SectionItemType[]>({
    queryKey: ['section', sectionId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_section_items', {
        section_id: sectionId,
      });

      if (error) {
        console.log('❌ 섹션 조회 실패 : ', error);
        throw error;
      }

      return data;
    },
  });

  return { data, isLoading, error };
}
