import Skeleton from 'react-loading-skeleton';
import ImageWithSkeleton from './ImageWithSkeleton';
import { useLocation } from 'react-router-dom';

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
  const location = useLocation();
  const isAudioDrama = location.state?.isAudioDrama;

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
          className={`w-full aspect-square ${isRounded ? (isAudioDrama ? 'rounded-[10px]' : 'rounded-[20px]') : ''} mb-2 object-cover`}
          skeletonClassName={`w-full aspect-square mb-2 ${isRounded ? (isAudioDrama ? 'rounded-[10px]' : 'rounded-[20px]') : ''} `}
        />
      ) : (
        <div
          className={`bg-gray-600 w-full aspect-square ${isRounded ? (isAudioDrama ? 'rounded-[10px]' : 'rounded-[20px]') : ''} mb-2`}
        />
      )}
      <p className="text-base px-1 font-semibold truncate">{title}</p>
      <p className="text-sm text-gray-400 px-1 truncate">{subTitle}</p>
    </div>
  );
}

export default GridViewItem;
