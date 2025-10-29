import type { PodcastType } from './podcast';
import type { RadioType } from './radio';

export interface Episode {
  id: number;
  imgUrl?: string;
  src?: string;
  title: string;
  play_time?: string;
  total_time?: string;
  radios?: RadioType;
  pickle_podcasts?: PodcastType;
  date?: string;
  uploadAt?: string;
  audio_file?: string;
}

export interface PickleEpisode {
  id: number;
  title: string;
  src: string;
  audio_file: string;
  category_id: number;
  creator: string;
  podcast_id: number;
  series_id: number;
  uploadAt: string;
  pickle_podcasts: PodcastType;
}
