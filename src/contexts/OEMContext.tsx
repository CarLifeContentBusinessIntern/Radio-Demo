import { createContext, useContext, useState, type ReactNode } from 'react';

interface OEMContextType {
  selectedOEM: string;
  setSelectedOEM: (oem: string) => void;
}

const OEMContext = createContext<OEMContextType | undefined>(undefined);

export const useOEM = () => {
  const context = useContext(OEMContext);
  if (context === undefined) throw new Error('useOEM must be used inside OEMProvider');
  return context;
};

export const OEMProvider = ({ children }: { children: ReactNode }) => {
  const [selectedOEM, setSelectedOEM] = useState('Hyundai');

  const contextValue: OEMContextType = { selectedOEM, setSelectedOEM };

  return <OEMContext.Provider value={contextValue}>{children}</OEMContext.Provider>;
};
