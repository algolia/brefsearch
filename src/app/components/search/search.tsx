'use client';

import { Configure, InstantSearch } from 'react-instantsearch';
import { useEffect, useRef } from 'react';
import Modal from '../modal';
import Hero from '../hero';
import CustomHits from './hits';
import PoweredBy from './poweredBy';
import { searchClient } from '@/app/utils/algolia';
import { brefRouter } from '@/app/utils/brefRouter';
import { VideoProvider, useVideo } from '@/app/contexts/VideoContext';
import { config } from '@/app/utils/config';

const RenderHits = () => {
  return (
    <>
      {/* Hits */}
      <div className="w-full">
        <CustomHits />
      </div>

      {/* PoweredBy logo - visible only on mobile, at the bottom */}
      <div className="mt-8 md:hidden">
        <PoweredBy />
      </div>

      {/* Modal - rendered above everything when video is selected */}
      <Modal />
    </>
  );
};

const SearchContent = () => {
  const { videoData } = useVideo();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!videoData) {
      inputRef.current?.focus();
    }
  }, [videoData]);

  return (
    <div className="grid px-4 md:px-8 pb-8">
      <InstantSearch
        searchClient={searchClient}
        indexName={config.indexName}
        routing={{
          router: brefRouter,
        }}
        searchFunction={(helper) => {
          // Dynamically switch index based on query
          const { query } = helper.getQuery();
          const expectedIndex = query
            ? config.indexNamePopularity
            : config.indexName;

          helper.setIndex(expectedIndex);

          helper.search();
        }}
      >
        <Configure {...config.configure} />
        <Hero inputRef={inputRef} />
        <RenderHits />
      </InstantSearch>
    </div>
  );
};

const Search = () => {
  return (
    <VideoProvider>
      <SearchContent />
    </VideoProvider>
  );
};

export default Search;
