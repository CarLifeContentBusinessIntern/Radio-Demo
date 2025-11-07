import { Outlet } from 'react-router-dom';
import BottomPlayer from '../components/BottomPlayer';
import { usePlayer } from '../contexts/PlayerContext';

const PlayerLayout = () => {
  const { currentEpisodeData } = usePlayer();

  if (!currentEpisodeData) return null;

  const { id, title, img_url } = currentEpisodeData;

  return (
    <div className="app-container">
      <main className="content">
        <Outlet />
      </main>

      <div className="fixed bottom-4 left-0 right-0 flex justify-center items-center">
        <BottomPlayer id={id} title={title} imgUrl={img_url} />
      </div>
    </div>
  );
};

export default PlayerLayout;
