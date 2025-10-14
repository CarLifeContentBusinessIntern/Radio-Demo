import { Outlet } from 'react-router-dom';
import BottomPlayer from '../components/BottomPlayer';
import { usePlayer } from '../contexts/PlayerContext';

const PlayerLayout = () => {
  const { currentEpisodeData } = usePlayer();

  if (!currentEpisodeData) return null;

  const { id, title, imgUrl } = currentEpisodeData;

  return (
    <div className="app-container">
      <main className="content">
        <Outlet />
      </main>

      <div className="fixed bottom-4 left-0 right-0 flex justify-center items-center">
        <BottomPlayer id={id} title={title} imgUrl={imgUrl} />
      </div>
    </div>
  );
};

export default PlayerLayout;
