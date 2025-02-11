import path from 'node:path';
import { absolute, glob, readJson, writeJson } from 'firost';
import { pMap } from 'golgoth';
import { convertVtt } from '../lib/convertVtt.js';

const episodes = await glob('*.json', {
  cwd: absolute('<gitRoot>/data/episodes'),
});

await pMap(episodes, async (episodePath) => {
  const episode = await readJson(episodePath);
  const basename = path.basename(episodePath, '.json');

  const vttPath = absolute(`<gitRoot>/data/vtts/${basename}.vtt`);
  const lines = await convertVtt(vttPath);

  episode.lines = lines;

  await writeJson(episode, episodePath);
});
