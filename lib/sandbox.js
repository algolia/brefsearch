import path from 'node:path';
import { absolute, glob, move, read, readJson, writeJson } from 'firost';
import { _, pMap } from 'golgoth';
import { convertVtt } from './convertVtt.js';

const vtts = await glob('01*.vtt', {
  cwd: absolute('<gitRoot>/data/vtts'),
});

await pMap(vtts, async (filepath) => {
  const lines = await convertVtt(filepath);
  console.info(lines);
});
