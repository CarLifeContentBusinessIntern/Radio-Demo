import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import type { PickleThemeType } from '../types/theme';
import GridViewItem from './GridViewItem';

interface PicklePickInterface {
  id: number;
  series_name: string;
  img_src: string;
  subtitle: string;
  pickle_themes: PickleThemeType;
  order: number;
}

function PicklePick() {
  const navigate = useNavigate();
  const [themes, setThemes] = useState<PicklePickInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchPickData() {
    const { data, error } = await supabase
      .from('pickle_series')
      .select('*, pickle_themes(*)')
      .eq('theme_id', 1)
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
                title={item.series_name}
                subTitle={item.subtitle}
                img={item.img_src ?? ''}
                onClick={() => {
                  navigate(`/episodes/series/${item.id}`, {
                    state: { isPickle: true, isRound: false, title: item.series_name },
                  });
                }}
              />
            ))}
      </div>
    </>
  );
}

export default PicklePick;
