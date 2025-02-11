import { absolute, read, writeJson } from 'firost';
import { _, pMap } from 'golgoth';

const raw = await read(absolute('<gitRoot>/data/raw.txt'));
const lines = _.split(raw, '\n');

await pMap(lines, async (line) => {
  const [videoId, _episodeRawIndex, episodeRawName, episodeDurationHuman] =
    _.split(line, '▮');
  const episodeIndex = _.chain(episodeRawName)
    .split(' ')
    .first()
    .parseInt()
    .value();
  const episodeSlug = _.chain(episodeRawName)
    .split(' ')
    .slice(2)
    .join(' ')
    .camelCase()
    .value();
  const episodeName = _.chain(episodeRawName)
    .split(' ')
    .slice(3)
    .join(' ')
    .value();
  const durationSplit = _.split(episodeDurationHuman, ':');
  const durationInSeconds =
    _.parseInt(durationSplit[0]) * 60 + _.parseInt(durationSplit[1]);

  const content = {
    duration: {
      human: episodeDurationHuman,
      inSeconds: durationInSeconds,
    },
    video: {
      id: videoId,
    },
    episode: {
      index: episodeIndex,
      slug: episodeSlug,
      name: episodeName,
    },
  };

  const filepath = absolute(`<gitRoot>/data/records/${episodeSlug}.json`);
  await writeJson(content, filepath);
});
