export interface PreferenceState {
  age: string;
  genres: string[];
  purpose: string[];
  contentLength: string[];
  contentType: string[];
  mood: string[];
  time: string[];
  environment: string[];
  companion: string[];
  diversity: number;
}

export interface PreferenceOption {
  label: string;
  value: string;
}

export type Translation = {
  ko: string;
  en: string;
};

type Option = {
  label: Translation;
  value: string;
};

export interface PreferenceQuestion {
  id: keyof PreferenceState;
  question: Translation;
  type: 'single' | 'multiple' | 'slider';
  options?: Option[];
  min?: number;
  max?: number;
  step?: number;
}
