export type SectionType = {
  id: number;
  title: string;
  created_at: string;
};

export type SectionItemType = {
  id: number;
  title: string;
  type: 'series' | 'themes';
  order: number;
  subtitle: string;
  img_url: string;
  has_episodes: boolean;
  first_episode_id: number;
};
