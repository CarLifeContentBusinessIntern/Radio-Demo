import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

const ZOOM_KEY = 'zoomLevel';

interface ZoomContextType {
  selectedZoom: number;
  setSelectedZoom: (zoom: number) => void;
}

const ZoomContext = createContext<ZoomContextType | undefined>(undefined);

export const useZoom = () => {
  const context = useContext(ZoomContext);
  if (context === undefined) throw new Error('useZoom must be used within ZoomProvider');
  return context;
};

export const ZoomProvider = ({ children }: { children: ReactNode }) => {
  const [selectedZoom, setSelectedZoomState] = useState<number>(() => {
    const saved = localStorage.getItem(ZOOM_KEY);
    return saved ? Number(saved) : 1;
  });

  const setSelectedZoom = (newZoom: number) => {
    setSelectedZoomState(newZoom);
    document.documentElement.style.zoom = String(newZoom);
    localStorage.setItem(ZOOM_KEY, String(newZoom));
    window.dispatchEvent(new Event('zoomChange'));
  };

  useEffect(() => {
    document.documentElement.style.zoom = String(selectedZoom);
  }, [selectedZoom]);

  return (
    <ZoomContext.Provider value={{ selectedZoom, setSelectedZoom }}>
      {children}
    </ZoomContext.Provider>
  );
};
