import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useIsEnglish } from '../hooks/useIsEnglish';

type VersionContext = {
  isLiveVersion: boolean;
  toggleLiveVersion: () => void;
  isRadioVersion: boolean;
  toggleRadioVersion: () => void;
  isAIVoiceSearchVersion: boolean;
  toggleAIVoiceSearchVersion: () => void;
};

const VersionContext = createContext<VersionContext | undefined>(undefined);

export const VersionProvider = ({ children }: { children: ReactNode }) => {
  const [isLiveVersion, setIsLiveVersion] = useState(true);
  const [isRadioVersion, setIsRadioVersion] = useState(true);
  const [isAIVoiceSearchVersion, setIsAIVoiceSearchVersion] = useState(true);
  const { isEnglish } = useIsEnglish();

  useEffect(() => {
    setIsRadioVersion(!isEnglish);
  }, [isEnglish]);

  const toggleLiveVersion = () => setIsLiveVersion((prev) => !prev);
  const toggleRadioVersion = () => setIsRadioVersion((prev) => !prev);
  const toggleAIVoiceSearchVersion = () => setIsAIVoiceSearchVersion((prev) => !prev);

  const value = {
    isLiveVersion,
    toggleLiveVersion,
    isRadioVersion,
    toggleRadioVersion,
    isAIVoiceSearchVersion,
    toggleAIVoiceSearchVersion,
  };

  return <VersionContext.Provider value={value}>{children}</VersionContext.Provider>;
};

export const useVersion = () => {
  const context = useContext(VersionContext);
  if (context === undefined) {
    throw new Error('useVersion must be used within a VersionProvider');
  }
  return context;
};
