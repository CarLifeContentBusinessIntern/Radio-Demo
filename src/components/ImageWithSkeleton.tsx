import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface ImageWithSkeletonProps {
  src: string;
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

  return (
    <div className={`relative aspect-square overflow-hidden ${className}`}>
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
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
