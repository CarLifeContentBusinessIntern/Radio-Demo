import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';
import type { SectionItemType } from '../types/section';

export function useSection(sectionId: number, selectedOEM?: string) {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language.startsWith('en') ? 'en' : 'ko';
  console.log(i18n.language);

  const {
    data = [],
    isLoading,
    error,
  } = useQuery<SectionItemType[]>({
    queryKey: ['section', sectionId, selectedOEM, currentLanguage],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_section_items', {
        section_id: sectionId,
        language: currentLanguage,
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
