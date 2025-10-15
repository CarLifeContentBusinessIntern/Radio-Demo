import type { ChannelType } from './channel';

export type RadioType = {
  id: number;
  title?: string;
  time_slot?: string;
  img_url?: string;
  category_id?: number;
  channel_id?: number;
  is_live?: boolean;
  live_no?: number;
  live_episode_id?: number;
  channels?: ChannelType;
};
