import type { EpisodeType } from './episode';

export type RecentSeriesProgramType = {
  id: number;
  title: string;
  subtitle: string;
  type: 'program' | 'series';
  img_url?: string;
  episode?: EpisodeType;
};
