import { useNavigate } from 'react-router-dom';
import GridViewItem from '../components/GridViewItem';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { RadioType } from '../types/radio';
import type { ThemeType } from '../types/theme';
import Category from '../components/Category';
import TimeSlot from '../components/TimeSlot';
import Broadcasts from '../components/Broadcasts';

interface PopularRadioInterface {
  radios: RadioType;
  themes: ThemeType;
}

function RadioNoLiveVersion() {
  const [popularRadios, setPopularRadios] = useState<PopularRadioInterface[]>([]);

  //인기 라디오 조회
  async function fetchPopularRadios() {
    const { data, error } = await supabase
      .from('radio_themes')
      .select(
        `
    radios(*, channels(*)),
    themes(*)
  `
      )
      .eq('themes.id', 1);

    if (error) {
      console.error('Supabase 연결 실패:', error);
    } else {
      setPopularRadios(data as unknown as PopularRadioInterface[]);
    }
  }

  useEffect(() => {
    fetchPopularRadios();
  }, []);

  const navigate = useNavigate();
  return (
    <div className="pr-28 pt-7">
      <Broadcasts />
      <div className="text-2xl mb-7 font-semibold">인기 채널</div>
      <div className="grid gap-x-4 gap-y-7 mb-16 px-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {popularRadios.map((item) => (
          <GridViewItem
            key={item.radios.id}
            title={item.radios.title}
            subTitle={`${item.radios.channels?.broadcasting} ${item.radios.channels?.channel}`}
            img={item.radios.img_url}
            onClick={() =>
              navigate(`/episodes/channel/${item.radios.id}`, {
                state: { title: item.radios.title },
              })
            }
          />
        ))}
      </div>

      {/* 카테고리 */}
      <Category />

      {/* 시간별 몰아보기 */}
      <TimeSlot />
    </div>
  );
}

export default RadioNoLiveVersion;
