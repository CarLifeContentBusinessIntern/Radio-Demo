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
import { timeStringToSeconds } from '../utils/timeUtils';
import { useLocation, useNavigate } from 'react-router-dom';
import type { EpisodeType } from '../types/episode';
import { useQueryClient } from '@tanstack/react-query';
import { LIVE_STREAM_EPISODE, LIVE_STREAM_EPISODE_EN } from '../constants/liveEpisode';
import { useTranslation } from 'react-i18next';

interface PlayerState {
  currentEpisodeId: number | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  hasBeenActivated: boolean;
  isLive: boolean;
  isOnAir: boolean;
  isPlaylistOpen: boolean;
  currentEpisodeType: 'radio' | 'podcast' | null;
  isLoading: boolean;
  originType: 'program' | 'series' | null;
  recentSeriesId: number | null;
  useOriginalAudio: boolean;
}

interface PlayerContextType extends PlayerState {
  currentEpisodeData: EpisodeType | undefined;
  currentAudioUrl: string | null;
  activePlaylist: EpisodeType[];
  togglePlayPause: () => void;
  togglePlaylist: () => void;
  closePlaylist: () => void;
  playEpisode: (
    id: number,
    liveStatus?: boolean,
    isPodcast?: boolean,
    originType?: 'program' | 'series' | null,
    recentSeriesId?: number | null,
    isOnAir?: boolean
  ) => void;
  handleSeek: (time: number) => void;
  handleSkip: (seconds: number) => void;
  formatTime: (seconds: number, forceHourFormat: boolean) => string;
  setPlaylist: (playlist: EpisodeType[]) => void;
  handlePlayNext: () => void;
  handlePlayPrev: () => void;
  handlePlayBarNext: () => void;
  handlePlayBarPrev: () => void;
  resetPlayer: () => void;
  saveCurrentEpisodeProgress: () => void;
  setUseOriginalAudio: (useOriginal: boolean) => void;
  playedDurations: Record<number, number>;
  setPlayedDurations: (callback: (prev: Record<number, number>) => Record<number, number>) => void;
}

