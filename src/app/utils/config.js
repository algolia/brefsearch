const defaultConfig = {
  appId: 'O3F8QXYK6R',
  indexName: 'brefsearch',
  indexNamePopularity: 'brefsearch_popularity',
  searchApiKey: '6a47b9b62c58a7a4cd2338f095630b15',
};

// Note: Next will replace the process.env.NEXT_PUBLIC_* variables at build time
const envConfig = {
  appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  indexName: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME,
  indexNamePopularity: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME_POPULARITY,
  searchApiKey: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY,
};

/**
 * Retrieves a configuration value by key, checking environment config first, then falling back to default config
 * @param {string} key - The configuration key to retrieve
 * @returns {*} The configuration value for the given key, or undefined if not found
 */
function value(key) {
  return envConfig[key] || defaultConfig[key];
}

export const config = {
  appId: value('appId'),
  indexName: value('indexName'),
  indexNamePopularity: value('indexNamePopularity'),
  searchApiKey: value('searchApiKey'),
  configure: {
    hitsPerPage: 18,
  },
};
