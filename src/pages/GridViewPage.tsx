import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import GridViewItem from '../components/GridViewItem';
import RectangleGridViewItem from '../components/RectangleGridViewItem';
import { usePrograms } from '../hooks/usePrograms';
import { useSeriesEpisodes } from '../hooks/useSeriesEpisodes';
import type { ProgramType } from '../types/program';
import type { SeriesEpisodesType } from '../types/episode';
import { useTranslation } from 'react-i18next';

interface GridViewPageProps {
  rectangle?: boolean;
}

function GridViewPage({ rectangle }: GridViewPageProps = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { type } = location.state || {};
  const { id } = useParams();
  const isLive = location.state?.isLive ?? false;

  const isSeriesEpisodes = type === 'series_episodes';
  const programsQuery = usePrograms(id, type);
  const seriesEpisodesQuery = useSeriesEpisodes(id);

  const {
    data: rawData = [],
    isLoading,
    error,
    isError,
  } = isSeriesEpisodes ? seriesEpisodesQuery : programsQuery;

  const allSeriesEpisodes = isSeriesEpisodes
    ? (rawData as SeriesEpisodesType[])
        .map((item) => item.episodes)
        .filter((ep) => ep !== undefined)
    : [];

  const data: ProgramType[] = isSeriesEpisodes
    ? (rawData as SeriesEpisodesType[]).map((item) => ({
        id: item.episodes?.id || 0,
        title: item.episodes?.title || '',
        subtitle: item.episodes?.programs?.title || '',
        img_url: item.episodes?.img_url || '',
        is_live: false,
        series_id: item.series_id,
        created_at: item.created_at,
        broadcasting_id: item.episodes?.programs?.broadcasting_id || 0,
        type: 'podcast' as const,
      }))
    : (rawData as ProgramType[]);

  if (isError) {
    return (
      <div className="pr-28 pt-3 p-4">
        <div className="text-red-500">에러가 발생했습니다: {error?.message}</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="pr-28 pt-3">
        <div className="grid gap-x-4 gap-y-7 mb-16 px-1 grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <GridViewItem isLoading={true} key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="pr-28 pt-3">
        <div className="grid gap-x-4 gap-y-7 mb-16 px-1 grid-cols-4">
          <div className="col-span-4 text-center text-gray-400">데이터가 없습니다</div>
        </div>
      </div>
    );
  }

  return (
    <div className="pr-20">
      {!rectangle ? (
        <div className="grid gap-x-2 gap-y-7 mb-16 px-1 grid-cols-4">
          {data.map((item) => (
            <GridViewItem
              key={item.id}
              isLoading={false}
              title={item.title}
              subTitle={item.subtitle}
              img={item.img_url}
              isRounded={type !== 'podcast_category'}
              onClick={() => {
                if (isSeriesEpisodes) {
                  const validPlaylist = allSeriesEpisodes.filter((ep) => ep.audio_file !== null);
                  navigate(`/player/${item.id}`, {
                    state: {
                      isLive: isLive,
                      playlist: validPlaylist,
                      originType: 'program',
                    },
                  });
                } else {
                  const firstEpisodeWithAudio = item.episodes?.find((ep) => ep.audio_file !== null);
                  if (firstEpisodeWithAudio?.id) {
                    const validPlaylist =
                      item.episodes?.filter((ep) => ep.audio_file !== null) || [];
                    navigate(`/player/${firstEpisodeWithAudio.id}`, {
                      state: { isLive: isLive, playlist: validPlaylist, originType: 'program' },
                    });
                  } else {
                    toast.error(t('toast.no-contents'), { toastId: item.id });
                  }
                }
              }}
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-x-2 gap-y-7 mb-16 px-1 grid-cols-3">
          {data.map((item) => (
            <RectangleGridViewItem
              key={item.id}
              isLoading={false}
              title={item.title}
              subTitle={item.subtitle}
              img={item.img_url}
              isRounded={type !== 'podcast_category'}
              onClick={() => {
                if (isSeriesEpisodes) {
                  const validPlaylist = allSeriesEpisodes.filter((ep) => ep.audio_file !== null);
                  navigate(`/player/${item.id}`, {
                    state: {
                      isLive: isLive,
                      playlist: validPlaylist,
                      originType: 'series',
                      recentSeriesId: item.series_id,
                    },
                  });
                } else {
                  const firstEpisodeWithAudio = item.episodes?.find((ep) => ep.audio_file !== null);
                  if (firstEpisodeWithAudio?.id) {
                    const validPlaylist =
                      item.episodes?.filter((ep) => ep.audio_file !== null) || [];
                    navigate(`/player/${firstEpisodeWithAudio.id}`, {
                      state: {
                        isLive: isLive,
                        playlist: validPlaylist,
                        originType: 'program',
                      },
                    });
                  } else {
                    toast.error(t('toast.no-contents'), { toastId: item.id });
                  }
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default GridViewPage;
