import PickleLive from './PickleLive';
import RecentEpisode from './RecentEpisode';

function PickleLiveAndRecent() {
  return (
    <div className="grid grid-cols-4 gap-2 mb-10">
      <div className="col-span-1 h-full">
        <PickleLive />
      </div>
      <div className="col-span-3 h-full">
        <RecentEpisode />
      </div>
    </div>
  );
}

export default PickleLiveAndRecent;
