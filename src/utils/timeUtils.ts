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
