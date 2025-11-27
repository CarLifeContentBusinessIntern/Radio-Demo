import { useQuery } from '@tanstack/react-query';
import GridViewItem from '../components/GridViewItem';
import ListViewItem from '../components/ListViewItem';
import { usePlayer } from '../contexts/PlayerContext';
import { supabase } from '../lib/supabaseClient';
import type { EpisodeType } from '../types/episode';
import { useTranslation } from 'react-i18next';

function RecentPage() {
  const { t } = useTranslation();
  const { playedDurations } = usePlayer();

  const { data: recentEpisodes = [], isLoading } = useQuery<EpisodeType[]>({
    queryKey: ['recentEpisodes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('episodes')
        .select('*,  programs(*, broadcastings(*))')
        .not('listened_at', 'is', null)
        .filter('listened_duration', 'gt', '0')
        .order('listened_at', { ascending: false })
        .limit(10);

      if (error) {
        console.log('❌ 최근 청취 조회 실패 :', error);
        throw error;
      }

      return data;
    },
    refetchOnWindowFocus: true,
    refetchInterval: 30000,
  });

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
    <div className="flex flex-col gap-y-9 pr-11 pt-7">
      <p className="text-lg">{t('sections.curation-channel')}</p>
      <div className="grid gap-x-4 gap-y-7 px-1 grid-cols-4">
        {recentEpisodes?.slice(0, 4).map((item) => {
          const imgUrl = item.programs?.img_url ?? item.img_url;

          return (
            <GridViewItem
              key={item.id}
              img={imgUrl}
              title={item.programs?.title}
              subTitle={item.programs?.subtitle}
              isRounded={true}
            />
          );
        })}
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-lg">{t('sections.episode')}</p>
        <div className="flex flex-col gap-y-1">
          {recentEpisodes?.map((item) => {
            const subTitleText = item.programs?.title;
            const imgUrl = item.img_url ?? item.programs?.img_url;

            return (
              <ListViewItem
                key={item.id}
                id={item.id}
                imgUrl={imgUrl}
                title={item.title}
                subTitle={subTitleText}
                date={item.date}
                hasAudio={!!item.audio_file}
                isRound={true}
                playlist={recentEpisodes}
                totalTime={item.duration}
                listenedDuration={playedDurations[item.id] ?? (Number(item.listened_duration) || 0)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default RecentPage;
