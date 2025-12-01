import { useTranslation } from 'react-i18next';
import 'react-loading-skeleton/dist/skeleton.css';
import { useNavigate } from 'react-router-dom';
import BannerBackground from '../assets/ai_pick_banner_background.png';
import BannerIcon from '../assets/ai_pick_banner_icon.png';
import AIPick from './AIPick';

function AIPickBefore() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const bannerContent = (
    <div
      className="relative w-full cursor-pointer"
      onClick={() =>
        navigate('/setting/preference', { state: { title: t('setting.set-preference') } })
      }
    >
      <img
        src={BannerBackground}
        className="cursor-pointer w-full h-40 rounded-3xl object-cover"
        alt="AI Pick Banner"
      />

      <div className="absolute w-full top-6">
        <div className="flex justify-center items-center">
          <div className="flex items-center justify-between w-full max-w-[700px] px-10">
            <img src={BannerIcon} className="w-30 h-28" alt="Banner Icon" />

            <div className="text-white">
              <p className="font-normal text-2xl">{t('ai-pick.banner-before-1')}</p>
              <p className="font-bold text-2xl">{t('ai-pick.banner-before-2')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AIPick bannerContent={bannerContent} sectionTitleKey="sections.ai-pick-before-recomend" />
  );
}

export default AIPickBefore;
