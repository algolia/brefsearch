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
    customRanking: ['asc(episode.index)', 'asc(line.index)'],
    attributesForFaceting: [
      'searchable(episode.name)',
      'episode.index',
      'episode.videoId',
    ],
    attributeForDistinct: 'episode.videoId',
    distinct: true,
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
