import { useParams } from 'react-router-dom';
import ListViewPage from './ListViewPage';
import GridViewPage from './GridViewPage';

function PicklePickTemplate() {
  const { id } = useParams();

  return <div>{id === '4' ? <GridViewPage rectangle={true} /> : <ListViewPage />}</div>;
}

export default PicklePickTemplate;
