export const config = {
  appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || 'O3F8QXYK6R',
  searchApiKey:
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY ||
    '6a47b9b62c58a7a4cd2338f095630b15',
  indexName: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'brefsearch',
  indexNamePopularity:
    process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME_POPULARITY ||
    'brefsearch_popularity',
};
