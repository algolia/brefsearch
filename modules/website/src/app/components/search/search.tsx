'use client';

import { Configure, InstantSearch } from 'react-instantsearch';
import { useEffect, useRef, useState } from 'react';
import Modal, { VideoData } from '../modal';
import Hero from '../hero';
import CustomHits from './hits';
import PoweredBy from './poweredBy';
import { BrefHit } from '@/app/types';
import { searchClient } from '@/app/utils/algolia';
import { brefRouter } from '@/app/utils/brefRouter';
import { parseUrlHash } from '@/app/utils/functions';

const RenderHits = ({
  videoData,
  setVideoData,
}: {
  videoData: VideoData | null;
  setVideoData: (video: VideoData | null) => void;
}) => {
  return (
    <>
      {/* Hits */}
      <div className="w-full">
        <CustomHits setVideoData={setVideoData} />
      </div>

      {/* PoweredBy logo - visible only on mobile, at the bottom */}
      <div className="mt-8 md:hidden">
        <PoweredBy />
      </div>

      {/* Modal - rendered above everything when video is selected */}
      <Modal
        videoData={videoData}
        onClose={() => setVideoData(null)}
      />
    </>
  );
};

const Search = () => {
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (!videoData) {
      inputRef.current?.focus();
    }
  }, [videoData]);

  return (
    <div className="grid px-4 md:px-8 pb-8">
      <InstantSearch
        searchClient={searchClient}
        indexName="brefsearch"
        routing={{
          router: brefRouter,
        }}
        searchFunction={(helper) => {
          // Dynamically switch index based on query
          const { query } = helper.getQuery();
          const expectedIndex = query ? 'brefsearch_popularity' : 'brefsearch';

          helper.setIndex(expectedIndex);

          helper.search();
        }}
      >
        <Configure hitsPerPage={18} />
        <Hero inputRef={inputRef} />
        <RenderHits
          videoData={videoData}
          setVideoData={setVideoData}
        />
      </InstantSearch>
    </div>
  );
};

export default Search;
