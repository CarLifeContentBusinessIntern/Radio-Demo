import { useState, useRef, useEffect } from 'react';
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
  const [needsBlur, setNeedsBlur] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerRatio, setContainerRatio] = useState(1);

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setContainerRatio(width / height);
    }
  }, []);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const imageRatio = img.naturalWidth / img.naturalHeight;

    // 컨테이너가 정사각형인 경우 (1:1 비율)
    if (Math.abs(containerRatio - 1) < 0.1) {
      // 이미지가 정사각형이 아니면 블러 배경 표시
      if (Math.abs(imageRatio - 1) > 0.1) {
        setNeedsBlur(true);
        setObjectFit('object-contain');
      } else {
        setNeedsBlur(false);
        setObjectFit('object-cover');
      }
    } else {
      // 컨테이너가 직사각형인 경우 (기존 로직)
      if (Math.abs(imageRatio - containerRatio) > 0.1) {
        setObjectFit('object-contain');
        setNeedsBlur(true);
      } else {
        setObjectFit('object-cover');
        setNeedsBlur(false);
      }
    }

    setIsLoaded(true);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden flex items-center justify-center ${className}`}
    >
      {/* 블러 배경 */}
      {isLoaded && src && needsBlur && (
        <div
          className="absolute inset-0 bg-cover bg-center blur-2xl scale-110"
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
