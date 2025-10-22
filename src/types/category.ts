import type { RadioType } from './radio';

export type CategoryType = {
  id: number;
  title: string;
  category: string;
  img_url: string;
  radios?: RadioType[];
};
