import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { PickleSeries } from '../types/pickle';

export function usePickleSeries(themeId: number, themeName: string) {
  const [data, setData] = useState<PickleSeries[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPickleSeriesData() {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('pickle_series')
        .select('*, pickle_themes(*), pickle_episodes!series_id(*)')
        .eq('theme_id', themeId)
        .order('order', { ascending: true });

      if (error) {
        console.log(`❌ ${themeName} 데이터 조회 실패 : `, error);
        setData([]);
      } else {
        setData(data);
      }
      setIsLoading(false);
    }

    fetchPickleSeriesData();
  }, [themeId, themeName]);

  return { data, isLoading };
}
