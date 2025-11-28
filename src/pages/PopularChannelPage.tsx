import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import GridViewItem from '../components/GridViewItem';
import { useVersion } from '../contexts/VersionContext';
import { supabase } from '../lib/supabaseClient';
import type { ProgramType } from '../types/program';
import type { ThemeType } from '../types/theme';
import { useTranslation } from 'react-i18next';

interface PopularRadioInterface {
  programs: ProgramType;
  themes: ThemeType;
}

function PopularChannelPage() {
  const { isRadioVersion } = useVersion();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: allPrograms = [], isLoading } = useQuery<PopularRadioInterface[]>({
    queryKey: ['popularPrograms', isRadioVersion],
    queryFn: async () => {
      let query = supabase
        .from('themes_programs')
        .select(
          '*,programs!inner(*, broadcastings(*), episodes(*, programs(*, broadcastings(*)))),themes!inner(*)'
        )
        .eq('theme_id', 8)
        .order('order', { ascending: true })
        .order('title', { referencedTable: 'programs.episodes', ascending: false });

      if (!isRadioVersion) {
        query = query.eq('programs.type', 'podcast');
      }

      const { data, error } = await query;
      if (error) {
        console.error('Supabase 연결 실패:', error);
        throw error;
      }

      return data as PopularRadioInterface[];
    },
  });

  const popularPrograms = allPrograms;

  return (
    <div className="pr-28 pt-3">
      <div className="grid gap-x-4 gap-y-7 mb-16 px-1 grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <GridViewItem isLoading={true} key={index} />
            ))
          : popularPrograms.map((item) => {
              const subTitle =
                item.programs.type === 'podcast'
                  ? item.programs.subtitle
                  : `${item.programs.broadcastings?.title} ${item.programs.broadcastings?.channel}`;
              return (
                <GridViewItem
                  key={item.programs.id}
                  isLoading={false}
                  title={item.programs.title}
                  subTitle={subTitle}
                  img={item.programs.img_url}
                  isRounded={true}
                  onClick={() => {
                    const firstEpisodeId = item.programs.episodes?.[0]?.id;
                    if (
                      firstEpisodeId !== undefined &&
                      item.programs.episodes?.[0]?.audio_file !== null
                    ) {
                      navigate(`/player/${firstEpisodeId}`, {
                        state: {
                          isLive: false,
                          playlist: item.programs.episodes,
                          originType: 'program',
                        },
                      });
                    } else {
                      toast.error(t('toast.no-contents'), { toastId: item.programs.id });
                    }
                  }}
                />
              );
            })}
      </div>
    </div>
  );
}

export default PopularChannelPage;
