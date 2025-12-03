import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { MdOutlinePlayCircle } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { fetchRandomEpisodes } from '../api/randomEpisodes';
import { MOOD_PREFIX } from '../constants/preferenceQuestions';
import { usePreference } from '../contexts/PreferenceContext';
import AIPick from './AIPick';
import ImageWithSkeleton from './ImageWithSkeleton';

function AIPickAfter() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { preferences } = usePreference();

  const { data: episodes, refetch } = useQuery({
    queryKey: ['random-episodes', 'daily-mix'],
    queryFn: fetchRandomEpisodes,
  });

  const moodPrefix =
    preferences.purpose.length > 0 ? MOOD_PREFIX[preferences.purpose[0]] : { ko: '', en: '' };

  const bannerContent = (
    <div
      className="relative w-full overflow-hidden cursor-pointer"
      onClick={() => {
        refetch();
        navigate(`/player/${episodes?.[0].id}`, {
          state: { isLive: false, playlist: episodes, originType: 'program' },
        });
      }}
    >
      <ImageWithSkeleton
        src="https://pub-a45bc992c0594356a8d32a71510a246b.r2.dev/images/pickle-ai-pick/ai_pick_banner_background_after.webp"
        alt="AI Pick Banner"
        className={`cursor-pointer w-full h-40 rounded-3xl object-cover`}
        skeletonClassName={`w-full h-40 rounded-3xl object-cover`}
        isCover={true}
      />

      <div className="absolute w-full -top-8">
        <div className="flex justify-center items-center">
          <div className="flex items-center justify-between w-full max-w-[800px] px-4">
            <ImageWithSkeleton
              src="https://pub-a45bc992c0594356a8d32a71510a246b.r2.dev/images/pickle-ai-pick/ai_pick_banner_dailymix_after.webp"
              alt="AI Pick Banner Icon"
              className="w-1/2 max-w-[360px] h-[230px]"
              skeletonClassName="w-1/2 max-w-[360px] h-[230px]"
              isBlur={false}
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
    </div>
  );

  return (
    <AIPick
      bannerContent={bannerContent}
      sectionTitleKey="sections.ai-pick-after-recomend"
      moodPrefix={moodPrefix}
    />
  );
}

export default AIPickAfter;
