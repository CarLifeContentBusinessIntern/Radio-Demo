import { useTranslation } from 'react-i18next';
import GridViewItem from '../components/GridViewItem';
import ListViewItem from '../components/ListViewItem';
import RecentEpisodeList from '../components/RecentEpisodeList';
import { useTenRecentEpisodes } from '../hooks/useTenRecentEpisodes';
import type { EpisodeType } from '../types/episode';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

function RecentPage() {
  const { t } = useTranslation();

  const { data: recentEpisodes = [], isLoading, error } = useTenRecentEpisodes();
  if (error) {
    console.log('❌ 최근 청취 조회 실패 :', error);
    return;
  }

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
          {recentEpisodes?.map((item) => (
            <RecentEpisodeList key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default RecentPage;
