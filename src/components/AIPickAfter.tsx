import BannerBackground from '../assets/ai_pick_banner_background_after.png';
import BannerIcon from '../assets/ai_pick_banner_dailymix_after.png';
import BannerBackgroundBefore from '../assets/ai_pick_banner_background.png';
import BannerIconBefore from '../assets/ai_pick_banner_icon.png';
import AIPick from './AIPick';
import { usePreference } from '../contexts/PreferenceContext';
import { MOOD_PREFIX } from '../constants/preferenceQuestions';
import Slider from './Slider';
import { useTranslation } from 'react-i18next';
import { MdOutlinePlayCircle } from 'react-icons/md';

function AIPickAfter() {
  const { preferences } = usePreference();
  const { t } = useTranslation();

  const moodPrefix =
    preferences.purpose.length > 0 ? MOOD_PREFIX[preferences.purpose[0]] : { ko: '', en: '' };

  const sliderImages = [
    {
      background: BannerBackground,
      icon: BannerIcon,
      content: (
        <div className="absolute w-full -top-8">
          <div className="flex justify-center items-center">
            <div className="flex items-center justify-between w-full max-w-[800px] px-4">
              <img src={BannerIcon} className="w-1/2 max-w-[360px] h-[230px]" />

              <div className="text-white gap-y1">
                <p className="font-bold text-2xl">{t('ai-pick.banner-after-1')}</p>
                <p className="font-medium text-lg my-2">
                  {t('ai-pick.banner-after-2-start')}
                  <span className="text-[#3D7D6D]">{t('ai-pick.banner-after-2-highlight')}</span>
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
      ),
    },
    {
      background: BannerBackgroundBefore,
      icon: BannerIconBefore,
      content: (
        <div className="absolute w-full top-6">
          <div className="flex justify-center items-center">
            <div className="flex items-center justify-between w-full max-w-[700px] px-10">
              <img src={BannerIconBefore} className="w-30 h-28" alt="Banner Icon" />

              <div className="text-white">
                <p className="font-normal text-2xl">{t('ai-pick.banner-before-1')}</p>
                <p className="font-bold text-2xl">{t('ai-pick.banner-after-4')}</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const bannerContent = <Slider images={sliderImages} />;

  return (
    <AIPick
      bannerContent={bannerContent}
      sectionTitleKey="sections.ai-pick-after-recomend"
      moodPrefix={moodPrefix}
    />
  );
}

export default AIPickAfter;
