import path from 'node:path';
import { absolute, exists, glob, mkdirp, readJson, run, spinner } from 'firost';
import { pMap } from 'golgoth';

const episodes = await glob('01*.json', {
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

      const downloadCommand = ['yt-dlp -j', videoUrl, `> ${rawCountPath}`].join(
        ' ',
      );
      await run(downloadCommand, { shell: true });
    }

    // On regarde chaque épisode
    // On trouve l'id de la video
    // On appelle yt-dlp pour avoir toutes les data
    // On extraie ce qui nous intéresse, et on le store sur disque, de manière
    // brute
    // On ajoute aux épisodes
  },
  { concurrency },
);
progress.success('All popularity metrics extracted');
