import { useVersion } from '../contexts/VersionContext';
import CategoryPage from './CategoryPage';
import Radio from './Radio';

function CategoryAndRadioPage() {
  const { isRadioVersion } = useVersion();
  return <>{isRadioVersion ? <Radio /> : <CategoryPage />}</>;
}

export default CategoryAndRadioPage;
