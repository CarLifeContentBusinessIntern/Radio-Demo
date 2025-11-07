import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import GridViewItem from '../components/GridViewItem';
import { supabase } from '../lib/supabaseClient';
import type { ProgramType } from '../types/program';

function GridViewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { type } = location.state || {};
  const { id } = useParams();
  const [programs, setPrograms] = useState<ProgramType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 라디오 조회
  useEffect(() => {
    const fetchRadios = async () => {
      if (!id || !type) return;

      const filterColumn = type === 'channel' ? 'broadcasting_id' : 'category_id';
      const filterProgramsOrder = type === 'channel' ? 'order_broadcasting' : 'order_category';

      const { data, error } = await supabase
        .from('programs')
        .select('*, broadcastings(*), episodes(*)')
        .order(filterProgramsOrder, { ascending: true })
        .eq(filterColumn, id);

      if (error) {
        console.error('Supabase 연결 실패:', error);
      } else {
        setPrograms(data);
      }
      setIsLoading(false);
    };

    fetchRadios();
  }, [id, type]);

  return (
    <div className="pr-28 pt-3">
      <div className="grid gap-x-4 gap-y-7 mb-16 px-1 grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <GridViewItem isLoading={true} key={index} />
            ))
          : programs.map((item) => (
              <GridViewItem
                key={item.id}
                isLoading={false}
                title={item.title}
                subTitle={item.subtitle}
                img={item.img_url}
                isRounded={type !== 'podcast_category'}
                onClick={() => {
                  const firstEpisodeId = item.episodes?.[0]?.id;
                  if (firstEpisodeId !== undefined && item.episodes?.[0]?.audio_file !== null) {
                    navigate(`/player/${firstEpisodeId}`, { state: { playlist: item } });
                  } else {
                    toast.error(`콘텐츠 준비 중입니다`, { toastId: item.id });
                  }
                }}
              />
            ))}
      </div>
    </div>
  );
}

export default GridViewPage;
