import { createContext, useContext, useState, type ReactNode } from 'react';
import type { PreferenceState } from '../types/preference';
import { DEFAULT_PREFERENCE_STATE } from '../constants/preferenceQuestions';

interface PreferenceContextType {
  preferences: PreferenceState;
  updatePreference: <K extends keyof PreferenceState>(key: K, value: PreferenceState[K]) => void;
  toggleGenre: (genre: string) => void;
  resetPreferences: () => void;
}

const PreferenceContext = createContext<PreferenceContextType | undefined>(undefined);

export function PreferenceProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<PreferenceState>(DEFAULT_PREFERENCE_STATE);

  const updatePreference = <K extends keyof PreferenceState>(
    key: K,
    value: PreferenceState[K]
  ) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const toggleGenre = (genre: string) => {
    setPreferences((prev) => {
      const currentGenres = prev.genres;
      const isSelected = currentGenres.includes(genre);

      return {
        ...prev,
        genres: isSelected
          ? currentGenres.filter((g) => g !== genre)
          : [...currentGenres, genre],
      };
    });
  };

  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCE_STATE);
  };

  return (
    <PreferenceContext.Provider
      value={{ preferences, updatePreference, toggleGenre, resetPreferences }}
    >
      {children}
    </PreferenceContext.Provider>
  );
}

export function usePreference() {
  const context = useContext(PreferenceContext);
  if (!context) {
    throw new Error('usePreference must be used within PreferenceProvider');
  }
  return context;
}
