export function timeStringToSeconds(timeString: string): number {
  const parts = timeString.split(':').map((part) => parseInt(part, 10));

  if (parts.some(isNaN)) return 0;

  let totalSeconds = 0;
  const numParts = parts.length;

  if (numParts === 3) {
    const [hours, minute, seconds] = parts;
    totalSeconds = hours * 3600 + minute * 60 + seconds;
  } else if (numParts === 2) {
    const [minute, seconds] = parts;
    totalSeconds = minute * 60 + seconds;
  } else return 0;

  return totalSeconds;
}

export function formatTimeString(totalTime: string | undefined) {
  if (!totalTime || typeof totalTime !== 'string') {
    return '';
  }

  const parts = totalTime.split(':');

  if (parts.length === 2) {
    return `${parts[0]}분 ${parts[1]}초`;
  } else if (parts.length === 3) {
    return `${parts[0]}시간 ${parts[1]}분 ${parts[2]}초`;
  } else {
    console.warn('Unexpected time format:', totalTime);
    return totalTime;
  }
}
