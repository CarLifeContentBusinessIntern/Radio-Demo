import { useNavigate, type NavigateFunction } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSection } from '../hooks/useSection';
import type { SectionItemType } from '../types/section';
import GridViewItem from './GridViewItem';

export const handleClickSeries = (navigate: NavigateFunction, item: SectionItemType) => {
  if (item.has_episodes) {
    const pathSegment = item.type === 'series' ? 'series' : 'themes';
    navigate(`/episodes/${pathSegment}/${item.id}`, {
      state: { isPodcast: true, isRound: false, title: item.title },
    });
  } else {
    toast.error(`콘텐츠 준비 중입니다`, { toastId: item.id });
  }
};

function PicklePick() {
  const navigate = useNavigate();
  const { data: sectionData, isLoading } = useSection(1);

  return (
    <>
      <div className="text-2xl mb-7 font-semibold">P!ckle P!ck</div>

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
                key={item.id}
                title={item.title}
                subTitle={item.subtitle}
                img={item.img_url}
                onClick={() => handleClickSeries(navigate, item)}
              />
            ))}
      </div>
    </>
  );
}

export default PicklePick;
