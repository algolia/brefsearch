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

    const countPath = absolute(`<gitRoot>/data/counts/${episodeSlug}.json`);

    if (!(await exists(countPath))) {
      progress.tick(
        `[${episodeIndex}/${episodeCount}] ${episodeSlug} / Downloading metadata`,
      );

      await mkdirp(path.dirname(countPath));

      const downloadCommand = [
        'yt-dlp',
        '--cookies-from-browser firefox',
        '-j',
        videoUrl,
        `> ${countPath}`,
      ].join(' ');
      await run(downloadCommand, { shell: true });
    }

    progress.tick(
      `[${episodeIndex}/${episodeCount}] Counts: ${episodeSlug} / Extracting metadata`,
    );

    await mkdirp(path.dirname(countPath));

    const counts = await convertCounts(countPath);

    delete episode.video.viewcount;
    episode.video.viewCount = counts.viewCount;
    episode.video.likeCount = counts.likeCount;
    episode.video.commentCount = counts.commentCount;

    _.each(episode.lines, (line) => {
      line.heatValue = getHeatValue(counts.heatmap, line);
    });

    episode.lines = setHeatBuckets(episode.lines, 5);

    await writeJson(episode, episodePath);
  },
  { concurrency },
);
progress.success('All count metrics extracted');

/**
 * Return a score between 1 and 100 for a given line
 * @param {Array} heatmap Array of heatmap
 * @param {object} line Line object
 * @returns {number} Number between 1 and 100
 */
function getHeatValue(heatmap, line) {
  return (
    _.chain(heatmap)
      .filter((item) => {
        const hasBeginning = line.start >= item.start && line.start <= item.end;
        const hasEnding = line.end >= item.start && line.end <= item.end;
        return hasBeginning || hasEnding;
      })
      .map('value')
      .mean()
      .round()
      .value() || 0
  );
}

/**
 * Add a heatBucket key to each line.
 * We split the lines into {bucketCount} buckets of equal size.
 * Lines in bucket one are the most replayed, then bucket two slightly less
 * replayed, etc, up until the last bucket
 * @param {string} lines All lines of the episode
 * @param {number} bucketCount The number of bucket to split it into
 * @returns {number} A bucket number. The higher the value, the most replayed
 * the line is
 **/
function setHeatBuckets(lines, bucketCount) {
  const heatValues = _.chain(lines).map('heatValue').sort().value();

  const thresholds = _.chain(_.range(1, bucketCount))
    .map((index) => {
      const multiplier = Math.floor((index * 100) / bucketCount) / 100;
      const upperLimit = heatValues[Math.floor(multiplier * lines.length)];
      return {
        index,
        upperLimit,
      };
    })
    .concat([{ index: bucketCount, upperLimit: 100 }])
    .value();

  const updatedLines = _.map(lines, (line) => {
    const heatValue = line.heatValue;
    const bucketNumber = _.find(thresholds, ({ upperLimit }) => {
      return heatValue <= upperLimit;
    });
    line.heatBucket = bucketNumber?.index;
    return line;
  });

  return updatedLines;
}
