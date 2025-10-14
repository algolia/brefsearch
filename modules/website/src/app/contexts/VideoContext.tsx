'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { parseUrlHash, removeVideoFromUrl } from '@/app/utils/functions';
import { searchClient } from '@/app/utils/algolia';

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

  // Fetch video data from Algolia when we only have videoId
  const fetchVideoDataFromAlgolia = async (videoId: string, timestamp: number) => {
    const fallbackVideoData = {
      videoId,
      timestamp,
      title: '__placeholder__',
      lqip: '',
    };

    const result = await searchClient.search([{
      indexName: 'brefsearch',
      query: '',
      params: {
        filters: `episode.videoId:${videoId}`,
        hitsPerPage: 1,
      }
    }]);

    // Fallback if can't find the video data
    if (!result.results[0].hits.length ) {
      setRawVideoData(fallbackVideoData);
      return;
    }

    // Pass all data
    const hit = result.results[0].hits[0] as any;
    setRawVideoData({
      videoId,
      timestamp,
      title: `${hit.episode.index}. ${hit.episode.name}`,
      lqip: hit.thumbnail.lqip,
    });
  };

  // Check URL on startup for video info
  useEffect(() => {
    const { videoId, timestamp } = parseUrlHash(window.location.hash);
    if (videoId && timestamp) {
      fetchVideoDataFromAlgolia(videoId, parseInt(timestamp));
    }
  }, []);

  return (
    <VideoContext.Provider value={{ videoData, setVideoData }}>
      {children}
    </VideoContext.Provider>
  );
};
