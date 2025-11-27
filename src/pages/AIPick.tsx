import AIPickAfter from '../components/AIPickAfter';
import AIPickBefore from '../components/AIPickBefore';

function AIPick() {
  const isSetupComplete = true;

  return <>{isSetupComplete ? <AIPickAfter /> : <AIPickBefore />}</>;
}

export default AIPick;
