import { useLayoutEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useLazyLoad } from '../hooks/useLazyLoad';

interface ImageWithSkeletonProps {
  src: string | undefined;
  alt?: string;
  className?: string;
  skeletonClassName: string;
  baseColor?: string;
  highlightColor?: string;
  isRecent?: boolean;
  priority?: boolean;
  rootMargin?: string;
}

export default function ImageWithSkeleton({
  src,
  alt,
  className = '',
  skeletonClassName = '',
  baseColor = '#444',
  highlightColor = 'gray',
  isRecent = false,
  priority = false,
  rootMargin = '300px',
}: ImageWithSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [objectFit, setObjectFit] = useState<'object-contain' | 'object-cover'>('object-cover');
  const [needsBlur, setNeedsBlur] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerRatio, setContainerRatio] = useState(1);

  const { ref: lazyRef, isInView } = useLazyLoad({
    priority,
    rootMargin,
  });

  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const measure = () => {
      const { width, height } = element.getBoundingClientRect();
      if (height > 0) {
        setContainerRatio(width / height);
      }
    };

    const resizeObserver = new ResizeObserver(measure);
    measure();
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
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
      ref={(node) => {
        containerRef.current = node;
        lazyRef.current = node;
      }}
      className={`relative overflow-hidden flex items-center justify-center ${className}`}
    >
      {/* 블러 배경 */}
      {/* 최근 청취 큐레이션/채널에 쓰일 경우 배경 블러 추가하지 않기 */}

      {!isRecent && isLoaded && src && needsBlur && (
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
        src={isInView ? (src ?? '') : ''}
        alt={alt}
        onLoad={handleImageLoad}
        className={`relative w-full h-full transition-opacity duration-300 ${objectFit} ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
