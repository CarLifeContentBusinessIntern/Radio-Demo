import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import CircleViewItem from './CircleViewItem';
import type { PickleSeriesType, PickleThemeType } from '../types/theme';

interface MonthlyPickleInterface {
  id: number;
  pickle_theme_id: number;
  pickle_series_id: number;
  pickle_themes: PickleThemeType;
  pickle_series: PickleSeriesType;
  order: number;
}

function MonthlyPickle() {
  const navigate = useNavigate();
  const [themes, setThemes] = useState<MonthlyPickleInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchMonthlyData() {
    const { data, error } = await supabase
      .from('pickle_themes_series')
      .select('*, pickle_themes(*), pickle_series(*)')
      .eq('pickle_theme_id', 2)
      .order('order', { ascending: true });

    if (error) {
      console.log('❌ MonthlyPickle 데이터 조회 실패 : ', error);
    } else {
      setThemes(data);
    }
    console.log('data', data);
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
                title={item.pickle_series.series_name}
                subTitle={item.pickle_series.tags.join(' ')}
                img={item.pickle_series.img_src ?? ''}
                onClick={() => {
                  navigate(`/episodes/series/${item.pickle_series.id}`, {
                    state: { isPickle: true },
                  });
                }}
              />
            ))}
      </div>
    </>
  );
}

export default MonthlyPickle;
