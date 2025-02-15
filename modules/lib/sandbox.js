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
    const episodeName = item.episode.name;
    if (!_.startsWith(episodeName, 'Bref. ')) {
      item.episode.name = `Bref. ${episodeName}`;
    }
    await writeJson(item, filepath);
    // console.info(item);
  },
  { concurrency },
);
