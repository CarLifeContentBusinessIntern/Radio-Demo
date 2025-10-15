import { useNavigate } from 'react-router-dom';
import CircleViewItem from '../components/CircleViewItem';
import GridViewItem from '../components/GridViewItem';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { ChannelType } from '../types/channel';
import type { RadioType } from '../types/radio';
import type { ThemeType } from '../types/theme';
import type { CategoryType } from '../types/category';
import Category from '../components/Category';

interface PouplarRadioInterface {
  radios: RadioType;
  themes: ThemeType;
}

function RadioNoLiveVersion() {
  const [channels, setChannels] = useState<ChannelType[]>([]);
  const [popularRadios, setPopularRadios] = useState<PouplarRadioInterface[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);

  //채널 조회
  async function fetchChannels() {
    const { data, error } = await supabase
      .from('channels')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Supabase 연결 실패:', error);
    } else {
      console.log('Supabase 연결 성공, 데이터 예시:', data);
      setChannels(data);
    }
  }

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
      console.log('Supabase 연결 성공, 데이터 예시:', data);
      setPopularRadios(data);
    }
  }

  async function fetchCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('id', { ascending: true });
    if (error) {
      console.error('Supabase 연결 실패:', error);
    } else {
      console.log('Supabase 연결 성공, 데이터 예시:', data);
      setCategories(data);
    }
  }

  useEffect(() => {
    fetchChannels();
    fetchPopularRadios();
    fetchCategories();
  }, []);

  const navigate = useNavigate();
  return (
    <div className="pr-28 pt-7">
      <div className="text-2xl mb-7 font-semibold">방송사별 라디오</div>
      <div className="grid gap-x-4 gap-y-7 mb-16 px-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {channels.map((item) => (
          <CircleViewItem
            key={item.id}
            title={`${item.broadcasting} ${item.channel}`}
            subTitle={item.frequency}
            img={item.img_url}
            onClick={() => navigate(`/curation/${item.id}`)}
          />
        ))}
      </div>
      <div className="text-2xl mb-7 font-semibold">인기 채널</div>
      <div className="grid gap-x-4 gap-y-7 mb-16 px-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {popularRadios.map((item) => (
          <GridViewItem
            key={item.radios.id}
            title={item.radios.title}
            subTitle={`${item.radios.channels?.broadcasting} ${item.radios.channels?.channel}`}
            img={item.radios.img_url}
            onClick={() => navigate(`/channels/detail/${item.radios.id}`)}
          />
        ))}
      </div>

      {/* 카테고리 */}
      <Category categories={categories} />

      {/* 시간별 몰아보기 */}
    </div>
  );
}

export default RadioNoLiveVersion;
