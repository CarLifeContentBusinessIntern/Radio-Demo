import type { ProgramType } from './program';

export type CategoryType = {
  id: number;
  title: string;
  img_url: string;
  order: string;
  created_at: string;
  type: 'radio' | 'podcast';
  programs: ProgramType[];
};
