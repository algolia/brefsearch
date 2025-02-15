'use client';

import cx from 'classnames';
import { searchClient } from '@/app/utils/algolia';
import { Configure, InstantSearch } from 'react-instantsearch';
import CustomHits from './hits';
import CustomSearchbox from './searchbox';
import { useState } from 'react';
import { BrefHit } from '@/app/types';
import YoutubePlayer from '../youtubePlayer';
import { youtubeGivenTimeUrl } from '@/app/utils/functions';
import Sidebar from '../sidebar';

const Search = () => {
  const [selectedVideo, setSelectedVideo] = useState<BrefHit | null>(null);
  return (
    <div className="grid p-8">
      <InstantSearch
        searchClient={searchClient}
        indexName={process.env.NEXT_PUBLIC_ALG_INDEX_NAME!}
      >
        <Configure hitsPerPage={18} />
        <CustomSearchbox />
        <div
          className={cx('grid gap-4', {
            'grid-cols-1': !selectedVideo,
            'grid-cols-3': selectedVideo,
          })}
        >
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
        </div>
      </InstantSearch>
    </div>
  );
};

export default Search;
