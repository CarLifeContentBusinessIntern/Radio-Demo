import { createContext, useContext, useState, type ReactNode } from 'react';
import type { PreferenceState } from '../types/preference';

export const INIT_PREFERENCE_STATE = {
  age: '',
  genres: [],
  purpose: [],
  contentLength: [],
  contentType: [],
  mood: [],
  time: [],
  environment: [],
  companion: [],
  diversity: 50,
};

interface PreferenceContextType {
  preferences: PreferenceState;
  updatePreference: <K extends keyof PreferenceState>(key: K, value: PreferenceState[K]) => void;
  toggleGenre: (genre: string) => void;
  toggleMultipleChoice: (key: keyof PreferenceState, value: string) => void;
  resetPreferences: () => void;
  hasAnySelection: boolean;
}

const PreferenceContext = createContext<PreferenceContextType | undefined>(undefined);

// 선택 여부 체크 함수
function checkHasSelection(prefs: PreferenceState): boolean {
  return (
    prefs.age !== '' ||
    prefs.genres.length > 0 ||
    prefs.purpose.length > 0 ||
    prefs.contentLength.length > 0 ||
    prefs.contentType.length > 0 ||
    prefs.mood.length > 0 ||
    prefs.time.length > 0 ||
    prefs.environment.length > 0 ||
    prefs.companion.length > 0 ||
    prefs.diversity !== 50
  );
}

export function PreferenceProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<PreferenceState>(INIT_PREFERENCE_STATE);
  const [hasAnySelection, setHasAnySelection] = useState(checkHasSelection(INIT_PREFERENCE_STATE));

  const updatePreference = <K extends keyof PreferenceState>(key: K, value: PreferenceState[K]) => {
    setPreferences((prev) => {
      const updated = { ...prev, [key]: value };
      setHasAnySelection(checkHasSelection(updated));
      return updated;
    });
  };

  const toggleGenre = (genre: string) => {
    setPreferences((prev) => {
      const currentGenres = prev.genres;
      const isSelected = currentGenres.includes(genre);
      const updated = {
        ...prev,
        genres: isSelected ? currentGenres.filter((g) => g !== genre) : [...currentGenres, genre],
      };
      setHasAnySelection(checkHasSelection(updated));
      return updated;
    });
  };

  const toggleMultipleChoice = (key: keyof PreferenceState, value: string) => {
    setPreferences((prev) => {
      const currentValues = prev[key] as string[];
      const isSelected = currentValues.includes(value);
      const updated = {
        ...prev,
        [key]: isSelected ? currentValues.filter((v) => v !== value) : [...currentValues, value],
      };
      setHasAnySelection(checkHasSelection(updated));
      return updated;
    });
  };

  const resetPreferences = () => {
    setPreferences(INIT_PREFERENCE_STATE);
    setHasAnySelection(false);
  };

  return (
    <PreferenceContext.Provider
      value={{
        preferences,
        updatePreference,
        toggleGenre,
        toggleMultipleChoice,
        resetPreferences,
        hasAnySelection,
      }}
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
