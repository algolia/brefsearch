'use client';

import { Hits, InstantSearch, SearchBox, Stats } from 'react-instantsearch';
import { liteClient as algoliasearch } from 'algoliasearch/lite';

const searchClient = algoliasearch(
  'O3F8QXYK6R',
  '6a47b9b62c58a7a4cd2338f095630b15',
);

const Hit = ({ hit }) => (
  <div className="p-4 border-b hover:bg-gray-50">
    <h2 className="text-xl font-medium">{hit.name}</h2>
    <p className="text-gray-600 mt-2">{hit.description}</p>
  </div>
);

/**
 *
 */
export default function SearchComponent() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Recherche</h1>

      <InstantSearch searchClient={searchClient} indexName="brefsearch">
        <div className="mb-4">
          <SearchBox
            placeholder="Rechercher..."
            classNames={{
              root: 'mb-4',
              form: 'relative',
              input:
                'w-full p-4 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              submit: 'absolute right-4 top-1/2 -translate-y-1/2',
              reset: 'hidden',
            }}
          />
          <Stats
            classNames={{
              root: 'text-sm text-gray-500',
            }}
          />
        </div>

        <Hits
          hitComponent={Hit}
          classNames={{
            list: 'divide-y divide-gray-200 border rounded-lg',
          }}
        />
      </InstantSearch>
    </div>
  );
}
