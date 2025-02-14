import path from 'node:path';
import { absolute, glob, readJson, spinner, writeJson } from 'firost';
import { _, pMap } from 'golgoth';
import imoen from 'imoen';

const episodes = await glob('*.json', {
  cwd: absolute('<gitRoot>/data/episodes'),
});
const progress = spinner(episodes.length);

/**
 * Loop through all episode metadata, and for each line of the episode, create
 * a new record on disk, that includes hard-coded LQIP for the thumbnail image
 **/
const concurrencyEpisodes = 4;
const concurrencyLines = 1;
await pMap(
  episodes,
  async (episodePath) => {
    const episode = await readJson(episodePath);
    const basename = path.basename(episodePath, '.json');
    const videoId = episode.video.id;
    progress.tick(episode.episode.name);

    await pMap(
      episode.lines,
      async (line, lineIndex) => {
        const paddedIndex = _.padStart(line.start, 3, '0');
        const thumbnailBasename = `${basename}/${paddedIndex}.png`;
        const thumbnailPath = absolute(
          `<gitRoot>/../brefsearch-images/images/${thumbnailBasename}`,
        );

        const start = line.start;
        const paddedStart = _.padStart(start, 3, '0');
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}&t=${start}s`;
        const thumbnailUrl = `https://assets.pixelastic.com/brefsearch/${basename}/${paddedIndex}.png`;
        const gifUrl = `https://assets.pixelastic.com/brefsearch/${basename}/gif/${paddedIndex}.gif`;

        const { hash, height, lqip, width } = await imoen(thumbnailPath);

        const record = {
          episode: {
            videoId: episode.video.id,
            name: episode.episode.name,
            index: episode.episode.index,
            slug: episode.episode.slug,
            durationHuman: episode.duration.human,
            durationInSeconds: episode.duration.inSeconds,
          },
          line: {
            index: lineIndex,
            start: line.start,
            end: line.end,
            content: line.content,
            url: videoUrl,
          },
          thumbnail: {
            hash,
            height,
            lqip,
            width,
            url: thumbnailUrl,
            gifUrl,
          },
        };

        const recordFilepath = absolute(
          `<gitRoot>/data/records/${basename}/${paddedStart}.json`,
        );

        await writeJson(record, recordFilepath);
      },
      { concurrency: concurrencyLines },
    );
  },
  { concurrency: concurrencyEpisodes },
);
progress.success('Done');
