import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { type ThemeType } from '../types/theme';
import CircleViewItem from './CircleViewItem';
import { toast } from 'react-toastify';

function RadioMix() {
  const navigate = useNavigate();
  const [radioMixTheme, setRadioMixTheme] = useState<ThemeType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRadioMixTheme() {
      const { data: mixThemeData, error: mixThemeError } = await supabase
        .from('themes')
        .select('*, radio_themes(*, radios(*, channels(*), episodes(*)))')
        .eq('section', '라디오 믹스')
        .order('id', { ascending: true });

      if (mixThemeError) {
        console.log('❌ Error fetching radio mix data:', mixThemeError.message);
        setIsLoading(false);

        return;
      }
      if (!mixThemeData) {
        setIsLoading(false);
        return;
      }
      setRadioMixTheme(mixThemeData);
      setIsLoading(false);
    }
    fetchRadioMixTheme();
  }, []);

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
          : radioMixTheme.map((item) => (
              <CircleViewItem
                key={item.id}
                title={item.title}
                img={item.img_url}
                onClick={() => {
                  if (item.episode_ids) {
                    navigate(`/player/${item.episode_ids[0]}`, {
                      state: { isLive: false, playlist: item, mixType: 'themeMix' },
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
