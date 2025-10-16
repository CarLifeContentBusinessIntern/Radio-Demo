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

  // 라디오 조회
  const fetchRadios = async () => {
    if (!id || !type) return;

    const filterColumn = type === 'channel' ? 'channel_id' : 'category_id';
    const filterRadiosOrder = type === 'channel' ? 'order_broadcasting' : 'order_category';

    const { data, error } = await supabase
      .from('radios')
      .select('*')
      .order(filterRadiosOrder, { ascending: true })
      .eq(filterColumn, id);

    if (error) {
      console.error('Supabase 연결 실패:', error);
    } else {
      setRadios(data);
    }
  };

  useEffect(() => {
    fetchRadios();
  }, [id, type]);

  return (
    <div className="pr-28 pt-3">
      <div className="grid gap-4 mb-4 px-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {radios.map((item) => (
          <GridViewItem
            key={item.id}
            title={item.title}
            subTitle={item.time_slot}
            img={item.img_url}
            onClick={() =>
              navigate(`/episodes/channel/${item.id}`, { state: { title: item.title } })
            }
          />
        ))}
      </div>
    </div>
  );
}

export default GridViewPage;
