import type { Radio } from './radio';

export interface Episode {
  id: number;
  imgUrl?: string;
  title: string;
  playTime?: string;
  totalTime: string;
  radios: Radio;
}
