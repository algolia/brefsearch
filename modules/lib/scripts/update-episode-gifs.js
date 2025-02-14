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
        const duration = 2;
        const fps = 12;
        const scale = 320;
        // const maxColors = 256;

        const palettePath = absolute(
          `<gitRoot>/../brefsearch-images/images/${basename}/gif/palettes/${paddedIndex}.png`,
        );
        if (!(await exists(palettePath))) {
          await mkdirp(path.dirname(palettePath));
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
        }

        const gifPath = absolute(
          `<gitRoot>/../brefsearch-images/images/${basename}/gif/${paddedIndex}.gif`,
        );
        if (!(await exists(gifPath))) {
          await mkdirp(path.dirname(gifPath));
          const stepTwo = [
            'ffmpeg',
            '-y -loglevel error',
            `-ss ${line.start}`,
            `-i "${videoPath}"`,
            `-i "${palettePath}"`,
            `-t ${duration}`,
            `-filter_complex "fps=${fps},scale=${scale}:-1:flags=lanczos[x];[x][1:v]paletteuse"`,
            `-y "${gifPath}"`,
          ].join(' ');
          await run(stepTwo, { shell: true });
        }

        progress.tick(
          `[${episodeIndex}/${episodeCount}] ${episodeName} (line ${lineIndex}/${lineCount})`,
        );

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
      },
      { concurrency },
    );
  },
  { concurrency },
);
progress.success('Finally!');
