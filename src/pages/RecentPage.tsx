import { useQuery } from '@tanstack/react-query';
import ListViewItem from '../components/ListViewItem';
import { supabase } from '../lib/supabaseClient';
import type { EpisodeType } from '../types/episode';

function RecentPage() {
  const { data: recentEpisodes = [], isLoading } = useQuery<EpisodeType[]>({
    queryKey: ['recentEpisodes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('episodes')
        .select('*,  programs(*, broadcastings(*))')
        .not('listened_at', 'is', null)
        .order('listened_at', { ascending: false })
        .limit(10);

      if (error) {
        console.log('❌ 최근 청취 조회 실패 :', error);
        throw error;
      }

      return data;
    },
    refetchOnWindowFocus: true,
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-y-1">
        {Array.from({ length: 8 }).map((_, index) => (
          <ListViewItem isLoading={true} key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-9 pr-11 pt-7">
      <p className="text-lg">큐레이션/채널</p>
      {/* <GridViewItem /> */}

      <div className="flex flex-col gap-4">
        <p className="text-lg">에피소드</p>
        <div className="flex flex-col gap-y-1">
          {recentEpisodes?.map((item) => {
            const subTitleText = item.programs?.title;
            const imgUrl = item.img_url ?? item.programs?.img_url;

            return (
              <ListViewItem
                key={item.id}
                id={item.id}
                imgUrl={imgUrl}
                title={item.title}
                subTitle={subTitleText}
                totalTime={item.duration}
                date={item.date}
                hasAudio={!!item.audio_file}
                playlist={recentEpisodes}
                isRound={true}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default RecentPage;
