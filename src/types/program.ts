import type { BroadcastingType } from './broadcasting';

export type ProgramType = {
  id: number;
  title: string;
  img_url: string;
  is_live: boolean;
  created_at: string;
  broadcasting_id: number;
  subtitle: string;
  broadcastings?: BroadcastingType;
};
