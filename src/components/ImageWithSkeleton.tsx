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
}

export default function ImageWithSkeleton({
  src,
  alt,
  className = '',
  skeletonClassName = '',
  baseColor = '#444',
  highlightColor = 'gray',
}: ImageWithSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [objectFit, setObjectFit] = useState<'object-contain' | 'object-cover'>('object-cover');

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const imageRatio = img.naturalWidth / img.naturalHeight;

    const container = img.parentElement;
    if (container) {
      const containerRatio = container.clientWidth / container.clientHeight;

      if (Math.abs(imageRatio - containerRatio) > 0.1) {
        setObjectFit('object-contain');
      } else {
        setObjectFit('object-cover');
      }
    }

    setIsLoaded(true);
  };

  return (
    <div className={`relative overflow-hidden flex items-center justify-center ${className}`}>
      {isLoaded && src && objectFit === 'object-contain' && (
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
