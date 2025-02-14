import path from 'node:path';
import { absolute, exists, glob, mkdirp, readJson, run, spinner } from 'firost';
import { _, pMap } from 'golgoth';

const episodes = await glob('*.json', {
  cwd: absolute('<gitRoot>/data/episodes'),
});
const episodeCount = episodes.length;

/**
 * Read through all the episode metadata, and their lines and generate a small
 * animated gif for each line of the transcript
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
        const timestamp = line.start;
        const paddedIndex = _.padStart(timestamp, 3, '0');
        const palettePath = absolute(
          `<gitRoot>/../brefsearch-images/images/${basename}/gif/palettes/${paddedIndex}.png`,
        );
        await mkdirp(path.dirname(palettePath));
        const gifPath = absolute(
          `<gitRoot>/../brefsearch-images/images/${basename}/gif/${paddedIndex}.gif`,
        );
        await mkdirp(path.dirname(gifPath));
        progress.tick(
          `[${episodeIndex}/${episodeCount}] ${episodeName} (line ${lineIndex}/${lineCount})`,
        );
        if (await exists(gifPath)) {
          return;
        }

        const duration = 2;
        // Math.max(Math.min(line.end - line.start + 1, 3), 1);
        const fps = 12;
        const scale = 320;
        // const maxColors = 256;

        // const command = [
        //   'ffmpeg',
        //   '-y -loglevel error',
        //   `-ss ${line.start}`,
        //   `-i "${videoPath}"`,
        //   `-t ${duration}`,
        //   `-vf "fps=${fps},scale=${scale}:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=${maxColors}:stats_mode=single[p];[s1][p]paletteuse=dither=none"`,
        //   `"${gifPath}"`,
        // ].join(' ');
        // await run(command, { shell: true });

        const stepOne = [
          'ffmpeg',
          '-y -loglevel error',
          `-ss ${line.start}`,
          `-i "${videoPath}"`,
          `-t ${duration}`,
          `-vf "fps=${fps},scale=${scale}:-1:flags=lanczos,palettegen"`,
          `"${palettePath}"`,
        ].join(' ');
        await run(stepOne, { shell: true });

        // const stepTwo = [
        //   'ffmpeg',
        //   '-y -loglevel error',
        //   `-ss ${line.start}`,
        //   `-i "${videoPath}"`,
        //   `-i "${palettePath}"`,
        //   `-t ${duration}`,
        //   `-filter_complex "fps=${fps},scale=${scale}:-1:flags=lanczos[x];[x][1:v]paletteuse"`,
        //   `-y "${gifPath}"`,
        // ].join(' ');
        // await run(stepTwo, { shell: true });
      },
      { concurrency },
    );
  },
  { concurrency },
);
progress.success('Finally!');
