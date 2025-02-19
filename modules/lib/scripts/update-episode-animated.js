import path from 'node:path';
import { absolute, exists, glob, mkdirp, readJson, run, spinner } from 'firost';
import { _, pMap } from 'golgoth';

const episodes = await glob('*.json', {
  cwd: absolute('<gitRoot>/data/episodes'),
});
const episodeCount = episodes.length;

/**
 * Read through all the episode metadata, and their lines and generate a small
 * video for each line of the transcript
 **/
const progress = spinner();
const concurrency = 1;
await pMap(
  episodes,
  async (episodePath, episodeIndex) => {
    const episode = await readJson(episodePath);
    const episodeName = episode.episode.name;
    const basename = path.basename(episodePath, '.json');
    const videoPath = absolute(`<gitRoot>/tmp/mp4/${basename}.mp4`);
    const lines = episode.lines;
    const lineCount = lines.length;

    await pMap(
      lines,
      async (line, lineIndex) => {
        progress.tick(
          `[${episodeIndex}/${episodeCount}] Animated: ${episodeName} (line ${lineIndex}/${lineCount})`,
        );

        const timestamp = line.start;
        const paddedIndex = _.padStart(timestamp, 3, '0');
        const duration = 2;
        const scale = 320;
        const compression = 23; // Low score means high quality

        const animatedPath = absolute(
          `<gitRoot>/../brefsearch-images/animated/${basename}/${paddedIndex}.mp4`,
        );

        if (await exists(animatedPath)) {
          return;
        }

        await mkdirp(path.dirname(animatedPath));

        const command = [
          'ffmpeg',
          '-y -loglevel error',
          `-ss ${line.start}`,
          `-t ${duration}`,
          `-i "${videoPath}"`,
          `-vf "scale=${scale}:-1"`,
          '-c:v libx264',
          `-crf ${compression}`,
          '-preset medium',
          '-movflags +faststart',
          `-an "${animatedPath}"`,
        ].join(' ');

        await run(command, { shell: true });
      },
      { concurrency },
    );
  },
  { concurrency },
);
progress.success('All animated preview generated!');
