import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface ImageWithSkeletonProps {
  src: string | undefined;
  alt?: string;
  className?: string;
  skeletonClassName: string;
  baseColor?: string;
  highlightColor?: string;
  isRecent?: boolean;
}

export default function ImageWithSkeleton({
  src,
  alt,
  className = '',
  skeletonClassName = '',
  baseColor = '#444',
  highlightColor = 'gray',
  isRecent = false,
}: ImageWithSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [objectFit, setObjectFit] = useState<'object-contain' | 'object-cover'>('object-cover');

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const imageRatio = img.naturalWidth / img.naturalHeight;
    const containerRatio = 16 / 9;

    if (Math.abs(imageRatio - containerRatio) > 0.1) {
      setObjectFit('object-contain');
    } else {
      setObjectFit('object-cover');
    }

    setIsLoaded(true);
  };

  return (
    <div className={`relative overflow-hidden flex items-center justify-center ${className}`}>
      {/* 최근 청취 큐레이션/채널에 쓰일 경우 배경 블러 추가하지 않기 */}
      {!isRecent && isLoaded && src && objectFit === 'object-contain' && (
        <div
          className="absolute inset-0 bg-cover bg-center blur-2xl"
          style={{ backgroundImage: `url('${src}')` }}
        />
      )}
      {/* Skeleton */}
      {!isLoaded && (
        <Skeleton
          className={`w-full h-full ${skeletonClassName}`}
          baseColor={baseColor}
          highlightColor={highlightColor}
        />
      )}
      {/* Image */}
      <img
        src={src ?? ''}
        alt={alt}
        onLoad={handleImageLoad}
        className={`relative w-full h-full transition-opacity duration-300 ${objectFit} ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
