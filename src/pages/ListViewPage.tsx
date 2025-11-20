import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ListViewItem from '../components/ListViewItem';
import { usePlayer } from '../contexts/PlayerContext';
import { supabase } from '../lib/supabaseClient';
import type { EpisodeType, SeriesEpisodesType } from '../types/episode';

type ListViewPageProps = {
  type: 'channel' | 'timeslot' | 'series' | 'podcast';
};

function ListViewPage({ type }: ListViewPageProps) {
  const location = useLocation();
  const isRound = location.state?.isRound;
  const { id } = useParams();
  const { setPlaylist } = usePlayer();
  const [episodes, setEpisodes] = useState<SeriesEpisodesType[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<EpisodeType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const typeToIdMap = {
    channel: 'radio_id',
    timeslot: 'time_slot_id',
    series: 'series_id',
    podcast: 'podcast_id',
  };
  const eqId = typeToIdMap[type];

  useEffect(() => {
    async function fetchEpisodesData() {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('series_episodes')
        .select('*, episodes(*, programs(*, broadcastings(*)))')
        .eq('series_id', id);

      if (error) {
        console.log('❌ 에피소드 조회 실패 : ', error);
      }

      setEpisodes(data || []);
      setPlaylist(
        data ? data.map((item) => item.episodes).filter((ep): ep is EpisodeType => !!ep) : []
      );
      setCurrentPlaylist(
        data ? data.map((item) => item.episodes).filter((ep): ep is EpisodeType => !!ep) : []
      );
      setIsLoading(false);
    }

    fetchEpisodesData();
  }, [eqId, id, setPlaylist]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-y-1">
        {Array.from({ length: 8 }).map((_, index) => (
          <ListViewItem isLoading={true} key={index} />
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-y-1">
      {isLoading
        ? Array.from({ length: 8 }).map((_, index) => (
            <ListViewItem isLoading={isLoading} key={index} />
          ))
        : episodes &&
          episodes.map((item) => {
            const broadcasting = item.episodes?.programs?.broadcastings?.title;
            const channel = item.episodes?.programs?.broadcastings?.channel;

            const subTitleText =
              item.episodes?.type === 'podcast'
                ? `${item.episodes?.programs?.title}`
                : `${broadcasting} ${channel}`;
            return (
              <ListViewItem
                key={item.id}
                id={item.episode_id}
                imgUrl={item.episodes?.img_url || item.episodes?.programs?.img_url}
                title={item.episodes?.title}
                subTitle={subTitleText}
                totalTime={item.episodes?.duration}
                date={item.episodes?.date}
                hasAudio={!!item.episodes?.audio_file}
                playlist={currentPlaylist}
                isRound={isRound ?? true}
              />
            );
          })}
    </div>
  );
}

export default ListViewPage;
