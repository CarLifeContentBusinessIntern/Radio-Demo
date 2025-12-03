import { useTranslation } from 'react-i18next';
import { useThreeRecentEpisodes } from '../hooks/useThreeRecentEpisodes';
import CircularItemWrapper from './CircularItemWrapper';
import { useIsEnglish } from '../hooks/useIsEnglish';

function RecentEpisode() {
  const { t } = useTranslation();
  const { isEnglish } = useIsEnglish();

  const { data: recentEpisodes, error } = useThreeRecentEpisodes();
  if (error) {
    console.log('❌ 최근 청취 조회 실패 :', error);
    return;
  }

  return (
    <div>
      <div className="text-lg mb-3 font-medium h-7 flex flex-wrap">
        {isEnglish ? (
          <>
            {t('sections.recent')}
            {'\u00a0'}
            <span className="font-bold whitespace-nowrap">{t('user.name')}</span>
          </>
        ) : (
          <>
            <span className="font-bold whitespace-nowrap">{t('user.name')}</span>
            {t('sections.recent')}
          </>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {recentEpisodes?.slice(0, 3).map((episode) => {
          return <CircularItemWrapper key={episode.id} episode={episode} />;
        })}
      </div>
    </div>
  );
}

export default RecentEpisode;
