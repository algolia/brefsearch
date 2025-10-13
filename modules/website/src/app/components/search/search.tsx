'use client';

import cx from 'classnames';
import { Configure, InstantSearch } from 'react-instantsearch';
import { useEffect, useRef, useState } from 'react';
import Sidebar from '../sidebar';
import Hero from '../hero';
import CustomHits from './hits';
import { BrefHit } from '@/app/types';
import { searchClient } from '@/app/utils/algolia';
import { parseUrlHash } from '@/app/utils/functions';
import { brefRouter } from '@/app/utils/brefRouter';

const RenderHits = ({
  selectedVideo,
  setSelectedVideo,
}: {
  selectedVideo: BrefHit | null;
  setSelectedVideo: (video: BrefHit | null) => void;
}) => {
  return (
    // Wrapper
    <div
      className={cx('grid gap-4', {
        'md:grid-cols-1': !selectedVideo,
        'md:grid-cols-3': selectedVideo,
      })}
    >
      {/* Hits */}
      <div
        className={cx('transition-all duration-300', {
          'md:col-span-2': selectedVideo,
        })}
      >
        <CustomHits
          setSelectedVideo={setSelectedVideo}
          selectedVideo={!!selectedVideo}
        />
      </div>

      {/* Selected video (optional) */}
      {selectedVideo && (
        <Sidebar
          selectedVideo={selectedVideo}
          setSelectedVideo={setSelectedVideo}
        />
      )}
    </div>
  );
};

const Search = () => {
  const [selectedVideo, setSelectedVideo] = useState<BrefHit | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');

  // Initialize query from URL hash on mount
  useEffect(() => {
    const urlState = parseUrlHash(window.location.hash);
    if (urlState.query) {
      setQuery(urlState.query);
    }
  }, []);

  useEffect(() => {
    if (!selectedVideo) {
      inputRef.current?.focus();
    }
  }, [selectedVideo]);

  return (
    <div className="grid px-4 md:px-8">
      <InstantSearch
        searchClient={searchClient}
        indexName="brefsearch"
        routing={{
          router: brefRouter,
        }}
        searchFunction={(helper) => {
          // Dynamically switch index based on query
          const currentQuery = helper.getQuery();
          const expectedIndex = currentQuery
            ? 'brefsearch_popularity'
            : 'brefsearch';

          helper.setIndex(expectedIndex);

          helper.search();
        }}
      >
        <Configure hitsPerPage={18} />
        <Hero
          inputRef={inputRef}
          setCustomQuery={setQuery}
          initialQuery={query}
        />
        <RenderHits
          selectedVideo={selectedVideo}
          setSelectedVideo={setSelectedVideo}
        />
      </InstantSearch>
    </div>
  );
};

export default Search;
