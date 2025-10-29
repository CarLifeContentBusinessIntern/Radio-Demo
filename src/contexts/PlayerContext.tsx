import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Episode, PickleEpisode } from '../types/episode';
import { timeStringToSeconds } from '../utils/timeUtils';

interface PlayerState {
  currentEpisodeId: number | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  hasBeenActivated: boolean;
  isLive: boolean;
  isPlaylsitOpen: boolean;
  currentEpisodeType: 'radio' | 'podcast' | null;
}

interface PlayerContextType extends PlayerState {
  currentEpisodeData: Episode | undefined;
  currentAudioUrl: string | null;
  togglePlayPause: () => void;
  togglePlaylist: () => void;
  playEpisode: (id: number, liveStatus?: boolean, isPickle?: boolean) => void;
  handleSeek: (time: number) => void;
  handleSkip: (seconds: number) => void;
  formatTime: (seconds: number) => string;
  setPlaylist: (playlist: Episode[]) => void;
  handlePlayNext: () => void;
  handlePlayPrev: () => void;
  activePlaylist: Episode[];
}

const initialPlayerStae: PlayerState = {
  currentEpisodeId: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  hasBeenActivated: false,
  isLive: false,
  isPlaylsitOpen: false,
  currentEpisodeType: 'radio',
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
  const [pickleEpisodes, setPickleEpisodes] = useState<PickleEpisode[]>([]);
  const [activePlaylist, setActivePlaylist] = useState<Episode[]>([]);
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

    async function fetchPickleEpisodes() {
      const { data, error } = await supabase
        .from('pickle_episodes')
        .select('*, pickle_podcasts(*)');
      if (error) {
        console.log('❌ Error fetching episodes data:', error.message);
      } else if (data) {
        setPickleEpisodes(data);
      }
    }
    fetchPickleEpisodes();
  }, []);

  const DEFAULT_EPISODE_ID = 1;
  // const currentEpisodeData =
  //   state.currentEpisodeId !== null && state.currentEpisodeType === 'podcast'
  //     ? pickleEpisodes.find((item) => item.id === state.currentEpisodeId)
  //     : episodes.find((item) => item.id === state.currentEpisodeId);

  const currentEpisodeData = useMemo<Episode | undefined>(() => {
    if (state.currentEpisodeId === null) {
      return episodes.find((item) => item.id === DEFAULT_EPISODE_ID);
    }

    if (state.currentEpisodeType === 'podcast') {
      const podcastEp = pickleEpisodes.find((item) => item.id === state.currentEpisodeId);

      if (!podcastEp) return undefined;

      return {
        id: podcastEp.id,
        title: podcastEp.title,
        audio_file: podcastEp.audio_file,
        imgUrl: podcastEp.src,
        date: podcastEp.uploadAt,
        pickle_podcasts: podcastEp.pickle_podcasts,
      } as Episode;
    }

    return episodes.find((item) => item.id === state.currentEpisodeId);
  }, [state.currentEpisodeId, state.currentEpisodeType, episodes, pickleEpisodes]);

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
    (id: number, liveStatus = false, isPickle = false) => {
      const type = isPickle ? 'podcast' : 'radio';
      const episode = isPickle
        ? pickleEpisodes.find((item) => item.id === id)
        : episodes.find((item) => item.id === id);

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
          currentEpisodeType: type,
        }));
      }
    },
    [episodes, pickleEpisodes]
  );

  const setPlaylist = useCallback((playlist: Episode[]) => {
    setActivePlaylist(playlist);
  }, []);

  const changeEpisode = useCallback(
    (direction: 1 | -1) => {
      if (!activePlaylist.length || state.currentEpisodeId === null) return;

      const playlistLength = activePlaylist.length;
      let currentIndex = activePlaylist.findIndex((ep) => ep.id === state.currentEpisodeId);

      if (currentIndex === -1) {
        currentIndex = 0;
      }

      let searchCount = 0;
      while (searchCount < playlistLength) {
        const nextIndex = (currentIndex + direction + playlistLength) % playlistLength;
        const nextEpisode = activePlaylist[nextIndex];

        if (nextEpisode && nextEpisode.audio_file !== null) {
          playEpisode(
            nextEpisode.id,
            state.isLive,
            state.currentEpisodeType === 'podcast' ? true : false
          );
          return;
        }

        currentIndex = nextIndex;
        searchCount++;
      }
    },
    [activePlaylist, state.currentEpisodeId, state.isLive, playEpisode, state.currentEpisodeType]
  );

  const handlePlayNext = useCallback(() => {
    changeEpisode(1);
  }, [changeEpisode]);

  const handlePlayPrev = useCallback(() => {
    changeEpisode(-1);
  }, [changeEpisode]);

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
    setPlaylist,
    handlePlayNext,
    handlePlayPrev,
    activePlaylist,
  };

  return <PlayerContext.Provider value={contextValue}>{children}</PlayerContext.Provider>;
};
