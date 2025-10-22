import type { RadioType } from './radio';

export type ChannelType = {
  id: number;
  broadcasting: string;
  channel: string;
  frequency: string;
  img_url: string;
  order: number;
  radios: RadioType[];
};
