import { usePlayer } from '../contexts/PlayerContext';
import { useFetchRecentEpisodePlaylist } from '../hooks/useFetchRecentEpisodePlaylist';
import type { EpisodeType } from '../types/episode';
import ListViewItem from './ListViewItem';

function RecentEpisodeList({ item }: { item: EpisodeType }) {
  const { playedDurations } = usePlayer();

  const { data: playlist } = useFetchRecentEpisodePlaylist(
    item.origin_type,
    item.program_id,
    item.recent_series_id
  );

  const subTitleText = item.programs?.title;
  const imgUrl = item.img_url ?? item.programs?.img_url;

  return (
    <ListViewItem
      key={item.id}
      id={item.id}
      imgUrl={imgUrl}
      title={item.title}
      subTitle={subTitleText}
      date={item.date}
      hasAudio={!!item.audio_file}
      isRound={true}
      playlist={playlist}
      totalTime={item.duration}
      listenedDuration={playedDurations[item.id] ?? (Number(item.listened_duration) || 0)}
    />
  );
}

export default RecentEpisodeList;
