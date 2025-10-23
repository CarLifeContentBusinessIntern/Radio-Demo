import { useEffect, useState } from 'react';
import type { LiveRadioType } from '../types/radio';
import GridViewItem from './GridViewItem';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'react-toastify';

function LiveRadio() {
  const navigate = useNavigate();
  const [liveData, setLiveData] = useState<LiveRadioType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLiveData() {
      const { data: liveRadioData, error: liveError } = await supabase
        .from('radios')
        .select('*, channels(*)')
        .eq('is_live', true)
        .order('live_no', { ascending: true });

      if (liveError) {
        console.log('❌ Error fetching live data:', liveError.message);
        setIsLoading(false);
        return;
      }
      setLiveData(liveRadioData);
      setIsLoading(false);
    }
    fetchLiveData();
  }, []);

  const handleLiveClick = (id: number) => {
    if (!id) {
      toast.error(`콘텐츠 준비 중입니다`, { toastId: id });
      return;
    }
    navigate(`/player/${id}`, { state: { isLive: true } });
  };

  return (
    <>
      <div className="text-2xl mb-7 font-semibold">ON-AIR 🔴</div>
      <div className="grid gap-x-4 gap-y-7 mb-16 px-1 grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <GridViewItem isLoading={true} key={index} />
            ))
          : liveData.map((item, index) => (
              <GridViewItem
                key={`${item.live_episode_id}-${index}`}
                title={item.title}
                subTitle={`${item.channels.broadcasting} ${item.channels.channel}`}
                img={item.img_url}
                onClick={() => handleLiveClick(item.live_episode_id)}
              />
            ))}
        {/* <GridViewItem title="더보기" subTitle="더보기" /> */}
      </div>
    </>
  );
}

export default LiveRadio;
