import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { SectionItemType } from '../types/section';

export function useSection(sectionId: number) {
  const [data, setData] = useState<SectionItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSectionData() {
      setIsLoading(true);

      const { data, error } = await supabase.rpc('get_section_items', {
        section_id: sectionId,
      });

      if (error) {
        console.log('❌ 섹션 조회 실패 : ', error);
        return;
      }

      setData(data);
      setIsLoading(false);
    }

    fetchSectionData();
  }, [sectionId]);

  return { data, isLoading };
}
