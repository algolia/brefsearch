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

const list = await glob('*.vtt', {
  cwd: absolute('<gitRoot>/data/vtts/'),
});

await pMap(list, async (filepath) => {
  const item = await read(filepath);

  const newContent = _.chain(item)
    .replace(/Maude/g, 'Maud')
    .replace(/Kevin/g, 'Keyvan')
    .value();

  await write(newContent, filepath);
});
