import { useTranslation } from 'react-i18next';
import { useNavigate, type NavigateFunction } from 'react-router-dom';
import { toast } from 'react-toastify';
import GridViewItem from '../components/GridViewItem';
import ListViewItem from '../components/ListViewItem';
import RecentEpisodeList from '../components/RecentEpisodeList';
import useFetchRecentSeriesProgram from '../hooks/useFetchRecentSeriesProgram';
import { useTenRecentEpisodes } from '../hooks/useTenRecentEpisodes';
import type { RecentSeriesProgramType } from '../types/recent';

function RecentPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    data: recentSeriesPrograms,
    isLoading: isSeriesProgramsLoading,
    error: seriesProgramsError,
  } = useFetchRecentSeriesProgram();

  const {
    data: recentEpisodes = [],
    isLoading: isEpisodesLoading,
    error: episodesError,
  } = useTenRecentEpisodes();
  if (episodesError || seriesProgramsError) {
    console.log('❌ 최근 청취 조회 실패', episodesError || seriesProgramsError);
    return;
  }

  if (isSeriesProgramsLoading || isEpisodesLoading) {
    return (
      <div className="flex flex-col gap-y-1">
        {Array.from({ length: 8 }).map((_, index) => (
          <ListViewItem isLoading={true} key={index} />
        ))}
      </div>
    );
  }

  const handleClickSeriesProgram = (
    navigate: NavigateFunction,
    item: RecentSeriesProgramType,
    toastMessage: string
  ) => {
    if (item.episode) {
      navigate(`/episodes/${item.episode.origin_type}/${item.id}`, {
        state: {
          title: item.title,
          originType: item.episode.origin_type,
        },
      });
    } else {
      toast.error(toastMessage, { toastId: item.id });
    }
  };

  return (
    <div className="flex flex-col gap-y-7 mr-20 pt-5">
      <div className="flex flex-col gap-y-3">
        <p className="text-lg">{t('sections.curation-channel')}</p>
        <div className="grid gap-x-2 gap-y-7 grid-cols-4">
          {recentSeriesPrograms?.map((item) => {
            const imgUrl = item.img_url ?? item.episode?.img_url;
            return (
              <GridViewItem
                key={item.id}
                img={imgUrl}
                title={item.title}
                subTitle={item.subtitle}
                isRounded={true}
                onClick={() => handleClickSeriesProgram(navigate, item, t('toast.no-contents'))}
              />
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-lg">{t('sections.episode')}</p>
        <div className="flex flex-col gap-y-[6px]">
          {recentEpisodes?.map((item) => (
            <RecentEpisodeList key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default RecentPage;
