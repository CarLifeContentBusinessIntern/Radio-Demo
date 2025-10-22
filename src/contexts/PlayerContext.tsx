import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Episode } from '../types/episode';
import { timeStringToSeconds } from '../utils/timeUtils';

interface PlayerState {
  currentEpisodeId: number | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  hasBeenActivated: boolean;
  isLive: boolean;
  isPlaylsitOpen: boolean;
}

interface PlayerContextType extends PlayerState {
  currentEpisodeData: Episode | undefined;
  currentAudioUrl: string | null;
  togglePlayPause: () => void;
  togglePlaylist: () => void;
  playEpisode: (id: number, liveStatus?: boolean) => void;
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
  isLive: false,
  isPlaylsitOpen: false,
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
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
    if (typeof episode.total_time === 'string') {
      return timeStringToSeconds(episode.total_time);
    } else if (typeof episode.total_time === 'number') {
      return episode.total_time;
    }
    return 2712;
  };

  const currentAudioUrl = currentEpisodeData?.audio_file || null;

  useEffect(() => {
    audioRef.current = new Audio();

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setState((prev) => ({ ...prev, currentTime: audio.currentTime }));
    };

    const handleLoadedMetadata = () => {
      setState((prev) => ({ ...prev, duration: audio.duration }));
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.src = '';
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (currentAudioUrl) {
        if (audioRef.current.src !== currentAudioUrl) {
          audioRef.current.src = currentAudioUrl;
        }

        if (state.isPlaying) {
          audioRef.current.play().catch((e) => {
            console.error('Audio play failed', e);
            setState((prev) => ({ ...prev, isPlaying: false }));
          });
        } else {
          audioRef.current.pause();
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentAudioUrl, state.isPlaying]);

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
    (id: number, liveStatus = false) => {
      const episode = episodes.find((item) => item.id === id);

      if (episode?.audio_file === null) return;

      if (episode) {
        const newDuration = getEpisodeDuration(episode);

        setState((prevState) => ({
          ...prevState,
          currentEpisodeId: id,
          isPlaying: true,
          currentTime: 0,
          duration: newDuration,
          hasBeenActivated: true,
          isLive: liveStatus,
          isPlaylsitOpen: false,
        }));
      }
    },
    [episodes]
  );

  const togglePlayPause = useCallback(() => {
    if (state.currentEpisodeId === null) return;
    setState((prevState) => ({ ...prevState, isPlaying: !prevState.isPlaying }));
  }, [state.currentEpisodeId]);

  const togglePlaylist = useCallback(() => {
    setState((prevState) => ({ ...prevState, isPlaylsitOpen: !prevState.isPlaylsitOpen }));
  }, []);

  const handleSeek = useCallback(
    (time: number) => {
      if (audioRef.current) {
        const newTime = Math.max(0, Math.min(state.duration, time));
        audioRef.current.currentTime = newTime;
        setState((prevState) => ({ ...prevState, currentTime: newTime }));
      }
    },
    [state.duration]
  );

  const handleSkip = useCallback(
    (seconds: number) => {
      if (audioRef.current) {
        const newTime = Math.max(0, Math.min(state.duration, state.currentTime + seconds));
        audioRef.current.currentTime = newTime;
        setState((prevState) => ({ ...prevState, currentTime: newTime }));
      }
    },
    [state.currentTime, state.duration]
  );

  const formatTime = useCallback((seconds: number) => {
    if (isNaN(seconds)) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const contextValue: PlayerContextType = {
    ...state,
    currentEpisodeData,
    currentAudioUrl,
    togglePlayPause,
    togglePlaylist,
    playEpisode,
    handleSeek,
    handleSkip,
    formatTime,
  };

  return <PlayerContext.Provider value={contextValue}>{children}</PlayerContext.Provider>;
};
