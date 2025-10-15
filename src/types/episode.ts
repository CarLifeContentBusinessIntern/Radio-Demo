import type { RadioType } from './radio';

export interface Episode {
  id: number;
  imgUrl?: string;
  title: string;
  channel: string;
  playTime?: string;
  totalTime: string;
  radios: RadioType;
  date: string;
}
