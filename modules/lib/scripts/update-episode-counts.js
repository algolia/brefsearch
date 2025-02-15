import path from 'node:path';
import {
  absolute,
  exists,
  glob,
  mkdirp,
  readJson,
  run,
  spinner,
  writeJson,
} from 'firost';
import { _, pMap } from 'golgoth';
import { convertCounts } from '../convertCounts.js';

const episodes = await glob('*.json', {
  cwd: absolute('<gitRoot>/data/episodes'),
});
const episodeCount = episodes.length;

/**
 * Read through all the episode metadata, and for each try to get popularity
 * metrics, like view count, like count, comment count and the heatmap
 **/
const progress = spinner();
const concurrency = 1;
await pMap(
  episodes,
  async (episodePath, episodeIndex) => {
    const episode = await readJson(episodePath);
    const videoId = episode.video.id;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const episodeSlug = path.basename(episodePath, '.json');

    const rawCountPath = absolute(
      `<gitRoot>/data/counts/raw/${episodeSlug}.json`,
    );

    if (!(await exists(rawCountPath))) {
      progress.tick(
        `[${episodeIndex}/${episodeCount}] ${episodeSlug} / Downloading metadata`,
      );

      await mkdirp(path.dirname(rawCountPath));

      const downloadCommand = [
        'yt-dlp',
        '--cookies-from-browser firefox',
        '-j',
        videoUrl,
        `> ${rawCountPath}`,
      ].join(' ');
      await run(downloadCommand, { shell: true });
    }

    const countPath = absolute(`<gitRoot>/data/counts/${episodeSlug}.json`);
    if (!(await exists(countPath))) {
      progress.tick(
        `[${episodeIndex}/${episodeCount}] ${episodeSlug} / Extracting metadata`,
      );

      await mkdirp(path.dirname(countPath));

      const counts = await convertCounts(rawCountPath);

      delete episode.video.viewcount;
      episode.video.viewCount = counts.viewCount;
      episode.video.likeCount = counts.likeCount;
      episode.video.commentCount = counts.commentCount;
      episode.video.isAgeRestricted = counts.isAgeRestricted;

      _.each(episode.lines, (line) => {
        line.heatValue = findHeatValue(counts.heatmap, line);
      });

      await writeJson(episode, episodePath);
    }
  },
  { concurrency },
);
progress.success('All popularity metrics extracted');

/**
 * Return a score between 1 and 100 for a given line
 * @param {Array} heatmap Array of heatmap
 * @param {object} line Line object
 * @returns {number} Number between 1 and 100
 */
function findHeatValue(heatmap, line) {
  return _.chain(heatmap)
    .filter((item) => {
      const hasBeginning = line.start >= item.start && line.start <= item.end;
      const hasEnding = line.end >= item.start && line.end <= item.end;
      return hasBeginning || hasEnding;
    })
    .map('value')
    .mean()
    .round()
    .value();
}
