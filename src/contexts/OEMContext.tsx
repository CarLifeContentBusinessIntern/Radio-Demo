import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

interface OEMContextType {
  selectedOEM: string;
  setSelectedOEM: (oem: string) => void;
}

const OEMContext = createContext<OEMContextType | undefined>(undefined);

const DEFAULT_OEM = 'hyundai';
const OEM_STORAGE_KEY = 'selected_oem';

export const useOEM = () => {
  const context = useContext(OEMContext);
  if (context === undefined) throw new Error('useOEM must be used inside OEMProvider');
  return context;
};

export const OEMProvider = ({ children }: { children: ReactNode }) => {
  const [selectedOEM, setSelectedOEM] = useState(() => {
    const savedOEM = localStorage.getItem(OEM_STORAGE_KEY);
    return savedOEM || DEFAULT_OEM;
  });

  useEffect(() => {
    localStorage.setItem(OEM_STORAGE_KEY, selectedOEM);
  }, [selectedOEM]);

  const contextValue = useMemo(() => ({ selectedOEM, setSelectedOEM }), [selectedOEM]);

  return <OEMContext.Provider value={contextValue}>{children}</OEMContext.Provider>;
};
