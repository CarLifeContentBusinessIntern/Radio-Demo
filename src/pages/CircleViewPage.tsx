import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import CircleViewItem from '../components/CircleViewItem';
import type { ChannelType } from '../types/channel';

function CircleViewPage() {
  const navigate = useNavigate();
  const { broadcasting } = useParams();
  const [channels, setChannels] = useState<ChannelType[]>([]);

  // 방송사의 채널 조회
  const fetchChannels = async () => {
    if (!broadcasting) return;

    const { data, error } = await supabase
      .from('channels')
      .select('*')
      .order('order', { ascending: true })
      .eq('is_broadcasting', false)
      .eq('broadcasting', broadcasting);

    if (error) {
      console.error('Supabase 연결 실패:', error);
    } else {
      setChannels(data);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, [broadcasting]);

  return (
    <div className="pr-28 pt-3">
      <div className="grid gap-4 mb-4 px-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {channels.map((item) => (
          <CircleViewItem
            key={item.id}
            title={item.channel}
            subTitle={item.frequency}
            img={item.img_url}
            onClick={() =>
              navigate(`/curation/${item.id}`, {
                state: { title: `${item.broadcasting} ${item.channel || ''}`, type: 'channel' },
              })
            }
          />
        ))}
      </div>
    </div>
  );
}

export default CircleViewPage;
