import type { Episode } from './episode';

export type PicklePodcastsType = {
  id: number;
  title: string;
  subtitle: string;
  img_url: string;
  episodes: Episode[];
};
