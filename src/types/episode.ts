import type { Radio } from './radio';

export interface Episode {
  id: number;
  imgUrl?: string;
  title: string;
  channel: string;
  playTime?: string;
  totalTime: string;
  radios: Radio;
}
