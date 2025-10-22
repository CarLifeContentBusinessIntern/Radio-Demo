import { useNavigate } from 'react-router-dom';
import type { ChannelType } from '../types/channel';
import { useEffect, useState } from 'react';
import CircleViewItem from './CircleViewItem';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'react-toastify';

function ChannelList() {
  const navigate = useNavigate();
  const [channels, setChannels] = useState<ChannelType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  //채널 조회
  async function fetchChannels() {
    const { data, error } = await supabase
      .from('channels')
      .select('*,radios(count)')
      .not('"order"', 'is', null) // order가 null인 애들 제외
      .order('order', { ascending: true });

    if (error) {
      console.error('Supabase 연결 실패:', error);
    } else {
      setChannels(data);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchChannels();
  }, []);

  const handleOnClick = (item: ChannelType) => {
    if (item.radios[0].count !== 0) {
      navigate(`/curation/${item.id}`, {
        state: { title: `${item.broadcasting} ${item.channel || ''}`, type: 'channel' },
      });
    } else {
      toast.error(`콘텐츠 준비 중입니다`, { toastId: item.id });
    }
  };

  return (
    <>
      <div className="text-2xl mb-7 font-semibold">방송사별 라디오</div>
      <div className="grid gap-x-4 gap-y-7 mb-16 px-1 grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <CircleViewItem isLoading={true} key={index} />
            ))
          : channels.map((item) => (
              <CircleViewItem
                key={item.id}
                title={`${item.broadcasting} ${item.channel ? item.channel : ''}`}
                subTitle={item.frequency}
                img={item.img_url}
                onClick={() => handleOnClick(item)}
              />
            ))}
      </div>
    </>
  );
}

export default ChannelList;
