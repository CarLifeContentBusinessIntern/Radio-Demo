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

function GridViewItem({
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
          className={`w-full aspect-square mb-4 ${isRounded ? 'rounded-[11%]' : ''}`}
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
          className={`w-full aspect-square ${isRounded ? 'rounded-[11%]' : ''} mb-4 object-cover`}
          skeletonClassName={`w-full aspect-square mb-4 ${isRounded ? 'rounded-[11%]' : ''} `}
        />
      ) : (
        <div
          className={`bg-gray-600 w-full aspect-square ${isRounded ? 'rounded-[11%]' : ''} mb-4`}
        />
      )}
      <p className="text-base mb-1 px-1 font-semibold truncate">{title}</p>
      <p className="text-sm text-gray-400 px-1 truncate">{subTitle}</p>
    </div>
  );
}

export default GridViewItem;
