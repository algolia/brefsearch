'use client';

import { Configure, InstantSearch } from 'react-instantsearch';
import { useEffect, useRef, useState } from 'react';
import Modal from '../modal';
import Hero from '../hero';
import CustomHits from './hits';
import PoweredBy from './poweredBy';
import { BrefHit } from '@/app/types';
import { searchClient } from '@/app/utils/algolia';
import { brefRouter } from '@/app/utils/brefRouter';

const RenderHits = ({
  selectedVideo,
  setSelectedVideo,
}: {
  selectedVideo: BrefHit | null;
  setSelectedVideo: (video: BrefHit | null) => void;
}) => {
  return (
    <>
      {/* Hits */}
      <div className="w-full">
        <CustomHits
          setSelectedVideo={setSelectedVideo}
          selectedVideo={!!selectedVideo}
        />
      </div>

      {/* PoweredBy logo - visible only on mobile, at the bottom */}
      <div className="mt-8 md:hidden">
        <PoweredBy />
      </div>

      {/* Modal - rendered above everything when video is selected */}
      {selectedVideo && (
        <Modal
          selectedVideo={selectedVideo}
          setSelectedVideo={setSelectedVideo}
        />
      )}
    </>
  );
};

const Search = () => {
  const [selectedVideo, setSelectedVideo] = useState<BrefHit | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!selectedVideo) {
      inputRef.current?.focus();
    }
  }, [selectedVideo]);

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
          selectedVideo={selectedVideo}
          setSelectedVideo={setSelectedVideo}
        />
      </InstantSearch>
    </div>
  );
};

export default Search;
