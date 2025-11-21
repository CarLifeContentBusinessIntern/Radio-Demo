import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { ProgramType } from '../types/program';
import GridViewItem from '../components/GridViewItem';

function LikedChannelPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [likedChannel, setLikedChannel] = useState<ProgramType[]>([]);

  useEffect(() => {
    async function fetchLikedChannel() {
      setIsLoading(true);

      const { data, error } = await supabase.from('programs').select('*').eq('is_liked', true);

      if (error) {
        console.error('좋아요 채널 조회 실패:', error);
      } else if (data) {
        setLikedChannel(data);
      }

      setIsLoading(false);
    }

    fetchLikedChannel();
  }, []);

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
