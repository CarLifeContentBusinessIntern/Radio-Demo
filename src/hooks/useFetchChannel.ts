import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { EpisodeType } from '../types/episode';

export function useFetchChannel(program_id: number) {
  const [data, setData] = useState<EpisodeType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!program_id || program_id <= 0) {
      setData([]);
      setIsLoading(false);
      return;
    }

    async function fetchChannelData() {
      setIsLoading(true);
      setError(null);

      try {
        const { data: fetchedData, error: queryError } = await supabase
          .from('episodes')
          .select('*, programs(*, broadcastings(*))')
          .eq('program_id', program_id);

        if (queryError) {
          throw new Error(queryError.message);
        }

        if (fetchedData) {
          setData(fetchedData);
        } else {
          setData([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('알 수 없는 오류 발생'));
        setData([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchChannelData();
  }, [program_id]);

  return { data, isLoading, error };
}
