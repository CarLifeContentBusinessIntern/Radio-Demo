import AIPickAfter from '../components/AIPickAfter';
import AIPickBefore from '../components/AIPickBefore';
import { usePreference } from '../contexts/PreferenceContext';

function AIPick() {
  const { hasAnySelection } = usePreference();

  return <>{hasAnySelection ? <AIPickAfter /> : <AIPickBefore />}</>;
}

export default AIPick;
