import { useNavigate } from 'react-router-dom';
import CircleViewItem from '../components/CircleViewItem';
import GridViewItem from '../components/GridViewItem';
import { mockChannelData, mockChannelWithEpisodes } from '../mock/mockChannelData';
import { mockEpisodeData } from '../mock/mockEpisodeData';
import { mockCategoryData } from '../mock/mockCategoryData';

function HomeLiveVersion() {
  const navigate = useNavigate();

  const displayEpData = Array.from({ length: 11 }).map((_, index) => {
    return mockEpisodeData[index % mockEpisodeData.length];
  });

  const displayChannelData = Array.from({ length: 8 }).map((_, index) => {
    return mockChannelWithEpisodes[index % mockChannelWithEpisodes.length];
  });

  const displayCategoryData = Array.from({ length: 8 }).map((_, index) => {
    return mockCategoryData[index % mockCategoryData.length];
  });

  return (
    <div className="pr-28 pt-3">
      <div className="text-2xl mb-7 ">지금은?</div>
      <div className="grid gap-4 mb-16 px-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {displayEpData.map((item) => (
          <GridViewItem
            key={item.id}
            title={item.title}
            subTitle={item.channel}
            onClick={() => navigate(`/player/${item.id}`)}
          />
        ))}
        <GridViewItem title="더보기" subTitle="더보기" />
      </div>

      <div className="text-2xl mb-7">방송사별 라디오</div>
      <div className="grid gap-4 mb-16 px-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {displayChannelData.map((item) => {
          const liveEpisode = item.episodes.find((episode) => episode.isLive);
          return (
            <CircleViewItem
              key={item.id}
              title={item.channel}
              subTitle={item.frequency}
              onClick={() => {
                if (liveEpisode) {
                  navigate(`/player/${liveEpisode.id}`);
                }
              }}
            />
          );
        })}
      </div>

      <div className="text-2xl mb-7">카테고리</div>
      <div className="grid gap-4 mb-16 px-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {displayCategoryData.map((item) => (
          <CircleViewItem
            key={item.id}
            title={item.title}
            subTitle={item.category}
            onClick={() => navigate(`/curation`)}
          />
        ))}
      </div>
    </div>
  );
}

export default HomeLiveVersion;
