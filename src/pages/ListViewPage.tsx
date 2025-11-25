import { useEffect, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ListViewItem from '../components/ListViewItem';
import { usePlayer } from '../contexts/PlayerContext';
import type { EpisodeType } from '../types/episode';
import { useSeriesEpisodes } from '../hooks/useSeriesEpisodes';

function ListViewPage() {
  const location = useLocation();
  const { isRound } = location.state || { isRound: true };
  const originType = location.state?.originType;

  const { type, id } = useParams();
  const { setPlaylist } = usePlayer();

  const { data: episodes = [], isLoading, error } = useSeriesEpisodes(id, type);

  const currentPlaylist: EpisodeType[] = useMemo(() => {
    const playlist = episodes.map((item) => item.episodes).filter((ep): ep is EpisodeType => !!ep);
    return playlist;
  }, [episodes]);

  useEffect(() => {
    if (currentPlaylist.length > 0) {
      setPlaylist(currentPlaylist);
    }
  }, [currentPlaylist, setPlaylist]);

  if (error) {
    return <div>에러: {String(error)}</div>;
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

  if (!episodes || episodes.length === 0) {
    return <div>데이터가 없습니다</div>;
  }

  return (
    <div className="flex flex-col gap-y-1">
      {episodes.map((item) => {
        const broadcasting = item.episodes?.programs?.broadcastings?.title;
        const channel = item.episodes?.programs?.broadcastings?.channel;

        const subTitleText =
          item.episodes?.type === 'podcast'
            ? `${item.episodes?.programs?.title}`
            : `${broadcasting} ${channel}`;

        return (
          <ListViewItem
            key={item.id}
            id={item.episode_id}
            imgUrl={item.episodes?.img_url || item.episodes?.programs?.img_url}
            title={item.episodes?.title}
            subTitle={subTitleText}
            totalTime={item.episodes?.duration}
            date={item.episodes?.date}
            hasAudio={!!item.episodes?.audio_file}
            playlist={currentPlaylist}
            isRound={isRound ?? true}
            originType={originType}
            recentSeriesId={item.series_id}
          />
        );
      })}
    </div>
  );
}

export default ListViewPage;
