import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { supabase } from '../lib/supabaseClient';
import type { ProgramType } from '../types/program';
import type { ThemeType } from '../types/theme';
import GridViewItem from './GridViewItem';

interface DocumentaryInterface {
  programs: ProgramType;
  themes: ThemeType;
}

function DocumentaryList() {
  const {
    data: documentaries = [],
    isLoading,
    error,
  } = useQuery<DocumentaryInterface[]>({
    queryKey: ['documentaries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('themes_programs')
        .select('programs(*, broadcastings(*)),themes!inner(*)')
        .eq('theme_id', 7);

      if (error) {
        console.error('Supabase 연결 실패:', error);
        throw error;
      }
      return data as unknown as DocumentaryInterface[];
    },
  });

  if (error) console.error('React Query Error fetching documentaries:', error);

  return (
    <>
      <div className="text-lg mb-7 font-semibold">라디오 다큐멘터리</div>
      <div className="grid gap-x-4 gap-y-7 mb-16 px-1 grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <GridViewItem isLoading={true} key={index} />
            ))
          : documentaries.map((item) => (
              <GridViewItem
                key={item.programs.id}
                title={item.programs.title}
                subTitle={`${item.programs.broadcastings?.title} ${item.programs.broadcastings?.channel ? item.programs.broadcastings?.channel : ''}`}
                img={item.programs.img_url}
                onClick={() => toast.error(`콘텐츠 준비 중입니다`, { toastId: item.programs.id })}
              />
            ))}
      </div>
    </>
  );
}

export default DocumentaryList;
