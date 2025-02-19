'use client';

import cx from 'classnames';
import { searchClient } from '@/app/utils/algolia';
import {
  Configure,
  Index,
  InstantSearch,
  useSearchBox,
} from 'react-instantsearch';
import CustomHits from './hits';
import CustomSearchbox from './searchbox';
import { useEffect, useRef, useState } from 'react';
import { BrefHit } from '@/app/types';
import Sidebar from '../sidebar';

const RenderHits = ({
  selectedVideo,
  setSelectedVideo,
  query,
}: {
  selectedVideo: BrefHit | null;
  setSelectedVideo: (video: BrefHit | null) => void;
  query: string;
}) => {
  const [currentIndexName, setCurrentIndexName] = useState<string>(
    process.env.NEXT_PUBLIC_ALG_INDEX_NAME!,
  );
  useEffect(() => {
    console.log('query', query);
    if (query !== '') {
      setCurrentIndexName(
        `${process.env.NEXT_PUBLIC_ALG_INDEX_NAME}_popularity`,
      );
    }
  }, [query]);

  return (
    <div
      className={cx('grid gap-4', {
        'grid-cols-1': !selectedVideo,
        'grid-cols-3': selectedVideo,
      })}
    >
      <Index indexName={currentIndexName}>
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

        {selectedVideo && (
          <Sidebar
            selectedVideo={selectedVideo}
            setSelectedVideo={setSelectedVideo}
          />
        )}
      </Index>
    </div>
  );
};

const Search = () => {
  const [selectedVideo, setSelectedVideo] = useState<BrefHit | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!selectedVideo) {
      inputRef.current?.focus();
    }
  }, [selectedVideo]);

  return (
    <div className="grid p-8">
      <InstantSearch searchClient={searchClient}>
        <Configure hitsPerPage={18} />
        <CustomSearchbox inputRef={inputRef} setCustomQuery={setQuery} />
        <RenderHits
          selectedVideo={selectedVideo}
          setSelectedVideo={setSelectedVideo}
          query={query}
        />
      </InstantSearch>
    </div>
  );
};

export default Search;
