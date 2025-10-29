import { useNavigate, useParams } from 'react-router-dom';
import GridViewItem from '../components/GridViewItem';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'react-toastify';
import type { PodcastType } from '../types/podcast';
function PickleGridViewPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [podcasts, setPodcasts] = useState<PodcastType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 팟캐스트 조회
  useEffect(() => {
    const fetchPodcasts = async () => {
      const { data, error } = await supabase
        .from('pickle_podcasts')
        .select('*, pickle_episodes(*)')
        .eq('category_id', id);

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
                  if (item.pickle_episodes?.length > 0) {
                    navigate(`/episodes/podcasts/${item.id}`, {
                      state: { title: item.title, isPickle: true, isRound: false },
                    });
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
