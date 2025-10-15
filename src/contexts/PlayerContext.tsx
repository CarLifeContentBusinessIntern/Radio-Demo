import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Episode } from '../types/episode';
import { timeStringToSeconds } from '../utils/timeUtils';

interface PlayerState {
  currentEpisodeId: number | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  hasBeenActivated: boolean;
}

interface PlayerContextType extends PlayerState {
  currentEpisodeData: Episode | undefined;
  togglePlayPause: () => void;
  playEpisode: (id: number) => void;
  handleSeek: (time: number) => void;
  handleSkip: (seconds: number) => void;
  formatTime: (seconds: number) => string;
}

const initialPlayerStae: PlayerState = {
  currentEpisodeId: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  hasBeenActivated: false,
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<PlayerState>(initialPlayerStae);
  const [episodes, setEpisodes] = useState<Episode[]>([]);

  useEffect(() => {
    async function fetchEpisodes() {
      const { data, error } = await supabase
        .from('episodes')
        .select('*, radios!episodes_radio_id_fkey(*, channels(*))');

      if (error) {
        console.log('❌ Error fetching episodes data:', error.message);
      } else if (data) {
        setEpisodes(data);
      }
    }

    fetchEpisodes();
  }, []);

  const DEFAULT_EPISODE_ID = 1;
  const currentEpisodeData =
    state.currentEpisodeId !== null
      ? episodes.find((item) => item.id === state.currentEpisodeId)
      : episodes.find((item) => item.id === DEFAULT_EPISODE_ID);

  const getEpisodeDuration = (episode: Episode): number => {
    if (typeof episode.totalTime === 'string') {
      return timeStringToSeconds(episode.totalTime);
    } else if (typeof episode.totalTime === 'number') {
      return episode.totalTime;
    }
    return 2712;
  };

  useEffect(() => {
    if (state.currentEpisodeId === null && episodes.length > 0) {
      const episode = currentEpisodeData as Episode;

      if (episode) {
        const newDuration = getEpisodeDuration(episode);

        setState((prevState) => ({
          ...prevState,
          currentEpisodeId: DEFAULT_EPISODE_ID,
          duration: newDuration,
        }));
      }
    }
  }, [state.currentEpisodeId, currentEpisodeData, episodes]);

  const playEpisode = useCallback(
    (id: number) => {
      const episode = episodes.find((item) => item.id === id);

      if (episode) {
        const newDuration = getEpisodeDuration(episode);

        setState((prevState) => ({
          ...prevState,
          currentEpisodeId: id,
          isPlaying: true,
          currentTime: 0,
          duration: newDuration,
          hasBeenActivated: true,
        }));
      }
    },
    [episodes]
  );

  const togglePlayPause = useCallback(() => {
    if (state.currentEpisodeId === null) return;
    setState((prevState) => ({ ...prevState, isPlaying: !prevState.isPlaying }));
  }, [state.currentEpisodeId]);

  const handleSeek = useCallback((time: number) => {
    setState((prevState) => ({
      ...prevState,
      currentTime: Math.max(0, Math.min(prevState.duration, time)),
    }));
  }, []);

  const handleSkip = useCallback((seconds: number) => {
    setState((prevState) => ({
      ...prevState,
      currentTime: Math.max(0, Math.min(prevState.duration, prevState.currentTime + seconds)),
    }));
  }, []);

  const formatTime = useCallback((seconds: number) => {
    if (isNaN(seconds)) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    if (!state.isPlaying || state.currentEpisodeId === null) return;

    const intervalId = setInterval(() => {
      setState((prevState) => {
        if (prevState.currentTime >= prevState.duration) {
          return {
            ...prevState,
            isPlaying: false,
            currentTime: prevState.duration,
          };
        }
        return {
          ...prevState,
          currentTime: prevState.currentTime + 1,
        };
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [state.isPlaying, state.duration, state.currentEpisodeId]);

  const contextValue: PlayerContextType = {
    ...state,
    currentEpisodeData,
    togglePlayPause,
    playEpisode,
    handleSeek,
    handleSkip,
    formatTime,
  };

  return <PlayerContext.Provider value={contextValue}>{children}</PlayerContext.Provider>;
};
