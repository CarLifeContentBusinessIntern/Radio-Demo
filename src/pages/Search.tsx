import ListViewItem from "../components/ListViewItem";
import { mockChannelData } from "../mock/mockChannelData";
import { mockEpisodeData } from "../mock/mockEpisodeData";

function Search() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-5">
        <p className="text-[26px]">채널</p>
        <div className="flex flex-col gap-y-1">
          {mockChannelData.slice(0, 4).map((item) => (
            <ListViewItem
              key={item.id}
              imgUrl={item.imgUrl}
              title={item.channel}
              subTitle={item.producer}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <p className="text-[26px]">에피소드</p>
        <div className="flex flex-col gap-y-1">
          {mockEpisodeData.slice(0, 4).map((item) => (
            <ListViewItem
              key={item.id}
              imgUrl={item.imgUrl}
              title={item.title}
              subTitle={item.channel}
              playTime={item.playTime}
              totalTime={item.totalTime}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Search;
