import type { RadioType } from './radio';

export interface Episode {
  id: number;
  imgUrl?: string;
  title: string;
  play_time?: string;
  total_time?: string;
  radios: RadioType;
  date?: string;
  audio_file?: string;
}

export interface PickleEpisode {
  id: number;
  title: string;
  src: string;
  host_ids: number[];
  is_like: boolean;
  channel_id: number;
  creator: string;
  likes: number;
  audio_file: string;
  script: string;
  tags: string;
  summary: string;
  summary_eleven: string;
  tags_eleven: string;
  script_eleven: string;
  audio_file_dubbing: string;
}
