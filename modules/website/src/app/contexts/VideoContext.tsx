'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { parseUrlHash, removeVideoFromUrl } from '@/app/utils/functions';

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
  const [videoData, setRawVideoData] = useState<VideoData | null>(null);

  // Custom setter that also clears URL when setting to null
  const setVideoData = (data: VideoData | null) => {
    if (data === null) {
      removeVideoFromUrl();
    }
    setRawVideoData(data);
  };

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
