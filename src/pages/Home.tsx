import { useVersion } from '../contexts/VersionContext';
import HomeLiveVersion from './HomeLiveVersion';
import HomeNoLiveVersion from './HomeNoLiveVersion';

function Home() {
  const { isLiveVersion } = useVersion();

  return <>{isLiveVersion ? <HomeLiveVersion /> : <HomeNoLiveVersion />}</>;
}

export default Home;
