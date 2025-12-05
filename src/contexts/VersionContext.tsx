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

const RADIO_LIVE_VER = 'radio_live_version';
const RADIO_VER = 'radio_version';
const AI_VOICE_VER = 'ai_voice_version';

export const VersionProvider = ({ children }: { children: ReactNode }) => {
  const { isEnglish } = useIsEnglish();

  const [isLiveVersion, setIsLiveVersion] = useState(() => {
    try {
      const savedLiveVersion = localStorage.getItem(RADIO_LIVE_VER);
      // localStorage에 값이 없으면(첫 방문) true를, 있으면 저장된 값을 사용
      return savedLiveVersion === null ? true : savedLiveVersion === 'true';
    } catch (error) {
      console.error('Failed to access localStorage:', error);
      return true; // 에러 발생 시 기존 기본값인 true로 복구
    }
  });

  const [isRadioVersion, setIsRadioVersion] = useState(() => {
    const savedRadioVersion = localStorage.getItem(RADIO_VER);
    return savedRadioVersion === 'true';
  });

  const [isAIVoiceSearchVersion, setIsAIVoiceSearchVersion] = useState(() => {
    const savedAIVoiceVersion = localStorage.getItem(AI_VOICE_VER);
    return savedAIVoiceVersion === 'true';
  });

  useEffect(() => {
    localStorage.setItem(RADIO_LIVE_VER, String(isLiveVersion));
  }, [isLiveVersion]);

  useEffect(() => {
    localStorage.setItem(RADIO_VER, String(isRadioVersion));
  }, [isRadioVersion]);

  useEffect(() => {
    localStorage.setItem(AI_VOICE_VER, String(isAIVoiceSearchVersion));
  }, [isAIVoiceSearchVersion]);

  // 영어로 전환되면 라디오 버전 강제로 off
  useEffect(() => {
    if (isEnglish) {
      setIsRadioVersion(false);
    }
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
