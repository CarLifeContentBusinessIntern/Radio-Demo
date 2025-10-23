import { useEffect, useState } from 'react';
import type { RadioType } from '../types/radio';
import type { ThemeType } from '../types/theme';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import GridViewItem from './GridViewItem';
import { toast } from 'react-toastify';

interface PopularRadioInterface {
  radios: RadioType;
  themes: ThemeType;
}

function PopularRadio() {
  const [popularRadios, setPopularRadios] = useState<PopularRadioInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchPopularRadios() {
    const { data, error } = await supabase
      .from('radio_themes')
      .select(
        `
      radios(*, channels(*), episodes(*)),
      themes!inner(*)
      `
      )
      .eq('theme_id', 1)
      .order('title', { referencedTable: 'radios.episodes', ascending: false });

    if (error) {
      console.error('Supabase 연결 실패:', error);
    } else {
      setPopularRadios(data as unknown as PopularRadioInterface[]);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchPopularRadios();
  }, []);

  const navigate = useNavigate();

  return (
    <>
      <div className="text-2xl mb-7 font-semibold">라디오 인기 채널</div>
      <div
        className="grid gap-x-4 gap-y-7 mb-16 px-1"
        style={{
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        }}
      >
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <GridViewItem isLoading={true} key={index} />
            ))
          : popularRadios.map((item) => (
              <GridViewItem
                key={item.radios.id}
                title={item.radios.title}
                subTitle={`${item.radios.channels?.broadcasting} ${item.radios.channels?.channel}`}
                img={item.radios.img_url}
                onClick={() => {
                  const firstEpisode = item.radios.episodes?.[0];

                  if (firstEpisode && firstEpisode.audio_file !== null) {
                    navigate(`/player/${firstEpisode.id}`, {
                      state: { playlist: item.radios },
                    });
                  } else {
                    toast.error(`콘텐츠 준비 중입니다`, { toastId: item.radios.id });
                  }
                }}
              />
            ))}
      </div>
    </>
  );
}

export default PopularRadio;
