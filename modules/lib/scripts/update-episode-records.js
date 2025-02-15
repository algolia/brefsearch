import path from 'node:path';
import {
  absolute,
  exists,
  error as firostError,
  glob,
  readJson,
  spinner,
  writeJson,
} from 'firost';
import { _, pMap } from 'golgoth';
import { dimensions, hash, lqip } from 'imoen';

const episodes = await glob('*.json', {
  cwd: absolute('<gitRoot>/data/episodes'),
});
const progress = spinner(episodes.length);

/**
 * Loop through all episode metadata, and for each line of the episode, create
 * a new record on disk, that includes hard-coded LQIP for the thumbnail image
 **/
const concurrencyEpisodes = 8;
const concurrencyLines = 1;

await pMap(
  episodes,
  async (episodePath) => {
    const episode = await readJson(episodePath);
    const videoId = episode.video.id;
    const episodeName = episode.episode.name;
    progress.tick(`Records: ${episodeName}`);

    const episodeSlug = path.basename(episodePath, '.json');
    await pMap(
      episode.lines,
      async (line, lineIndex) => {
        const start = line.start;
        const lineSlug = _.padStart(start, 3, '0');

        const thumbnailPath = absolute(
          `<gitRoot>/../brefsearch-images/images/${episodeSlug}/${lineSlug}.png`,
        );

        if (!(await exists(thumbnailPath))) {
          throw firostError(
            'BREF_UPDATE_RECORDS_NO_THUMBNAIL',
            `Could not find a thumbnail for ${episodeSlug}/${lineSlug}.png`,
          );
        }

        const recordFilepath = absolute(
          `<gitRoot>/data/records/${episodeSlug}/${lineSlug}.json`,
        );
        const existingRecord = await readRecord(recordFilepath);

        // Update thumbnail data if thumbnail image is updated
        const thumbnailData = { ...existingRecord?.thumbnail };
        const existingThumbnailHash = thumbnailData.hash;
        const newThumbnailHash = await hash(thumbnailPath);
        if (existingThumbnailHash != newThumbnailHash) {
          const { width, height } = await dimensions(thumbnailPath);
          const thumbnailLqip = await lqip(thumbnailPath);

          thumbnailData.hash = newThumbnailHash;
          thumbnailData.width = width;
          thumbnailData.height = height;
          thumbnailData.lqip = thumbnailLqip;
        }
        thumbnailData.url = `https://assets.pixelastic.com/brefsearch/${episodeSlug}/${lineSlug}.png`;
        thumbnailData.gifUrl = `https://assets.pixelastic.com/brefsearch/${episodeSlug}/gif/${lineSlug}.gif`;

        const videoUrl = `https://www.youtube.com/watch?v=${videoId}&t=${start}s`;

        const newRecord = {
          episode: {
            videoId: episode.video.id,
            viewCount: episode.video.viewCount,
            likeCount: episode.video.likeCount,
            commentCount: episode.video.commentCount,

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
            heatValue: line.heatValue,
            url: videoUrl,
          },
          thumbnail: thumbnailData,
        };

        if (_.isEqual(existingRecord, newRecord)) {
          return;
        }

        await writeJson(newRecord, recordFilepath);
      },
      { concurrency: concurrencyLines },
    );
  },
  { concurrency: concurrencyEpisodes },
);
progress.success('All records generated');

/**
 * Read a JSON record file. Returns {} if file does not exist or is not JSON
 * @param {string} recordPath Path to the record fileo
 * @returns {object} Record object
 */
async function readRecord(recordPath) {
  if (!(await exists(recordPath))) {
    return {};
  }

  try {
    return await readJson(recordPath);
  } catch (_err) {
    return {};
  }
}
