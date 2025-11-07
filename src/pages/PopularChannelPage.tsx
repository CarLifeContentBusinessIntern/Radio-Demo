import { useEffect, useState } from 'react';
import type { ProgramType } from '../types/program';
import { useVersion } from '../contexts/VersionContext';
import { supabase } from '../lib/supabaseClient';
import GridViewItem from '../components/GridViewItem';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { ThemeType } from '../types/theme';

interface PopularRadioInterface {
  programs: ProgramType;
  themes: ThemeType;
}

function PopularChannelPage() {
  const [popularPrograms, setPopularPrograms] = useState<PopularRadioInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isRadioVersion } = useVersion();
  const navigate = useNavigate();

  // 프로그램 조회
  useEffect(() => {
    const fetchPrograms = async () => {
      let query = supabase
        .from('themes_programs')
        .select(
          '*,programs!inner(*, broadcastings(*), episodes(*, programs(*, broadcastings(*)))),themes!inner(*)'
        )
        .eq('theme_id', 8)
        .order('order', { ascending: true })
        .order('title', { referencedTable: 'programs.episodes', ascending: false });

      if (!isRadioVersion) {
        query = query.eq('programs.type', 'podcast');
      }

      const { data, error } = await query;
      if (error) {
        console.error('Supabase 연결 실패:', error);
      } else {
        setPopularPrograms(data);
      }
      setIsLoading(false);
    };

    fetchPrograms();
  }, [isRadioVersion]);

  return (
    <div className="pr-28 pt-3">
      <div className="grid gap-x-4 gap-y-7 mb-16 px-1 grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <GridViewItem isLoading={true} key={index} />
            ))
          : popularPrograms.map((item) => (
              <GridViewItem
                key={item.programs.id}
                isLoading={false}
                title={item.programs.title}
                subTitle={`${item.programs.type === 'podcast' ? item.programs.subtitle : `${item.programs.broadcastings?.title} ${item.programs.broadcastings?.channel}`}`}
                img={item.programs.img_url}
                isRounded={true}
                onClick={() => {
                  const firstEpisodeId = item.programs.episodes?.[0]?.id;
                  if (
                    firstEpisodeId !== undefined &&
                    item.programs.episodes?.[0]?.audio_file !== null
                  ) {
                    navigate(`/player/${firstEpisodeId}`, {
                      state: { isLive: false, playlist: item.programs.episodes },
                    });
                  } else {
                    toast.error(`콘텐츠 준비 중입니다`, { toastId: item.programs.id });
                  }
                }}
              />
            ))}
      </div>
    </div>
  );
}

export default PopularChannelPage;
