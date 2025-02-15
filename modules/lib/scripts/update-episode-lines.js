import path from 'node:path';
import { absolute, glob, readJson, spinner, writeJson } from 'firost';
import { pMap } from 'golgoth';
import { convertVtt } from '../convertVtt.js';

const episodes = await glob('*.json', {
  cwd: absolute('<gitRoot>/data/episodes'),
});
const progress = spinner(episodes.length);
const concurrency = 4;

/**
 * Take all .vtt files, parse them, and convert them into individual lines.
 * Then, add this lines array to the episode metadata .json file
 **/
await pMap(
  episodes,
  async (episodePath) => {
    const episode = await readJson(episodePath);
    const basename = path.basename(episodePath, '.json');

    const vttPath = absolute(`<gitRoot>/data/vtts/${basename}.vtt`);
    const lines = await convertVtt(vttPath);

    episode.lines = lines;
    progress.tick(basename);

    await writeJson(episode, episodePath);
  },
  { concurrency },
);
progress.success('Done');
