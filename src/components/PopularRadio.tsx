import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { supabase } from '../lib/supabaseClient';
import type { ProgramType } from '../types/program';
import type { ThemeType } from '../types/theme';
import GridViewItem from './GridViewItem';

interface PopularRadioInterface {
  programs: ProgramType;
  themes: ThemeType;
}

function PopularRadio() {
  const { data: popularRadios = [], isLoading } = useQuery<PopularRadioInterface[]>({
    queryKey: ['popularRadios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('themes_programs')
        .select(
          `*,
        programs(*,broadcastings(*), episodes(*, programs(*, broadcastings(*)))),
        themes!inner(*)
        `
        )
        .eq('theme_id', 1)
        .order('title', { referencedTable: 'programs.episodes', ascending: false });

      if (error) {
        console.error('Supabase 연결 실패:', error);
        throw error;
      }

      return data as PopularRadioInterface[];
    },
  });

  const navigate = useNavigate();

  return (
    <>
      <div className="text-lg mb-7 font-semibold">라디오 인기 채널</div>
      <div
        className="grid gap-x-4 gap-y-7 mb-16 px-1"
        style={{
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        }}
      >
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <GridViewItem isLoading={true} key={index} />
            ))
          : popularRadios.map((item) => (
              <GridViewItem
                key={item.programs.id}
                title={item.programs.title}
                subTitle={`${item.programs.broadcastings?.title} ${item.programs.broadcastings?.channel}`}
                img={item.programs.img_url}
                onClick={() => {
                  const firstEpisode = item.programs.episodes?.[0];

                  if (firstEpisode && firstEpisode.audio_file !== null) {
                    navigate(`/player/${firstEpisode.id}`, {
                      state: { playlist: item.programs.episodes, originType: 'program' },
                    });
                  } else {
                    toast.error(`콘텐츠 준비 중입니다`, { toastId: item.programs.id });
                  }
                }}
              />
            ))}
      </div>
    </>
  );
}

export default PopularRadio;
