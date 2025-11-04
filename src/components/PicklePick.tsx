import { useNavigate, type NavigateFunction } from 'react-router-dom';
import { usePickleSeries } from '../hooks/usePickleSeries';
import GridViewItem from './GridViewItem';
import { toast } from 'react-toastify';
import type { PickleSeries } from '../types/pickle';

export const handleClickSeries = (navigate: NavigateFunction, item: PickleSeries) => {
  if (item.pickle_episodes?.length) {
    navigate(`/episodes/series/${item.id}`, {
      state: { isPickle: true, isRound: false, title: item.series_name },
    });
  } else {
    toast.error(`콘텐츠 준비 중입니다`, { toastId: item.id });
  }
};

function PicklePick() {
  const navigate = useNavigate();
  const { data: themes, isLoading } = usePickleSeries(1, 'Pickle Pick');

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
          : themes.map((item) => (
              <GridViewItem
                key={item.id}
                title={item.series_name}
                subTitle={item.subtitle}
                img={item.img_src ?? ''}
                onClick={() => handleClickSeries(navigate, item)}
              />
            ))}
      </div>
    </>
  );
}

export default PicklePick;
