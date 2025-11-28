import { usePlayer } from '../contexts/PlayerContext';
import type { EpisodeType } from '../types/episode';
import { timeStringToSeconds } from '../utils/timeUtils';

interface CircularProgressBarProps {
  size: number; // px
  episode: EpisodeType;
}

function CircularProgressBar({ size, episode }: CircularProgressBarProps) {
  const strokeWidth = size * 0.028;
  const radius = (size - strokeWidth) / 2;
  // 원 둘레
  const circumference = 2 * Math.PI * radius;

  const { playedDurations, currentEpisodeId, currentTime } = usePlayer();

  const isCurrentEpisode = currentEpisodeId === episode.id;
  const playedColor = isCurrentEpisode ? '#B76EEF' : '#FFFFFFBF';

  const playTime = isCurrentEpisode
    ? currentTime
    : (playedDurations[episode.id] ?? episode.listened_duration ?? 0);

  const totalTimeSeconds = timeStringToSeconds(episode.duration);

  const progress = (Number(playTime) / totalTimeSeconds) * 100;

  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      {/* 배경 원 */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#FFFFFF40"
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* 시청 진행률 */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={playedColor}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.3s ease' }}
      />
    </svg>
  );
}

export default CircularProgressBar;
