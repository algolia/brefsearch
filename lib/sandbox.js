import path from 'node:path';
import {
  absolute,
  exists,
  glob,
  move,
  read,
  readJson,
  writeJson,
} from 'firost';
import { _, pMap } from 'golgoth';
import { convertVtt } from './convertVtt.js';

const episodes = await glob('*.vtt', {
  cwd: absolute('<gitRoot>/data/vtts/export/'),
});

await pMap(episodes, async (filepath) => {
  const slug = _.chain(filepath)
    .thru(path.basename)
    .replace('.mp3.vtt', '')
    .split(' ')
    .slice(2)
    .join(' ')
    .camelCase()
    .value();
  const index = _.chain(filepath)
    .thru(path.basename)
    .split(' ')
    .first()
    .value();
  const newFilepath = absolute(`<gitRoot>/data/vtts/${index}_${slug}.vtt`);
  await move(filepath, newFilepath);
  console.info({ filepath, newFilepath });
});
