import type { CategoryType } from './category';
import type { ChannelType } from './channel';
import type { Episode } from './episode';

export type RadioType = {
  id: number;
  title: string;
  time_slot: string;
  img_url: string;
  category_id: number;
  channel_id: number;
  live_no: number;
  live_episode_id: number;
  categories?: CategoryType;
  channels?: ChannelType;
  is_live: boolean;
  episodes?: Episode[];
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
