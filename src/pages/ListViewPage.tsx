import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ListViewItem from '../components/ListViewItem';
import { supabase } from '../lib/supabaseClient';
import type { Episode, PickleEpisode } from '../types/episode';

type ListViewPageProps = {
  type: 'channel' | 'timeslot' | 'series' | 'podcasts';
};

function ListViewPage({ type }: ListViewPageProps) {
  const location = useLocation();
  const isPickle = location.state?.isPickle;
  const isRound = location.state?.isRound;

  const { id } = useParams();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [pickleEpisodes, setPickleEpisodes] = useState<PickleEpisode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const typeToIdMap = {
    channel: 'radio_id',
    timeslot: 'time_slot_id',
    series: 'series_id',
    podcasts: 'podcast_id',
  };
  const eqId = typeToIdMap[type];

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

    async function fetchPickleEpisodeData() {
      const { data, error } = await supabase
        .from('pickle_episodes')
        .select('*, pickle_podcasts(*)')
        .eq(eqId, id)
        .order('id', { ascending: true });
      if (error) {
        console.log('❌ 피클 에피소드 데이터 조회 실패', error);
      }
      setPickleEpisodes(data ?? []);
      setIsLoading(false);
    }

    if (isPickle) {
      fetchPickleEpisodeData();
    } else {
      fetchEpisodesData();
    }
  }, [eqId, id, isPickle]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-y-1">
        {Array.from({ length: 8 }).map((_, index) => (
          <ListViewItem isLoading={true} key={index} />
        ))}
      </div>
    );
  }

  if (isPickle) {
    if (pickleEpisodes.length > 0) {
      return (
        <div className="flex flex-col gap-y-1">
          {pickleEpisodes &&
            pickleEpisodes.map((item) => {
              const subTitleText = item.pickle_podcasts?.title ?? '';
              const imgUrl = item.src ?? item.pickle_podcasts.img_url;

              return (
                <ListViewItem
                  key={item.id}
                  id={item.id}
                  imgUrl={imgUrl}
                  title={item.title}
                  subTitle={subTitleText}
                  // playTime={item.play_time}
                  totalTime={item.total_time}
                  date={item.uploadAt}
                  hasAudio={!!item.audio_file}
                  playlist={pickleEpisodes}
                  playlistType={'PickleEpisodeType'}
                  isPickle={isPickle}
                  isRound={isRound ?? true}
                />
              );
            })}
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center h-[calc(100vh-220px)]">
          <p>콘텐츠가 없습니다</p>
        </div>
      );
    }
  }

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
                isRound={isRound ?? true}
              />
            );
          })}
    </div>
  );
}

export default ListViewPage;
