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
    searchableAttributes: ['line.content', 'episode.name'],
    attributesForFaceting: [
      'searchable(episode.name)',
      'episode.index',
      'episode.videoId',
    ],
    customRanking: ['asc(episode.index)', 'asc(line.index)'],
    attributeForDistinct: 'episode.videoId',
    distinct: true,
  };

  indexing.verbose();
  indexing.config({
    batchMaxSize: 100,
  });

  const files = await glob('**/*.json', {
    cwd: absolute('<packageRoot>/data/records'),
  });
  const data = await pMap(files, async (filepath) => {
    return await readJson(filepath);
  });
  await indexing.fullAtomic(credentials, data, settings);
})();
