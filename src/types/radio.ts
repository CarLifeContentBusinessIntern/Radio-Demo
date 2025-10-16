import type { CategoryType } from './category';
import type { ChannelType } from './channel';

export type RadioType = {
  id: number;
  title: string;
  time_slot: string | null;
  category_id: number | null;
  channel_id: number;
  live_no: number | null;
  live_episode_id: number | null;
  img_url: string;
  categories?: CategoryType;
  channels?: ChannelType;
  is_live: boolean;
};

export interface LiveRadio {
  id: number;
  title: string;
  is_live: boolean;
  channel_id: number;
  channels: ChannelType;
  img_url: string;
  live_episode_id: number;
}
