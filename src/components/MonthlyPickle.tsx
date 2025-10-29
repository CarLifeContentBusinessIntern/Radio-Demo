import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import type { PickleThemeType } from '../types/theme';
import CircleViewItem from './CircleViewItem';

interface MonthlyPickleInterface {
  id: number;
  series_name: string;
  img_src: string;
  subtitle: string;
  pickle_themes: PickleThemeType;
  order: number;
}

function MonthlyPickle() {
  const navigate = useNavigate();
  const [themes, setThemes] = useState<MonthlyPickleInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchMonthlyData() {
    const { data, error } = await supabase
      .from('pickle_series')
      .select('*, pickle_themes(*)')
      .eq('theme_id', 2)
      .order('order', { ascending: true });

    if (error) {
      console.log('❌ MonthlyPickle 데이터 조회 실패 : ', error);
    } else {
      setThemes(data);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchMonthlyData();
  }, []);

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
                  navigate(`/episodes/series/${item.id}`, {
                    state: { isPickle: true, isRound: false },
                  });
                }}
              />
            ))}
      </div>
    </>
  );
}

export default MonthlyPickle;
