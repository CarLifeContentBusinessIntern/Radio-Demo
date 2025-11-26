import { useNavigate } from 'react-router-dom';
import { useSection } from '../hooks/useSection';
import GridViewItem from './GridViewItem';
import { handleClickSeries } from './PicklePick';

function DriveMood() {
  const navigate = useNavigate();
  const { data: sectionData, isLoading } = useSection(3);

  return (
    <>
      <div className="text-lg mb-7 font-semibold">Drive Mood</div>

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
                onClick={() => handleClickSeries(navigate, item)}
              />
            ))}
      </div>
    </>
  );
}

export default DriveMood;
