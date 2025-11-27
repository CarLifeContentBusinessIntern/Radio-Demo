import CircleViewItem from './CircleViewItem';

function PickleLive() {
  return (
    <div className="flex flex-col h-full">
      <div className="text-lg mb-7 font-medium h-7 flex ">P!ckle On-Air 🔴</div>
      <div className="relative">
        <CircleViewItem title="임시" subTitle="임시" isPickleLive={true} />
      </div>
    </div>
  );
}

export default PickleLive;
