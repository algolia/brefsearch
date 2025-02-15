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

const viewcountRaw = await read('<gitRoot>/tmp/viewcount.txt');
const viewcount = {};
_.chain(viewcountRaw)
  .split('\n')
  .each((line) => {
    const [id, count] = line.split('▮');
    viewcount[id] = count;
  })
  .value();
console.info(viewcount);

const concurrency = 1;
await pMap(
  list,
  async (filepath) => {
    const item = await readJson(filepath);
    const basename = path.basename(filepath, '.json');
    item.video.viewcount = _.parseInt(viewcount[item.video.id]);
    await writeJson(item, filepath);
    console.info(item);
  },
  { concurrency },
);
