import path from 'node:path';
import { absolute, glob, move, read, readJson, writeJson } from 'firost';
import { _, pMap } from 'golgoth';
import { convertVtt } from './convertVtt.js';

const vtts = await glob('*.json', {
  cwd: absolute('<gitRoot>/data/episodes'),
});

await pMap(vtts, async (filepath) => {
  const content = await readJson(filepath);
  const slug = content.episode.slug;
  const index = _.padStart(content.episode.index, 2, '0');

  const newFilepath = absolute(`<gitRoot>/data/episodes/${index}_${slug}.json`);
  await move(filepath, newFilepath);

  console.info({ filepath, newFilepath });
});
