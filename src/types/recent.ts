import type { EpisodeType } from './episode';

export type RecentSeriesProgramType = {
  id: number;
  title: string;
  subtitle: string;
  img_url?: string;
  episode?: EpisodeType;
};
