import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CircleViewItem from '../components/CircleViewItem';
import GridViewItem from '../components/GridViewItem';
import { supabase } from '../lib/supabaseClient';
import type { Category } from '../types/category';
import type { Channel } from '../types/channel';
import type { LiveRadio } from '../types/radio';
import TimeSlot from '../components/TimeSlot';

function RadioLiveVersion() {
  const navigate = useNavigate();

  const [liveData, setLiveData] = useState<LiveRadio[]>([]);
  const [broadcastingData, setBroadcastingData] = useState<Channel[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [liveRes, broadcastingRes, categoriesRes] = await Promise.all([
          supabase
            .from('radios')
            .select('*, channels(*)')
            .eq('is_live', true)
            .order('live_no', { ascending: true }),
          supabase.from('channels').select('*').order('id', { ascending: true }),
          supabase.from('categories').select('*').order('order', { ascending: true }),
        ]);

        if (liveRes.error) console.log('❌ Error fetching live data:', liveRes.error.message);
        else setLiveData(liveRes.data || []);

        if (broadcastingRes.error)
          console.log('❌ Error fetching broadcasting data:', broadcastingRes.error.message);
        else setBroadcastingData(broadcastingRes.data || []);

        if (categoriesRes.error)
          console.log('❌ Error fetching category data:', categoriesRes.error.message);
        else setCategories(categoriesRes.data || []);
      } catch (error) {
        if (error instanceof Error) {
          console.log('❌ Error fetching data:', error.message);
        } else {
          console.log('❌ An unexpected error occurred:', error);
        }
      }
    };

    fetchData();
  }, []);

  const handleLiveClick = (id: number, isLive: boolean) => {
    if (isLive && !id) return;
    navigate(`/player/${id}`);
  };

  return (
    <div className="pr-28 pt-7">
      <div className="text-2xl mb-7 font-semibold">지금은?</div>
      <div className="grid gap-x-4 gap-y-7 mb-16 px-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {liveData &&
          liveData.map((item, index) => (
            <GridViewItem
              key={`${item.live_episode_id}-${index}`}
              title={item.title}
              subTitle={item.channels.broadcasting + item.channels.channel}
              img={item.img_url}
              onClick={() => handleLiveClick(item.live_episode_id, item.is_live)}
            />
          ))}
        {/* <GridViewItem title="더보기" subTitle="더보기" /> */}
      </div>

      <div className="text-2xl mb-7 font-semibold">방송사별 라디오</div>
      <div className="grid gap-x-4 gap-y-7 mb-16 px-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {broadcastingData.map((item, index) => {
          return (
            <CircleViewItem
              key={`${item.id}-${index}`}
              title={item.broadcasting + item.channel}
              subTitle={item.frequency}
              img={item.img_url}
              onClick={() => {
                const liveEpisode = liveData.find((liveItem) => liveItem.channel_id === item.id);

                if (liveEpisode && liveEpisode.live_episode_id) {
                  navigate(`/player/${liveEpisode.live_episode_id}`);
                }
              }}
            />
          );
        })}
      </div>

      <div className="text-2xl mb-7 font-semibold">카테고리</div>
      <div className="grid gap-x-4 gap-y-7 mb-16 px-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((item, index) => (
          <CircleViewItem
            key={`${item.id}-${index}`}
            title={item.title}
            img={item.img_url}
            onClick={() => navigate(`/curation/${item.id}`)}
          />
        ))}
      </div>

      <TimeSlot />
    </div>
  );
}

export default RadioLiveVersion;