const initialPlayerState: PlayerState = {
  currentEpisodeId: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  hasBeenActivated: false,
  isLive: false,
  isOnAir: false,
  isPlaylistOpen: false,
  currentEpisodeType: 'radio',
  isLoading: false,
  originType: null,
  recentSeriesId: null,
  useOriginalAudio: true,
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
  const [state, setState] = useState<PlayerState>(initialPlayerState);
  const [episodes, setEpisodes] = useState<EpisodeType[]>([]);
  const activePlaylistRef = useRef<EpisodeType[]>([]);
  const [activePlaylist, setActivePlaylist] = useState<EpisodeType[]>([]);

  const { i18n } = useTranslation();
  const isKorean = i18n.language === 'ko';
  const liveEpisode = isKorean ? LIVE_STREAM_EPISODE : LIVE_STREAM_EPISODE_EN;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  useEffect(() => {
    async function fetchEpisodes() {
      const { data, error } = await supabase
        .from('episodes')
        .select('*, programs(*, broadcastings(*))');

      if (error) {
        console.log('❌ Error fetching episodes data:', error.message);
      } else if (data) {
        setEpisodes([liveEpisode, ...data]);
      }
    }

    fetchEpisodes();
  }, []);

  const DEFAULT_EPISODE_ID = 1;

  const currentEpisodeData = useMemo<EpisodeType | undefined>(() => {
    if (state.currentEpisodeId === null) {
      return episodes.find((item) => item.id === DEFAULT_EPISODE_ID);
    }

    return episodes.find((item) => item.id === state.currentEpisodeId);
  }, [state.currentEpisodeId, episodes]);

  const getEpisodeDuration = (episode: EpisodeType): number => {
    if (typeof episode.duration === 'string') {
      return timeStringToSeconds(episode.duration);
    } else if (typeof episode.duration === 'number') {
      return episode.duration;
    }
    return 2712;
  };

  const currentAudioUrl = useMemo(() => {
    if (!currentEpisodeData) return null;

    const audioUrl =
      !state.useOriginalAudio && currentEpisodeData.audioFile_dubbing
        ? currentEpisodeData.audioFile_dubbing
        : currentEpisodeData.audio_file || null;

    return audioUrl;
  }, [
    state.currentEpisodeId,
    state.useOriginalAudio,
    currentEpisodeData?.audio_file,
    currentEpisodeData?.audioFile_dubbing,
  ]);

  useEffect(() => {
    audioRef.current = new Audio();

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setState((prev) => ({ ...prev, currentTime: audio.currentTime }));
    };

    const handleLoadedMetadata = () => {
      setState((prev) => ({ ...prev, duration: audio.duration }));
    };

    const handleWaiting = () => {
      setState((prev) => ({ ...prev, isLoading: true }));
    };

    const handleCanPlay = () => {
      setState((prev) => ({ ...prev, isLoading: false }));
    };

    const handleEnded = () => {
      const isPlayerPage = /^\/player\/[^/]+$/.test(location.pathname);
      if (isPlayerPage) {
        handlePlayNext(); // /player/:id 인 경우
      } else {
        handlePlayBarNext(); // 그 외 모든 경우
      }
    };
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('playing', handleCanPlay);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('playing', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);

      audio.src = '';
    };
  }, []);

  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    startTimeRef.current = state.currentTime;
  }, [state.currentTime]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentAudioUrl) return;

    const isNewSource = audio.src !== currentAudioUrl;

    if (isNewSource) {
      audio.src = currentAudioUrl;
      audio.currentTime = startTimeRef.current;
    }

    if (state.isPlaying) {
      audio.play().catch((err) => {
        console.error('Audio play failed:', err);
      });
    } else {
      audio.pause();
    }
  }, [currentAudioUrl, state.isPlaying]);

  useEffect(() => {
    if (state.currentEpisodeId === null && episodes.length > 0) {
      const episode = currentEpisodeData as EpisodeType;

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
    async (
      id: number,
      liveStatus = false,
      isPodcast = false,
      originType: 'program' | 'series' | null = null,
      recentSeriesId: number | null = null,
      isOnAir = false
    ) => {
      const type: 'radio' | 'podcast' = isPodcast ? 'podcast' : 'radio';

      // 재생하기 직전에 이전 에피소드의 시간 기록
      if (currentEpisodeRef.current && audioRef.current) {
        saveListeningHistory(
          currentEpisodeRef.current,
          audioRef.current.currentTime,
          state.originType,
          state.recentSeriesId
        );
      }

      let episode;
      let startTime = 0;

      if (id === liveEpisode.id) {
        episode = liveEpisode;
        startTime = 0;
      } else {
        // 최신 데이터 가져오기 (최신 재생 시점을 위해)
        const { data: freshEpisode } = await supabase
          .from('episodes')
          .select('*')
          .eq('id', id)
          .single();

        episode = freshEpisode ?? episodes.find((item) => item.id === id);
        if (episode) {
          startTime = Number(episode?.listened_duration) || 0;
        }
      }

      if (!episode || episode?.audio_file === null) return;

      const newDuration = getEpisodeDuration(episode);

      if (startTime > newDuration - 1) {
        startTime = 0;
      }

      setState((prevState) => {
        const isNewEpisode = prevState.currentEpisodeId !== id;

        const changes = {
          isLive: liveStatus,
          isOnAir: isOnAir,
          currentEpisodeType: type,
          isLoading: isOnAir ? false : liveStatus ? false : prevState.isLoading,
        };

        if (isNewEpisode) {
          return {
            ...prevState,
            ...changes,
            currentEpisodeId: id,
            isPlaying: true,
            currentTime: startTime,
            duration: newDuration,
            hasBeenActivated: true,
            isLoading: isOnAir ? false : liveStatus ? false : true,
            isLive: liveStatus,
            isOnAir: isOnAir,
            originType,
            recentSeriesId,
            isPlaylistOpen: false,
          };
        }

        if (prevState.isPlaying) {
          return {
            ...prevState,
            isLive: changes.isLive,
            currentEpisodeType: changes.currentEpisodeType,
            isLoading: changes.isLoading,
            originType,
            recentSeriesId,
            isPlaylistOpen: false,
          };
        }

        return {
          ...prevState,
          isLive: changes.isLive,
          currentEpisodeType: changes.currentEpisodeType,
          isPlaying: true,
          isLoading: isOnAir ? false : liveStatus ? false : true,
          originType,
          recentSeriesId,
          isPlaylistOpen: false,
        };
      });
    },
    [episodes]
  );

  const setPlaylist = useCallback((playlist: EpisodeType[]) => {
    activePlaylistRef.current = playlist; // 최신값을 ref에 저장
    setActivePlaylist(playlist); // state 업데이트 (UI용)
  }, []);

  const changeEpisode = useCallback(
    (direction: 1 | -1, isPlayBar: boolean) => {
      const playlist = activePlaylistRef.current;
      if (!playlist.length || currentEpisodeRef.current === null) return;

      // 다른 에피소드로 변경하기 직전에 DB에 시간 기록
      if (currentEpisodeRef.current && audioRef.current) {
        saveListeningHistory(
          currentEpisodeRef.current,
          audioRef.current.currentTime,
          state.originType,
          state.recentSeriesId
        );
      }

      const playlistLength = playlist.length;
      let currentIndex = playlist.findIndex((ep) => ep.id === currentEpisodeRef.current);

      if (currentIndex === -1) {
        currentIndex = 0;
      }

      let searchCount = 0;
      while (searchCount < playlistLength) {
        const nextIndex = (currentIndex + direction + playlistLength) % playlistLength;
        const nextEpisode = playlist[nextIndex];

        if (nextEpisode && nextEpisode.audio_file !== null) {
          const isPodcast = state.currentEpisodeType === 'podcast';
          const isOnAir = nextEpisode.id === liveEpisode.id;

          if (!isPlayBar) {
            if (isPodcast) {
              navigate(`/player/podcasts/${nextEpisode.id}`, {
                replace: true,
                state: {
                  isLive: false,
                  playlist: playlist,
                  originType: state.originType,
                  recentSeriesId: state.recentSeriesId,
                },
              });
            } else if (isOnAir) {
              navigate(`/player/live`, {
                replace: true,
                state: { isOnAir: true, playlist: [] },
              });
            } else if (state.isLive) {
              navigate(`/player/${nextEpisode.id}/live`, {
                replace: true,
                state: { isLive: state.isLive, playlist: playlist },
              });
            } else {
              navigate(`/player/${nextEpisode.id}`, {
                replace: true,
                state: {
                  isLive: state.isLive,
                  playlist: playlist,
                  originType: state.originType,
                  recentSeriesId: state.recentSeriesId,
                },
              });
            }
          } else {
            playEpisode(
              nextEpisode.id,
              state.isLive,
              isPodcast,
              state.originType,
              state.recentSeriesId,
              isOnAir
            );
          }
          return;
        }

        currentIndex = nextIndex;
        searchCount++;
      }
    },
    [
      state.currentEpisodeId,
      state.isLive,
      playEpisode,
      navigate,
      state.currentEpisodeType,
      state.originType,
      state.recentSeriesId,
    ]
  );

  const handlePlayNext = useCallback(() => {
    changeEpisode(1, false);
  }, [changeEpisode]);

  const handlePlayPrev = useCallback(() => {
    changeEpisode(-1, false);
  }, [changeEpisode]);

  const handlePlayBarNext = useCallback(() => {
    changeEpisode(1, true);
  }, [changeEpisode]);

  const handlePlayBarPrev = useCallback(() => {
    changeEpisode(-1, true);
  }, [changeEpisode]);

  const togglePlayPause = useCallback(() => {
    if (state.currentEpisodeId === null) return;

    // 멈추기 직전 재생 시간 DB에 시간 기록
    if (state.isPlaying) {
      saveListeningHistory(
        state.currentEpisodeId,
        state.currentTime,
        state.originType,
        state.recentSeriesId
      );
    }

    setState((prevState) => ({ ...prevState, isPlaying: !prevState.isPlaying }));
  }, [state.currentEpisodeId, state.isPlaying, state.currentTime]);

  const togglePlaylist = useCallback(() => {
    setState((prevState) => ({ ...prevState, isPlaylistOpen: !prevState.isPlaylistOpen }));
  }, []);

  const closePlaylist = useCallback(() => {
    setState((prevState) => ({ ...prevState, isPlaylistOpen: false }));
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

  const formatTime = useCallback((seconds: number, forceHourFormat: boolean = false) => {
    if (isNaN(seconds) || seconds < 0) return forceHourFormat ? '00:00:00' : '00:00';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const hStr = hours.toString();
    const mStr = minutes.toString().padStart(2, '0');
    const sStr = secs.toString().padStart(2, '0');

    if (hours > 0 || forceHourFormat) {
      return `${hStr}:${mStr}:${sStr}`;
    } else {
      return `${mStr}:${sStr}`;
    }
  }, []);

  // 현재 재생 중 에피소드 ID Ref
  const currentEpisodeRef = useRef<number | null>(state.currentEpisodeId);

  useEffect(() => {
    currentEpisodeRef.current = state.currentEpisodeId;
  }, [state.currentEpisodeId]);

  // 브라우저 새로고침, 탭 종료 시 DB에 시간 기록
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (audioRef.current && state.currentEpisodeId) {
        saveListeningHistory(
          state.currentEpisodeId,
          audioRef.current.currentTime,
          state.originType,
          state.recentSeriesId
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [state.currentEpisodeId, state.originType, state.recentSeriesId]);

  const resetPlayer = useCallback(() => {
    //플레이어 완전 종료 / 버전 변경 시 DB에 시간 기록
    if (currentEpisodeRef.current && audioRef.current) {
      saveListeningHistory(
        currentEpisodeRef.current,
        audioRef.current.currentTime,
        state.originType,
        state.recentSeriesId
      );
    }

    setState(initialPlayerState);
    setActivePlaylist([]);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
  }, []);

  // 재생 중인 에피소드의 현재 시간 DB에 저장
  const saveCurrentEpisodeProgress = useCallback(() => {
    if (state.currentEpisodeId && audioRef.current) {
      saveListeningHistory(
        state.currentEpisodeId,
        audioRef.current.currentTime,
        state.originType,
        state.recentSeriesId
      );
    }
  }, [state.currentEpisodeId, state.originType, state.recentSeriesId]);

  const setUseOriginalAudio = useCallback((useOriginal: boolean) => {
    const savedTime = audioRef.current?.currentTime || 0;

    setState((prev) => ({
      ...prev,
      useOriginalAudio: useOriginal,
    }));

    setTimeout(() => {
      if (audioRef.current && savedTime > 0) {
        audioRef.current.currentTime = savedTime;
      }
    }, 100);
  }, []);

  const [playedDurations, setPlayedDurations] = useState<Record<number, number>>({});

  const contextValue: PlayerContextType = {
    ...state,
    currentEpisodeData,
    currentAudioUrl,
    activePlaylist,
    togglePlayPause,
    togglePlaylist,
    closePlaylist,
    playEpisode,
    handleSeek,
    handleSkip,
    formatTime,
    setPlaylist,
    handlePlayNext,
    handlePlayPrev,
    handlePlayBarNext,
    handlePlayBarPrev,
    resetPlayer,
    saveCurrentEpisodeProgress,
    setUseOriginalAudio,
    playedDurations,
    setPlayedDurations,
  };

  //최근 들은 시점 저장
  async function saveListeningHistory(
    episodeId: number,
    currentTime: number,
    originType: 'program' | 'series' | null = null,
    recentSeriesId: number | null = null
  ) {
    if (!episodeId) return;
    if (originType === null) return;
    if (episodeId === liveEpisode.id) return;

    const updateData: {
      listened_duration: number;
      listened_at: string;
      origin_type?: 'program' | 'series' | null;
      recent_series_id?: number | null;
    } = {
      listened_duration: Math.floor(currentTime),
      listened_at: new Date().toISOString(),
      recent_series_id: recentSeriesId,
    };

    //originType이 null일 때는 DB 업데이트 하지 않음
    if (originType !== null) {
      updateData.origin_type = originType;
    }

    const { error } = await supabase.from('episodes').update(updateData).eq('id', episodeId);

    if (error) {
      console.error('❌ Failed to save listening history:', error.message);
    }

    // 여기서 UI용 Context에도 바로 반영
    setPlayedDurations((prev) => ({
      ...prev,
      [episodeId]: currentTime,
    }));

    queryClient.invalidateQueries({ queryKey: ['tenRecentEpisodes'] });
    queryClient.invalidateQueries({ queryKey: ['threeRecentEpisodes'] });
    queryClient.invalidateQueries({ queryKey: ['recentSeriesProgram'] });
  }

  return <PlayerContext.Provider value={contextValue}>{children}</PlayerContext.Provider>;
};
