import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSection } from '../hooks/useSection';
import CircleViewItem from './CircleViewItem';
import { supabase } from '../lib/supabaseClient';
import type { SectionItemType } from '../types/section';

function RadioMix() {
  const navigate = useNavigate();
  const { data: sectionData, isLoading } = useSection(6);

  const handleItemClick = async (item: SectionItemType) => {
    if (item.has_episodes) {
      try {
        const table = 'series_episodes';
        const column = 'series_id';

        const { data, error } = await supabase
          .from(table)
          .select('*, episodes(*, programs(*, broadcastings(*)))')
          .eq(column, item.id)
          .order('order', { ascending: true });

        if (error) {
          throw error;
        }

        const playlist = data ? data.map((joinEntry) => joinEntry.episodes) : [];

        if (playlist.length === 0) {
          toast.error(`콘텐츠 준비 중입니다`, { toastId: item.id });
          return;
        }

        navigate(`/player/${item.first_episode_id}`, {
          state: { isLive: false, playlist: playlist },
        });
      } catch (error) {
        console.error('플레이리스트 조회 실패:', error);
        toast.error(`플레이리스트를 불러오는 데 실패했습니다.`, {
          toastId: 'playlist-fetch-error',
        });
      }
    } else {
      toast.error(`콘텐츠 준비 중입니다`, { toastId: item.id });
    }
  };

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
                onClick={() => handleItemClick(item)}
              />
            ))}
      </div>
    </div>
  );
}

export default RadioMix;
