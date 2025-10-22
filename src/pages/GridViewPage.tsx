import { useLocation, useNavigate, useParams } from 'react-router-dom';
import GridViewItem from '../components/GridViewItem';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { RadioType } from '../types/radio';

function GridViewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { type } = location.state || {};
  const { id } = useParams();
  const [radios, setRadios] = useState<RadioType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 라디오 조회
  useEffect(() => {
    const fetchRadios = async () => {
      if (!id || !type) return;

      const filterColumn = type === 'channel' ? 'channel_id' : 'category_id';
      const filterRadiosOrder = type === 'channel' ? 'order_broadcasting' : 'order_category';

      const { data, error } = await supabase
        .from('radios')
        .select('*, channels(*), episodes(*)')
        .order(filterRadiosOrder, { ascending: true })
        .order('title', { referencedTable: 'episodes', ascending: false })
        .eq(filterColumn, id);

      if (error) {
        console.error('Supabase 연결 실패:', error);
      } else {
        setRadios(data);
      }
      setIsLoading(false);
    };

    fetchRadios();
  }, [id, type]);

  return (
    <div className="pr-28 pt-3">
      <div className="grid gap-x-4 gap-y-7 mb-16 px-1 grid-cols-4">
        {' '}
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <GridViewItem isLoading={true} key={index} />
            ))
          : radios.map((item) => (
              <GridViewItem
                key={item.id}
                isLoading={false}
                title={item.title}
                subTitle={
                  type === 'channel' || !item.channels
                    ? item.time_slot
                    : `${item.channels.broadcasting} ${item.channels.channel}`
                }
                img={item.img_url}
                onClick={() =>
                  navigate(`/player/${item.episodes[0].id}`, { state: { playlist: item } })
                }
              />
            ))}
      </div>
    </div>
  );
}

export default GridViewPage;
