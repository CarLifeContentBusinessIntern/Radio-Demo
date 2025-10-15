import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CircleViewItem from '../components/CircleViewItem';
import GridViewItem from '../components/GridViewItem';
import { supabase } from '../lib/supabaseClient';
import type { CategoryType } from '../types/category';
import type { ChannelType } from '../types/channel';
import type { LiveRadio } from '../types/radio';
import TimeSlot from '../components/TimeSlot';
import Category from '../components/Category';

function RadioLiveVersion() {
  const navigate = useNavigate();

  const [liveData, setLiveData] = useState<LiveRadio[]>([]);
  const [broadcastingData, setBroadcastingData] = useState<ChannelType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const promises = [
          supabase.from('radios').select('*, channels(*)').eq('is_live', true).order('live_no'),
          supabase.from('channels').select('*').order('id'),
          supabase.from('categories').select('*').order('order'),
        ];

        const [
          { data: liveRadioData, error: liveError },
          { data: broadcastingData, error: broadcastingError },
          { data: categoryData, error: categoryError },
        ] = await Promise.all(promises);

        if (liveError) throw liveError;
        if (broadcastingError) throw broadcastingError;
        if (categoryError) throw categoryError;

        setLiveData(liveRadioData);
        setBroadcastingData(broadcastingData);
        setCategories(categoryData);
      } catch (error) {
        if (error instanceof Error) {
          console.log('❌ Error fetching data:', error.message);
        } else {
          console.log('❌ An unexpected error occurred:', error);
        }
      }
    };

    fetchAllData();
  }, []);

  const handleLiveClick = (id: number, isLive: boolean) => {
    if (isLive && !id) return;
    navigate(`/player/${id}`, { state: { isLive: true } });
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
              subTitle={`${item.channels.broadcasting} ${item.channels.channel}`}
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

      <Category categories={categories} />
      <TimeSlot />
    </div>
  );
}

export default RadioLiveVersion;
