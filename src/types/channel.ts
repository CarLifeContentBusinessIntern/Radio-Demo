export type ChannelType = {
  id: number;
  title: string;
  channel: string;
  frequency: string;
  img_url: string;
  order: number;
  programs: { count: number }[];
};
