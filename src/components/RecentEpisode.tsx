import { useThreeRecentEpisodes } from '../hooks/useThreeRecentEpisodes';
import CircularItemWrapper from './CircularItemWrapper';

function RecentEpisode() {
  const seriesEpisodesQuery = useThreeRecentEpisodes();

  return (
    <div>
      <div className="text-lg mb-7 font-medium h-7 flex flex-wrap">
        <span className="font-bold whitespace-nowrap">오비고</span>의 최근 청취
      </div>
      <div className="grid grid-cols-3 gap-4">
        {seriesEpisodesQuery.data?.slice(0, 3).map((episode) => {
          return <CircularItemWrapper key={episode.id} episode={episode} />;
        })}
      </div>
    </div>
  );
}

export default RecentEpisode;
