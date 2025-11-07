import { useEffect, useState } from 'react';
import GridViewItem from './GridViewItem';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'react-toastify';
import type { ProgramType } from '../types/program';
import type { EpisodeType } from '../types/episode';

function LiveRadio() {
  const navigate = useNavigate();
  const [liveData, setLiveData] = useState<ProgramType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [playlist, setPlaylist] = useState<EpisodeType[]>([]);

  useEffect(() => {
    async function fetchLiveData() {
      const { data: liveRadioData, error: liveError } = await supabase
        .from('programs')
        .select('*, broadcastings(*), episodes(*, programs(*, broadcastings(*)))')
        .eq('is_live', true)
        .order('order_live', { ascending: true });

      if (liveError) {
        console.log('❌ Error fetching live data:', liveError.message);
        setIsLoading(false);
        return;
      }

      setLiveData(liveRadioData);

      if (liveRadioData) {
        const episodesData = liveRadioData.reduce((acc, program) => {
          if (program.episodes && program.episodes.length > 0) {
            acc.push(program.episodes[0]);
          } else {
            acc.push({ audio_file: null, programs: program });
          }
          return acc;
        }, []);

        setPlaylist(episodesData);
      }

      setIsLoading(false);
    }

    fetchLiveData();
  }, []);

  const handleLiveClick = (id: number | undefined) => {
    if (!id || id === undefined) {
      toast.error(`콘텐츠 준비 중입니다`, { toastId: id });
      return;
    }
    navigate(`/player/${id}`, { state: { isLive: true, playlist: playlist } });
  };

  return (
    <>
      <div className="text-2xl mb-7 font-semibold">ON-AIR 🔴</div>
      <div className="grid gap-x-4 gap-y-7 mb-16 px-1 grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <GridViewItem isLoading={true} key={index} />
            ))
          : liveData.map((item, index) => (
              <GridViewItem
                key={`${item.id}-${index}`}
                title={item.title}
                subTitle={item.subtitle}
                img={item.img_url}
                onClick={() => handleLiveClick(item.episodes?.[0]?.id)}
              />
            ))}
        {/* <GridViewItem title="더보기" subTitle="더보기" /> */}
      </div>
    </>
  );
}

export default LiveRadio;
