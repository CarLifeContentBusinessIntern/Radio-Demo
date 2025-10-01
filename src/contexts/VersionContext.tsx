import { createContext, useContext, useState, type ReactNode } from 'react';

type VersionContext = {
  isLiveVersion: boolean;
  toggleVersion: () => void;
};

const VersionContext = createContext<VersionContext | undefined>(undefined);

export const VersionProvider = ({ children }: { children: ReactNode }) => {
  const [isLiveVersion, setIsLiveVersion] = useState(true);

  const toggleVersion = () => setIsLiveVersion((prev) => !prev);

  const value = { isLiveVersion, toggleVersion };

  return <VersionContext.Provider value={value}>{children}</VersionContext.Provider>;
};

export const useVersion = () => {
  const context = useContext(VersionContext);
  if (context === undefined) {
    throw new Error('useVersion must be used within a VersionProvider');
  }
  return context;
};
