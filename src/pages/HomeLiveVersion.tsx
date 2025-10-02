import { useNavigate } from 'react-router-dom';
import CircleViewItem from '../components/CircleViewItem';
import GridViewItem from '../components/GridViewItem';
import { mockCategoryData } from '../mock/mockCategoryData';
import { mockChannelData } from '../mock/mockChannelData';
import { mockEpisodeData } from '../mock/mockEpisodeData';

function HomeLiveVersion() {
  const navigate = useNavigate();

  const displayEpData = Array.from({ length: 11 }).map((_, index) => {
    return mockEpisodeData[index % mockEpisodeData.length];
  });

  const displayChannelData = Array.from({ length: 8 }).map((_, index) => {
    return mockChannelData[index % mockChannelData.length];
  });

  const displayCategoryData = Array.from({ length: 8 }).map((_, index) => {
    return mockCategoryData[index % mockCategoryData.length];
  });

  return (
    <div className="pr-28 pt-7">
      <div className="text-2xl mb-7 ">지금은?</div>
      <div className="grid gap-x-4 gap-y-7 mb-16 px-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {displayEpData.map((item, index) => (
          <GridViewItem
            key={`${item.id}-${index}`}
            title={item.title}
            subTitle={item.channel}
            onClick={() => navigate(`/player/${item.id}`)}
          />
        ))}
        <GridViewItem title="더보기" subTitle="더보기" />
      </div>

      <div className="text-2xl mb-7">방송사별 라디오</div>
      <div className="grid gap-x-4 gap-y-7 mb-16 px-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {displayChannelData.map((item, index) => {
          return (
            <CircleViewItem
              key={`${item.id}-${index}`}
              title={item.channelName}
              subTitle={item.frequency}
              onClick={() => {
                if (item.liveEpisodeId) {
                  navigate(`/player/${item.liveEpisodeId}`);
                }
              }}
            />
          );
        })}
      </div>

      <div className="text-2xl mb-7">카테고리</div>
      <div className="grid gap-x-4 gap-y-7 mb-16 px-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {displayCategoryData.map((item, index) => (
          <CircleViewItem
            key={`${item.id}-${index}`}
            title={item.title}
            subTitle={item.category}
            onClick={() => navigate(`/curation/${item.id}`)}
          />
        ))}
      </div>
    </div>
  );
}

export default HomeLiveVersion;
