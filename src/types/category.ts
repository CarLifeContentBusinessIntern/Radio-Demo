import type { PodcastType } from './podcast';

export type CategoryType = {
  id: number;
  title: string;
  order: string;
  img_url: string;
  pickle_podcasts: PodcastType[];
};
