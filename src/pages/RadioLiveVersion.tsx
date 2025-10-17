import { useEffect, useState } from 'react';
import Broadcasts from '../components/Broadcasts';
import Category from '../components/Category';
import GridViewItem from '../components/GridViewItem';
import TimeSlot from '../components/TimeSlot';
import { usePlayer } from '../contexts/PlayerContext';
import { supabase } from '../lib/supabaseClient';
import type { LiveRadio } from '../types/radio';

function RadioLiveVersion() {
  const { playEpisode } = usePlayer();

  const [liveData, setLiveData] = useState<LiveRadio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [broadcastingData, setBroadcastingData] = useState<ChannelType[]>([]);

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

    // async function fetchBroadcastingData() {
    //   const { data: broadcastingData, error: broadcastingError } = await supabase
    //     .from('channels')
    //     .select('*')
    //     .order('id', { ascending: true });

    //   if (broadcastingError) {
    //     console.log('❌ Error fetching live data:', broadcastingError.message);
    //     return;
    //   }
    //   setBroadcastingData(broadcastingData);
    // }
    // fetchBroadcastingData();
  }, []);

  const handleLiveClick = (id: number) => {
    if (!id) return;
    playEpisode(id, true);
  };

  return (
    <div className="pr-28 pt-7">
      <div className="text-2xl mb-7 font-semibold">ON-AIR 🔴</div>
      <div className="grid gap-x-4 gap-y-7 mb-16 px-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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

      <Broadcasts />

      {/* 방송별 생방송 */}
      {/* <div className="text-2xl mb-7 font-semibold">방송사별 라디오</div>
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
      </div> */}

      <Category />
      <TimeSlot />
    </div>
  );
}

export default RadioLiveVersion;
