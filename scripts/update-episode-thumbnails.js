import path from 'node:path';
import { absolute, glob, mkdirp, readJson, run, spinner } from 'firost';
import { _, pMap } from 'golgoth';

const episodes = await glob('*.json', {
  cwd: absolute('<gitRoot>/data/episodes'),
});

/**
 * Read through all the episode metadata, and their lines. For each line,
 * extract a thumbnail from the video at that exact timestamp
 * TODO: Make thumbnail names based on the second it appears, rather than its
 * index in the list.
 **/
const progress = spinner(episodes.length);
const concurrency = 1;
await pMap(
  episodes,
  async (episodePath) => {
    const episode = await readJson(episodePath);
    const basename = path.basename(episodePath, '.json');
    const videoPath = absolute(`<gitRoot>/tmp/mp4/${basename}.mp4`);
    const lines = episode.lines;
    progress.tick(episode.episode.name);

    await pMap(
      lines,
      async (line, index) => {
        const timestamp = line.start;
        const paddedIndex = _.padStart(index, 2, '0');
        const thumbnailPath = absolute(
          `<gitRoot>/data/thumbnails/${basename}/${paddedIndex}.png`,
        );
        await mkdirp(path.dirname(thumbnailPath));
        const command = [
          'ffmpeg',
          '-y -loglevel error',
          `-ss "${timestamp}"`,
          `-i "${videoPath}"`,
          '-vframes 1',
          '-q:v 2',
          `"${thumbnailPath}"`,
        ].join(' ');

        await run(command, { shell: true });
      },
      { concurrency },
    );
  },
  { concurrency },
);
progress.success('Finally!');
