import { useNavigate } from 'react-router-dom';
import { usePickleSeries } from '../hooks/usePickleSeries';
import CircleViewItem from './CircleViewItem';
import { toast } from 'react-toastify';

function MonthlyPickle() {
  const navigate = useNavigate();
  const { data: themes, isLoading } = usePickleSeries(2, 'MonthlyPickle');

  return (
    <>
      <div className="text-2xl mb-7 font-semibold">월간 픽클</div>

      <div
        className="grid gap-x-4 gap-y-7 mb-16 px-1"
        style={{
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        }}
      >
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <CircleViewItem isLoading={true} key={index} />
            ))
          : themes.map((item) => (
              <CircleViewItem
                key={item.id}
                title={item.series_name}
                subTitle={item.subtitle}
                img={item.img_src ?? ''}
                onClick={() => {
                  if (item.pickle_episodes?.length ?? 0) {
                    navigate(`/episodes/series/${item.id}`, {
                      state: { isPickle: true, isRound: false, title: item.series_name },
                    });
                  } else {
                    toast.error(`콘텐츠 준비 중입니다`, { toastId: item.id });
                  }
                }}
              />
            ))}
      </div>
    </>
  );
}

export default MonthlyPickle;
