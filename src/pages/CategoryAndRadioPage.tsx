import Category from '../components/Category';
import { useVersion } from '../contexts/VersionContext';
import Radio from './Radio';

function CategoryAndRadioPage() {
  const { isRadioVersion } = useVersion();
  return <>{isRadioVersion ? <Radio /> : <Category />}</>;
}

export default CategoryAndRadioPage;
