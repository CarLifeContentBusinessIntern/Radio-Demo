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
  const [hasSwiped, setHasSwiped] = useState(false);

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

  const handleSlideEnd = () => {
    setIsDragging(false);

    // threshold: 슬라이드 이동을 결정하는 최소 거리
    const threshold = window.innerWidth * 0.03;

    if (touchPosition < -threshold && currentIndex < sliderLength - 1) {
      nextSlide();
    } else if (touchPosition > threshold && currentIndex > 0) {
      prevSlide();
    }

    setTouchPosition(0);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
    setHasSwiped(false);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const currentTouch = e.targetTouches[0].clientX;
    const diff = currentTouch - touchStart;
    setTouchPosition(diff);

    if (Math.abs(diff) > 10) {
      setHasSwiped(true);
    }
  };

  const onTouchEnd = () => {
    handleSlideEnd();
  };

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setTouchStart(e.clientX);
    setIsDragging(true);
    setHasSwiped(false);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const currentMouse = e.clientX;
    const diff = currentMouse - touchStart;
    setTouchPosition(diff);

    if (Math.abs(diff) > 10) {
      setHasSwiped(true);
    }
  };

  const onMouseUp = () => {
    if (!isDragging) return;

    handleSlideEnd();
  };

  const onMouseLeave = () => {
    if (isDragging) {
      onMouseUp();
    }
  };

  const getTransform = () => {
    const baseTransform = -currentIndex * 100;
    if (isDragging) {
      const dragPercent = (touchPosition / window.innerWidth) * 100;
      return baseTransform + dragPercent;
    }
    return baseTransform;
  };

  const handleBannerClick = async (index: number) => {
    const reset = index === 0;

    const freshEpisodes = await fetchRandomEpisodes({ reset });

    if (freshEpisodes && freshEpisodes.length > 0) {
      navigate(`/player/${freshEpisodes[0].id}`, {
        state: { isLive: false, playlist: freshEpisodes, originType: 'program' },
      });
    }
  };

  return (
    <div className="relative">
      <div
        className="relative w-full rounded-3xl overflow-hidden cursor-pointer"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
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
                if (hasSwiped) return;

                if (index > 0) {
                  navigate(`/setting/preference`);
                } else {
                  handleBannerClick(index);
                }
              }}
            >
              <img
                src={image.background}
                alt={`배너 배경 ${index}`}
                className="w-full h-[172px] object-cover"
                draggable={false}
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
                currentIndex === index ? 'bg-black/50' : 'bg-black/25'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Slider;
