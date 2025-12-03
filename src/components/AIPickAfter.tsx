import { useTranslation } from 'react-i18next';
import { MdOutlinePlayCircle } from 'react-icons/md';
// import BannerBackgroundBefore from '../assets/ai_pick_banner_background.png';
// import BannerBackground from '../assets/ai_pick_banner_background_after.png';
// import BannerIcon from '../assets/ai_pick_banner_dailymix_after.png';
// import BannerIconBefore from '../assets/ai_pick_banner_icon.png';
import { MOOD_PREFIX } from '../constants/preferenceQuestions';
import { usePreference } from '../contexts/PreferenceContext';
import AIPick from './AIPick';
import Slider from './Slider';

function AIPickAfter() {
  const { preferences } = usePreference();
  const { t } = useTranslation();

  const moodPrefix =
    preferences.purpose.length > 0 ? MOOD_PREFIX[preferences.purpose[0]] : { ko: '', en: '' };

  const sliderImages = [
    {
      background:
        'https://pub-a45bc992c0594356a8d32a71510a246b.r2.dev/images/pickle-ai-pick/ai_pick_banner_background_after.webp',
      icon: 'https://pub-a45bc992c0594356a8d32a71510a246b.r2.dev/images/pickle-ai-pick/ai_pick_banner_dailymix_after.webp',
      content: (
        <div className="absolute w-full -top-8">
          <div className="flex justify-center items-center">
            <div className="flex items-center justify-between w-full max-w-[800px] px-4">
              <img
                src={
                  'https://pub-a45bc992c0594356a8d32a71510a246b.r2.dev/images/pickle-ai-pick/ai_pick_banner_dailymix_after.webp'
                }
                className="w-1/2 max-w-[360px] h-[230px]"
              />

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
      background:
        'https://pub-a45bc992c0594356a8d32a71510a246b.r2.dev/images/pickle-ai-pick/ai_pick_banner_background.webp',
      icon: 'https://pub-a45bc992c0594356a8d32a71510a246b.r2.dev/images/pickle-ai-pick/ai_pick_banner_icon.webp',
      content: (
        <div className="absolute w-full top-[30px]">
          <div className="flex justify-center items-center">
            <div className="flex items-center justify-between w-full max-w-[700px] px-10">
              <img
                src={
                  'https://pub-a45bc992c0594356a8d32a71510a246b.r2.dev/images/pickle-ai-pick/ai_pick_banner_icon.webp'
                }
                className="w-30 h-28"
                alt="Banner Icon"
              />

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
