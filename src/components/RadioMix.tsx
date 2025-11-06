import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSection } from '../hooks/useSection';
import CircleViewItem from './CircleViewItem';

function RadioMix() {
  const navigate = useNavigate();
  const { data: sectionData, isLoading } = useSection(6);

  return (
    <div>
      <div className="text-2xl mb-7 font-semibold">라디오 믹스</div>
      <div
        className="grid gap-x-4 gap-y-7 mb-16 px-1"
        style={{
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        }}
      >
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <CircleViewItem isLoading={true} key={index} />
            ))
          : sectionData?.map((item) => (
              <CircleViewItem
                key={item.id}
                title={item.title}
                img={item.img_url}
                onClick={() => {
                  if (item.has_episodes) {
                    navigate(`/player/${item.first_episode_id}`, {
                      state: { isLive: false, playlist: item, playlistType: 'ThemeType' },
                    });
                  } else {
                    toast.error(`콘텐츠 준비 중입니다`, { toastId: item.id });
                  }
                }}
              />
            ))}
      </div>
    </div>
  );
}

export default RadioMix;
