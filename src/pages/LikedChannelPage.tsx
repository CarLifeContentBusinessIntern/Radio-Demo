import { useLocation, useNavigate } from 'react-router-dom';
import type { ProgramType } from '../types/program';
import GridViewItem from '../components/GridViewItem';
import { useLikedChannels } from '../hooks/useLikedChannels';

function LikedChannelPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { data: likedChannel = [], isLoading } = useLikedChannels();

  const handleNavigate = (item: ProgramType) => {
    navigate(`/like/${item.id}`, {
      replace: true,
      state: {
        ...location.state,
        title: item.title,
        program_id: item.id,
      },
    });
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <GridViewItem isLoading={true} key={index} />
            ))
          : likedChannel.map((item) => (
              <GridViewItem
                key={item.id}
                title={item.title}
                subTitle={item.subtitle}
                img={item.img_url}
                onClick={() => handleNavigate(item)}
              />
            ))}
      </div>
    </>
  );
}

export default LikedChannelPage;
