import type { ProgramType } from './program';

export type CategoryType = {
  id: number;
  title: string;
  order: string;
  img_url: string;
  type: 'radio' | 'podcast';
  programs: ProgramType[];
};
