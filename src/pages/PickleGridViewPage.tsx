import { useNavigate, useParams } from 'react-router-dom';
import GridViewItem from '../components/GridViewItem';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'react-toastify';
import type { PicklePodcastsType } from '../types/picklePodcast';
function PickleGridViewPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [podcasts, setPodcasts] = useState<PicklePodcastsType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 라디오 조회
  useEffect(() => {
    const fetchPodcasts = async () => {
      const { data, error } = await supabase
        .from('pickle_podcasts')
        .select('*, pickle_episodes(*)')
        // .order(filterSeriesOrder, { ascending: true })
        // .order('title', { referencedTable: 'episodes', ascending: false })
        .eq('id', id);

      if (error) {
        console.error('Supabase 연결 실패:', error);
      } else {
        setPodcasts(data);
      }
      setIsLoading(false);
    };

    fetchPodcasts();
  }, [id]);

  return (
    <div className="pr-28 pt-3">
      <div className="grid gap-x-4 gap-y-7 mb-16 px-1 grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <GridViewItem isLoading={true} key={index} />
            ))
          : podcasts.map((item) => (
              <GridViewItem
                key={item.id}
                isLoading={false}
                title={item.title}
                subTitle={item.subtitle}
                isRounded={false}
                img={item.img_url}
                onClick={() => {
                  const firstEpisodeId = item.episodes?.[0]?.id;
                  if (firstEpisodeId !== undefined) {
                    navigate(`/episodes/channel/${item.id}`);
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

export default PickleGridViewPage;
