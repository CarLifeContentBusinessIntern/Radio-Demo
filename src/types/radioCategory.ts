import type { RadioType } from './radio';

export type RadioCategoryType = {
  id: number;
  title: string;
  category: string;
  img_url: string;
  radios?: RadioType[];
};
