import type { PickleEpisode } from './episode';
import type { PickleThemeType } from './theme';

export interface PickleSeries {
  id: number;
  series_name: string;
  img_src: string;
  subtitle: string;
  pickle_themes: PickleThemeType;
  order: number;
  pickle_episodes?: PickleEpisode[];
}
