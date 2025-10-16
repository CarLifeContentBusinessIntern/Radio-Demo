import type { RadioType } from './radio';

export interface Episode {
  id: number;
  imgUrl?: string;
  title: string;
  play_time?: string;
  total_time: string;
  radios: RadioType;
  date: string;
}
