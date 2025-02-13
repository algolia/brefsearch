'use client';

import { searchClient } from '@/app/utils/algolia';
import { InstantSearch } from 'react-instantsearch';
import CustomHits from './hits';
import CustomSearchbox from './searchbox';

const Search = () => {
  return (
    <div className="grid p-8">
      <InstantSearch
        searchClient={searchClient}
        indexName={process.env.NEXT_PUBLIC_ALG_INDEX_NAME!}
      >
        <CustomSearchbox />
        <CustomHits />
      </InstantSearch>
    </div>
  );
};

export default Search;
