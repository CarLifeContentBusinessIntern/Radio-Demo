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

    let isCancelled = false;

    async function fetchChannelData() {
      setIsLoading(true);
      setError(null);

      try {
        const { data: fetchedData, error: queryError } = await supabase
          .from('episodes')
          .select('*, programs(*, broadcastings(*))')
          .eq('program_id', program_id);

        if (isCancelled) return;

        if (queryError) {
          throw new Error(queryError.message);
        }

        setData(fetchedData || []);
      } catch (err) {
        if (isCancelled) return;

        setError(err instanceof Error ? err : new Error('알 수 없는 오류 발생'));
        setData([]);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchChannelData();

    return () => {
      isCancelled = true;
    };
  }, [program_id]);

  return { data, isLoading, error };
}
