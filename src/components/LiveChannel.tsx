import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import type { ChannelType } from '../types/channel';
import CircleViewItem from './CircleViewItem';
import { usePlayer } from '../contexts/PlayerContext';
import type { RadioType } from '../types/radio';

function LiveChannel() {
  const navigate = useNavigate();
  const [broadcastingData, setBroadcastingData] = useState<ChannelType[]>([]);
  const [liveData, setLiveData] = useState<RadioType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { activePlaylist } = usePlayer();

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

    async function fetchBroadcastingData() {
      const { data: broadcastingData, error: broadcastingError } = await supabase
        .from('channels')
        .select('*')
        .order('id', { ascending: true });

      if (broadcastingError) {
        console.log('❌ Error fetching live data:', broadcastingError.message);
        return;
      }
      setBroadcastingData(broadcastingData);
    }
    fetchBroadcastingData();
  }, []);

  return (
    <>
      <div className="text-2xl mb-7 font-semibold">방송사별 라디오</div>
      <div className="grid gap-x-4 gap-y-7 mb-16 px-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <CircleViewItem isLoading={true} key={index} />
            ))
          : broadcastingData.map((item, index) => {
              return (
                <CircleViewItem
                  key={`${item.id}-${index}`}
                  title={item.broadcasting + item.channel}
                  subTitle={item.frequency}
                  img={item.img_url}
                  onClick={() => {
                    const liveEpisode = liveData.find(
                      (liveItem) => liveItem.channel_id === item.id
                    );

                    if (liveEpisode && liveEpisode.live_episode_id) {
                      navigate(`/player/${liveEpisode.live_episode_id}`, {
                        state: { isLive: true, playlist: activePlaylist },
                      });
                    }
                  }}
                />
              );
            })}
      </div>
    </>
  );
}

export default LiveChannel;
