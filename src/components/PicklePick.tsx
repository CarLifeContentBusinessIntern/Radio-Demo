import { useNavigate, type NavigateFunction } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSection } from '../hooks/useSection';
import type { SectionItemType } from '../types/section';
import GridViewItem from './GridViewItem';
import { useOEM } from '../contexts/OEMContext';
import { useTranslation } from 'react-i18next';

export const handleClickSeries = (
  navigate: NavigateFunction,
  item: SectionItemType,
  toastMessage: string,
  path?: string
) => {
  if (path === 'curation') {
    navigate(`/audio-drama`, {
      state: {
        title: item.title,
        id: item.id,
      },
    });
  }
  if (item.has_episodes) {
    const pathSegment = item.type === 'series' ? 'series' : 'themes';
    const url =
      path === 'rectangle'
        ? `/episodes/${pathSegment}/${item.id}/rectangle`
        : `/episodes/${pathSegment}/${item.id}`;
    navigate(url, {
      state: {
        isPodcast: true,
        isRound: false,
        title: item.title,
        type: 'series_episodes',
        originType: 'series',
      },
    });
  } else {
    toast.error(toastMessage, { toastId: item.id });
  }
};

function PicklePick() {
  const navigate = useNavigate();
  const { selectedOEM } = useOEM();
  const { data: sectionData, isLoading } = useSection(1, selectedOEM);
  const { t } = useTranslation();
  return (
    <>
      <div className="text-lg mb-7 font-semibold">{t('sections.pickle-pick')}</div>

      <div
        className="grid gap-x-4 gap-y-7 mb-16 px-1"
        style={{
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        }}
      >
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <GridViewItem isLoading={true} key={index} />
            ))
          : sectionData.map((item) => (
              <GridViewItem
                key={`${item.type} - ${item.id}`}
                title={item.title}
                subTitle={item.subtitle}
                img={item.img_url}
                onClick={() =>
                  //오디오 드라마일 경우 그리드 뷰
                  item.title === '오디오 드라마'
                    ? handleClickSeries(navigate, item, t('toast.no-contents'), 'curation')
                    : handleClickSeries(navigate, item, t('toast.no-contents'), 'rectangle')
                }
              />
            ))}
      </div>
    </>
  );
}

export default PicklePick;
