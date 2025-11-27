import { useTranslation } from 'react-i18next';

function RecentEpisode() {
  const { t } = useTranslation();

  return (
    <div>
      <div className="text-lg mb-7 font-semibold">{t('sections.listening')}</div>
    </div>
  );
}

export default RecentEpisode;
