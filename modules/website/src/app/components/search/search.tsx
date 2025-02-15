'use client';

import { searchClient } from '@/app/utils/algolia';
import { Configure, InstantSearch } from 'react-instantsearch';
import CustomHits from './hits';
import CustomSearchbox from './searchbox';

const Search = () => {
  return (
    <div className="grid p-8">
      <InstantSearch
        searchClient={searchClient}
        indexName={process.env.NEXT_PUBLIC_ALG_INDEX_NAME!}
      >
        <Configure hitsPerPage={18} />
        <CustomSearchbox />
        <CustomHits />
      </InstantSearch>
    </div>
  );
};

export default Search;
