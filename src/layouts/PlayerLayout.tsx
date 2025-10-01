import { Outlet } from 'react-router-dom';
import BottomPlayer from '../components/BottomPlayer';
import { mockEpisodeData } from '../mock/mockEpisodeData';

const PlayerLayout = () => {
  return (
    <div className="app-container">
      <main className="content">
        <Outlet />
      </main>

      <div className="fixed bottom-4 left-0 right-0 flex justify-center items-center">
        <BottomPlayer title={mockEpisodeData[0].title} channel={mockEpisodeData[0].channel} />
      </div>
    </div>
  );
};

export default PlayerLayout;
