import { useLocation, useNavigate } from 'react-router-dom';
import GridViewItem from './GridViewItem';
import { supabase } from '../lib/supabaseClient';
import type { ProgramType } from '../types/program';
import { useQuery } from '@tanstack/react-query';

function LikedChannel() {
  const location = useLocation();
  const navigate = useNavigate();

  const { data: likedChannel = [], isLoading } = useQuery<ProgramType[]>({
    queryKey: ['likedChannels'],
    queryFn: async () => {
      const { data, error } = await supabase.from('programs').select('*').eq('is_liked', true);

      if (error) {
        console.error('좋아요 채널 조회 실패:', error);
        throw error;
      }

      return data as ProgramType[];
    },
  });

  const handleNavigate = (item: ProgramType) => {
    navigate(`/like/${item.id}`, {
      state: {
        ...location.state,
        title: item.title,
        program_id: item.id,
      },
    });
  };

  return (
    <>
      <div className="text-2xl font-bold mb-8">회원님이 좋아요 한 채널</div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => <GridViewItem isLoading={true} key={index} />)
        ) : (
          <>
            {likedChannel.slice(0, 3).map((item) => (
              <GridViewItem
                key={item.id}
                title={item.title}
                subTitle={item.subtitle}
                img={item.img_url}
                onClick={() => handleNavigate(item)}
              />
            ))}
            <GridViewItem
              title="더보기"
              img="/더보기.png"
              onClick={() =>
                navigate('/liked-channels', {
                  state: { ...location.state, title: '회원님이 좋아요한 채널' },
                })
              }
            />
          </>
        )}
      </div>
    </>
  );
}

export default LikedChannel;
