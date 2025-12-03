import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ListViewItem from '../components/ListViewItem';
import { usePlayer } from '../contexts/PlayerContext';
import { useSeriesEpisodes } from '../hooks/useSeriesEpisodes';
import { supabase } from '../lib/supabaseClient';
import type { EpisodeType, SeriesEpisodesType } from '../types/episode';

function ListViewPage() {
  const location = useLocation();
  const { isRound } = location.state || { isRound: true };
  const originType = location.state?.originType;

  const { id, type } = useParams<{ id: string; type: 'series' | 'program' }>();
  const { setPlaylist, playedDurations } = usePlayer();

  const isSeries = type === 'series';

  // 프로그램용 쿼리
  const programsQuery = useQuery<EpisodeType[]>({
    queryKey: ['episode', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('episodes')
        .select('*, programs(*, broadcastings(*))')
        .eq('program_id', id);
      if (error) throw error;
      return data as EpisodeType[];
    },
  });

  // 시리즈용 쿼리
  const seriesEpisodesQuery = useSeriesEpisodes(id);

  // 공통 데이터 선택
  const { data: rawData = [], isLoading, error } = isSeries ? seriesEpisodesQuery : programsQuery;

  // episodes 배열 생성
  const episodes: EpisodeType[] = useMemo(() => {
    if (isSeries) {
      const seriesData = rawData as SeriesEpisodesType[];
      return seriesData.map((se) => se.episodes).filter((ep): ep is EpisodeType => !!ep);
    } else {
      return rawData as EpisodeType[];
    }
  }, [rawData, isSeries]);

  // 플레이리스트 설정
  const currentPlaylist: EpisodeType[] = useMemo(() => episodes, [episodes]);

  useEffect(() => {
    if (currentPlaylist.length > 0) setPlaylist(currentPlaylist);
  }, [currentPlaylist, setPlaylist]);

  if (error) return <div>에러: {String(error)}</div>;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-y-1">
        {Array.from({ length: 8 }).map((_, index) => (
          <ListViewItem isLoading={true} key={index} />
        ))}
      </div>
    );
  }

  if (episodes.length === 0) return <div>데이터가 없습니다</div>;

  return (
    <div className="flex flex-col gap-y-[6px] mr-20">
      {episodes.map((item) => {
        const broadcasting = item.programs?.broadcastings?.title ?? '';
        const channel = item.programs?.broadcastings?.channel ?? '';
        const subTitleText =
          item.type === 'podcast' ? (item.programs?.title ?? '') : `${broadcasting} ${channel}`;

        const episodeId = item.id;

        return (
          <ListViewItem
            key={episodeId}
            id={episodeId}
            imgUrl={item.img_url || item.programs?.img_url || ''}
            title={item.title}
            subTitle={subTitleText}
            totalTime={item.duration}
            date={item.date}
            hasAudio={!!item.audio_file}
            playlist={currentPlaylist}
            isRound={isRound ?? true}
            originType={originType}
            recentSeriesId={isSeries ? Number(id) : null}
            listenedDuration={playedDurations[episodeId] ?? item.listened_duration}
          />
        );
      })}
    </div>
  );
}

export default ListViewPage;
