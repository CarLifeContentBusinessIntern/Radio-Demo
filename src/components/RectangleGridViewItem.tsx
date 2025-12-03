import Skeleton from 'react-loading-skeleton';
import ImageWithSkeleton from './ImageWithSkeleton';

interface GridViewItemProps {
  isLoading?: boolean;
  title?: string;
  subTitle?: string;
  img?: string;
  onClick?: () => void;
  isRounded?: boolean;
}

function RectangleGridViewItem({
  isLoading,
  title,
  subTitle,
  img,
  onClick,
  isRounded = true,
}: GridViewItemProps) {
  if (isLoading) {
    return (
      <div>
        <Skeleton
          className={`w-full aspect-[16/9] mb-4 ${isRounded ? 'rounded-[11%]' : ''}`}
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
      {img ? (
        <ImageWithSkeleton
          src={img}
          alt="썸네일"
          className={`w-full aspect-[16/9] ${isRounded ? 'rounded-[10px]' : ''} mb-[6px]`}
          skeletonClassName={`w-full aspect-[16/9] mb-[6px] ${isRounded ? 'rounded-[10px]' : ''}`}
        />
      ) : (
        <div
          className={`bg-gray-600 w-full aspect-[16/9] ${isRounded ? 'rounded-[10px]' : ''} mb-[6px]`}
        />
      )}
      <p className="text-lg px-1 font-semibold truncate">{title}</p>
      <p className="text-base text-gray-400 px-1 truncate">{subTitle}</p>
    </div>
  );
}

export default RectangleGridViewItem;
