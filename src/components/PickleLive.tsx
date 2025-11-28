import { useNavigate } from 'react-router-dom';
import CircleViewItem from './CircleViewItem';

function PickleLive() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full">
      <div className="text-lg mb-7 font-medium h-7 flex ">P!ckle On-Air 🔴</div>
      <div
        className="relative"
        onClick={() => navigate('/player/live', { state: { title: 'P!ckle On-Air 🔴' } })}
      >
        <CircleViewItem title="임시" subTitle="임시" isPickleLive={true} />
      </div>
    </div>
  );
}

export default PickleLive;
