import { useNavigate } from 'react-router-dom';
import { useSection } from '../hooks/useSection';
import CircleViewItem from './CircleViewItem';
import { handleClickSeries } from './PicklePick';
import { useTranslation } from 'react-i18next';

function MonthlyPickle() {
  const navigate = useNavigate();
  const { data: sectionData, isLoading } = useSection(2);
  const { t } = useTranslation();

  return (
    <>
      <div className="text-lg mb-5 font-semibold">{t('sections.monthly-pickle')}</div>

      <div
        className="grid gap-x-4 gap-y-7 mb-10 px-1"
        style={{
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        }}
      >
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <CircleViewItem isLoading={true} key={index} />
            ))
          : sectionData.map((item) => (
              <CircleViewItem
                key={`${item.type} - ${item.id}`}
                title={item.title}
                // subTitle={item.subtitle}
                img={item.img_url}
                onClick={() => handleClickSeries(navigate, item, t('toast.no-contents'))}
              />
            ))}
      </div>
    </>
  );
}

export default MonthlyPickle;
