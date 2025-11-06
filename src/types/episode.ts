import type { ProgramType } from './program';

export type EpisodeType = {
  id: number;
  title: string;
  img_url: string;
  audio_file: string;
  date: string;
  duration: string;
  type: string;
  created_at: string;
  program_id: number;
  order_recent: number;
  programs?: ProgramType;
};

export type SeriesEpisodesType = {
  id: number;
  series_id: number;
  episode_id: number;
  order: number;
  created_at: string;
  episodes?: EpisodeType;
};
