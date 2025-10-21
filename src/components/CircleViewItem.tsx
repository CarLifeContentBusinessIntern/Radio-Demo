// import { useVersion } from '../contexts/VersionContext';

import Skeleton from 'react-loading-skeleton';

interface CircleViewItemProps {
  isLoading?: boolean;
  title?: string;
  subTitle?: string;
  img?: string;
  onClick?: () => void;
}

function CircleViewItem({ isLoading, title, subTitle, img, onClick }: CircleViewItemProps) {
  const trimedTitle = title?.trimEnd();
  if (isLoading) {
    return (
      <div>
        <Skeleton
          className="w-full aspect-square mb-4"
          style={{ borderRadius: '50%' }}
          baseColor="#444"
          highlightColor="gray"
        />
        <Skeleton height={28} width="75%" className="mb-1" baseColor="#444" highlightColor="gray" />
        <Skeleton height={25} width="50%" baseColor="#444" highlightColor="gray" />
      </div>
    );
  }

  return (
    <div className="cursor-pointer" onClick={onClick}>
      <img
        src={img}
        className="w-full aspect-square rounded-full mb-4 flex items-center justify-center overflow-hidden"
      />
      <p className="text-[28px] mb-1 px-1 font-semibold truncate">{trimedTitle}</p>
      <p className="text-[25px] text-gray-400 px-1 truncate">{subTitle}</p>
    </div>
  );
}

export default CircleViewItem;
