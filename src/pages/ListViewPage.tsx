import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ListViewItem from '../components/ListViewItem';
import { supabase } from '../lib/supabaseClient';
import type { Episode, PickleEpisode } from '../types/episode';

type ListViewPageProps = {
  type: 'channel' | 'timeslot' | 'series';
};

function ListViewPage({ type }: ListViewPageProps) {
  const location = useLocation();
  const isPickle = location.state?.isPickle;

  const { id } = useParams();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [pickleEpisodes, setPickleEpisodes] = useState<PickleEpisode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const eqId = type === 'channel' ? 'radio_id' : type === 'timeslot' ? 'time_slot_id' : 'series_id';

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
      setEpisodes(data);
      setIsLoading(false);
    }

    async function fetchPickSeriesData() {
      const { data: pickSeriesData, error: pickSeriesError } = await supabase
        .from('pickle_series_episodes')
        .select('*');
      if (pickSeriesError) {
        console.log('');
      }
      setPickleEpisodes(pickSeriesData);
      setIsLoading(false);
    }

    if (isPickle) fetchPickSeriesData();
    else fetchEpisodesData();
  }, [eqId, id, isPickle]);

  return (
    <div className="flex flex-col gap-y-1">
      {isLoading
        ? Array.from({ length: 8 }).map((_, index) => (
            <ListViewItem isLoading={isLoading} key={index} />
          ))
        : episodes &&
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
                hasAudio={!!item.audio_file}
                playlist={type === 'timeslot' ? episodes : item.radios}
                playlistType={type === 'timeslot' ? 'EpisodeType' : 'RadioType'}
              />
            );
          })}
    </div>
  );
}

export default ListViewPage;
