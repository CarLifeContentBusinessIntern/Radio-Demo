import { useVersion } from '../contexts/VersionContext';
import RadioLiveVersion from './RadioLiveVersion';
import RadioNoLiveVersion from './RadioNoLiveVersion';

function Radio() {
  const { isLiveVersion } = useVersion();

  return <>{isLiveVersion ? <RadioLiveVersion /> : <RadioNoLiveVersion />}</>;
}

export default Radio;
