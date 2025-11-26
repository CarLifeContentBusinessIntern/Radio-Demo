import { useParams } from 'react-router-dom';
import ListViewItem from '../components/ListViewItem';
import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { EpisodeType } from '../types/episode';
import type { ProgramType } from '../types/program';
import { usePlayer } from '../contexts/PlayerContext';
import { useQuery } from '@tanstack/react-query';

type ProgramWithEpisodes = ProgramType & {
  episodes: EpisodeType[];
};

function ChannelDetailViewPage() {
  const { id } = useParams();
  const { setPlaylist, playedDurations } = usePlayer();

  const { data: programData, isLoading } = useQuery<ProgramWithEpisodes>({
    queryKey: ['programWithEpisodes', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('programs')
        .select('*, broadcastings(*), episodes(*)')
        .eq('id', id)
        .single();

      if (error) {
        console.error('프로그램 조회 실패:', error);
        throw error;
      }

      return data as ProgramWithEpisodes;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (programData?.episodes) {
      setPlaylist(programData.episodes);
    }
  }, [programData, setPlaylist]);

  return (
    <div className="flex flex-col gap-y-1">
      {isLoading
        ? Array.from({ length: 8 }).map((_, index) => <ListViewItem isLoading={true} key={index} />)
        : programData?.episodes?.map((episode) => {
            const subTitleText =
              episode.type === 'podcast'
                ? `${programData.title}`
                : `${programData.broadcastings?.title} ${programData.broadcastings?.channel}`;

            return (
              <ListViewItem
                key={episode.id}
                id={episode.id}
                imgUrl={episode.img_url || programData.img_url}
                title={episode.title}
                subTitle={subTitleText}
                totalTime={episode.duration}
                date={episode.date}
                hasAudio={!!episode.audio_file}
                playlist={programData.episodes}
                isRound={true}
                originType="program"
                listenedDuration={playedDurations[episode.id] ?? episode.listened_duration}
              />
            );
          })}
    </div>
  );
}

export default ChannelDetailViewPage;
