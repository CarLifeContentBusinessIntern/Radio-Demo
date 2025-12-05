import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { supabase } from '../lib/supabaseClient';
import type { EpisodeType } from '../types/episode';
import type { ProgramType } from '../types/program';
import GridViewItem from './GridViewItem';
import { useTranslation } from 'react-i18next';

function LiveRadio() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: liveData = [], isLoading } = useQuery<ProgramType[]>({
    queryKey: ['liveRadio'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('programs')
        .select('*, broadcastings(*), episodes(*, programs(*, broadcastings(*)))')
        .eq('is_live', true)
        .order('order_live', { ascending: true });

      if (error) {
        console.log('❌ Error fetching live data:', error.message);
        throw error;
      }

      return data || [];
    },
  });

  // liveData에서 플레이리스트 생성
  const playlist: EpisodeType[] = liveData.reduce<EpisodeType[]>((acc, program) => {
    const playableEpisode = program.episodes?.find((ep: EpisodeType) => ep.audio_file !== null);

    if (playableEpisode) {
      acc.push(playableEpisode);
    } else {
      acc.push({
        id: null,
        title: null,
        img_url: null,
        audio_file: null,
        date: null,
        duration: null,
        type: 'radio',
        created_at: null,
        program_id: null,
        order_recent: null,
        programs: program,
      } as unknown as EpisodeType);
    }
    return acc;
  }, []);

  const handleLiveClick = (id: number | undefined) => {
    if (!id || id === undefined) {
      toast.error(t('toast.no-contents'));
      return;
    }
    navigate(`/player/${id}/live`, { state: { isLive: true, playlist: playlist } });
  };

  return (
    <>
      <div className="text-lg mb-3 font-semibold">ON-AIR 🔴</div>
      <div className="grid gap-x-2 gap-y-7 mb-10 grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <GridViewItem isLoading={true} key={index} />
            ))
          : liveData.slice(0, 8).map((item, index) => {
              const playableEpisodeInPlaylist = playlist.find(
                (ep) => ep.programs?.id === item.id && ep.audio_file !== null
              );
              const episodeIdToPlay = playableEpisodeInPlaylist?.id ?? null;

              return (
                <GridViewItem
                  key={`${item.id}-${index}`}
                  title={item.title}
                  subTitle={item.subtitle}
                  img={item.img_url}
                  onClick={() => handleLiveClick(episodeIdToPlay ?? undefined)}
                />
              );
            })}
      </div>
    </>
  );
}

export default LiveRadio;
