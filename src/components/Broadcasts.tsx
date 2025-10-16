import { useNavigate } from 'react-router-dom';
import type { ChannelType } from '../types/channel';
import { useEffect, useState } from 'react';
import CircleViewItem from './CircleViewItem';
import { supabase } from '../lib/supabaseClient';

function Broadcasts() {
  const navigate = useNavigate();
  const [channels, setChannels] = useState<ChannelType[]>([]);
  const MAJOR_BROADCASTERS = ['MBC', 'SBS', 'KBS'];

  //채널 조회
  async function fetchChannels() {
    const { data, error } = await supabase
      .from('channels')
      .select('*')
      .order('order', { ascending: true })
      .eq('is_broadcasting', true);

    if (error) {
      console.error('Supabase 연결 실패:', error);
    } else {
      setChannels(data);
    }
  }

  useEffect(() => {
    fetchChannels();
  }, []);

  const handleOnClick = (item: ChannelType) => {
    if (MAJOR_BROADCASTERS.includes(item.broadcasting)) {
      navigate(`/channel/${item.broadcasting}`, {
        state: { title: `${item.broadcasting} ${item.channel || ''}`, type: 'channel' },
      });
    } else {
      navigate(`/curation/${item.id}`, {
        state: { title: `${item.broadcasting} ${item.channel || ''}`, type: 'channel' },
      });
    }
  };

  return (
    <>
      <div className="text-2xl mb-7 font-semibold">방송사별 라디오</div>
      <div className="grid gap-x-4 gap-y-7 mb-16 px-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {channels.map((item) => (
          <CircleViewItem
            key={item.id}
            title={`${item.broadcasting} ${item.channel || ''}`}
            subTitle={item.frequency}
            img={item.img_url}
            onClick={() => handleOnClick(item)}
          />
        ))}
      </div>
    </>
  );
}

export default Broadcasts;
