import indexing from 'algolia-indexing';
import { absolute, glob, readJson } from 'firost';
import { pMap } from 'golgoth';
import config from '../config.js';

(async function () {
  const credentials = {
    appId: config.appId,
    indexName: config.indexName,
    apiKey: config.adminApiKey,
  };
  const settings = {
    searchableAttributes: ['unordered(line.content)', 'episode.name'],
    // By default, sort chronologically
    customRanking: [
      'asc(episode.season)',
      'asc(episode.index)',
      'asc(line.index)',
    ],
    attributesForFaceting: [
      'searchable(episode.name)',
      'episode.isAgeRestricted',
      'episode.index',
      'episode.videoId',
    ],
    distinct: true,
    attributeForDistinct: 'episode.videoId',
    attributesToSnippet: ['line.content:15'],
    replicas: {
      // Alternatively, search by popularity
      popularity: {
        customRanking: [
          'asc(episode.season)',
          'desc(episode.viewCount)',
          'desc(line.heatBucket)',
          'desc(line.index)',
        ],
      },
    },
    // TODO: Synonym nin nin nin to na na na
    // TODO: Synonym 3000 to Trois mille
  };

  indexing.verbose();
  indexing.config({
    batchMaxSize: 100,
  });

  const files = await glob('**/*.json', {
    cwd: absolute('<gitRoot>/data/records'),
  });
  const data = await pMap(files, async (filepath) => {
    return await readJson(filepath);
  });
  await indexing.fullAtomic(credentials, data, settings);
})();
