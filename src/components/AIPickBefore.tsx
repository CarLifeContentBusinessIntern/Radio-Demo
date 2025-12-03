import { useTranslation } from 'react-i18next';
import 'react-loading-skeleton/dist/skeleton.css';
import { useNavigate } from 'react-router-dom';
import AIPick from './AIPick';
import ImageWithSkeleton from './ImageWithSkeleton';

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
      <ImageWithSkeleton
        src="https://pub-a45bc992c0594356a8d32a71510a246b.r2.dev/images/pickle-ai-pick/ai_pick_banner_background.webp"
        alt="AI Pick Banner"
        className={`cursor-pointer w-full h-[172px] rounded-3xl object-cover`}
        skeletonClassName={`w-full h-[172px] rounded-3xl object-cover`}
        isCover={true}
      />

      <div className="absolute w-full top-[30px]">
        <div className="flex justify-center items-center">
          <div className="flex items-center justify-between w-full max-w-[700px] px-10">
            <ImageWithSkeleton
              src="https://pub-a45bc992c0594356a8d32a71510a246b.r2.dev/images/pickle-ai-pick/ai_pick_banner_icon.webp"
              alt="AI Pick Banner Icon"
              className="w-30 h-28"
              skeletonClassName="w-30 h-28"
              isBlur={false}
            />

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
