'use client';

import cx from 'classnames';
import { searchClient } from '@/app/utils/algolia';
import { Configure, Index, InstantSearch } from 'react-instantsearch';
import { singleIndex } from 'instantsearch.js/es/lib/stateMappings';
import CustomHits from './hits';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BrefHit } from '@/app/types';
import Sidebar from '../sidebar';
import Hero from '../hero';
import { deslugifyCategory } from '@/app/utils/functions';
import { history } from 'instantsearch.js/es/lib/routers';
import { slugifyCategory } from '@/app/utils/functions';
import { UiState } from 'instantsearch.js';
import { RouterProps } from 'instantsearch.js/es/middlewares';

const routing = {
  router: history({
    windowTitle({ category, query }) {
      const queryTitle = query ? `Results for "${query}"` : 'Search';
      return category ? `${category} – ${queryTitle}` : queryTitle;
    },
    createURL({ qsModule, routeState, location }) {
      const categoryPath = routeState.category
        ? `${slugifyCategory(routeState.category as string)}/`
        : '';
      const queryParameters: { query?: string; page?: number } = {};

      if (routeState.query) {
        queryParameters.query = encodeURIComponent(routeState.query as string);
      }
      if (typeof routeState.page === 'number' && routeState.page !== 1) {
        queryParameters.page = routeState.page;
      }

      const queryString = qsModule.stringify(queryParameters, {
        addQueryPrefix: true,
        arrayFormat: 'repeat',
      });

      return `${location.origin}/search/${categoryPath}${queryString}`;
    },
    parseURL({ qsModule, location }): UiState {
      const pathnameMatches = location.pathname.match(/search\/(.*?)\/?$/);
      const category = pathnameMatches
        ? deslugifyCategory(pathnameMatches[1])
        : '';
      const queryParameters = qsModule.parse(location.search.slice(1));
      const { query = '', page } = queryParameters;

      return {
        query: { query: decodeURIComponent(query as string) }, // Ensure query is an object with the correct structure
        pagination: { page: page ? Number(page) : 1 },
        menu: {
          menu: { category },
        },
      };
    },
  }),
  stateMapping: {
    stateToRoute(uiState: UiState) {
      const indexUiState =
        uiState[process.env.NEXT_PUBLIC_ALG_INDEX_NAME!] || {};
      return {
        query: { query: indexUiState.query || '' },
        pagination: { page: indexUiState.page ?? 1 },
        menu: { categories: indexUiState.menu?.categories || '' },
        configure: {},
        geoSearch: {},
        hierarchicalMenu: {},
        hitsPerPage: {},
        multiIndex: {},
        numericMenu: {},
        range: {},
        refinementList: {},
        sortBy: {},
        toggle: {},
      };
    },
    routeToState(routeState: {
      query: string;
      pagination: { page: any };
      category: string;
    }) {
      return {
        [process.env.NEXT_PUBLIC_ALG_INDEX_NAME!]: {
          query: routeState.query as string, // Ensure query is a string
          page: routeState.pagination?.page,
          menu: { categories: routeState.category as string },
        },
      };
    },
  },
};

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
  const router = useRouter();

  // Sync selectedVideo with URL
  useEffect(() => {
    if (selectedVideo) {
      router.push(`?video=${selectedVideo.objectID}`, { scroll: false });
    } else {
      router.push(`?`, { scroll: false });
    }
  }, [selectedVideo, router]);

  useEffect(() => {
    if (!selectedVideo) {
      inputRef.current?.focus();
    }
  }, [selectedVideo]);

  return (
    <div className="grid px-8">
      <InstantSearch
        searchClient={searchClient}
        indexName={process.env.NEXT_PUBLIC_ALG_INDEX_NAME!}
        routing={routing as unknown as RouterProps}
      >
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
