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

export type MixThemeType = {
  id: number;
  title: string;
  img_url: string;
  section: string;
  episode_ids: number[];
  radio_themes?: MixRadioThemeType[];
};

export type MixRadioThemeType = {
  id: number;
  radio_id: number;
  theme_id: number;
  radios: RadioType;
};

export type RadioMixType = {
  radios: RadioType;
  themes: ThemeType;
};

export type PickleThemeType = {
  id: number;
  theme_name: string;
};

export type PickleSeriesType = {
  id: number;
  series_name: string;
  img_src: string;
  subtitle: string;
};
