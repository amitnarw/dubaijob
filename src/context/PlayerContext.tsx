import React, { createContext, useContext, useState, useEffect } from 'react';
import { ConcentricTheme } from '@/components/podcast/ConcentricArtwork';

export interface PlayerTrack {
  id: string;
  title: string;
  episode: string;
  theme: ConcentricTheme;
  badgeText: string;
  duration?: string;
  progress?: number;
  videoId?: string;
}

interface PlayerContextType {
  currentTrack: PlayerTrack;
  isPlaying: boolean;
  isVisible: boolean;
  progress: number;
  togglePlay: () => void;
  playTrack: (track: Partial<PlayerTrack>) => void;
  seekProgress: (val: number) => void;
  closePlayer: () => void;
}

const DEFAULT_TRACK: PlayerTrack = {
  id: 'step-1',
  title: 'Step 1. Introduction',
  episode: 'Dubai Basics & Eligibility',
  theme: 'teal',
  badgeText: 'Step 1: Intro',
  duration: '08:30',
  progress: 0.45,
  videoId: 'o9ul995BlGw',
};

const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentTrack, setCurrentTrack] = useState<PlayerTrack>(DEFAULT_TRACK);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0.45);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const closePlayer = () => {
    setIsVisible(false);
    setIsPlaying(false);
  };

  const playTrack = (track: Partial<PlayerTrack>) => {
    setCurrentTrack((prev) => ({
      ...prev,
      ...track,
      id: track.id || prev.id,
      title: track.title || prev.title,
      episode: track.episode || 'Now Playing',
      theme: track.theme || 'teal',
      badgeText: track.badgeText || track.title || 'Live',
    }));
    setIsVisible(true);
    setIsPlaying(true);
    setProgress(0.15);
  };

  const seekProgress = (val: number) => {
    setProgress(Math.max(0, Math.min(1, val)));
  };

  // Simulated playback progress increment
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 1) return 0;
        return prev + 0.005;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        isVisible,
        progress,
        togglePlay,
        playTrack,
        seekProgress,
        closePlayer,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextType => {
  const ctx = useContext(PlayerContext);
  if (!ctx) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return ctx;
};
