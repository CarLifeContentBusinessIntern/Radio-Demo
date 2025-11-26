import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { supabase } from '../lib/supabaseClient';
import type { ChannelType } from '../types/channel';
import CircleViewItem from './CircleViewItem';

function ChannelList() {
  const navigate = useNavigate();

  const { data: channels = [], isLoading } = useQuery<ChannelType[]>({
    queryKey: ['channels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('broadcastings')
        .select('*,programs(count)')
        .not('"order"', 'is', null)
        .order('order', { ascending: true });

      if (error) {
        console.error('Supabase 연결 실패:', error);
        throw error;
      }
      return data as ChannelType[];
    },
  });

  const handleOnClick = (item: ChannelType) => {
    if (item.programs[0].count !== 0) {
      navigate(`/curation/${item.id}`, {
        state: { title: `${item.title} ${item.channel || ''}`, type: 'channel' },
      });
    } else {
      toast.error(`콘텐츠 준비 중입니다`, { toastId: item.id });
    }
  };

  return (
    <>
      <div className="text-lg mb-7 font-semibold">방송사별 라디오</div>
      <div className="grid gap-x-4 gap-y-7 mb-16 px-1 grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <CircleViewItem isLoading={true} key={index} />
            ))
          : channels.map((item) => (
              <CircleViewItem
                key={item.id}
                title={`${item.title} ${item.channel ? item.channel : ''}`}
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
