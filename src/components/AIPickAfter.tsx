import BannerBackground from '../assets/ai_pick_banner_background_after.png';
import BannerIcon from '../assets/ai_pick_banner_dailymix_after.png';
import BannerBackgroundBefore from '../assets/ai_pick_banner_background.png';
import BannerIconBefore from '../assets/ai_pick_banner_icon.png';
import AIPick from './AIPick';
import { usePreference } from '../contexts/PreferenceContext';
import { MOOD_PREFIX } from '../constants/preferenceQuestions';
import Slider from './Slider';

function AIPickAfter() {
  const { preferences } = usePreference();

  const moodPrefix =
    preferences.purpose.length > 0 ? MOOD_PREFIX[preferences.purpose[0]] : { ko: '', en: '' };

  const sliderImages = [
    {
      background: BannerBackground,
      icon: BannerIcon,
    },
    {
      background: BannerBackgroundBefore,
      icon: BannerIconBefore,
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
