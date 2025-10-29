import type { PicklePodcastsType } from './picklePodcast';

export type CategoryType = {
  id: number;
  title: string;
  order: string;
  img_url: string;
  pickle_podcasts: PicklePodcastsType[];
};
