import Category from '../components/Category';
import { useVersion } from '../contexts/VersionContext';

function HomePage() {
  const { isRadioVersion } = useVersion();

  return <div>{isRadioVersion && <Category />}</div>;
}

export default HomePage;
