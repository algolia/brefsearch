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

const restrictedList = [
  'br82-adJ0FU',
  '9zk0TrOU_cI',
  'KtLp-gLL0Aw',
  'mEu0q3Slzj0',
  'BJoEGR47rk0',
  'vrbqkwd6Zi8',
];

const concurrency = 1;
await pMap(
  list,
  async (filepath) => {
    const item = await readJson(filepath);
    const basename = path.basename(filepath, '.json');
    const isAgeRestricted = _.includes(restrictedList, item.video.id);

    item.video.isAgeRestricted = isAgeRestricted;
    if (isAgeRestricted) {
      console.info(item.episode);
    }

    await writeJson(item, filepath);
  },
  { concurrency },
);
