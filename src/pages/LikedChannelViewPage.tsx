import { useParams } from 'react-router-dom';
import ListViewItem from '../components/ListViewItem';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { EpisodeType } from '../types/episode';
import type { ProgramType } from '../types/program';
import { usePlayer } from '../contexts/PlayerContext';

type ProgramWithEpisodes = ProgramType & {
  episodes: EpisodeType[];
};

function LikedChannelViewPage() {
  const { id } = useParams();
  const { setPlaylist } = usePlayer();
  const [isLoading, setIsLoading] = useState(false);
  const [programData, setProgramData] = useState<ProgramWithEpisodes | null>(null);

  useEffect(() => {
    const fetchProgramWithEpisodes = async () => {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('programs')
        .select('*, broadcastings(*), episodes(*)')
        .eq('id', id)
        .single();

      if (error) {
        console.error('프로그램 조회 실패:', error);
      } else if (data) {
        setProgramData(data as ProgramWithEpisodes);
        setPlaylist(data.episodes || []);
      }

      setIsLoading(false);
    };

    fetchProgramWithEpisodes();
  }, [id, setPlaylist]);

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
              />
            );
          })}
    </div>
  );
}

export default LikedChannelViewPage;
