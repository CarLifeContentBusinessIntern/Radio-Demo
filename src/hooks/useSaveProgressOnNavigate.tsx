import { useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { usePlayer } from '../contexts/PlayerContext';

export function useSaveProgressOnNavigate() {
  const location = useLocation();
  const prevPath = useRef(location.pathname);
  const { saveCurrentEpisodeProgress } = usePlayer();

  useEffect(() => {
    if (prevPath.current !== location.pathname) {
      // /player로 이동하기 전이면 저장
      if (location.pathname.startsWith('/player')) {
        saveCurrentEpisodeProgress();
      }
    }
    prevPath.current = location.pathname;
  }, [location.pathname, saveCurrentEpisodeProgress]);
}
