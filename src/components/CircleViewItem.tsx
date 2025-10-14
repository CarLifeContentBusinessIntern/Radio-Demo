import PickleLogo from '../assets/pickleLogo.svg';

interface CircleViewItemProps {
  title?: string;
  subTitle?: string;
  onClick?: () => void;
}

function CircleViewItem({ title, subTitle, onClick }: CircleViewItemProps) {
  return (
    <div className="cursor-pointer" onClick={onClick}>
      <div className="relative">
        <div className="bg-gray-600 w-full aspect-square rounded-full mb-4" />
        <img src={PickleLogo} className="absolute top-6 inset-x-0 mx-auto" />
      </div>
      <p className="text-[28px] mb-1 px-1 font-semibold truncate">{title}</p>
      <p className="text-[25px] text-gray-400 px-1 truncate">{subTitle}</p>
    </div>
  );
}

export default CircleViewItem;
