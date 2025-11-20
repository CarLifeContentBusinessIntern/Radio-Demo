import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import GridViewItem from '../components/GridViewItem';
import { usePlayer } from '../contexts/PlayerContext';
import { supabase } from '../lib/supabaseClient';
import type { ProgramType } from '../types/program';

function GridViewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { type } = location.state || {};
  const { id } = useParams();
  const { isLive } = usePlayer();

  const {
    data: programs = [],
    isLoading,
    error,
    isError,
  } = useQuery<ProgramType[]>({
    queryKey: ['programs', id, type], // ✅ 오타 수정
    queryFn: async () => {
      if (!id || !type) {
        return [];
      }

      const filterColumn = type === 'channel' ? 'broadcasting_id' : 'category_id';
      const filterProgramsOrder = type === 'channel' ? 'order_broadcasting' : 'order_category';

      console.log('🔍 필터 설정:', {
        filterColumn,
        filterProgramsOrder,
        id,
      });

      const { data, error } = await supabase
        .from('programs')
        .select('*, broadcastings(*), episodes(*, programs(*, broadcastings(*)))')
        .order(filterProgramsOrder, { ascending: true })
        .eq(filterColumn, id);

      if (error) {
        console.error('Supabase 연결 실패:', error);
        throw error;
      }

      return data as ProgramType[];
    },
  });

  if (isError) {
    return (
      <div className="pr-28 pt-3 p-4">
        <div className="text-red-500">에러가 발생했습니다: {error?.message}</div>
      </div>
    );
  }

  return (
    <div className="pr-28 pt-3">
      <div className="grid gap-x-4 gap-y-7 mb-16 px-1 grid-cols-4">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, index) => <GridViewItem isLoading={true} key={index} />)
        ) : programs.length === 0 ? (
          <div className="col-span-4 text-center text-gray-400">데이터가 없습니다</div>
        ) : (
          programs.map((item) => (
            <GridViewItem
              key={item.id}
              isLoading={false}
              title={item.title}
              subTitle={item.subtitle}
              img={item.img_url}
              isRounded={type !== 'podcast_category'}
              onClick={() => {
                const firstEpisodeWithAudio = item.episodes?.find((ep) => ep.audio_file !== null);
                if (firstEpisodeWithAudio?.id) {
                  navigate(`/player/${firstEpisodeWithAudio.id}`, {
                    state: { isLive: isLive, playlist: item.episodes },
                  });
                } else {
                  toast.error(`콘텐츠 준비 중입니다`, { toastId: item.id });
                }
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default GridViewPage;
