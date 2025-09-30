import { Outlet } from "react-router-dom";
import BottomPlayer from "../components/BottomPlayer";
import { mockEpisodeData } from "../mock/mockEpisodeData";

const PlayerLayout = () => {
  return (
    <div className="app-container">
      <main className="content">
        <Outlet />
      </main>

      <div className="fixed bottom-0 left-0 right-0 flex justify-center items-center">
        <BottomPlayer
          title={mockEpisodeData[4].title}
          channel={mockEpisodeData[4].channel}
        />
      </div>
    </div>
  );
};

export default PlayerLayout;
