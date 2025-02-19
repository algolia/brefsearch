'use client';

import cx from 'classnames';
import { searchClient } from '@/app/utils/algolia';
import { Configure, Index, InstantSearch } from 'react-instantsearch';
import CustomHits from './hits';
import { useEffect, useRef, useState } from 'react';
import { BrefHit } from '@/app/types';
import Sidebar from '../sidebar';
import Hero from '../hero';

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
    if (query !== '') {
      setCurrentIndexName(
        `${process.env.NEXT_PUBLIC_ALG_INDEX_NAME}_popularity`,
      );
    } else {
      setCurrentIndexName(process.env.NEXT_PUBLIC_ALG_INDEX_NAME!);
    }
  }, [query]);

  return (
    <div
      className={cx('grid gap-4', {
        'md:grid-cols-1': !selectedVideo,
        'md:grid-cols-3': selectedVideo,
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
    <div className="grid px-8">
      <InstantSearch searchClient={searchClient}>
        <Configure hitsPerPage={18} />
        <Hero inputRef={inputRef} setCustomQuery={setQuery} query={query} />
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
