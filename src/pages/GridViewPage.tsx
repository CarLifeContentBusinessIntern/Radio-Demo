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
  console.log(id);
  const [radios, setRadios] = useState<RadioType[]>([]);

  //채널별 라디오 조회
  async function fetchChannelRadios() {
    const { data, error } = await supabase
      .from('radios')
      .select('*')
      .order('id', { ascending: true })
      .eq('channel_id', id);

    if (error) {
      console.error('Supabase 연결 실패:', error);
    } else {
      setRadios(data);
    }
  }

  //카테고리별 라디오 조회
  async function fetchCategoryRadios() {
    const { data, error } = await supabase
      .from('radios')
      .select('*')
      .order('id', { ascending: true })
      .eq('category_id', id);

    if (error) {
      console.error('Supabase 연결 실패:', error);
    } else {
      setRadios(data);
    }
  }

  useEffect(() => {
    if (type === 'channel') fetchChannelRadios();
    else if (type === 'category') fetchCategoryRadios();
  }, []);

  return (
    <div className="pr-28 pt-3">
      <div className="grid gap-4 mb-4 px-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {radios.map((item) => (
          <GridViewItem
            key={item.id}
            title={item.title}
            subTitle={item.time_slot}
            img={item.img_url}
            onClick={() => navigate(`/channels/detail/${item.id}`)}
          />
        ))}
      </div>
    </div>
  );
}

export default GridViewPage;
