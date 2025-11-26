import { usePlayer } from '../contexts/PlayerContext';
import type { EpisodeType } from '../types/episode';
import { timeStringToSeconds } from '../utils/timeUtils';

interface CircularProgressBarProps {
  size: number; // px
  episode: EpisodeType;
}
// bg-[#B76EEF]' : 'bg-[#888888]
function CircularProgressBar({ size, episode }: CircularProgressBarProps) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const { playedDurations } = usePlayer();

  //   const progress = 0; // 나중에 episode로 계산 가능
  const playTime = playedDurations[episode.id]
    ? playedDurations[episode.id]
    : episode.listened_duration
      ? episode.listened_duration
      : 0;

  const totalTimeSeconds = timeStringToSeconds(episode.duration);

  const progress = (Number(playTime) / totalTimeSeconds) * 100;

  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#444"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#B76EEF"
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
