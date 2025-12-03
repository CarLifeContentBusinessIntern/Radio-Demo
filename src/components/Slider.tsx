import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRandomEpisodes } from '../api/randomEpisodes';

interface SliderImage {
  background: string;
  icon: string;
  content: React.ReactNode;
}

interface SliderProps {
  images: SliderImage[];
}

function Slider({ images }: SliderProps) {
  const navigate = useNavigate();
  const sliderLength = images.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchPosition, setTouchPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const { data: episodes, refetch } = useQuery({
    queryKey: ['random-episodes', 'daily-mix'],
    queryFn: fetchRandomEpisodes,
  });

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const nextSlide = () => {
    if (currentIndex < sliderLength - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const currentTouch = e.targetTouches[0].clientX;
    const diff = currentTouch - touchStart;
    setTouchPosition(diff);
  };

  const onTouchEnd = () => {
    setIsDragging(false);

    const threshold = window.innerWidth * 0.3;

    if (touchPosition < -threshold && currentIndex < 1) {
      nextSlide();
    } else if (touchPosition > threshold && currentIndex > 0) {
      prevSlide();
    }

    setTouchPosition(0);
  };

  const getTransform = () => {
    const baseTransform = -currentIndex * 100;
    if (isDragging) {
      const dragPercent = (touchPosition / window.innerWidth) * 100;
      return baseTransform + dragPercent;
    }
    return baseTransform;
  };

  return (
    <div className="relative">
      <div
        className="relative w-full rounded-3xl overflow-hidden cursor-pointer"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className={`flex ${isDragging ? '' : 'transition-transform duration-500 ease-out'}`}
          style={{ transform: `translateX(${getTransform()}%)` }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="relative w-full flex-shrink-0 overflow-hidden cursor-pointer"
              onClick={() => {
                refetch();
                navigate(`/player/${episodes?.[0].id}`, {
                  state: { isLive: false, playlist: episodes, originType: 'program' },
                });
              }}
            >
              <img
                src={image.background}
                alt={`배너 배경 ${index}`}
                className="w-full h-[172px] object-cover"
              />

              {image.content}
            </div>
          ))}
        </div>

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 opacity-70">
          {images.map((_, index) => (
            <span
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentIndex === index ? 'bg-gray-300' : 'bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Slider;
