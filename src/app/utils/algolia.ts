import { algoliasearch } from 'algoliasearch';
import { config } from './config.js';

export const searchClient = algoliasearch(
  config.appId,
  config.searchApiKey,
) as any;
