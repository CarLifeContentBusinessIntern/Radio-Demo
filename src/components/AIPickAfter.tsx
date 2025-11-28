import { useTranslation } from 'react-i18next';
import { MdOutlinePlayCircle } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import BannerBackground from '../assets/ai_pick_banner_background_after.png';
import BannerIcon from '../assets/ai_pick_banner_dailymix_after.png';
import AIPick, { EPISODE_COUNT } from './AIPick';
import { useQuery } from '@tanstack/react-query';
import type { EpisodeType } from '../types/episode';
import { supabase } from '../lib/supabaseClient';

function AIPickAfter() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: episodes } = useQuery({
    queryKey: ['random-episodes'],
    queryFn: async (): Promise<EpisodeType[]> => {
      const { data, error } = await supabase.rpc('get_random_episodes', { count: EPISODE_COUNT });
      if (error) throw error;
      return data;
    },
  });

  const bannerContent = (
    <div
      className="relative w-full overflow-hidden cursor-pointer"
      onClick={() => {
        navigate(`/player/${episodes?.[0].id}`, {
          state: { isLive: false, playlist: episodes, originType: 'program' },
        });
      }}
    >
      <img src={BannerBackground} className="cursor-pointer w-full h-40 rounded-3xl object-cover" />

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
    </div>
  );

  return <AIPick bannerContent={bannerContent} sectionTitleKey="sections.ai-pick-after-recomend" />;
}

export default AIPickAfter;
