import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import type { SectionItemType } from '../types/section';

export function useSection(sectionId: number, selectedOEM?: string) {
  const {
    data = [],
    isLoading,
    error,
  } = useQuery<SectionItemType[]>({
    queryKey: ['section', sectionId, selectedOEM],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_section_items', {
        section_id: sectionId,
      });

      if (error) {
        throw error;
      }

      if (selectedOEM) {
        return data.filter(
          (item: SectionItemType) =>
            item.order !== 2 || (item.order === 2 && item.oem_key === selectedOEM)
        );
      }

      return data.filter((item: SectionItemType) => item.order !== 2 || !item.oem_key);
    },
  });

  return { data, isLoading, error };
}
