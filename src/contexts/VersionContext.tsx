import { createContext, useContext, useState, type ReactNode } from 'react';

type VersionContext = {
  isLiveVersion: boolean;
  toggleLiveVersion: () => void;
  isRadioVersion: boolean;
  toggleRadioVersion: () => void;
};

const VersionContext = createContext<VersionContext | undefined>(undefined);

export const VersionProvider = ({ children }: { children: ReactNode }) => {
  const [isLiveVersion, setIsLiveVersion] = useState(false);
  const [isRadioVersion, setIsRadioVersion] = useState(false);

  const toggleLiveVersion = () => setIsLiveVersion((prev) => !prev);
  const toggleRadioVersion = () => setIsRadioVersion((prev) => !prev);

  const value = { isLiveVersion, toggleLiveVersion, isRadioVersion, toggleRadioVersion };

  return <VersionContext.Provider value={value}>{children}</VersionContext.Provider>;
};

export const useVersion = () => {
  const context = useContext(VersionContext);
  if (context === undefined) {
    throw new Error('useVersion must be used within a VersionProvider');
  }
  return context;
};
