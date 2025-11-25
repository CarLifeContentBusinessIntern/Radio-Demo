export interface PreferenceState {
  age: string;
  genres: string[];
  purpose: string;
  contentLength: string;
  contentType: string;
  mood: string;
  time: string;
  companion: string;
  tone: string;
  diversity: number;
}

export interface PreferenceOption {
  label: string;
  value: string;
}

export interface PreferenceQuestion {
  id: keyof PreferenceState;
  question: string;
  type: 'single' | 'multiple' | 'slider';
  options?: PreferenceOption[];
  min?: number;
  max?: number;
  step?: number;
}
