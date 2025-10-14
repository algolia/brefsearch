'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { parseUrlHash } from '@/app/utils/functions';

export type VideoData = {
  videoId: string;
  timestamp: number;
  title: string;
  lqip: string;
};

type VideoContextType = {
  videoData: VideoData | null;
  setVideoData: (data: VideoData | null) => void;
};

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};

export const VideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoData, setVideoData] = useState<VideoData | null>(null);

  // Check URL on startup for video info
  useEffect(() => {
    const { videoId, timestamp } = parseUrlHash(window.location.hash);
    if (videoId && timestamp) {
      setVideoData({
        videoId,
        timestamp: parseInt(timestamp),
        title: '__placeholder__',
        lqip: '', // No LQIP available from URL
      });
    }
  }, []);

  return (
    <VideoContext.Provider value={{ videoData, setVideoData }}>
      {children}
    </VideoContext.Provider>
  );
};
