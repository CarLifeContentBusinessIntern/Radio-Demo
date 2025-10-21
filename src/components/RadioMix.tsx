import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import type { ThemeType } from '../types/theme';
import CircleViewItem from './CircleViewItem';

function RadioMix() {
  const navigate = useNavigate();
  const [radioMix, setRadioMix] = useState<ThemeType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRadioMix() {
      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .eq('section', '라디오 믹스')
        .order('id', { ascending: true });

      if (error) {
        console.log('❌ Error fetching radio mix data:', error.message);
        setIsLoading(false);

        return;
      }
      if (!data) {
        setIsLoading(false);
        return;
      }
      setRadioMix(data);
      setIsLoading(false);
    }

    fetchRadioMix();
  });

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
          : radioMix.map((item) => (
              <CircleViewItem
                key={item.id}
                title={item.title}
                img={item.img_url}
                onClick={() => {
                  if (item.episode_ids)
                    navigate(`/player/${item.episode_ids[0]}`, { state: { isLive: false } });
                }}
              />
            ))}
      </div>
    </div>
  );
}

export default RadioMix;
