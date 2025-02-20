/* eslint-disable no-unused-vars */
import path from 'node:path';
import {
  absolute,
  exists,
  glob,
  move,
  read,
  readJson,
  write,
  writeJson,
} from 'firost';
import { _, pMap } from 'golgoth';
import { convertVtt } from './convertVtt.js';

const list = await glob('*.json', {
  cwd: absolute('<gitRoot>/data/episodes/'),
});

const concurrency = 1;
await pMap(
  list,
  async (filepath) => {
    const item = await readJson(filepath);
    const basename = path.basename(filepath, '.json');
    const season = basename[2];
    item.episode.season = _.parseInt(season);

    await writeJson(item, filepath);
  },
  { concurrency },
);
