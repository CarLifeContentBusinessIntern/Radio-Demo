import type { ProgramType } from './program';

export type ThemeType = {
  id: number;
  title: string;
  img_url: string;
  subtitle: string;
  order: number;
  section_id: number;
  created_at: string;
};

export type ThemeProgramType = {
  id: number;
  order: number;
  created_at: string;
  themes: ThemeType;
  programs: ProgramType;
  theme_id: number;
  program_id: number;
};
