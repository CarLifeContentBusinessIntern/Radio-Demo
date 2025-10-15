import type { Category } from './category';
import type { Channel } from './channel';

export interface Radio {
  id: number;
  title: string;
  time_slot: string;
  img_url: string;
  categories: Category;
  channels: Channel;
  is_live: boolean;
}

export interface LiveRadio {
  id: number;
  title: string;
  is_live: boolean;
  channel_id: number;
  channels: Channel;
  img_url: string;
  live_episode_id: number;
}
