import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSection } from '../hooks/useSection';
import CircleViewItem from './CircleViewItem';
import { useTranslation } from 'react-i18next';

function TimeSlot() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: sectionData, isLoading } = useSection(8);

  return (
    <div>
      <div className="text-lg mb-3 font-semibold">{t('sections.timeslot')}</div>
      <div className="grid gap-x-2 gap-y-7 mb-10 px-1 grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <CircleViewItem isLoading={true} key={index} />
            ))
          : sectionData.map((item, index) => (
              <CircleViewItem
                key={`${item.id}-${index}`}
                title={item.title}
                subTitle={item.subtitle}
                img={item.img_url}
                onClick={() => {
                  if (item.has_episodes) {
                    navigate(`/episodes/series/${item.id}`, {
                      state: { title: item.title, originType: 'series' },
                    });
                  } else {
                    toast.error(t('toast.no-contents'), { toastId: item.id });
                  }
                }}
              />
            ))}
      </div>
    </div>
  );
}

export default TimeSlot;
