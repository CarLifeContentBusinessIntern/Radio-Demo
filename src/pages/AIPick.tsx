import AIPickAfter from '../components/AIPickAfter';
import AIPickBefore from '../components/AIPickBefore';

function AIPick() {
  const isSetupComplete = false;

  return <>{isSetupComplete ? <AIPickAfter /> : <AIPickBefore />}</>;
}

export default AIPick;
