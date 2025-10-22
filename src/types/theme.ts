import type { RadioType } from './radio';

export type ThemeType = {
  id: number;
  title: string;
  img_url: string;
  section: string;
  episode_ids: number[];
  radio_themes?: RadioThemeType[];
};

export type RadioThemeType = {
  id: number;
  radio_id: number;
  theme_id: number;
  radios: RadioType[];
};

export type RadioMixType = {
  radios: RadioType;
  themes: ThemeType;
};
