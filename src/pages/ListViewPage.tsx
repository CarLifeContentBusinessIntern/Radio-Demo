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
  const [isLoading, setIsLoading] = useState(true);

  const eqId = type === 'channel' ? 'radio_id' : 'time_slot_id';

  useEffect(() => {
    async function fetchEpisodesData() {
      const { data, error } = await supabase
        .from('episodes')
        .select('*, radios(*, channels(*), episodes(*))')
        .eq(eqId, id)
        .order('audio_file', { ascending: true })
        .order('date', { ascending: false })
        .order('title', { ascending: false });
      if (error) {
        console.log('❌ Error fetching episodes data:', error.message);
        setIsLoading(false);
        return;
      }
      console.log('epi', data);
      setEpisodes(data);
      setIsLoading(false);
    }

    fetchEpisodesData();
  }, [eqId, id]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-y-1">
        {Array.from({ length: 8 }).map((_, index) => (
          <ListViewItem isLoading={isLoading} key={index} />
        ))}
      </div>
    );
  }

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
              imgUrl={item.radios?.img_url}
              title={item.title}
              subTitle={subTitleText}
              playTime={item.play_time}
              totalTime={item.total_time}
              date={item.date}
              hasAudio={item.audio_file ? true : false}
              playlist={type === 'timeslot' ? episodes : item.radios}
              mixType={type === 'timeslot' ? 'timeMix' : 'radioChannel'}
            />
          );
        })}
    </div>
  );
}

export default ListViewPage;
