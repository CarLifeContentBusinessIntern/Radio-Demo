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

  const { data: episodes, refetch } = useQuery({
    queryKey: ['random-episodes', 'daily-mix'],
    queryFn: fetchRandomEpisodes,
  });

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + sliderLength) % sliderLength);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % sliderLength);
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden cursor-pointer">
      <button
        className="absolute top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-gray-600/70 via-gray-600/25 to-transparent text-white h-full pr-8 pl-4 transition-colors"
        onClick={prevSlide}
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
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
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
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-l from-gray-600/70 via-gray-600/25 to-transparent h-full pl-8 pr-4 text-white transition-colors"
        onClick={nextSlide}
      >
        <img src="./src/assets/rightArrowIcon.svg" alt="next" width={10} height={10} />
      </button>
    </div>
  );
}

export default Slider;
