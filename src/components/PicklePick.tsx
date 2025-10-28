import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import type { PickleSeriesType, PickleThemeType } from '../types/theme';
import GridViewItem from './GridViewItem';

interface PicklePickInterface {
  id: number;
  pickle_theme_id: number;
  pickle_series_id: number;
  pickle_themes: PickleThemeType;
  pickle_series: PickleSeriesType;
  order: number;
}

function PicklePick() {
  const navigate = useNavigate();
  const [themes, setThemes] = useState<PicklePickInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchPickData() {
    const { data, error } = await supabase
      .from('pickle_themes_series')
      .select('*, pickle_themes(*), pickle_series(*)')
      .eq('pickle_theme_id', 1)
      .order('order', { ascending: true });

    if (error) {
      console.log('❌ Pickle Pick 데이터 조회 실패 : ', error);
    } else {
      setThemes(data);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchPickData();
  }, []);

  return (
    <>
      <div className="text-2xl mb-7 font-semibold">P!ckle P!ck</div>

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
          : themes.map((item) => (
              <GridViewItem
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

export default PicklePick;
