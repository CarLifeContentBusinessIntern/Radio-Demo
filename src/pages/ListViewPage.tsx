import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ListViewItem from '../components/ListViewItem';
import { supabase } from '../lib/supabaseClient';
import type { Episode } from '../types/episode';

type ListViewPageProps = {
  type: 'channel' | 'timeslot';
};

function ListViewPage({ type }: ListViewPageProps) {
  const { id } = useParams();
  const [episodes, setEpisodes] = useState<Episode[]>([]);

  const eqId = type === 'channel' ? 'radio_id' : 'time_slot_id';

  useEffect(() => {
    async function fetchEpisodesData() {
      const { data, error } = await supabase
        .from('episodes')
        .select('*, radios(*, channels(*))')
        .eq(eqId, id);
      if (error) {
        console.log('❌ Error fetching episodes data:', error.message);
        return;
      }
      console.log(data);
      setEpisodes(data);
    }

    fetchEpisodesData();
  }, [eqId, id]);

  return (
    <div className="flex flex-col gap-y-1">
      {episodes &&
        episodes.map((item) => {
          const broadcasting = item.radios?.channels?.broadcasting;
          const channel = item.radios?.channels?.channel;

          const subTitleText =
            broadcasting && channel ? `${broadcasting} ${channel}` : '채널 정보 없음';
          return (
            <ListViewItem
              key={item.id}
              id={item.id}
              imgUrl={item.radios.img_url}
              title={item.title}
              subTitle={subTitleText}
              playTime={item.playTime}
              totalTime={item.totalTime}
            />
          );
        })}
    </div>
  );
}

export default ListViewPage;
