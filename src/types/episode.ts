import type { ProgramType } from './program';

export type EpisodeType = {
  id: number;
  title: string;
  img_url: string;
  audio_file: string;
  audioFile_dubbing?: string | null;
  date: string;
  duration: string;
  type: string;
  created_at: string;
  program_id: number;
  order_recent: number;
  programs?: ProgramType;
  origin_type?: 'program' | 'series' | null;
  listened_at?: string;
  listened_duration?: string;
  recent_series_id?: number;
  language: string | null;
};

export type SeriesEpisodesType = {
  id: number;
  series_id: number;
  episode_id: number;
  order: number;
  created_at: string;
  episodes?: EpisodeType;
};
