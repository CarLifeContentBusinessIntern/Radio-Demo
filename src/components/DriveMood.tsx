import { useNavigate } from 'react-router-dom';
import GridViewItem from './GridViewItem';
import { usePickleSeries } from '../hooks/usePickleSeries';

function DriveMood() {
  const navigate = useNavigate();
  const { data: themes, isLoading } = usePickleSeries(3, 'DriveMood');

  return (
    <>
      <div className="text-2xl mb-7 font-semibold">Drive Mood</div>

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
                onClick={() => {
                  navigate(`/episodes/series/${item.id}`, {
                    state: { isPickle: true, isRound: false, title: item.series_name },
                  });
                }}
              />
            ))}
      </div>
    </>
  );
}

export default DriveMood;
