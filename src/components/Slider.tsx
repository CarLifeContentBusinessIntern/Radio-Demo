import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRandomEpisodes } from '../api/randomEpisodes';
import { useTranslation } from 'react-i18next';
import { MdOutlinePlayCircle } from 'react-icons/md';

interface SliderImage {
  background: string;
  icon: string;
}

interface SliderProps {
  images: SliderImage[];
}

function Slider({ images }: SliderProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
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

  const isFirstSlide = currentIndex === 0;
  const isLastSlide = currentIndex === sliderLength - 1;

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

    // 드래그 거리가 화면의 30% 이상이면 슬라이드 변경
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
        <button
          className={`absolute top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-gray-600/70 via-gray-600/25 to-transparent text-white h-full pr-8 pl-4 transition-all ${
            isFirstSlide ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          onClick={prevSlide}
          disabled={isFirstSlide}
        >
          <img
            src="./src/assets/rightArrowIcon.svg"
            alt="prev"
            width={10}
            height={10}
            className="scale-x-[-1]"
          />
        </button>

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
                className="w-full h-40 object-cover"
              />

              <div className="absolute w-full -top-8">
                <div className="flex justify-center items-center">
                  <div className="flex items-center justify-between w-full max-w-[800px] px-4">
                    <img src={image.icon} className="w-1/2 max-w-[360px] h-[230px]" />

                    <div className="text-white gap-y1">
                      <p className="font-bold text-2xl">{t('ai-pick.banner-after-1')}</p>
                      <p className="font-medium text-lg my-2">
                        {t('ai-pick.banner-after-2-start')}
                        <span className="text-[#3D7D6D]">
                          {t('ai-pick.banner-after-2-highlight')}
                        </span>
                        {t('ai-pick.banner-after-2-end')}
                      </p>
                      <button className="font-bold text-base bg-[#202020]/30 px-5 py-3 rounded-full flex items-center gap-3 cursor-pointer">
                        <MdOutlinePlayCircle size={20} />
                        <p>{t('ai-pick.banner-after-3')}</p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-l from-gray-600/70 via-gray-600/25 to-transparent h-full pl-8 pr-4 text-white transition-all ${
            isLastSlide ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          onClick={nextSlide}
          disabled={isLastSlide}
        >
          <img src="./src/assets/rightArrowIcon.svg" alt="next" width={10} height={10} />
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-3">
        {images.map((_, index) => (
          <span
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              currentIndex === index ? 'bg-gray-300' : 'bg-gray-500'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default Slider;
