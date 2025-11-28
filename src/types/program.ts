import type { BroadcastingType } from './broadcasting';
import type { EpisodeType } from './episode';

export type ProgramType = {
  id: number;
  title: string;
  img_url: string;
  is_live: boolean;
  created_at: string;
  broadcasting_id: number;
  subtitle: string;
  broadcastings?: BroadcastingType;
  type: 'podcast' | 'radio';
  episodes?: EpisodeType[];
  is_liked?: boolean;
  series_id?: number;
};
