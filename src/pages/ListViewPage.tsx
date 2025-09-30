import ListViewItem from "../components/ListViewItem";
import { mockEpisodeData } from "../mock/mockEpisodeData";

function ListViewPage() {
  return (
    <div className="flex flex-col gap-y-1">
      {mockEpisodeData.map((item) => (
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
  );
}

export default ListViewPage;
